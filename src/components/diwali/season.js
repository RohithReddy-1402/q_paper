const DIWALI_DATES = {
  2026: [11, 8],
  2027: [10, 29],
  2028: [10, 17],
  2029: [11, 5],
  2030: [10, 26],
};

const DAYS_BEFORE = 2;
const DAYS_AFTER = 3;

const toKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const todayKey = () => toKey(new Date());

export function isDiwaliSeason(now = new Date(), start, end) {
  const today = toKey(now);

  if (start || end) {
    return (!start || today >= start) && (!end || today <= end);
  }

  const entry = DIWALI_DATES[now.getFullYear()];
  if (!entry) return false;

  const [month, day] = entry;
  const from = toKey(new Date(now.getFullYear(), month - 1, day - DAYS_BEFORE));
  const to = toKey(new Date(now.getFullYear(), month - 1, day + DAYS_AFTER));
  return today >= from && today <= to;
}
