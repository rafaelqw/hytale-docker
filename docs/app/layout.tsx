import { RootProvider } from 'fumadocs-ui/provider/next';
import Script from "next/script";
import './global.css';
import { Inter, Cinzel } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.className} ${cinzel.variable} dark`} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ enabled: false, defaultTheme: 'dark' }}>{children}</RootProvider>
      </body>
    </html>
  );
}
