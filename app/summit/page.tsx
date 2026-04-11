import Link from "next/link";

export default function SummitPage() {
  return (
    <>
      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h1
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "2.5rem",
            lineHeight: 1.1,
          }}
        >
          Settled on the Field Summit
        </h1>
        <p
          style={{
            maxWidth: "42rem",
            margin: "0 0 var(--space-6)",
            color: "var(--color-accent)",
          }}
        >
          A focused event for people navigating transition and looking for a
          clearer next move, grounded conversations, and practical direction.
        </p>
        <Link
          href="/register"
          style={{
            display: "inline-block",
            padding: "var(--space-4) var(--space-6)",
            background: "var(--color-primary)",
            color: "var(--color-background)",
          }}
        >
          Register Now
        </Link>
      </section>

      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "1.5rem",
          }}
        >
          Who It&apos;s For
        </h2>
        <ul
          style={{
            margin: "0",
            paddingLeft: "1.25rem",
            color: "var(--color-accent)",
          }}
        >
          <li>Athletes preparing for life beyond the current season</li>
          <li>Veterans navigating a new civilian chapter</li>
          <li>Transitioning professionals looking for renewed direction</li>
        </ul>
      </section>

      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "1.5rem",
          }}
        >
          What You&apos;ll Get
        </h2>
        <ul
          style={{
            margin: "0",
            paddingLeft: "1.25rem",
            color: "var(--color-accent)",
          }}
        >
          <li>Direction</li>
          <li>Clarity</li>
          <li>Connection</li>
          <li>Real conversations</li>
        </ul>
      </section>

      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "1.5rem",
          }}
        >
          Structure and Experience
        </h2>
        <p
          style={{
            maxWidth: "42rem",
            margin: "0",
            color: "var(--color-accent)",
          }}
        >
          Expect focused talks, experienced speakers, room for interaction, and
          space to build meaningful connections with people facing similar
          questions about what comes next.
        </p>
      </section>

      <section
        style={{
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-8)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--space-4)",
            color: "var(--color-primary)",
            fontSize: "1.5rem",
          }}
        >
          Ready to Join?
        </h2>
        <p
          style={{
            margin: "0 0 var(--space-6)",
            color: "var(--color-accent)",
          }}
        >
          Reserve your place and move into the next step with intention.
        </p>
        <Link
          href="/register"
          style={{
            display: "inline-block",
            padding: "var(--space-4) var(--space-6)",
            background: "var(--color-background)",
            color: "var(--color-primary)",
          }}
        >
          Register Now
        </Link>
      </section>
    </>
  );
}
