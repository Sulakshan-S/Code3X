import { createTheme } from "@mui/material/styles";

/**
 * Tokens from the reference design:
 * ink   #000000  headline + primary button
 * muted #8A8F98  helper copy and placeholders
 * line  #E3E6E8  input borders and dividers
 * mint  #EDF3EC  illustration panel background
 * leaf  #2FA84F  "Register now" accent
 */
const theme = createTheme({
    palette: {
        primary: { main: "#000000", contrastText: "#FFFFFF" },
        secondary: { main: "#2FA84F" },
        background: { default: "#FFFFFF", paper: "#FFFFFF" },
        text: { primary: "#0A0A0A", secondary: "#8A8F98" },
        divider: "#E3E6E8",
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: '"Poppins", "Helvetica Neue", Arial, sans-serif',
        h1: {
            fontSize: "2.25rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
        },
        body2: { fontSize: "0.8125rem", lineHeight: 1.6 },
        button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontSize: "0.875rem",
                    "& fieldset": { borderColor: "#E3E6E8" },
                    "&:hover fieldset": { borderColor: "#C9CDD2" },
                    "&.Mui-focused fieldset": { borderWidth: 1, borderColor: "#0A0A0A" },
                },
                input: {
                    padding: "13px 16px",
                    "&::placeholder": { color: "#9AA0A6", opacity: 1 },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 10, boxShadow: "none" },
            },
            variants: [
                {
                    props: { variant: "contained", color: "primary" },
                    style: {
                        paddingBlock: 11,
                        "&:hover": { backgroundColor: "#1A1A1A", boxShadow: "none" },
                    },
                },
            ],
        },
    },
});

export default theme;