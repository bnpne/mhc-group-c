// One RAF to Rule Them All
import Emitter from "../../utils/emitter";
import { EventEmitter } from "events";

export default class RAF extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.loop();
  }

  loop() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.emit("loop");

    window.requestAnimationFrame(() => this.loop());
  }
}
