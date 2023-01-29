const teamDivide = document.querySelector("#teamDivision");

console.log(teamDivide);

teamDivide.addEventListener("change", (e) => {
  let value = e.target.value;
  console.log(value);
});
