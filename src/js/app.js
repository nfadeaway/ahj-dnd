import State from "./state";
import CardManager from "./cardManager";
import CardMovementController from "./cardMovementController";

const container = document.querySelector(".main-container");
const state = new State();
const cardManager = new CardManager(container);
const cardMovementController = new CardMovementController();

window.addEventListener("unload", () => {
  state.saveState(container);
});

window.addEventListener("load", () => {
  state.loadState();
  state.showCards(container);
});

container.addEventListener("mouseover", (e) => {
  cardManager.showCardRemoveBtn(e.target);
});

cardManager.cardRemoveBtn.addEventListener("click", (e) => {
  cardManager.removeCard(e.target);
});

cardManager.addCardBtns.forEach((addCardBtn) => {
  addCardBtn.addEventListener("click", (e) => {
    cardManager.hideAddCardBtn(e.target);
  });
});

cardManager.addNewCardCancelBtns.forEach((addNewCardCancelBtn) => {
  addNewCardCancelBtn.addEventListener("click", (e) => {
    cardManager.hideAddCardContainer(e.target);
  });
});

cardManager.addNewCardBtns.forEach((addNewCardBtn) => {
  addNewCardBtn.addEventListener("click", (e) => {
    cardManager.addNewCard(e.target);
  });
});

const onMouseMove = (e) => {
  cardMovementController.moveCard(e);
};

const onMouseUp = () => {
  cardMovementController.dropCard();
  document.removeEventListener("mouseup", onMouseUp);
  document.removeEventListener("mousemove", onMouseMove);
};

container.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("card")) {
    cardMovementController.selectCard(e);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }
});
