import type { Metadata } from "next";
import "./globals.css";
import "./styles.css";

export const metadata: Metadata = {
  title: "OpenAI Image Generator",
  description: "Generate images using OpenAI's DALL-E models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
