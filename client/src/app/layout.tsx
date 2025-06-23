import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UseContext from "@/lib/UseContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Article Feeds",
  description:
    "A platform to discover and share articles based on your interests.",
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
