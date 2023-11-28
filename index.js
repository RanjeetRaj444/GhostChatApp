const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
	res.sendFile("/public/index.html");
});

const user = {};

io.on("connection", (socket) => {
	socket.on("new-user-joined", (name) => {
		// console.log("New user", name);
		user[socket.id] = name;
		socket.broadcast.emit("User-joined", name);
	});
	socket.on("send", (message) => {
		socket.broadcast.emit("recived", { message, name: user[socket.id] });
	});
	socket.on("disconnect", (message) => {
		socket.broadcast.emit("left", user[socket.id]);
	});
});

server.listen(3000, () => {
	console.log("server running at http://localhost:3000");
});
