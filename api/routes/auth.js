const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

//user: id, username, email, password
let usernameRegExp = /^[a-zA-Z ,.'-]{3,20}$/;
let emailRegExp =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
let passRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//check if a string matches a regEx
function checkRegExp(regExp, myStr) {
  return regExp.test(myStr);
}

function validateUser(user) {
  let errArray = [];

  if (checkRegExp(usernameRegExp, user.username) === false) {
    errArray.push(
      "Username should have between 3 and 20 characters. It cannot contain numbers"
    );
  }
  if (!user.email) {
    errArray.push("Email is required!");
  }
  if (checkRegExp(emailRegExp, user.email) === false) {
    errArray.push("Invalid! Email should contain '@' and a domain!");
  }
  if (checkRegExp(passRegExp, user.password) === false) {
    errArray.push(
      "Invalid! Password must be 8 characters long and must contain at least: one uppercase, one lowercase, a number and a special character!"
    );
  }
  if (user.password !== user.repassword) {
    errArray.push("Password do not match!");
  }
  return errArray;
}

// return the data from a json file
function readFromFile(relPath) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, relPath));
  let data = JSON.parse(rawdata);
  return data;
}

// write data to a json file
function writeToFile(res, content, relPath) {
  fs.writeFile(
    path.resolve(__dirname, relPath),
    JSON.stringify(content, null, 2),
    function (err) {
      if (err) {
        return err;
      } else {
        res.status(200);
        res.json("Succesfully registered");
      }
    }
  );
}
// Get method for login
router.get("/login", function (req, res) {
  let users = readFromFile("../db/users.json");
  res.json(users);
});

// Post method for login
router.post("/login", function (req, res) {
  let usersList = readFromFile("../db/users.json");
  let user = usersList.users.find(
    (i) => i.email == req.body.email && i.password == req.body.password
  );
  if (!user) {
    res.status(404).send({ message: "Invalid username or password." });
  } else {
    res.status(200).send(user);
  }
});

// POST NEW REGISTERED USER
router.post("/register", function (req, res) {
  let usersList = readFromFile("../db/users.json");
  let searchEmail = usersList.users.find((i) => i.email == req.body.email);
  let searchUsername = usersList.users.find(
    (i) => i.username == req.body.username
  );

  if (searchUsername != undefined) {
    res.status(409);
    res.send({
      message: "This username already exists. Try another one.",
      existing: "username",
    });
    return;
  }
  if (searchEmail != undefined) {
    res.status(409);
    res.send({
      message: "This email is already registered!",
      existing: "email",
    });
    return;
  }

  let user = {
    id: usersList.users.length + 1,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    repassword: req.body.repassword,
  };

  let errors = validateUser(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }
  delete user.repassword;
  usersList.users.push(user);
  writeToFile(res, usersList, "../db/users.json");
});

module.exports = router;
