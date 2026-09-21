import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import {
    Avatar,
    Box,
    Button,
    Paper,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";

import { auth } from "../firebase/config";

interface GoogleSession {
    accessToken: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export default function TokenPage() {
    const navigate = useNavigate();
    const [session, setSession] = useState<GoogleSession | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem("tuga.googleSession");
        if (!raw) {
            navigate("/", { replace: true });
            return;
        }
        setSession(JSON.parse(raw) as GoogleSession);
    }, [navigate]);

    const handleCopy = async () => {
        if (!session) return;
        await navigator.clipboard.writeText(session.accessToken);
        setCopied(true);
    };

    const handleSignOut = async () => {
        sessionStorage.removeItem("tuga.googleSession");
        await signOut(auth);
        navigate("/", { replace: true });
    };

    if (!session) return null;

    return (
        <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3 }}>
            <Paper
                variant="outlined"
                sx={{ width: "100%", maxWidth: 620, p: { xs: 3, sm: 4 }, borderRadius: 3 }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", spacing: 2, alignItems: "center", sx: { mb: 3 } }}>
                    <Avatar src={session.photoURL ?? undefined} alt={session.displayName ?? "User"} />
                    <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                            {session.displayName ?? "Signed in"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {session.email}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Google access token
                </Typography>

                <Box
                    component="code"
                    sx={{
                        display: "block",
                        bgcolor: "#F5F6F7",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 2,
                        fontSize: 12,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        wordBreak: "break-all",
                    }}
                >
                    {session.accessToken || "No access token was returned for this sign-in."}
                </Box>

                <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={handleCopy} disabled={!session.accessToken}>
                        Copy token
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={handleSignOut}>
                        Sign out
                    </Button>
                </Stack>
            </Paper>

            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                message="Token copied"
            />
        </Box>
    );
}