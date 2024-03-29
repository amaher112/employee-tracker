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

// Create function to call queries
const queryDB = (sql, params = [], showResults) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        if (showResults) {
          console.table(results);
        }
        resolve(results);
      }
    });
  });
};

async function startApp() {
  while (true) {
    // Initial prompt
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
      // Swith case to View All Departments
      case "View all departments":
        const departmentSql = `SELECT * FROM department`;
        await queryDB(departmentSql, "", true);
        break;

      // Switch case to View All Roles
      case "View all roles":
        
        const rolesSql = `SELECT roles.id, roles.title AS job_title, department.name AS department, roles.salary
        FROM roles
        JOIN department ON roles.department_id = department.id`;
        await queryDB(rolesSql, "", true);
        break;

      // Switch case to View All Employees
      case "View all employees":
        const employeeSql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN roles ON employee.roles_id = roles.id
        LEFT JOIN department ON roles.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id`;
        await queryDB(employeeSql, "", true);
        break;

      // Switch case to Add a Department
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
        await queryDB(addDeptSql, deptParams, false);
        console.log(`Added ${departmentData.departmentName} to the database.`);
        break;

      // Switch case to Add a Role
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

        await queryDB(
          addRolesSql,
          [roleData.roleTitle, roleData.roleSalary, roleData.roleDepartment],
          false
        );
        console.log(`Added ${roleData.roleTitle} to the database.`);
        break;

      // Switch case to Add An Employee
      case "Add an employee":
        const roleChoices = await queryDB("SELECT id, title FROM roles");
        const managerChoices = await queryDB(
          "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee"
        );
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
            name: "employeeManagerId",
            message: "Please choose the employee's manager:",
            choices: managerChoices.map((manager) => ({
              name: manager.name,
              value: manager.id,
            })),
          },
        ]);
        const addEmployeeSql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)`;
        const employeeParams = [
          employeeData.employeeFirstName,
          employeeData.employeeLastName,
          employeeData.employeeRole,
          employeeData.employeeManagerId,
        ];
        await queryDB(addEmployeeSql, employeeParams, false);
        console.log(
          `Added ${employeeData.employeeFirstName} ${employeeData.employeeLastName} to the database.`
        );
        break;

      // Switch case to Update An Employee Role
      case "Update an employee role":
        const updateRoleChoices = await queryDB("SELECT id, title FROM roles");
        const employeeChoices = await queryDB(
          "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee"
        );

        const updatedEmployee = await inquirer.prompt([
          {
            type: "list",
            name: "employeeToUpdate",
            message: "Which employee would you like to update?",
            choices: employeeChoices.map((employee) => ({
              name: employee.name,
              value: employee.id,
            })),
          },
          {
            type: "list",
            name: "newRole",
            message:
              "Which role do you want to assign to the selected employee?",
            choices: updateRoleChoices.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ]);

        const updateSql = "UPDATE employee SET roles_id = ? WHERE id = ?";
        const updateParams = [
          updatedEmployee.newRole,
          updatedEmployee.employeeToUpdate,
        ];

        await queryDB(updateSql, updateParams, false);
        console.log("Employee role updated successfully!");
        break;
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
