import { getCategories } from "@/lib/data";
import { GlassCard }
    from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, LayoutGrid } from "lucide-react";
import { AddCategoryForm, AddLinkForm, EditLinkForm, EditCategoryForm } from "@/components/admin/forms";
import { DeleteLinkButton } from "@/components/admin/delete-button";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminDashboard() {
    const categories = await getCategories();

    return (
        <div className="space-y-8 pb-32">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        管理控制台
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        管理您的导航链接与分类
                    </p>
                </div>
            </header>

            {/* 概览卡片 */}
            <div className="grid gap-6 md:grid-cols-3">
                <GlassCard className="p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">总链接数</h3>
                        <div className="mt-2 text-4xl font-bold text-primary">
                            {categories.reduce((acc, cat) => acc + cat.links.length, 0)}
                        </div>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">分类数量</h3>
                        <div className="mt-2 text-4xl font-bold text-primary">{categories.length}</div>
                    </div>
                </GlassCard>
                <div className="h-full min-h-[120px]">
                    <AddCategoryForm />
                </div>
            </div>

            {/* 内容管理列表 */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold border-l-4 border-primary pl-3">
                    <LayoutGrid className="w-5 h-5" />
                    分类与链接
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {categories.map((category) => (
                        <GlassCard key={category.id} className="overflow-hidden">
                            <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-base">{category.title}</span>
                                    <EditCategoryForm category={category} />
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                        {category.links.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AddLinkForm categoryId={category.id} />
                                    <DeleteCategoryButton categoryId={category.id} />
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {category.links.map((link) => (
                                    <div key={link.id} className="group relative flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-muted/50 transition-colors">
                                        {/* Flexibly display Icon or Image */}
                                        <div className="w-6 h-6 shrink-0 rounded-md bg-white/10 flex items-center justify-center overflow-hidden border border-white/5">
                                            {link.icon && (link.icon.startsWith("http") || link.icon.startsWith("/")) ? (
                                                <img src={link.icon} alt={link.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">ICON</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-xs truncate leading-tight">{link.title}</div>
                                            <div className="text-[10px] text-muted-foreground truncate opacity-70 leading-tight">{link.url}</div>
                                        </div>

                                        {/* Absolute positioned actions for compactness */}
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md shadow-sm">
                                            <EditLinkForm categoryId={category.id} link={link} categories={categories} />
                                            <DeleteLinkButton categoryId={category.id} linkId={link.id} />
                                        </div>
                                    </div>
                                ))}
                                {category.links.length === 0 && (
                                    <div className="px-4 py-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            <Plus className="w-4 h-4 opacity-50" />
                                        </div>
                                        暂无链接，请添加
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
