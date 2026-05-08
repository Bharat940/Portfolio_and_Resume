"use client";

import { m, AnimatePresence } from "motion/react";
import {
  Shield,
  Globe,
  AlertCircle,
  Mail,
  Lock,
  UserPlus,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PixelGitHub } from "@/components/icons/PixelGitHub";

type AuthMode = "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD" | "OTP_VERIFY";

export function LoginOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>("SIGN_IN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const requirements = useMemo(
    () => [
      { label: "8+ Characters", met: password.length >= 8 },
      { label: "Uppercase", met: /[A-Z]/.test(password) },
      { label: "Number", met: /[0-9]/.test(password) },
      { label: "Special Char", met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  );

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0; i < 16; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(retVal);
    setConfirmPassword(retVal);
    setShowPassword(true);
  };

  const getStrengthColor = (s: number) => {
    if (s < 50) return "bg-ctp-red";
    if (s < 75) return "bg-ctp-yellow";
    return "bg-ctp-green";
  };

  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsLoading(true);
    setError(null);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type:
          mode === "FORGOT_PASSWORD" ||
          (mode === "OTP_VERIFY" && message?.includes("Password"))
            ? "forget-password"
            : "email-verification",
      });

      if (error) throw error;

      setMessage("A fresh verification signal has been transmitted.");
      startCooldown();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setMessage(null);
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    await authClient.signIn.social({
      provider,
      callbackURL: window.location.href,
    });
  };

  const handleAction = async () => {
    resetForm();
    setIsLoading(true);

    try {
      if (mode === "SIGN_IN") {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          // If the error is email not verified (status 403 in Better Auth)
          if (error.status === 403) {
            await authClient.emailOtp.sendVerificationOtp({
              email,
              type: "email-verification",
            });
            setMode("OTP_VERIFY");
            setMessage("Identity unverified. A new code has been transmitted.");
            return;
          }
          throw error;
        }
        onClose();
      } else if (mode === "SIGN_UP") {
        if (password !== confirmPassword)
          throw new Error("Passwords do not match.");

        const { error } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0], // Default name from email
        });

        if (error) throw error;

        setMode("OTP_VERIFY");
        setMessage(
          "Verification code sent to your terminal. Check your inbox.",
        );
      } else if (mode === "FORGOT_PASSWORD") {
        const { error } = await authClient.emailOtp.requestPasswordReset({
          email,
        });
        if (error) throw error;
        setMode("OTP_VERIFY");
        setMessage("Password reset protocol code sent.");
      } else if (mode === "OTP_VERIFY") {
        if (message?.includes("Password")) {
          const { error } = await authClient.emailOtp.resetPassword({
            email,
            otp,
            password,
          });
          if (error) throw error;
          setMode("SIGN_IN");
          setMessage("Password updated. System keys synchronized.");
        } else {
          const { error } = await authClient.emailOtp.verifyEmail({
            email,
            otp,
          });
          if (error) throw error;
          setMode("SIGN_IN");
          setMessage("Identity verified. You may now sign in.");
        }
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Protocol failure. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
        >
          <m.div
            data-testid="login-overlay"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md max-h-[95vh] overflow-y-auto bg-card border border-border/50 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl relative scrollbar-hide"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-ctp-mauve/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-muted-foreground hover:text-foreground transition-colors z-50"
            >
              <span className="text-xl md:text-2xl">×</span>
            </button>

            <div className="relative z-10 space-y-5 md:space-y-6">
              {/* Header */}
              <div className="text-center space-y-1 md:space-y-2">
                <div className="inline-flex p-2.5 md:p-3 bg-ctp-mauve/10 rounded-xl md:rounded-2xl text-ctp-mauve mb-1 md:mb-2">
                  {mode === "SIGN_IN" && (
                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                  {mode === "SIGN_UP" && (
                    <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                  {mode === "FORGOT_PASSWORD" && (
                    <KeyRound className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                  {mode === "OTP_VERIFY" && (
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-black font-heading uppercase tracking-tight">
                  {mode === "SIGN_IN" && "System Access"}
                  {mode === "SIGN_UP" && "Identity Creation"}
                  {mode === "FORGOT_PASSWORD" && "Access Recovery"}
                  {mode === "OTP_VERIFY" && "Identity Verification"}
                </h2>
                <p className="text-[9px] md:text-xs text-muted-foreground font-mono uppercase tracking-widest px-4 md:px-0">
                  {mode === "SIGN_IN" && "Decrypt your session"}
                  {mode === "SIGN_UP" && "Join the technical discourse"}
                  {mode === "FORGOT_PASSWORD" && "Reset your system keys"}
                  {mode === "OTP_VERIFY" && "Verifying encrypted signal"}
                </p>
              </div>

              {/* Messages */}
              {error && (
                <div className="p-3 bg-ctp-red/10 border border-ctp-red/20 rounded-xl text-ctp-red text-[10px] flex items-center gap-2 font-mono uppercase">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              {message && (
                <div className="p-3 bg-ctp-green/10 border border-ctp-green/20 rounded-xl text-ctp-green text-[10px] flex items-center gap-2 font-mono uppercase">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
                </div>
              )}

              {/* Social Login (Only on main modes) */}
              {(mode === "SIGN_IN" || mode === "SIGN_UP") && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSocialLogin("github")}
                    variant="outline"
                    className="rounded-xl border-border/50 bg-background/50 hover:bg-ctp-mauve/5 gap-2 h-10 text-[10px] uppercase font-mono tracking-widest"
                  >
                    <PixelGitHub className="w-4 h-4" /> GitHub
                  </Button>
                  <Button
                    onClick={() => handleSocialLogin("google")}
                    variant="outline"
                    className="rounded-xl border-border/50 bg-background/50 hover:bg-ctp-mauve/5 gap-2 h-10 text-[10px] uppercase font-mono tracking-widest"
                  >
                    <Globe className="w-4 h-4" /> Google
                  </Button>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest bg-card px-2 text-muted-foreground">
                  {mode === "OTP_VERIFY"
                    ? "Enter Protocol Code"
                    : "System Auth"}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                {mode !== "OTP_VERIFY" && (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="EMAIL@TERMINAL.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-10 rounded-xl bg-background/50 border-border/50 focus:border-ctp-mauve/50 font-mono text-[11px]"
                    />
                  </div>
                )}

                {(mode === "SIGN_IN" ||
                  mode === "SIGN_UP" ||
                  (mode === "OTP_VERIFY" && message?.includes("Password"))) && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="PASSWORD"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 pl-10 pr-10 rounded-xl bg-background/50 border-border/50 focus:border-ctp-mauve/50 font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {mode === "SIGN_UP" && password.length > 0 && (
                      <div className="space-y-3 px-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest">
                            <span className="text-muted-foreground">
                              Entropy Level
                            </span>
                            <span
                              className={getStrengthColor(
                                passwordStrength,
                              ).replace("bg-", "text-")}
                            >
                              {passwordStrength < 50
                                ? "Weak"
                                : passwordStrength < 100
                                  ? "Medium"
                                  : "Strong"}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-border/30 rounded-full overflow-hidden">
                            <m.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              className={`h-full ${getStrengthColor(passwordStrength)}`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {requirements.map((req) => (
                            <div
                              key={req.label}
                              className="flex items-center gap-1.5"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${req.met ? "bg-ctp-green" : "bg-border/50"}`}
                              />
                              <span
                                className={`text-[7px] font-mono uppercase tracking-tighter ${req.met ? "text-ctp-green" : "text-muted-foreground"}`}
                              >
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === "SIGN_UP" && (
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="CONFIRM PASSWORD"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 pl-10 pr-10 rounded-xl bg-background/50 border-border/50 focus:border-ctp-mauve/50 font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={generatePassword}
                      className="h-8 rounded-lg border border-dashed border-ctp-mauve/20 text-ctp-mauve text-[8px] uppercase font-mono tracking-widest hover:bg-ctp-mauve/10"
                    >
                      <KeyRound className="w-3 h-3 mr-2" /> Generate Secure Key
                    </Button>
                  </div>
                )}

                {mode === "OTP_VERIFY" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="ENTER CODE"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-11 pl-10 rounded-xl bg-background/50 border-border/50 focus:border-ctp-mauve/50 font-mono text-[11px] tracking-[0.5em] text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isLoading}
                      className="w-full text-center text-[8px] font-mono uppercase tracking-widest text-muted-foreground hover:text-ctp-mauve transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendCooldown > 0
                        ? `Resend Signal in ${resendCooldown}s`
                        : "Resend Verification Code"}
                    </button>
                  </div>
                )}

                <Button
                  onClick={handleAction}
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-ctp-mauve hover:bg-ctp-mauve/80 text-background font-bold uppercase tracking-widest text-[11px]"
                >
                  {isLoading
                    ? "Executing..."
                    : mode === "SIGN_IN"
                      ? "Authorize"
                      : mode === "SIGN_UP"
                        ? "Initialize Account"
                        : mode === "FORGOT_PASSWORD"
                          ? "Reset Access"
                          : "Verify Signal"}
                </Button>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col gap-3 pt-2 text-[10px] font-mono uppercase tracking-widest text-center">
                {mode === "SIGN_IN" && (
                  <>
                    <button
                      onClick={() => setMode("SIGN_UP")}
                      className="text-muted-foreground hover:text-ctp-mauve transition-colors"
                    >
                      No Identity?{" "}
                      <span className="text-ctp-mauve font-bold">Register</span>
                    </button>
                    <button
                      onClick={() => setMode("FORGOT_PASSWORD")}
                      className="text-muted-foreground hover:text-ctp-mauve transition-colors"
                    >
                      Lost Access Keys?
                    </button>
                  </>
                )}

                {mode !== "SIGN_IN" && (
                  <button
                    onClick={() => setMode("SIGN_IN")}
                    className="flex items-center justify-center gap-2 text-muted-foreground hover:text-ctp-mauve transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Return to Login
                  </button>
                )}
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
