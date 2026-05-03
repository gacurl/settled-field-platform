import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Playfair_Display, Inter } from 'next/font/google';
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  parseThemeMode,
} from "@/lib/theme";
import "./globals.css";

const themeInitScript = `
  try {
    var storedTheme = window.localStorage.getItem('${THEME_STORAGE_KEY}');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      document.documentElement.dataset.theme = storedTheme;
      document.cookie = '${THEME_COOKIE_NAME}=' + storedTheme + '; Path=/; Max-Age=31536000; SameSite=Lax';
    }
  } catch (error) {}
`;

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme =
    parseThemeMode(cookieStore.get(THEME_COOKIE_NAME)?.value) ?? "light";

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      suppressHydrationWarning
    >
      <body className={`${playfair.variable} ${inter.variable}`}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
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
