const WOW_CLASS_TEXT_COLORS: Record<string, string> = {
  "Death Knight": "text-[#C41F3B]",
  "Demon Hunter": "text-[#A330C9]",
  Druid: "text-[#FF7D0A]",
  Evoker: "text-[#33937F]",
  Hunter: "text-[#ABD473]",
  Mage: "text-[#69CCF0]",
  Monk: "text-[#00FF96]",
  Paladin: "text-[#F58CBA]",
  Priest: "text-[#FFFFFF]",
  Rogue: "text-[#FFF569]",
  Shaman: "text-[#0070DE]",
  Warlock: "text-[#9482C9]",
  Warrior: "text-[#C79C6E]",
};

export const getWowClassTextColor = (className: string) =>
  WOW_CLASS_TEXT_COLORS[className] ?? "text-gray-500 dark:text-stone-400";

export const getWowRoleBadgeClass = (role: string) => {
  if (role === "TANK") {
    return "border-blue-500 bg-blue-500/10 text-blue-400";
  }

  if (role === "HEALER") {
    return "border-green-500 bg-green-500/10 text-green-400";
  }

  return "border-rose-500 bg-rose-500/10 text-rose-400";
};

export const getWowRoleIcon = (role: string) => {
  if (role === "TANK") return "i-lucide-shield";
  if (role === "HEALER") return "i-lucide-heart-pulse";
  return "i-lucide-swords";
};
