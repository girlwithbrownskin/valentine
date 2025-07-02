const dot = document.getElementById("dot");
const message = document.getElementById("message");
const game = document.getElementById("game");

let score = 0;
let failCount = 0;
let spiralTriggered = false;

// Move dot to random position
function moveDot(faster = false) {
  const gameRect = game.getBoundingClientRect();
  const maxX = gameRect.width - 40;
  const maxY = gameRect.height - 40;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  if (faster) {
    dot.style.transition = `top 0.2s ease, left 0.2s ease`;
  }
}

// On dot click
dot.addEventListener("click", () => {
  score++;
  message.textContent = getRandomTaunt(true);
  document.body.classList.add("spiral");

  setTimeout(() => {
    document.body.classList.remove("spiral");
    moveDot(true);
  }, 1000);

  // Make dot harder to catch
  dot.style.width = `${40 - score}px`;
  dot.style.height = `${40 - score}px`;

  if (score >= 10 && !spiralTriggered) {
    spiralTriggered = true;
    message.textContent = "you can't win. it's alive.";
    document.body.style.background = "#111";
  }
});

// Missed click
game.addEventListener("click", (e) => {
  if (e.target !== dot) {
    failCount++;
    message.textContent = getRandomTaunt(false);

    // Dot moves faster if you miss more
    moveDot(true);
  }
});

// Taunt system
function getRandomTaunt(success) {
  const fails = [
    "too slow.",
    "you missed again.",
    "it's laughing at you.",
    "click harder maybe?",
    "you're not built for this."
  ];
  const wins = [
    "nice one.",
    "lucky shot.",
    "you're getting cocky?",
    "hmmm...",
    "it's evolving."
  ];
  const random = Math.floor(Math.random() * (success ? wins.length : fails.length));
  return success ? wins[random] : fails[random];
}

// Initial position
moveDot();
