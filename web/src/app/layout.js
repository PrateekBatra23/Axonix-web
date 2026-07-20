import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
async function getExclusiveCompanies() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/companies?exclusive=true`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}
export const metadata = {
  title: {
    default: "Avonzi — AI intelligence, delivered daily",
    template: "%s | Avonzi",
  },
  description: "AI intelligence, delivered daily. Daily AI news digests for engineers, architects, and AI practitioners.",
  openGraph: {
    title: "Axonix — AI intelligence, delivered daily",
    description: "AI intelligence, delivered daily. Daily AI news digests for engineers, architects, and AI practitioners.",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  const companies = await getExclusiveCompanies();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header companies={companies} />
        {children}
        <Footer />
      </body>
    </html>
  );
}