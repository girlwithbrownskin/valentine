const dot = document.getElementById("dot");
const message = document.getElementById("message");
const game = document.getElementById("game");
const stats = document.getElementById("stats");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

let score = 0;
let fails = 0;
let spiralTriggered = false;

startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  moveDot();
});

function moveDot(faster = false) {
  const gameRect = game.getBoundingClientRect();
  const maxX = gameRect.width - 30;
  const maxY = gameRect.height - 30;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  if (faster) {
    dot.style.transition = `top 0.1s ease, left 0.1s ease`;
  }
}

dot.addEventListener("click", (e) => {
  e.stopPropagation();
  score++;
  message.textContent = getRandomTaunt(true);
  document.body.classList.add("spiral");

  setTimeout(() => {
    document.body.classList.remove("spiral");
    moveDot(true);
  }, 1000);

  updateStats();
});

game.addEventListener("mousemove", (e) => {
  const rect = dot.getBoundingClientRect();
  const dist = Math.hypot(rect.x - e.clientX, rect.y - e.clientY);
  if (dist < 100) {
    moveDot(true); // dodge the mouse if too close
  }
});

game.addEventListener("click", (e) => {
  if (e.target !== dot) {
    fails++;
    message.textContent = getRandomTaunt(false);
    moveDot(true);
    updateStats();
    if (fails >= 3) {
      message.textContent = "That's it. You're done.";
      dot.style.display = "none";
    }
  }
});

function updateStats() {
  stats.textContent = `Hits: ${score} | Fails: ${fails} | Max Fails: 3`;
}

function getRandomTaunt(success) {
  const fails = [
    "you blinked.",
    "still too slow.",
    "it's laughing.",
    "3 fails? seriously?",
    "did you even try?"
  ];
  const wins = [
    "okay okay, nice.",
    "you got lucky.",
    "keep going. it's watching.",
    "nice reflexes... or lag?",
    "hm. interesting."
  ];
  const random = Math.floor(Math.random() * (success ? wins.length : fails.length));
  return success ? wins[random] : fails[random];
}
