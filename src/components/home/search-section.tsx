"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SearchSectionProps {
    onSearch: (query: string) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        onSearch(query);
    }, [query, onSearch]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Typography variant="h2" fontWeight="800" sx={{ mb: 3, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))', backgroundClip: 'text', textFillColor: 'transparent', color: 'transparent' }}>
                    快速访问您的
                    <Box component="span" sx={{ color: 'primary.main', display: { md: 'inline', xs: 'block' }, ml: { md: 1.5 } }}>
                        工作空间
                    </Box>
                </Typography>
            </Box>

            <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                sx={{ width: '100%', maxWidth: 672, position: 'relative' }}
            >
                <Box sx={{ position: 'absolute', insetY: 0, left: 16, display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'text.secondary' }}>
                    <Search size={20} />
                </Box>
                <Input
                    type="text"
                    placeholder="搜索系统、工具或文档..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{
                        '& .MuiInputBase-input': { pl: 6, height: 56, fontSize: '1.125rem' },
                        '& .MuiInputBase-root': {
                            borderRadius: 4,
                            boxShadow: 10,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(16px)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.2)',
                            }
                        }
                    }}
                />
            </Box>
        </Box>
    );
}
