var createParserCallback = (function (jsonPath) {
    var DEFAULT_PATH = '.';

    return function (path, out, error) {
        out = out || process.stdout;
        error = error || process.stderr;
        path = path || DEFAULT_PATH;
        return function (object) {
            if (object) {
                try {
                    var evaluatedPath = jsonPath.eval(object, path);
                    for (var i = 0; i < evaluatedPath.length; i++) {
                        out.write(JSON.stringify(evaluatedPath[i]) + '\n');
                    }
                } catch (e) {
                    error.write(String(e) + '\n');
                }
            }
        };
    };

}(require('JSONPath')));

var createParser = (function (JSONStream) {

    return function (stream, path) {
        var parser = JSONStream.parse();
        stream.pipe(parser);
        parser.on('data', createParserCallback(path));
        return parser;
    };

}(require('JSONStream')));

createParser(process.stdin, process.argv[2]);
process.stdin.resume();


process.stdin.resume();