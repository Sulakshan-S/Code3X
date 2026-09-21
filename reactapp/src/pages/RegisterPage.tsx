import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import registerIllustration from "../assets/register.png";

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
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type FormErrors = FormState;

export default function RegisterPage() {
    const navigate = useNavigate();

    const [values, setValues] = useState<FormState>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<FormErrors>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState("");

    const validate = (next: FormState): FormErrors => ({
        name: !next.name.trim() ? "Enter your full name" : "",
        email: !next.email.trim()
            ? "Enter your email address"
            : !EMAIL_PATTERN.test(next.email.trim())
                ? "Enter a valid email address, like name@example.com"
                : "",
        password: !next.password
            ? "Create a password"
            : next.password.length < 6
                ? "Password must be at least 6 characters"
                : "",
        confirmPassword: !next.confirmPassword
            ? "Confirm your password"
            : next.confirmPassword !== next.password
                ? "Passwords don't match"
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

    // Validation only — no backend registration call, matching the login page's brief.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validate(values);
        setTouched({ name: true, email: true, password: true, confirmPassword: true });
        setErrors(nextErrors);
        if (Object.values(nextErrors).some(Boolean)) return;
        setSubmitted(true);
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
                        Create an account
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
                        Join{" "}
                        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                            Tuga&apos;s App
                        </Box>{" "}
                        and start organizing your work today.
                    </Typography>

                    {googleError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}>
                            {googleError}
                        </Alert>
                    )}

                    {submitted && (
                        <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}>
                            Account details look good. Redirecting you to sign in…
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            id="name"
                            type="text"
                            placeholder="Full name"
                            autoComplete="name"
                            value={values.name}
                            onChange={handleChange("name")}
                            onBlur={handleBlur("name")}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            sx={{ mb: errors.name ? 1 : 1.75 }}
                        />

                        <TextField
                            fullWidth
                            id="email"
                            type="email"
                            placeholder="Email"
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
                            autoComplete="new-password"
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            sx={{ mb: errors.password ? 1 : 1.75 }}
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

                        <TextField
                            fullWidth
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            value={values.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            onBlur={handleBlur("confirmPassword")}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                            sx={{ mb: errors.confirmPassword ? 1 : 2.5 }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showConfirm ? "Hide password" : "Show password"}
                                                onClick={() => setShowConfirm((shown) => !shown)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: "#9AA0A6" }}
                                            >
                                                {showConfirm ? (
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

                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Create account
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
                        Already a member?{" "}
                        <Link
                            component="button"
                            type="button"
                            onClick={() => navigate("/")}
                            underline="hover"
                            sx={{ color: "#2FA84F", fontWeight: 600 }}
                        >
                            Login
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
                        src={registerIllustration}
                        alt="A person surrounded by task cards, calm and organised"
                        sx={{ width: "100%", maxWidth: 380, height: "auto", display: "block" }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        {[true, false, false].map((active, index) => (
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