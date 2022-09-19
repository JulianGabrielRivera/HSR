const specificTeam = document.querySelector(".team");
const midContainer = document.querySelector("#middleContainer");
const teamDiv = document.createElement("div");

specificTeam.addEventListener("change", (event) => {
  const oneTeam = document.querySelector(".teamsHere");

  const words = event.target.value.split(",");
  if (oneTeam) {
    midContainer.removeChild(oneTeam);
  }

  teamDiv.textContent = "";

  words.forEach((word) => {
    let newEl = document.createElement("div");

    midContainer.appendChild(teamDiv);
    teamDiv.classList.add("individualTeam");

    let individualTeam = document.querySelector(".individualTeam");

    individualTeam.style.display = "flex";
    newEl.textContent = word;

    individualTeam.appendChild(newEl);
  });
});
