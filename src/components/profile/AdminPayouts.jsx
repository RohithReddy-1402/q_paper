import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, Copy, Gift, Loader2, Sparkles, Wallet, X } from "lucide-react";
import ModalShell from "./ModalShell";
import { useToast } from "../ToastContext";
import { fetchPayouts, markPayoutPaid, rejectPayout, grantBonus, fetchBonusGrants } from "../../services/rewards";
import { BONUS_REASONS } from "./bonusReasons";
import { formatDateTime, formatPoints, formatRupees } from "../../utils/format";

const SECTIONS = [
  { id: "payouts", label: "Cash payouts", icon: Wallet },
  { id: "bonus", label: "Bonus points", icon: Gift },
];

const STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "rejected", label: "Rejected" },
];

function CashPayouts({ addToast }) {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null); // { type: "paid" | "reject", payout }
  const [field, setField] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (reset) => {
      setLoading(true);
      setError(null);
      try {
        const page = await fetchPayouts(status, reset ? null : cursor);
        setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
        setHasMore(page.hasMore);
        setCursor(page.nextCursor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [status, cursor]
  );

  useEffect(() => {
    load(true);
    // reload only when the status filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast("UPI ID copied", "success", 1500);
    } catch {
      addToast("Couldn't copy — select it manually", "warning");
    }
  };

  const openAction = (type, payout) => {
    setAction({ type, payout });
    setField("");
  };

  const confirmAction = async () => {
    setBusy(true);
    try {
      if (action.type === "paid") await markPayoutPaid(action.payout._id, field);
      else await rejectPayout(action.payout._id, field);
      setItems((prev) => prev.filter((p) => p._id !== action.payout._id));
      addToast(action.type === "paid" ? "Marked as paid" : "Rejected and refunded", "success");
      setAction(null);
    } catch (err) {
      addToast(err.message, "error");
      if (err.status === 409) {
        setItems((prev) => prev.filter((p) => p._id !== action.payout._id));
        setAction(null);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <p className="mt-1 text-sm text-gray-600">
        Pay each request by UPI, then mark it paid. Rejecting refunds the points to the contributor's balance.
      </p>

      <div role="tablist" className="mt-5 inline-flex rounded-lg bg-gray-200/70 p-1 text-sm font-medium">
        {STATUSES.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={status === id}
            onClick={() => setStatus(id)}
            className={`rounded-md px-4 py-1.5 transition-colors ${
              status === id ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
        {error && <p className="p-6 text-center text-sm text-red-600">{error}</p>}
        {loading && !items.length && (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        )}
        {!loading && !error && !items.length && (
          <p className="py-12 text-center text-sm text-gray-500">No {status} payouts.</p>
        )}

        <ul className="divide-y divide-gray-100">
          {items.map((p) => (
            <li key={p._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {p.user?.name || "Unknown user"}
                  {p.user?.rollNumber && <span className="font-normal text-gray-500"> · {p.user.rollNumber}</span>}
                </p>
                <p className="text-xs text-gray-500 break-all">{p.user?.email}</p>
                <button
                  type="button"
                  onClick={() => copy(p.upiId)}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700 hover:bg-gray-200"
                  title="Copy UPI ID"
                >
                  {p.upiId}
                  <Copy className="w-3 h-3" />
                </button>
                <p className="mt-1.5 text-xs text-gray-400">
                  Requested {formatDateTime(p.createdAt)}
                  {p.processedAt && ` · Processed ${formatDateTime(p.processedAt)}`}
                  {p.txnRef && ` · Ref ${p.txnRef}`}
                  {p.note && ` · ${p.note}`}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-right">
                  <span className="block text-lg font-bold text-gray-900">{formatRupees(p.amount * 10)}</span>
                  <span className="block text-xs text-gray-400">{formatPoints(p.amount)}</span>
                </span>
                {p.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openAction("paid", p)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-700 px-3 py-2 text-sm font-medium text-white"
                    >
                      <Check className="w-4 h-4" />
                      Paid
                    </button>
                    <button
                      type="button"
                      onClick={() => openAction("reject", p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="p-4 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => load(false)}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      <ModalShell
        isOpen={Boolean(action)}
        onClose={() => !busy && setAction(null)}
        title={action?.type === "paid" ? "Mark as paid" : "Reject & refund"}
        maxWidth="sm:max-w-md"
      >
        {action && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {action.type === "paid"
                ? `Confirm you've sent ${formatRupees(action.payout.amount * 10)} to ${action.payout.upiId}.`
                : `${formatPoints(action.payout.amount)} will be returned to ${action.payout.user?.name || "the user"}'s balance.`}
            </p>
            <div>
              <label htmlFor="payout-field" className="block text-sm font-medium text-gray-700">
                {action.type === "paid" ? "UPI transaction reference (optional)" : "Reason (optional)"}
              </label>
              <input
                id="payout-field"
                value={field}
                onChange={(e) => setField(e.target.value)}
                maxLength={action.type === "paid" ? 100 : 300}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAction(null)}
                disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                disabled={busy}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                  action.type === "paid" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {action.type === "paid" ? "Mark paid" : "Reject & refund"}
              </button>
            </div>
          </div>
        )}
      </ModalShell>
    </>
  );
}

function BonusPoints({ addToast }) {
  const [email, setEmail] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("set_completion");
  const [note, setNote] = useState("");
  const [granting, setGranting] = useState(false);

  const [grants, setGrants] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (reset) => {
    setLoading(true);
    setError(null);
    try {
      const page = await fetchBonusGrants(reset ? null : cursor);
      setGrants((prev) => (reset ? page.items : [...prev, ...page.items]));
      setHasMore(page.hasMore);
      setCursor(page.nextCursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGrant = async (e) => {
    e.preventDefault();
    const amount = Number(points);
    if (!email.trim()) return addToast("Enter the recipient's email", "error");
    if (!Number.isFinite(amount) || amount <= 0) return addToast("Enter how many points to grant", "error");

    setGranting(true);
    try {
      const res = await grantBonus({ userEmail: email.trim(), points: amount, reason, note: note.trim() });
      addToast(`Granted ${formatPoints(amount)} to ${res.user.name}`, "success");
      setEmail("");
      setPoints("");
      setNote("");
      load(true);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setGranting(false);
    }
  };

  return (
    <>
      <p className="mt-1 text-sm text-gray-600">
        Award points that aren't tied to a specific upload — for example, completing a full set of papers for a
        semester. This is entirely your call; there's no automatic rule behind it.
      </p>

      <form onSubmit={handleGrant} className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
          <div>
            <label htmlFor="bonus-email" className="block text-sm font-medium text-gray-700">Recipient email</label>
            <input
              id="bonus-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="bonus-amount" className="block text-sm font-medium text-gray-700">Points</label>
            <input
              id="bonus-amount"
              type="number"
              min="1"
              max="2000"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="e.g. 50"
              className="mt-1 block w-full sm:w-32 rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="bonus-reason-select" className="block text-sm font-medium text-gray-700">Reason</label>
          <select
            id="bonus-reason-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            {BONUS_REASONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bonus-note-field" className="block text-sm font-medium text-gray-700">
            Note <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="bonus-note-field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="e.g. completed all six subjects for Sem 3"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={granting}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {granting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Grant bonus
        </button>
      </form>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent grants</h2>
        </div>
        {error && <p className="p-6 text-center text-sm text-red-600">{error}</p>}
        {loading && !grants.length && (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        )}
        {!loading && !error && !grants.length && (
          <p className="py-10 text-center text-sm text-gray-500">No bonus grants yet.</p>
        )}
        <ul className="divide-y divide-gray-100">
          {grants.map((g) => (
            <li key={g._id} className="px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{g.user?.name || "Unknown user"}</p>
                <p className="text-xs text-gray-500 break-all">{g.user?.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{g.note} · {formatDateTime(g.createdAt)}</p>
              </div>
              <span className="text-sm font-semibold text-indigo-700 shrink-0">+{formatPoints(g.amount)}</span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <div className="p-4 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => load(false)}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/** Admin-only: cash payout queue + discretionary bonus-point grants. */
export default function AdminPayouts({ user, authChecked }) {
  const { addToast } = useToast();
  const [section, setSection] = useState("payouts");
  const isAdmin = user?.role === "admin";

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm">
          <h1 className="text-xl font-bold text-gray-900">Admins only</h1>
          <p className="mt-2 text-sm text-gray-600">You need an admin account to manage rewards.</p>
          <Link to="/nit-kkr-pyqs" className="mt-5 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Rewards | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link to="/nit-kkr-pyqs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Contributor rewards</h1>

        <div role="tablist" className="mt-5 inline-flex rounded-lg bg-gray-200/70 p-1 text-sm font-medium">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={section === id}
              onClick={() => setSection(id)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-1.5 transition-colors ${
                section === id ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {section === "payouts" ? <CashPayouts addToast={addToast} /> : <BonusPoints addToast={addToast} />}
      </div>
    </div>
  );
}
