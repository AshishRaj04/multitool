import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GoogleAdsense from "@/components/GoogleAdsense";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MULTITOOL // UTILITY OS",
  description:
    "Your all-in-one utility dashboard. Convert, download, transform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsensePid =
    process.env.NEXT_PUBLIC_ADSENSE_PID || "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <GoogleAdsense pId={adsensePid} />
        {children}
      </body>
    </html>
  );
}
