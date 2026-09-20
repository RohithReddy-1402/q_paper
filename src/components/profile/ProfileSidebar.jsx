import { CalendarDays, Crown, GraduationCap, Github, Globe, Hash, Instagram, Linkedin, Mail, Pencil, Twitter } from "lucide-react";
import Avatar from "./Avatar";
import { formatDate } from "../../utils/format";

const SOCIAL_ICONS = {
  github: { Icon: Github, label: "GitHub" },
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  twitter: { Icon: Twitter, label: "X / Twitter" },
  instagram: { Icon: Instagram, label: "Instagram" },
  website: { Icon: Globe, label: "Website" },
};

const planLabel = (subscription) => {
  const plan = subscription?.plan;
  const active = plan === "lifetime" || (subscription?.status === "active" && plan && plan !== "free");
  return active ? `${plan[0].toUpperCase()}${plan.slice(1)} member` : null;
};

function InfoRow({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-600">
      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}

export default function ProfileSidebar({ profile, onEdit }) {
  const socials = Object.entries(profile.socials || {}).filter(([, url]) => url);
  const membership = planLabel(profile.subscription);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-center text-center lg:items-stretch lg:text-left">
      <div className="flex flex-col items-center lg:items-start gap-3">
        <Avatar src={profile.avatarUrl} name={profile.name} className="w-28 h-28" textClass="text-4xl" />
        <div className="min-w-0 w-full">
          <h1 className="text-xl font-bold text-gray-900 break-words">{profile.name}</h1>
          {profile.rollNumber && <p className="text-sm text-gray-500">Roll no. {profile.rollNumber}</p>}
          {membership && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1">
              <Crown className="w-3.5 h-3.5" />
              {membership}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 transition-colors"
      >
        <Pencil className="w-4 h-4" />
        Edit Profile
      </button>

      <ul className="mt-5 w-full space-y-2.5 text-left">
        <InfoRow icon={GraduationCap}>{profile.college}</InfoRow>
        <InfoRow icon={Hash}>{profile.rollNumber}</InfoRow>
        <InfoRow icon={Mail}>{profile.email}</InfoRow>
        <InfoRow icon={CalendarDays}>{`Joined ${formatDate(profile.memberSince)}`}</InfoRow>
      </ul>

      {profile.bio && (
        <div className="mt-5 pt-5 w-full border-t border-gray-100 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">About</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{profile.bio}</p>
        </div>
      )}

      {socials.length > 0 && (
        <div className="mt-5 pt-5 w-full border-t border-gray-100 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Links</h2>
          <ul className="space-y-2">
            {socials.map(([key, url]) => {
              const { Icon, label } = SOCIAL_ICONS[key] || SOCIAL_ICONS.website;
              return (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-indigo-600"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
