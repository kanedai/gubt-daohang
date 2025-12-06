"use client";

import { motion } from "framer-motion";

export function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
            <motion.div
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
                className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vw] bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
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
                className="absolute -bottom-1/2 -right-1/2 w-[100vw] h-[100vw] bg-purple-500/10 rounded-full blur-3xl"
            />

            {/* 网格纹理叠加 */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] invert dark:invert-0" />
        </div>
    );
}
