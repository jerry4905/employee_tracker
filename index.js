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