const express = require('express');
const path = require('path');
const chalk = require('chalk');

const app = express();
// var io = require('socket.io-client')('http://localhost:3000');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PUBLIC_PATH = path.join(__dirname, '../public');
const DIST_PATH = path.join(__dirname, '../dist');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(PUBLIC_PATH));
app.use(express.static(DIST_PATH));

let room;

app.use(function(req, res, next) {
  room = req.originalUrl.slice(1);
  // console.log(req.originalUrl);
  // req.getUrl = function() {
  //   return req.originalUrl.slice(1);
  // }
  return next();
});

app.get('/*', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/index.html`);
});

io.on('connection', socket => {

  socket.on('handshake', (id) => {
    console.log('joined', id);
    socket.join(id);
  })

  socket.on('sendPlay', (id) => {
    console.log(id)
    const now = Date.now();
    const target = now + 1000;
    io.to(id).emit('receivePlay', target);
  })

  socket.on('patternChange', (id, data) => {
    console.log('ID',id);
    console.log('DATA',data);
    socket.to(id).emit('patternChange', data);
  })
})

http.listen(PORT, () => {
  console.log(chalk.cyan(`App is listening on port ${PORT}`));
});