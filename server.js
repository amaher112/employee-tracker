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
    name: "?",
  },
]);
