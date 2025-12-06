"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingAdminTrigger() {
    return (
        <Link href="/login" className="fixed bottom-6 right-6 z-50 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 bg-background/50 backdrop-blur shadow-sm border-border/50 hover:bg-background"
            >
                <Settings className="w-4 h-4 text-muted-foreground" />
            </Button>
        </Link>
    );
}
