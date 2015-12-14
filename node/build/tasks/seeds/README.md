<p> Change to MongoDB schema </p>
<p>
	<li> add "shopping cart" field to "user" collection </li>
		<li> a book arrary: keeping track of all the books </li>
			<li> every book item in this array has an additional field "qty": represent the quantity in the cart </li>
        <li> amount: keeping track of total amount in the shopping cart </li>
        <li> items: keeping track of all items in the shopping cart </li>
	<li> add "history cart" field to "user" collection </li>
		<li> a book array that simply keeps track all the books that a user has purchased successfully </li>
