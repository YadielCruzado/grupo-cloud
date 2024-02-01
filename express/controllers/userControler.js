const express = require("express");
const tools = require("../tools.js");
const user = express();

module.exports = user;

user.use(express.json());

user.post("/login", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const data = tools.readFrom("users.json");
  const users = data.users;
  let exists = true;
  let error = "";

  for (let i in users) {
    if (users[`${i}`].username == username) {
      exists = true;

      if (users[`${i}`].password != password) {
        error = "pass err";
      }

      break;
    }
  }

  if (exists) {
    if (error == "") {
      res.send({
        message: "success",
        error: "none",
      });
    } else {
      res.send({
        message: "fail",
        error: error,
      });
    }
  } else {
    res.send({
      message: "fail",
      error: "user err",
    });
  }
});

user.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const data = tools.readFrom("users.json");
  const users = data.users;
  let lastIndex = 0;
  let exists = false;
  let error = "";

  for (let i in users) {
    lastIndex = i;
    if (users[`${i}`].username == username) {
      exists = true;
      error = "user exists";
      break;
    }
  }

  if (!exists) {
    let user = {
      username: username,
      password: password,
    };
    data.users[`${lastIndex}`] = user;

    tools.writeTo("users.json", data);

    res.send({
      message: "success",
      error: "none",
    });
  } else {
    res.send({
      message: "fail",
      error: error,
    });
  }
});
