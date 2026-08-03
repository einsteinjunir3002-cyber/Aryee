const loadingScreen = document.getElementById('loadingScreen');
const app = document.getElementById('app');
const countdownEl = document.getElementById('countdown');
const themeToggle = document.getElementById('themeToggle');
const musicToggle = document.getElementById('musicToggle');
const surpriseBtn = document.getElementById('surpriseBtn');
const giftBox = document.getElementById('giftBox');
const giftLetter = document.getElementById('giftLetter');
const letterText = document.getElementById('letterText');
const galleryGrid = document.getElementById('galleryGrid');
const reasonsGrid = document.getElementById('reasonsGrid');
const friendshipTimer = document.getElementById('friendshipTimer');
const friendshipDateInput = document.getElementById('friendshipDate');
const saveFriendshipDateBtn = document.getElementById('saveFriendshipDate');
const sunflowerField = document.getElementById('sunflowerField');
const wishForm = document.getElementById('wishForm');
const wishList = document.getElementById('wishList');
const playPauseBtn = document.getElementById('playPause');
const shuffleBtn = document.getElementById('shuffleBtn');
const volumeControl = document.getElementById('volumeControl');
const envelope = document.getElementById('envelope');
const fireworksCanvas = document.getElementById('fireworks');
const cursorGlow = document.querySelector('.cursor-glow');

