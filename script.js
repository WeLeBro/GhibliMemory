console.log("Hello, World!")

const cardsGrid = document.querySelector(".cards-grid");
let audio = new Audio("./sounds/card_flip.mp3")
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let tries = 0;

document.querySelector(".tries").textContent = tries;

fetch("cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

  score
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

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name)
        cardElement.innerHTML = `
            <div class="front">
                <img class="card-front" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        cardsGrid.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
        cardElement.addEventListener("click", function() {
            if (soundEnabled) {
                audio.play();
            }
        });
    }
}

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

function checkMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    tries = 0;
    document.querySelector(".tries").textContent = tries;
    cardsGrid.innerHTML = "";
    generateCards();
}