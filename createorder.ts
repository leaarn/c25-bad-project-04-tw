import express from "express";
// import type { Request, Response, NextFunction } from "express";
import path from "path";
import { logger } from "./utils/logger";

const app = express();

app.use((req, _res, next) => {
  logger.debug(`Request - Method: ${req.method} \t Path: ${req.path}`);
  next();
});


// Section 3
app.use(express.static(path.join(__dirname, "public")));

// Section 4
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`listening at http://localhost:${PORT}`);
});
