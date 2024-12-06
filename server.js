// Imports
import express from "express";
import logger from "./middleware/loggerMiddleware.js";
import morgan from "morgan";
import mongoose from "mongoose";
import colors from "colors";
import errorHandler from "./middleware/errorHandler.js";
import file from "express-fileupload";
import fileupload from "express-fileupload";
import path from "path";
import url from "url";
import cookieParser from "cookie-parser";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT;
const app = express();
const mongoUri = process.env.MONGO_URI;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// app.use(logger);
// Morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileupload());
app.use(cookieParser());

// Route Files
import demoRouter from "./routes/demoRoutes.js";
import bootcampRouter from "./routes/bootcampRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRoutes.js";

// Mount Routers
app.use("/api/demos", demoRouter);
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

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
