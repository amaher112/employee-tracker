const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

// Middleware
const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_tracker database.`)
  );

inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
    ],
    name: "initial_prompt",
  },
])
.then((data) => {

});

// If you select add a department, it takes you to a new prompt query asking the name of the dept
// Then it console logs "added X to the database"

// If you select add a role, it asks what is the name of the role? What is the salary, and which dept does it belong to (gives you a list of all depts)
// Console logs "X added to the database"

// If you select add an employee, it asks for first name, last name, role, manager
// Consoles "added X, X to the database"

// If you select update employee, it asks which employee you want to update, then 'which role do you want to assign the selected employee?
// Console logs "updated employees role"

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});