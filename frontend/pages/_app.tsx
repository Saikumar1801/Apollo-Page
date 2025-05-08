// frontend/pages/_app.tsx
import '@/styles/globals.css'; // Ensure this path is correct
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;