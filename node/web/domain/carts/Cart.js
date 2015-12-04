/*
// See the README.md for info on this module
*/
module.exports.name = 'Cart';
module.exports.dependencies = ['Blueprint', 'ObjectID', 'exceptions'];
module.exports.factory = function (Blueprint, ObjectID, exceptions) {
    'use strict';
    var Cart = {};
    
    Cart.addToCart = function (old, product) {
        var self ={};
        self = old;
        var flag = false;
        var i;
        for(i=0; i<self.book.length; i++) {
            if (self.book[i].uid === product.uid) {
               self.book[i].qty++;
               self.amount += product.price;
               //console.log('before--- qty: ', self.book[i].qty,'amount: ', self.amount);
               //self.amount.toFixed(2);
               self.amount = Math.round(self.amount * 100) / 100.0;
               //console.log('after--- qty: ', self.book[i].qty,'amount: ', self.amount);
               flag = true;
               break;
            }
        }
        if (!flag) {
          self.book.push(product);
          self.book[self.book.length-1].qty = 1;
          self.amount += product.price;
          self.amount = Math.round(self.amount * 100) / 100.0;
        } 
        
        self.items += 1;
        console.log('test------------------->> ',self.items);
        return self;
    };
    
    // dont know, maybe will not work
    Cart.mergeCart = function (old, localCart) {
        var self ={};
        var i, j;
        
        if(!old) {
            // old is retrived from db, maybe null or undefined
            self.book = [];
            self.amount = 0;
        }
        else {
            self = old;
        }
        
        var lenOld = old.book.length;
        for(j=0; j<localCart.book.length; j++) {
            var flag = false;
            for(i = 0; i<lenOld; i++) {
                if (self.book[i].uid === localCart.book[j].uid) {
                    self.book[i].qty += localCart.book[j].qty;
                    flag = true;
                }
            }
            
            if (!flag) {
                self.book.push(localCart.book[i]);
            }
        }
        
        self.amount = Math.round((self.amount + localCart.amount) * 100) / 100.0;
        self.items += localCart.items;
        
        return self;
    };

    Cart.removeQty = function (old, product) {
        var self ={};
        self = old;
        var i;
        for(i=0; i<self.book.length; i++) {
            if (self.book[i].uid === product.uid) {
               //if qty is one, remove from the cart
               if (self.book[i].qty === 1) {
                 self.items = 0;
                 self.book.splice(i, 1);
               }
               // if qty is greater than one, qty --
               else {
                 self.book[i].qty--;
                 self.items -= 1;
               }
               self.amount -= product.price;
               self.amount = Math.round(self.amount * 100) / 100.0;
               break;
            }
        }
        
        return self; 
    };

    Cart.removeList = function (old, product) {
        var self ={};
        self = old;
        var i;
        for(i=0; i<self.book.length; i++) {
            if (self.book[i].uid === product.uid) {
               self.amount -= (self.book[i].price * self.book[i].qty);
               self.amount = Math.round(self.amount * 100) / 100.0;
               self.items -= self.book[i].qty;
               
               if(self.book.length === 1) {
                 self.amount = 0;
                 self.items = 0;
               }
                //remove the entire book object
               self.book.splice(i, 1);
               break;
            }
        }
        return self; 
    };

    return Cart;
};
