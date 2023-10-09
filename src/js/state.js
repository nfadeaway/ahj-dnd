export default class State {
  constructor() {
    this.cards = {};
  }

  loadState() {
    if (localStorage.getItem("cards")) {
      this.cards = JSON.parse(localStorage.getItem("cards"));
    }
  }

  showCards(mainContainer) {
    if (this.cards) {
      for (const card in this.cards) {
        let cardsContainer = mainContainer
          .querySelector(`.${card}`)
          .querySelector(".cards");
        this.cards[card].forEach((content) => {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card");
          cardDiv.innerText = content;
          cardsContainer.appendChild(cardDiv);
        });
      }
      localStorage.clear();
      this.cards = {};
    }
  }

  saveState(mainContainer) {
    this.cards = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    for (const column in this.cards) {
      mainContainer
        .querySelector(`.${column}`)
        .querySelectorAll(".card")
        .forEach((card) => this.cards[column].push(card.innerText));
    }
    localStorage.setItem("cards", JSON.stringify(this.cards));
    this.cards = {};
  }
}
