import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriCoach — Personal Trainer & Nutrition",
  description:
    "Snap a photo of your food to get instant nutrition info and track your daily calories.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a35a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto min-h-screen max-w-md bg-[#f7f8fa] pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
