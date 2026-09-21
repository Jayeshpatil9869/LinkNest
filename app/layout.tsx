import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkNest — Visual URL Library",
  description:
    "A premium personal URL library and visual bookmark archive.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=chillax@1,200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <div className="noise-texture" aria-hidden />
        <AppProviders>
          <div className="relative z-[1] flex min-h-dvh flex-col">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
