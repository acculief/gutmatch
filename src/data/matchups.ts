// 人気の「○○ vs △△」対決ページ用の組み合わせ。slug は rackets.ts に存在するもののみ。
export const MATCHUPS: [string, string][] = [
  ["puredrive", "pureaero"],
  ["puredrive", "purestrike"],
  ["pureaero", "purestrike"],
  ["ezone", "vcore"],
  ["ezone", "percept"],
  ["vcore", "percept"],
  ["blade", "clash"],
  ["prostaff", "blade"],
  ["clash", "ultra"],
  ["speed", "radical"],
  ["speed", "prestige"],
  ["gravity", "radical"],
  ["puredrive", "ezone"],
  ["pureaero", "vcore"],
  ["pureaero", "extreme"],
  ["blade", "ezone"],
  ["purestrike", "blade"],
  ["cx", "fx"],
];

export const matchupSlug = (a: string, b: string) => `${a}-vs-${b}`;
