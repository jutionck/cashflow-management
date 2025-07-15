import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Manajemen Uang Pribadi',
  description: 'Dibuat dengan ❤️ oleh Jution Candra Kirana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
