/* ===================================================
   HIMANSHU GUPTA – AESTHETIC TECHIE MAIN JS
   =================================================== */

gsap.registerPlugin(ScrollTrigger);

// ─── DOM References ───────────────────────────────
const loader       = document.getElementById('loader');
const cursorGlow   = document.getElementById('cursor-glow');
const typewriterEl = document.getElementById('typewriter');
const statusPerc   = document.querySelector('.status-perc');

// ─── Loader Percentage ────────────────────────────
let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.floor(Math.random() * 20) + 10;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      // Splash scene handles the rest
    }, 400);
  }
  statusPerc.textContent = `${loadProgress}%`;
}, 80);

// ─── Typewriter Strings ───────────────────────────
const phrases = [
  'FULL_STACK_ENGINEER',
  'REACT_NODE_ARCHITECT',
  'SYSTEMS_INTEGRATOR',
  'DATA_DRIVEN_DEV'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeWrite() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typewriterEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWrite, 2000);
      return;
    }
  } else {
    typewriterEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWrite, deleting ? 40 : 80);
}

// ─── Custom Cursor Glow & Global Mouse ────────────
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let targetX = mouseX, targetY = mouseY;
let glowX = mouseX, glowY = mouseY;
let hoveredEl = null;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!hoveredEl) {
    targetX = mouseX;
    targetY = mouseY;
  }
});

const hoverSelectors = 'a, button, .bento-hover, .hud-link, .sys-badge';
let hoveredStack = [];

function updateCursorHover() {
  if (hoveredStack.length > 0) {
    hoveredEl = hoveredStack[hoveredStack.length - 1];
    cursorGlow.classList.add('hover_active');
    const rect = hoveredEl.getBoundingClientRect();
    cursorGlow.style.width = (rect.width + 16) + 'px';
    cursorGlow.style.height = (rect.height + 16) + 'px';
  } else {
    hoveredEl = null;
    cursorGlow.classList.remove('hover_active');
    cursorGlow.style.width = ''; 
    cursorGlow.style.height = '';
  }
}

document.querySelectorAll(hoverSelectors).forEach(el => {
  el.addEventListener('mouseenter', () => {
    hoveredStack.push(el);
    updateCursorHover();
  });
  el.addEventListener('mouseleave', () => {
    hoveredStack = hoveredStack.filter(item => item !== el);
    updateCursorHover();
  });
});

function animateCursor() {
  if (hoveredEl) {
    const rect = hoveredEl.getBoundingClientRect();
    targetX = rect.left + rect.width / 2;
    targetY = rect.top + rect.height / 2;
  } else {
    targetX = mouseX;
    targetY = mouseY;
  }
  
  glowX += (targetX - glowX) * 0.15;
  glowY += (targetY - glowY) * 0.15;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ─── Bento Box Mouse Tracking & 3D Tilt ───────────
document.querySelectorAll('.bento-hover').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    // 3D Tilt Effect for Project Cards
    if (card.classList.contains('project-widescreen')) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // Max rotation 4deg
      const rotateY = ((x - centerX) / centerX) * 4;
      
      card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });
  
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('project-widescreen')) {
      card.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
    }
  });
});

// ─── Smooth scroll for anchors ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── Stats progress circle ────────────────────────
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      const numEl = entry.target.querySelector('.stat-num');
      if (numEl) {
        const target = parseInt(numEl.dataset.target);
        let curr = 0;
        const inc = Math.ceil(target / 40);
        const t = setInterval(() => {
          curr = Math.min(curr + inc, target);
          numEl.textContent = curr;
          if (curr >= target) clearInterval(t);
        }, 40);
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBentos = document.querySelectorAll('.stats-bento');
statsBentos.forEach(bento => statsObserver.observe(bento));

// ─────────────────────────────────────────────────
//   GSAP ANIMATIONS
// ─────────────────────────────────────────────────
function triggerHeroAnimations() {
  gsap.fromTo('.hero-content .reveal-elem', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', onComplete: typeWrite }
  );
  gsap.fromTo('#hero-3d-wrapper',
    { scale: 0.95, opacity: 0, filter: 'blur(10px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out', delay: 0.3 }
  );
}

// Global reveals
gsap.utils.toArray('section:not(.hero-section)').forEach(sec => {
  const elems = sec.querySelectorAll('.reveal-elem');
  gsap.fromTo(elems,
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 75%' }
    }
  );
});

