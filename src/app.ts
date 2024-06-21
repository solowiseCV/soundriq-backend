import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import status from "./routes/status";
import userRouter from "./routes/userRoutes";
import errorHandler from "./middlewares/errorHandler";
import setupSwagger from "./swagger/swagger";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/", status);

setupSwagger(app);

app.use(errorHandler);

export default app;
