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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Background />
        <main className="flex-1 container mx-auto px-4 py-10">
          {children}
        </main>

        <footer className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2 justify-center opacity-80 hover:opacity-100 transition-opacity">
              <img src="/favi.svg" alt="logo" className="h-4 w-4" />
              <span>© {new Date().getFullYear()} 成都固佰特科技有限公司. All Rights Reserved.</span>
            </div>
          </div>
        </footer>
        <FloatingAdminTrigger isAdmin={!!isAdmin} />
      </body>
    </html>
  );
}
