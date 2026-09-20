import { useEffect, useState } from "react";
import { CreditCard, Download, Gift, History, Loader2, Upload } from "lucide-react";
import useCursorList from "./useCursorList";
import { bonusLabel } from "./bonusReasons";
import { formatDateTime, formatPoints, formatRupees } from "../../utils/format";

const TABS = [
  { id: "uploads", label: "Uploads", icon: Upload },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "redeems", label: "Redeems", icon: Gift },
];

const EMPTY = {
  uploads: "You haven't contributed any papers yet. Upload one to start earning.",
  downloads: "No downloads in the last 90 days.",
  payments: "No payments yet.",
  redeems: "You haven't redeemed anything yet.",
};

const REJECT_LABELS = {
  duplicate: "Already available",
  fake: "Not a valid paper",
  low_quality: "Low quality",
  other: "Rejected",
};

const cap = (s = "") => `${s[0]?.toUpperCase() ?? ""}${s.slice(1)}`;

function Badge({ tone, children }) {
  const tones = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Row({ title, subtitle, date, badge, amount, footer }) {
  return (
    <li className="py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 break-words">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 break-words">{subtitle}</p>}
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {badge}
          {amount && <span className="text-sm font-semibold text-gray-900">{amount}</span>}
        </div>
      </div>
      {footer}
    </li>
  );
}

const statusBadge = (u) =>
  u.status === "approved" ? (
    <Badge tone="green">Approved</Badge>
  ) : u.status === "rejected" ? (
    <Badge tone="red">{REJECT_LABELS[u.rejectReason] || "Rejected"}</Badge>
  ) : (
    <Badge tone="amber">Under review</Badge>
  );

const renderers = {
  uploads: (u) => {
    const total = (u.rewardPoints || 0) + (u.bonusPoints || 0);
    return (
      <Row
        key={u._id}
        title={u.title}
        subtitle={[u.subject, u.subjectCode, `Sem ${u.sem}`, u.year, u.examType].filter(Boolean).join(" · ")}
        date={formatDateTime(u.createdAt)}
        badge={statusBadge(u)}
        amount={u.status === "approved" && total > 0 ? `+${formatPoints(total)}` : null}
        footer={
          u.status === "approved" && u.bonusPoints > 0 ? (
            <p className="mt-1.5 text-xs text-indigo-600">
              +{u.bonusPoints} bonus · {bonusLabel(u.bonusReason)}
              {u.bonusNote ? ` — "${u.bonusNote}"` : ""}
            </p>
          ) : u.status === "rejected" && u.rejectNote ? (
            <p className="mt-1.5 text-xs text-gray-500 italic">"{u.rejectNote}"</p>
          ) : null
        }
      />
    );
  },
  downloads: (d) => (
    <Row
      key={d._id}
      title={d.resourceTitle || "Untitled"}
      subtitle={d.resourceSubject}
      date={formatDateTime(d.createdAt)}
      badge={<Badge tone="blue">{d.resourceType === "syllabus" ? "Syllabus" : "Paper"}</Badge>}
    />
  ),
  payments: (p) => (
    <Row
      key={p._id}
      title={`${cap(p.plan)} plan`}
      subtitle={p.razorpayPaymentId}
      date={formatDateTime(p.verifiedAt || p.createdAt)}
      badge={<Badge tone="green">Paid</Badge>}
      amount={formatRupees(p.amount)}
    />
  ),
  redeems: (r) => {
    const isCash = r.type === "cash";
    const tone = { pending: "amber", paid: "green", completed: "green", rejected: "red" }[r.status] || "gray";
    const statusLabel = { pending: "Processing", paid: "Paid out", completed: "Completed", rejected: "Refunded" }[r.status] || r.status;
    return (
      <Row
        key={r._id}
        title={isCash ? "Cash payout" : `${cap(r.plan)} plan`}
        subtitle={isCash ? `UPI: ${r.upiId}${r.txnRef ? ` · Ref ${r.txnRef}` : ""}` : `For ${r.recipientEmail}`}
        date={formatDateTime(r.createdAt)}
        badge={<Badge tone={tone}>{statusLabel}</Badge>}
        amount={formatPoints(r.amount)}
        footer={isCash ? <p className="mt-1 text-xs text-gray-400">≈ {formatRupees(r.amount * 10)}</p> : null}
      />
    );
  },
};

function TabPanel({ kind, list }) {
  const { items, hasMore, loading, error, loadMore, reload } = list;

  if (error && !items.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" onClick={reload} className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800">
          Try again
        </button>
      </div>
    );
  }

  if (loading && !items.length) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="py-12 text-center">
        <History className="w-8 h-8 mx-auto text-gray-300" />
        <p className="mt-3 text-sm text-gray-500">{EMPTY[kind]}</p>
      </div>
    );
  }

  return (
    <>
      {kind === "downloads" && <p className="pt-3 text-xs text-gray-400">Showing your last 90 days of downloads.</p>}
      <ul className="divide-y divide-gray-100">{items.map(renderers[kind])}</ul>
      {error && <p className="py-2 text-center text-sm text-red-600">{error}</p>}
      {hasMore && (
        <div className="pt-3 pb-1 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Load more
          </button>
        </div>
      )}
    </>
  );
}

/**
 * All four lists live here so switching tabs keeps their data; each only
 * fetches once its tab is first opened. `redeemsVersion` bumps after a redeem.
 */
export default function HistoryTabs({ redeemsVersion, onRedeem }) {
  const [active, setActive] = useState("uploads");
  const lists = {
    uploads: useCursorList("uploads", active === "uploads"),
    downloads: useCursorList("downloads", active === "downloads"),
    payments: useCursorList("payments", active === "payments"),
    redeems: useCursorList("redeems", active === "redeems"),
  };

  const reloadRedeems = lists.redeems.reload;
  useEffect(() => {
    if (redeemsVersion > 0) reloadRedeems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redeemsVersion]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-2 sm:px-4">
        <div role="tablist" className="flex w-full sm:w-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={`inline-flex flex-1 sm:flex-none items-center justify-center gap-2 whitespace-nowrap px-1 sm:px-4 py-3.5 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors ${
                active === id
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="hidden sm:block w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        {active === "redeems" && (
          <button
            type="button"
            onClick={onRedeem}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2"
          >
            <Gift className="w-4 h-4" />
            Redeem
          </button>
        )}
      </div>

      <div className="px-4 sm:px-5 pb-3" role="tabpanel">
        {active === "redeems" && (
          <div className="sm:hidden pt-3">
            <button
              type="button"
              onClick={onRedeem}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5"
            >
              <Gift className="w-4 h-4" />
              Redeem
            </button>
          </div>
        )}
        <TabPanel kind={active} list={lists[active]} />
      </div>
    </div>
  );
}
