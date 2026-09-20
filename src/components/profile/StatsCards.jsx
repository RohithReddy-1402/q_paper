import { CheckCircle2, Clock, Gift, HelpCircle, TrendingUp, Upload, XCircle } from "lucide-react";
import { formatPoints } from "../../utils/format";

function Tile({ icon: Icon, label, value, tone }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tone}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function StatsCards({ profile, onRedeem, onShowGuide }) {
  const { stats, points, rewardRate } = profile;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-md p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onShowGuide}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-100 hover:text-white"
            >
              Points balance
              <HelpCircle className="w-3.5 h-3.5 opacity-80" />
            </button>
            <p className="mt-1 text-4xl font-bold tracking-tight">{formatPoints(points.balance)}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-indigo-100">
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {formatPoints(points.lifetimeEarned)} earned in total
              </span>
              <span>1 pt = ₹0.10 · rate ×{rewardRate.toFixed(1)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onRedeem}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-indigo-700 font-semibold px-5 py-3 shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <Gift className="w-5 h-5" />
            Redeem
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile icon={Upload} label="Papers uploaded" value={stats.uploads} tone="bg-blue-100 text-blue-600" />
        <Tile icon={CheckCircle2} label="Approved" value={stats.approved} tone="bg-green-100 text-green-600" />
        <Tile icon={Clock} label="Under review" value={stats.pending} tone="bg-amber-100 text-amber-600" />
        <Tile icon={XCircle} label="Rejected" value={stats.rejected} tone="bg-red-100 text-red-600" />
      </div>
    </div>
  );
}
