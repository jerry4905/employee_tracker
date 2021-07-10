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
      ]).then(function(res) {
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