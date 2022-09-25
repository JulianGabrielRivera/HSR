const socket = io();

const chatForm = document.querySelector("#chat-form");
const input = document.querySelector(".messageInput");
const messages = document.querySelector(".chatMessages");
// when submitting a message
const room = document.querySelectorAll(".eachMessage p");
const roomOne = document.querySelector(".eachMessage .first");
const div = document.createElement("div");

console.log(roomOne);
console.log(room);

// socket.on("connect", () => {
//   console.log("ok");
// });
// socket.on("chatMessage", (msg) => {
//   const div = document.createElement("div");
//   div.classList.add("chatMessages");
//   console.log(msg.msg);
//   console.log(msg.name);

//   div.innerHTML = ` <p>${msg.msg}</p> <p>${msg.name}</p> <p>${msg.time}</p>
//     `;
//   messages.appendChild(div);
//   input.value = "";
//   input.focus();
// });
// roomOne.addEventListener("click", (event) => {
//   event.preventDefault();
//   let room = roomOne.innerText;
//   console.log(room);

//   socket.emit("joinRoom", room);
//   chatForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const msg = input.value;
//     socket.emit("message", msg, room);
//     console.log(msg);

//     //   Emit message to server
//   });
// });

// socket.on("chatMessage", (msg) => {
//   div.classList.add("chatMessages");
//   console.log(msg.msg);
//   console.log(msg.name);

//   div.innerHTML = ` <p>${msg.msg}</p> <p>${msg.name}</p> <p>${msg.time}</p>
//     `;
//   messages.appendChild(div);
//   input.value = "";
//   input.focus();
// });
let roomie = "";
room.forEach((roomName) => {
  roomName.addEventListener("click", (e) => {
    // div.innerHTML = "";
    // socket.disconnect();

    roomie = roomName.innerText;

    socket.connect();
    socket.emit("joinRoom", roomie);
    console.log(roomie);
  });

  // roomName.addEventListener("click", () => {
  //   socket.disconnect("hi", () => {
  //     console.log("no");
  //   });
  //   // socket.on("disconnect", () => {
  //   //   console.log("yea"); // undefined
  //   // });
  //   socket.emit("joinRoom");
  //   div.innerHTML = "";
  // });
});
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msg = input.value;

  //   Emit message to server
  socket.emit("message", msg, roomie);
  // input.value = "";
  // input.focus();
});
socket.on("chatMessage", (msg) => {
  // socket.disconnect();

  div.classList.add("chatMessages");
  console.log(msg.msg);
  console.log(msg.name);

  div.innerHTML = ` <p>${msg.msg}</p> <p>${msg.name}</p> <p>${msg.time}</p>
    `;
  messages.appendChild(div);
  input.value = "";
  input.focus();
  socket.connect();
});
let chatContainer = document.querySelector(".chatLeftContainer");

const createARoom = localStorage.getItem("myDiv");
const newestRoom = document.createElement("div");

newestRoom.textContent = createARoom;
newestRoom.classList.add("eachMessage");
console.log(newestRoom);
chatContainer.appendChild(newestRoom);
console.log(createARoom);

// });

// username + room

// socket.emit("joinRoom", room);

// socket.on("message", (message) => {
//   newMessage(message);
//   console.log(message);
// });

// chatForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const msg = input.value;

//   //   Emit message to server
//   socket.emit("chatMessage", msg);
//   input.value = "";
//   input.focus();
// });
