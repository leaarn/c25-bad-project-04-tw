import express from "express";
import path from "path";
import { logger } from "./utils/logger";
const app = express();

//Section 1
app.use((req, res, next) => {
  logger.debug(`Request - Method: ${req.method} \t Path: ${req.path}`);
  next();
});

//Section 2
app.get("/", (req, res) => {
  res.send("hello,world");
});

//Section 3
app.use(express.static(path.join(__dirname, "public")));

//Section 4
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,"public","404.html"))
})

const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`listening at http://localhost:${PORT}`);
});
