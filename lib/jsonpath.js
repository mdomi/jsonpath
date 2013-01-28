/*
 * Copyright (c) 2013 Michael Dominiice
 * Licensed under an MIT-style license (see LICENSE for full text)
 */
 /*global require:false, process:false */
(function () {
    'use strict';

    var writeLine = function (stream, text) {
        stream.write(text + '\n');
    };

    var createParserCallback = (function (jsonPath) {

        var DEFAULT_PATH = '.';

        return function (options, path) {
            path = path || DEFAULT_PATH;
            return function (object) {
                if (object) {
                    try {
                        var evaluatedPath = jsonPath.eval(object, path);
                        evaluatedPath.forEach(function (part) {
                            writeLine(options.streamOut, JSON.stringify(part));
                        });
                    } catch (e) {
                        writeLine(options.streamError, String(e));
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
}());