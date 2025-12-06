"use client";

import { deleteLink } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteLinkButton({ categoryId, linkId }: { categoryId: string, linkId: string }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteLink(categoryId, linkId)}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
