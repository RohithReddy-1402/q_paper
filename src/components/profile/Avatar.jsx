import { avatarSrc } from "../../services/profile";
import { initialsOf } from "../../utils/format";

const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
];

const gradientFor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

/** Uploaded photo when there is one, otherwise a coloured initials badge. */
export default function Avatar({ src, name, className = "w-24 h-24", textClass = "text-3xl" }) {
  const url = avatarSrc(src);
  if (url) {
    return (
      <img
        src={url}
        alt={name ? `${name}'s photo` : "Profile photo"}
        className={`${className} rounded-full object-cover bg-gray-100 ring-4 ring-white shadow-md`}
      />
    );
  }
  return (
    <div
      aria-label={name ? `${name}'s avatar` : "Profile avatar"}
      className={`${className} ${textClass} rounded-full bg-linear-to-br ${gradientFor(name)} text-white font-semibold flex items-center justify-center ring-4 ring-white shadow-md select-none`}
    >
      {initialsOf(name)}
    </div>
  );
}
