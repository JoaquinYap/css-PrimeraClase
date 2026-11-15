import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BUSINESS_NAME} · Reservá tu turno`,
  description: "Reservá tu turno online en segundos: elegí servicio, barbero y horario.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-zinc-800">
          <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              <span className="text-amber-400">✂</span> {BUSINESS_NAME}
            </Link>
            <Link
              href="/reservar"
              className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
            >
              Reservar turno
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
          {BUSINESS_NAME} · Proyecto de portafolio
        </footer>
      </body>
    </html>
  );
}
