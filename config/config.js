'use strict';
let _ = require('lodash'),
    glob = require('glob');

module.exports = {
    db: {
        database: 'sphinx-sample',
        host: 'localhost',
        port: 5432,
        username: 'vhchung',
        password: '',
        dialect: 'postgres',
        logging: true
    },
    pagination: {
        number_item: 5
    }
};

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    // For context switching
    let _this = this;

    // URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            //glob(globPatterns, {
            //    sync: true
            //}, function(err, files) {
            //    if (removeRoot) {
            //        files = files.map(function(file) {
            //            return file.replace(removeRoot, '');
            //        });
            //    }
            //    output = _.union(output, files);
            //});
            // fix error throw new TypeError('callback provided to sync glob')
            var files = glob.sync(globPatterns);
            if (removeRoot) {
                files = files.map(function(file) {
                    return file.replace(removeRoot, '');
                });
            }
            output = _.union(output, files);
        }
    }
    return output;
};

module.exports.getAllCustomFilter = function (env) {
    this.getGlobbedFiles('../custom_filters/*.js').forEach(function (routePath) {
        console.log(routePath);
        require(routePath)(env);
    });
    return env;
};