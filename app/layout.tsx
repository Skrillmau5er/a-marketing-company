import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Orbitron, Syne } from "next/font/google";
import Script from "next/script";
import { Cursor } from "@/components/cursor";
import { Nav } from "@/components/nav";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"] });

// Novus by Pendo install snippet, verbatim: stubs the `pendo` API and loads the agent asynchronously.
const PENDO_SNIPPET = `(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track', 'trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo-dev.pendo-dev.com/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('34e460be-2184-46d0-824d-1aba407d6c42');`;

// Boots Pendo once per document load as an anonymous visitor; the empty id lets the agent restore a
// returning visitor's id from its cookie/localStorage. The site has no sign-in flow to call pendo.identify() from.
const PENDO_INITIALIZE = "pendo.initialize({ visitor: { id: '' } });";

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
        {/*
          beforeInteractive scripts are injected into <head> and run in the order placed, once per document
          load, before hydration — so the stub exists when initialize runs. Keep initialize here: client
          instrumentation (instrumentation-client.ts) executes before these scripts, when `pendo` is undefined.
        */}
        <Script id="pendo-snippet" strategy="beforeInteractive">
          {PENDO_SNIPPET}
        </Script>
        <Script id="pendo-initialize" strategy="beforeInteractive">
          {PENDO_INITIALIZE}
        </Script>
        <Providers>
          <Nav />
          {children}
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
