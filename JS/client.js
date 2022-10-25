
const socket = io("https://chatappsocket99.herokuapp.com", {
  "force new connection": true,
  "reconnectionAttempts": "Infinity", 
  "timeout": 10001, 
  "transports": ["websocket"]
}
);

// Audio Ting
let audio = new Audio("../sounds/ting.mp3")

function scrollToBottom() {
  var objDiv = document.getElementById("messageContainer");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function currentDate() {
  date = new Date()
  const options = { weekday: 'long', hour: 'numeric', minute: 'numeric'};
  current = date.toLocaleDateString(undefined, options)
  return current
}

const form = document.getElementById("sendForm")
const messageContainer = document.getElementById("messageContainer")
const msginput = document.getElementById("msg")
const appendDOM = (message, position)=> {
    // <h5 class="card-title d-inline-block">${data.name}</h5>&nbsp;
    if(position === "right"){
      color = "primary"
      borderRadius = "20px 0 20px 20px"
    } else if(position == "left") {
      color = "light"
      borderRadius = "0 20px 20px 20px"
    } else if(position == "middle") {
      color = "info mx-auto my-3"
      borderRadius = "10px"
    } else {
      color = "none bg-light mx-auto my-3 d-block"
      borderRadius = "10px"
      position="middle"
    }

    messageContainer.innerHTML += 
    `
    <div class="card message my-2 ${position} alert-${color}" style="width: auto; border-radius: ${borderRadius};">
    <div class="card-body">
      <h6 class="card-text text-muted d-inline-block">${message}</h6>
    </div>
  </div>
    `
  }
  
  user = prompt("Enter Your Name")
  if (!user) location.reload()
  socket.emit('new-user-join', user)

  socket.on("new-connection", clients=> {
    if ((clients) == 0) clients = "No"
    appendDOM(`<i class="fa fa-user"></i> ${clients} user(s) in the chat`, "info")
  })

  socket.on('user-join', name=> {
    appendDOM(`<i class="fa fa-user"></i> ${name.name} Joined the CHAT &nbsp;&nbsp;&nbsp;<i class="fa fa-calendar"></i> ${currentDate()}`, "middle")
  })
  
  socket.on("receive", data=> {
    appendDOM(`${data.name} : ${data.message}`, "left")
    audio.play()
  scrollToBottom()
})

form.addEventListener("submit", (e)=> {
  e.preventDefault()
  let msg = msginput.value
  if (msg != ""){
    socket.emit("send", msg)
    appendDOM(`${msg}`, "right")
    scrollToBottom()
    msginput.value = ""
  }
})

socket.on("left", name=> {
  appendDOM(`${name.users} Left the Chat`, "danger")
  appendDOM(`${name.clients} users in the Chat`, "info")
})
