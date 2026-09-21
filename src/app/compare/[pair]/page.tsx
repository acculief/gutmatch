import Link from "next/link";
import { notFound } from "next/navigation";
import { rackets, type Racket } from "@/data/rackets";
import { comparePairs, pairSlug } from "@/data/comparePairs";

const BASE = "https://gutmatch.vercel.app";

const spec = (r: Racket, label: string) => r.specs.find((s) => s.label === label)?.val ?? "—";
const topTension = (r: Racket) => (r.setups[0]?.tension ?? "—").replace(/^推奨テンション\s*/, "");

export function generateStaticParams() {
  return comparePairs.map((p) => ({ pair: pairSlug(p) }));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const p = comparePairs.find((x) => pairSlug(x) === pair);
  if (!p) return {};
  const A = rackets[p.a], B = rackets[p.b];
  if (!A || !B) return {};
  return {
    title: `${A.model}と${B.model}の違いは？どっちを選ぶ・おすすめガット比較 | ガットマッチ`,
    description: `${A.model}と${B.model}を徹底比較。スペック・系統・おすすめガット・推奨テンションの違いから「どっちを選ぶか」を解説。${A.setups[0].gut}／${B.setups[0].gut}ほか、機種別の張り方のコツも。`,
    alternates: { canonical: `${BASE}/compare/${pair}/` },
  };
}

export default async function VsPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const p = comparePairs.find((x) => pairSlug(x) === pair);
  if (!p) notFound();
  const A = rackets[p.a], B = rackets[p.b];
  if (!A || !B) notFound();
  const rows = ["面サイズ", "重量", "パターン", "フレーム硬さ", "系統"];
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: `${BASE}/` },
            { "@type": "ListItem", position: 2, name: "比較", item: `${BASE}/compare/` },
            { "@type": "ListItem", position: 3, name: `${A.model} と ${B.model}` },
          ] },
          { "@type": "FAQPage", mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") } })) },
        ],
      }) }} />
      <header className="top">
        <Link href="/" className="logo">ガット<span>マッチ</span></Link>
        <div className="tagline">ラケット対決比較</div>
      </header>
      <div className="bc"><Link href="/">ホーム</Link> › <Link href="/compare/">比較</Link> › {A.model} と {B.model}</div>
      <main>
        <h1>{A.model}と{B.model}の違いは？<br />どっちを選ぶ・おすすめガット比較</h1>
        <div className="meta">スペック・系統・合うガットの違いから、迷ったときの選び方まで</div>

        <div className="verdict">
          <span className="tag">まず結論</span>
          <h2>{A.model} vs {B.model}、どっちを選ぶ？</h2>
          <p dangerouslySetInnerHTML={{ __html: p.verdict }} />
        </div>

        <h3 className="sec">スペック＆おすすめガット 早見比較</h3>
        <table>
          <tbody>
            <tr><th></th><th>{A.model}</th><th>{B.model}</th></tr>
            {rows.map((label) => (
              <tr key={label}><td><b>{label}</b></td><td>{spec(A, label)}</td><td>{spec(B, label)}</td></tr>
            ))}
            <tr><td><b>おすすめNo.1</b></td><td>{A.setups[0].gut}</td><td>{B.setups[0].gut}</td></tr>
            <tr><td><b>推奨テンション</b></td><td>{topTension(A)}</td><td>{topTension(B)}</td></tr>
          </tbody>
        </table>

        <h3 className="sec">ガットはどう変わる？</h3>
        <p className="tension-note" dangerouslySetInnerHTML={{ __html: p.gutDiff }} />

        <h3 className="sec">それぞれの詳しいセットアップ</h3>
        <div className="related">
          <Link href={`/racket/${A.slug}/`} className="related-item">
            <span className="related-brand">{A.brand}</span>
            <span className="related-model">{A.model}に合うガット →</span>
          </Link>
          <Link href={`/racket/${B.slug}/`} className="related-item">
            <span className="related-brand">{B.brand}</span>
            <span className="related-model">{B.model}に合うガット →</span>
          </Link>
        </div>

        <h3 className="sec">よくある質問</h3>
        <div className="faq">
          {p.faqs.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary>{f.q}</summary>
              <p dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
        </div>

        <div className="note">📌 スペックは各メーカー公表値、ガットは初期データ＋ユーザー投票に基づく目安です。体感には個人差があります。</div>

        <Link href="/compare/" className="cmp-cta">⚖️ 3本まとめて比較する →</Link>
      </main>
    </div>
  );
}
