const fs = require('fs');

const employees = [];
const departments = [];

function read(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(`./data/${name}.json`, (error, data) => {
      if (error !== null) reject(`Failure to read file ${name}.json!`);
      else if (name === 'employees') resolve(employees.push(JSON.parse(data)));
      else if (name === 'departments') resolve(departments.push(JSON.parse(data)));
    });
  });
}

module.exports.initialize = function () {
  return read('employees').then(read('departments'));
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
    setTimeout(function () {
      console.log('Get New Employee');
    }, randomTime);
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
module.exports.getEmployeeByNum = function (num) {
  return new Promise(function (resolve, reject) {
    function getEmpByNum() {
      console.log('Get Employees By Num');
      for (nm of employees) {
        if (nm.employeeNum == num) {
          resolve(nm);
        }
      }
    }
  });
};
