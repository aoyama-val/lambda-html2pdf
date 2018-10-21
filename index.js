const exec = require('child_process').exec;
const fs = require('fs');

const CACHE_DIR = '/tmp/fonts-cache';

exports.handler = (event, context, callback) => {
    process.env['FONTCONFIG_PATH'] = '/var/task/fonts';

    console.log("process.cwd =", process.cwd());
    fs.mkdirSync(CACHE_DIR);

    exec('fc-cache -v /var/task/fonts', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            context.fail("NG");
            return;
        }

        exec('ls -la /tmp', function(err, stdout, stderr) {
            if (err) {
                console.error(err);
                context.fail("NG");
                return;
            }
            console.log(stdout);
            context.succeed("OK");
        });
    });
};
