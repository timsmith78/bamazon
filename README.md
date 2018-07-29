# bamazon
Bamazon is an online store that is composed of 3 separate applications:
* bamazonCustomer allows customers to buy items from the store
* bamazonManager allows managers to add items to the store and manage inventory levels
* bamazonSupervisor allows supervisors to view departmental profits or losses

## bamazonCustomer
Upon startup, bamazonCustomer will display a list of items and their prices.  The user
should simply enter the id of the desired item at the prompt, and then enter the desired
quantity.  If sufficient quantity is in stock, the user will get a success message indicating 
the total price like this:

![customer purchase success](./img/cust_success.png)

If insufficient quantity is in stock, the user will get an error like this:

![customer purchase error](./img/cust_fail.png)
