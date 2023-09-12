const express = require("express")
const eSession = require('express-session')
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io")
const sharedSession = require("express-socket.io-session")
const cookieParser = require("cookie-parser")
const { createServer } = require("node:http")
const {join} = require("node:path")
const crypto = require("node:crypto")
const Room = require("./room")

const app = express()
const server = createServer(app)
const io = new Server(server);

const secret = "ASfdASDgfASEDtSDgSDGsdfg34612asC"

app.use(express.static(join(__dirname, "../public")))
app.use(cookieParser(secret))

const session = eSession({secret})
app.use(session)
io.use(sharedSession(session, {autoSave: true}))


app.use((req, res, next) => {
    if (!req.session.id) {  
        req.session.id = uuidv4()
    }
    next()
})

app.get("/", (req, res) => {
    res.status(200)
})

const rooms = new Map()

app.get("/room", (req, res) => {
    const {code} = req.query

    const room = rooms.get(code)
    if (!room) {
        return res.sendStatus(404)
    }

    console.log(`${req.session.id} attempting to join room ${code}`)

    if (!room.teamA) {
        room.teamA = req.session.id
    }

    if (!room.teamB && room.teamA != req.session.id) {
        room.teamB = req.session.id
    }

    console.log(room)

    if (room.teamA !== req.session.id && room.teamB !== req.session.id) {
        return res.sendStatus(403)
    }

    res.status(200).sendFile(join(__dirname, "../public/room.html"))
})

io.on('connection', (socket) => {
    socket.on("create-room", () => {
        const roomId = crypto.randomBytes(4).toString("hex")
        console.log(`${socket.handshake.session.id} created room ${roomId}`)

        rooms.set(roomId, new Room())

        socket.emit("successfully created", roomId)
    })

    socket.on("join-room", (roomId) => {
        socket.join(roomId)

        const room = rooms.get(roomId)

        socket.emit("init", {
            team: room.teamA === socket.handshake.session.id ? 0 : 1,
            turn: room.turn,
            status: room.maps
        })
    })

    socket.on("ban", (roomId, index) => {
        const user = socket.handshake.session.id
        const room = rooms.get(roomId)
        const team = room.teamA === user ? 0 : 1
        room.takeTurn(index, team)

        console.log(room)

        io.to(roomId).emit("update", {
            turn: room.turn,
            status: room.maps
        })
    })
});


server.listen(3000, () => {
    console.log("Listening on port 3000")
})