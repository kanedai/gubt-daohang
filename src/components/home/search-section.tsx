"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface SearchSectionProps {
    onSearch: (query: string) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        onSearch(query);
    }, [query, onSearch]);

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-white/70 drop-shadow-sm"
            >
                快速访问您的
                <span className="text-primary block md:inline md:ml-3">工作空间</span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-2xl relative"
            >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                    type="text"
                    placeholder="搜索系统、工具或文档..." // Chinese placeholder
                    className="pl-12 h-14 text-lg rounded-2xl shadow-2xl border-white/20 bg-white/10 backdrop-blur-xl focus:bg-white/20 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </motion.div>
        </div>
    );
}
