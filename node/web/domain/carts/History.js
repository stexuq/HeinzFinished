/*
// See the README.md for info on this module
*/
module.exports.name = 'History';
module.exports.dependencies = ['Blueprint', 'ObjectID', 'exceptions'];
module.exports.factory = function (Blueprint, ObjectID, exceptions) {
    'use strict';
    var History = {};
    
    History.pushCart = function (oldHistory, cart) {
        var self;
        var i;
        if(!oldHistory) {
            self = [];
        }
        else {
            self = oldHistory;
        } 
        for(i=0; i<cart.book.length; i++) {
            self.push(cart.book[i]);
        }
        return self;
    };

    return History;
};
