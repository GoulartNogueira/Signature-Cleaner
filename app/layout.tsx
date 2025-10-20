import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Limpador de Assinatura",
  description: "Remova o fundo de assinaturas feitas à mão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
