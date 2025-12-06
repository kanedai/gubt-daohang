"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addLink, createCategory, updateLink, updateCategory } from "@/lib/actions";
import { Plus, Edit2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { NavLink, Category } from "@/lib/types";

// @ts-ignore
const initialState = { error: "", success: false };

export function AddCategoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(createCategory, initialState);

    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    if (!isOpen) {
        return (
            <Button variant="outline" onClick={() => setIsOpen(true)} className="w-full h-full border-dashed border-2">
                <Plus className="w-5 h-5 mr-2" /> 新建分类
            </Button>
        );
    }

    return (
        <GlassCard className="p-4 animate-in fade-in zoom-in-95">
            <form action={formAction} className="space-y-4">
                <h3 className="font-semibold">新建分类</h3>
                <Input name="title" placeholder="分类名称 (e.g. 常用工具)" autoFocus required />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>取消</Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "创建中..." : "创建"}
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
}

export function AddLinkForm({ categoryId }: { categoryId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    // Bind the categoryId to the action so it matches (prevState, formData) signature
    const bindAddLink = addLink.bind(null, categoryId);
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(bindAddLink, initialState);

    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    if (!isOpen) {
        return (
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> 添加链接
            </Button>
        );
    }

    return (
        <div className="px-6 py-4 bg-muted/10">
            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="title" placeholder="网站名称" required />
                    <Input name="url" placeholder="URL (https://...)" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="iconUrl" placeholder="图标链接 (可选，支持图片URL)" />
                    <div className="relative">
                        <Input
                            type="file"
                            name="iconFile"
                            accept="image/*"
                            className="cursor-pointer file:cursor-pointer file:text-primary file:font-medium text-muted-foreground"
                        />
                    </div>
                </div>
                <Input name="description" placeholder="描述 (可选)" />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} size="sm">取消</Button>
                    <Button type="submit" size="sm" disabled={isPending}>
                        {isPending ? "保存中..." : "保存"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

import { createPortal } from "react-dom";

export function EditLinkForm({ categoryId, link, categories }: { categoryId: string, link: NavLink, categories: Category[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Bind both IDs to the update action
    const bindUpdateLink = updateLink.bind(null, categoryId, link.id);
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(bindUpdateLink, initialState);

    useEffect(() => {
        setMounted(true);
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Edit2 className="w-4 h-4" />
            </Button>

            {mounted && isOpen && createPortal(
                <AnimatePresence>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-lg z-10"
                        >
                            <GlassCard className="p-6 border-white/20 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">编辑链接</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form action={formAction} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">所属分类</label>
                                            <div className="relative">
                                                <select
                                                    name="categoryId"
                                                    defaultValue={categoryId}
                                                    className="w-full h-11 rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:bg-muted/50 transition-colors"
                                                >
                                                    {categories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.title}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">网站名称</label>
                                            <Input name="title" defaultValue={link.title} placeholder="例如：Google" required className="bg-muted/30 h-11" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">链接地址 (URL)</label>
                                            <Input name="url" defaultValue={link.url} placeholder="https://..." required className="bg-muted/30 h-11" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground ml-1">图标链接 (可选)</label>
                                                <Input name="iconUrl" defaultValue={link.icon?.startsWith('http') ? link.icon : ''} placeholder="图片URL..." className="bg-muted/30 h-11" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground ml-1">上传图标 (覆盖链接)</label>
                                                <Input
                                                    type="file"
                                                    name="iconFile"
                                                    accept="image/*"
                                                    className="bg-muted/30 h-11 pt-2 cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground ml-1">描述 (可选)</label>
                                            <Input name="description" defaultValue={link.description} placeholder="简短描述该链接的作用..." className="bg-muted/30 h-11" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="h-11 px-6">取消</Button>
                                        <Button type="submit" disabled={isPending} className="h-11 px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                                            {isPending ? "保存中..." : "确认保存"}
                                        </Button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}



export function EditCategoryForm({ category }: { category: Category }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const bindUpdateCategory = updateCategory.bind(null, category.id);
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(bindUpdateCategory, initialState);

    useEffect(() => {
        setMounted(true);
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Edit2 className="w-4 h-4" />
            </Button>

            {mounted && isOpen && createPortal(
                <AnimatePresence>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-sm z-10"
                        >
                            <GlassCard className="p-6 border-white/20 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">重命名分类</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form action={formAction} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">分类名称</label>
                                        <Input name="title" defaultValue={category.title} placeholder="分类名称" required className="bg-muted/30 h-11" />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="h-11 px-6">取消</Button>
                                        <Button type="submit" disabled={isPending} className="h-11 px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                                            {isPending ? "保存" : "确认修改"}
                                        </Button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
