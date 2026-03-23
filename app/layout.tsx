import type { Metadata } from 'next';
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'SkillsTube — Curated Skills for Claude Code & Cowork',
    template: '%s | SkillsTube',
  },
  description:
    'Find trusted, curated skill stacks for Claude Code, Cowork, Cursor, and more. Quality over quantity — every skill reviewed for safety and usefulness.',
  openGraph: {
    type: 'website',
    siteName: 'SkillsTube',
    title: 'SkillsTube — Curated Skills for Claude Code & Cowork',
    description:
      'Find trusted, curated skill stacks for Claude Code, Cowork, Cursor, and more.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
