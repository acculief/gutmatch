"use client";
import { useState } from "react";
import { castVote, votedMap, markVoted } from "@/lib/votes";

// 「あなたの設定を教えて」— ガットを選んで投票（人気セットアップに即反映）
export default function VoteForm({
  slug,
  model,
  guts,
}: {
  slug: string;
  model: string;
  guts: string[];
}) {
  const options = Array.from(new Set(guts));
  const [gut, setGut] = useState(options[0] || "");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function submit() {
    if (!gut || state !== "idle") return;
    if (votedMap(slug)[gut]) {
      setState("done");
      return;
    }
    setState("sending");
    markVoted(slug, gut);
    const ok = await castVote(slug, gut);
    setState(ok ? "done" : "idle");
  }

  if (state === "done") {
    return (
      <p className="vote-thanks">
        ✓ 投票ありがとう！<b>{gut}</b> を人気セットアップに反映しました。ページを再読み込みすると順位に反映されます。
      </p>
    );
  }

  return (
    <div className="vote-form">
      <label>
        {model} に張ってるガット：
        <select value={gut} onChange={(e) => setGut(e.target.value)}>
          {options.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <button className="vbtn" disabled={state === "sending"} onClick={submit}>
        {state === "sending" ? "送信中…" : "自分の設定を投票する"}
      </button>
    </div>
  );
}
