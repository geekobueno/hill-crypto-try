import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hill Cipher Educational App",
  description: "Interactive web application for learning the Hill cipher encryption algorithm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono bg-terminal-bg text-terminal-text antialiased">
        {children}
      </body>
    </html>
  );
}
