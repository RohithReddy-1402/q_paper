import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useToast } from "./ToastContext";
import { resendVerificationEmail } from "../services/api";

// Landing page for the link in the verification email. The backend has already
// validated the token by the time we get here and redirected to
// /email-verification?status=success|expired|error — this page only reports the
// outcome. The tab the user was already using updates itself over SSE.
const VARIANTS = {
  success: {
    icon: CheckCircle2,
    tone: "text-green-600",
    ring: "bg-green-100",
    title: "Your email is verified",
    body: "You can close this tab. If you had the site open somewhere else, it has already updated itself.",
  },
  expired: {
    icon: Clock,
    tone: "text-amber-600",
    ring: "bg-amber-100",
    title: "This link has expired",
    body: "Verification links are single-use and time-limited. Enter your email below and we'll send a fresh one.",
  },
  error: {
    icon: AlertTriangle,
    tone: "text-red-600",
    ring: "bg-red-100",
    title: "We couldn't verify your email",
    body: "Something went wrong while verifying your email. Try sending a new link, or contact us if it keeps failing.",
  },
};

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get("status");
  const status = VARIANTS[raw] ? raw : "error";
  const { icon: Icon, tone, ring, title, body } = VARIANTS[status];

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (sending || cooldown > 0 || !email.trim()) return;
    setSending(true);
    try {
      const { status: code, message, retryAfter } =
        await resendVerificationEmail(email.trim());
      if (code === 200) {
        addToast("Verification email sent", "success");
        setCooldown(30);
      } else if (code === 208) {
        addToast("This email is already verified", "success");
      } else if (code === 404) {
        addToast("No account found with that email", "error");
      } else if (code === 429) {
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

  const formatWait = (s) => (s >= 60 ? `${Math.ceil(s / 60)} min` : `${s}s`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>Email Verification | NIT KKR PYQs</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md px-6 py-10 text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full ${ring} flex items-center justify-center mb-5`}
          >
            <Icon className={`w-8 h-8 ${tone}`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-600 mb-8">{body}</p>

          {status === "success" ? (
            <Link
              to="/nit-kkr-pyqs"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-300"
            >
              Go to Home
            </Link>
          ) : (
            <>
              <form
                onSubmit={handleResend}
                className="flex flex-col sm:flex-row gap-3 text-left"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={sending || cooldown > 0}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${sending ? "animate-spin" : ""}`} />
                  {cooldown > 0
                    ? `Retry in ${formatWait(cooldown)}`
                    : sending
                      ? "Sending…"
                      : "Resend email"}
                </button>
              </form>

              <div className="mt-6 text-sm text-gray-500">
                <Link
                  to="/nit-kkr-pyqs"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Back to Home
                </Link>
                <span className="mx-2">·</span>
                <Link
                  to="/nit-kkr/contact"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Contact support
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailVerification;
