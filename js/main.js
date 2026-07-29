/* ==========================================================================
   Happy 21st Birthday Vanshika - Main JavaScript
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initBackgroundCanvas();
  initFallingIcons();
  initTypewriter();
  initScrollEffects();
  initAudioPlayer();
  initGalleries();
  initLightbox();
  initCountdown();
  initLoveButton();
  initFlashcards();
  triggerConfettiOnLoad();
});

/* --------------------------------------------------------------------------
   1. Theme switcher
   -------------------------------------------------------------------------- */
const themes = [
  { key: 'blush', label: 'Garden' },
  { key: 'lilac', label: 'Lullaby' },
  { key: 'golden', label: 'Picnic' },
  { key: 'midnight', label: 'Starlight' }
];

function initThemeSwitcher() {
  const btn = document.getElementById('theme-switcher');
  const label = document.getElementById('theme-switcher-label');
  const savedTheme = localStorage.getItem('birthday-theme');
  const initialTheme = themes.some(theme => theme.key === savedTheme) ? savedTheme : 'blush';

  applyTheme(initialTheme, label);
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.body.dataset.theme || 'blush';
    const nextIndex = (themes.findIndex(theme => theme.key === current) + 1) % themes.length;
    const nextTheme = themes[nextIndex].key;
    applyTheme(nextTheme, label);
    localStorage.setItem('birthday-theme', nextTheme);
  });
}

function applyTheme(themeKey, labelEl) {
  document.body.dataset.theme = themeKey;
  const theme = themes.find(item => item.key === themeKey) || themes[0];
  if (labelEl) labelEl.textContent = theme.label;
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

/* --------------------------------------------------------------------------
   2. Floating petals & fairy lights canvas
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('floating-canvas');
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let palette = getParticlePalette();

  window.addEventListener('themechange', () => { palette = getParticlePalette(); });
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = window.innerWidth < 768 ? 20 : 38;
  const shapes = ['petal', 'heart', 'sparkle'];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.7 + 0.25,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.34 + 0.22,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      colorIndex: Math.floor(Math.random() * 3)
    });
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = palette[p.colorIndex] || palette[0];

    if (p.shape === 'petal') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 2, 0, p.size * 1.2);
      ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size, 0, 0);
      ctx.fill();
    } else if (p.shape === 'heart') {
      const s = p.size * 0.58;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s, -s, -s * 1.55, s / 2, 0, s * 1.45);
      ctx.bezierCurveTo(s * 1.55, s / 2, s, -s, 0, 0);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.012) * 0.42;
      p.rotation += p.rotSpeed;
      if (p.y > height + 24) {
        p.y = -24;
        p.x = Math.random() * width;
      }
      if (p.x > width + 24) p.x = -24;
      if (p.x < -24) p.x = width + 24;
      drawParticle(p);
    });
    requestAnimationFrame(animate);
  }

  animate();
}

function getParticlePalette() {
  return [cssVar('--particle-a'), cssVar('--particle-b'), cssVar('--particle-c')].filter(Boolean);
}

/* --------------------------------------------------------------------------
   3. Ambient falling favorites
   -------------------------------------------------------------------------- */
const fallingItems = [
  { name: 'heart', src: 'Assets-optimized/icons/heart.svg' },
  { name: 'strawberry', src: 'Assets-optimized/icons/strawberry.svg' },
  { name: 'lychee', src: 'Assets-optimized/icons/lychee.svg' },
  { name: 'fries', src: 'Assets-optimized/icons/fries.svg' },
  { name: 'momos', src: 'Assets-optimized/icons/momos.svg' },
  { name: 'paneer tandoori pizza', src: 'Assets-optimized/icons/paneer-tandoori-pizza.svg' },
  { name: 'rajma chawal', src: 'Assets-optimized/icons/rajma-chawal.svg' },
  { name: 'KitKat', src: 'Assets-optimized/icons/kitkat.svg' },
  { name: 'chole bhature', src: 'Assets-optimized/icons/chole-bhature.svg' },
  { name: 'cookies', src: 'Assets-optimized/icons/cookies.svg' },
  { name: 'sunflower', src: 'Assets-optimized/icons/sunflower.svg' },
  { name: 'rose', src: 'Assets-optimized/icons/rose.svg' },
  { name: 'pasta', src: 'Assets-optimized/icons/pasta.svg' }
];

function initFallingIcons() {
  const layer = document.getElementById('falling-icons');
  if (!layer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = reducedMotion ? 8 : (window.innerWidth < 700 ? 18 : 32);

  for (let i = 0; i < count; i++) {
    const item = fallingItems[i % fallingItems.length];
    const icon = document.createElement('span');
    icon.className = 'falling-icon';
    icon.style.setProperty('--x', `${Math.random() * 100}vw`);
    icon.style.setProperty('--size', `${reducedMotion ? 24 : Math.random() * 22 + 22}px`);
    icon.style.setProperty('--duration', `${Math.random() * 14 + 18}s`);
    icon.style.setProperty('--delay', `${reducedMotion ? 0 : Math.random() * -26}s`);
    icon.style.setProperty('--drift', `${(Math.random() - 0.5) * 110}px`);
    icon.style.setProperty('--start-rot', `${Math.random() * 360}deg`);
    icon.style.setProperty('--opacity', `${Math.random() * 0.16 + 0.14}`);
    icon.style.setProperty('--static-y', `${Math.random() * 80 + 8}vh`);
    icon.innerHTML = `<img src="${item.src}" alt="" loading="lazy" decoding="async" />`;
    layer.appendChild(icon);
  }
}

/* --------------------------------------------------------------------------
   4. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('hero-headline');
  const sub = document.getElementById('hero-subtext');
  if (!el) return;

  const text = 'Happy 21st Birthday, Vanshika';
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      if (text.substring(i, i + 8) === 'Vanshika') {
        const span = document.createElement('span');
        span.className = 'name-highlight';
        span.textContent = 'Vanshika';
        el.appendChild(span);
        i += 8;
      } else {
        el.appendChild(document.createTextNode(text.charAt(i)));
        i++;
      }
      setTimeout(type, 75);
    } else if (sub) {
      sub.classList.add('visible');
    }
  }

  setTimeout(type, 400);
}

/* --------------------------------------------------------------------------
   5. Scroll Effects & Progress
   -------------------------------------------------------------------------- */
let revealObserver;

function initScrollEffects() {
  const bar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section');
  const dots = document.querySelectorAll('.nav-dot');

  const updateScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (bar) bar.style.width = `${(scrollTop / scrollHeight) * 100}%`;

    let currentSection = '';
    sections.forEach(section => {
      if (scrollTop >= section.offsetTop - 170) currentSection = section.id;
    });
    dots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-section') === currentSection);
    });
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal-up,.reveal-fade,.reveal-scale').forEach(el => revealObserver.observe(el));
}

