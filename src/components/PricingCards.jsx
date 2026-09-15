import { useState } from "react";
import { Check, Star, Loader2 } from "lucide-react";
import { useToast } from "./ToastContext";
import { PLANS, openCheckout } from "../services/payment";

const COMMON_FEATURES = [
  "Unlimited question paper downloads",
  "Unlimited paper previews",
  "Access to every branch & semester",
  "Supports hosting & storage costs",
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

/**
 * Plan grid + Razorpay checkout trigger, shared by the homepage preview
 * section and the dedicated /nit-kkr/pricing page.
 */
export default function PricingCards({ isLoggedIn, user, onLoginClick, onPurchased }) {
  const [pendingPlan, setPendingPlan] = useState(null);
  const { addToast } = useToast();

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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
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

            <ul className="mt-6 space-y-3 flex-1">
              {COMMON_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

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
  );
}
