const cardRemoveBtn = document.createElement("div");
cardRemoveBtn.classList.add("card-remove-btn");
cardRemoveBtn.textContent = "\u{2715}";

const container = document.querySelector(".main-container");
const addCardBtns = document.querySelectorAll(".add-card-btn");
const addNewCardCancelBtns = document.querySelectorAll(
  ".add-new-card-cancel-btn",
);
const addNewCardBtns = document.querySelectorAll(".add-new-card-btn");

window.addEventListener("unload", () => {
  const cardsTodo = [];
  container
    .querySelector(".todo")
    .querySelectorAll(".card")
    .forEach((card) => cardsTodo.push(card.innerText));
  const cardsInProgress = [];
  container
    .querySelector(".in-progress")
    .querySelectorAll(".card")
    .forEach((card) => cardsInProgress.push(card.innerText));
  const cardsDone = [];
  container
    .querySelector(".done")
    .querySelectorAll(".card")
    .forEach((card) => cardsDone.push(card.innerText));
  const cards = {
    todo: cardsTodo,
    "in-progress": cardsInProgress,
    done: cardsDone,
  };
  localStorage.setItem("cards", JSON.stringify(cards));
});

window.addEventListener("load", () => {
  if (localStorage.getItem("cards")) {
    const cardContents = JSON.parse(localStorage.getItem("cards"));
    let cardsArea;
    for (const cardContent in cardContents) {
      cardsArea = container
        .querySelector(`.${cardContent}`)
        .querySelector(".cards");
      cardContents[cardContent].forEach((content) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.innerText = content;
        cardsArea.appendChild(cardDiv);
      });
    }
    localStorage.clear();
  }
});

container.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("card")) {
    e.target.appendChild(cardRemoveBtn);
    cardRemoveBtn.classList.add("active");
  } else if (!e.target.classList.contains("card-remove-btn")) {
    cardRemoveBtn.classList.remove("active");
  }
});

cardRemoveBtn.addEventListener("click", (e) => {
  e.target.closest(".card").remove();
});

addCardBtns.forEach((addCardBtn) => {
  addCardBtn.addEventListener("click", (e) => {
    e.target.classList.add("hidden");
    e.target
      .closest(".column")
      .querySelector(".add-card-container")
      .classList.toggle("hidden");
  });
});

addNewCardCancelBtns.forEach((addNewCardCancelBtn) => {
  addNewCardCancelBtn.addEventListener("click", (e) => {
    e.target.closest(".add-card-container").classList.toggle("hidden");
    e.target
      .closest(".column")
      .querySelector(".add-card-btn")
      .classList.toggle("hidden");
    const textarea = e.target
      .closest(".add-card-container")
      .querySelector(".add-card-input");
    textarea.value = "";
    if (textarea.classList.contains("red-border")) {
      textarea.classList.remove("red-border");
    }
  });
});

addNewCardBtns.forEach((addNewCardBtn) => {
  addNewCardBtn.addEventListener("click", (e) => {
    const textarea = e.target
      .closest(".add-card-container")
      .querySelector(".add-card-input");
    if (textarea.value) {
      const newCard = document.createElement("div");
      newCard.classList.add("card");
      newCard.textContent = textarea.value;
      e.target.closest(".column").querySelector(".cards").appendChild(newCard);
      textarea.value = "";
      e.target.closest(".add-card-container").classList.toggle("hidden");
      e.target
        .closest(".column")
        .querySelector(".add-card-btn")
        .classList.toggle("hidden");
    } else {
      textarea.classList.add("red-border");
    }
  });
});

let actualElement;
let shiftX;
let shiftY;
let emptyPlace;

function moveAt(pageX, pageY) {
  actualElement.style.left = pageX - shiftX + "px";
  actualElement.style.top = pageY - shiftY + "px";
}

const onMouseMove = (e) => {
  moveAt(e.pageX, e.pageY);

  actualElement.hidden = true;
  let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  actualElement.hidden = false;

  if (elemBelow.classList.contains("card")) {
    const elemBelowRect = elemBelow.getBoundingClientRect();
    const actualElementRect = actualElement.getBoundingClientRect();
    const middleYCoordElemBelow =
      elemBelowRect.bottom - (elemBelowRect.bottom - elemBelowRect.top) / 2;
    const middleYCoordActualElement =
      actualElementRect.bottom -
      (actualElementRect.bottom - actualElementRect.top) / 2;
    if (middleYCoordActualElement < middleYCoordElemBelow) {
      elemBelow.before(emptyPlace);
    } else {
      elemBelow.after(emptyPlace);
    }
  }
};

const onMouseUp = () => {
  actualElement.classList.remove("selected");
  actualElement.style.removeProperty("top");
  actualElement.style.removeProperty("left");
  actualElement.querySelector(".card-remove-btn").classList.toggle("active");

  emptyPlace.closest(".cards").insertBefore(actualElement, emptyPlace);
  emptyPlace.remove();

  actualElement = undefined;
  shiftX = undefined;
  shiftY = undefined;
  emptyPlace = undefined;
  document.removeEventListener("mouseup", onMouseUp);
  document.removeEventListener("mousemove", onMouseMove);
};

container.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("card")) {
    e.preventDefault();
    actualElement = e.target;
    actualElement.classList.add("selected");
    actualElement.querySelector(".card-remove-btn").classList.toggle("active");
    emptyPlace = document.createElement("div");
    emptyPlace.classList.add("place");
    emptyPlace.style.height =
      actualElement.getBoundingClientRect().height + "px";
    emptyPlace.style.width = actualElement.getBoundingClientRect().width + "px";

    actualElement.nextSibling
      ? actualElement.nextSibling.before(emptyPlace)
      : actualElement.closest(".cards").appendChild(emptyPlace);

    shiftX = e.clientX - actualElement.getBoundingClientRect().left;
    shiftY = e.clientY - actualElement.getBoundingClientRect().top;

    document.body.appendChild(actualElement);

    moveAt(e.pageX, e.pageY);

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }
});