function reobserveRevealElements() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal-up:not(.active),.reveal-fade:not(.active),.reveal-scale:not(.active)').forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   6. Audio Player
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const btn = document.getElementById('audio-toggle');
  const audio = document.getElementById('bg-audio');
  const tip = document.getElementById('audio-tooltip');
  if (!btn || !audio) return;

  let playing = false;
  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      if (tip) tip.textContent = 'Play Music 🎵';
      playing = false;
      return;
    }

    audio.play()
      .then(() => {
        btn.classList.add('playing');
        if (tip) tip.textContent = 'Pause 🎶';
        playing = true;
      })
      .catch(() => {
        if (tip) tip.textContent = 'Add song to /audio/ 🎵';
      });
  });

  audio.addEventListener('error', () => {
    if (tip) tip.textContent = 'Drop a song in /audio/ 🎧';
  });
}

/* --------------------------------------------------------------------------
   7. Gallery Data & Filmstrip Carousel Rendering
   -------------------------------------------------------------------------- */
const coupleImages = [
  { src: 'Assets-optimized/Couple/1778002470934~6.webp', width: 788, height: 1400, caption: 'Sweet Moments Together 💕' },
  { src: 'Assets-optimized/Couple/1778043561655.webp', width: 788, height: 1400, caption: 'Your Beautiful Smile ✨' },
  { src: 'Assets-optimized/Couple/file_00000000956871faaabeb746616d6511~3.webp', width: 1050, height: 1185, caption: 'Unforgettable Days 🌸' },
  { src: 'Assets-optimized/Couple/IMG-20260131-WA0087.webp', width: 1400, height: 788, caption: 'Side by Side 💑' },
  { src: 'Assets-optimized/Couple/IMG-20260505-WA0006.webp', width: 720, height: 1280, caption: 'Precious Memories 💖' },
  { src: 'Assets-optimized/Couple/IMG-20260505-WA0027.webp', width: 787, height: 1400, caption: 'My Favorite Place 🥰' },
  { src: 'Assets-optimized/Couple/PXL_20260504_131017758.MP.webp', width: 788, height: 1400, caption: 'Golden Moments ☀️' },
  { src: 'Assets-optimized/Couple/PXL_20260504_140220282.MP.webp', width: 788, height: 1400, caption: 'Laughter & Love 🌷' },
  { src: 'Assets-optimized/Couple/Snapchat-124408248.webp', width: 788, height: 1400, caption: 'Pure Magic ✨' },
  { src: 'Assets-optimized/Couple/Snapchat-1560447396.webp', width: 788, height: 1400, caption: 'Forever Yours 💛' },
  { src: 'Assets-optimized/Couple/IMG-20250329-WA0072.webp', width: 853, height: 1280, caption: 'A Memory Worth Keeping' },
  { src: 'Assets-optimized/Couple/PXL_20251004_062149905.MP.webp', width: 788, height: 1400, caption: 'Just Us' },
  { src: 'Assets-optimized/Couple/PXL_20251004_062157525.MP.webp', width: 788, height: 1400, caption: 'Still My Favorite' },
  { src: 'Assets-optimized/Couple/Screenshot_20251005-163047~2.webp', width: 630, height: 1400, caption: 'A Tiny Time Capsule' },
  { src: 'Assets-optimized/Couple/VID-20260505-WA0039.mp4', type: 'video', caption: 'One More Sweet Moment' },
  { src: 'Assets-optimized/Couple/VID-20260505-WA0040.mp4', type: 'video', caption: 'Us, In Motion' },
  { src: 'Assets-optimized/others/20260213_031939-COLLAGE.webp', width: 675, height: 1200, caption: 'Collage of Us 📸' },
  { src: 'Assets-optimized/others/PXL_20260504_132034363.MP.webp', width: 1200, height: 802, caption: 'Together Always 💫' }
];

