# AWS Lambdaでhtmlをpdfに変換する（日本語フォント対応）

Node.jsのhtml-pdfモジュールを使って任意のhtmlをpdfに変換するサンプルです。
html-pdfは内部でPhantomJSを使っているので、安定した品質のpdf生成ができます。


## 動作環境

- AWS Lambda NodeJS 8.10


## 使い方

- まずAWSコンソールでNode.js 8.10のLambda関数を作っておきます。
- タイムアウトは1分くらいに設定。
- メモリは256MB以上を推奨。
- [リリース](https://github.com/aoyama-val/lambda-html2pdf/releases)にあるzipファイルをLambda関数にデプロイします。
- Lambda関数に環境変数を設定します。
  - `BUCKET_NAME` PDFファイルのアップロード先S3バケット名（例: `hogehoge` ）
  - `BUCKET_REGION` S3のリージョン（例: `ap-northeast-1` ）

下記のイベントを与えてLambda関数をテストすると、PDFが生成されてS3にアップロードされるはずです。

```
{
  "html": "<div>abc あいうえお def</div>"
}
```


## 自分でzipパッケージをビルドする方法

[リリース](https://github.com/aoyama-val/lambda-html2pdf/releases)にあるzipファイルを使うのでなく、
自分でzipパッケージをビルドしたい場合は下記の手順に従います。

Amazon Linux上で下記を実行します。

- 下記の環境変数を設定
  - `BUCKET_NAME` 例: `hogehoge`
  - `BUCKET_REGION` 例: `ap-northeast-1`

```
git clone このリポジトリ
cd このリポジトリ
npm install
function_name="さっき作ったLambda関数名" ./deploy
```

以上でデプロイされます。
