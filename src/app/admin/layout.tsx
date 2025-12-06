import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import { LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
                <form action={logout}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        退出登录
                    </Button>
                </form>
            </div>

            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
