import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

const theme = createTheme({
    palette: {
        mode: "light",
    },
    typography: {
        fontFamily: inter.style.fontFamily,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none", // Disable uppercase transformation
                },
            },
        },
    },
});

export default theme;
