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
    if (err) throw err
    displayMainMenu()
})

// Prompt user for task
function displayMainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'Choose an option: ',
            choices: [
                {
                    name: 'View Products for Sale',
                    value: 0
                },
                {
                    name: 'View Low Inventory',
                    value: 1
                },
                {
                    name: 'Add to Inventory',
                    value: 2
                },
                {
                    name: 'Add New Product',
                    value: 3
                }
            ]
        }
    ]).then(answer => {
        switch (answer.mainMenu) {
            case 0:
                displayAllItems()
                break
            case 1:
                displayLowInventory()
                break
            case 2:
                addToInventory()
                break
            case 3:
                addNewProduct()
                break
        }

    })
}

// List a catalog of all products
function displayAllItems() {
    var query1 = connection.query("SELECT item_id,product_name,price,stock_quantity FROM products", (err, result, fields) => {
        if (err) { throw err }

        // Use cli-table package to create a pretty table
        const currItemTable = new Table({
            head: ['ID', 'Item Name', 'Price', 'Quantity'],
            colWidths: [5, 35, 10, 10]
        });
        console.log("Available Products:")
        result.forEach(row => currItemTable.push([row.item_id, row.product_name, '$' + row.price.toFixed(2), row.stock_quantity]))
        console.log(currItemTable.toString())
        displayMainMenu()
    })
}

// Display items whose inventory has fallen below 5
function displayLowInventory() {
    var query2 = connection.query("SELECT item_id,product_name,stock_quantity FROM products WHERE stock_quantity<5", (err, result, fields) => {
        if (err) { throw err }

        const lowInventoryTable = new Table({
            head: ['ID', 'Item Name', 'Quantity'],
            colWidths: [5, 35, 10]
        })
        console.log("Low Inventory Items:")
        result.forEach(row => lowInventoryTable.push([row.item_id, row.product_name, row.stock_quantity]))
        console.log(lowInventoryTable.toString())
        displayMainMenu()
    })
}

// Add inventory to existing items
function addToInventory() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addItemId',
            message: 'Choose an item to increase inventory: '
        },
        {
            type: 'input',
            name: 'addItemAmount',
            message: 'Quantity to add: '
        }
    ]).then( answers => {
        let query3str = "SELECT stock_quantity FROM products WHERE item_id=" + answers.addItemId
        var query3 = connection.query(query3str, (err, result, fields) => {
            if (err) {
                console.log(err)
                console.log("Make sure you selected a valid item!!")
                displayMainMenu()
            }
            let newQuantity = parseInt(answers.addItemAmount) + result[0].stock_quantity
            var query4 = connection.query("UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_id =" + answers.addItemId, err => {
                if (err) { throw err }
                displayMainMenu()
            })
        })
        
    })
}

// Add a new product to the inventory
function addNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newItemName',
            message: 'Enter Item Name: '
        },
        {
            type: 'input',
            name: 'newItemDept',
            message: 'Enter New Item Department: '
        },
        {
            type: 'input',
            name: 'newItemPrice',
            message: 'Enter Price of New Item: '
        },
        {
            type: 'input',
            name: 'newItemQuantity',
            message: 'Enter Initial Quantity of the New Item: '
        }
    ]).then(answers => {
        let query5str = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + 
        answers.newItemName + "' , '" +
        answers.newItemDept + "', '" + 
        answers.newItemPrice + "' , '" +
        answers.newItemQuantity + "')"
        var query5 = connection.query(query5str, (err, result) => {
                if (err) { throw err }
                displayMainMenu()
            })
        
    })
}

