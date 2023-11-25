let remotes = [];
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.post("/createRemote", (req, res) => {
  console.log(`createRemote: ${req.body.remoteID}`);
  remotes.push(req.body.remoteID);
  res.json({ created: true });
});
app.post("/getRemote", (req, res) => {
  res.json({ exist: remotes.indexOf(req.body.remoteID) > -1 });
});
app.get("/remotes", (req, res) => {
  res.json({ remotes });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:3000",
    // origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Connection (${socket.id})`);
  console.log(socket.id);
  socket.on("disconnect", (reason) => {
    console.log(`Disconnect (${socket.id}): ${reason}`);
    remotes = remotes.filter((remoteID) => remoteID !== socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("runing server on", 3001);
});
