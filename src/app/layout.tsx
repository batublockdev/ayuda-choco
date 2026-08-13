import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayuda Chocó - Plataforma Solidaria",
  description: "Plataforma de ayuda mutua para los afectados del terremoto en Chocó, Colombia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}