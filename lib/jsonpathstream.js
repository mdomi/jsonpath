/*
 * Copyright (c) 2013 Michael Dominiice
 * Licensed under an MIT-style license (see LICENSE for full text)
 */
/*global require:false, module:false */
(function () {
    'use strict';

    var stream = require('stream');
    var util = require('util');
    var JSONStream = require('JSONStream');
    var jsonPath = require('JSONPath');
    
    var DEFAULT_PATH = '.';

    function ResultStream() {
        var parser = JSONStream.stringify(false);
        stream.Stream.call(this);
        parser.pipe(this);

        this.write = function () {
            return parser.write.apply(parser, arguments);
        };

        this.end = function () {
            parser.end.apply(parser, arguments);
            this.emit('close');
        };

        this.pipe = function () {
            return parser.pipe.apply(parser, arguments);
        };
    }

    function JSONPathStream(path) {
        var parser = JSONStream.parse();
        var resultStream = new ResultStream();

        path = path || DEFAULT_PATH;

        this.readable = true;
        this.writable = true;

        stream.Stream.call(this);

        parser.on('data', function (object) {
            if (object) {
                resultStream.write(jsonPath.eval(object, path));
            }
        });

        this.write = function (data) {
            return parser.write(data);
        };

        this.end = function () {
            parser.end.apply(parser, arguments);
            resultStream.end.apply(resultStream, arguments);
            this.emit('close');
        };

        this.pipe = function () {
            return resultStream.pipe.apply(parser, arguments);
        };
    }

    util.inherits(JSONPathStream, stream.Stream);
    util.inherits(ResultStream, stream.Stream);

    module.exports.JSONPathStream = JSONPathStream;
    
}());