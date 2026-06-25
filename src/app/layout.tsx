import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AskFor — Create Beautiful Surprise Invitations',
  description:
    'Create and share interactive surprise experiences. Ask someone on a date, plan a trip, or send a heartfelt invitation with beautiful animations.',
  keywords: ['invitation', 'date', 'surprise', 'interactive', 'romantic'],
  openGraph: {
    title: 'AskFor — Create Beautiful Surprise Invitations',
    description:
      'Create and share interactive surprise experiences with beautiful animations.',
    type: 'website',
  },
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
