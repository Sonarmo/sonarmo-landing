import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

let scene, camera, renderer, mesh, clock;

init();
animate();

function init() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 2.2;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(3.2, 0.4, 256, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // 💫 Ondulation complexe
        pos.y += sin(pos.x * 4.0 + uTime * 1.5) * 0.18;
        pos.y += sin(pos.x * 10.0 + uTime * 5.0) * 0.05;
        pos.y += sin(uTime * 0.3) * 0.05; // Pulsation

        // 🔀 Distorsion X
        pos.x += sin(pos.y * 5.0 + uTime * 0.8) * 0.02;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        // 🌈 Couleur animée
        float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
        vec3 color = mix(vec3(1.0, 0.4 + 0.2 * pulse, 0.0), vec3(1.0, 0.0, 1.0), vUv.x);

        // 🌫️ Opacité douce verticale
        float alpha = 0.5;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      uTime: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);
  mesh.material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}