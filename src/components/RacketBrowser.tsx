"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { racketAlias } from "@/lib/racketAlias";

type Racket = { slug: string; brand: string; model: string; badge: string; image: string };

const BRANDS = ["すべて", "Babolat", "Wilson", "YONEX", "HEAD", "Dunlop", "Prince", "Tecnifibre"];
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export default function RacketBrowser({ rackets }: { rackets: Racket[] }) {
  const [brand, setBrand] = useState("すべて");
  const [q, setQ] = useState("");

  // 各ラケットの検索用テキスト（英名＋カタカナ別名＋バッジ）を事前計算。
  const indexed = useMemo(
    () =>
      rackets.map((r) => ({
        r,
        hay: norm(`${r.model} ${r.brand} ${r.badge} ${racketAlias(r.brand, r.model)}`),
      })),
    [rackets],
  );

  const filtered = useMemo(() => {
    const qq = norm(q);
    return indexed
      .filter(({ r, hay }) => {
        const okBrand = brand === "すべて" || r.brand.toLowerCase() === brand.toLowerCase();
        const okQ = !qq || hay.includes(qq);
        return okBrand && okQ;
      })
      .map((x) => x.r);
  }, [indexed, brand, q]);

  return (
    <>
      <h3 className="sec">ブランドで探す</h3>
      <div className="chips">
        {BRANDS.map((b) => (
          <button
            key={b}
            type="button"
            className={"chip" + (b === brand ? " on" : "")}
            onClick={() => setBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <h3 className="sec">ラケットから探す</h3>
      <div className="rk-search">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ラケット名で検索（例: ピュアドライブ / EZONE / ブレード）"
          aria-label="ラケット名で検索"
        />
        <span className="rk-count">{filtered.length}本</span>
      </div>

      <div className="rk-grid">
        {filtered.map((r) => (
          <Link key={r.slug} href={"/racket/" + r.slug} className="rk-card">
            <div className="rk-thumb">
              <img src={r.image} alt={r.model} />
            </div>
            <div className="rk-body">
              <div className="rk-brand">{r.brand}</div>
              <div className="rk-model">{r.model}</div>
              <div className="rk-badge">{r.badge}</div>
            </div>
            <div className="rk-go">›</div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="rk-soon">
            「{q}」に一致するラケットが見つかりませんでした。ブランドを「すべて」に戻すか、別の名前でお試しください。
          </div>
        )}
      </div>
    </>
  );
}
