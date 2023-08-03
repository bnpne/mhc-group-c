import * as THREE from "three";
import vertexShader from "../../utils/shaders/vertex.glsl";
import fragmentShader from "../../utils/shaders/fragment.glsl";
import { STATE } from "../../lib";

export default class Canvas {
  constructor({ el }) {
    this.el = el;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.el,
      antialias: true,
      alpha: true,
    });
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.scene = new THREE.Scene();
    // Load scene into state
    STATE.scene = this.scene;
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.screen.width / this.screen.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);
    this.raycaster = new THREE.Raycaster();
    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        resolution: { value: new THREE.Vector4() },
        tex: { value: 0 },
      },
      transparent: true,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    });

    this.resize();
  }

  resize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    STATE.dispatch("updateScreen", [this.screen]);
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height: height,
      width: width,
    };
    STATE.dispatch("updateViewport", [this.viewport]);

    // this.scrollLimit = getScrollLimitHeight(
    //   n,
    //   250 / 175,
    //   this.viewport.width,
    //   0.05
    // );
  }

  loop() {
    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
