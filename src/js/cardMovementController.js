export default class CardMovementController {
  constructor() {
    this.actualElement = undefined;
    this.shiftX = undefined;
    this.shiftY = undefined;
    this.emptyPlace = undefined;
  }

  moveAt(pageX, pageY) {
    this.actualElement.style.left = pageX - this.shiftX + "px";
    this.actualElement.style.top = pageY - this.shiftY + "px";
  }

  moveCard(e) {
    this.moveAt(e.pageX, e.pageY);

    this.actualElement.hidden = true;
    let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    this.actualElement.hidden = false;

    if (elemBelow.classList.contains("card")) {
      const elemBelowRect = elemBelow.getBoundingClientRect();
      const actualElementRect = this.actualElement.getBoundingClientRect();
      const middleYCoordElemBelow =
        elemBelowRect.bottom - (elemBelowRect.bottom - elemBelowRect.top) / 2;
      const middleYCoordActualElement =
        actualElementRect.bottom -
        (actualElementRect.bottom - actualElementRect.top) / 2;
      if (middleYCoordActualElement < middleYCoordElemBelow) {
        elemBelow.before(this.emptyPlace);
      } else {
        elemBelow.after(this.emptyPlace);
      }
    } else if (
      elemBelow.classList.contains("add-card-btn") &&
      elemBelow.closest(".column").querySelector(".cards").children.length === 0
    ) {
      elemBelow
        .closest(".column")
        .querySelector(".cards")
        .appendChild(this.emptyPlace);
    }
  }

  dropCard() {
    this.actualElement.classList.remove("selected");
    this.actualElement.style.removeProperty("top");
    this.actualElement.style.removeProperty("left");
    this.actualElement
      .querySelector(".card-remove-btn")
      .classList.toggle("active");

    this.emptyPlace
      .closest(".cards")
      .insertBefore(this.actualElement, this.emptyPlace);
    this.emptyPlace.remove();

    this.actualElement = undefined;
    this.shiftX = undefined;
    this.shiftY = undefined;
    this.emptyPlace = undefined;
  }

  selectCard(e) {
    e.preventDefault();
    this.actualElement = e.target;
    this.actualElement.classList.add("selected");
    this.actualElement
      .querySelector(".card-remove-btn")
      .classList.toggle("active");
    this.emptyPlace = document.createElement("div");
    this.emptyPlace.classList.add("place");
    this.emptyPlace.style.height =
      this.actualElement.getBoundingClientRect().height + "px";
    this.emptyPlace.style.width =
      this.actualElement.getBoundingClientRect().width + "px";

    this.actualElement.nextSibling
      ? this.actualElement.nextSibling.before(this.emptyPlace)
      : this.actualElement.closest(".cards").appendChild(this.emptyPlace);

    this.shiftX = e.clientX - this.actualElement.getBoundingClientRect().left;
    this.shiftY = e.clientY - this.actualElement.getBoundingClientRect().top;

    this.moveAt(e.pageX, e.pageY);
  }
}
