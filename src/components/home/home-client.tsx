"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // Keep Lucide for now
import { Category } from "@/lib/types";
import { AddLinkForm, EditLinkForm, EditCategoryForm, AddCategoryForm } from "@/components/admin/forms";
import { DeleteLinkButton } from "@/components/admin/delete-button";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { FastTooltip } from "@/components/ui/fast-tooltip";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // Grid v2 is now default Grid in late versions
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";

export default function HomeClient({ initialData, isAdmin = false }: { initialData: Category[]; isAdmin?: boolean }) {
    const [searchQuery, setSearchQuery] = useState("");
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit") === "1";
    const theme = useTheme();

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
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
            {/* Compact Search */}
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 448 }}>
                    <Search
                        style={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: theme.palette.text.secondary,
                            width: 16,
                            height: 16,
                            zIndex: 1
                        }}
                    />
                    <Input
                        type="text"
                        placeholder="搜索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            '& .MuiInputBase-input': { pl: 4.5 },
                            '& .MuiInputBase-root': {
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                            }
                        }}
                    />
                </Box>
            </Box>

            {/* Grid Section */}
            <Stack spacing={5}>
                {isAdmin && isEdit && (
                    <Box sx={{ mb: 2 }}>
                        <GlassCard sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" color="text.secondary">管理分类</Typography>
                                <AddCategoryForm />
                            </Box>
                        </GlassCard>
                    </Box>
                )}

                {filteredCategories.map((category, idx) => (
                    <Box
                        component={motion.section}
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        sx={{ width: '100%' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">
                                {category.title}
                            </Typography>
                            {isAdmin && isEdit && (
                                <EditCategoryForm category={category as any} />
                            )}
                            <Divider sx={{ flex: 1, borderImage: `linear-gradient(to right, ${theme.palette.divider}, transparent) 1` }} />
                        </Box>

                        <Grid container spacing={2} columns={120}>
                            {category.links.map((link) => {
                                const CardContent = (
                                    <Stack
                                        direction="column"
                                        alignItems="center"
                                        spacing={1.5}
                                        sx={{
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                        className="group" // helper for hover effects if needed
                                    >
                                        {/* macOS Dashboard Style Icon */}
                                        <Box
                                            sx={{
                                                width: { xs: 64, sm: 80 },
                                                height: { xs: 64, sm: 80 },
                                                borderRadius: '1.2rem',
                                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                                                backdropFilter: 'blur(12px)',
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.common.white, 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                boxShadow: 3,
                                                position: 'relative',
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.05)}, ${alpha(theme.palette.common.white, 0)})`,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    boxShadow: 6,
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                }
                                            }}
                                        >
                                            {link.icon && (link.icon.startsWith("http") || link.icon.startsWith("/")) ? (
                                                <img src={link.icon} alt={link.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Typography variant="h5" fontWeight="bold" color="primary">
                                                    {link.title.charAt(0).toUpperCase()}
                                                </Typography>
                                            )}
                                        </Box>
                                        {/* Minimal Text Label */}
                                        <Typography
                                            variant="body2"
                                            align="center"
                                            color="text.secondary"
                                            sx={{
                                                fontWeight: 500,
                                                width: '100%',
                                                px: 0.5,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                transition: 'color 0.2s',
                                                '&:hover': { color: 'text.primary' }
                                            }}
                                        >
                                            {link.title}
                                        </Typography>
                                    </Stack>
                                );

                                return (
                                    <Grid size={{ xs: 30, sm: 24, md: 20, lg: 15 }} key={link.id}>
                                        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {isAdmin && isEdit ? (
                                                <EditLinkForm
                                                    categoryId={category.id}
                                                    link={link}
                                                    categories={initialData}
                                                    trigger={CardContent}
                                                />
                                            ) : (
                                                <FastTooltip tooltipText={link.description}>
                                                    <a
                                                        href={link.url}
                                                        target={isAdmin ? "_self" : "_blank"}
                                                        rel="noopener noreferrer"
                                                        style={{ display: 'block', width: '100%', textDecoration: 'none' }}
                                                    >
                                                        {CardContent}
                                                    </a>
                                                </FastTooltip>
                                            )}

                                            {isAdmin && isEdit && (
                                                <Box sx={{ position: 'absolute', top: -8, right: -8, zIndex: 10 }}>
                                                    <Box sx={{ bgcolor: 'background.paper', borderRadius: '50%', boxShadow: 1, border: '1px solid', borderColor: 'divider' }}>
                                                        <DeleteLinkButton categoryId={category.id} linkId={link.id} />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            })}

                            {isAdmin && isEdit && (
                                <Grid size={{ xs: 30, sm: 24, md: 20, lg: 15 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            minHeight: 100,
                                            opacity: 0.7,
                                            '&:hover': { opacity: 1 },
                                            transition: 'opacity 0.2s',
                                            mt: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: { xs: 64, sm: 80 },
                                                height: { xs: 64, sm: 80 },
                                                borderRadius: '1.2rem',
                                                border: '2px dashed',
                                                borderColor: 'text.disabled',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <AddLinkForm categoryId={category.id} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            添加链接
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                ))}

                {filteredCategories.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h6" color="text.secondary">
                            未找到匹配的结果
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    );
}
