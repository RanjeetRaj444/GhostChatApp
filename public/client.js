const socket = io();

const form = document.getElementById("send-container");
const messageInp = document.getElementById("messageInp");

const meaageContainer = document.querySelector(".container");
var audio = new Audio("ting.mp3");

const append = (message, position) => {
	const messageElement = document.createElement("div");
	const user = document.createElement("span");
	const text = document.createElement("span");
	user.classList.add("User");
	text.classList.add("Text");
	user.innerText = message.name;
	text.innerText = message.message;
	messageElement.classList.add("message");
	messageElement.classList.add(position);
	messageElement.append(user, ":", text);
	// messageElement.innerText = message.message;
	meaageContainer.append(messageElement);
	if (position === "left") {
		audio.play();
	}
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = messageInp.value;
	// append(`You: ${message}`, "right");
	append({ name: "You", message }, "right");
	socket.emit("send", message);
	messageInp.value = "";
});

const name = prompt("Enter your name to join.");

socket.emit("new-user-joined", name);

socket.on("User-joined", (name) => {
	append({ name: name, message: "joined the chat." }, "left");
	// append(`${name} `, "left");
});

socket.on("recived", (data) => {
	append({ name: data.name, message: data.message }, "left");
	// append(`${data.name}: ${data.message}`, "left");
});
socket.on("left", (name) => {
	append({ name, message: "has left the chat." }, "left");
	// append(`${name} has left the chat.`, "left");
});
