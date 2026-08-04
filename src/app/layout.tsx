import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "WhereWatch — Find where to watch",
    template: "%s | WhereWatch",
  },
  description: "Search movies and TV shows to find where they are streaming, renting, or available to buy.",
  applicationName: "WhereWatch",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  keywords: ["streaming", "movies", "TV shows", "where to watch"],
  appleWebApp: { capable: true, title: "WhereWatch", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    siteName: "WhereWatch",
    type: "website",
    title: "WhereWatch — Find where to watch",
    description: "Find where movies and TV shows are streaming, renting, or available to buy.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Streaming Finder" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <meta name="google-adsense-account" content="ca-pub-8685630412421890" />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`} crossOrigin="anonymous" />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <Script src="/register-sw.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
