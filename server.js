const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

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

const queryDB = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        console.table(results);
        resolve(results);
      }
    });
  });
};

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
        const departmentSql = `SELECT * FROM department`;
        await queryDB(departmentSql);
        break;
      case "View all roles":
        const rolesSql = `SELECT roles.id, roles.title, department.name AS department, roles.salary
        FROM roles
        JOIN department ON roles.department_id = department.id`;
        await queryDB(rolesSql);
        break;
      case "View all employees":
        const employeeSql = `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, roles.salary, employee.manager_id AS manager
        FROM employee
        JOIN roles ON employee.roles_id = roles.id
        JOIN department ON roles.department_id = department.id`;
        await queryDB(employeeSql);
        break;

      // If you select add a department, it takes you to a new prompt query asking the name of the dept
      // Then it console logs "added X to the database"
      case "Add a department":
        const addDeptSql = `INSERT INTO department (name) VALUES (?)`;
        const departmentData = await inquirer.prompt([
          {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
          },
        ]);
        const deptParams = [departmentData.departmentName];
        await queryDB(addDeptSql, deptParams);
        console.log(`Added ${departmentData.departmentName} to the database.`);
        break;

      // If you select add a role, it asks what is the name of the role? What is the salary, and which dept does it belong to (gives you a list of all depts)
      // Console logs "X added to the database"
      case "Add a role":
        const departmentChoices = await queryDB(
          "SELECT id, name FROM department"
        );
        const addRolesSql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
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
            choices: departmentChoices.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ]);

        await queryDB(addRolesSql, [
          roleData.roleTitle,
          roleData.roleSalary,
          roleData.roleDepartment,
        ]);
        console.log(`Added ${roleData.roleTitle} to the database.`);
        break;

      // If you select add an employee, it asks for first name, last name, role, manager
      // Consoles "added X, X to the database"
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
        break;

      // If you select update employee, it asks which employee you want to update, then 'which role do you want to assign the selected employee?
      // Console logs "updated employees role"
      case "Update an employee role":
        const updatedEmployee = await inquirer.prompt([
          {
            type: "list",
            name: "",
          },
        ]);
    }
  }
}

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
  startApp();
});
