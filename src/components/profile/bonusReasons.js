// Mirrors back/config/rewards.config.js BONUS_REASONS — kept in sync by hand,
// the same way REJECT_REASONS is already duplicated client-side in tobeVerifed.jsx.
export const BONUS_REASONS = [
  { value: "recency", label: "Recent-year paper" },
  { value: "importance", label: "High importance / demand" },
  { value: "availability", label: "Hard to find elsewhere" },
  { value: "set_completion", label: "Completes a subject/semester set" },
  { value: "other", label: "Other" },
];

export const bonusLabel = (value) => BONUS_REASONS.find((r) => r.value === value)?.label ?? "Bonus";
