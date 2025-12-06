"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <div className="flex items-center gap-2">
                    {!isAdmin && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10 bg-background/50 backdrop-blur shadow-sm border-border/50"
                            onClick={() => setOpen((v) => !v)}
                        >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    )}
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            {/* 视角指示与切换：用户 / 编辑 */}
                            <Button
                                variant={!editMode ? "primary" : "outline"}
                                size="sm"
                                className={"rounded-full px-3 h-9"}
                                onClick={() => setEdit(false)}
                            >
                                用户
                            </Button>
                            <Button
                                variant={editMode ? "primary" : "outline"}
                                size="sm"
                                className={"rounded-full px-3 h-9"}
                                onClick={() => setEdit(true)}
                            >
                                编辑
                            </Button>
                            {/* 任何页面提供退出管理员 */}
                            <form action={logout}>
                                <Button variant="ghost" size="sm" className="rounded-full px-3 h-9 text-muted-foreground hover:text-destructive">退出管理员</Button>
                            </form>
                        </div>
                    )}
                </div>
                {!isAdmin && open && (
                    <div className="mt-2 p-3 rounded-xl border border-white/10 bg-background/80 backdrop-blur shadow-lg w-64">
                        <form action={formAction} className="space-y-2">
                            <input name="password" type="password" placeholder="管理员密码" className="w-full h-9 rounded-md px-3 bg-background border border-white/10" />
                            {state?.error && <div className="text-[12px] text-destructive">{state.error}</div>}
                            <div className="flex gap-2">
                                <Button type="submit" size="sm" className="flex-1" disabled={isPending}>登录</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>取消</Button>
                            </div>
                            <div className="text-[11px] text-muted-foreground">登录后可在首页直接管理链接</div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
