import Emitter from "../../utils/emitter";

export default class Page extends Emitter {
  constructor({ parent, html, webgl }) {
    super();

    this.parent = parent;
    this.template = null;
    this.html = html ?? null;
    this.created = false;

    this.webgl = webgl ?? null;

    this.animas = [];
    this.visible = false;
    this.create();
  }

  // Collect dom elements that need anima
  create() {
    if (this.html) {
      this.template = this.html;
    }
    if (this.template) {
      this.parent.insertAdjacentHTML("beforeend", this.template);
      this.html = this.parent.lastElementChild;
      this.html.style.display = "none";
    }
  }

  // Goes through each element and adds anima
  createAnimas() {}

  // scroll triggers initiated here
  loadScroll() {}

  // Returns a promise
  show() {
    if (this.template) {
      this.visible = true;
      this.html.style.display = "block";
    } else {
      return;
    }

    return Promise.resolve();
  }

  // Hides page, returns a promise
  hide() {
    this.animas.forEach((a) => {
      a.out();
    });

    this.parent.innerHTML = "";
    this.visible = false;

    return Promise.resolve();
  }

  // todo resize listener
}
