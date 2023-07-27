const express = require('express');
const app = express();
const PORT = 5000;
//connection to mongodb
const mongoose = require('mongoose');
const mongoUrl = require('./keys');
const cors = require("cors");
app.use(cors());
require("./models/model");
app.use(express.json());
app.use(require('./routes/auth')); //importing thr router using app.use


mongoose.connect(mongoUrl);
//checking for the connection
mongoose.connection.on("connected", () => {
    console.log("Connected successfully");
})
mongoose.connection.on("error", () => {
    console.log("Eroor occured ");
})

app.listen(PORT, () => {
    console.log("SERVER IS RUNNING FINE " + PORT);
})