# Product.js
The Product module is a base/generic object to represent products. It has a metadata property that can be used for, among other things, properties that are unique to a given type of product. See the Book module for a subtype polymorphism example.

In JavaScript, you can add properties to objects you might not expect you could. In our Product Module, we define a `db` property on the `Product` constructor. Note that `Product.db` is static, while the result of constructing a `Product` is not.

The `db` property on the `Product` provides instructions to our repository module, so it knows what collection to store the data in (`Product.db.collection`), and what properties should be indexed, to improve query performance (`Product.db.indexes`). Collections are to MongoDB what tables are to SQL Server.

## Casting to self
Notice that we create an object called self, and that we cast the `product` argument to it.

> Question: Why do you think we cast the product to self, instead of just returning the product if it passes the blueprint check?

# productsRepo.js
The productRepo is a service module that can be used to query the database. It is set up to query a single collection: products.

> Question: How might we adapt this module to allow it to support querying other collections?

> Question: Notice that `module.exports.blueprint = ['repoBlueprint'];` is commented out. That's because it breaks the Liskov Substitution Principle. Do you know why?
