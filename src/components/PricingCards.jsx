import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, Star, Loader2, Info, X, Sparkles } from "lucide-react";
import { useToast } from "./ToastContext";
import { PLANS, openCheckout } from "../services/payment";
import PriceFeedbackModal from "./PriceFeedbackModal";

const PROMPT_DISMISSED_KEY = "priceFeedbackPromptDismissed";

const COMMON_FEATURES = [
  "Unlimited question paper downloads",
  "Unlimited paper previews",
  "Access to every branch & semester",
  "Supports hosting & storage costs",
];

// Roadmap features, not live yet — shown separately and visually highlighted
// (not mixed into the plain checklist above) so it's clear these are
// upcoming, not already-included, and which platform(s) each lands on.
const UPCOMING_FEATURES = [
  { text: "PYQs & syllabus viewing in the app", platforms: ["App"] },
  { text: "Attendance management", platforms: ["App"] },
  { text: "Customized notifications from your institution (results, academic updates, job & placement alerts)", platforms: ["App", "Web"] },
  { text: "Doubt-solving discussion forum (Reddit inspired)", platforms: ["App", "Web"] },
];

const PLAN_META = {
  monthly: {
    tagline: "Billed every month, cancel anytime.",
    highlight: false,
  },
  yearly: {
    tagline: "Billed once a year — our best per-month value.",
    highlight: true,
  },
  lifetime: {
    tagline: "One-time payment. Never pay again.",
    highlight: false,
  },
};

const monthly = PLANS.find((p) => p.id === "monthly")?.rawPrice ?? 0;
const yearly = PLANS.find((p) => p.id === "yearly")?.rawPrice ?? 0;
const lifetime = PLANS.find((p) => p.id === "lifetime")?.rawPrice ?? 0;

// Computed from the actual prices (never hardcoded) so these stay correct
// automatically if a price ever changes again.
const YEARLY_SAVINGS_PCT = monthly > 0 ? Math.round((1 - yearly / (monthly * 12)) * 100) : 0;
// A typical degree here runs ~4 years, so lifetime is compared against 4
// years of the monthly plan rather than 1 — that's the honest "what would
// this actually cost you over the time you'd use it" comparison.
const LIFETIME_YEARS_COMPARED = 4;
const LIFETIME_SAVINGS_PCT =
  monthly > 0 ? Math.round((1 - lifetime / (monthly * 12 * LIFETIME_YEARS_COMPARED)) * 100) : 0;

const SAVINGS_BADGE = {
  yearly: YEARLY_SAVINGS_PCT > 0 ? `Save ${YEARLY_SAVINGS_PCT}% vs paying monthly` : null,
  lifetime:
    LIFETIME_SAVINGS_PCT > 0
      ? `Save ${LIFETIME_SAVINGS_PCT}% vs ${LIFETIME_YEARS_COMPARED} years monthly`
      : null,
};

/**
 * Plan grid + Razorpay checkout trigger, shared by the homepage preview
 * section and the dedicated /nit-kkr/pricing page.
 */
export default function PricingCards({ isLoggedIn, user, onLoginClick, onPurchased }) {
  const [pendingPlan, setPendingPlan] = useState(null);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === "true";
    } catch {
      /* storage unavailable — just show it */
    }
    if (dismissed) return;
    // Appears after a short delay rather than on first paint, so it reads as
    // a deliberate notice someone will actually notice, not a jarring
    // instant popup fighting for attention with the rest of the page.
    const timer = setTimeout(() => setShowPrompt(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
    } catch {
      /* storage unavailable — just hide it for this session */
    }
  };

  const openFeedbackFromPrompt = () => {
    setShowPrompt(false);
    setFeedbackOpen(true);
  };

  const handleSelectPlan = (planId) => {
    if (!isLoggedIn) {
      addToast("Please sign in first to buy a plan.", "info");
      onLoginClick?.();
      return;
    }
    setPendingPlan(planId);
    openCheckout({
      plan: planId,
      user,
      onSuccess: () => {
        setPendingPlan(null);
        onPurchased?.();
      },
      onError: (err) => {
        setPendingPlan(null);
        if (err?.message !== "Checkout cancelled") {
          addToast(err?.message || "Payment failed. Please try again.", "error");
        }
      },
    });
  };

  const isCurrentPlan = (planId) =>
    isLoggedIn &&
    user?.subscription?.status === "active" &&
    user?.subscription?.plan === planId;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-900">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Prices were adjusted to help cover the cost of running the website,
          app, and services. These are our final prices — no further changes
          are planned. Not happy with them?{" "}
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="underline font-medium hover:text-blue-700"
          >
            Let us know what you'd pay
          </button>
          .
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {PLANS.map((plan) => {
        const meta = PLAN_META[plan.id];
        const current = isCurrentPlan(plan.id);
        return (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg ${
              meta.highlight ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
            }`}
          >
            {meta.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow">
                <Star className="w-3 h-3" />
                Most Popular
              </span>
            )}

            <h3 className="text-lg font-semibold text-gray-900">{plan.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{meta.tagline}</p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.period}</span>
            </div>
            {SAVINGS_BADGE[plan.id] && (
              <p className="mt-1 text-xs font-medium text-green-600">{SAVINGS_BADGE[plan.id]}</p>
            )}

            <div className="mt-6 flex-1">
              <ul className="space-y-3">
                {COMMON_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-700 mb-2">
                  Coming soon
                </p>
                <ul className="space-y-2.5">
                  {UPCOMING_FEATURES.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2 text-sm text-gray-700">
                      <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {feature.text}
                        <span className="ml-1.5 inline-flex gap-1 align-middle">
                          {feature.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="inline-block rounded-full bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5"
                            >
                              {platform}
                            </span>
                          ))}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              disabled={pendingPlan === plan.id || current}
              onClick={() => handleSelectPlan(plan.id)}
              className={`mt-6 w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 disabled:opacity-60 ${
                meta.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
              }`}
            >
              {pendingPlan === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
              {current ? "Current plan" : pendingPlan === plan.id ? "Processing..." : "Choose " + plan.label}
            </button>
          </div>
        );
      })}
      </div>

      {showPrompt &&
        createPortal(
          <div className="fixed top-20 right-4 z-60 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-xl animate-[fadeIn_0.3s_ease-out]">
            <button
              type="button"
              onClick={dismissPrompt}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Dismiss</span>
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-semibold text-gray-900 pr-4">
              Not happy with the prices?
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Let us know why — takes 10 seconds.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={openFeedbackFromPrompt}
                className="flex-1 rounded-md bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Tell us
              </button>
              <button
                type="button"
                onClick={dismissPrompt}
                className="flex-1 rounded-md border border-gray-300 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Not now
              </button>
            </div>
          </div>,
          document.body
        )}

      <PriceFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
