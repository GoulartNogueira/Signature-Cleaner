import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signature Cleaner",
  description: "Remove background from handmade signatures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
