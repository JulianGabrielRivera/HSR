const kickbutton = document.querySelectorAll("#kick");
console.log(kickbutton);

kickbutton.forEach((kick) => {
  kick.addEventListener("click", () => {
    axios
      .post(`/chat/${kick.dataset.value}`)
      .then((res) => {
        console.log(req.body.user, "body");

        console.log(res.data, "hoyo");
      })
      .catch((error) => console.log(error));
  });
});
