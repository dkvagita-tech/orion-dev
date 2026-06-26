import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import { AIAssistant } from "@/components/ai/ai-assistant";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: {
    default: "M Hasnat Khan | Frontend Developer & AI Engineer",
    template: "%s | M Hasnat Khan",
  },
  description:
    "Portfolio of M Hasnat Khan — Frontend Developer & AI Enthusiast building modern, intelligent web experiences.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "M Hasnat Khan Portfolio",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        <Providers>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Person",
              name: "M Hasnat Khan",
              jobTitle: "Frontend Developer & AI Enthusiast",
              email: "dk.vagita@gmail.com",
              url: process.env.NEXTAUTH_URL || "http://localhost:3000",
            }}
          />
          {children}
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}
