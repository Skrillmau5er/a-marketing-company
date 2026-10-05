import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Orbitron, Syne } from "next/font/google";
import { Cursor } from "@/components/cursor";
import { Nav } from "@/components/nav";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: {
    default: "A Marketing Company — Unreasonably animated marketing",
    template: "%s · A Marketing Company",
  },
  description: "A marketing studio that turns quiet products into impossible-to-ignore brands.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const fonts = [geistSans, geistMono, syne, orbitron, fraunces].map((f) => f.variable).join(" ");

  return (
    <html lang="en" className={`${fonts} antialiased`}>
      <body className="min-h-svh font-sans">
        <Providers>
          <Nav />
          {children}
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
