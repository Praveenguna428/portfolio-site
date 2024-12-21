const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let particleCount = calculateParticleCount();

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.fadeDelay = Math.random() * 600 + 100;
        this.fadeStart = Date.now() + this.fadeDelay;
        this.fadingOut = false;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() / 5 + 0.1;
        this.opacity = 1;
        this.fadeDelay = Math.random() * 600 + 100;
        this.fadeStart = Date.now() + this.fadeDelay;
        this.fadingOut = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.reset();
        }

        if (!this.fadingOut && Date.now() > this.fadeStart) {
            this.fadingOut = true;
        }
        
        if (this.fadingOut) {
            this.opacity -= 0.008;
            if (this.opacity <= 0) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.fillStyle = `rgba(${255 - (Math.random() * 255/2)}, 255, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1);
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

function calculateParticleCount() {
    return Math.floor((canvas.width * canvas.height) / 6000);
}

function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCount = calculateParticleCount();
    initParticles();
}

window.addEventListener('resize', onResize);

initParticles();
animate();

let menuBtn = document.querySelector("#menuBtn");
let curs = document.querySelector(".cursor");
let menuItems = document.querySelectorAll(".menu-item");
let mainText = document.querySelector(".mainText");

document.addEventListener("mousemove", (e) => {
  let x = e.pageX;
  let y = e.pageY;
  curs.style.left = x - 15 + "px";
  curs.style.top = y - 15 + "px";
});

// show hide menu animation
let flag = true;
menuBtn.addEventListener("click", () => {
  flag = !flag;

  if (!flag) {
    gsap.to(".straight-line", {
      width: 700,
      duration: 0.3
    });
    gsap.to(".menu", {
      display: "block",
      duration: 0.3
    });
  } else {
    gsap.to(".straight-line", {
      width: 0,
      duration: 0.2
    });
    gsap.to(".menu", {
      display: "none",
      duration: 0.2
    });
  }
});

// menu item click animation and changing maim title

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    curs.classList.add("explosion");
    setTimeout(function () {
      curs.classList.remove("explosion");
    }, 900);
  });
});

// Taken from https://codepen.io/enesser/pen/jdenE

function main() {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  let webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  document.querySelector("#WebGL-output").append(webGLRenderer.domElement);

  let step = 0;

  let knot;

  let controls = new (function () {
    this.radius = 40;
    this.tube = 17;
    this.radialSegments = 186;
    this.tubularSegments = 4;
    this.p = 9;
    this.q = 1;
    this.heightScale = 4;
    this.asParticles = true;
    this.rotate = true;

    this.redraw = function () {
      if (knot) scene.remove(knot);

      let geom = new THREE.TorusKnotGeometry(
        controls.radius,
        controls.tube,
        Math.round(controls.radialSegments),
        Math.round(controls.tubularSegments),
        Math.round(controls.p),
        Math.round(controls.q),
        controls.heightScale
      );

      if (controls.asParticles) {
        knot = createParticleSystem(geom);
      } else {
        knot = createMesh(geom);
      }

      scene.add(knot);
    };
  })();

  let gui = new dat.GUI();
  gui.add(controls, "radius", 0, 40).onChange(controls.redraw);
  gui.add(controls, "tube", 0, 40).onChange(controls.redraw);
  gui.add(controls, "radialSegments", 0, 400).step(1).onChange(controls.redraw);
  gui.add(controls, "tubularSegments", 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, "p", 1, 10).step(1).onChange(controls.redraw);
  gui.add(controls, "q", 1, 15).step(1).onChange(controls.redraw);
  gui.add(controls, "heightScale", 0, 5).onChange(controls.redraw);
  gui.add(controls, "asParticles").onChange(controls.redraw);
  gui.add(controls, "rotate").onChange(controls.redraw);

  gui.close();

  controls.redraw();

  render();

  function generateSprite() {
    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;

    let context = canvas.getContext("2d");
    let gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(0,255,255,1)");
    gradient.addColorStop(0.4, "rgba(0,0,64,1)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function createParticleSystem(geom) {
    let material = new THREE.ParticleBasicMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      map: generateSprite()
    });

    let system = new THREE.ParticleSystem(geom, material);
    system.sortParticles = true;
    return system;
  }

  function createMesh(geom) {
    let meshMaterial = new THREE.MeshNormalMaterial({});
    meshMaterial.side = THREE.DoubleSide;

    let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

    return mesh;
  }

  function render() {
    if (controls.rotate) {
      knot.rotation.y = step += 0.00058;
    }

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}
main();
