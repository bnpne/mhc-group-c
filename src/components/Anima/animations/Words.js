import Anima from "..";

// COOL LITTLE EFFECT THAT MAKES YOUR WORDS FLY UP HAHA
export default class Words extends Anima {
  constructor({ el, delay, duration, distance, stagger }) {
    let lines = el.querySelectorAll("[data-word]");
    super({ parent: el, elToAnimate: lines });

    this.delay = delay ? delay : 0;
    this.duration = duration ? duration : 1;
    this.distance = distance ? distance : 110;
    this.stagger = stagger ? stagger : null;

    if ("IntersectionObserver" in window) {
      this.out();
    }
  }

  in() {
    super.in();

    this.els.forEach((line, index) => {
      line.style.transition = `transform 
      ${this.duration}s 
      ${this.stagger !== null ? this.stagger * index : this.delay}s 
        cubic-bezier(0.16, 1, 0.3, 1)`;

      line.style.transform = `translate3d(0, 0, 0)`;
    });
  }

  out() {
    super.out();

    this.els.forEach((line, index) => {
      line.style.transform = `translate3d(0, ${this.distance}%, 0)`;
    });
  }
}
