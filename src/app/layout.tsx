import type { Metadata } from "next";
import { Roboto_Slab, Jersey_15 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

const jersey15 = Jersey_15({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey-15",
});

export const metadata: Metadata = {
  title: "Dev Match",
  description:
    "Assign developers to project based on their skills and project requirements.",
  icons: {
    icon: "/icons/browsing.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${robotoSlab.variable} ${jersey15.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
