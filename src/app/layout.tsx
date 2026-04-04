import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AcreFlow — Premium Real Estate Marketplace",
  description: "Discover your dream property with AcreFlow. Zero brokerage, verified listings, and data-driven insights for buyers, renters, and sellers.",
  keywords: ["AcreFlow", "real estate", "property", "buy", "rent", "commercial", "zero brokerage", "verified listings"],
  authors: [{ name: "AcreFlow Team" }],
  icons: {
    icon: "/acreflow-logo.png",
  },
  openGraph: {
    title: "AcreFlow — Premium Real Estate Marketplace",
    description: "Zero-friction real estate discovery with verified listings and market intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
