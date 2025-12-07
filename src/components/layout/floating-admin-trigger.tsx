"use client";

import SettingsIcon from "@mui/icons-material/Settings";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useActionState, useState, useEffect } from "react";
import { loginInline, logout } from "@/lib/actions";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function FloatingAdminTrigger({ isAdmin = false }: { isAdmin?: boolean }) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(loginInline, { error: "", success: false });
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isEdit = searchParams.get("edit") === "1";
    const [editMode, setEditMode] = useState<boolean>(isEdit);

    function setEdit(on: boolean) {
        const params = new URLSearchParams(searchParams.toString());
        if (on) {
            params.set("edit", "1");
        } else {
            params.delete("edit");
        }
        const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        setEditMode(on);
        router.push(url);
    }
    useEffect(() => {
        setEditMode(isEdit);
    }, [isEdit]);
    useEffect(() => {
        if (state?.success) {
            setOpen(false);
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        }
    }, [state]);

    return (
        <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {!isAdmin && (
                    <Fab
                        size="medium"
                        color="default" // or 'inherit'
                        aria-label="admin settings"
                        onClick={() => setOpen((v) => !v)}
                        sx={{
                            backgroundColor: "background.paper",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <SettingsIcon fontSize="small" color="action" />
                    </Fab>
                )}
                {isAdmin && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button
                            variant={!editMode ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setEdit(false)}
                            sx={{ borderRadius: 20 }}
                        >
                            用户
                        </Button>
                        <Button
                            variant={editMode ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setEdit(true)}
                            color="secondary" // Highlight edit mode
                            sx={{ borderRadius: 20 }}
                        >
                            编辑
                        </Button>
                        <form action={logout}>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ borderRadius: 20, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                                type="submit"
                            >
                                退出
                            </Button>
                        </form>
                    </Box>
                )}
            </Box>

            {!isAdmin && open && (
                <Paper
                    component="form"
                    action={formAction}
                    elevation={4}
                    sx={{
                        mt: 1,
                        p: 2,
                        width: 280,
                        backgroundColor: "background.paper", // Should pick up glass effect if configured in theme or overridden here
                        backdropFilter: "blur(12px)",
                        borderRadius: 2,
                        position: 'absolute',
                        bottom: 48,
                        right: 0,
                    }}
                >
                    <Stack spacing={2}>
                        <TextField
                            name="password"
                            type="password"
                            placeholder="管理员密码"
                            fullWidth
                            size="small"
                            variant="outlined"
                            autoFocus
                        />
                        {state?.error && (
                            <Typography variant="caption" color="error">
                                {state.error}
                            </Typography>
                        )}
                        <Stack direction="row" spacing={1}>
                            <Button type="submit" variant="contained" size="small" fullWidth disabled={isPending}>
                                登录
                            </Button>
                            <Button type="button" variant="text" size="small" onClick={() => setOpen(false)}>
                                取消
                            </Button>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" align="center">
                            登录后可在首页直接管理链接
                        </Typography>
                    </Stack>
                </Paper>
            )}
        </Box>
    );
}
