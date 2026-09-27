import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sweet Ginger | Custom T-Shirt Design Studio',
  description: 'Self-service custom apparel design studio for D2C retail orders and B2B wholesale bulk blanks by Shankar Hemrajani, Jaipur.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;800&family=Montserrat:wght@400;600;800&family=Outfit:wght@400;600;800&family=Pacifico&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-neutral-50 text-neutral-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
