const express = require("express");
const tools = require("../tools.js");
const body_parser = require("body-parser");
const user = express();

module.exports = user;

user.use(body_parser.json());

user.get("/allRestaurants", (req, res) => {
  const data = tools.readFrom("../data.json");
  const restaurants = data.restaurants;
  console.log({
    message: "data fetched",
    data: data,
  });

  res.send({
    message: "get successfull",
    error: "none",
    data: restaurants,
  });
});

user.post("/createRestaurant", (req, res) => {
  const data = tools.readFrom("../data.json");
  const restaurants = data.restaurants;
  let exists = false;

  const name = req.body.name;
  const info = req.body.info;
  const menu = req.body.menu;

  for (let rest of restaurants) {
    if (rest.name == name) {
      exists = true;
      break;
    }
  }

  console.log(req.body);

  if (!exists) {
    const newRest = {
      name: name,
      info: info,
      menu: menu,
      link: "/information",
    };
    data.restaurants.push(newRest);
    tools.writeTo("data.json", data);
    res.send({
      message: "Restaurant Created",
      error: "none",
    });
  } else {
    res.send({
      message: "Creation fail",
      error: "rest exists",
    });
  }
});
