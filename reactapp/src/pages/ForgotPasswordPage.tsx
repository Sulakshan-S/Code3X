import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import forgotPasswordIllustration from "../assets/forgot_password.png";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (value: string): string => {
    if (!value.trim()) return "Enter your email address";
    if (!EMAIL_PATTERN.test(value.trim())) {
      return "Enter a valid email address, like name@example.com";
    }
    return "";
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setEmail(next);
    if (touched) setError(validate(next));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(email));
  };

  // Validation only — no backend reset-email call, matching the login page's brief.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextError = validate(email);
    setTouched(true);
    setError(nextError);
    if (nextError) return;
    setSubmitted(true);
  };

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
          <Link
            component="button"
            type="button"
            onClick={() => navigate("/")}
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              color: "text.secondary",
              fontSize: "0.8125rem",
              fontWeight: 500,
              mb: 3,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 12 }} />
            Back to login
          </Link>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "2.25rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Forgot password?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
            No worries. Enter the email linked to your{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              Tuga&apos;s App
            </Box>{" "}
            account and we&apos;ll send a link to reset it.
          </Typography>

          {submitted ? (
            <Alert severity="success" sx={{ borderRadius: 2, fontSize: 13 }}>
              If an account exists for {email.trim()}, a reset link is on its way.
            </Alert>
          ) : (
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(error)}
                helperText={error}
                sx={{ mb: error ? 1 : 2.5 }}
              />

              <Button type="submit" fullWidth variant="contained" color="primary">
                Send reset link
              </Button>
            </Box>
          )}

          <Typography
            variant="caption"
            align="center"
            color="text.secondary"
            sx={{ display: "block", mt: 5 }}
          >
            Remembered it after all?{" "}
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
            src={forgotPasswordIllustration}
            alt="A person surrounded by task cards, calm and organised"
            sx={{ width: "100%", maxWidth: 380, height: "auto", display: "block" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {[false, true, false].map((active, index) => (
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