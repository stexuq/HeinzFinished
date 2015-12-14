<p> ViewModel README </p>

<p> There are some newly added templates as the following: 
	<li> history.hbs </li>
		<span> Dynamically generates the user order history page</span>
	<li> loginpayment.hbs </li>
		<span> Dynamically generates the user log in page if a guest wants to check out</span>
	<li> payment.hbs </li>
		<span> Dynamically generates the payment page to collect credit card information from the user </span>
	<li> shoppingCart.hbs </li>
		<span> Dynamically generates the shopping cart page. If the user is logged in, then the shopping cart data is retrieved from MongoDB. If the user is under guest mode, then the shopping cart data is retrieved from session.shoppingcart</span>
</p>
