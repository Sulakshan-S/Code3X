import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import loginillustration from "../assets/login.png";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { auth, googleProvider } from "../firebase/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();

    const [values, setValues] = useState<FormState>({ email: "", password: "" });
    const [errors, setErrors] = useState<FormState>({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState("");
    

    const validate = (next: FormState): FormState => ({
        email: !next.email.trim()
            ? "Enter your email address"
            : !EMAIL_PATTERN.test(next.email.trim())
                ? "Enter a valid email address, like name@example.com"
                : "",
        password: !next.password
            ? "Enter your password"
            : next.password.length < 6
                ? "Password must be at least 6 characters"
                : "",
    });

    const handleChange =
        (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
            const next = { ...values, [field]: event.target.value };
            setValues(next);
            if (touched[field]) {
                setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
            }
        };

    const handleBlur = (field: keyof FormState) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
    };

    // Validation only — no backend sign-in is required by the brief.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validate(values);
        setTouched({ email: true, password: true });
        setErrors(nextErrors);
        if (nextErrors.email || nextErrors.password) return;
        setGoogleError("");
    };

    const handleGoogle = async () => {
        setGoogleError("");
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

            // The OAuth access token only exists on the credential returned here.
            sessionStorage.setItem(
                "tuga.googleSession",
                JSON.stringify({
                    accessToken: credential?.accessToken ?? "",
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                })
            );

            navigate("/token", { replace: true });
        } catch (error) {
            const code = error instanceof FirebaseError ? error.code : "";
            setGoogleError(
                code === "auth/popup-closed-by-user" ||
                    code === "auth/cancelled-popup-request"
                    ? "Sign-in was cancelled. Try again when you're ready."
                    : code === "auth/popup-blocked"
                        ? "Your browser blocked the sign-in window. Allow pop-ups and try again."
                        : code === "auth/unauthorized-domain"
                            ? "This domain isn't authorised in Firebase Authentication settings."
                            : "Google sign-in didn't complete. Try again."
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    const socials = [
        {
            label: "Continue with Google",
            icon: googleLoading ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : (
                <GoogleIcon fontSize="small" />
            ),
            onClick: handleGoogle,
            disabled: googleLoading,
        },
        { label: "Continue with Apple", icon: <AppleIcon fontSize="small" />, disabled: true },
        { label: "Continue with Facebook", icon: <FacebookIcon fontSize="small" />, disabled: true },
    ];

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 4, md: 6 },
                p: { xs: 3, sm: 4, md: 6 },
                bgcolor: "#fff",
            }}
        >
            {/* ---------- form ---------- */}
            <Box
                sx={{
                    flex: 1,
                    width: "100%",
                    order: { xs: 2, md: 1 },
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 360 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "2rem", md: "2.25rem" },
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Welcome back!
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
                        Simplify your workflow and boost your productivity with{" "}
                        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                            Tuga&apos;s App
                        </Box>
                        . Get started for free.
                    </Typography>

                    {googleError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}>
                            {googleError}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            id="email"
                            type="email"
                            placeholder="Username"
                            autoComplete="email"
                            value={values.email}
                            onChange={handleChange("email")}
                            onBlur={handleBlur("email")}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            sx={{ mb: errors.email ? 1 : 1.75 }}
                        />

                        <TextField
                            fullWidth
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                onClick={() => setShowPassword((shown) => !shown)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: "#9AA0A6" }}
                                            >
                                                {showPassword ? (
                                                    <VisibilityOutlinedIcon fontSize="small" />
                                                ) : (
                                                    <VisibilityOffOutlinedIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5, mb: 2.5 }}>
                            <Link
                                component="button"
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                underline="hover"
                                sx={{ fontSize: "0.6875rem", fontWeight: 500, color: "text.primary" }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Login
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                            or continue with
                        </Typography>
                    </Divider>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, justifyContent: "center" }}>
                        {socials.map(({ label, icon, onClick, disabled }) => (
                            <Tooltip key={label} title={label}>
                                <span>
                                    <IconButton
                                        aria-label={label}
                                        onClick={onClick}
                                        disabled={disabled}
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            bgcolor: "#BDBDBD",
                                            color: "#fff",
                                            transition: "background-color .2s ease",
                                            "&:hover": { bgcolor: "#000" },
                                            "&.Mui-disabled": { bgcolor: "#D9D9D9", color: "#fff" },
                                        }}
                                    >
                                        {icon}
                                    </IconButton>
                                </span>
                            </Tooltip>
                        ))}
                    </Box>

                    <Typography
                        variant="caption"
                        align="center"
                        color="text.secondary"
                        sx={{ display: "block", mt: 5 }}
                    >
                        Not a member?{" "}
                        <Link
                            component="button"
                            type="button"
                            onClick={() => navigate("/register")}
                            underline="hover"
                            sx={{ color: "#2FA84F", fontWeight: 600 }}
                        >
                            Register now
                        </Link>
                    </Typography>
                </Box>
            </Box>

            {/* ---------- illustration ---------- */}
            <Box
                sx={{
                    flex: 1,
                    width: "100%",
                    alignSelf: "stretch",
                    order: { xs: 1, md: 2 },
                    minHeight: { xs: 320, md: "auto" },
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        bgcolor: "#EDF3EC",
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                        px: { xs: 3, md: 6 },
                        py: { xs: 5, md: 8 },
                    }}
                >
                    <Box
                        component="img"
                        src={loginillustration}
                        alt="A person surrounded by task cards, calm and organised"
                        sx={{ width: "100%", maxWidth: 380, height: "auto", display: "block" }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        {[false, false, true].map((active, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: active ? 18 : 6,
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: active ? "#0A0A0A" : "#C3D2C1",
                                }}
                            />
                        ))}
                    </Box>

                    <Typography align="center" sx={{ maxWidth: 320 }}>
                        Make your work easier and organized with{" "}
                        <Box component="span" sx={{ fontWeight: 700 }}>
                            Tuga&apos;s App
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}