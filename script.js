console.log("Hello, World!");

// Game state
const cardsGrid = document.querySelector(".cards-grid");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let tries = 0;
let totalPairs;
let matchedPairs = 0;

document.querySelector(".tries").textContent = tries;

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
  generateCards();
}

// Show win screen with confetti
function showWinScreen() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });

  const winMessage = document.createElement("div");
  winMessage.textContent = "You Won!";
  winMessage.style.position = "fixed";
  winMessage.style.top = "50%";
  winMessage.style.left = "50%";
  winMessage.style.transform = "translate(-50%, -50%)";
  winMessage.style.fontSize = "48px";
  winMessage.style.color = "white";
  winMessage.style.zIndex = "1000";
  winMessage.style.fontFamily = "Arial, sans-serif";
  winMessage.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.8)";

  document.body.appendChild(winMessage);

  setTimeout(() => {
    winMessage.remove();
  }, 5000);
}
