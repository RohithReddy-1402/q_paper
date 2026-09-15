import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import PricingCards from "./PricingCards";

/**
 * Dedicated pricing page. Doubles as the redirect target when a paper
 * view/download is blocked by the premium gate (DownloadButton.jsx /
 * QuestionPaper.jsx navigate here with `state: { message }`).
 */
export default function Pricing({ isLoggedIn, user, onLoginClick, onLogin, onLogout, onSignUpClick, onPurchased }) {
  const location = useLocation();
  const reason = location.state?.message;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLoginClick={onLoginClick}
        onLogin={onLogin}
        onLogout={onLogout}
        onSignUpClick={onSignUpClick}
      />

      <main className="flex-1 px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          {reason && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
              {reason}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, one-time or recurring pricing
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Unlimited downloads and previews of every question paper on the site.
            Pick whatever cadence works for you — cancel monthly plans anytime.
          </p>
        </div>

        <PricingCards
          isLoggedIn={isLoggedIn}
          user={user}
          onLoginClick={onLoginClick}
          onPurchased={onPurchased}
        />

        <div className="max-w-4xl mx-auto mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Payments are processed securely by Razorpay.</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
