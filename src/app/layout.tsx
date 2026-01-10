import type { Metadata } from 'next';
// import './globals.css';

export const metadata: Metadata = {
  title: 'Repometric',
  description:
    'Repometric is an open-source dashboard for analyzing the health and activity of GitHub repositories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
