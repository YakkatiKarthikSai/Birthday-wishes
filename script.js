const canvas = document.getElementById("effects");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* 🎵 MUSIC */
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        music.volume = 0.6;
        music.play().catch(() => { });
        musicStarted = true;
    }
}

musicBtn.onclick = () => {
    if (music.paused) {
        music.play(); musicBtn.textContent = "🔊";
    } else {
        music.pause(); musicBtn.textContent = "🔇";
    }
};

/* SLIDES */
const slides = [...document.querySelectorAll(".scene")];
let current = 0;

function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
    current = i;
    // If final CTA slide is shown, restart typing animation so it plays each time
    const scene = slides[i];
    if (scene && scene.id === 'slide7') {
        const typeEl = scene.querySelector('.typing');
        if (typeEl) {
            typeEl.style.animation = 'none';
            // trigger reflow
            void typeEl.offsetWidth;
            typeEl.style.animation = 'typing 3s steps(28,end) forwards, blink .75s step-end infinite';
        }
    }
}
/* 💖 LOVE BACKGROUND ANIMATION */
const bgParticles = [];

function createLove() {
    bgParticles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        size: Math.random() * 14 + 10,
        speed: Math.random() * 0.6 + 0.2,
        alpha: Math.random() * 0.6 + 0.4,
        drift: (Math.random() - 0.5) * 0.6
    });
}

function drawLoveBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    createLove();

    bgParticles.forEach(p => {
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = `rgba(255,150,200,${p.alpha})`;
        ctx.fillText("❤", p.x, p.y);

        p.y -= p.speed;
        p.x += p.drift;
        p.alpha -= 0.002;
    });

    // cleanup
    for (let i = bgParticles.length - 1; i >= 0; i--) {
        if (bgParticles[i].alpha <= 0) bgParticles.splice(i, 1);
    }
}
setInterval(drawLoveBackground, 30);

/* 🎆 FIREWORKS */
const fireworks = [];

document.getElementById("openBox").onclick = () => {
    startMusic();
    setTimeout(() => showSlide(1), 800);
};

document.querySelectorAll(".next-btn").forEach(btn => {
    btn.onclick = () => showSlide(current + 1);
});

/* ❤️ Floating Hearts + Fireworks */
let hearts = [];

function spawnHearts() {
    hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 18 + 10,
        speed: Math.random() * 0.7 + 0.4,
        life: 1
    });
}

function fireworksBurst(x, y) {
    for (let i = 0; i < 120; i++) {
        fireworks.push({
            x, y,
            a: Math.random() * Math.PI * 2,
            s: Math.random() * 4 + 2,
            l: 80
        });
    }
}

document.getElementById("fireBtn").onclick = () => {
    music.volume = 0.85;
    fireworksBurst(canvas.width / 2, canvas.height / 2);
    // Also advance to the next slide after a short delay so fireworks are visible
    setTimeout(() => showSlide(current + 1), 800);
};

function draw() {
    drawLoveBackground();

    // fireworks stay on top
    fireworks.forEach(p => {
        ctx.fillStyle = `rgba(255,220,255,${p.l / 80})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s;
        p.l--;
    });

    fireworks = fireworks.filter(p => p.l > 0);

    requestAnimationFrame(draw);
}
draw();




// contact button: build WhatsApp link (no phone required)
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
    // OPTIONAL: set a phone number here in international format without +, e.g. '15551234567'
    const phone = '';
    // Message users will send — adjust as you like
    const message = 'Hey! I really liked this — would love to chat when you\'re free 😊';
    const base = 'https://api.whatsapp.com/send?';
    const params = [];
    if (phone) params.push('phone=' + encodeURIComponent(phone));
    params.push('text=' + encodeURIComponent(message));
    const href = base + params.join('&');
    contactBtn.setAttribute('href', href);
    contactBtn.setAttribute('target', '_blank');
    contactBtn.setAttribute('rel', 'noopener');
}