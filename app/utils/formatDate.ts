/**
 * Formats a `YYYY-MM-DD` content date as a long US date.
 *
 * Parsed as a local calendar day on purpose — `new Date("2026-03-02")` is
 * treated as UTC midnight, which renders as the previous day west of Greenwich.
 */
export function formatDate(date?: string | null) {
  if (!date) return "";

  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "";

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
