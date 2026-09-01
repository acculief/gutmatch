"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Racket = { slug: string; brand: string; model: string; badge: string; image: string };

const BRANDS = ["すべて", "Babolat", "Wilson", "YONEX", "HEAD", "Dunlop", "Prince", "Tecnifibre"];

export default function RacketBrowser({ rackets }: { rackets: Racket[] }) {
  const [brand, setBrand] = useState("すべて");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rackets.filter((r) => {
      const okBrand = brand === "すべて" || r.brand.toLowerCase() === brand.toLowerCase();
      const okQ = !qq || `${r.model} ${r.brand} ${r.badge}`.toLowerCase().includes(qq);
      return okBrand && okQ;
    });
  }, [rackets, brand, q]);

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
          placeholder="ラケット名で検索（例: Pure Drive, EZONE, Blade）"
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
