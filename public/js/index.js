const specificTeam = document.querySelector(".team");
const midContainer = document.querySelector("#middleContainer");
const teamDiv = document.createElement("div");
const userPost = document.querySelectorAll(".userPost");
// const chatContainer = document.querySelector(".chatLeftContainer");
const link = document.querySelectorAll("#rightContainer a");
console.log(link);
console.log(chatContainer);
console.log(userPost);
specificTeam.addEventListener("change", (event) => {
  const oneTeam = document.querySelector(".teamsHere");

  const words = event.target.value.split(",");
  console.log(words);
  if (oneTeam) {
    midContainer.removeChild(oneTeam);
  }

  teamDiv.textContent = "";

  words.forEach((word) => {
    let newEl = document.createElement("div");
    newEl.textContent = word;
    console.log(newEl);
    midContainer.appendChild(teamDiv);
    teamDiv.classList.add("individualTeam");

    let individualTeam = document.querySelector(".individualTeam");

    individualTeam.style.display = "flex";

    individualTeam.appendChild(newEl);
  });
});

// console.log(yea);
userPost.forEach((user) => {
  user.addEventListener("click", () => {
    const div = document.createElement("div");

    div.textContent = user.innerText;
    div.classList.add("eachMessage");
    console.log(div);
    const value = div.innerHTML;
    console.log(value);

    localStorage.setItem("myDiv", value);
  });
});
link.forEach((link) => {
  link.addEventListener("click", () => {
    link.href = "/chat";
  });
});

// userPost.forEach((user) => {
//   user.addEventListener("click", () => {
//     // const div = document.createElement("div");
//     // console.log(div);
//     // console.log(user.innerText);
//     // div.textContent = user.innerText;
//     // div.classList.add("eachMessage");
//     // console.log(div);
//     // chatContainer.appendChild(div);
//   });
// });
