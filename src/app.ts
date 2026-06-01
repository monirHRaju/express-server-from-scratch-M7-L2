import express, {
  response,
  type Application,
  type Request,
  type Response,
} from "express";
import { initDB, pool } from "./db";
import { userRouter } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from "fs";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const log = `\n Method->${req.method} , Time-> ${Date.now()}, URL-> ${req.url} \n`;
  fs.appendFile("./logger/logger.txt", log, (err) => {
    console.log(err);
  });

  next();
});

initDB();

app.get("/", (req: Request, res: Response) => {
  //   res.send('Express Server')
  res.status(200).json({
    message: "Server working",
  });
});

app.use("/api/users", userRouter);
app.use("/api/profiles", profileRoute);
app.use("/api/auth", authRouter);

export default app;
