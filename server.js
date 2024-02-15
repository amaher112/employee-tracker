const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();
const queries = require('./db/queries.sql');

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_tracker database.`)
);

async function startApp() {
  while (true) {
    const response = await inquirer.prompt([
      {
        type: "list",
        name: "initial_prompt",
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
      },
    ]);

    switch (response.initial_prompt) {
      case "View all departments":
        await queries.departmentQuery();
        break;
      case "View all roles":
        // await some type of function
        break;
      case "View all employees":
        // await some type of function
        break;
      case "Add a department":
        const departmentData = await inquirer.prompt([
          {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
          },
        ]);
      // await a function with departmentData.departmentName
      case "Add a role":
        const roleData = await inquirer.prompt([
          {
            type: "input",
            name: "roleTitle",
            message: "What is the title of the role?",
          },
          {
            type: "input",
            name: "roleSalary",
            message: "What is the salary for this role?",
          },
          {
            type: "list",
            name: "roleDepartment",
            message: "Which department does this role belong to?",
            choices: [
              // add departments
            ],
          },
        ]);
        // await function to insert role with roleData.roleTitle, etc
        break;
      case "Add an employee":
        const roleChoices = await queryDB("SELECT id, title FROM roles");
        const employeeData = await inquirer.prompt([
          {
            type: "input",
            name: "employeeFirstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "employeeLastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "employeeRole",
            message: "What is the employee's role?",
            choices: roleChoices.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            type: "list",
            name: "employeeManager",
            message: "Who is the employee's manager?",
            choices: [],
          },
        ]);
    }
  }
}

// If you select add a department, it takes you to a new prompt query asking the name of the dept
// Then it console logs "added X to the database"

// If you select add a role, it asks what is the name of the role? What is the salary, and which dept does it belong to (gives you a list of all depts)
// Console logs "X added to the database"

// If you select add an employee, it asks for first name, last name, role, manager
// Consoles "added X, X to the database"

// If you select update employee, it asks which employee you want to update, then 'which role do you want to assign the selected employee?
// Console logs "updated employees role"
