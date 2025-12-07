"use client";

import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export type InputProps = TextFieldProps & {
    // Add any specific props if needed
};

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        backgroundColor: alpha(theme.palette.common.white, 0.05),
        backdropFilter: 'blur(10px)',
        transition: theme.transitions.create(['background-color', 'box-shadow']),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
        },
        '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.common.white, 0.15),
        }
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.common.white, 0.2),
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.common.white, 0.3),
    }
}));

import { alpha } from "@mui/material/styles";

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
    ({ className, variant = "outlined", ...props }, ref) => {
        return (
            <StyledTextField
                ref={ref}
                variant={variant}
                fullWidth
                size="small"
                className={className}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
