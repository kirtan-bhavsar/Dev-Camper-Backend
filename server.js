import express from "express";
const port = process.env.PORT;
const app = express();

// Route Files
import demoRouter from "./routes/demoRoutes.js";
import bootcampRouter from "./routes/bootcampRoutes.js";

// Mount Routers
app.use("/api/demos", demoRouter);
app.use("/api/v1/bootcamps", bootcampRouter);

app.listen(port, () => {
  console.log(
    `Server running for ${process.env.NODE_ENV} environment on port : ${port}`
  );
});
