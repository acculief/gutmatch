// ガットマッチ 投票バックエンド（Supabase REST / anonキーは公開可）
export const SB_URL = "https://cuinyjpiifcslzexrunc.supabase.co";
export const SB_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NDY1MDEsImV4cCI6MjA4NzIyMjUwMX0.E8i5R_OUtVBFQ6Lz3Du09zfK3gEhhhom8Zp6Wq5W5t8";

const H = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

// ガット名を楽天/Amazon検索に連動（「A / B」は先頭を採用）
export function buyUrls(gut: string) {
  const base = gut.split("/")[0].trim();
  const q = encodeURIComponent(base + " テニス ガット");
  return {
    rakuten: `https://search.rakuten.co.jp/search/mall/${q}/`,
    amazon: `https://www.amazon.co.jp/s?k=${q}`,
  };
}

// ラケットごとの実投票数（gut別）を集計ビューから取得
export async function fetchCounts(slug: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/gutmatch_vote_counts?racket_slug=eq.${encodeURIComponent(
        slug
      )}&select=gut,votes`,
      { headers: H }
    );
    if (!res.ok) return {};
    const rows: { gut: string; votes: number }[] = await res.json();
    const m: Record<string, number> = {};
    rows.forEach((r) => (m[r.gut] = r.votes));
    return m;
  } catch {
    return {};
  }
}

export async function castVote(slug: string, gut: string): Promise<boolean> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/gutmatch_votes`, {
      method: "POST",
      headers: { ...H, "Content-Type": "application/json" },
      body: JSON.stringify({ racket_slug: slug, gut }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 同一ブラウザからの多重投票をゆるく抑止（localStorage）
export function votedMap(slug: string): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(`gm_voted_${slug}`) || "{}");
  } catch {
    return {};
  }
}
export function markVoted(slug: string, gut: string) {
  try {
    const m = votedMap(slug);
    m[gut] = true;
    localStorage.setItem(`gm_voted_${slug}`, JSON.stringify(m));
  } catch {
    /* noop */
  }
}
