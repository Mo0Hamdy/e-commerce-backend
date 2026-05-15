const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

mongoose
  .connect(URL)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log("failed to connect ", error);
  });

const app = express();
app.use(cors());
app.use(express.json());
const User = require("./models/User");

app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log("i'm listening on port " + PORT);
});
