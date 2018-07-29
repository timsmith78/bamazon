const mysql = require('mysql')
const inquirer = require('inquirer')
const Table = require('cli-table')

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// Open DB connection
connection.connect(function (err) {
    if (err) throw err;
    var query1 = connection.query("SELECT item_id,product_name,price FROM products", (err, result, fields) => {
        if (err) { throw err }

        // Use cli-table package to create a pretty table
        const currItemTable = new Table({
            head: ['ID', 'Item Name', 'Price'],
            colWidths: [5, 35, 10]
        });
        console.log("Available Products:")
        result.forEach(row => currItemTable.push([row.item_id, row.product_name, '$' + row.price.toFixed(2)]))
        console.log(currItemTable.toString())

        // Prompt user to enter item number and quantity to purchase
        inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Input the ID of the item you would like to purchase: '
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Enter the quantity you would like to purchase: '
            }
        ]).then(answers => {
            var query2 = connection.query("SELECT item_id,price,stock_quantity,product_sales FROM products WHERE item_id=?", answers.id, (err, results, fields) => {
                if (err) throw err
                if (results.length === 0) {
                    console.log("Item not found.")
                } else {
                    // Make sure sufficient quantity is in stock -- if so, complete purchase and update database
                    if (results[0].stock_quantity >= parseInt(answers.quantity)) {
                        var updateSql = "UPDATE products SET stock_quantity=" + (results[0].stock_quantity-parseInt(answers.quantity)) +
                           ",product_sales=" + ((parseInt(answers.quantity) * results[0].price) + results[0].product_sales) + 
                           " WHERE item_id=" + answers.id
                        var query3 = connection.query(updateSql, err => { if (err) throw err })
                        console.log("Order successful. Your total is: $" + (answers.quantity * results[0].price).toFixed(2))
                    } else {
                        console.log("Insufficient quantity in stock to fulfill order.")
                    }
                }
            })
        })
    })
})
