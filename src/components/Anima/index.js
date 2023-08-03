export default class Animation {
  constructor({ parent, elToAnimate }) {
    this.visible = false;
    this.el = parent;
    this.els = elToAnimate;
    this.target = parent;

    if ("IntersectionObserver" in window) {
      if (this.target) {
        this.createObserver();

        this.out();
      }
    } else {
      this.in();
    }
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!this.visible && e.isIntersecting) {
          this.in();
        }
      });
    }).observe(this.target);
  }

  in() {
    this.visible = true;
  }

  out() {
    this.visible = false;
  }
}
