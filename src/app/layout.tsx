import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ateed Tech | Custom Software Development",
    template: "%s | Ateed Tech",
  },
  description:
    "A custom software development firm focused on web and mobile applications, enterprise systems, cloud infrastructure, and AI technologies.",
  keywords: [
    "custom software development",
    "web development",
    "mobile app development",
    "enterprise software",
    "AI development",
    "Florida software company",
  ],
  authors: [{ name: "Ateed Tech" }],
  creator: "Ateed Tech",
  metadataBase: new URL("https://www.ateedtech.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ateedtech.com",
    siteName: "Ateed Tech",
    title: "Ateed Tech | Custom Software Development",
    description:
      "A custom software development firm focused on web and mobile applications, enterprise systems, cloud infrastructure, and AI technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ateed Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ateed Tech | Custom Software Development",
    description:
      "A custom software development firm focused on web and mobile applications, enterprise systems, cloud infrastructure, and AI technologies.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="pt-16 lg:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
