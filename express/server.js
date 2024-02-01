const express = require("express");
const app = express();
const user = require("./controllers/userControler");
const restaurant = require("./controllers/restaurant.js");
const adminRest = require("./controllers/adminRest.js");
const port = 8080;

const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use("/user", user);
app.use("/restaurant", restaurant);
app.use("/adminrest", adminRest)

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`SERVER UP ON PORT ${port}!`));