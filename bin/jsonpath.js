/*
 * Copyright (c) 2013 Michael Dominiice
 * Licensed under an MIT-style license (see LICENSE for full text)
 */
 /*global require:false, process:false */
(function (path, fs) {
    'use strict';

    var JSONPathStream = require('../lib/jsonpathstream').JSONPathStream,
        parser = new JSONPathStream(process.argv[2]),
        filename = process.argv[3],
        readStream;

    parser.pipe(process.stdout);

    if (filename && filename !== '-') {
        readStream = fs.createReadStream(path.normalize(filename));
        readStream.on('data', function (data) {
            parser.write(data);
        });
        readStream.on('end', function () {
            parser.end();
        });
    } else {
        process.stdin.pipe(parser);
        process.stdin.resume();
    }

}(require('path'), require('fs')));
