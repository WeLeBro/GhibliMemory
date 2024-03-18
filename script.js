console.log("Hello, World!")

// Vóór het maken van de Memory Game had ik al een duidelijk idee van wat ik precies wou doen. Ik vond het lastig om precies te weten waar ik precies moest beginnen en hoe ik wat waar kon maken. Ik heb daarom onderzoek gedaan op internet en heb verschillende videos gekeken uiteindelijk ben ik uitgekomen op een artikel: https://dev.to/javascriptacademy/creating-a-memory-card-game-with-html-css-and-javascript-57g1. Dit artikel heeft mij op weg geholpen met het maken van de Memory Game. Ik heb de code van het artikel niet gekopieerd, maar heb het gebruikt als een soort van leidraad. Ik heb tijdens het creeëren van de game nog aftakkingen gemaakt in mijn onderzoek om bijvoorbeeld .json en de Fisher-Yates shuffle te leren.

const cardsGrid = document.querySelector(".cards-grid");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let tries = 0;

document.querySelector(".tries").textContent = tries;

// Ik heb mijn data in een .json file gezet, zodat ik deze makkelijk kan aanpassen en uitbreiden. Ook zorgt dit voor overzichtelijker code. Ik heb https://youtu.be/iiADhChRriM?si=czzvz8hdW2sXs5cA bekeken om te leren over het gebruik van .json bestanden.

fetch("cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    totalPairs = cards.length / 2;
    shuffleCards();
    generateCards();
  });

// Voor het schudden van mijn kaarten heb ik de Fisher-Yates shuffle gebruikt. Ik heb https://medium.com/@joshfoster_14132/best-javascript-shuffle-algorithm-c2c8057a3bc1 bekeken om te leren over het gebruik van de Fisher-Yates shuffle. Ik heb voor deze methode gekozen omdat er online stond dat dit de beste methode is om data in JS te shufflen.

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
    }, 500);
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