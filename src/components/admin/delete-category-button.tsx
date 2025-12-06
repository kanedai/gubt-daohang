"use client";

import { deleteCategory } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={async () => {
                if (confirm("确定要删除这个分类吗？分类下的所有链接也会被删除。")) {
                    await deleteCategory(categoryId);
                }
            }}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
