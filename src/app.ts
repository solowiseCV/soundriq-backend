import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import status from "./routes/status";
import authRouter from "./routes/authRoutes";
import artistRouter from "./routes/artistRoutes";
import errorHandler from "./middlewares/errorHandler";
import setupSwagger from "./swagger/swagger";

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Middleware to parse URL-encoded data 
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/auth", authRouter);
app.use("/artist", artistRouter);
app.use("/", status);

setupSwagger(app);

app.use(errorHandler);

export default app;
