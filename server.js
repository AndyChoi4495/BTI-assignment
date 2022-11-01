/************************************************************************* *
 * BTI325– Assignment 3 *
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this assignment has been copied manually or electronically from any other source. *  (including 3rd party web sites) or distributed to other students. *
 *  *  Name: yunseok Choi  Student ID:  148765175  Date:  Oct 29th
 * Your app’s URL (from Cyclic Heroku)
 * that I can click to see your application:  *
 * https://obscure-temple-19450.herokuapp.com/
 *  * *************************************************************************/
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 5500;
const data = require('./data-service');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(express.static('./public/'));
app.use(express.static('./views/'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/images', function (req, res) {
  fs.readdir('./public/images/uploaded', (err, items) => {
    if (err) console.log(err);
    else {
      res.json({ images: items });
    }
  });
});
app.get('/employees/add', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
});

app.get('/managers', (req, res) => {
  data
    .getManagers()
    .then((managers) => res.json(managers))
    .catch((e) => console.error(e));
});

app.get('/employees', (req, res) => {
  data
    .getAllEmployees()
    .then((employees) => res.json(employees))
    .catch((e) => console.error(e));
});
app.get('/employee/value', function (req, res) {
  var val = req.params.value;
  data
    .getEmployeeByNum(val)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
app.get('/employees/add', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
});
app.get('/images/add', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addImage.html'));
});
app.get('/departments', (req, res) => {
  data
    .getDepartments()
    .then((departments) => res.json(departments))
    .catch((err) => console.error(err));
});

app.post('/images/add', upload.single('imageFile'), (req, res) => {
  res.send('/public/images');
});
//middleware
app.post('/employees/add', function (req, res) {
  data
    .addEmployee(req.body)
    .then(() => {
      res.redirect('/employees');
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});

data
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () =>
      console.log(`Express http server listening on ${HTTP_PORT}`)
    );
  })
  .catch((e) => console.log(e));
