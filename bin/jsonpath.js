/*
 * Copyright (c) 2013 Michael Dominiice
 * Licensed under an MIT-style license (see LICENSE for full text)
 */
 /*global require:false, process:false */
(function () {
    'use strict';

    var JSONPathStream = require('../lib/jsonpathstream').JSONPathStream,
        parser = new JSONPathStream(process.argv[2]);

    process.stdin.pipe(parser);
    parser.pipe(process.stdout);

    process.stdin.resume();

}());
