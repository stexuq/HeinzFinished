<p> user Repo README </p>

<p> There are these server side method added as the following
	<li>self.addToCart = function (email, book, callback) {} </li>
	<p> This method is used to add one book to the shopping cart and store the new shopping cart into MongoDB. </p>
	<p>  </p>

	<li> self.mergeCart = function (email, localCart, callback) {} </li>
	<p> This method is used to merge two carts (a guest user has something in his shopping cart, but when he logs in as a shopper, there is also something in the shopping cart. (corner case). </p>
	<p>  </p>

	<li> self.removeQty = function (email, book, callback) {}) </li>
	<p> This method is used to modify the quantify of a book (reduce by one each time). </p>
	<p>  </p>

	<li> self.removeList = function (email, book, callback) {} </li>
	<p> This method is used to modify the shopping cart (remove an entire book item each time). </p>
	<p>  </p>

	<li> self.pushHistory = function (email, callback) {} </li>
	<p> This method is used to push the data stored in the shopping cart to user order history and clear the shopping cart. </p>
	<p>  </p>

</p>
