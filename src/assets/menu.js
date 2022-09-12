const difficultySelectors = document.querySelectorAll(".difficulty");

document.getElementById("single-player").addEventListener("click", () => {
  window.location.href = `/game.html?difficulty=${[
    ...difficultySelectors,
  ].indexOf(document.querySelector(".difficulty.selected"))}`;
});

difficultySelectors.forEach((element) => {
  element.addEventListener("click", (e) => {
    difficultySelectors.forEach((element) => {
      element.classList.remove("selected");
    });
    e.target.classList.add("selected");
  });
});
