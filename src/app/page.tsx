import Link from "next/link";
import { racketList } from "@/data/rackets";
import RacketBrowser from "@/components/RacketBrowser";

export default function Home() {
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
          <Link href="/compare/" className="cmp-cta">⚖️ ラケットをくらべる（スペック・おすすめガット比較）→</Link>
        </section>

        <RacketBrowser rackets={racketList} />
      </main>
      <footer className="foot">© 2026 ガットマッチ ・ 情報は目安です。ガット/テンションは体感に個人差があります。</footer>
    </div>
  );
}
