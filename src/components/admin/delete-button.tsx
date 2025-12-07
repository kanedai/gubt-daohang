"use client";

import { deleteLink } from "@/lib/actions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

export function DeleteLinkButton({ categoryId, linkId }: { categoryId: string, linkId: string }) {
    return (
        <Tooltip title="Delete">
            <IconButton
                size="small"
                onClick={() => deleteLink(categoryId, linkId)}
                sx={{
                    color: 'text.secondary',
                    '&:hover': {
                        color: 'error.main',
                        bgcolor: 'error.lighter' // or simplified
                    }
                }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}
