# PDCAメモ管理

## 概要
PDCA（Plan-Do-Check-Act）サイクルを記録・管理できるWebアプリです。
学習や自己改善のための行動を可視化し、継続的な改善をサポートします。

## 機能一覧
- ユーザー登録・ログイン機能
- PDCAのCRUD操作
- レスポンシブ対応
- セッション管理（express-session）

## 技術スタック
- フロントエンド：Next.js, React
- バックエンド：Express, Node.js
- データベース：MongoDB (Mongoose)
- その他：Render, vercel でのデプロイ

## URL
- アプリURL：[PDCAアプリページ](https://pdca-app.onrender.com/pdca)

## 工夫したポイント
- express-sessionを使ってセキュアなセッション管理を実現
- `app.set('trust proxy', 1)` を使い、デプロイ環境でのCookie問題を解決
- エラーハンドリングやUX改善にも配慮（例：フォームのバリデーション）

## 今後追加したい機能
- Googleログイン認証
- PDCAの達成率グラフ表示
- ユーザー同士のフィード機能
