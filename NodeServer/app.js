const io = require('socket.io')(8000)
const users = {}

let clients = 0
io.on('connection', socket=> {
  clients++
  io.sockets.emit("new-connection", clients)
  socket.on("new-user-join", name=> {
    users[socket.id] = name
    socket.broadcast.emit('user-join', {"name":name, "clients":clients})
  })

  socket.on("send", message=> {
    socket.broadcast.emit("receive", {"name":users[socket.id], "message":message})
  })

  socket.on('disconnect', ()=> {
    clients--
    socket.broadcast.emit("left", {"users":users[socket.id], "clients":clients})
    delete users[socket.id]
  })
})