// ─────────────────────────────────────────────────
//   THREE.JS — CINEMATIC SPLASH SCREEN
// ─────────────────────────────────────────────────
(function initSplashScene() {
  const wrapper = document.getElementById('splash-wrapper');
  const canvas = document.getElementById('splash-canvas');
  if(!wrapper || !canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030303, 0.05);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 20;

  const group = new THREE.Group();
  scene.add(group);

  // Generate abstract overlapping architectural/horological wireframes
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
  
  for(let i=0; i<8; i++) {
    const geo = new THREE.BoxGeometry(
      Math.random() * 8 + 4,
      Math.random() * 8 + 4,
      Math.random() * 8 + 4
    );
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, material);
    line.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(line);
  }

  // A large central complex geometric ring
  const ringGeo = new THREE.TorusGeometry(8, 2, 4, 24);
  const ringEdges = new THREE.EdgesGeometry(ringGeo);
  const ringLine = new THREE.LineSegments(ringEdges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 }));
  group.add(ringLine);

  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let time = 0;
  let isEntering = false;
  let zoomSpeed = 0;

  function animateSplash() {
    if(!isEntering) requestAnimationFrame(animateSplash);
    time += 0.002;

    group.rotation.y = time + targetX * 0.2;
    group.rotation.x = time * 0.8 + targetY * 0.2;
    
    // Smooth idle breathing
    camera.position.z = 20 + Math.sin(time * 5) * 1.5;

    renderer.render(scene, camera);
  }
  animateSplash();

  // Handle the Click Event
  wrapper.addEventListener('click', () => {
    if(isEntering) return;
    isEntering = true;

    // Fast hyperspace/warp zoom animation
    gsap.to(camera.position, {
      z: -10,
      duration: 1.2,
      ease: 'power3.in'
    });
    
    // Spin rapidly
    gsap.to(group.rotation, {
      y: group.rotation.y + Math.PI,
      duration: 1.2,
      ease: 'power2.in'
    });

    // Fade out splash wrapper HTML natively
    wrapper.classList.add('fade-out');

    // Reveal main content and scroll
    setTimeout(() => {
      document.getElementById('content-wrapper').classList.add('active');
      triggerHeroAnimations();
      
      // Force scroll to absolute top, clear any hash offsets
      history.replaceState(null, null, window.location.pathname);
      window.scrollTo(0, 0);

      // Give ScrollTrigger a moment to recalculate offsets without scrolling away
      setTimeout(() => {
        ScrollTrigger.refresh();
        window.scrollTo(0, 0);
      }, 50);

      // Stop renderer entirely since it's hidden now
      renderer.dispose();
      wrapper.style.display = 'none';
    }, 1200);
  });
})();

// ─────────────────────────────────────────────────
//   THREE.JS — NEURAL DATA CORE & BACKGROUND
// ─────────────────────────────────────────────────

// 1. Background Particle Field
(function initBgScene() {
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  // Add a very faint fog to blend particles into the distance
  scene.fog = new THREE.FogExp2(0x000000, 0.002);
  
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 200);

  // Less particles, subtle white/green dust
  const COUNT = 800;
  const pos = new Float32Array(COUNT * 3);
  for(let i=0; i<COUNT; i++) {
    pos[i*3] = (Math.random() - 0.5) * 800;
    pos[i*3+1] = (Math.random() - 0.5) * 800;
    pos[i*3+2] = (Math.random() - 0.5) * 800;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.15,
    depthWrite: false
  });
  
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Parallax mapped to global mouseX/Y
  let targetRotX = 0, targetRotY = 0;
  let currRotX = 0, currRotY = 0;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animateBg() {
    requestAnimationFrame(animateBg);
    
    // Calculate global normalize mouse
    targetRotY = (mouseX / window.innerWidth - 0.5) * 0.5;
    targetRotX = (mouseY / window.innerHeight - 0.5) * 0.5;

    currRotX += (targetRotX - currRotX) * 0.02;
    currRotY += (targetRotY - currRotY) * 0.02;

    particles.rotation.x = currRotX;
    particles.rotation.y = currRotY;
    particles.position.y += 0.05;
    if(particles.position.y > 200) particles.position.y = -200;

    renderer.render(scene, camera);
  }
  animateBg();
})();

