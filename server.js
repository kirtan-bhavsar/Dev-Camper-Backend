import express from "express";
const port = process.env.PORT;
const app = express();

app.listen(port, () => {
  console.log(
    `Server running for ${process.env.NODE_ENV} environment on port : ${port}`
  );
});
