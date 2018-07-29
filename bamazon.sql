USE bamazon;

DROP TABLE IF EXISTS products;
CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price DECIMAL(7,2),
    stock_quantity INT,
    product_sales DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (item_id)
);

INSERT products (product_name, department_name, price, stock_quantity) VALUES 
( 'soap', 'health and beauty', 1.50, 10),
( 'shampoo', 'health and beauty', 4.50, 8),
( 'toothbrush', 'health and beauty', 1.29, 20),
( 'apple', 'grocery', 0.79, 50),
( 'pie', 'bakery', 6.79, 1),
( 'chocolate cake', 'bakery', 10.00, 3),
( 'kitchen table', 'housewares', 150.00, 5),
( 'ottoman', 'housewares', 80.00, 8),
( 'TV', 'electronics', 999.99, 7);

DROP TABLE IF EXISTS departments;
CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (department_id)
);
