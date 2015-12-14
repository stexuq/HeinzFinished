<p> Cilent side - the /contrller directory contains seven files:</p>

<p> authController.js: define the model of authetication</p>
<p> 1.generate login view model</p>
<p> 2.send email to server side for authentication</p>

<p> bookController.js: define the model for book search</p>
<p> 1.define search api control </p>
<p> 2.control the display of founded book </p>
<p> 3.control the display of no result </p>
<p> 4.display detail of each book </p>

<p> checkController.js: control the checkout workflow </p>
<p> 1.identify if current user is authenticated</p> 
<p>    if so, retrieve previous record from database</p>
<p>    if not, retrieve from session </p>
<p> 2.add one book from shopping cart</p>
<p> 3.remove one book from shopping cart</p>
<p> 4.remove book record from shopping cart</p>

<p> exampleController.js: template - skip</p>
<p> since we did not use the template</p>

<p> historyController.js: control the view model of user histry</p>
<p> 1. get user history from data base</p>    

<p> homeController.js: define the model for seach api - skip</p>

<p> paymentController.js: define payment with strip </p>
<p> 1. send payment to server and get responese with payment view engine</p>
<p> 2. create token and send to server side</p>
<p> 3. wait response from server</p>
