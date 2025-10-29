FROM node:18-bullseye

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY nextjs-project/package.json nextjs-project/package-lock.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY nextjs-project .

# 必要なポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]