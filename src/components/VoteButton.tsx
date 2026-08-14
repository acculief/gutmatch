"use client";
export default function VoteButton({ model }: { model: string }) {
  return (
    <button className="vbtn" onClick={() =>
      alert("MVPデモです。本番ではここでガット×テンションを投票→ランキングに即反映されます。（" + model + "）")
    }>自分の設定を投票する</button>
  );
}
