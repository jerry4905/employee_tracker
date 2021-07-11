//const mysql = require("mysql");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Monkey369*",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) {
        throw err
    };
    init();
});

function init() {
    inquirer.prompt(
        [
            {
                type: "rawlist",
                name: "artist",
                message: "What would you like to do?",
                choices: [
                    "View All Employees",
                    "View All Roles",
                    "View All Departments",
                    "Add Employee",
                    "Remove Employee",
                    "Add Role",
                    "Remove Role",
                    "Add Department",
                    "Remove Department",
                    "Update Employee Role",
                    "Exit"
                ]
            }
        ]).then(function (res) {
            if (res.artist === "View All Employees") {
                viewAllEmployees();
            } else if (res.artist === "View All Roles") {
                viewAllRoles();
            } else if (res.artist === "View All Departments") {
                viewAllDepartments();
            } else if (res.artist === "Add Employee") {
                addEmployee();
            } else if (res.artist === "Remove Employee") {
                removeEmployee();
            } else if (res.artist === "Add Role") {
                addRole();
            } else if (res.artist === "Remove Role") {
                removeRole()
            } else if (res.artist === "Add Department") {
                addDepartment();
            } else if (res.artist === "Remove Department") {
                removeDepartment();
            } else if (res.artist === "Update Employee Role") {
                updateEmployeeRole();
            } else if (res.artist === "View All Employees By Department") {
            } else if (res.artist === "Exit") {
                connection.end();
            }
        });
}
function viewAllEmployees() {
    const query1 = connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS 'department', role.salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id
    `,
        function (err, res) {
            if (err) {
                throw err;
            }
            let allEmployeesArray = res;

            const query2 = connection.query(`
        SELECT mgr.first_name, mgr.last_name
        FROM employee
        LEFT JOIN employee mgr ON employee.manager_id = mgr.id
        ORDER BY employee.id ASC;`,
                function (err, res) {
                    if (err) {
                        throw err;
                    }

                    for (i = 0; i < allEmployeesArray.length; i++) {
                        allEmployeesArray[i].manager = `${res[i].first_name} ${res[i].last_name}`
                    }

                    console.table(allEmployeesArray);

                    init();
                }
            )
        }
    );
}

function addEmployee() {
    const query = connection.query("SELECT employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id=role.id;",
        function (err, res) {
            if (err) {
                throw err;
            }

            let roleArray = [];
            let employeeArray = [];
            employeeArray = ["NONE"];
            let employeeIDs = [];

            const query1 = connection.query("SELECT * FROM role",
                function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.forEach(role => roleArray.push(role.title));
                });

            const query2 = connection.query("SELECT * FROM employee",
                function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.forEach(employeeId => employeeIDs.push(employeeId.id));
                    res.forEach(employee => employeeArray.push(`${employee.first_name} ${employee.last_name}`));
                });

            inquirer.prompt(
                [
                    {
                        type: "input",
                        name: "firstName",
                        message: "What is the employee's first name?"
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "What is the employee's last name?"
                    },
                    {
                        type: "rawlist",
                        name: "role",
                        message: "What is the employee's role?",
                        choices: roleArray
                    },
                    {
                        type: "rawlist",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: employeeArray
                    }
                ]
            ).then(function (answers) {
                let employeeIDIndex = employeeArray.indexOf(answers.manager) - 1;
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: roleArray.indexOf(answers.role) + 1,
                        manager_id: employeeIDs[employeeIDIndex]
                    },
                    function (err, res) {
                        if (err) {
                            throw err;
                        }
                        init();
                    }
                );
            });
        });
}

function removeEmployee() {
    const query = connection.query("SELECT * FROM employee",
        function (err, res) {
            const allEmployees = res;
            let allEmployeeNames = [];
            let employeeIds = [];
            allEmployees.forEach(employeeData => {
                allEmployeeNames.push(`${employeeData.first_name} ${employeeData.last_name}`);
                employeeIds.push(employeeData.id);
            });
            if (allEmployees.length > 0) {
                inquirer.prompt(
                    {
                        type: "rawlist",
                        name: "employee",
                        message: "Which employee would you like to remove?",
                        choices: allEmployeeNames
                    }
                ).then(function (answers) {

                    const query = connection.query("DELETE FROM employee WHERE ?",
                        {
                            id: employeeIds[allEmployeeNames.indexOf(answers.employee)]
                        },
                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            init();
                        });
                });
            } else {
                init();
            }
        });
}

function updateEmployeeRole() {
    const query = connection.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.role_id
      FROM employee
      INNER JOIN role ON employee.role_id=role.id;`,
        function (err, res) {
            if (err) {
                throw err;
            }
            let allEmployees = res;
            let allEmployeeNames = [];
            let allRoleTitles = [];
            let employeeIds = [];
            let roleIds = [];

            const query2 = connection.query("SELECT * FROM role",
                function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.forEach(role => {
                        roleIds.push(role.id);
                        allRoleTitles.push(role.title)
                    });
                });

            allEmployees.forEach(employeeData => {
                allEmployeeNames.push(`${employeeData.first_name} ${employeeData.last_name}`);
                employeeIds.push(employeeData.id);
            });

            if (allEmployees.length > 0) {
                inquirer.prompt(
                    [
                        {
                            type: "rawlist",
                            name: "employee",
                            message: "Which employee would you like to change the role of?",
                            choices: allEmployeeNames
                        },
                        {
                            type: "rawlist",
                            name: "newRole",
                            message: "Which role would you like to assign to this employee?",
                            choices: allRoleTitles
                        }
                    ]
                ).then(function (answers) {
                    const query = connection.query(`UPDATE employee SET ? WHERE ?`,
                        [
                            {
                                role_id: roleIds[allRoleTitles.indexOf(answers.newRole)]
                            },
                            {
                                id: employeeIds[allEmployeeNames.indexOf(answers.employee)]
                            }
                        ],
                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            init();
                        });
                });
            } else {
                init();
            }
        });
}

