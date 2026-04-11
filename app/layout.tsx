import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Settled on the Field",
  description: "Settled on the Field platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <Header />
        </header>
        <main className="app-main">
          <div className="page-wrapper">{children}</div>
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
