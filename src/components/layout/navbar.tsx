"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

export function Navbar() {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.05),
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ height: 64 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="/favi.svg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Box>
                        </Box>
                    </Link>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
