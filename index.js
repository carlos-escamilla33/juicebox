// not used in this workshop, but we initialize it for the express portion
const PORT = 3000;
const express = require("express");
const server = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const {client} = require ("./db");

server.use(express.json());

server.use(morgan("dev"));

// server.use((req, res, next) => {
//     console.log("<____Body Logger START____>")
//     console.log(req.body);
//     console.log("<_____Body Logger END_____>");

//     next();
// })

server.use("/api", apiRouter);
client.connect();

server.listen(PORT, () => {
    console.log(`The server is up on port ${PORT}`)
})