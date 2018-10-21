const AWS = require('aws-sdk');
const exec = require('child_process').exec;
const fs = require('fs');
const mktemp = require('mktemp');
const moment = require('moment');
const path = require('path');
const pdf = require('html-pdf');

const BUCKET_NAME = 'aoyama.vallab.ninja';  // 生成されたPDFのアップロード先バケット
const BUCKET_REGION = 'ap-northeast-1';

// htmlをpdfに変換する
function convertAsync(html, pdfFileName) {
    return new Promise(function(resolve, reject) {
        var options = {
            format: 'A4',        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
            orientation: 'portrait', // portrait or landscape
        };

        pdf.create(html, options).toFile(pdfFileName, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    filename: res.filename
                });
            }
        });
    });
}

// エントリポイント
exports.handler = (event, context, callback) => {
    console.log('event', event);
    if (!event.html || event.html == '') {
        context.fail({ message: 'リクエストボディが空です。' });
        return;
    }
    var html = event.html;  // PDFに変換するhtml

    // fontconfigの設定ファイルがあるディレクトリを指定
    process.env['FONTCONFIG_PATH'] = '/var/task/fonts';

    console.log('process.cwd =', process.cwd());

    // キャッシュディレクトリ作成
    var tmpDir = mktemp.createDirSync('/tmp/XXXXXXXXX');
    console.log('tmpDir', tmpDir);
    const CACHE_DIR = tmpDir + '/fonts-cache';   // fontconfigのキャッシュディレクトリ
    fs.mkdirSync(CACHE_DIR);

    // フォントキャッシュ作成
    exec('fc-cache -v /var/task/fonts', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            context.fail({ message: 'フォントキャッシュ作成に失敗しました。' });
            return;
        }

        exec('find /tmp -print', function(err, stdout, stderr) {
            if (err) {
                console.error(err);
                context.fail({ message: 'findに失敗しました。' });
                return;
            }
            console.log(stdout);

            var pdfFileName = tmpDir + '/' + moment().format('YYYYMMDD_HHmmss') + '.pdf';
            convertAsync(html, pdfFileName)
            .then(function(result) {
                console.log('result', result);

                // 生成されたPDFファイルをS3にアップロード
                AWS.config.update({ region: BUCKET_REGION });
                var s3 = new AWS.S3();
                var now = moment();
                var key = 'pdf/' + path.basename(pdfFileName);
                var content = fs.readFileSync(result.filename);
                var params = {
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: content,
                };
                s3.putObject(params).promise()
                .then(function() {
                    context.succeed({
                        pdfUrl: `https://s3-${BUCKET_REGION}.amazonaws.com/${BUCKET_NAME}/${key}`
                    });
                })
                .catch(function(err) {
                    context.fail({ message: 'S3へのアップロードに失敗しました。' });
                });
            })
            .catch(function(err) {
                console.error(err);
                context.fail({ message: '予期しないエラーが発生しました。' });
            });
        });
    });
};
