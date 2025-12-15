console.log("ありがとうございます");

// Game state
const cardsGrid = document.querySelector(".cards-grid");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let tries = 0;
let totalPairs;
let matchedPairs = 0;
let highScore = localStorage.getItem("highScore") || "--";

document.querySelector(".tries").textContent = tries;
document.getElementById("high-score-value").textContent = highScore;
document.getElementById("score-value").textContent = tries;

// Fetch and initialize cards
fetch("cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    totalPairs = cards.length / 2;
    shuffleCards();
    generateCards();
  });

// Fisher-Yates shuffle
function shuffleCards() {
  let currentIndex = cards.length;
  let randomIndex;
  let temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Generate card elements
function generateCards() {
  cardsGrid.innerHTML = "";
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="card-front" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    cardsGrid.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// Flip card logic
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  tries++;
  document.querySelector(".tries").textContent = tries;
  document.getElementById("score-value").textContent = tries;
  lockBoard = true;

  checkMatch();
}

// Check if cards match
function checkMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs++;
  if (matchedPairs === totalPairs) {
    showWinScreen();
  }
  resetBoard();
}

// Unflip unmatched cards
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 600);
}

// Reset game board
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Restart game
function restart() {
  resetBoard();
  matchedPairs = 0;
  shuffleCards();
  tries = 0;
  document.querySelector(".tries").textContent = tries;
  document.getElementById("score-value").textContent = tries;
  document.getElementById("win-screen").classList.add("hidden");
  document.getElementById("win-screen").classList.remove("show");
  generateCards();
}

// Show win screen with confetti
function showWinScreen() {
  const winScreen = document.getElementById("win-screen");
  const scoreText = document.getElementById("score-text");

  // Calculate and display score text
  let score;
  if (tries >= 18 && tries <= 25) {
    score = "Excellent";
  } else if (tries >= 26 && tries <= 30) {
    score = "Good";
  } else if (tries >= 31 && tries <= 50) {
    score = "Average";
  } else {
    score = "Fair";
  }
  scoreText.textContent = `Score: ${score}`;

  // Show win screen with fade-in
  winScreen.classList.remove("hidden");
  winScreen.classList.add("show");

  // Full-screen confetti
  const duration = 5 * 1000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#FFC0CB", "#FF69B4", "#FF1493", "#DB7093", "#FF6347", "#FFA07A", "#FF7F50", "#FFD700"],
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#FFC0CB", "#FF69B4", "#FF1493", "#DB7093", "#FF6347", "#FFA07A", "#FF7F50", "#FFD700"],
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  // Update high score if applicable
  if (highScore === "--" || tries < parseInt(highScore)) {
    highScore = tries;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high-score-value").textContent = highScore;
  }

  // Hide win screen after 5 seconds with fade-out
  setTimeout(() => {
    winScreen.classList.remove("show");
    winScreen.classList.add("hidden");
  }, 5000);
}
