import Words from "../../components/Anima/animations/Words";

export default class Nav {
  constructor({ parent, html }) {
    this.parent = parent;
    this.html = html ?? null;

    this.create();
    // this.createAnima();
  }

  create() {
    if (this.html) {
      this.template = this.html;
    }
    if (this.template) {
      this.parent.insertAdjacentHTML("afterbegin", this.template);
      this.html = this.parent.firstElementChild;
    }
  }

  createAnima() {
    return new Words({ el: this.nav, delay: 0.45 });
  }
}
