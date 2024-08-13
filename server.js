const express = require("express");
//import database connection
const db = require("./config/connection");
//import routes
const routes = require("./routes");

//current working directory
const cwd = process.cwd();

//set up server
const PORT = 3001;
const app = express();

const activity = cwd.includes("01-Activities")
  ? cwd.split("01-Activities")[1]
  : cwd;

//MIDDLEWWARE
//sets up middleware to parse incoming request bodies with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
//middleware to parse incoming request bodies as JSON
app.use(express.json());
//uses the imported routes module to set up the application's routes
app.use(routes);

//turn on our API server
db.once("open", () => {
  //waits for db connection to be established before starting the server

  //starts express server on port 3001
  app.listen(PORT, () => {
    console.log(`API server for ${activity} running on port ${PORT}!`);
  });
});
