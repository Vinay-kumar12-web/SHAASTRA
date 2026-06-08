/**
 * layout.js
 * Root layout — wraps the entire app with providers and global nav.
 */
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "SHAASTRA — Your Modern Learning Platform",
  description:
    "Explore skills, build study plans, and track your learning progress — all in one place.",
  keywords: "learning platform, study planner, coding skills, online education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppProvider>
          <Navbar />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
