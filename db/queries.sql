-- -- -- Query to view all deparments
SELECT * FROM department;


-- -- -- Query to view all roles (id , title, department and salary)
SELECT roles.id, roles.title, department.name AS department, roles.salary
FROM roles
JOIN department ON roles.department_id = department.id;

-- Query to view all employees (id, first and last name, dept, salary, manager)
SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, roles.salary, employee.manager_id AS manager
FROM employee
JOIN roles ON employee.roles_id = roles.department_id
JOIN department ON roles.department_id = department.id
