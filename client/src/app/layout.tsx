import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UseContext from "@/lib/UseContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArtiFeed – Personalized Article Feeds by Category",
  description:
    "ArtiFeed is an intelligent article feed web app where users can explore, create, and manage articles based on personalized category preferences like sports, politics, space, and more.",
  keywords: [
    "ArtiFeed",
    "article feed",
    "personalized articles",
    "article dashboard",
    "news application",
    "article application",
    "news categories",
    "create article",
    "edit article",
    "manage articles",
    "MERN blog",
    "React article app",
    "nextjs article app"
  ],
  authors: [{ name: "Muhammed Shuraif", url: "https://github.com/Shuraifp" }],
  creator: "Muhammed Shuraif",
  metadataBase: new URL("https://arti-feed.vercel.app"),
  openGraph: {
    title: "ArtiFeed – Intelligent, Personalized Article Feeds",
    description:
      "Join ArtiFeed to explore, share, and manage articles based on your unique interests like politics, sports, and space. Built for a clean, responsive user experience.",
    url: "https://arti-feed.vercel.app",
    siteName: "ArtiFeed",
    images: [
      {
        url: "https://arti-feed.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtiFeed – Personalized Article Feeds",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  themeColor: "#ffffff",
  colorScheme: "light",
  category: "Technology",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UseContext>{children}</UseContext>
      </body>
    </html>
  );
}
