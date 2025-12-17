// --- 1. GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

// Navbar entrance
gsap.from(".navbar", {
    y: -100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});

// Hero Text Reveal
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.from(".hero-title .line", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    delay: 0.5
})
.from(".hero-subtitle", {
    y: 20,
    opacity: 0,
    duration: 0.8
}, "-=0.5")
.from(".cta-button", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5
}, "-=0.3");

// Menu Cards Stagger on Scroll
gsap.utils.toArray(".menu-card").forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1
    });
});

// --- 2. THREE.JS SCENE (THE 3D CUP) ---

const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 0;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent background
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xcaba94, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const rimLight = new THREE.SpotLight(0xd9534f, 2);
rimLight.position.set(-5, 5, -5);
scene.add(rimLight);

// --- Procedural Coffee Cup Group ---
const cupGroup = new THREE.Group();

// 1. Cup Body (Cylinder)
const cupGeometry = new THREE.CylinderGeometry(1.2, 0.9, 2.5, 32);
const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222, // Dark ceramic
    roughness: 0.2,
    metalness: 0.1
});
const cup = new THREE.Mesh(cupGeometry, cupMaterial);
cupGroup.add(cup);

// 2. Coffee Liquid (Circle on top)
const liquidGeometry = new THREE.CircleGeometry(1.1, 32);
const liquidMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e2723, // Coffee color
    roughness: 0.2,
    metalness: 0.0
});
const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
liquid.rotation.x = -Math.PI / 2;
liquid.position.y = 1.1; // Slightly below rim
cupGroup.add(liquid);

// 3. Handle (Torus)
const handleGeometry = new THREE.TorusGeometry(0.6, 0.15, 16, 32, Math.PI);
const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.2
});
const handle = new THREE.Mesh(handleGeometry, handleMaterial);
handle.position.set(0.9, 0, 0);
handle.rotation.z = -Math.PI / 2;
cupGroup.add(handle);

// Position the whole group to the right side of the screen
cupGroup.position.x = 2; // Right side
cupGroup.rotation.x = 0.2; // Tilt slightly towards camera
cupGroup.rotation.y = -0.5;

scene.add(cupGroup);

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Floating animation
    cupGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.1; 
    
    // Gentle rotation
    cupGroup.rotation.y = -0.5 + (Math.sin(elapsedTime * 0.3) * 0.1);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// --- Responsive Adjustments ---
window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Move cup on mobile
    if(window.innerWidth < 768) {
        cupGroup.position.x = 0;
        cupGroup.position.y = -1; // Lower it
        cupGroup.scale.set(0.8, 0.8, 0.8);
    } else {
        cupGroup.position.x = 2;
        cupGroup.scale.set(1, 1, 1);
    }
});

// Initial check for mobile
if(window.innerWidth < 768) {
    cupGroup.position.x = 0;
    cupGroup.position.y = -1;
    cupGroup.scale.set(0.8, 0.8, 0.8);
}

// --- Scroll Interaction (Parallax) ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Rotate cup based on scroll
    cupGroup.rotation.z = scrollY * 0.0005;
    cupGroup.position.y = (Math.sin(clock.getElapsedTime()) * 0.1) - (scrollY * 0.002);
});