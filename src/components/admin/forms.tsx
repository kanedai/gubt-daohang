"use client";

import { useState, useActionState, useEffect, ReactNode } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
// import ChevronDown from "@mui/icons-material/ExpandMore"; // Wrapped in Select

import { addLink, createCategory, updateLink, updateCategory } from "@/lib/actions";
import { NavLink, Category } from "@/lib/types";

// @ts-ignore
const initialState = { error: "", success: false };

function CustomDialog({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backdropFilter: 'blur(20px)',
                    // bgcolor: 'rgba(255,255,255,0.8)' // Let theme handle this or set specifically
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    {title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
}

export function AddCategoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(createCategory, initialState);

    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setIsOpen(true)}
                sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    width: 24,
                    height: 24,
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                }}
            >
                <AddIcon fontSize="small" sx={{ fontSize: 14 }} />
            </IconButton>

            <CustomDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="新建分类">
                <form action={formAction}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            name="title"
                            label="分类名称"
                            placeholder="e.g. 常用工具"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                        />
                        <DialogActions sx={{ px: 0, pb: 0 }}>
                            <Button onClick={() => setIsOpen(false)}>取消</Button>
                            <Button type="submit" variant="contained" disabled={isPending}>
                                {isPending ? "创建中..." : "创建"}
                            </Button>
                        </DialogActions>
                    </Stack>
                </form>
            </CustomDialog>
        </>
    );
}

export function AddLinkForm({ categoryId }: { categoryId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const bindAddLink = addLink.bind(null, categoryId);
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(bindAddLink, initialState);

    useEffect(() => {
        if (state?.success) {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <>
            <Box onClick={() => setIsOpen(true)} sx={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddIcon sx={{ color: 'text.secondary' }} />
            </Box>

            <CustomDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="添加链接">
                <form action={formAction}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <TextField name="title" label="网站名称" required fullWidth />
                            <TextField name="url" label="URL" placeholder="https://..." required fullWidth />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <TextField name="iconUrl" label="图标链接 (可选)" placeholder="图片URL" fullWidth />
                            <TextField
                                type="file"
                                name="iconFile"
                                label="上传图标"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ accept: "image/*" }}
                                fullWidth
                            />
                        </Box>
                        <TextField name="description" label="描述 (可选)" fullWidth />

                        <DialogActions sx={{ px: 0, pb: 0 }}>
                            <Button onClick={() => setIsOpen(false)}>取消</Button>
                            <Button type="submit" variant="contained" disabled={isPending}>
                                {isPending ? "保存中..." : "保存"}
                            </Button>
                        </DialogActions>
                    </Stack>
                </form>
            </CustomDialog>
        </>
    );
}

export function EditLinkForm({ categoryId, link, categories, overlay = false, trigger }: { categoryId: string, link: NavLink, categories: Category[]; overlay?: boolean; trigger?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

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
            {trigger ? (
                <Box onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }} sx={{ cursor: "pointer" }}>
                    {trigger}
                </Box>
            ) : (
                <IconButton
                    size="small"
                    onClick={() => setIsOpen(true)}
                    sx={overlay ? { position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', borderRadius: 0 } : {}}
                >
                    {!overlay && <EditIcon fontSize="small" />}
                </IconButton>
            )}

            {mounted && (
                <CustomDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="编辑链接">
                    <form action={formAction}>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>所属分类</InputLabel>
                                <Select
                                    name="categoryId"
                                    defaultValue={categoryId}
                                    label="所属分类"
                                >
                                    {categories.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField name="title" defaultValue={link.title} label="网站名称" required fullWidth />
                            <TextField name="url" defaultValue={link.url} label="URL" required fullWidth />

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                                <TextField name="iconUrl" defaultValue={link.icon?.startsWith('http') ? link.icon : ''} label="图标链接" fullWidth />
                                <TextField
                                    type="file"
                                    name="iconFile"
                                    label="更换图标 (覆盖链接)"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ accept: "image/*" }}
                                    fullWidth
                                />
                            </Box>

                            <TextField name="description" defaultValue={link.description} label="描述" fullWidth />

                            <DialogActions sx={{ px: 0, pb: 0 }}>
                                <Button onClick={() => setIsOpen(false)}>取消</Button>
                                <Button type="submit" variant="contained" disabled={isPending}>
                                    {isPending ? "保存中..." : "确认保存"}
                                </Button>
                            </DialogActions>
                        </Stack>
                    </form>
                </CustomDialog>
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
            <IconButton size="small" onClick={() => setIsOpen(true)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <EditIcon sx={{ fontSize: 14 }} />
            </IconButton>

            {mounted && (
                <CustomDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="重命名分类">
                    <form action={formAction}>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField name="title" defaultValue={category.title} label="分类名称" required fullWidth />

                            <DialogActions sx={{ px: 0, pb: 0 }}>
                                <Button onClick={() => setIsOpen(false)}>取消</Button>
                                <Button type="submit" variant="contained" disabled={isPending}>
                                    {isPending ? "保存" : "确认修改"}
                                </Button>
                            </DialogActions>
                        </Stack>
                    </form>
                </CustomDialog>
            )}
        </>
    );
}
