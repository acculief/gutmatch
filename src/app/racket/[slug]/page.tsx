import Link from "next/link";
import { notFound } from "next/navigation";
import { rackets } from "@/data/rackets";
import SetupList from "@/components/SetupList";
import VoteForm from "@/components/VoteForm";

export function generateStaticParams() {
  return Object.keys(rackets).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = rackets[slug];
  if (!r) return {};
  return {
    title: r.model + "に合うガットは？おすすめセットアップ・人気の張り方 | ガットマッチ",
    description: r.model + "（" + r.specs[0].val + "・" + (r.specs.find((s) => s.label === "重量")?.val || "") + "）に合うガット・テンション・人気セットアップを" + r.setups.length + "本の候補で比較。" + r.setups[0].gut + "ほか、目的別の張り方早見表とFAQ付き。ユーザー投票で更新中。",
  };
}

export default async function RacketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = rackets[slug];
  if (!r) notFound();
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: "https://gutmatch.vercel.app/" },
            { "@type": "ListItem", position: 2, name: r.brand },
            { "@type": "ListItem", position: 3, name: r.model },
          ] },
          { "@type": "FAQPage", mainEntity: r.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") } })) },
        ],
      }) }} />
      <header className="top">
        <Link href="/" className="logo">ガット<span>マッチ</span></Link>
        <div className="tagline">ラケット別 セットアップ図鑑</div>
      </header>
      <div className="bc"><Link href="/">ホーム</Link> › {r.brand} › {r.model}</div>
      <main>
        <div className="hero">
          <div className="hero-img"><img src={r.image} alt={r.model} /></div>
          <div className="hero-info">
            <div className="brand">{r.brand}</div>
            <div className="model">{r.model}</div>
            <div className="price">{r.price}</div>
            <span className="badge">{r.badge}</span>
            <Link href={`/compare/?a=${r.slug}`} className="cmp-cta">⚖️ 他のラケットと比較する →</Link>
          </div>
        </div>

        <h1>{r.model}に合うガットは？<br />おすすめセットアップ・人気の張り方</h1>
        <div className="meta">みんなの投票でランキング更新中 ・ あなたの1票も即反映</div>

        <div className="verdict">
          <span className="tag">まず結論</span>
          <h2>{r.verdictTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: r.verdictBody }} />
        </div>

        {r.intro && <p className="lead" dangerouslySetInnerHTML={{ __html: r.intro }} />}

        <h3 className="sec">どんなラケット？（30秒）</h3>
        <div className="spec">
          {r.specs.map((s) => (
            <div className="row" key={s.label}>{s.label}<b>{s.val}</b></div>
          ))}
          <div className="oneline" dangerouslySetInnerHTML={{ __html: r.oneline }} />
        </div>

        <h3 className="sec">人気セットアップ Top{r.setups.length} <span className="sub-note">（ユーザー投票順・リアルタイム反映）</span></h3>
        <SetupList slug={slug} setups={r.setups} />

        <h3 className="sec">目的別・張り方の早見表</h3>
        <table>
          <tbody>
            <tr><th>求めるもの</th><th>ガットの方向</th><th>テンション</th></tr>
            {r.hayami.map((h) => (
              <tr key={h.want}><td><b>{h.want}</b></td><td>{h.dir}</td><td>{h.tension}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 className="sec">プロ／上級者の参考</h3>
        <div className="pro"><span dangerouslySetInnerHTML={{ __html: r.proNote }} /><br /><span className="dim">※初期データ。出典精査＆ユーザー投票で継続更新予定。</span></div>

        <h3 className="sec">あなたの設定を教えて</h3>
        <div className="vote">
          <h4>🎾 {r.model}、何をどのテンションで張ってる？</h4>
          <p>投票が集まるほど「人気セットアップ」が正確になります</p>
          <VoteForm slug={slug} model={r.model} guts={r.setups.map((s) => s.gut)} />
        </div>

        <h3 className="sec">よくある質問</h3>
        <div className="faq">
          {r.faqs.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary>{f.q}</summary>
              <p dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
        </div>

        <div className="note">📌 このページのセットアップは初期データ＋ユーザー投票で作成しています。あなたの1票がランキングの精度を上げます。</div>

        {(() => {
          const all = Object.values(rackets);
          const same = all.filter((x) => x.brand === r.brand && x.slug !== r.slug);
          const others = all.filter((x) => x.brand !== r.brand && x.slug !== r.slug);
          const related = [...same, ...others].slice(0, 6);
          return (
            <>
              <h3 className="sec">関連ラケット</h3>
              <div className="related">
                {related.map((x) => (
                  <Link key={x.slug} href={`/racket/${x.slug}/`} className="related-item">
                    <span className="related-brand">{x.brand}</span>
                    <span className="related-model">{x.model}に合うガット</span>
                  </Link>
                ))}
              </div>
            </>
          );
        })()}
      </main>
    </div>
  );
}
