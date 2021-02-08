const express = require("express");
const path = require("path");
const chalk = require("chalk");
const cors = require("cors");

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PUBLIC_PATH = path.join(__dirname, "../public");
const DIST_PATH = path.join(__dirname, "../dist");
const PORT = process.env.PORT || 3000;

const environment = process.env.NODE_ENV || "development";

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    environment !== "development"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}

app.use(requireHTTPS);
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_PATH));
app.use(express.static(DIST_PATH));

app.get("/*", (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/index.html`);
});

io.on("connection", (socket) => {
  /*
    GLOBAL MESSAGES
  */
  socket.on("handshake", (id) => {
    // establish connection with socketID
    console.log(chalk.cyan("HANDSHAKE", `roomID: ${id}`));
    socket.join(id);
    io.to(id).emit("userJoined", {
      id: socket.client.id,
      timeStamp: Date.now(),
    });
  });
  socket.on("disconnecting", function () {
    this.rooms.forEach((room) => {
      io.to(room).emit("userLeft", socket.client.id);
    });
    console.log(`${socket.client.id} LEFT`);
  });
  socket.on("getOffset", (id, timeObj) => {
    // get time data
    timeObj.serverTime = Date.now();
    timeObj.socketDeviceID = socket.client.id;
    io.to(id).emit("receiveServerTime", timeObj);
  });

  socket.on("notifyTime", (id, timeObj) => {
    // notify other users of time data
    io.to(id).emit("notifyTime", timeObj);
  });

  socket.on("sendState", (id, hostState) => {
    // from host to other users
    socket.to(id).emit("receiveState", hostState);
  });

  socket.on("sendPlay", (id, timeArr) => {
    // start playing
    const now = Date.now();
    let delay =
      Math.max(...timeArr.map((timeData) => timeData.roundTripTime)) * 2;
    console.log(chalk.yellow(`DELAY: ${delay}ms`));
    if (delay > 1000) delay = 1000;
    const target = now + delay;
    io.to(id).emit("receivePlay", target);
  });

  socket.on("sendStop", (id) => {
    // stop playing
    io.to(id).emit("receiveStop");
  });
  /*
    SAMPLER MESSAGES
  */
  socket.on("sendRowLaunch", (id, name) => {
    // launch a row
    socket.to(id).emit("receiveRowLaunch", name);
  });

  socket.on("sendDrumToggle", (id) => {
    socket.to(id).emit("receiveDrumToggle");
  });

  socket.on("sendMomentaryOn", (socketId, id) => {
    socket.to(socketId).emit("receiveMomentaryOn", id);
  });

  socket.on("sendMomentaryOff", (socketID, id) => {
    socket.to(socketID).emit("receiveMomentaryOff", id);
  });

  socket.on("patternChange", (id, data) => {
    // change pattern
    socket.to(id).emit("patternChange", data);
  });
  /*
    SYNTH MESSAGES
  */
  socket.on("clearAllSamplerPatterns", (id) => {
    socket.to(id).emit("clearAllSamplerPatterns");
  });
  socket.on("clearSamplerPattern", (id, patternIndex) => {
    socket.to(id).emit("clearSamplerPattern", patternIndex);
  });
  socket.on("synthPatternChange", (id, pattern) => {
    socket.to(id).emit("synthPatternChange", pattern);
  });
  socket.on("clearSynthPattern", (id) => {
    socket.to(id).emit("clearSynthPattern");
  });
  socket.on("setFilter", (id, x, y) => {
    socket.to(id).emit("sendFilter", { x, y });
  });
  socket.on("setEnvelope", (id, x, y) => {
    socket.to(id).emit("sendEnvelope", { x, y });
  });
  socket.on("setDelay", (id, x, y) => {
    socket.to(id).emit("sendDelay", { x, y });
  });
  socket.on("synthLaunch", (id) => {
    socket.to(id).emit("synthLaunch");
  });
  socket.on("arpNotes", (id, notesArr) => {
    socket.to(id).emit("arpNotes", notesArr);
  });
  socket.on("arpHoldOff", (id) => {
    socket.to(id).emit("arpHoldOff");
  });
  socket.on("arpHoldOn", (id) => {
    socket.to(id).emit("arpHoldOn");
  });
});

http.listen(PORT, () => {
  console.log(chalk.gray(`App is listening on port ${PORT}`));
});
