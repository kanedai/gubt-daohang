"use client";

import * as React from "react";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

interface FastTooltipProps extends Omit<TooltipProps, "title"> {
    tooltipText: React.ReactNode;
    children: React.ReactElement; // MUI Tooltip requires a single child element
}

export function FastTooltip({ children, tooltipText, ...props }: FastTooltipProps) {
    if (!tooltipText) return children;

    return (
        <Tooltip
            title={tooltipText}
            TransitionComponent={Zoom}
            arrow
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                        color: 'text.primary',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: 3,
                        fontSize: '0.75rem',
                    }
                },
                arrow: {
                    sx: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                }
            }}
            {...props}
        >
            {children}
        </Tooltip>
    );
}
