let gameel = document.querySelector("#gametext");
let startbtn = document.querySelector(".play");
let jumpbtn = document.querySelector(".jump");
let difficulty = document.querySelector("#difficulty");
let gamecontainer = document.querySelector("#game");

let game0 = Array(16).fill(".");
let game1 = Array(16).fill(".");
game0[0] = ">";
let inAir = false;
let airTicks = 0;
let gameInterval;
let score = 0;
let playing = false;

function tick() {
  let dead = false;
  game0.shift();
  game1.shift();
  game0[15] = Math.random() > 0.92 && game1[14] !== "#" && game0[12] !== "#" ? "#" : ".";
  game1[15] =
    Math.random() > 0.97 && game0[14] !== "#" && game0[15] !== "#" ? "#" : ".";

  if (airTicks > 2) {
    inAir = false;
    airTicks = 0;
  }

  if ((inAir ? game1 : game0)[0] === "#") {
    clearInterval(gameInterval);
    dead = true;
    difficulty.disabled = false;
    startbtn.disabled = false;
    gamecontainer.classList.remove("playing");
  }

  if (inAir && !dead) {
    airTicks++;
    game1[0] = ">";
    game0[0] = ".";
    score += 10;
  } else if (dead) {
    game0[0] = "v";
  } else {
    game0[0] = ">";
    game1[0] = ".";
    score += 10;
  }

  let deadtext = dead ? " - You Died! Press Play to try again" : "";

  gameel.textContent = `Score: ${score.toString()}${deadtext}\n\n${game1.join("")}\n${game0.join("")}`;
}

jumpbtn.addEventListener("click", () => {
  if (inAir) return;
  inAir = true;
  airTicks = 0;
  difficulty.disabled = true;
});

startbtn.addEventListener("click", () => {
  score = 0;
  gameInterval = setInterval(tick, 100 * (5 - difficulty.value));
  playing = true;
  gamecontainer.classList.add("playing");
  startbtn.disabled = true;
});
