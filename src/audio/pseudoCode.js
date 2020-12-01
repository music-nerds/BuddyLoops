/*

io.on('playReceived', (time) => {
  playAtTime(time)
})

function playAtTime(targetPlayTime){
  get current time
  delay = subtract current from target
  setTimeout(() => {
    play()
  }, delay)
}

socket.on('playSent', () => {
  get date
  add buffer time
  send target time
  socket.emit('playReceived')
})

on play button

io.emit('playSent')

*/