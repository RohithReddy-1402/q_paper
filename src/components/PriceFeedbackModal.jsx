import { useState } from "react";
import { useToast } from "./ToastContext";
import { submitPriceFeedback } from "../services/priceFeedback";

export default function PriceFeedbackModal({ isOpen, onClose }) {
  const [monthly, setMonthly] = useState("");
  const [yearly, setYearly] = useState("");
  const [lifetime, setLifetime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const m = Number(monthly);
    const y = Number(yearly);
    const l = Number(lifetime);
    if (![m, y, l].every((n) => Number.isFinite(n) && n >= 0)) {
      addToast("Please enter a valid non-negative number for all three.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await submitPriceFeedback({ monthly: m, yearly: y, lifetime: l });
      addToast("Thanks — we've noted what you'd pay.", "success");
      setMonthly("");
      setYearly("");
      setLifetime("");
      onClose();
    } catch (err) {
      addToast(err?.message || "Could not submit feedback. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-[90%] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            What would you pay?
          </h3>
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Tell us what you'd be comfortable paying for each plan — this
          doesn't change your current price, but it helps us understand what
          feels fair to students.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fb-monthly" className="block text-sm font-medium text-gray-700">
              Monthly (₹)
            </label>
            <input
              id="fb-monthly"
              type="number"
              min="0"
              step="1"
              required
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="mt-1 block w-full rounded-md h-11 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="fb-yearly" className="block text-sm font-medium text-gray-700">
              Yearly (₹)
            </label>
            <input
              id="fb-yearly"
              type="number"
              min="0"
              step="1"
              required
              value={yearly}
              onChange={(e) => setYearly(e.target.value)}
              className="mt-1 block w-full rounded-md h-11 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="fb-lifetime" className="block text-sm font-medium text-gray-700">
              Lifetime (₹)
            </label>
            <input
              id="fb-lifetime"
              type="number"
              min="0"
              step="1"
              required
              value={lifetime}
              onChange={(e) => setLifetime(e.target.value)}
              className="mt-1 block w-full rounded-md h-11 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
