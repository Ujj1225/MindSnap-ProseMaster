const express = require("express");
const app = express();
app.use(express.json());
const query = require("./routes/query");

require("dotenv").config();
  
const port = process.env.PORT || 3000;

app.use("/api/v1", query);

const start = () => {
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
};

start();
