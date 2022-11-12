const fs = require('fs');

let employees = [];
let departments = [];

exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile('./data/employees.json', (err, data) => {
      if (err) {
        reject('Failure to read file employees.json!');
      } else {
        employees = JSON.parse(data);
        resolve(employees);
      }
    });

    fs.readFile('./data/departments.json', (err, data) => {
      if (err) {
        reject('Failure to read file departments.json!');
      } else {
        departments = JSON.parse(data);
        resolve(departments);
      }
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (employees.length === 0) reject('no results returned');
    else resolve(employees);
  });
};

module.exports.getManagers = function () {
  return new Promise((resolve, reject) => {
    if (employees.length === 0) reject('no results returned');
    else resolve(employees.filter((employee) => employee[0].isManager === true));
  });
};

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    if (departments.length === 0) reject('no results returned');
    else resolve(departments);
  });
};

module.exports.addEmployee = function (employeeData) {
  employeeData.isManager == null
    ? (employeeData.isManager = false)
    : (employeeData.isManager = true);
  employeeData.employeeNum = employees.length + 1;
  employees.push(employeeData);
  return new Promise(function (resolve, reject) {
    function addEmp() {
      console.log('Get New Employee');
    }
    resolve();
  });
};
module.exports.getEmployeesByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    function getEmpBystatu() {
      console.log('Get Employees By Status');
      const list = [];
      for (stat of employees) {
        if (stat.status == status) {
          list.push(stat);
        }
      }
      resolve(list);
    }
  });
};
module.exports.getEmployeesByDepartment = function (Department) {
  return new Promise(function (resolve, reject) {
    function getEmpByDepart() {
      console.log('Get Employees By Department');
      const list = [];
      for (Dept of employees) {
        if (Dept.department == Department) {
          list.push(Dept);
        }
      }
      resolve(list);
    }
  });
};
module.exports.getEmployeesByManager = function (manager) {
  return new Promise(function (resolve, reject) {
    function getEmpByManager() {
      console.log('Get Employees By Manager');
      const list = [];
      for (mng of employees) {
        if (mng.employeeManagerNum == manager) {
          list.push(mng);
        }
      }
      resolve(list);
    }
  });
};
exports.getEmployeeByNum = function (num) {
  return new Promise(function (resolve, reject) {
    if (employees.length > 0) {
      for (let i in employees) {
        if (employees[i].employeeNum == num) {
          resolve(employees[i]);
        }
      }
    } else {
      reject('no results returned');
    }
  });
};

exports.updateEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    return new Promise((resolve, reject) => {
      employees.forEach((employee) => {
        if (employee.employeeNum == employeeData.employeeNum) {
          employees.splice(employeeData.employeeNum - 1, 1, employeeData);
        }
      });
      resolve();
    });
  });
};
