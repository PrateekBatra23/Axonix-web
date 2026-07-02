import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Axonix — AI intelligence, delivered daily",
    template: "%s | Axonix",
  },
  description: "AI intelligence, delivered daily. Daily AI news digests for engineers, architects, and AI practitioners.",
  openGraph: {
    title: "Axonix — AI intelligence, delivered daily",
    description: "AI intelligence, delivered daily. Daily AI news digests for engineers, architects, and AI practitioners.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}