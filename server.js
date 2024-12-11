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
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT;
const app = express();
const mongoUri = process.env.MONGO_URI;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// to limit the number of requests coming to the server in a specific time interval
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// to allow cross origin resource sharing
app.use(cors());

// to prevent http param pollute
app.use(hpp());

// to prevent cross site scripting
app.use(xss());

// to add necessary security headers to the API
app.use(helmet());

// to prevent SQL Injection attacks
app.use(mongoSanitize());

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
import reviewRouter from "./routes/reviewRoutes.js";

// Mount Routers
app.use("/api/demos", demoRouter);
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

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
