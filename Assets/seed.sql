INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Legal");
INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 120000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jerry", "Carmona", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Thomas", "Smart", 2, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leslie", "Wright", 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kanye", "west", 4, 2);