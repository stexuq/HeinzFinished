# Book.js
The Book module demonstrates subtype polymorphism in JavaScript. Upon construction, it inherits Product by setting its own value to a new Product.

```JavaScript
//~// (removed for brevity)

    var self = new Product(book);

//~// (removed for brevity)  
```

It then further validates the schema with its own Blueprint. By the time a result is returned, the constructor guarantees that the object meets the definition for both a Product and a Book.

```JavaScript
//~// (removed for brevity)

// The Product blueprint will validate the majority of the model.
// This blueprint is meant to enforce properties that are unique to Book.
blueprint = new Blueprint({
    metadata: new Blueprint({
        authors: 'array'
    })
});

//~// (removed for brevity)

    // Validate that this meets the Book schema
    if (!book || !blueprint.syncSignatureMatches(book).result) {
        exceptions.throwArgumentException('', 'book', blueprint.syncSignatureMatches(book).errors);
        return;
    }

//~// (removed for brevity)  
```
