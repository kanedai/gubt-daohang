"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { Category } from "@/lib/types";
import { AddLinkForm, EditLinkForm, EditCategoryForm, AddCategoryForm } from "@/components/admin/forms";
import { DeleteLinkButton } from "@/components/admin/delete-button";
import { motion } from "framer-motion";

export default function HomeClient({ initialData, isAdmin = false }: { initialData: Category[]; isAdmin?: boolean }) {
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
            {/* Compact Search */}
            <section className="py-4">
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="搜索..."
                        className="w-full pl-9 h-9 text-sm bg-background/80 backdrop-blur-xl border-white/10 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </section>

            {/* Grid Section */}
            <div className="space-y-10">
                {isAdmin && (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("edit") === "1") && (
                    <div className="mb-4">
                        <GlassCard className="p-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-muted-foreground">新增分类</h3>
                                <AddCategoryForm />
                            </div>
                        </GlassCard>
                    </div>
                )}
                {filteredCategories.map((category, idx) => (
                    <motion.section
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-base font-semibold tracking-tight">{category.title}</h2>
                            {isAdmin && (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("edit") === "1") && (
                                <EditCategoryForm category={category as any} />
                            )}
                            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {category.links.map((link) => (
                                <div key={link.id} className="group relative">
                                    <a
                                        href={link.url}
                                        target={isAdmin ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className="block"
                                        title={link.description || link.title}
                                    >
                                        <GlassCard className="h-full p-2 hover:border-primary/50 hover:bg-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 flex flex-col items-center text-center">
                                            <div className="w-12 h-12 rounded-xl bg-background border border-white/10 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 relative">
                                                {link.icon && (link.icon.startsWith("http") || link.icon.startsWith("/")) ? (
                                                    <img src={link.icon} alt={link.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-lg font-bold text-primary/80">{link.title.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-xs mt-2 line-clamp-1">{link.title}</h3>
                                        </GlassCard>
                                    </a>
                                    {isAdmin && (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("edit") === "1") && (
                                        <>
                                            <EditLinkForm overlay categoryId={category.id} link={link} categories={initialData} />
                                            <div className="absolute right-1 top-1">
                                                <DeleteLinkButton categoryId={category.id} linkId={link.id} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {isAdmin && (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("edit") === "1") && (
                                <GlassCard className="h-full p-4 flex items-center justify中心">
                                    <AddLinkForm categoryId={category.id} />
                                </GlassCard>
                            )}
                        </div>
                        {false}
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
