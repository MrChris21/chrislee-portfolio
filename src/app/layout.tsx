import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mr. Chris Lee — Full Stack Web Developer",
  description:
    "Portfolio of Christopher D. Lee Jr. — Full Stack Web Developer specializing in WordPress, front-end, and back-end development.",
  keywords: [
    "Chris Lee",
    "Web Developer",
    "WordPress",
    "Full Stack",
    "Portfolio",
    "Jeddah",
    "Philippines",
  ],
  authors: [{ name: "Christopher D. Lee Jr." }],
  openGraph: {
    title: "Mr. Chris Lee — Full Stack Web Developer",
    description:
      "Full Stack Web Developer portfolio — WordPress, front-end, back-end, and creative tools.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
