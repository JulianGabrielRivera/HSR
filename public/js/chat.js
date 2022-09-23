const socket = io();

const chatForm = document.querySelector("#chat-form");
const input = document.querySelector(".messageInput");
const messages = document.querySelector(".chatMessages");
// when submitting a message
const room = document.querySelectorAll(".eachMessage p");
const roomOne = document.querySelector(".eachMessage .first");
console.log(roomOne);

socket.on("connect", () => {
  console.log("ok");
});
socket.on("chatMessage", (msg) => {
  const div = document.createElement("div");
  div.classList.add("chatMessages");
  console.log(msg.msg);
  console.log(msg.name);

  div.innerHTML = ` <p>${msg.msg}</p> <p>${msg.name}</p> <p>${msg.time}</p>
    `;
  messages.appendChild(div);
  input.value = "";
  input.focus();
});
roomOne.addEventListener("click", (event) => {
  event.preventDefault();
  let room = roomOne.innerText;
  console.log(room);

  socket.emit("joinRoom", room);
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = input.value;
    socket.emit("message", msg, room);
    console.log(msg);

    //   Emit message to server
  });
});
// room.forEach((roomNumber) => {
//   console.log(roomNumber);

//   roomNumber.addEventListener("click", (e) => {
//     socket.emit("joinRoom", roomNumber);
//     console.log(roomNumber);
//     div.innerText = "";
//     socket.on("message", (message) => {
//       newMessage(message);
//       console.log(message.text);
//     });
//     chatForm.addEventListener("submit", (event) => {
//       event.preventDefault();
//       const msg = input.value;

//       //   Emit message to server
//       socket.emit("chatMessage", msg);
//       input.value = "";
//       input.focus();
//     });
//   });
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
