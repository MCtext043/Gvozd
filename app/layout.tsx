import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: `${SITE.slogan} Строительный центр в Ижевске: ${SITE.address.street}. ${SITE.areaSqM.toLocaleString("ru-RU")} м² ассортимента.`,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE.fullName,
    title: SITE.fullName,
    description: SITE.tagline,
    url: SITE.url,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[var(--gvozd-black)]">
        {children}
      </body>
    </html>
  );
}
