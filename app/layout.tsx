import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Assistant } from "next/font/google";
import "./globals.css";
import NoRightClick from "@/components/NoRightClick";

const display = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500"],
  variable: "--font-display",
});

const body = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Sara Stal Photography",
  description: "צילום משפחות, ילדים ורגעים שלא חוזרים",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>
        <NoRightClick />
        {children}
      </body>
    </html>
  );
}
