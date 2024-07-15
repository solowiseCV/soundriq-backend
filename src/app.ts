import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import status from "./routes/status";
import authRouter from "./routes/authRoutes";
import fileRouter from "./routes/fileRoutes";
import errorHandler from "./middlewares/errorHandler";
import setupSwagger from "./swagger/swagger";

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Middleware to parse URL-encoded data 
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/", status);
app.use("/files", fileRouter);

setupSwagger(app);

app.use(errorHandler);

export default app;
