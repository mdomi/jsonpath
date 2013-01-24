var jsonPath = require('JSONPath');
var JSONStream = require('JSONStream');
var path = process.argv[2] || '.';

var parser = JSONStream.parse();
process.stdin.pipe(parser);

parser.on('data', function (object) {
    if (object) {
        process.stdout.write('\n');
        try {
            var evaluatedPath = jsonPath.eval(object, path);
            for (var i = 0; i < evaluatedPath.length; i++) {
                process.stdout.write(JSON.stringify(evaluatedPath[i]) + '\n');
            }
        } catch (e) {
            process.stderr.write(String(e) + '\n');
        }
    }
});

process.stdin.resume();