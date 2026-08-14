import Link from "next/link";
import { racketList } from "@/data/rackets";

export default function Home() {
  const brands = ["すべて", "バボラ", "ウィルソン", "ヨネックス", "ヘッド", "スリクソン"];
  return (
    <div className="wrap">
      <header className="top">
        <div className="logo">ガット<span>マッチ</span></div>
        <div className="tagline">ラケット別 おすすめガット・人気セットアップ</div>
      </header>
      <main>
        <section className="lead">
          <h1 className="lead-h1">その1本に、<br />合うガットは？</h1>
          <p className="lead-p">ラケットを選ぶと、<b>おすすめのガット・テンション・みんなの人気セットアップ</b>がすぐわかる。もう知恵袋を探さなくていい。</p>
        </section>

        <h3 className="sec">ブランドで探す</h3>
        <div className="chips">
          {brands.map((b) => <span key={b} className={"chip" + (b === "すべて" ? " on" : "")}>{b}</span>)}
        </div>

        <h3 className="sec">ラケットから探す</h3>
        <div className="rk-grid">
          {racketList.map((r) => (
            <Link key={r.slug} href={"/racket/" + r.slug} className="rk-card">
              <div className="rk-thumb"><img src={r.image} alt={r.model} /></div>
              <div className="rk-body">
                <div className="rk-brand">{r.brand}</div>
                <div className="rk-model">{r.model}</div>
                <div className="rk-badge">{r.badge}</div>
              </div>
              <div className="rk-go">›</div>
            </Link>
          ))}
          <div className="rk-soon">プリンス / テクニファイバー 等も順次追加中</div>
        </div>
      </main>
      <footer className="foot">© 2026 ガットマッチ ・ 情報は目安です。ガット/テンションは体感に個人差があります。</footer>
    </div>
  );
}
