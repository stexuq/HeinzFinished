<p> Server-side controller README </p>

<p> There are these server side controller as the following
	<li> authController.js: used to authenticate </li>
		<p> 1. router.post('/login', function (req, res) {}) is used to check whether a user is logged in or not. If the answer is yes, then the cookies will be overwritten. Else, the app will crash.</p>
		<p> 2. router.get('/checklogin', function (req, res) {}) has similar functions to check whether a user is logged in. However, it will not overwrite the cookies, since it is merely used to check not to authenticate. </p>
		<p> 3. router.post('/api/loginforpayment', function (req, res) {}) also has similar functions. However, to manage the code more easily, this function is only used when a guest wants to check out for payment and the system forces him to log in. </p>
		<p>  </p>

	<li> checkoutController.js: used to generate the shopping cart and implement the modification methods </li>
		<p>1. router.get('/api/checkout', function (req, res) {}) is used to dynamically generate the shopping cart page for a logged-in shopper. It retrives shopping cart data from MongoDB for a logged-in shopper and send this information back to the client side controller. </p>
		<p>2. router.get('/api/getcart', function(req,res) {}) is used to dynamically generate the shopping cart page for a guest. It sends back the shopping cart data stored in request.session to the client side controller. </p>
		<p>3. router.get('/api/books/:uid/buy', function (req, res) {}) is used to add one book to the shopping cart. The system will store shopping cart information into MongoDB or request.session, determined by the log-in status of the user.</p>
		<p>4. router.get('/api/books/:uid/removeqty', function (req, res) {}) is used to remove one book from the shopping cart (modify quantity by one)</p>
		<p>5. router.get('/api/books/:uid/removelist', function (req, res) {}) is used to remove one entire book item from the shopping cart (remove the whole item) </p>
		<p>  </p>

	<li> historyController.js: used to push history and dynamically generate the history page </li>
		<p>1. router.get('/api/pushhistory', function (req, res) {}) is used to push a successfully paid shopping cart into the history field in MongoDB and empty the shopping cart </p>
		<p>2. router.get('/api/gethistory', function (req, res) {}) is used to retrieve the history informaiton stored in MongoDB and send it back to the client side controller. </p>
		<p>  </p>

	<li> paymentController.js: used the token generated on the client side to charge the user </li>
		<p> 1. router.post('/api/payments', function (req, res) {}) is used to charge the user with Stripe. The token and amount are stored in data posted to the server side router. </p>
		<p>  </p>

</p>

