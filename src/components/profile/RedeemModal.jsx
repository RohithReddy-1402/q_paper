import { useEffect, useState } from "react";
import { Banknote, Check, Copy, Crown, Loader2, Wallet } from "lucide-react";
import ModalShell from "./ModalShell";
import { useToast } from "../ToastContext";
import { fetchRewardOptions, redeemCash, redeemPlan } from "../../services/rewards";
import { formatPoints } from "../../utils/format";

const PLAN_INFO = {
  monthly: { label: "Monthly", blurb: "30 days of unlimited downloads" },
  yearly: { label: "Yearly", blurb: "365 days of unlimited downloads" },
  lifetime: { label: "Lifetime", blurb: "Unlimited downloads, forever" },
};

const UPI_RE = /^[a-z0-9._-]{2,64}@[a-z][a-z0-9]{1,31}$/i;

const hasActiveLifetime = (s) => s?.plan === "lifetime" && s?.status === "active";
const rupeesEquivalent = (points, pointValuePaise) => `₹${((points * pointValuePaise) / 100).toFixed(0)}`;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // clipboard blocked (insecure context / permissions)
  }
}

/**
 * Mounted only while open. `profile` supplies the email and points balance;
 * live costs come from /api/rewards/options so prices can never drift from
 * what the server will actually charge.
 */
export default function RedeemModal({ profile, onClose, onRedeemed }) {
  const { addToast } = useToast();
  const [options, setOptions] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState("cash");

  const [amount, setAmount] = useState(null); // rupees (chip value)
  const [upiId, setUpiId] = useState("");

  const [plan, setPlan] = useState(null);
  const [recipient, setRecipient] = useState(profile.email);
  const [copied, setCopied] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchRewardOptions()
      .then((o) => !cancelled && setOptions(o))
      .catch((err) => !cancelled && setLoadError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const balance = options?.balance ?? profile.points.balance;
  const recipientEmail = recipient.trim();
  const isSelf = recipientEmail.toLowerCase() === profile.email.toLowerCase();
  const selfHasLifetime = isSelf && hasActiveLifetime(options?.subscription || profile.subscription);
  const chosenCash = options?.cash.find((c) => c.rupees === amount);

  const switchTab = (next) => {
    setTab(next);
    setConfirming(false);
  };

  const handleCopy = async () => {
    if (await copyText(recipient)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      addToast("Couldn't copy — select the email and copy it manually", "warning");
    }
  };

  // ---- validation: returns an error string or null ----
  const cashError = () => {
    if (!chosenCash) return "Choose an amount to redeem";
    if (chosenCash.points > balance) return "Not enough points for that amount";
    if (!UPI_RE.test(upiId.trim())) return "Enter a valid UPI ID (e.g. name@okaxis)";
    return null;
  };
  const planError = () => {
    if (!plan) return "Choose a plan";
    if (options.plans[plan] > balance) return "Not enough points for that plan";
    if (plan === "lifetime" && selfHasLifetime) return "You already have a Lifetime plan";
    if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) return "Enter a valid email address";
    return null;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      if (tab === "cash") {
        const res = await redeemCash({ amount, upiId: upiId.trim() });
        addToast(`₹${amount} payout requested — we'll send it to ${upiId.trim()}`, "success", 5000);
        onRedeemed(res);
      } else {
        const res = await redeemPlan({ plan, recipientEmail: isSelf ? undefined : recipientEmail });
        addToast(
          isSelf
            ? `${PLAN_INFO[plan].label} plan activated on your account!`
            : `${PLAN_INFO[plan].label} plan gifted to ${res.recipientEmail}!`,
          "success",
          5000
        );
        onRedeemed(res);
      }
      onClose();
    } catch (err) {
      addToast(err.message || "Could not redeem", "error", 5000);
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrimary = () => {
    const error = tab === "cash" ? cashError() : planError();
    if (error) {
      addToast(error, "error");
      return;
    }
    if (!confirming) {
      setConfirming(true);
      return;
    }
    submit();
  };

  const cost = tab === "cash" ? chosenCash?.points ?? 0 : plan ? options?.plans[plan] ?? 0 : 0;
  const summary =
    tab === "cash"
      ? `${formatPoints(cost)} will be deducted now and ₹${amount} sent to ${upiId.trim()}. If the payout can't be made, your points are refunded.`
      : `${formatPoints(cost)} will be deducted now and a ${plan ? PLAN_INFO[plan].label : ""} plan activated for ${isSelf ? "your account" : recipientEmail}.`;

  return (
    <ModalShell isOpen onClose={onClose} title="Redeem rewards">
      {loadError ? (
        <p className="py-8 text-center text-sm text-red-600">{loadError}</p>
      ) : !options ? (
        <div className="py-10 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm text-indigo-700">
              <Wallet className="w-4 h-4" />
              Available balance
            </span>
            <span className="text-lg font-bold text-indigo-900">{formatPoints(balance)}</span>
          </div>

          <div role="tablist" className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-medium">
            {[
              { id: "cash", label: "Cash (UPI)", icon: Banknote },
              { id: "plan", label: "Premium plan", icon: Crown },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => switchTab(id)}
                className={`inline-flex items-center justify-center gap-2 rounded-md py-2 transition-colors ${
                  tab === id ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {tab === "cash" ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Amount</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {options.cash.map(({ rupees, points }) => {
                    const disabled = points > balance;
                    return (
                      <button
                        key={rupees}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setAmount(rupees);
                          setConfirming(false);
                        }}
                        className={`flex flex-col items-center gap-0.5 rounded-lg border py-2.5 transition-colors ${
                          amount === rupees
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-gray-300 text-gray-700 hover:border-indigo-400"
                        } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300`}
                      >
                        <span className="text-sm font-semibold">₹{rupees}</span>
                        <span className="text-[11px] text-gray-400">{points} pts</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label htmlFor="rd-upi" className="block text-sm font-medium text-gray-700">UPI ID</label>
                <input
                  id="rd-upi"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setConfirming(false);
                  }}
                  placeholder="yourname@okaxis"
                  autoComplete="off"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Payouts are sent manually by our team, usually within a few days. Double-check the UPI ID.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {Object.entries(PLAN_INFO).map(([id, info]) => {
                  const planCost = options.plans[id];
                  const disabled = planCost > balance || (id === "lifetime" && selfHasLifetime);
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setPlan(id);
                        setConfirming(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        plan === id ? "border-indigo-600 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
                      } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300`}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-gray-900">{info.label}</span>
                        <span className="block text-xs text-gray-500">
                          {id === "lifetime" && selfHasLifetime ? "You already have this plan" : info.blurb}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-sm font-bold text-indigo-700">{formatPoints(planCost)}</span>
                        <span className="block text-[11px] text-gray-400">
                          ≈ {rupeesEquivalent(planCost, options.pointValuePaise)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label htmlFor="rd-recipient" className="block text-sm font-medium text-gray-700">
                  Redeem for
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="rd-recipient"
                    type="email"
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                      setConfirming(false);
                    }}
                    className="block w-full min-w-0 rounded-lg border border-gray-300 px-3 h-11 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Email copied" : "Copy email"}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  {isSelf ? (
                    "This is your email — the plan goes to your own account."
                  ) : (
                    <>
                      Gifting to a friend? They must already have an account.{" "}
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                        onClick={() => setRecipient(profile.email)}
                      >
                        Use my email instead
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {confirming && (
            <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-900">{summary}</p>
          )}

          <div className="flex justify-end gap-3">
            {confirming && (
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={submitting}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handlePrimary}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirming ? "Confirm redeem" : "Redeem"}
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
