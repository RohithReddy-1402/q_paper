import { useRef, useState } from "react";
import { Camera, Github, Globe, Instagram, Linkedin, Loader2, Trash2, Twitter } from "lucide-react";
import ModalShell from "./ModalShell";
import Avatar from "./Avatar";
import { useToast } from "../ToastContext";
import { removeAvatar, updateProfile, uploadAvatar } from "../../services/profile";

const SOCIAL_FIELDS = [
  { key: "github", label: "GitHub", Icon: Github, placeholder: "github.com/username" },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin, placeholder: "linkedin.com/in/username" },
  { key: "twitter", label: "X / Twitter", Icon: Twitter, placeholder: "x.com/username" },
  { key: "instagram", label: "Instagram", Icon: Instagram, placeholder: "instagram.com/username" },
  { key: "website", label: "Website", Icon: Globe, placeholder: "yoursite.com" },
];

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none";

const draftFrom = (profile) => ({
  name: profile.name || "",
  college: profile.college || "",
  rollNumber: profile.rollNumber || "",
  bio: profile.bio || "",
  socials: { github: "", linkedin: "", twitter: "", instagram: "", website: "", ...(profile.socials || {}) },
});

/**
 * Mounted only while open (the parent renders it conditionally), so the draft
 * is re-seeded from the latest profile every time it opens.
 */
export default function EditProfileModal({ profile, onClose, onSaved, onAvatarChanged }) {
  const { addToast } = useToast();
  const [draft, setDraft] = useState(() => draftFrom(profile));
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileRef = useRef(null);

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));
  const setSocial = (key) => (e) => setDraft((d) => ({ ...d, socials: { ...d.socials, [key]: e.target.value } }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setAvatarBusy(true);
    try {
      const { avatarUrl: next } = await uploadAvatar(file);
      setAvatarUrl(next);
      onAvatarChanged(next);
      addToast("Profile photo updated", "success");
    } catch (err) {
      addToast(err.message || "Could not upload your photo", "error");
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    setAvatarBusy(true);
    try {
      await removeAvatar();
      setAvatarUrl(null);
      onAvatarChanged(null);
      addToast("Profile photo removed", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) {
      addToast("Username must be at least 2 characters", "error");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile(draft);
      onSaved(updated);
      addToast("Profile saved", "success");
      onClose();
    } catch (err) {
      addToast(err.message || "Could not save your profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell isOpen onClose={onClose} title="Edit profile">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={avatarUrl} name={draft.name} className="w-20 h-20" textClass="text-2xl" />
            {avatarBusy && (
              <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
            <button
              type="button"
              disabled={avatarBusy}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <Camera className="w-4 h-4" />
              {avatarUrl ? "Change photo" : "Upload photo"}
            </button>
            {avatarUrl && (
              <button
                type="button"
                disabled={avatarBusy}
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="ep-name" className="block text-sm font-medium text-gray-700">Username</label>
          <input id="ep-name" value={draft.name} onChange={set("name")} maxLength={50} required className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ep-roll" className="block text-sm font-medium text-gray-700">Roll number</label>
            <input id="ep-roll" value={draft.rollNumber} onChange={set("rollNumber")} maxLength={30} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ep-college" className="block text-sm font-medium text-gray-700">College</label>
            <input id="ep-college" value={draft.college} onChange={set("college")} maxLength={100} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="ep-bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="ep-bio"
            value={draft.bio}
            onChange={set("bio")}
            maxLength={300}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400 text-right">{draft.bio.length}/300</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Social links</p>
          <div className="mt-2 space-y-2">
            {SOCIAL_FIELDS.map(({ key, label, Icon, placeholder }) => (
              <div key={key} className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                <input
                  aria-label={label}
                  value={draft.socials[key]}
                  onChange={setSocial(key)}
                  placeholder={placeholder}
                  maxLength={200}
                  className="block w-full rounded-lg border border-gray-300 px-3 h-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
