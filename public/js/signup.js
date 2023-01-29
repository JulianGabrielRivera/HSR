const roleChange = document.querySelector("#selectRole");

console.log(roleChange);

roleChange.addEventListener("change", (e) => {
  let value = e.target.value;
  console.log(value);
});
