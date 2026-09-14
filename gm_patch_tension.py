#!/usr/bin/env python3
# gutmatch 改善: 機種固有の推奨テンション目安セクション + 計算FAQ(可視+JSON-LD)
import io, sys

P = "src/app/racket/[slug]/page.tsx"
s = io.open(P, encoding="utf-8").read()
orig = s

# 1) import に Racket 型を追加
s = s.replace(
    'import { rackets } from "@/data/rackets";',
    'import { rackets, type Racket } from "@/data/rackets";',
)

# 2) tensionGuide ヘルパーを generateStaticParams の前に挿入
helper = '''function tensionGuide(r: Racket) {
  const nums = (r.setups[0]?.tension || "").match(/\\d+/g)?.map(Number) || [];
  const base = nums[0] || 50;
  const lo = nums[1] || base - 2;
  const hi = nums[2] || base + 2;
  const easy = Math.max(40, base - 3);
  const firm = base + 3;
  return { base, lo, hi, easy, firm };
}

export function generateStaticParams() {'''
s = s.replace("export function generateStaticParams() {", helper, 1)

# 3) コンポーネント本体で tg / 拡張faqs を計算
s = s.replace(
    '''  const r = rackets[slug];
  if (!r) notFound();
  return (''',
    '''  const r = rackets[slug];
  if (!r) notFound();
  const tg = tensionGuide(r);
  const faqs = [...r.faqs, {
    q: `${r.model}は何ポンドで張ればいい？`,
    a: `迷ったら<b>${tg.base}ポンド前後（${tg.lo}〜${tg.hi}）</b>が基準です。柔らかい打感や楽に飛ばしたい人は<b>${tg.easy}前後</b>、飛び・スピンを締めて<b>コントロール</b>したい上級者は<b>${tg.firm}前後</b>まで上げると合わせやすい。ガット素材（ポリ/マルチ）でも最適値は変わるので、上の推奨テンション目安も参照してください。`,
  }];
  return (''',
    1,
)

# 4) JSON-LD の faqs を拡張版に
s = s.replace(
    'r.faqs.map((f) => ({ "@type": "Question"',
    'faqs.map((f) => ({ "@type": "Question"',
    1,
)

# 5) 可視FAQ を拡張版に
s = s.replace(
    "{r.faqs.map((f, i) => (",
    "{faqs.map((f, i) => (",
    1,
)

# 6) 推奨テンション目安セクションを「プロ／上級者の参考」の直前に挿入
section = '''        <h3 className="sec">何ポンドで張る？{r.model}の推奨テンション目安</h3>
        <table>
          <tbody>
            <tr><th>狙い</th><th>目安テンション</th><th>こんな人に</th></tr>
            <tr><td><b>まず基準</b></td><td>{tg.base} lbs（{tg.lo}〜{tg.hi}）</td><td>{r.model}を標準的に扱いたい・迷ったらここから</td></tr>
            <tr><td><b>楽に飛ばす / 腕に優しく</b></td><td>{tg.easy} lbs前後</td><td>初級〜中級・テニス肘が不安・もっと飛ばしたい</td></tr>
            <tr><td><b>締める / コントロール</b></td><td>{tg.firm} lbs前後</td><td>上級・飛びすぎる・面のブレを抑えたい</td></tr>
          </tbody>
        </table>
        <p className="tension-note">ガット別の細かいテンションは上の「人気セットアップ」を参照。ポリは基準〜やや低め、マルチ／ナイロンは飛びやすいのでやや高めが目安です。{r.model}はまず<b>{tg.base}ポンド</b>で張って、飛びすぎるなら+2、楽に飛ばしたいなら-2で微調整を。</p>

        <h3 className="sec">プロ／上級者の参考</h3>'''
s = s.replace('        <h3 className="sec">プロ／上級者の参考</h3>', section, 1)

if s == orig:
    print("NO CHANGE - anchors not found")
    sys.exit(1)

io.open(P, "w", encoding="utf-8").write(s)
print("patched OK")
