// const express = require("express");
// const { createServer } = require("http");
// const next = require("next");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const port = parseInt(process.env.PORT || "3001", 10);
// const dev = process.env.NODE_ENV !== "production";
// const nextApp = next({ dev });
// const nextHandler = nextApp.getRequestHandler();

// let remotes = [];

// nextApp.prepare().then(async () => {
//   const app = express();
//   app.use(cors());
//   app.use(express.json());
//   const server = createServer(app);
//   const io = new Server({
//     cors: {
//       // origin: "http://localhost:3000",
//       // origin: "*",
//     },
//   });
//   io.attach(server);

//   app.post("/createRemote", async (req, res) => {
//     console.log(`createRemote: ${req.body.remoteID}`);
//     remotes.push(req.body.remoteID);
//     res.json({ created: true });
//   });
//   app.post("/getRemote", async (req, res) => {
//     res.json({ exist: remotes.indexOf(req.body.remoteID) > -1 });
//   });
//   app.get("/remotes", async (req, res) => {
//     res.json({ remotes });
//   });

//   io.on("connection", (socket) => {
//     console.log(`Connection (${socket.id})`);
//     console.log(socket.id);
//     socket.on("disconnect", (reason) => {
//       console.log(`Disconnect (${socket.id}): ${reason}`);
//       remotes = remotes.filter((remoteID) => remoteID !== socket.id);
//     });
//   });

//   app.all("*", (req, res) => nextHandler(req, res));

//   server.listen(port, () => {
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });

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
