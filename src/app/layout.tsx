import type { Metadata } from 'next';
import { RateLimitDisplay } from '@/components/RateLimitDisplay';
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
      <body>
        <RateLimitDisplay />
        {children}
      </body>
    </html>
  );
}
