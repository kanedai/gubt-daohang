import type { Metadata } from "next";
// import "./globals.css"; // Removed for MUI migration
import { Background } from "@/components/layout/background";
import { FloatingAdminTrigger } from "@/components/layout/floating-admin-trigger";
import { cookies } from "next/headers";
import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

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
      <body>
        <ThemeRegistry>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Background />
            <Container
              component="main"
              maxWidth="xl"
              sx={{
                flexGrow: 1,
                py: 4,
                px: 2,
              }}
            >
              {children}
            </Container>

            <Box
              component="footer"
              sx={{
                width: "100%",
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                backdropFilter: "blur(8px)",
                py: 3,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
                  transition: "opacity 0.3s",
                }}
              >
                <img src="/favi.svg" alt="logo" style={{ height: 16, width: 16 }} />
                <Box component="span" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                  © {new Date().getFullYear()} 成都固佰特科技有限公司. All Rights Reserved.
                </Box>
              </Box>
            </Box>
            <FloatingAdminTrigger isAdmin={!!isAdmin} />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}

