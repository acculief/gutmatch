"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type CompareItem = {
  slug: string;
  brand: string;
  model: string;
  badge: string;
  image: string;
  face: string;
  weight: string;
  pattern: string;
  flex: string;
  sys: string;
  topGut: string;
  topTension: string;
};

const ROWS: { key: keyof CompareItem; label: string }[] = [
  { key: "badge", label: "特徴" },
  { key: "sys", label: "系統" },
  { key: "face", label: "面サイズ" },
  { key: "weight", label: "重量" },
  { key: "pattern", label: "ストリングパターン" },
  { key: "flex", label: "フレーム硬さ" },
  { key: "topGut", label: "おすすめガット No.1" },
  { key: "topTension", label: "推奨テンション" },
];

export default function RacketCompare({ items }: { items: CompareItem[] }) {
  const byslug = useMemo(() => Object.fromEntries(items.map((i) => [i.slug, i])), [items]);
  const [cols, setCols] = useState<string[]>([items[0]?.slug, items[1]?.slug].filter(Boolean));

  // URL の ?a=slug&b=slug&c=slug で初期選択（ラケット詳細からの「比較する」導線用）
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pre = ["a", "b", "c"].map((k) => p.get(k)).filter((s): s is string => !!s && !!byslug[s]);
    if (pre.length >= 1) {
      const next = pre.slice(0, 3);
      if (next.length === 1 && items[0]) next.push(items.find((i) => i.slug !== next[0])!.slug);
      setCols(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCol = (idx: number, slug: string) =>
    setCols((c) => c.map((v, i) => (i === idx ? slug : v)));
  const addCol = () =>
    setCols((c) => (c.length < 3 ? [...c, items.find((i) => !c.includes(i.slug))?.slug || items[0].slug] : c));
  const removeCol = (idx: number) => setCols((c) => (c.length > 2 ? c.filter((_, i) => i !== idx) : c));

  const chosen = cols.map((s) => byslug[s]).filter(Boolean) as CompareItem[];

  const diff = (key: keyof CompareItem) => {
    const vals = chosen.map((r) => r[key]);
    return new Set(vals).size > 1; // 値が割れている行はハイライト
  };

  return (
    <div className="cmp">
      <div className="cmp-cols" style={{ gridTemplateColumns: `120px repeat(${chosen.length}, 1fr)` }}>
        <div className="cmp-corner" />
        {chosen.map((r, idx) => (
          <div className="cmp-head" key={idx}>
            <select value={r.slug} onChange={(e) => setCol(idx, e.target.value)} aria-label={`比較ラケット${idx + 1}`}>
              {items.map((it) => (
                <option key={it.slug} value={it.slug}>
                  {it.brand} {it.model}
                </option>
              ))}
            </select>
            <Link href={`/racket/${r.slug}/`} className="cmp-thumb">
              <img src={r.image} alt={r.model} />
            </Link>
            <Link href={`/racket/${r.slug}/`} className="cmp-name">
              {r.model}
            </Link>
            {chosen.length > 2 && (
              <button type="button" className="cmp-rm" onClick={() => removeCol(idx)} aria-label="この列を削除">
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {ROWS.map((row) => (
        <div
          className={"cmp-row" + (diff(row.key) ? " cmp-diff" : "")}
          key={row.key}
          style={{ gridTemplateColumns: `120px repeat(${chosen.length}, 1fr)` }}
        >
          <div className="cmp-label">{row.label}</div>
          {chosen.map((r, idx) => (
            <div className="cmp-val" key={idx}>
              {r[row.key]}
            </div>
          ))}
        </div>
      ))}

      {chosen.length < 3 && (
        <button type="button" className="cmp-add" onClick={addCol}>
          ＋ もう1本くらべる
        </button>
      )}

      <div className="cmp-links">
        {chosen.map((r) => (
          <Link key={r.slug} href={`/racket/${r.slug}/`} className="cmp-detail">
            {r.model} の詳細・人気セットアップ →
          </Link>
        ))}
      </div>
    </div>
  );
}
