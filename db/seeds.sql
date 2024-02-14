INSERT INTO department (name)
VALUES ('Marketing'),
        ('Legal'),
        ('Finance'),
        ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 120000, 3),
        ('Software Engineer', 130000, 4),
        ('Lawyer', 250000, 2),
        ('Salesperson', 90000, 1),
        ('Account Manager', 100000, 3),
        ('Legal Aide', 80000, 2),
        ('Lead Engineer', 150000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
        ('Mike', 'Chan', 2, NULL),
        ('Ashely', 'Rodriguez', 3, 2),
        ('Kevin', 'Tupik', 4, 1),
        ('Kunal', 'Singh', 5, NULL),
        ('Malia', 'Brown', 6, 3),
        ('Sarah', 'Lourd', 7, NULL),
        ('Tom', 'Allen', 4, 1);