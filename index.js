// not used in this workshop, but we initialize it for the express portion
require("dotenv").config();
const { PORT = 3000 } = process.env
const express = require("express");
const server = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const { client } = require("./db");
client.connect();

server.use(express.json());

server.use(morgan("dev"));

server.use("/api", apiRouter);

server.listen(PORT, () => {
    console.log(`The server is up on port ${PORT}`)
})