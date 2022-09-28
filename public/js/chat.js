const socket = io();

const chatForm = document.querySelector("#chat-form");
const input = document.querySelector(".messageInput");
const messages = document.querySelector(".chatMessages");
// when submitting a message
const room = document.querySelectorAll(".eachMessage a");
const roomOne = document.querySelector(".eachMessage .first");
const div = document.createElement("div");
let chatContainer = document.querySelector(".chatLeftContainer");
const newestRoom = document.createElement("div");

console.log(room);
const value = localStorage.getItem("myDiv");
const a = document.createElement("a");

a.innerText = value;
console.log(a);
// console.log(chatContainer.lastElementChild.innerText);
let usersArray = Array.from(room);

newestRoom.textContent = value;
newestRoom.classList.add("eachMessage");
console.log(newestRoom);
chatContainer.appendChild(newestRoom);
// socket.emit("joinRoom", value);

usersArray.forEach((user) => {
  console.log(user.innerText);

  if (user.innerText === value) {
    newestRoom.textContent = "";
    newestRoom.classList.remove("eachMessage");
  }
});
console.log(usersArray);
// if (chatContainer.lastElementChild.innerText !== value) {
//   const createARoom = localStorage.getItem("myDiv");
//   const newestRoom = document.createElement("div");

//   newestRoom.textContent = createARoom;
//   newestRoom.classList.add("eachMessage");
//   console.log(newestRoom);
//   chatContainer.appendChild(newestRoom);
//   socket.emit("joinRoom", createARoom);
// }

// console.log(chatContainer.lastElementChild.innerText);
// const inner = chatContainer.lastElementChild.innerText;
// const array = [];
// room.forEach((room, index) => {
//   console.log(room.innerText);
//   console.log(value);
//   if (room.innerText !== value) {
//     array.push(room.innerText);
//   }

//   console.log(array);
// });

// if (!array.includes(value)) {
//   array.push(value);
//   const createARoom = localStorage.getItem("myDiv");
//   const newestRoom = document.createElement("div");

//   newestRoom.textContent = createARoom;
//   newestRoom.classList.add("eachMessage");
//   console.log(newestRoom);
//   chatContainer.appendChild(newestRoom);
//   socket.emit("joinRoom", createARoom);
// }
// console.log(array);

// if (room.innerText !== value) {
//   let chatContainer = document.querySelector(".chatLeftContainer");

//   const createARoom = localStorage.getItem("myDiv");
//   const newestRoom = document.createElement("div");

//   newestRoom.textContent = createARoom;
//   newestRoom.classList.add("eachMessage");
//   console.log(newestRoom);
//   chatContainer.appendChild(newestRoom);
//   socket.emit("joinRoom", createARoom);
// }
// );

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
    console.log(roomName);
    roomie = roomName.innerText;

    socket.connect();
    socket.emit("joinRoom", roomie);
    console.log(roomie);
  });

  // let chatContainer = document.querySelector(".chatLeftContainer");

  // const createARoom = localStorage.getItem("myDiv");
  // const newestRoom = document.createElement("div");

  // newestRoom.textContent = createARoom;
  // newestRoom.classList.add("eachMessage");
  // console.log(newestRoom);
  // chatContainer.appendChild(newestRoom);
  // socket.emit("joinRoom", createARoom);

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
  socket.emit("message", msg, value);
  console.log(msg);
  console.log(value);
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
// let chatContainer = document.querySelector(".chatLeftContainer");

// const createARoom = localStorage.getItem("myDiv");
// const newestRoom = document.createElement("div");

// newestRoom.textContent = createARoom;
// newestRoom.classList.add("eachMessage");
// console.log(newestRoom);
// chatContainer.appendChild(newestRoom);
// socket.emit("joinRoom", createARoom);

// axios.get("http://localhost:3000/chat", newestRoom).then((response) => {
//   console.log(response);
// });
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
{
  /* <script src="https://unpkg.com/axios/dist/axios.min.js"></script>; */
}
