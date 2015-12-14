/*
/ See the README.md for info on this module
*/
module.exports.name = 'Cart';
module.exports.dependencies = ['Blueprint', 'ObjectID', 'exceptions'];
module.exports.factory = function (Blueprint, ObjectID, exceptions) {
    'use strict';
    var Cart = {};
    
    // add a book to the cart
    Cart.addToCart = function (old, product) {
        var self ={};
        self = old;
        var flag = false;
        var i;
        for(i=0; i<self.book.length; i++) {
            if (self.book[i].uid === product.uid) {
               self.book[i].qty++;
               self.amount += product.price;
               // Stripe charge should be round to cents
               self.amount = Math.round(self.amount * 100) / 100.0;
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
        return self;
    };
    
    // merge two carts 
    // 1) local shopping cart of the guest user
    // 2) shopping cart stored in the data base 
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
        
        console.log("old->>>>>>>>>>>>", old);
        console.log("local->>>>>>>>>>>", localCart);
        
        self.amount = Math.round((self.amount + localCart.amount) * 100) / 100.0;
        self.items += localCart.items;
        
        var lenOld = old.book.length;
        for(j = 0; j<localCart.book.length; j++) {
            var flag = false;
            for(i = 0; i<lenOld; i++) {
                if (self.book[i].uid === localCart.book[j].uid) {
                    self.book[i].qty += localCart.book[j].qty;
                    flag = true;
                }
            }
            
            if (!flag) {
                self.book.push(localCart.book[j]);
            }
        }
        
        return self;
    };

    // remove one item of the specific book 
    Cart.removeQty = function (old, product) {
        var self ={};
        self = old;
        var i;
        for(i=0; i<self.book.length; i++) {
            if (self.book[i].uid === product.uid) {
               //if qty is one, remove this item from the cart
               if (self.book[i].qty === 1) {
                 //self.items = 0;
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

    // remove the entire book item 
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