const herImages = [
  { src: 'Assets-optimized/her-pics/1780470634941.webp', width: 788, height: 1400, type: 'image', caption: 'Radiant Miss Delhi ✨' },
  { src: 'Assets-optimized/her-pics/file_000000005c7c7209b8574dbd6a0a1085.webp', width: 788, height: 1400, type: 'image', caption: 'Effortlessly Gorgeous 🌸' },
  { src: 'Assets-optimized/her-pics/file_0000000075447206a740e85f00e3b48b.webp', width: 788, height: 1400, type: 'image', caption: 'Those Sparkling Eyes 💖' },
  { src: 'Assets-optimized/her-pics/file_00000000b2587207bc71e87bdbe1252e.webp', width: 1120, height: 1400, type: 'image', caption: 'Cutest Mood 🥰' },
  { src: 'Assets-optimized/her-pics/file_00000000b954720cb726419105ad72bf.webp', width: 1254, height: 1254, type: 'image', caption: 'Sunshine in Girl Form ☀️' },
  { src: 'Assets-optimized/her-pics/file_00000000bb14720cadb666ecbfb7f947.webp', width: 1254, height: 1254, type: 'image', caption: 'Elegance & Grace 🌹' },
  { src: 'Assets-optimized/her-pics/IMG-20260130-WA0116.webp', width: 787, height: 1400, type: 'image', caption: 'Sweetest Smile 😊' },
  { src: 'Assets-optimized/her-pics/IMG-20260315-WA0003.webp', width: 788, height: 1400, type: 'image', caption: 'Breathtaking 💫' },
  { src: 'Assets-optimized/her-pics/IMG-20260404-WA0013.webp', width: 933, height: 1400, type: 'image', caption: 'Lovely Vibes 🌷' },
  { src: 'Assets-optimized/her-pics/IMG-20260511-WA0137.webp', width: 788, height: 1400, type: 'image', caption: 'Precious Soul 👑' },
  { src: 'Assets-optimized/her-pics/IMG-20250106-WA0028.webp', width: 1050, height: 1400, type: 'image', caption: 'A Beautiful Beginning' },
  { src: 'Assets-optimized/her-pics/IMG-20250223-WA0028.webp', width: 1400, height: 787, type: 'image', caption: 'Soft Smile' },
  { src: 'Assets-optimized/her-pics/IMG-20250315-WA0013.webp', width: 1400, height: 788, type: 'image', caption: 'Lovely, Always' },
  { src: 'Assets-optimized/her-pics/IMG-20250329-WA0024.webp', width: 787, height: 1400, type: 'image', caption: 'Her Kind of Magic' },
  { src: 'Assets-optimized/her-pics/IMG-20250730-WA0004.webp', width: 1050, height: 1400, type: 'image', caption: 'Birthday Glow' },
  { src: 'Assets-optimized/her-pics/IMG-20250907-WA0039.webp', width: 788, height: 1400, type: 'image', caption: 'Golden Hour Girl' },
  { src: 'Assets-optimized/her-pics/IMG-20251020-WA0018.webp', width: 1050, height: 1400, type: 'image', caption: 'Quietly Stunning' },
  { src: 'Assets-optimized/her-pics/IMG-20251022-WA0035.webp', width: 1050, height: 1400, type: 'image', caption: 'The Prettiest View' },
  { src: 'Assets-optimized/her-pics/IMG-20251026-WA0029.webp', width: 1050, height: 1400, type: 'image', caption: 'A Whole Mood' },
  { src: 'Assets-optimized/her-pics/Screenshot 2026-07-29 031128.webp', width: 605, height: 1074, type: 'image', caption: 'Captured Beauty 📷' },
  { src: 'Assets-optimized/her-pics/Snapchat-143382591.mp4', type: 'video', caption: 'Playful Moments 🎥' },
  { src: 'Assets-optimized/her-pics/Snapchat-53574011.webp', width: 788, height: 1400, type: 'image', caption: 'My Favorite Girl 💛' }
];