const unlockDate = new Date('2026-08-05T00:00:00');
const reasonWords = ['Kind', 'Beautiful', 'Caring', 'Intelligent', 'Funny', 'Loyal', 'Supportive', 'Strong', 'Ambitious', 'Inspiring'];
const reasonDescriptions = ['Your kindness makes every room warmer.', 'You carry beauty in everything you do.', 'Your care is a gift to everyone around you.', 'Your mind is brilliant and endlessly fascinating.', 'Your laughter brings joy to ordinary days.', 'Your loyalty is rare and priceless.', 'You lift people up with your steady support.', 'You shine with quiet strength.', 'Your ambition inspires us all.', 'You make the world feel brighter.'];
const messages = [
  'Josephine, your heart is a light that never goes out.',
  'Your courage and grace make every day better.',
  'You are loved more than you know, and you deserve every beautiful thing.',
  'Your smile has the power to turn sadness into sunshine.',
  'You are a masterpiece of kindness and joy.'
];
let images = [];
let currentLightboxIndex = 0;
let audioContext;
let masterGain;
let audioPlaying = false;
let ambientMedia = null;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTimeLeft(date) {
  const diff = date - new Date();
  if (diff <= 0) return '00:00:00:00';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return [days, hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

function initializeCountdown() {
  countdownEl.textContent = formatTimeLeft(unlockDate);
  const interval = setInterval(() => {
    countdownEl.textContent = formatTimeLeft(unlockDate);
    if (new Date() >= unlockDate) {
      clearInterval(interval);
      loadingScreen.classList.add('hidden');
      app.classList.remove('hidden');
      startExperience();
    }
  }, 1000);
}

function startExperience() {
  beginTyping();
  loadGallery();
  renderReasons();
  renderFriendshipTimer();
  renderSunflowers();
  renderWishes();
  setupScrollAnimations();
  startFireworks();
  startAmbientSound();
  document.querySelectorAll('.section').forEach((section, index) => section.style.opacity = '0'; section.style.transform = 'translateY(20px)'; setTimeout(() => {
    section.style.transition = 'all 0.8s ease';
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
  }, 120 * index));
}

async function loadAmbientMedia() {
  try {
    const response = await fetch('/api/media');
    const data = await response.json();
    const mediaFiles = data.media || [];
    if (mediaFiles.length && !ambientMedia) {
      ambientMedia = new Audio(mediaFiles[0]);
      ambientMedia.loop = true;
      ambientMedia.volume = 0.25;
      await ambientMedia.play();
      audioPlaying = true;
      playPauseBtn.textContent = 'Pause';
    }
  } catch (error) {
    console.warn('Ambient media unavailable', error);
  }
}

function prepareLightbox() {
}

function beginTyping() {
  const message = `Dear Josephine,\n\nHappy Birthday!\n\nToday is all about celebrating someone truly wonderful.\nYou have a beautiful heart, a kind soul, and a smile that can brighten someone's day. Thank you for every conversation, every laugh, every memory, and for simply being the amazing person you are.\n\nI hope this new chapter of your life brings you endless happiness, good health, success, peace, exciting adventures, and countless reasons to smile.\n\nMay every dream in your heart become reality.\n\nNever stop believing in yourself.\nNever stop shining.\n\nAnd always remember that you are appreciated far more than words can express.\n\nI hope today reminds you just how special you truly are.\n\nHappy Birthday once again, Josephine.\n\nMay this become your happiest year yet.\n❤️`;
  let index = 0;
  const timer = setInterval(() => {
    letterText.textContent += message[index] || '';
    index += 1;
    if (index >= message.length) clearInterval(timer);
  }, 18);
}

async function loadGallery() {
  const response = await fetch('/api/images');
  const data = await response.json();
  images = shuffle(data.images || []);
  galleryGrid.innerHTML = '';
  images.forEach((image, index) => {
    const card = document.createElement('article');
    card.className = 'photo-card';
    card.style.setProperty('--rotate', `${(Math.random() - 0.5) * 8}deg`);
    const filename = image.split('/').pop();
    const title = filename.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    card.innerHTML = `
      <img src="${image}" alt="${title}" loading="lazy" />
      <div class="photo-caption">${title}</div>
    `;
    card.addEventListener('click', () => openLightbox(index));
    galleryGrid.appendChild(card);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox open';
  lightbox.innerHTML = `
    <button class="close" aria-label="Close">✕</button>
    <button class="prev" aria-label="Previous">←</button>
    <img src="${images[index]}" alt="Preview" />
    <button class="next" aria-label="Next">→</button>
  `;
  document.body.appendChild(lightbox);
  lightbox.querySelector('.close').addEventListener('click', () => lightbox.remove());
  lightbox.querySelector('.prev').addEventListener('click', () => {
    const nextIndex = (currentLightboxIndex - 1 + images.length) % images.length;
    currentLightboxIndex = nextIndex;
    lightbox.querySelector('img').src = images[nextIndex];
  });
  lightbox.querySelector('.next').addEventListener('click', () => {
    const nextIndex = (currentLightboxIndex + 1) % images.length;
    currentLightboxIndex = nextIndex;
    lightbox.querySelector('img').src = images[nextIndex];
  });
  document.addEventListener('keydown', handleLightboxKey);
}

function handleLightboxKey(event) {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  if (event.key === 'Escape') lightbox.remove();
  if (event.key === 'ArrowRight') {
    const nextIndex = (currentLightboxIndex + 1) % images.length;
    currentLightboxIndex = nextIndex;
    lightbox.querySelector('img').src = images[nextIndex];
  }
  if (event.key === 'ArrowLeft') {
    const nextIndex = (currentLightboxIndex - 1 + images.length) % images.length;
    currentLightboxIndex = nextIndex;
    lightbox.querySelector('img').src = images[nextIndex];
  }
}

function renderReasons() {
  reasonsGrid.innerHTML = '';
  reasonWords.forEach((word, index) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <div class="face"><span>${word}</span></div>
      <div class="back">${reasonDescriptions[index]}</div>
    `;
    reasonsGrid.appendChild(card);
  });
}

function renderFriendshipTimer() {
  const savedDate = localStorage.getItem('friendshipDate') || '2020-06-01';
  friendshipDateInput.value = savedDate;
  updateTimer(savedDate);
  setInterval(() => updateTimer(friendshipDateInput.value || savedDate), 1000);
}

function updateTimer(dateValue) {
  const started = new Date(dateValue);
  const now = new Date();
  let diff = now - started;
  if (diff < 0) diff = 0;
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const weeks = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  friendshipTimer.innerHTML = `
    <div class="time-box"><strong>${years}</strong>Years</div>
    <div class="time-box"><strong>${months}</strong>Months</div>
    <div class="time-box"><strong>${weeks}</strong>Weeks</div>
    <div class="time-box"><strong>${days}</strong>Days</div>
    <div class="time-box"><strong>${hours}</strong>Hours</div>
    <div class="time-box"><strong>${minutes}</strong>Minutes</div>
  `;
  friendshipTimer.innerHTML += `<div class="time-box"><strong>${seconds}</strong>Seconds</div>`;
}

saveFriendshipDateBtn.addEventListener('click', () => {
  localStorage.setItem('friendshipDate', friendshipDateInput.value || '2020-06-01');
  updateTimer(friendshipDateInput.value || '2020-06-01');
});

giftBox.addEventListener('click', () => {
  giftBox.classList.add('shake');
  setTimeout(() => {
    giftBox.classList.remove('shake');
    giftBox.classList.add('open');
    giftLetter.classList.remove('hidden');
    playCelebrationBurst();
  }, 320);
});

function renderSunflowers() {
  sunflowerField.innerHTML = '';
  Array.from({ length: 12 }).forEach((_, index) => {
    const sunflower = document.createElement('div');
    sunflower.className = 'sunflower';
    sunflower.innerHTML = `
      <div class="flower">🌻</div>
      <div class="sunflower-message">${messages[index % messages.length]}</div>
    `;
    sunflower.addEventListener('click', () => {
      sunflower.classList.add('bloomed');
      const burst = document.createElement('div');
      burst.textContent = '✨';
      burst.style.position = 'absolute'; burst.style.left = '50%'; burst.style.top = '10%'; burst.style.fontSize = '1rem';
      sunflower.appendChild(burst);
      setTimeout(() => burst.remove(), 900);
    });
    sunflowerField.appendChild(sunflower);
  });
}

wishForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('wishName').value.trim();
  const message = document.getElementById('wishMessage').value.trim();
  if (!name || !message) return;
  const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
  wishes.unshift({ name, message, createdAt: new Date().toISOString() });
  localStorage.setItem('wishes', JSON.stringify(wishes));
  wishForm.reset();
  renderWishes();
});

function renderWishes() {
  const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
  wishList.innerHTML = '';
  wishes.forEach((wish) => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="meta">${wish.name}</div>
      <p>${wish.message}</p>
      <div class="wish-actions">
        <button data-action="love">💖</button>
        <button data-action="delete">Delete</button>
      </div>
    `;
    card.querySelector('[data-action="love"]').addEventListener('click', () => {
      card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 350 });
    });
    card.querySelector('[data-action="delete"]').addEventListener('click', () => {
      const stored = JSON.parse(localStorage.getItem('wishes') || '[]').filter((item) => item.createdAt !== wish.createdAt || item.message !== wish.message);
      localStorage.setItem('wishes', JSON.stringify(stored));
      renderWishes();
    });
    wishList.appendChild(card);
  });
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll('.section').forEach((section) => observer.observe(section));
}

async function startAmbientSound() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(audioContext.destination);
  }
  await loadAmbientMedia();
  if (ambientMedia) return;
  audioPlaying = false;
}

