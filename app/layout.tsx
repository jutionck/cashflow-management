import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Manajemen Uang Pribadi',
  description: 'Dibuat dengan ❤️ oleh Jution Candra Kirana',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='id'>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
