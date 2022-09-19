# Hit&Blow
TypeScriptの練習用プログラムです。

実際のゲーム例:
https://www.p-game.jp/game243/

## 環境構築
Node.jsのインストール
https://nodejs.org/ja/download/

確認コマンド
```
node --version
```
```
npm --version
```


セットアップ（package.jsonがあるディレクトリで以下コマンド）
```
npm install
```

もしソースコード内のprocessモジュールで怒られている場合
```
npm install -D @types/node@16.4.13
```




## 実行の仕方
TSのコンパイル
```
npm run build
```

CLIでの実行
```
npm run start
```

### 学べたこと
- Node.jsにおける標準入力と標準出力の一例
- TSの基本的な型
- 引数のデフォルト値とオプショナルの関係
- constとletによる型推論の違い
- 各修飾子、ユニオン型、never型の使い方
- typeとinterface
- 型アサーション、ジェネリクス、ジェネリクスへの継承
- タプルとas const
