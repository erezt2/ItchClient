const UDP = require('dgram')
const server = UDP.createSocket('udp4')
const port = 22222

const video = document.getElementById('video');

const {Peer} = require("peerjs")
// god forgive me for what im about to do
let peer = new Peer();
const dialog = require('dialogs')()

const rect = video.getBoundingClientRect()
const buttons = document.getElementById("buttons").children

function ask_ID(info) {
  dialog.prompt(info+"\nconnect to server ID:", data=> {
    const conn = peer.connect('itch-app-connection-id-'+data);
    console.log(conn)
    conn.on("error", () => ask_ID("connection failed"))
    conn.on("close", () => ask_ID("connection closed"))
    conn.on('open', () => {
      
      document.addEventListener("keydown", function(event) {
        if(document.getElementsByClassName("dialog-widget").length > 0)
          return;
        conn.send({keyDown: event.key});
      });

      document.addEventListener("keyup", function(event) {
        conn.send({keyUp: event.key});
      });

      document.addEventListener("mousedown", function(event) {
        if(event.button === 0) conn.send({mouseDown: true});
      })

      document.addEventListener("mouseup", function(event) {
        if(event.button === 0) conn.send({mouseUp: true});
      })

      window.addEventListener("mousemove", (event) => {
          conn.send({mousePos: {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top
          }})
      })

      buttons[0].onclick = (event)=> {
        conn.send({join: true})
      }

      buttons[1].onclick = (event)=> {
        conn.send({quit: true})
      }

      window.addEventListener("beforeunload", function(event) {
        conn.send({quit: true})
      })

      conn.on("data", (data)=> {
        if(data.ask) dialog.prompt(data.ask, answer => {
            conn.send({answer: answer})
          })
      })
    });

    peer.on("call", function(call) {
      call.answer()
      call.on("stream", function(stream) {
        video.srcObject = stream
        // video.play()
      })
    })
  })
}

peer.on("open", id=> {
  ask_ID("")
})
