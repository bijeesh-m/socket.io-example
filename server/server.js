const io = require("socket.io")(8000, { cors: { origin: "http://localhost:3001" } });

io.on("connection", (socket) => {
    console.log("a user is connected", socket.id);
    socket.on("chat message", (msg,room) => {
        if (room) {
            socket.to(room).emit("recieve-message", msg);
        } else {
        socket.broadcast.emit("recieve-message", msg);
        }
    });

    socket.on("join-room", (room) => {
        socket.join(room);
    });

    // When a client disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
