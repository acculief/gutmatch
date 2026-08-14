import Link from "next/link";
import { notFound } from "next/navigation";
import { rackets } from "@/data/rackets";
import VoteButton from "@/components/VoteButton";

export function generateStaticParams() {
  return Object.keys(rackets).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = rackets[slug];
  if (!r) return {};
  return {
    title: r.model + "に合うガットは？おすすめセットアップ・人気の張り方 | ガットマッチ",
    description: r.model + "におすすめのガット・テンション・人気セットアップ（ユーザー投票順）をまとめました。",
  };
}

export default async function RacketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = rackets[slug];
  if (!r) notFound();
  return (
    <div className="wrap">
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
          </div>
        </div>

        <h1>{r.model}に合うガットは？<br />おすすめセットアップ・人気の張り方</h1>
        <div className="meta">最終更新 2026-08-13 ・ ユーザー投票 1,284件 反映</div>

        <div className="verdict">
          <span className="tag">まず結論</span>
          <h2>{r.verdictTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: r.verdictBody }} />
        </div>

        <h3 className="sec">どんなラケット？（30秒）</h3>
        <div className="spec">
          {r.specs.map((s) => (
            <div className="row" key={s.label}>{s.label}<b>{s.val}</b></div>
          ))}
          <div className="oneline" dangerouslySetInnerHTML={{ __html: r.oneline }} />
        </div>

        <h3 className="sec">人気セットアップ Top{r.setups.length} <span className="sub-note">（ユーザー投票順）</span></h3>
        {r.setups.map((s) => (
          <div className="card" key={s.rank}>
            <span className="rank">{s.rank}位</span>
            <div className="votes"><b>{s.votes}</b>票</div>
            <div className="gname">{s.gut}</div>
            <div className="tension">{s.tension}</div>
            <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
            <div className="forwho">こんな人に：{s.forWho}</div>
            <div className="cmt">{s.comment}</div>
            <div className="buys"><a className="rk-b" href="#">楽天で見る</a><a className="az" href="#">Amazonで見る</a></div>
          </div>
        ))}

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
          <VoteButton model={r.model} />
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
      </main>
    </div>
  );
}
