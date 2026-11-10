import type {
  TeamCharacterSummary,
  TeamInput,
  TeamRole,
  TeamSlot,
} from "../../shared/types/members";

export const TEAM_ROLES: {
  value: TeamRole;
  label: string;
  icon: string;
  badgeClass: string;
}[] = [
  {
    value: "tank",
    label: "Tank",
    icon: "i-lucide-shield",
    badgeClass: "border-blue-500 bg-blue-500/10 text-blue-400",
  },
  {
    value: "healer",
    label: "Healer",
    icon: "i-lucide-heart-pulse",
    badgeClass: "border-green-500 bg-green-500/10 text-green-400",
  },
  {
    value: "dps",
    label: "DPS",
    icon: "i-lucide-swords",
    badgeClass: "border-rose-500 bg-rose-500/10 text-rose-400",
  },
];

export const getTeamRole = (role: TeamRole | null) =>
  TEAM_ROLES.find((entry) => entry.value === role) ?? TEAM_ROLES[2]!;

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const COMMON_TIMEZONES = [
  { label: "Eastern (New York)", value: "America/New_York" },
  { label: "Central (Chicago)", value: "America/Chicago" },
  { label: "Mountain (Denver)", value: "America/Denver" },
  { label: "Pacific (Los Angeles)", value: "America/Los_Angeles" },
];

/** The common North American zones, plus `current` when it is not one of them. */
export const getTimezoneOptions = (current?: string) =>
  current && !COMMON_TIMEZONES.some((zone) => zone.value === current)
    ? [...COMMON_TIMEZONES, { label: current.replace(/_/g, " "), value: current }]
    : COMMON_TIMEZONES;

/** "20:30" -> "8:30 PM" */
export const formatTime = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

/** A short zone label such as "ET", falling back to the zone id. */
export const formatTimezone = (timezone: string) => {
  try {
    const zone = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortGeneric",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName");
    return zone?.value || timezone;
  } catch {
    return timezone;
  }
};

export const sortSlots = (slots: TeamSlot[]) =>
  [...slots].sort(
    (a, b) => a.day - b.day || a.start.localeCompare(b.start),
  );

export const formatCharacter = (character: TeamCharacterSummary) =>
  `${character.name}-${character.realm
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`;

export const createEmptyTeamInput = (): TeamInput => ({
  name: "",
  description: "",
  timezone: "America/New_York",
  schedule: [],
  recruiting: false,
  needs: { tank: 0, healer: 0, dps: 0 },
  recruitmentNote: "",
});