let allMediaList = [];

function initGalleries() {
  buildFilmstrip('couple-gallery-track', coupleImages);
  buildFilmstrip('her-gallery-track', herImages);

  document.querySelectorAll('.scroll-hint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const trackId = btn.getAttribute('data-track');
      const dir = btn.getAttribute('data-dir');
      const track = document.getElementById(trackId);
      if (track) track.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
    });
  });
}

function buildFilmstrip(trackId, items) {
  const track = document.getElementById(trackId);
  if (!track) return;

  items.forEach(item => {
    const idx = allMediaList.length;
    allMediaList.push(item);

    const card = document.createElement('div');
    card.className = 'gallery-card reveal-scale';
    const isVideo = item.type === 'video' || item.src.endsWith('.mp4');

    if (isVideo) {
      card.innerHTML = `
        <div class="gallery-media-frame">
          <div class="video-badge">▶ Video</div>
          <video class="gallery-card-media" src="${item.src}" muted loop playsinline preload="metadata"></video>
        </div>
        <div class="gallery-card-caption">${item.caption}</div>`;
      const video = card.querySelector('video');
      card.addEventListener('mouseenter', () => video.play());
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    } else {
      const w = item.width || 788;
      const h = item.height || 1400;
      card.innerHTML = `
        <div class="gallery-media-frame">
          <img class="gallery-card-media" src="${item.src}" alt="${item.caption}" width="${w}" height="${h}" loading="lazy" decoding="async" />
        </div>
        <div class="gallery-card-caption">${item.caption}</div>`;
    }

    card.addEventListener('click', () => openLightbox(idx));
    track.appendChild(card);
  });

  reobserveRevealElements();
}

/* --------------------------------------------------------------------------
   8. Lightbox Modal
   -------------------------------------------------------------------------- */
