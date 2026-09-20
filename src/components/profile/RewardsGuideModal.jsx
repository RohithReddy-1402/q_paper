import ModalShell from "./ModalShell";

const EARNING_RULES = [
  {
    n: "01",
    title: "10 points per approved paper",
    body: "Every paper you upload goes to an admin for review. Points are credited only once it's approved — nothing is earned while it's pending, and nothing for a rejected upload.",
  },
  {
    n: "02",
    title: "Bonus points, at the admin's discretion",
    body: "An admin can add bonus points on approval — for a paper from a recent exam year, one that's hard to find, or one that completes a subject's full set (Mid-1, Mid-2 and End-Sem). Any bonus is shown next to that upload, along with the reason.",
  },
  {
    n: "03",
    title: "1 point = ₹0.10",
    body: "Redeem your balance for a cash payout by UPI, or for a premium plan — for yourself, or as a gift to a friend who already has an account. Use the Redeem button on your profile.",
  },
];

const REJECTION_RULES = [
  "It's already available on the site — duplicates aren't approved twice.",
  "It isn't a genuine, complete question paper, or the scan is unreadable.",
  "The details (subject, year, semester…) don't match the file, or the upload misrepresents who it's from.",
];

/** The contribution "code of conduct" — how points are earned and what gets rejected. */
export default function RewardsGuideModal({ onClose }) {
  return (
    <ModalShell isOpen onClose={onClose} title="Contribution rewards" maxWidth="sm:max-w-xl">
      <div className="space-y-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">How you earn points</p>
          <ol className="mt-4 space-y-5">
            {EARNING_RULES.map(({ n, title, body }) => (
              <li key={n} className="flex gap-4">
                <span className="mt-0.5 shrink-0 font-mono text-sm font-semibold text-indigo-600/70">{n}</span>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Won't be approved</p>
          <ul className="mt-3 space-y-2">
            {REJECTION_RULES.map((rule) => (
              <li key={rule} className="flex gap-2.5 text-sm text-gray-600">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                {rule}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            If a paper is rejected, the reason — and any note from the admin — shows up against it in your Uploads tab.
          </p>
        </div>
      </div>
    </ModalShell>
  );
}