async function toggleSound() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(audioContext.destination);
  }
  if (ambientMedia) {
    if (audioPlaying) {
      ambientMedia.pause();
      playPauseBtn.textContent = 'Play';
      audioPlaying = false;
      return;
    }
    try {
      await ambientMedia.play();
      playPauseBtn.textContent = 'Pause';
      audioPlaying = true;
      return;
    } catch (error) {
      console.warn('Unable to autoplay media', error);
    }
  }
  if (audioPlaying) {
    masterGain.gain.value = 0;
    playPauseBtn.textContent = 'Play';
    audioPlaying = false;
    return;
  }
  const now = audioContext.currentTime;
  masterGain.gain.setTargetAtTime(0.04, now, 0.1);
  const oscillator = audioContext.createOscillator();
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.linearRampToValueAtTime(554, now + 2.5);
  oscillator.connect(masterGain);
  lfo.type = 'sine';
  lfo.frequency.value = 0.18;
  lfoGain.gain.value = 40;
  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  oscillator.start(now);
  lfo.start(now);
  oscillator.stop(now + 10);
  lfo.stop(now + 10);
  playPauseBtn.textContent = 'Pause';
  audioPlaying = true;
}

playPauseBtn.addEventListener('click', toggleSound);
musicToggle.addEventListener('click', toggleSound);
shuffleBtn.addEventListener('click', () => {
  if (!images.length) return;
  images = shuffle(images);
  galleryGrid.querySelectorAll('.photo-card').forEach((node, index) => {
    node.querySelector('img').src = images[index];
    node.querySelector('img').alt = images[index].split('/').pop();
  });
});
volumeControl.addEventListener('input', (event) => {
  if (masterGain) masterGain.gain.value = Number(event.target.value) * 0.08;
});

envelope.addEventListener('click', () => {
  envelope.classList.add('open');
});

function playCelebrationBurst() {
  const burst = document.createElement('div');
  burst.textContent = '🎉';
  burst.style.position = 'fixed';
  burst.style.left = '50%';
  burst.style.top = '30%';
  burst.style.fontSize = '2.5rem';
  burst.style.zIndex = '99';
  document.body.appendChild(burst);
  burst.animate([{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(-80px) scale(1.3)' }], { duration: 900 });
  setTimeout(() => burst.remove(), 800);
}

function startFireworks() {
  const ctx = fireworksCanvas.getContext('2d');
  let particles = [];
  const resize = () => {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  setInterval(() => {
    if (Math.random() > 0.85) {
      for (let i = 0; i < 18; i++) {
        particles.push({
          x: window.innerWidth * Math.random(),
          y: window.innerHeight * Math.random(),
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 100 + Math.random() * 40,
          color: ['#ffd166', '#ff9f1c', '#c77dff'][Math.floor(Math.random() * 3)]
        });
      }
    }
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.life -= 1; p.vx *= 0.96; p.vy *= 0.96;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
    });
  }, 30);
}

surpriseBtn.addEventListener('click', () => {
  document.body.classList.add('celebrate');
  playCelebrationBurst();
  const petals = Array.from({ length: 18 }, () => {
    const petal = document.createElement('div');
    petal.textContent = '❀';
    petal.style.position = 'fixed';
    petal.style.left = `${Math.random() * 100}vw`; petal.style.top = '-20px';
    petal.style.fontSize = '1.2rem';
    petal.style.zIndex = '95';
    petal.style.pointerEvents = 'none';
    document.body.appendChild(petal);
    return petal;
  });
  petals.forEach((petal, index) => {
    petal.animate([{ transform: `translate(0,0) rotate(0deg)` }, { transform: `translate(${(Math.random() - 0.5) * 240}px, ${window.innerHeight + 120}px) rotate(${360}deg)` }], { duration: 1800 + index * 80, easing: 'cubic-bezier(.2,.8,.2,1)' });
    setTimeout(() => petal.remove(), 2000 + index * 80);
  });
});

document.addEventListener('mousemove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
});

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  document.querySelector('.progress-bar').style.width = `${progress}%`;
});

window.addEventListener('load', () => {
  if (new Date() >= unlockDate) {
    loadingScreen.classList.add('hidden');
    app.classList.remove('hidden');
    startExperience();
  } else {
    initializeCountdown();
  }
});
