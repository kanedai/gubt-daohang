"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { Category } from "@/lib/types";
import { motion } from "framer-motion";

export default function HomeClient({ initialData }: { initialData: Category[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return initialData;
        return initialData.map(cat => ({
            ...cat,
            links: cat.links.filter(link =>
                link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                link.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.links.length > 0);
    }, [initialData, searchQuery]);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 opacity-50" />

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-extrabold tracking-tight"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                        导航门户
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    汇聚企业内部核心资源，一键直达即刻开启高效工作。
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl mx-auto relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="搜索应用、文档或服务..."
                            className="w-full pl-12 h-14 text-lg bg-background/80 backdrop-blur-xl border-white/10 rounded-xl shadow-xl focus:ring-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Grid Section */}
            <div className="space-y-10">
                {filteredCategories.map((category, idx) => (
                    <motion.section
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">{category.title}</h2>
                            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {category.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <GlassCard className="h-full p-6 hover:border-primary/50 hover:bg-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 flex flex-col items-center text-center">
                                        <div className="w-20 h-20 mb-4 rounded-[22px] bg-background border border-white/10 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 relative">
                                            {link.icon && (link.icon.startsWith("http") || link.icon.startsWith("/")) ? (
                                                <img src={link.icon} alt={link.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-bold text-primary/80">{link.title.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>

                                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{link.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 px-2">{link.description || "暂无描述"}</p>
                                    </GlassCard>
                                </a>
                            ))}
                        </div>
                    </motion.section>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">未找到匹配的结果</p>
                    </div>
                )}
            </div>
        </div>
    );
}
