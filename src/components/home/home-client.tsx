"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { Category } from "@/lib/types";
import { AddLinkForm, EditLinkForm, EditCategoryForm, AddCategoryForm } from "@/components/admin/forms";
import { DeleteLinkButton } from "@/components/admin/delete-button";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function HomeClient({ initialData, isAdmin = false }: { initialData: Category[]; isAdmin?: boolean }) {
    const [searchQuery, setSearchQuery] = useState("");
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit") === "1";

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
                {isAdmin && isEdit && (
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
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-base font-semibold tracking-tight">{category.title}</h2>
                            {isAdmin && isEdit && (
                                <EditCategoryForm category={category as any} />
                            )}
                            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
                            {category.links.map((link) => (
                                <div key={link.id} className="group relative flex flex-col items-center">
                                    <a
                                        href={link.url}
                                        target={isAdmin ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className="block w-full"
                                        title={link.description || link.title}
                                    >
                                        <div className="flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105">
                                            {/* macOS Dashboard Style Icon */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.2rem] bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:border-primary/20 transition-all duration-300 relative bg-gradient-to-br from-white/5 to-white/0">
                                                {link.icon && (link.icon.startsWith("http") || link.icon.startsWith("/")) ? (
                                                    <img src={link.icon} alt={link.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-primary/80">{link.title.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            {/* Minimal Text Label */}
                                            <h3 className="text-xs sm:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1 w-full px-1">
                                                {link.title}
                                            </h3>
                                        </div>
                                    </a>

                                    {isAdmin && isEdit && (
                                        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
                                            <div className="bg-background shadow-sm rounded-full p-0.5 border border-border">
                                                <EditLinkForm overlay categoryId={category.id} link={link} categories={initialData} />
                                            </div>
                                            <div className="bg-background shadow-sm rounded-full p-0.5 border border-border">
                                                <DeleteLinkButton categoryId={category.id} linkId={link.id} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isAdmin && isEdit && (
                                <div className="flex flex-col items-center justify-center gap-2 min-h-[100px] opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.2rem] border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                        <AddLinkForm categoryId={category.id} />
                                    </div>
                                    <span className="text-xs text-muted-foreground">添加链接</span>
                                </div>
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
