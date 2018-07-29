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
    displayMainMenu()
})

// Show supervisor menu
function displayMainMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: 'mainMenu',
            message: 'Please choose one of the following: ',
            choices: [
                {
                    name: 'View Product Sales by Department',
                    value: 0
                },
                {
                    name: 'Create New Department',
                    value: 1
                }
            ]
        }
    ]).then ( answers => {
        switch (answers.mainMenu) {
            case 0:
            viewDeptSales()
            break
            case 1:
            createDept()
            break
        }
    })
}

function viewDeptSales() {
    let query2 = "SELECT departments.department_id,departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS total_dept_sales FROM departments " + 
    "INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id,departments.department_name, departments.over_head_costs"
    connection.query(query2, (err, result, fields) => {
        if (err) { throw err }
        const deptTable = new Table({
            head: ['ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
            colWidths: [5, 35, 20, 15, 15]
        })
        result.forEach( row => deptTable.push([row.department_id, row.department_name, row.over_head_costs, row.total_dept_sales.toFixed(2), (row.total_dept_sales - row.over_head_costs).toFixed(2)]))
        console.log(deptTable.toString())
        displayMainMenu()
    })
}

function createDept() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'Enter department name: '
        },
        {
            type: 'input',
            name: 'deptOverhead',
            message: 'Enter department overhead: '
        }
    ]).then( answer => {
        let query1 = "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + 
        answer.deptName + "' ,'" + 
        parseInt(answer.deptOverhead) + "')"
        connection.query(query1, (err, result) => {
                if (err) { throw err }
                console.log("Department addition successful")
                displayMainMenu()
            })
    })
    
}