import type { Metadata } from 'next';
import '../styles/globals.css'; // Ensure global styles are imported

export const metadata: Metadata = {
  title: 'Apollo247 Clone',
  description: 'Clone of Apollo247 for doctor listings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}