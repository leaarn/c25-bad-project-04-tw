import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello,world");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
