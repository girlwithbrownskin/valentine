const dotContainer = document.getElementById("dot-container");
const message = document.getElementById("message");
const stats = document.getElementById("stats");
const overlay = document.getElementById("overlay");
const dashboard = document.getElementById("dashboard");
const dashHits = document.getElementById("dashHits");
const dashFails = document.getElementById("dashFails");
const dashLine = document.getElementById("dashLine");
const restartBtn = document.getElementById("restartBtn");
const modeButtons = document.querySelectorAll(".mode-btn");

let score = 0;
let fails = 0;
let mode = "easy";
let roundHits = 0;
let moveIntervals = [];

const difficulty = {
  easy: { chance: 0.5, radius: 100, speed: 1200 },
  medium: { chance: 0.3, radius: 150, speed: 800 },
  insane: { chance: 0.05, radius: 200, speed: 500 }
};

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    mode = btn.getAttribute("data-mode");
    overlay.style.display = "none";
    resetGame();
    spawnDots(3);
  });
});

restartBtn.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  overlay.style.display = "flex";
  clearAllIntervals();
});

function resetGame() {
  score = 0;
  fails = 0;
  roundHits = 0;
  dotContainer.innerHTML = "";
  updateStats();
  message.textContent = "Catch it if you can.";
}

function spawnDots(count) {
  dotContainer.innerHTML = "";
  roundHits = 0;
  clearAllIntervals();

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    // Initial state: not hittable
    dot.dataset.hittable = "0";

    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (dot.dataset.hittable === "1") {
        dot.classList.add("pop");
        dot.style.pointerEvents = "none";
        roundHits++;
        score++;
        updateStats();
        setTimeout(() => dot.remove(), 300);

        if (roundHits === count) {
          spawnDots(3); // Start new round
        }
      } else {
        moveDot(dot); // dodges
      }
    });

    game.appendChild(dot);
    moveDot(dot);

    const loop = setInterval(() => moveDot(dot), difficulty[mode].speed);
    moveIntervals.push(loop);
  }
}

function moveDot(dot) {
  const gameRect = game.getBoundingClientRect();
  const maxX = gameRect.width - 24;
  const maxY = gameRect.height - 24;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  dot.dataset.hittable = "0";

  // Becomes clickable after a delay
  setTimeout(() => {
    dot.dataset.hittable = Math.random() < difficulty[mode].chance ? "1" : "0";
  }, 400);
}

function clearAllIntervals() {
  moveIntervals.forEach(clearInterval);
  moveIntervals = [];
}

function updateStats() {
  stats.textContent = `Hits: ${score} | Fails: ${fails} | Max Fails: 5`;
}

game.addEventListener("click", (e) => {
  if (!e.target.classList.contains("dot")) {
    fails++;
    updateStats();
    message.textContent = getRandomTaunt(false);
    if (fails >= 5) endGame();
  }
});

function endGame() {
  dotContainer.innerHTML = "";
  clearAllIntervals();

  let line = "";
  if (score === 0) line = "You didn’t catch it once. That's sad.";
  else if (score < 3) line = `Only ${score}? It let you win.`;
  else if (score >= 5) line = `Okay. ${score} hits? You're not bad.`;

  dashHits.textContent = score;
  dashFails.textContent = fails;
  dashLine.textContent = line;

  dashboard.classList.remove("hidden");
}

function getRandomTaunt(success) {
  const fails = [
    "you blinked.",
    "still too slow.",
    "it's laughing.",
    "5 fails? seriously?",
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
  const arr = success ? wins : fails;
  return arr[Math.floor(Math.random() * arr.length)];
}

// DODGE ON CURSOR NEARBY
game.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".dot").forEach(dot => {
    const rect = dot.getBoundingClientRect();
    const dist = Math.hypot(rect.x - e.clientX, rect.y - e.clientY);
    const dodgeRadius = difficulty[mode].radius;

    if (dist < dodgeRadius && dot.dataset.hittable === "0") {
      moveDot(dot); // run!
    }
  });
});
