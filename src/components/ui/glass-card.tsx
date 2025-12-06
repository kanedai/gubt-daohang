"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

/**
 * 毛玻璃卡片组件 (Glass Component)
 * 封装了基础的毛玻璃背景效果，支持 Framer Motion 动画属性
 */
export function GlassCard({
    children,
    className,
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "glass rounded-xl p-6 transition-all",
                hoverEffect && "glass-hover hover:-translate-y-1 hover:shadow-2xl cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
