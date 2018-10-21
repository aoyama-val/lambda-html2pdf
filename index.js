const exec = require('child_process').exec;
const fs = require('fs');

const CACHE_DIR = '/tmp/fonts-cache';

exports.handler = (event, context, callback) => {
    console.log("process.cwd =", process.cwd());
    fs.mkdirSync(CACHE_DIR);

    exec('fc-cache -v /var/task/fonts', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            context.fail(err);
            return;
        }

        exec('ls -la /tmp', function(err, stdout, stderr) {
            if (err) {
                console.error(err);
                context.fail(err);
                return;
            }
            console.log(stdout);
            context.succeed("OK");
        });
    });
};

