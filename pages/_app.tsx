import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen transition-colors duration-200 dark:bg-primary">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
