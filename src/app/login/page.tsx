"use client";

import { useActionState } from "react"; // Updated to use useActionState
import { login } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck } from "lucide-react";

// @ts-ignore
const initialState = { error: "" };

export default function LoginPage() {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center -mt-20">
            <GlassCard className="w-full max-w-md p-8 flex flex-col items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                    <ShieldCheck className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-bold text-center">管理员登录</h1>
                <p className="text-muted-foreground text-center -mt-4 mb-2">
                    请输入密码以访问管理后台
                </p>

                <form action={formAction} className="w-full space-y-4">
                    <div className="space-y-2">
                        <Input
                            name="password"
                            type="password"
                            placeholder="请输入管理员密码..."
                            required
                            className="text-center"
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-destructive text-center font-medium">
                            {state.error}
                        </p>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                        立即登录
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
