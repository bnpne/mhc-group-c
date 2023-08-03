import * as THREE from "three";

import TranslateUp from "../../components/Anima/animations/TranslateUp";
import Words from "../../components/Anima/animations/Words";
import Page from "../../components/Page";

import { STATE } from "../../lib";
import piezo from "../../components/Piezo";

import fragmentShader from "../../utils/shaders/fragment.glsl";
import vertexShader from "../../utils/shaders/vertex.glsl";

export default class Home extends Page {
  constructor({ parent, html }) {
    super({ parent, html });

    this.loaded = false;
  }

  create() {
    super.create();
    this.webglMedia = [];
    this.webgl = document.querySelectorAll(".h .img");
    this.loadGl();
  }

  loadGl() {
    this.webgl &&
      this.webgl.forEach((m, i) => {
        const plane = new THREE.PlaneGeometry(1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x151515 });
        const material = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color("white") },
            grayscale: { value: 0 },
            zoom: { value: 1 },
            opacity: { value: 1 },
            tex: { value: STATE.textures[0] },
            scale: { value: new THREE.Vector2(1, 1) },
            imageBounds: {
              value: new THREE.Vector2(
                STATE.textures[0].source.data.naturalWidth,
                STATE.textures[0].source.data.naturalHeight
              ),
            },
          },
          transparent: true,
          fragmentShader: fragmentShader,
          vertexShader: vertexShader,
        });

        const mesh = new THREE.Mesh(plane, material);

        this.webglMedia.push(mesh);
        this.webglMedia[i].newPos = { x: 0, y: 0 };

        STATE.scene.add(mesh);
      });
  }

  show() {
    super.show();
    if (this.webglMedia[0].position.y === 0) this.resize();

    if (this.visible) {
      this.webglMedia &&
        this.webglMedia.forEach((m, i) => {
          // STATE.timeline.to(
          //   m.material.uniforms.opacity,
          //   {
          //     value: 1,
          //     duration: 0.7,
          //     ease: "easeOutQuint",
          //   },
          //   `${i === 0 ? "endPreload" : ">-=90%"}`
          // );
          STATE.timeline.to(
            m.position,
            {
              y: 0,
              duration: 0.7,
              ease: "easeOutQuint",
            },
            `${i === 0 ? "endPreload" : ">-=90%"}`
          );
        });
      STATE.timeline.addLabel("endHomeOne");
      this.webglMedia &&
        this.webglMedia.forEach((m, i) => {
          STATE.timeline.to(
            m.position,
            {
              y: m.newPos.y,
              duration: 0.7,
              ease: "easeOutQuint",
              onComplete: () => {
                this.loaded = true;
              },
            },
            `endHomeOne`
          );
        });
    }
  }

  hide() {
    super.hide();
  }

  resize() {
    if (this.webgl && this.webglMedia) {
      this.webglMedia.forEach((m, i) => {
        const bounds = this.webgl[i].getBoundingClientRect();
        const width =
          (STATE.viewport.width * bounds.width) / STATE.screen.width;
        const height =
          (STATE.viewport.height * bounds.height) / STATE.screen.height;

        m.scale.set(width, height);
        m.material.uniforms.scale.value.x = width;
        m.material.uniforms.scale.value.y = height;

        const x =
          -(STATE.viewport.width / 2) +
          width / 2 +
          (bounds.left / STATE.screen.width) * STATE.viewport.width;
        const y =
          STATE.viewport.height / 2 -
          height / 2 -
          (bounds.top / STATE.screen.height) * STATE.viewport.height;

        m.newPos.x = x;
        m.newPos.y = y;

        if (!this.loaded) {
          m.position.set(x, (STATE.viewport.height / 2) * 2, 0);
        } else {
          m.position.set(x, y, 0);
        }
      });
    }
  }

  createAnimas() {
    if (this.heroText) {
      return (
        new Words({
          el: this.heroText,
          stagger: 0.08,
          distance: 110,
          duration: 1,
        }),
        new TranslateUp({ el: this.heroText })
      );
    }
  }
}
