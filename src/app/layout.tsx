import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DJ C6 | Official | Mix • Book • Vibe",
  description:
    "DJ C6 — Nairobi's premier DJ. Request songs, book events, shop merch, and vibe with the beat. Powered by M-Pesa.",
  keywords: "DJ C6, DJ Nairobi, book DJ Kenya, song request, M-Pesa DJ, Kenyan DJ, Afrobeats DJ",
  openGraph: {
    title: "DJ C6 | Official",
    description: "Mix • Book • Vibe. Nairobi's premium DJ experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div className="bg-aurora">
          <div className="aurora-blob anim-aurora" style={{ top: '-10%', left: '-10%', background: 'var(--gold)' }}></div>
          <div className="aurora-blob anim-aurora" style={{ bottom: '-10%', right: '-10%', background: 'var(--green)', animationDelay: '-5s' }}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
