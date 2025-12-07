"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";

export function Background() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: -10,
                overflow: "hidden",
                bgcolor: "background.default",
            }}
        >
            <Box
                component={motion.div}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                sx={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "100vw",
                    height: "100vw",
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: "50%",
                    filter: "blur(64px)", // blur-3xl roughly
                }}
            />
            <Box
                component={motion.div}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                sx={{
                    position: "absolute",
                    bottom: "-50%",
                    right: "-50%",
                    width: "100vw",
                    height: "100vw",
                    bgcolor: alpha(theme.palette.secondary.main || "#9c27b0", 0.1), // purple-500 fallback
                    borderRadius: "50%",
                    filter: "blur(64px)",
                }}
            />

            {/* Grid texture overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url('/grid.svg')",
                    opacity: 0.03,
                    filter: theme.palette.mode === 'light' ? 'invert(1)' : 'none',
                }}
            />
        </Box>
    );
}