// 2. Hero 3D Neural Core
(function initHeroCore() {
  const wrapper = document.getElementById('hero-3d-wrapper');
  if(!wrapper) return;

  const w = wrapper.clientWidth || 500;
  const h = wrapper.clientHeight || 500;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  wrapper.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 12;

  const group = new THREE.Group();
  scene.add(group);

  // --- Core Geometries ---
  // A dark interconnected lattice sphere
  const icoGeo = new THREE.IcosahedronGeometry(3.5, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const coreLattice = new THREE.Mesh(icoGeo, wireMat);
  group.add(coreLattice);

  // Solid dark inner core
  const solidGeo = new THREE.IcosahedronGeometry(3.4, 3);
  const solidMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const solidCore = new THREE.Mesh(solidGeo, solidMat);
  group.add(solidCore);

  // Floating data points (particles around core)
  const pCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for(let i=0; i<pCount; i++) {
    // Random point on sphere surface + noise
    const r = 3.6 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i*3+2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x94a3b8,
    size: 0.08,
    transparent: true,
    opacity: 0.8
  });
  const dataPoints = new THREE.Points(pGeo, pMat);
  group.add(dataPoints);

  // Outer orbital rings
  const ringGeo1 = new THREE.TorusGeometry(5, 0.01, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat);
  ring1.rotation.x = Math.PI/2 - 0.2;
  group.add(ring1);
  
  const ringGeo2 = new THREE.TorusGeometry(6.5, 0.01, 8, 100);
  const ring2 = new THREE.Mesh(ringGeo2, ringMat);
  ring2.rotation.y = Math.PI/2 - 0.3;
  group.add(ring2);

  // Interaction vars local to wrapper
  let tX = 0, tY = 0;
  let cX = 0, cY = 0;

  wrapper.addEventListener('mousemove', e => {
    const rect = wrapper.getBoundingClientRect();
    tX = ((e.clientX - rect.left) / w - 0.5) * 2;
    tY = ((e.clientY - rect.top) / h - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    const nw = wrapper.clientWidth;
    const nh = wrapper.clientHeight;
    renderer.setSize(nw, nh);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  });

  // --- NATIVE 3D TEXT PLANES ---
  const skillsList = ['C++', 'C', 'Java', 'Python', 'JavaScript', 'PHP', 'React.js', 'Node.js', 'Express', 'Tailwind', 'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'GitHub', 'XAMPP', 'Postman', 'Figma', 'Socket.io', 'Firebase', 'Gemini API'];
  
  function createTextPlane(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = "bold 56px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Slight intense glow
    ctx.shadowColor = "rgba(148, 163, 184, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fillText(text, 256, 64);
    
    const tex = new THREE.CanvasTexture(canvas);
    // Use DoubleSide so they're visible from inside the globe too
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false });
    // Keep aspect ratio 4:1 (512:128)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), mat);
    return mesh;
  }

  // Fill the globe heavily: 45 labels
  const totalLabels = 45;
  for(let i=0; i<totalLabels; i++) {
    const skill = skillsList[Math.floor(Math.random() * skillsList.length)];
    const plane = createTextPlane(skill);
    
    // Distribute evenly on a sphere slightly larger than the solid core but smaller than the wireframe
    // Core is 3.4, Wireframe is 3.5. Let's place text at 3.45.
    const r = 3.46;
    const phi = Math.acos( -1 + ( 2 * i ) / totalLabels );
    const theta = Math.sqrt( totalLabels * Math.PI ) * phi;
    
    plane.position.set(
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi)
    );
    
    // Make the plane lie perfectly flat against the spherical hull
    // by making it look at the origin (0,0,0), then flipping it to face outward
    plane.lookAt(0, 0, 0);
    plane.rotateY(Math.PI); // Flipped 180 deg to prevent mirrored text
    // Randomize slight rotation so they aren't all perfectly aligned like latitude lines
    plane.rotateZ(Math.random() * 0.5 - 0.25);
    
    // Attach directly to the coreLattice so it perfectly spins and pulses with the wireframe lines
    coreLattice.add(plane);
  }

  let time = 0;
  function animateCore() {
    requestAnimationFrame(animateCore);
    time += 0.005;

    cX += (tX - cX) * 0.05;
    cY += (tY - cY) * 0.05;

    // Gentle constant rotation + mouse interactivity
    group.rotation.y = time + (cX * 0.5);
    group.rotation.x = (Math.sin(time*0.5) * 0.2) + (cY * 0.5);

    // Pulse core lattice
    const scalePulse = 1 + Math.sin(time * 3) * 0.02;
    coreLattice.scale.set(scalePulse, scalePulse, scalePulse);

    // Rotate rings independently
    ring1.rotation.z -= 0.01;
    ring2.rotation.z += 0.008;

    renderer.render(scene, camera);
  }
  animateCore();
})();
