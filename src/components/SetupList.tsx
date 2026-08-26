"use client";
import { useEffect, useState } from "react";
import { buyUrls, fetchCounts, castVote, votedMap, markVoted } from "@/lib/votes";

export type Setup = {
  rank: number;
  votes: number;
  gut: string;
  tension: string;
  tags: string[];
  forWho: string;
  comment: string;
};

export default function SetupList({ slug, setups }: { slug: string; setups: Setup[] }) {
  const [real, setReal] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetchCounts(slug).then(setReal);
    setVoted(votedMap(slug));
  }, [slug]);

  const total = (s: Setup) => s.votes + (real[s.gut] || 0);
  const ordered = [...setups].sort((a, b) => total(b) - total(a));

  async function vote(gut: string) {
    if (voted[gut] || busy) return;
    setBusy(gut);
    setReal((m) => ({ ...m, [gut]: (m[gut] || 0) + 1 })); // 楽観的更新
    setVoted((m) => ({ ...m, [gut]: true }));
    markVoted(slug, gut);
    await castVote(slug, gut);
    setBusy(null);
  }

  return (
    <>
      {ordered.map((s, i) => {
        const b = buyUrls(s.gut);
        const done = !!voted[s.gut];
        return (
          <div className="card" key={s.gut}>
            <span className="rank">{i + 1}位</span>
            <div className="votes">
              <b>{total(s).toLocaleString()}</b>票
            </div>
            <div className="gname">{s.gut}</div>
            <div className="tension">{s.tension}</div>
            <div className="tags">
              {s.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="forwho">こんな人に：{s.forWho}</div>
            <div className="cmt">{s.comment}</div>
            <div className="buys">
              <button
                className="vote-in"
                disabled={done || busy === s.gut}
                onClick={() => vote(s.gut)}
              >
                {done ? "✓ 投票済み" : "👍 これに投票"}
              </button>
              <a className="rk-b" href={b.rakuten} target="_blank" rel="nofollow sponsored noopener">
                楽天で見る
              </a>
              <a className="az" href={b.amazon} target="_blank" rel="nofollow sponsored noopener">
                Amazonで見る
              </a>
            </div>
          </div>
        );
      })}
    </>
  );
}
