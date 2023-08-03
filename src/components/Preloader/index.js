import { STATE } from "../../lib";
import Emitter from "../../utils/emitter";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import Home from "../../pages/Home";
import homeHtml from "../../pages/Home/index.html";

import Nav from "../../pages/Nav";
import navHtml from "../../pages/Nav/index.html";

import gsap from "gsap";

export default class Preloader extends Emitter {
  constructor({ el, pagesParent }) {
    super();

    this.preloader = el;
    this.pageParent = pagesParent;

    this.load();
  }

  async load() {
    // load this bitch
    let pageList = [
      { path: "/", component: Home, html: homeHtml },
      { path: null, component: Nav, html: navHtml },
    ];

    await this.loadPage(pageList).then(() => {
      this.loaded();
    });
  }

  loadPage(pageList) {
    return new Promise((resolve) => {
      for (const page of pageList) {
        if (page.path) {
          let p = new page.component({
            html: page.html,
            parent: this.pageParent,
          });
          STATE.dispatch("addPages", [[page.path, p]]);
        } else {
          let n = new page.component({
            html: page.html,
            parent: this.pageParent,
          });
          STATE.dispatch("addNav", [n]);
        }
      }
      resolve();
    });
  }

  loadTexture(el) {
    const l = new THREE.TextureLoader();

    return new Promise((resolve, reject) => {
      l.load(
        el,
        function (tex) {
          gsap.to(STATE.loader, {
            width: "50%",
          });
          resolve(tex);
        },
        undefined,
        function (err) {
          reject(err);
        }
      );
    });
  }

  loadGLTF() {
    const gltfLoader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      gltfLoader.load(
        "/model/r5.glb",
        function (glb) {
          resolve(glb);
        },
        undefined,
        function (err) {
          console.log("error");
        }
      );
    });
  }

  loaded() {
    this.emit("completed");
  }

  destroy() {}
}
