"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface FastTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
    delay?: number;
}

export function FastTooltip({ children, content, className = "", delay = 0.1 }: FastTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    // Skip rendering if no content
    if (!content) return <>{children}</>;

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Center the tooltip horizontally above the element
            setCoords({
                top: rect.top - 8, // 8px padding
                left: rect.left + rect.width / 2,
            });
        }
    };

    const handleMouseEnter = () => {
        updatePosition();
        setIsVisible(true);
    };

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <Portal>
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.05, ease: "easeOut" }}
                            className="fixed z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2"
                            style={{
                                top: coords.top,
                                left: coords.left,
                            }}
                        >
                            <div className="relative bg-background/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-lg px-3 py-2 max-w-[240px]">
                                <p className="text-xs font-medium text-foreground text-center leading-relaxed">
                                    {content}
                                </p>
                                {/* Arrow */}
                                <div className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-background/80 border-r border-b border-white/20" />
                            </div>
                        </motion.div>
                    </Portal>
                )}
            </AnimatePresence>
        </div>
    );
}

// Simple Portal to avoid z-index and overflow issues
function Portal({ children }: { children: React.ReactNode }) {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
}