function viewAllRoles() {
    const query = connection.query(`SELECT role.id, role.title, role.salary FROM role`,
        function (err, res) {
            if (err) {
                throw err;
            }
            console.table(res);
            init();
        });
}

function viewAllDepartments() {
    const query = connection.query(`SELECT department.id, department.name FROM department`,
        function (err, res) {
            if (err) {
                throw err;
            }
            console.table(res);
            init();
        });
}

function addRole() {
    departmentArray = [];
    const query = connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) {
                throw err;
            }
            res.forEach(department => departmentArray.push(department.name));
        });

    inquirer.prompt(
        [
            {
                type: "input",
                name: "title",
                message: "What is the role that you would like to add?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "rawlist",
                name: "department",
                message: "Which department does this role belong to?",
                choices: departmentArray
            }
        ]
    ).then(function (answers) {
        const query = connection.query(`INSERT INTO role SET ?`,
            {
                title: answers.title,
                salary: answers.salary,
                department_id: departmentArray.indexOf(answers.department) + 1
            },
            function (err, res) {
                if (err) {
                    throw err;
                }
                init();
            });
    });
}

function removeRole() {
    const query = connection.query("SELECT * FROM role",
        function (err, res) {
            const allRoles = res;
            let allRoleTitles = [];
            let roleIds = [];
            allRoles.forEach(roleData => {
                allRoleTitles.push(roleData.title);
                roleIds.push(roleData.id);
            });
            if (allRoles.length > 0) {
                inquirer.prompt(
                    {
                        type: "rawlist",
                        name: "role",
                        message: "Which role would you like to remove?",
                        choices: allRoleTitles
                    }
                ).then(function (answers) {
                    const query = connection.query("DELETE FROM role WHERE ?",
                        {
                            id: roleIds[allRoleTitles.indexOf(answers.role)]
                        },
                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            init();
                        });
                });
            } else {
                init();
            }
        })
}

function addDepartment() {
    inquirer.prompt(
        [
            {
                type: "input",
                name: "name",
                message: "What is the department that you would like to add?"
            }
        ]
    ).then(function (answers) {
        const query = connection.query(`INSERT INTO department SET ?`,
            {
                name: answers.name,
            },
            function (err, res) {
                if (err) {
                    throw err;
                }
                init();
            });
    });
}

function removeDepartment() {
    const query = connection.query("SELECT * FROM department",
        function (err, res) {
            const allDepartments = res;
            let allDepartmentNames = [];
            let departmentIds = [];
            allDepartments.forEach(departmentData => {
                allDepartmentNames.push(departmentData.name);
                departmentIds.push(departmentData.id);
            });
            if (allDepartments.length > 0) {
                inquirer.prompt(
                    {
                        type: "rawlist",
                        name: "department",
                        message: "Which department would you like to remove?",
                        choices: allDepartmentNames
                    }
                ).then(function (answers) {
                    const query = connection.query("DELETE FROM department WHERE ?",
                        {
                            id: departmentIds[allDepartmentNames.indexOf(answers.department)]
                        },
                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            init();
                        });
                });
            } else {
                init();
            }
        });
}
