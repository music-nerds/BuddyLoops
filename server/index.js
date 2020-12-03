const express = require('express');
const path = require('path');
const chalk = require('chalk');
const cors = require('cors');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PUBLIC_PATH = path.join(__dirname, '../public');
const DIST_PATH = path.join(__dirname, '../dist');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_PATH));
app.use(express.static(DIST_PATH));

app.get('/*', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/index.html`);
});

io.on('connection', socket => {

  socket.on('handshake', (id) => {
    // establish connection with socketID
    console.log('handshake ', id);
    socket.join(id);
  })

  socket.on('getOffset', (id, timeObj) => {
    // get time data
    timeObj.serverTime = Date.now();
    io.to(id).emit('receiveServerTime', timeObj);
  })

  socket.on('notifyTime', (id, timeObj) => {
    console.log('notify')
    // notify other users of time data
    io.to(id).emit('notifyTime', timeObj);
  })

  socket.on('sendPlay', (id, timeArr) => {
    // start playing
    console.log(id, timeArr)
    const now = Date.now();
    let delay = Math.max(...timeArr.map(timeData => timeData.roundTripTime)) * 2;
    console.log(delay)
    if(delay > 1000) delay = 1000;
    const target = now + delay;
    io.to(id).emit('receivePlay', target);
  })

  socket.on('sendStop', (id) => {
    // stop playing
    io.to(id).emit('receiveStop');
  })
  
  socket.on('sendRowLaunch', (id, name) => {
    // launch a row
    io.to(id).emit('receiveRowLaunch', name);
  })

  socket.on('patternChange', (id, data) => {
    // change pattern
    console.log('ID',id);
    console.log('DATA',data);
    socket.to(id).emit('patternChange', data);
  })
})

http.listen(PORT, () => {
  console.log(chalk.cyan(`App is listening on port ${PORT}`));
});