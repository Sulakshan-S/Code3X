import { Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import TokenPage from "./pages/TokenPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/token" element={<TokenPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}