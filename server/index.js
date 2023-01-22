const express = require("express")
const cors = require("cors")
const http = require("http")
const socketIO = require("socket.io")
const app = express()
const port = 5000 || process.env.PORT
app.use(cors())
app.get("/",(req,res)=>{
    res.send("Hello")
})
const server = http.createServer(app)
const users = [{}]

const io=socketIO(server)

io.on('connection',(socket)=>{
    console.log("New connection");


    socket.on('joined',({user})=>{
        users[socket.id]=user
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`})
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat, ${users[socket.id]}`})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })
    
    socket.on('disconnected',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
        console.log("User left");
    })
})

server.listen(port,()=>{
    console.log("server start");
})
