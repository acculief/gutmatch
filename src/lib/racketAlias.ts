// ラケットの英語名から日本語（カタカナ）検索用エイリアスを生成する。
// 例: BABOLAT "Pure Drive 98" -> "バボラ ピュアドライブ 98"
// これを検索対象テキストに足すことで「ピュアドライブ」等のカタカナ検索を可能にする。

const BRAND_JA: Record<string, string> = {
  BABOLAT: "バボラ",
  YONEX: "ヨネックス",
  WILSON: "ウィルソン",
  HEAD: "ヘッド",
  DUNLOP: "ダンロップ",
  PRINCE: "プリンス",
  TECNIFIBRE: "テクニファイバー",
};

// 長いフレーズを先に置換する（"Pure Drive" を "Pro" より先に、など）。
// 各モデルは「単一のカタカナ読み」に統一する。複数読みを空白区切りで並べると、
// 後続の数字（例: EZONE 98）と隣接しなくなり「イーゾーン98」で引けなくなるため。
const MODEL_JA: Array<[RegExp, string]> = [
  [/Pure Drive/gi, "ピュアドライブ"],
  [/Pure Aero/gi, "ピュアアエロ"],
  [/Pure Strike/gi, "ピュアストライク"],
  [/Boost Drive/gi, "ブーストドライブ"],
  [/Pro Staff/gi, "プロスタッフ"],
  [/T-?Fight/gi, "ティーファイト"],
  [/TF-?X1/gi, "ティーエフエックスワン"],
  [/TF40/gi, "ティーエフ40"],
  [/EZONE/gi, "イーゾーン"],
  [/VCORE/gi, "ブイコア"],
  [/PERCEPT/gi, "パーセプト"],
  [/ASTREL/gi, "アストレル"],
  [/Blade/gi, "ブレード"],
  [/Clash/gi, "クラッシュ"],
  [/Ultra/gi, "ウルトラ"],
  [/Shift/gi, "シフト"],
  [/Burn/gi, "バーン"],
  [/Speed/gi, "スピード"],
  [/Radical/gi, "ラジカル"],
  [/Prestige/gi, "プレステージ"],
  [/Extreme/gi, "エクストリーム"],
  [/Gravity/gi, "グラビティ"],
  [/Instinct/gi, "インスティンクト"],
  [/Boom/gi, "ブーム"],
  [/Phantom/gi, "ファントム"],
  [/Beast/gi, "ビースト"],
  [/CX/g, "シーエックス"],
  [/SX/g, "エスエックス"],
  [/FX/g, "エフエックス"],
  [/Tour/gi, "ツアー"],
  [/Team/gi, "チーム"],
  [/Plus/gi, "プラス"],
  [/Rafa/gi, "ラファ"],
  [/Pro\b/gi, "プロ"],
];

export function racketAlias(brand: string, model: string): string {
  let m = ` ${model} `;
  for (const [re, ja] of MODEL_JA) m = m.replace(re, ` ${ja} `);
  const brandJa = BRAND_JA[brand.toUpperCase()] ?? "";
  return `${brandJa} ${m}`.replace(/\s+/g, " ").trim();
}
