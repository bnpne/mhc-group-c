import "./styles/index.scss";

import Allez from "./components/Allez";
import RAF from "./components/RAF";
import Canvas from "./components/Canvas";
import Preloader from "./components/Preloader";

import { STATE } from "./lib";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

class App {
  constructor() {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("easeOutQuint", "0.22, 1, 0.36, 1");
    CustomEase.create("easeOutCubic", "0.33, 1, 0.68, 1");
    // Objects
    STATE.textures = [];
    STATE.rock = null;
    STATE.rockGroup = null;
    STATE.pages = {};
    STATE.path = window.location.pathname;
    STATE.currentPage = null;
    STATE.scene = null;
    STATE.viewport = null;
    STATE.screen = null;
    STATE.raf = null;
    STATE.timeline = gsap.timeline();
    STATE.timeline.autoRemoveChildren = true;
    STATE.loader = null;
    STATE.nav = null;

    // Dispatch
    STATE.addTexture = function (data) {
      this.textures.push(data);
    };
    STATE.addPages = function (data) {
      this.pages[data[0]] = data[1];
    };
    STATE.updateCurrentPage = function () {
      this.currentPage = this.pages[this.path];
    };
    STATE.updatePath = function (data) {
      this.path = data;
    };
    STATE.addRock = function (data) {
      this.rock = data;
    };
    STATE.addRockGroup = function (data) {
      this.rockGroup = data;
    };
    STATE.updateViewport = function (data) {
      this.viewport = data;
    };
    STATE.updateScreen = function (data) {
      this.screen = data;
    };
    STATE.updateRAF = function (data) {
      this.raf = data;
    };
    STATE.addLoader = function (data) {
      this.loader = data;
    };
    STATE.addNav = function (data) {
      this.nav = data;
    };

    // entry point for pages
    this.app = document.querySelector("#app");
    this.pagesParent = document.querySelector("#main");

    // Main Thread
    let raf = new RAF();
    STATE.dispatch("updateRAF", [raf]);

    const r = document.querySelector("#r");
    this.canvas = new Canvas({ el: r });

    const preloadEl = document.querySelector("[data-preloader]");
    STATE.dispatch("addLoader", [preloadEl.querySelector(".loader")]);
    this.preloader = new Preloader({
      el: preloadEl,
      pagesParent: this.pagesParent,
    });

    this.load();
  }

  load() {
    this.preloader.on("completed", () => {
      // Get home page and show
      STATE.dispatch("updateCurrentPage");
      STATE.currentPage.show();
      this.init();
    });
  }

  init() {
    STATE.allez = new Allez();

    //scroll triggers and actions
    STATE.currentPage.loadScroll();
    this.resize();
    this.listeners();
    this.linkListeners();
    this.preloader.destroy();
  }

  async route() {
    if (this.fetching) return;

    this.fetching = true;

    await STATE.currentPage.hide();

    window.history.pushState({}, document.title, STATE.path);

    STATE.dispatch("updateCurrentPage");

    await STATE.currentPage.show();
    STATE.currentPage.loadScroll();
    this.resize();
    this.listeners();
    this.linkListeners();

    this.fetching = false;
  }

  resize() {
    this.canvas && this.canvas.resize();
    STATE.pages && STATE.currentPage.resize();
    STATE.allez && STATE.allez.checkResize();
  }

  listeners() {
    window.addEventListener("resize", this.resize.bind(this), {
      passive: true,
    });
    window.addEventListener("popstate", this.route.bind(this), {
      passive: true,
    });
  }

  linkListeners() {
    const links = document.querySelectorAll("a");

    links.forEach((l) => {
      const local = l.href.indexOf(window.location.origin) > -1;

      if (local) {
        l.onclick = (e) => {
          e.preventDefault();

          if (l.pathname !== STATE.path) {
            STATE.dispatch("updatePath", [l.pathname]);
            this.route();
          }
        };
      } else if (
        l.href.indexOf("mailto") === -1 &&
        l.href.indexOf("tel") === -1
      ) {
        l.rel = "noopener";
        l.target = "_blank";
      }
    });
  }

  loop() {
    if (this.canvas) this.canvas.loop();
  }
}

new App();
