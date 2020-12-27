require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.json());

// a test route to make sure we can reach the backend
//this would normally go in a routes file
app.get("/test", (req, res) => {
  res.send("Backend says hey!");
});

const usersRouter = require('./routes/user');
app.use('/user', usersRouter);

//Set the port that you want the server to run on
const port = process.env.PORT || 8080;

app.listen(port, () => console.log("App is listening on port " + port));
