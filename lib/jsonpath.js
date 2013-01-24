var createParserCallback = (function (jsonPath) {
    var DEFAULT_PATH = '.';

    return function (options, path) {
        path = path || DEFAULT_PATH;
        return function (object) {
            if (object) {
                try {
                    var evaluatedPath = jsonPath.eval(object, path);
                    for (var i = 0; i < evaluatedPath.length; i++) {
                        options.streamOut.write(JSON.stringify(evaluatedPath[i]) + '\n');
                    }
                } catch (e) {
                    options.streamError.write(String(e) + '\n');
                }
            }
        };
    };

}(require('JSONPath')));

var createParser = (function (JSONStream) {

    return function (options, path) {
        var parser = JSONStream.parse();
        options.streamIn.pipe(parser);
        parser.on('data', createParserCallback(options, path));
        return parser;
    };

}(require('JSONStream')));

createParser({
    streamIn : process.stdin,
    streamOut : process.stdout,
    streamError : process.stderr
}, process.argv[2]);

process.stdin.resume();