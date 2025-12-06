"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/20 bg-white/5 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img src="/favi.svg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </Link>
            </div>
        </nav>
    );
}
