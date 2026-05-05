import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers";
import { LanguageProvider } from "@/components/language-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05071a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Spirit of Haiti Air — An Airline For The Diaspora, By The Diaspora",
  description:
    "Pledge to help the Haitian diaspora acquire a stake in Spirit Airlines and launch a homeland airline. $25M goal, $50 minimum.",
  openGraph: {
    title: "Spirit of Haiti Air — The Diaspora Buys Spirit",
    description:
      "An airline for the diaspora, by the diaspora. Pledge $50+ to back the $25M raise.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
