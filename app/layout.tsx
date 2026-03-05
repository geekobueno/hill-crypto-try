import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Application Éducative du Chiffre de Hill",
  description: "Application web interactive pour apprendre l'algorithme de chiffrement de Hill à travers des démonstrations visuelles et des calculs étape par étape",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-mono bg-terminal-bg text-terminal-text antialiased">
        {children}
      </body>
    </html>
  );
}
