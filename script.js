const dot = document.getElementById("dot");
const message = document.getElementById("message");
const game = document.getElementById("game");
const stats = document.getElementById("stats");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const dashboard = document.getElementById("dashboard");
const summaryText = document.getElementById("summaryText");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let fails = 0;
let allowedHits = 0;

startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  resetGame();
  moveDot();
});

restartBtn.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  resetGame();
  moveDot();
});

function resetGame() {
  score = 0;
  fails = 0;
  allowedHits = 0;
  dot.style.display = "block";
  updateStats();
  message.textContent = "Catch it if you can.";
}

function moveDot(force = false) {
  const gameRect = game.getBoundingClientRect();
  const maxX = gameRect.width - 30;
  const maxY = gameRect.height - 30;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  // Rarely allow hits (force = always allow)
  allowedHits = force || Math.random() > 0.7 ? 1 : 0;
}

dot.addEventListener("click", (e) => {
  e.stopPropagation();
  if (allowedHits === 0) {
    moveDot(); // fake dodge
    return;
  }

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
  if (dist < 100 && allowedHits === 0) {
    moveDot(true); // dodge when hovered close
  }
});

game.addEventListener("click", (e) => {
  if (e.target !== dot) {
    fails++;
    message.textContent = getRandomTaunt(false);
    moveDot(true);
    updateStats();

    if (fails >= 3) {
      endGame();
    }
  }
});

function updateStats() {
  stats.textContent = `Hits: ${score} | Fails: ${fails} | Max Fails: 3`;
}

function endGame() {
  dot.style.display = "none";
  let line = "";

  if (score === 0) line = "You didn’t catch it once. That's sad.";
  else if (score < 3) line = `Only ${score}? It let you win.`;
  else if (score >= 5) line = `Okay. ${score} hits? You're not bad.`;

  summaryText.textContent = `Hits: ${score} | Fails: ${fails} — ${line}`;
  dashboard.classList.remove("hidden");
}

function getRandomTaunt(success) {
  const fails = [
    "you blinked.",
    "still too slow.",
    "it's laughing.",
    "3 fails? seriously?",
    "did you even try?",
    "get real."
  ];
  const wins = [
    "okay okay, nice.",
    "you got lucky.",
    "keep going. it's watching.",
    "nice reflexes... or lag?",
    "hm. interesting.",
    "it let you win."
  ];
  const random = Math.floor(Math.random() * (success ? wins.length : fails.length));
  return success ? wins[random] : fails[random];
}
