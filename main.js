// --- THREE.JS SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0a1a, 100, 200);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

camera.position.set(0, 8, 40);
camera.lookAt(0, 5, 0);

// --- DATA CENTER ENVIRONMENT ---
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.6, roughness: 0.3 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 200), floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.5, roughness: 0.2 });
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(30, 200), ceilingMaterial);
ceiling.position.y = 20;
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

// --- Device Creation Functions & Materials ---
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.4, metalness: 0.3 });
const heroMaterial = new THREE.MeshStandardMaterial({ color: 0x1e40af, emissive: 0x38bdf8, emissiveIntensity: 3, toneMapped: false });
const lightMaterial = new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 2, toneMapped: false });

function createServerRack(isHero = false) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(8, 18, 5);
    const frame = new THREE.Mesh(frameGeo, baseMaterial);
    group.add(frame);
    
    for (let i = 0; i < 12; i++) {
        const bladeGeo = new THREE.BoxGeometry(7.5, 1.2, 4.8);
        const blade = new THREE.Mesh(bladeGeo, isHero ? heroMaterial.clone() : baseMaterial.clone());
        blade.position.y = 8 - i * 1.4;
        group.add(blade);
        
        if (Math.random() > 0.3) {
            const led = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 8), lightMaterial);
            led.position.set(-3.5, blade.position.y, 2.55);
            led.rotation.x = Math.PI / 2;
            group.add(led);
        }
    }
    
    if (isHero) {
        const heroLight = new THREE.PointLight(0x38bdf8, 10, 20);
        heroLight.position.y = 8;
        group.add(heroLight);
        group.userData.heroLight = heroLight;
    }
    
    return group;
}

// --- PLACING RACKS IN THE SCENE ---
const sections = ["about", "experience", "projects", "skills", "contact"];
const heroRackPositions = [-10, -50, -90, -130, -170];
const heroRacks = [];

for (let i = 0; i < 20; i++) {
    const zPos = -i * 10;
    const isHero = heroRackPositions.includes(zPos);

    const rackLeft = createServerRack(isHero);
    rackLeft.position.set(-12, 9, zPos);
    scene.add(rackLeft);

    const rackRight = createServerRack(false);
    rackRight.position.set(12, 9, zPos);
    scene.add(rackRight);

    if(isHero) {
        const sectionIndex = heroRackPositions.indexOf(zPos);
        rackLeft.userData = { id: sectionIndex, name: sections[sectionIndex], isHero: true };
        heroRacks.push(rackLeft);
        
        // Add a floating label above hero racks
        const labelGeometry = new THREE.PlaneGeometry(6, 1);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x38bdf8, 
            transparent: true, 
            opacity: 0.8 
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(-12, 20, zPos);
        label.lookAt(camera.position);
        scene.add(label);
    }
}

// --- LIGHTING SETUP ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x0a0a1a, 3);
scene.add(hemisphereLight);

// Add more ceiling lights for better visibility
for (let i = 0; i < 25; i++) {
    const light = new THREE.PointLight(0xffffff, 4, 30);
    light.position.set(0, 18, -i * 8 + 20);
    scene.add(light);
}

// Add side lighting for better rack visibility
for (let i = 0; i < 20; i++) {
    const leftLight = new THREE.PointLight(0xadd8e6, 3, 25);
    leftLight.position.set(-15, 12, -i * 10 + 10);
    scene.add(leftLight);
    
    const rightLight = new THREE.PointLight(0xadd8e6, 3, 25);
    rightLight.position.set(15, 12, -i * 10 + 10);
    scene.add(rightLight);
}

const cameraLight = new THREE.PointLight(0xffffff, 1.5, 80);
camera.add(cameraLight);
scene.add(camera);

// --- GSAP SCROLL & CLICK ANIMATION ---
let currentZoomAnimation;

gsap.to(camera.position, {
    z: -180,
    scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
    }
});

function navigateToNode(targetNode) {
    const targetPosition = targetNode.position.clone();
    
    // First, move down the aisle to the rack's Z position
    const aislePosition = new THREE.Vector3(0, 8, targetPosition.z);
    
    // Then, turn toward the rack (move to the side)
    const finalPosition = new THREE.Vector3(targetPosition.x + 12, targetPosition.y, targetPosition.z);

    if (currentZoomAnimation) {
        currentZoomAnimation.kill();
    }

    // Create a timeline for the multi-step animation
    const tl = gsap.timeline();
    
    // Step 1: Move down the aisle
    tl.to(camera.position, {
        x: aislePosition.x,
        y: aislePosition.y,
        z: aislePosition.z,
        duration: 1.0,
        ease: "power2.inOut",
    });
    
    // Step 2: Turn toward the rack
    tl.to(camera.position, {
        x: finalPosition.x,
        y: finalPosition.y,
        z: finalPosition.z,
        duration: 0.8,
        ease: "power2.out",
    }, "-=0.2"); // Slight overlap for smoother transition
    
    // Show panel after the movement is complete
    tl.call(() => {
        showPanel(`#panel-${targetNode.userData.name}`);
    }, null, null, "+=0.1");
    
    // Add a subtle camera look-at effect toward the rack
    const originalLookAt = targetLookAt.clone();
    const rackLookAt = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    
    tl.to(targetLookAt, {
        x: rackLookAt.x,
        y: rackLookAt.y,
        z: rackLookAt.z,
        duration: 0.5,
        ease: "power2.out",
    }, "-=0.3");

    currentZoomAnimation = tl;
}

