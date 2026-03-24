import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "ResQBrain",
  description: "Die Wissensplattform für den Rettungsdienst",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
