-- Query to view all deparments
SELECT * FROM department

-- Query to view all roles (id , title, department and salary)
SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary
FROM role
JOIN department ON role.department_id = department.id;

-- Query to view all employees (id, first and last name, dept, salary, manager)
SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, role.salary AS salary, employee.manager_id AS manager
FROM employee
JOIN role ON employee.role_id = role.department_id; 





