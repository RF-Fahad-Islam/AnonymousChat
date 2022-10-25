const express = require('express')
app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const users = {}
const PORT = process.env.PORT || 3000
io.listen(PORT);
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

// app.get("/", (req, res)=> {
// res.send(`<h1>io is listening on ${PORT}</h1>`)
// })
// app.listen(PORT, ()=> {
//   console.log(`http://localhost:${PORT}`)
// })