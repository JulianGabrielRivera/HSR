const socket = io();

const chatForm = document.querySelector("#chat-form");
const input = document.querySelector(".messageInput");
const messages = document.querySelector(".chatMessages");
// when submitting a message
const room = document.querySelectorAll(".eachMessage p");
const roomOne = document.querySelector(".eachMessage .first");
console.log(roomOne);
// const newMessage = (msg) => {
//   const div = document.createElement("div");

//   div.classList.add("chatMessages");
//   div.innerHTML = ` <p>${msg} <span>${msg.time}</span> </p>
//     <p>${msg.username}</p>`;
//   messages.appendChild(div);
// };

roomOne.addEventListener("click", (event) => {
  event.preventDefault();
  socket.emit("joinRoom", roomOne.innerText);

  //   socket.on("message", (message) => {
  //     newMessage(message);
  //     console.log(message);
  //   });
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = input.value;

    //   Emit message to server
    socket.emit("chatMessage", msg);
    console.log(msg);
    input.value = "";
    input.focus();
    const div = document.createElement("div");

    div.classList.add("chatMessages");
    div.innerHTML = ` <p>${msg} <span>${msg.time}</span> </p>
      <p>${msg.username}</p>`;
    messages.appendChild(div);
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
