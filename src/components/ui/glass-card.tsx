"use client";

import * as React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

interface GlassCardProps extends BoxProps {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'hoverEffect',
})<{ hoverEffect?: boolean }>(({ theme, hoverEffect }) => ({
    background: 'rgba(255, 255, 255, 0.1)', // fallback
    backdropFilter: 'blur(16px)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Adjust for "Glass" feel
    borderRadius: (theme.shape.borderRadius as number) * 3, // xl equivalent roughly
    padding: theme.spacing(3),
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: theme.transitions.create(['transform', 'box-shadow']),
    ...(hoverEffect && {
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
    }),
}));

const MotionBox = motion(StyledBox);

export function GlassCard({
    children,
    className,
    hoverEffect = false,
    ...props
}: GlassCardProps & { component?: React.ElementType }) {
    // Note: We are using Framer Motion capabilities if needed, but MUI Box is the base.
    // If we want simple slide-in animation:
    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            // @ts-ignore
            sx={{ width: '100%' }}
        >
            <StyledBox hoverEffect={hoverEffect} className={className} {...props}>
                {children}
            </StyledBox>
        </Box>
    );
}
