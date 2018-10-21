# AWS Lambdaでhtmlをpdfに変換する（日本語フォント対応）

Node.jsのhtml-pdfモジュールを使って任意のhtmlをpdfに変換するサンプルです。
html-pdfは内部でPhantomJSを使っているので、安定した品質のpdf生成ができます。


## 動作環境

- AWS Lambda NodeJS 8.10
- セットアップのためにAmazon Linux環境が必要
  - （`npm install`したときにPhantomJSのバイナリがインストールされるため）


## セットアップ

まずAWSコンソールでNode.js 8.10のLambda関数を作っておきます。
- タイムアウトは1分くらいに設定。
- 下記の環境変数を設定
  - `BUCKET_NAME` 例: `hogehoge`
  - `BUCKET_REGION` 例: `ap-northeast-1`

Amazon Linux上で下記を実行します。

```
git clone このリポジトリ
cd このリポジトリ
npm install
function_name="さっき作ったLambda関数名" bucket_name="Lambdaのzipパッケージアップロード先S3バケット名" region=ap-northeast-1 ./deploy
```

以上でデプロイされます。

下記の値を与えてLambda関数をテストすると、PDFが生成されてS3にアップロードされるはずです。

```
{
  "html": "<div>abc あいうえお def</div>"
}
```
