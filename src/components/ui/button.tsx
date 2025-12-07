"use client";

import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
    // Common overrides if needed
}));

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        // Map custom variants to MUI props
        let muiVariant: MuiButtonProps["variant"] = "contained";
        let muiColor: MuiButtonProps["color"] = "primary";
        let sx = {};

        switch (variant) {
            case "primary":
                muiVariant = "contained";
                muiColor = "primary";
                break;
            case "secondary":
                muiVariant = "contained";
                muiColor = "secondary";
                break;
            case "ghost":
                muiVariant = "text";
                muiColor = "primary"; // or inherit
                break;
            case "destructive":
                muiVariant = "contained";
                muiColor = "error";
                break;
            case "outline":
                muiVariant = "outlined";
                muiColor = "primary"; // or inherit
                break;
        }

        // Map sizes
        let muiSize: MuiButtonProps["size"] = "medium";
        if (size === "sm") muiSize = "small";
        if (size === "lg") muiSize = "large";

        // Icon size handling might need custom sx if "icon" size is strictly defined as square
        if (size === "icon") {
            muiSize = "medium";
            sx = { minWidth: 40, width: 40, p: 0, borderRadius: '50%' };
        }

        return (
            <MuiButton
                ref={ref}
                variant={muiVariant}
                color={muiColor}
                size={muiSize}
                sx={sx}
                className={className} // Pass className for any residual Tailwind usage or overrides
                disableElevation={variant === "ghost"}
                {...props}
            >
                {children}
            </MuiButton>
        );
    }
);
Button.displayName = "Button";
