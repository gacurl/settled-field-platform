import net from "node:net";
import tls from "node:tls";

type SmtpConfig = {
  from: string;
  host: string;
  port: number;
  recipient: string;
  password: string;
  user: string;
};

type SmtpMessage = {
  subject: string;
  text: string;
};

type SmtpResponse = {
  code: number;
  lines: string[];
};

type SmtpSocket = net.Socket | tls.TLSSocket;

class SmtpConnection {
  private buffer = "";
  private socket: SmtpSocket;

  constructor(socket: SmtpSocket) {
    this.socket = socket;
  }

  async readResponse(): Promise<SmtpResponse> {
    const existing = this.tryParseResponse();

    if (existing) {
      return existing;
    }

    return new Promise<SmtpResponse>((resolve, reject) => {
      const cleanup = () => {
        this.socket.off("data", onData);
        this.socket.off("error", onError);
        this.socket.off("close", onClose);
      };

      const onData = (chunk: Buffer | string) => {
        this.buffer += chunk.toString();
        const response = this.tryParseResponse();

        if (response) {
          cleanup();
          resolve(response);
        }
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const onClose = () => {
        cleanup();
        reject(new Error("SMTP connection closed unexpectedly"));
      };

      this.socket.on("data", onData);
      this.socket.on("error", onError);
      this.socket.on("close", onClose);
    });
  }

  async sendCommand(command: string, expectedCodes: number[]) {
    await this.write(`${command}\r\n`);
    const response = await this.readResponse();

    if (!expectedCodes.includes(response.code)) {
      throw new Error(
        `SMTP command failed (${response.code}): ${response.lines.join(" | ")}`,
      );
    }

    return response;
  }

  async write(value: string) {
    await new Promise<void>((resolve, reject) => {
      this.socket.write(value, (error?: Error | null) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  async upgradeToTls(host: string) {
    const secureSocket = tls.connect({
      servername: host,
      socket: this.socket,
    });

    await new Promise<void>((resolve, reject) => {
      secureSocket.once("secureConnect", resolve);
      secureSocket.once("error", reject);
    });

    this.socket = secureSocket;
  }

  async close() {
    await this.write("QUIT\r\n").catch(() => undefined);
    this.socket.end();
  }

  private tryParseResponse(): SmtpResponse | null {
    const lines = this.buffer.split("\r\n");

    if (lines.length < 2) {
      return null;
    }

    const completeLines = lines.slice(0, -1);
    const responseLines: string[] = [];

    for (let index = 0; index < completeLines.length; index += 1) {
      const line = completeLines[index];

      if (!/^\d{3}[- ]/.test(line)) {
        continue;
      }

      responseLines.push(line);

      if (line[3] === " ") {
        this.buffer = `${completeLines.slice(index + 1).join("\r\n")}\r\n${lines.at(-1) ?? ""}`;

        return {
          code: Number(line.slice(0, 3)),
          lines: responseLines,
        };
      }
    }

    return null;
  }
}

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT?.trim() ?? "");
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const recipient = process.env.OWNER_NOTIFICATION_EMAIL?.trim();

  if (!host || !port || !user || !password || !from || !recipient) {
    return null;
  }

  return {
    from,
    host,
    port,
    recipient,
    password,
    user,
  };
}

function createMessage(config: SmtpConfig, message: SmtpMessage) {
  const escapedBody = message.text
    .replace(/\r?\n/g, "\r\n")
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");

  return [
    `From: ${config.from}`,
    `To: ${config.recipient}`,
    `Subject: ${message.subject}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    escapedBody,
    ".",
  ].join("\r\n");
}

async function openConnection(config: SmtpConfig) {
  const socket =
    config.port === 465
      ? tls.connect({
          host: config.host,
          port: config.port,
          servername: config.host,
        })
      : net.connect({
          host: config.host,
          port: config.port,
        });

  await new Promise<void>((resolve, reject) => {
    socket.once(config.port === 465 ? "secureConnect" : "connect", resolve);
    socket.once("error", reject);
  });

  return new SmtpConnection(socket);
}

export async function sendOwnerNotificationEmail(message: SmtpMessage) {
  const config = getSmtpConfig();

  if (!config) {
    return false;
  }

  const connection = await openConnection(config);

  try {
    const greeting = await connection.readResponse();

    if (greeting.code !== 220) {
      throw new Error(`SMTP greeting failed (${greeting.code})`);
    }

    const ehloResponse = await connection.sendCommand(
      "EHLO settled-on-the-field.local",
      [250],
    );

    const supportsStartTls = ehloResponse.lines.some((line) =>
      line.toUpperCase().includes("STARTTLS"),
    );

    if (config.port !== 465 && supportsStartTls) {
      await connection.sendCommand("STARTTLS", [220]);
      await connection.upgradeToTls(config.host);
      await connection.sendCommand("EHLO settled-on-the-field.local", [250]);
    }

    const authValue = Buffer.from(
      `\u0000${config.user}\u0000${config.password}`,
      "utf8",
    ).toString("base64");

    await connection.sendCommand(`AUTH PLAIN ${authValue}`, [235]);
    await connection.sendCommand(`MAIL FROM:<${config.from}>`, [250]);
    await connection.sendCommand(`RCPT TO:<${config.recipient}>`, [250, 251]);
    await connection.sendCommand("DATA", [354]);
    await connection.write(`${createMessage(config, message)}\r\n`);

    const dataResponse = await connection.readResponse();

    if (dataResponse.code !== 250) {
      throw new Error(
        `SMTP DATA failed (${dataResponse.code}): ${dataResponse.lines.join(" | ")}`,
      );
    }

    return true;
  } finally {
    await connection.close().catch(() => undefined);
  }
}
