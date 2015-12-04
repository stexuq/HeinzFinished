var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    ObjectID = mongodb.ObjectID,
    nconf = require('nconf'),
    async = require('async'),
    env = nconf
        .env()
        .argv()
        .file('environment', '../environment/environment.json'),
    seeds = require('./seeds');

module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('seed', 'seeds the database', function () {
        var done = this.async();

        MongoClient.connect(env.get('db:connx-string'), function (err, db) {
            if (err) {
                throw err;
            }

            var collection,
                currentSeed,
                seedNames = Object.getOwnPropertyNames(seeds),
                seedCount = seedNames.length,
                makeSeedHandler,
                tasks = [],
                i,
                j;

            makeSeedHandler = function (collection, seedName, seed) {
                return function (callback) {
                    //var q = seed._id ? { _id: seed._id } : { _id: new ObjectID() };
                    seed._id = new ObjectID(seed._id);
                    var q = { _id: seed._id };

                    collection.updateOne(q , seed, { upsert: true, forceServerObjectId: true }, function (err, r) {
                        var result = {};

                        if (r) {
                            result[seedName] = {
                                matchedCount: r.matchedCount,
                                upsertedCount: r.upsertedCount
                            };
                        }

                        callback(err, result);
                    });
                };
            };

            for (i = 0; i < seedCount; i += 1) {
                collection = db.collection(seedNames[i]);
                currentSeed = seeds[seedNames[i]];

                for (j = 0; j < currentSeed.length; j += 1) {
                    tasks.push(makeSeedHandler(collection, seedNames[i], currentSeed[j]));
                }
            }

            async.parallel(tasks, function (err, results) {
                if (err) {
                    console.log(' SEED ERROR:', err);
                } else {
                    console.log(results);
                }

                done();
            });
        });
    });
};