let currentMediaIndex = 0;

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
  modal.addEventListener('click', e => {
    if (e.target === modal) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  currentMediaIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const container = document.getElementById('lightbox-media-container');
  const caption = document.getElementById('lightbox-caption');
  if (!modal || !container) return;

  const item = allMediaList[index];
  container.innerHTML = '';

  if (item.type === 'video' || item.src.endsWith('.mp4')) {
    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    container.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'Birthday memory';
    container.appendChild(img);
  }

  if (caption) caption.textContent = item.caption || '';
  modal.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox-modal')?.classList.remove('active');
  const container = document.getElementById('lightbox-media-container');
  if (container) container.innerHTML = '';
}

function navigateLightbox(direction) {
  currentMediaIndex = (currentMediaIndex + direction + allMediaList.length) % allMediaList.length;
  openLightbox(currentMediaIndex);
}

/* --------------------------------------------------------------------------
   9. Countdown
   -------------------------------------------------------------------------- */
function initCountdown() {
  const els = {
    d: document.getElementById('days'),
    h: document.getElementById('hours'),
    m: document.getElementById('minutes'),
    s: document.getElementById('seconds')
  };
  const timer = document.getElementById('countdown-timer');
  const banner = document.getElementById('celebration-banner');

  function update() {
    const now = new Date();
    const birthday = new Date(now.getFullYear(), 6, 30, 0, 0, 0);

    if (now >= birthday || (now.getMonth() === 6 && now.getDate() === 30)) {
      if (timer) timer.style.display = 'none';
      if (banner) banner.classList.add('active');
      return;
    }

    const diff = birthday - now;
    if (els.d) els.d.textContent = String(Math.floor(diff / 864e5)).padStart(2, '0');
    if (els.h) els.h.textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
    if (els.m) els.m.textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
    if (els.s) els.s.textContent = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   10. Love Button - hearts, messages, confetti
   -------------------------------------------------------------------------- */
const loveMessages = [
  "You're my whole world 💛",
  'Miss Delhi forever 🌸',
  'Soulmate vibes only ✨',
  'You + Me = ♾️',
  'Love you the mosttt 💖',
  '21 and stunning 👑',
  'My favorite human 🥰',
  'To the moon & back 🌙',
  'Happy Birthday baby 🎂',
  'Forever yours — Adi 💌'
];

let loveClickCount = 0;

function initLoveButton() {
  const btn = document.getElementById('love-burst-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    loveClickCount++;
    triggerConfetti();
    setTimeout(() => triggerConfetti(), 300);
    setTimeout(() => triggerConfetti(), 600);
    spawnFloatingHearts(12);
    showLovePopup(loveMessages[(loveClickCount - 1) % loveMessages.length]);

    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 500);

    const span = btn.querySelector('span');
    if (span && loveClickCount > 1) {
      span.textContent = `${loveClickCount}x Love Sent! Keep Going 🌸`;
    }
  });
}

function spawnFloatingHearts(count) {
  let container = document.getElementById('floating-hearts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'floating-hearts';
    document.body.appendChild(container);
  }

  const heartEmojis = ['❤️', '💖', '💕', '💛', '🌸', '✨', '💗', '🩷', '💜', '🤍'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${1.5 + Math.random() * 2}rem`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    heart.style.animationDelay = `${Math.random()}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }
}

function showLovePopup(message) {
  let popup = document.getElementById('love-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'love-popup';
    popup.className = 'love-popup';
    popup.innerHTML = '<div class="love-popup-text" id="love-popup-text"></div><div class="love-popup-sub">— tap anywhere to close —</div>';
    document.body.appendChild(popup);
    popup.addEventListener('click', () => popup.classList.remove('active'));
  }

  const popupText = document.getElementById('love-popup-text');
  if (popupText) popupText.textContent = message;
  popup.classList.add('active');
  setTimeout(() => popup.classList.remove('active'), 2500);
}

function triggerConfettiOnLoad() {
  setTimeout(() => triggerConfetti(), 1000);
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 82,
      spread: 72,
      origin: { y: 0.62 },
      colors: [cssVar('--particle-a'), cssVar('--particle-b'), cssVar('--particle-c'), cssVar('--accent')]
    });
  }
}

/* --------------------------------------------------------------------------
   11. Flashcards Grid
   -------------------------------------------------------------------------- */
const flashcardsData = [
  {
    src: 'Assets-optimized/others/20260213_031939-COLLAGE.webp',
    width: 675,
    height: 1200,
    badge: 'Keepsake #1',
    title: 'Our Collage of Love 📸',
    desc: 'A vibrant mosaic of sweet memories, silly dates, and unforgettable laughter.'
  },
  {
    src: 'Assets-optimized/others/IMG-20260131-WA0092.webp',
    width: 675,
    height: 1200,
    badge: 'Keepsake #2',
    title: 'Roses for My Rose 🌹',
    desc: 'As timeless and captivating as your smile, my dearest Miss Delhi.'
  },
  {
    src: 'Assets-optimized/others/IMG_20260505_080237_594.webp',
    width: 675,
    height: 1200,
    badge: 'Keepsake #3',
    title: 'Sunflower Sunshine 🌻',
    desc: 'Bringing warm golden energy and endless brightness into my life.'
  },
  {
    src: 'Assets-optimized/others/PXL_20260504_132034363.MP.webp',
    width: 1200,
    height: 802,
    badge: 'Keepsake #4',
    title: 'Side by Side Forever 💫',
    desc: 'Hand in hand through every journey, today and for all the tomorrows.'
  }
];

function initFlashcards() {
  const container = document.getElementById('flashcards-grid');
  if (!container) return;

  flashcardsData.forEach(item => {
    const idx = allMediaList.length;
    allMediaList.push({ src: item.src, caption: `${item.title} — ${item.desc}` });

    const card = document.createElement('div');
    card.className = 'flashcard reveal-scale';
    card.innerHTML = `
      <span class="flashcard-badge">${item.badge}</span>
      <div class="flashcard-img-wrap">
        <img class="flashcard-img" src="${item.src}" alt="${item.title}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async" />
      </div>
      <div class="flashcard-body">
        <h3 class="flashcard-title">${item.title}</h3>
        <p class="flashcard-desc">${item.desc}</p>
        <div class="flashcard-footer">
          <span>Keepsake Card</span>
          <span class="flashcard-hint">🔍 Expand</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openLightbox(idx));
    container.appendChild(card);
  });

  reobserveRevealElements();
}

