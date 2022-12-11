const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let User = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    let database = mongoose.createConnection(
      `mongodb+srv://andy:LKPc2TPaTvtgzLeD@senecaweb.zqaos2u.mongodb.net/web325_A6`
    );
    database.once('open', () => {
      User = database.model('users', User);
      resolve();
    });
    database.on('error', (err) => {
      console.log('error');
      reject(err);
    });
  });
};

module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password.length === 0 || userData.password2.length === 0) {
      reject('Error: user name cannot be empty or only white spaces!');
    } else if (userData.password !== userData.password2) {
      reject('Error: Passwords do not match');
    } else {
      let newUser = new User(userData);
      bcrypt
        .hash(newUser.password, 10)
        .then((hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              if (err.code == 1100) {
                reject('User Name already taken');
              } else {
                reject('There was an error creating the user: ' + err);
              }
            });
        })
        .catch((err) => {
          reject('There was an error encrypting the password');
        });
    }
  });
};

module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    User.findOne({ userName: userData.userName })
      .exec()
      .then((res) => {
        if (res) {
          bcrypt.compare(userData.password, res.password).then((check) => {
            if (check) {
              res.loginHistory.push({
                dateTime: new Date().toString(),
                userAgent: userData.userAgent,
              });
            } else {
              reject('Incorrect password for user: ' + userData.userName);

              User.updateOne(
                { userName: res.userName },
                { $set: { loginHistory: res.loginHistory } }
              )
                .exec()
                .then((updated) => {
                  if (updated) {
                    resolve(res);
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            }
          });
        } else {
          reject('Unable to find user: ' + userData.userName);
        }
      });
  });
};
