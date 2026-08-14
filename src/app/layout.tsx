import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ガットマッチ | ラケット別のおすすめガット・人気セットアップ",
  description:
    "「このラケットに合うガットは？」に一発で答える。ラケット別におすすめのガット・テンション・人気セットアップ（ユーザー投票）がわかる。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja"><body>{children}</body></html>
  );
}
