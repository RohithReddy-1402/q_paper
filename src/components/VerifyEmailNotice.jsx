import { useCallback, useEffect, useState } from "react";
import { MailCheck, CheckCircle2, RefreshCw, X } from "lucide-react";
import { useToast } from "./ToastContext";
import {
  getToken,
  getVerificationStatus,
  resendVerificationEmail,
  watchEmailVerification,
} from "../services/api";

const RESEND_COOLDOWN = 30;

const VerifyEmailNotice = ({
  isOpen,
  email,
  reason = "signup",
  onClose,
  onVerified,
}) => {
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { addToast } = useToast();

  const markVerified = useCallback(() => {
    setVerified(true);
    addToast("Email verified", "success");
    setTimeout(() => {
      onVerified?.();
    }, 1600);
  }, [addToast, onVerified]);

  // Reset per-open so a second signup doesn't inherit the last state.
  useEffect(() => {
    if (!isOpen) return;
    setVerified(false);
    setSending(false);
    setCooldown(0);
  }, [isOpen, email]);

  useEffect(() => {
    if (!isOpen || verified || !getToken()) return;
    let active = true;
    let stop = () => {};

    getVerificationStatus().then((data) => {
      if (!active || !data) return;
      if (
        data.EmailID &&
        email &&
        data.EmailID.toLowerCase() !== email.toLowerCase()
      ) {
        return;
      }
      if (data.emailVerified) {
        markVerified();
        return;
      }
      stop = watchEmailVerification(() => {
        if (active) markVerified();
      });
    });

    return () => {
      active = false;
      stop();
    };
  }, [isOpen, verified, email, markVerified]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleResend = async () => {
    if (sending || cooldown > 0) return;
    if (!email) {
      addToast("No email address to resend to", "warning");
      return;
    }
    setSending(true);
    try {
      const { status, message, retryAfter } = await resendVerificationEmail(email);
      if (status === 200) {
        addToast("Verification email sent", "success");
        setCooldown(RESEND_COOLDOWN);
      } else if (status === 208) {
        markVerified();
      } else if (status === 404) {
        addToast("No account found with that email", "error");
      } else if (status === 429) {
        setCooldown(retryAfter || 15 * 60);
        addToast(message || "Too many requests. Please try again later.", "warning");
      } else {
        addToast(message || "Could not send the email. Please try again.", "error");
      }
    } catch (err) {
      console.error("Resend verification failed:", err);
      addToast("Network error or server down", "error");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const formatWait = (s) =>
    s >= 60 ? `${Math.ceil(s / 60)} min` : `${s}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-[80%] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6">
        <button
          type="button"
          className="absolute top-4 right-4 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" />
        </button>

        {verified ? (
          <div className="text-center py-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Email verified
            </h3>
            <p className="text-sm text-gray-600">
              You're all set. Taking you back to the site…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <MailCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                {reason === "login" ? "Verify your email" : "Check your email"}
              </h3>
              <p className="text-sm text-gray-600">
                {reason === "login"
                  ? "This account hasn't been verified yet. Open the link we sent to"
                  : "We sent a verification link to"}{" "}
                <span className="font-medium text-gray-900 break-all">
                  {email}
                </span>
                {reason === "login" ? " to sign in." : "."}
              </p>
            </div>

            {/* Only promise a live update when there is a session to stream on. */}
            {getToken() ? (
              <p className="mt-4 text-xs text-gray-500 text-center">
                Keep this tab open — it updates automatically the moment you
                click the link, even on another device.
              </p>
            ) : (
              <p className="mt-4 text-xs text-gray-500 text-center">
                Once verified, sign in again with your email and password.
              </p>
            )}

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={sending || cooldown > 0}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${sending ? "animate-spin" : ""}`}
                />
                {cooldown > 0
                  ? `Resend in ${formatWait(cooldown)}`
                  : sending
                    ? "Sending…"
                    : "Resend email"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                {reason === "login" ? "Back to sign in" : "I'll do it later"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
