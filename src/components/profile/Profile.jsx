import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { KeyRound, User } from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";
import ProfileSidebar from "./ProfileSidebar";
import StatsCards from "./StatsCards";
import HistoryTabs from "./HistoryTabs";
import EditProfileModal from "./EditProfileModal";
import RedeemModal from "./RedeemModal";
import RewardsGuideModal from "./RewardsGuideModal";
import { fetchProfile } from "../../services/profile";

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col lg:flex-row gap-6" aria-busy="true" aria-label="Loading profile">
      <div className="lg:w-1/5 lg:min-w-65 lg:max-w-80 shrink-0 h-96 rounded-2xl bg-white/70" />
      <div className="flex-1 space-y-4">
        <div className="h-36 rounded-2xl bg-white/70" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/70" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-white/70" />
      </div>
    </div>
  );
}

function Notice({ title, children }) {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="mt-3 text-sm text-gray-600 space-y-4">{children}</div>
    </div>
  );
}

export default function Profile({
  isLoggedIn,
  authChecked,
  user,
  onLoginClick,
  onLogin,
  onLogout,
  onSignUpClick,
  onProfileChanged,
}) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [redeemsVersion, setRedeemsVersion] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      setProfile(await fetchProfile());
    } catch (err) {
      setError(err.message || "Could not load your profile");
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) load();
    else setProfile(null);
  }, [isLoggedIn, load]);

  const handleSaved = (next) => {
    setProfile(next);
    // Keep the header's avatar/name in step with what was just saved.
    onProfileChanged?.();
  };

  const handleAvatarChanged = (avatarUrl) => {
    setProfile((prev) => (prev ? { ...prev, avatarUrl } : prev));
    onProfileChanged?.();
  };

  const handleRedeemed = () => {
    setRedeemsVersion((v) => v + 1);
    load(); // balance, plan
    onProfileChanged?.(); // header plan label / quota
  };

  let body;
  if (!authChecked) {
    body = <Skeleton />;
  } else if (!isLoggedIn) {
    body = (
      <Notice title="Sign in to see your profile">
        <p>Track your contributions, rewards and downloads in one place.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onLoginClick}
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-indigo-100 text-indigo-600 px-5 py-2 font-medium shadow-sm hover:bg-indigo-50"
          >
            <KeyRound className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={onSignUpClick}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-5 py-2 font-medium shadow-sm hover:bg-indigo-700"
          >
            <User className="w-4 h-4" />
            Sign Up
          </button>
        </div>
      </Notice>
    );
  } else if (error && !profile) {
    body = (
      <Notice title="Couldn't load your profile">
        <p className="text-red-600">{error}</p>
        <button
          onClick={load}
          className="rounded-lg bg-indigo-600 text-white px-5 py-2 font-medium hover:bg-indigo-700"
        >
          Try again
        </button>
      </Notice>
    );
  } else if (!profile) {
    body = <Skeleton />;
  } else {
    body = (
      <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start">
        <aside className="w-full lg:w-1/5 lg:min-w-65 lg:max-w-80 shrink-0">
          <ProfileSidebar profile={profile} onEdit={() => setEditOpen(true)} />
        </aside>
        <section className="flex-1 min-w-0 space-y-4">
          <StatsCards profile={profile} onRedeem={() => setRedeemOpen(true)} onShowGuide={() => setGuideOpen(true)} />
          <HistoryTabs redeemsVersion={redeemsVersion} onRedeem={() => setRedeemOpen(true)} />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>My Profile | NIT KKR Previous Papers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLoginClick={onLoginClick}
        onLogin={onLogin}
        onLogout={onLogout}
        onSignUpClick={onSignUpClick}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{body}</main>
      <Footer />

      {editOpen && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
          onAvatarChanged={handleAvatarChanged}
        />
      )}
      {redeemOpen && profile && (
        <RedeemModal profile={profile} onClose={() => setRedeemOpen(false)} onRedeemed={handleRedeemed} />
      )}
      {guideOpen && <RewardsGuideModal onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
