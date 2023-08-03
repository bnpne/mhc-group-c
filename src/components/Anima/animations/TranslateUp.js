import Anima from "..";

export default class TranslateUp extends Anima {
  constructor({ el }) {
    super({ parent: el });
  }

  in() {
    super.in();

    this.el.style.transition = `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)`;
    this.el.style.transform = `translate3d(0, 0, 0)`;
  }

  out() {
    super.out();

    this.el.style.transform = `translate3d(0, 15%, 0)`;
  }
}
