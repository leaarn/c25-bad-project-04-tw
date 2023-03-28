import express from "express";
import {logger} from "./utils/logger";
const app = express();

app.use((req, res,next)=>{
    logger.debug(`Request - Method: ${req.method} \t Path: ${req.path}`);
})

app.get("/", (req, res) => {
  res.send("hello,world");
});

const PORT = 8080;

app.listen(PORT, () => {
  logger.info(`listening at http://localhost:${PORT}`);
});

