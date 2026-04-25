import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Playfair_Display, Inter } from 'next/font/google';
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";


export const metadata: Metadata = {
  title: "Settled on the Field",
  description: "Settled on the Field platform",
};

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <header>
          <Header />
        </header>
        <main className="app-main">
          <div className="page-wrapper">{children}</div>
        </main>
        <footer>
          <Footer />
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
