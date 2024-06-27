import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import status from "./routes/status";
import userRouter from "./routes/userRoutes";
import fileRouter from "./routes/fileRoutes";
import artistRouter from "./routes/artistRoutes";
import errorHandler from "./middlewares/errorHandler";
import setupSwagger from "./swagger/swagger";

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Middleware to parse URL-encoded data 
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/artist", artistRouter);
app.use("/", status);
app.use("/files", fileRouter);

setupSwagger(app);

app.use(errorHandler);

export default app;
