/************************************************************************* *
 * BTI325– Assignment 6 *
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this assignment has been copied manually or electronically from any other source. *  (including 3rd party web sites) or distributed to other students. *
 *  *  Name: yunseok Choi  Student ID:  148765175  Date:  Nov 27th
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
const { engine } = require('express-handlebars');
const auth = require('./data-service-auth');
const clientSessions = require('client-sessions');

server.use(
  clientSessions({
    cookieName: 'session',
    secret: 'fasfsdgjdfkl$$&#$*&@',
    duration: 2 * 60 * 1000,
    activeDuration: 3 * 60 * 1000,
  })
);

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

server.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// handle bar engine
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      navLink: function (url, options) {
        return (
          '<li' +
          (url == app.locals.activeRoute ? ' class="active" ' : '') +
          '><a href=" ' +
          url +
          ' ">' +
          options.fn(this) +
          '</a></li>'
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error('Handlebars Helper equal needs 2 parameters');
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set('view engine', '.hbs');

const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(express.static('./public/'));
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == '/' ? '/' : route.replace(/\/$/, '');
  next();
});

app.get('/', (req, res) => {
  res.render('home', { layout: 'main' });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'main' });
});

/********************** . Employees ************************** */
app.get('/employees/add', (req, res) => {
  data
    .getDepartments()
    .then(function (data) {
      res.render('addEmployee', { departments: data });
    })
    .catch(() => res.render('addEmployee', { departments: [] }));
});

app.get('/employees', (req, res) => {
  if (req.query.status) {
    data
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render('employees', { employee: data });
      })
      .catch((err) => {
        res.render({ message: 'no results' });
      });
  }

  if (req.query.department) {
    data
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.render('employees', { employee: data });
      })
      .catch((err) => {
        res.render({ message: 'no results' });
      });
  }

  if (req.query.manager) {
    data
      .getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.render('employees', { employee: data });
      })
      .catch((err) => {
        res.render({ message: 'no results' });
      });
  } else {
    data
      .getAllEmployees()
      .then((data) => {
        res.render('employees', { employee: data, layout: 'main' });
      })
      .catch((err) => {
        res.render({ message: 'no results' });
      });
  }
});
app.get('/employee/:empNum', (req, res) => {
  let viewData = {};
  data
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data;
      } else {
        viewData.employee = null;
      }
    })
    .catch(() => {
      viewData.employee = null;
    })
    .then(data.getDepartments)
    .then((data) => {
      viewData.departments = data;
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee.department) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = [];
    })
    .then(() => {
      if (viewData.employee == null) {
        res.status(404).send('Employee Not Found');
      } else {
        res.render('employee', { viewData: viewData });
      }
    });
});
app.get('/employees/delete/:empNum', (req, res) => {
  data
    .deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch(() =>
      res.status(500).send('Unable to Remove Employee / Employee not found')
    );
});
/*************************** Department ************************ */
app.get('/departments', (req, res) => {
  data
    .getDepartments()
    .then((data) => {
      res.render('departments', {
        departments: data,
      });
    })
    .catch((err) => {
      res.render({ message: 'no results' });
    });
});

app.get('/departments/add', (req, res) => {
  res.render('addDepartment');
});

app.get('/department/:departmentId', (req, res) => {
  data
    .getDepartmentById(req.params.departmentId)
    .then((data) => {
      if (data.length > 0) res.render('department', { department: data });
      else {
        res.status(404).send('Department Not Found');
      }
    })
    .catch(() => {
      res.status(404).send('Department Not Found');
    });
});
/******************************* . Image  *************************** */
app.get('/images/add', (req, res) => {
  res.render('addImage');
});

app.get('/images', (req, res) => {
  fs.readdir('./public/images/uploaded', (err, items) => {
    res.render('image', { data: items });
  });
});

/************************** app post *****************************  */
app.post('/images/add', upload.single('imageFile'), (req, res) => {
  res.render('addImage', { layout: 'main' });
});

app.post('/employees/add', (req, res) => {
  data
    .addEmployee(req.body)
    .then(() => res.redirect('/employees'))
    .catch((err) => res.json({ message: err }));
});

app.post('/employee/update', (req, res) => {
  data.updateEmployee(req.body).then((data) => {
    res.redirect('/employees/');
  });
});

app.post('/departments/add', (req, res) => {
  data
    .addDepartment(req.body)
    .then(() => res.redirect('/departments'))
    .catch((err) => res.json({ message: err }));
});

app.post('/departments/update', (req, res) => {
  data
    .updateDepartment(req.body)
    .then(res.redirect('/departments'))
    .catch((err) => res.json({ message: err }));
});

app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});

auth.initialize().then(() => {
  data
    .initialize()
    .then(() => {
      app.listen(HTTP_PORT, () =>
        console.log(`Express http server listening on ${HTTP_PORT}`)
      );
    })
    .catch((e) => console.log(e));
});