function returnToAisleView() {
    if (currentZoomAnimation) {
        currentZoomAnimation.kill();
    }
    
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const scrollPercent = currentScroll / (document.documentElement.scrollHeight - window.innerHeight);
    const targetZ = 40 - 220 * scrollPercent;

    // Create a timeline for the return animation
    const tl = gsap.timeline();
    
    // Step 1: Return to the center aisle first
    tl.to(camera.position, {
        x: 0,
        y: 8,
        z: camera.position.z, // Stay at current Z position
        duration: 0.8,
        ease: "power2.inOut",
    });
    
    // Step 2: Then move to the scroll position
    tl.to(camera.position, {
        x: 0,
        y: 8,
        z: targetZ,
        duration: 1.0,
        ease: "power2.out",
    }, "-=0.2");
    
    // Hide panel immediately when starting the return
    gsap.to(".info-panel", { opacity: 0, visibility: 'hidden', duration: 0.3 });
    
    // Reset camera look-at to forward direction
    const forwardLookAt = new THREE.Vector3(0, 5, targetZ - 20);
    tl.to(targetLookAt, {
        x: forwardLookAt.x,
        y: forwardLookAt.y,
        z: forwardLookAt.z,
        duration: 0.8,
        ease: "power2.out",
    }, "-=0.5");
}

function showPanel(panelId) {
    gsap.to(".info-panel", { opacity: 0, visibility: 'hidden', duration: 0.5 });
    gsap.to(panelId, { opacity: 1, visibility: 'visible', duration: 0.5, delay: 0.8 });
}

// --- NAVIGATION LOGIC ---
function handleRackClick(event) {
    // Ignore clicks on UI panels or Gemini buttons
    if (event.target.classList.contains('gemini-button') || event.target.closest('.info-panel')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(heroRacks, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while(obj.parent && obj.userData.id === undefined) {
            obj = obj.parent;
        }
        if (obj.userData.id !== undefined) {
            navigateToNode(obj);
        }
    }
}

// --- HOVER EFFECT LOGIC ---
let hoveredObject = null;
function handleMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(heroRacks, true);

    let intersectedNode = null;
    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while(obj.parent && obj.userData.id === undefined) {
            obj = obj.parent;
        }
        if (obj.userData.id !== undefined) {
            intersectedNode = obj;
        }
    }

    if (hoveredObject !== intersectedNode) {
        if (hoveredObject) {
            gsap.to(hoveredObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            if (hoveredObject.userData.heroLight) {
                gsap.to(hoveredObject.userData.heroLight, { intensity: 10, duration: 0.3 });
            }
        }

        hoveredObject = intersectedNode;

        if (hoveredObject) {
            gsap.to(hoveredObject.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.3 });
            if (hoveredObject.userData.heroLight) {
                gsap.to(hoveredObject.userData.heroLight, { intensity: 25, duration: 0.3, yoyo: true, repeat: -1 });
            }
        }
    }

    document.body.style.cursor = intersectedNode ? 'pointer' : 'grab';
}

// --- GEMINI API INTEGRATION ---
function typeWriter(element, text) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 20);
        }
    }
    type();
}

async function callGeminiAPI(prompt, outputElement, button) {
    outputElement.classList.remove('hidden');
    outputElement.innerHTML = '<div class="loading-indicator"></div>';
    button.disabled = true;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    // WARNING: Never expose your real API key in public code!
    const apiKey = ""; // <-- Insert your Gemini API key here (for demo only)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const result = await response.json();
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
            const text = result.candidates[0].content.parts[0].text;
            typeWriter(outputElement, text);
        } else {
            outputElement.innerText = "Error: Could not retrieve a valid response from the AI.";
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        outputElement.innerText = "An error occurred while contacting the AI. Please check the console.";
    } finally {
        button.disabled = false;
    }
}

// --- RENDER LOOP & RESIZE HANDLER ---
const targetLookAt = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);

    let lookAtTarget = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z - 20);

    targetLookAt.lerp(lookAtTarget, 0.1);
    camera.lookAt(targetLookAt);

    renderer.render(scene, camera);
}

// --- EVENT LISTENERS ---
window.addEventListener('click', handleRackClick);

// Touch support for mobile
window.addEventListener('touchstart', function(event) {
    if (event.touches.length === 1) {
        handleRackClick({
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
            target: event.target
        });
    }
});

document.querySelectorAll('.exit-button').forEach(button => {
    button.addEventListener('click', returnToAisleView);
});

window.addEventListener('mousemove', handleMouseMove);

document.getElementById('generate-suggestions').addEventListener('click', (e) => {
    const projectText = document.getElementById('project-content').innerText;
    const prompt = `Based on the following project description, suggest 3 creative ideas for improvements, new features, or related technologies to explore. Keep the suggestions concise and actionable. Format the response as a simple list.\n\nProject: "${projectText}"`;
    callGeminiAPI(prompt, document.getElementById('project-output'), e.target);
});

document.getElementById('generate-cover-letter').addEventListener('click', (e) => {
    const experienceText = document.getElementById('experience-content').innerText;
    const prompt = `Based on the following job experience, write a short, professional paragraph (2-3 sentences) for a cover letter. Highlight the key skills and achievements.\n\nExperience: "${experienceText}"`;
    callGeminiAPI(prompt, document.getElementById('experience-output'), e.target);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate(); 