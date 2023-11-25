let remotes = [];
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/createRemote", (req, res) => {
  console.log(`createRemote: ${req.body.remoteID}`);
  remotes.push(req.body.remoteID);
  res.json({ created: true });
});
app.post("/api/getRemote", (req, res) => {
  res.json({ exist: remotes.indexOf(req.body.remoteID) > -1 });
});
app.get("/api/remotes", (req, res) => {
  res.json({ remotes });
});

app.listen(8080, () => {
  console.log("runing server on", 8080);
});
