// Imports
import express from "express";
import logger from "./middleware/loggerMiddleware.js";
import morgan from "morgan";
import mongoose from "mongoose";
import colors from "colors";

const port = process.env.PORT;
const app = express();
const mongoUri = process.env.MONGO_URI;

app.use(express.json());

// app.use(logger);
// Morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Route Files
import demoRouter from "./routes/demoRoutes.js";
import bootcampRouter from "./routes/bootcampRoutes.js";

// Mount Routers
app.use("/api/demos", demoRouter);
app.use("/api/v1/bootcamps", bootcampRouter);

mongoose
  .connect(mongoUri)
  .then(() => {
    const host = mongoose.connection.host;
    const name = mongoose.connection.name;

    app.listen(port, () => {
      console.log(
        `Server running for ${process.env.NODE_ENV} environment on port : ${port}. Database connected successfully with ${host} and ${name}`
          .green.underline.bold
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
