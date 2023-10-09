export default class CardManager {
  constructor(container) {
    this.addCardBtns = container.querySelectorAll(".add-card-btn");
    this.addNewCardCancelBtns = container.querySelectorAll(
      ".add-new-card-cancel-btn",
    );
    this.addNewCardBtns = container.querySelectorAll(".add-new-card-btn");

    this.cardRemoveBtn = document.createElement("div");
    this.cardRemoveBtn.classList.add("card-remove-btn");
    this.cardRemoveBtn.textContent = "\u{2715}";
  }

  removeCard(target) {
    target.closest(".card").remove();
  }

  hideAddCardBtn(target) {
    target.classList.add("hidden");
    target
      .closest(".column")
      .querySelector(".add-card-container")
      .classList.toggle("hidden");
  }

  hideAddCardContainer(target) {
    target.closest(".add-card-container").classList.toggle("hidden");
    target
      .closest(".column")
      .querySelector(".add-card-btn")
      .classList.toggle("hidden");
    const textarea = target
      .closest(".add-card-container")
      .querySelector(".add-card-input");
    textarea.value = "";
    if (textarea.classList.contains("red-border")) {
      textarea.classList.remove("red-border");
    }
  }

  addNewCard(target) {
    const textarea = target
      .closest(".add-card-container")
      .querySelector(".add-card-input");
    if (textarea.value) {
      const newCard = document.createElement("div");
      newCard.classList.add("card");
      newCard.textContent = textarea.value;
      target.closest(".column").querySelector(".cards").appendChild(newCard);
      textarea.value = "";
      target.closest(".add-card-container").classList.toggle("hidden");
      target
        .closest(".column")
        .querySelector(".add-card-btn")
        .classList.toggle("hidden");
    } else {
      textarea.classList.add("red-border");
    }
  }

  showCardRemoveBtn(target) {
    if (target.classList.contains("card")) {
      target.appendChild(this.cardRemoveBtn);
      this.cardRemoveBtn.classList.add("active");
    } else if (!target.classList.contains("card-remove-btn")) {
      this.cardRemoveBtn.classList.remove("active");
    }
  }
}
