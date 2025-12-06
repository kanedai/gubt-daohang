import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/layout/background";
import { FloatingAdminTrigger } from "@/components/layout/floating-admin-trigger";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "导航门户",
  description: "高效企业级内部导航门户",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = (await cookies()).get("admin_session")?.value === "true";
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Background />
        <main className="min-h-screen pt-10 pb-10 container mx-auto px-4">
          {children}
        </main>
        <FloatingAdminTrigger isAdmin={!!isAdmin} />
      </body>
    </html>
  );
}
