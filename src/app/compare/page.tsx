import type { Metadata } from "next";
import Link from "next/link";
import { racketList } from "@/data/rackets";
import RacketCompare, { type CompareItem } from "@/components/RacketCompare";

export const metadata: Metadata = {
  title: "ラケット比較 | スペック・おすすめガットを並べて比較 - ガットマッチ",
  description:
    "テニスラケットを2〜3本えらんで、面サイズ・重量・ストリングパターン・フレーム硬さ・おすすめガット・推奨テンションを横並びで比較。買い替え・張り替えの検討に。",
};

const spec = (r: (typeof racketList)[number], label: string) =>
  r.specs.find((s) => s.label === label)?.val ?? "—";

const items: CompareItem[] = racketList.map((r) => ({
  slug: r.slug,
  brand: r.brand,
  model: r.model,
  badge: r.badge,
  image: r.image,
  face: spec(r, "面サイズ"),
  weight: spec(r, "重量"),
  pattern: spec(r, "パターン"),
  flex: spec(r, "フレーム硬さ"),
  sys: spec(r, "系統"),
  topGut: r.setups[0]?.gut ?? "—",
  topTension: (r.setups[0]?.tension ?? "—").replace(/^推奨テンション\s*/, ""),
}));

export default function ComparePage() {
  return (
    <div className="wrap">
      <header className="top">
        <Link href="/" className="logo">
          ガット<span>マッチ</span>
        </Link>
        <div className="tagline">ラケット比較</div>
      </header>
      <main>
        <section className="lead">
          <h1 className="lead-h1">ラケットをくらべる</h1>
          <p className="lead-p">
            気になる2〜3本をえらぶと、<b>スペック・おすすめガット・推奨テンション</b>を横並びで比較できます。
            値が割れている項目は色つきで表示します。
          </p>
        </section>

        <RacketCompare items={items} />

        <p className="cmp-back">
          <Link href="/">← ラケット一覧にもどる</Link>
        </p>
      </main>
      <footer className="foot">© 2026 ガットマッチ ・ 情報は目安です。ガット/テンションは体感に個人差があります。</footer>
    </div>
  );
}
