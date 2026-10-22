// Elizabeth's Birthday Adventure - Main Game Script

// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

let GAME_WIDTH = 800;
let GAME_HEIGHT = 600;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    GAME_WIDTH = canvas.width;
    GAME_HEIGHT = canvas.height;
    ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Game Constants ---
const GRAVITY = 0.6;
const FRICTION = 0.8;
const MAX_SPEED = 5;
const JUMP_POWER = -12;
const TILE_SIZE = 40;

// --- Game State ---
let gameState = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER, VICTORY
let currentLevel = 1;
let score = 0;
let giftsFound = 0;
let timeElapsed = 0;
let startTime = 0;

const giftData = [
    // 1. WhatsApp Image 2026-10-20 at 8.34.26 AM.jpeg (Red Carpet Queen)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.34.26 AM.jpeg',
        msg: "Hold on Elizabeth, did UCC give you a degree or a license to cause cardiac arrests with that red carpet dress? You look dangerously gorgeous! 🔥😍"
    },
    // 2. WhatsApp Image 2026-10-20 at 8.34.26 AM (2).jpeg (Blue Cocktail)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.34.26 AM (2).jpeg',
        msg: "That electric blue cocktail is icy, but you're serving 100% tropical heat! That cheeky side-eye through the straw is pure flirtatious trouble! 🍹😘"
    },
    // 3. WhatsApp Image 2026-10-20 at 8.34.26 AM (1).jpeg (Beach Supermodel)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.34.26 AM (1).jpeg',
        msg: "4 solid years in UCC ain't easy at all, but look at you walking Cape Coast beach looking like a full-time supermodel! Certified degree baddie! 🌴🎓"
    },
    // 4. WhatsApp Image 2026-10-20 at 8.33.47 AM (1).jpeg (Toothy Smile)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.33.47 AM (1).jpeg',
        msg: "Warning: That toothy smile is a public hazard! It's too bright, too sweet, and entirely too cute! Don't ever stop laughing like that, Lizzy! 😁💖"
    },
    // 5. WhatsApp Image 2026-10-20 at 8.33.46 AM.jpeg (VIP & Personal Paparazzi)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.33.46 AM.jpeg',
        msg: "Look at me back there playing your personal paparazzi! Honestly, capturing Elizabeth's beauty deserves its own full-time salary! 📸😉"
    },
    // 6. WhatsApp Image 2026-10-20 at 8.33.47 AM.jpeg (Nerdy-Chic Specs)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.33.47 AM.jpeg',
        msg: "Nerdy-chic specs + glowing melanin = deadly combination. Are you made of copper and tellurium? Because you are Cu-Te, Elizabeth! 👓✨"
    },
    // 7. 20250626_172140.jpg.jpeg (Regal Stunner)
    {
        img: '20250626_172140.jpg.jpeg',
        msg: "Wait a second Elizabeth, is this a candid memory or a Vogue editorial cover? The posture, the elegance, the queen energy—unrivaled! 👑✨"
    },
    // 8. 20250626_172142.jpg.jpeg (Effortless Class)
    {
        img: '20250626_172142.jpg.jpeg',
        msg: "Looking at this photo and wondering how someone can look this effortlessly classy without even trying. Top-tier beauty! 🌟💃"
    },
    // 9. 20250717_103422.jpg.jpeg (Sunshine Radiance)
    {
        img: '20250717_103422.jpg.jpeg',
        msg: "Sunshine, great vibes, and Elizabeth looking like pure royalty. Cape Coast was truly blessed to have you for 4 whole years! ☀️😍"
    },
    // 10. 20250816_200652.jpg.jpeg (Evening Glow)
    {
        img: '20250816_200652.jpg.jpeg',
        msg: "Evening glow on point! If looking this pretty was against university regulations, UCC campus security would have issued a warrant! 🚨💖"
    },
    // 11. 20251219_163657.jpg.jpeg (Sparkling Smile)
    {
        img: '20251219_163657.jpg.jpeg',
        msg: "That genuine, sparkling look proves you don't just conquer academic degrees, you conquer hearts everywhere you step! 💫🥰"
    },
    // 12. IMG-20250611-WA0198.jpg.jpeg (Natural Head-Turner)
    {
        img: 'IMG-20250611-WA0198.jpg.jpeg',
        msg: "Casual, fresh, and cute on 100%! How does someone wake up and look this ridiculously charming on an ordinary day? 🥺❤️"
    },
    // 13. Snapchat-194509455.jpg.jpeg (Goofy Charm)
    {
        img: 'Snapchat-194509455.jpg.jpeg',
        msg: "Playful goofy energy activated! Don't let that sharp UCC degree fool anyone, Elizabeth is 100% charming trouble! 😜✨"
    },
    // 14. Snapchat-441229762.jpg.jpeg (Flawless Face Card)
    {
        img: 'Snapchat-441229762.jpg.jpeg',
        msg: "Snapchat cameras could never do full justice, but this selfie is proof that Elizabeth's face card never declines! 💅🔥"
    },
    // Fresh Alternate Messages for Round 2 (So if any photo repeats, the message is 100% fresh!)
    {
        img: 'WhatsApp Image 2026-10-20 at 8.34.26 AM.jpeg',
        msg: "ABSAG Awards wasn't ready, UCC wasn't ready, and none of us were ready for those heels and that slit! Absolutely majestic! 💃🔥"
    },
    {
        img: 'WhatsApp Image 2026-10-20 at 8.34.26 AM (2).jpeg',
        msg: "Excuse me Miss Elizabeth, do you have a compass? Because I got completely lost in those eyes while you were sipping that ocean drink! 🏖️💋"
    },
    {
        img: 'WhatsApp Image 2026-10-20 at 8.34.26 AM (1).jpeg',
        msg: "From the lecture halls of Cape Coast to ocean breezes! Cheers to completing your degree this year! 4 years in UCC is no joke, superstar! 🎓🚀"
    },
    {
        img: 'WhatsApp Image 2026-10-20 at 8.33.47 AM (1).jpeg',
        msg: "If smiles were currency, you could buy the entire Central Region! Happy Birthday to the sweetest, funniest friend ever! 🥳💎"
    },
    {
        img: 'WhatsApp Image 2026-10-20 at 8.33.46 AM.jpeg',
        msg: "They say behind every successful graduate is a loyal friend trying to get the camera lighting right for Queen Elizabeth! 😂✨"
    },
    {
        img: 'WhatsApp Image 2026-10-20 at 8.33.47 AM.jpeg',
        msg: "Smart girl aesthetic on 100%! Those glasses aren't just for studying, they're for looking drop-dead gorgeous! 👓😍"
    },
    {
        img: '20250626_172140.jpg.jpeg',
        msg: "They say pictures speak a thousand words, but this one only speaks two: 'Total Stunner'! Happy Birthday Lizzy! 🍾💐"
    },
    {
        img: '20250626_172142.jpg.jpeg',
        msg: "Unfiltered elegance! May your post-grad life be as smooth, classy, and effortless as you look right here! 🥂✨"
    },
    {
        img: '20250717_103422.jpg.jpeg',
        msg: "Cape Coast breeze hits different when you've conquered your exams and you're glowing this bright! 🌊✨"
    },
    {
        img: '20250816_200652.jpg.jpeg',
        msg: "Golden hour or golden girl? You make every background look like it was hand-painted just for you! 🌅💖"
    },
    {
        img: '20251219_163657.jpg.jpeg',
        msg: "A smile so radiant it makes the sun look like an amateur. Happy Birthday Elizabeth, stay goofy and charming forever! ☀️🥰"
    },
    {
        img: 'IMG-20250611-WA0198.jpg.jpeg',
        msg: "Cute, calm, and collected! Proof that even in simple candid moments, Queen Lizzy is a natural head-turner! 🌸💫"
    },
    {
        img: 'Snapchat-194509455.jpg.jpeg',
        msg: "Warning: High dosage of cuteness detected! Side effects include smiling like a fool at your phone screen! 🥰🎉"
    },
    {
        img: 'Snapchat-441229762.jpg.jpeg',
        msg: "Happy Birthday Elizabeth! May this new year bring you fat job offers, soft life, expensive vacations, and lots of reasons to celebrate! 🍾🎉"
    }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Smart non-repeating gift deck
let giftDeck = [];
let giftDeckIndex = 0;
let lastGiftImage = null;

function initGiftDeck() {
    giftDeck = [...giftData];
    shuffleArray(giftDeck);
    
    // Ensure that no two identical images are adjacent in the deck
    for (let i = 1; i < giftDeck.length; i++) {
        if (giftDeck[i].img === giftDeck[i - 1].img) {
            for (let j = 0; j < giftDeck.length; j++) {
                if (j !== i && j !== i - 1 && giftDeck[j].img !== giftDeck[i].img) {
                    [giftDeck[i], giftDeck[j]] = [giftDeck[j], giftDeck[i]];
                    break;
                }
            }
        }
    }
    
    // Ensure the first item of new deck does not match the last image seen from the previous deck
    if (lastGiftImage && giftDeck.length > 1 && giftDeck[0].img === lastGiftImage) {
        for (let j = 1; j < giftDeck.length; j++) {
            if (giftDeck[j].img !== lastGiftImage) {
                [giftDeck[0], giftDeck[j]] = [giftDeck[j], giftDeck[0]];
                break;
            }
        }
    }
    giftDeckIndex = 0;
}

function getNextGift() {
    if (giftDeck.length === 0 || giftDeckIndex >= giftDeck.length) {
        initGiftDeck();
    }
    const gift = giftDeck[giftDeckIndex];
    giftDeckIndex++;
    lastGiftImage = gift.img;
    return gift;
}
let animationFrameId;

// --- Audio ---
const bgm = document.getElementById('bgm');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'collect') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'hurt') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }
}

// --- Input Handling ---
const keys = {
    ArrowLeft: false, a: false,
    ArrowRight: false, d: false,
    ArrowUp: false, w: false, " ": false,
    ArrowDown: false, s: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        togglePause();
    }
    if (gameState === 'CUTSCENE' && cutscenePhase >= 2 && cutsceneTimer > 140 && (e.key === ' ' || e.key === 'Enter')) {
        triggerVictory();
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Mobile Controls
['touchstart', 'mousedown'].forEach(evt => {
    document.getElementById('btnLeft').addEventListener(evt, (e) => { 
        e.preventDefault(); 
        if (gameState === 'CUTSCENE' && cutscenePhase >= 2 && cutsceneTimer > 140) { triggerVictory(); return; }
        keys.ArrowLeft = true; 
    });
    document.getElementById('btnRight').addEventListener(evt, (e) => { 
        e.preventDefault(); 
        if (gameState === 'CUTSCENE' && cutscenePhase >= 2 && cutsceneTimer > 140) { triggerVictory(); return; }
        keys.ArrowRight = true; 
    });
    document.getElementById('btnJump').addEventListener(evt, (e) => { 
        e.preventDefault(); 
        if (gameState === 'CUTSCENE' && cutscenePhase >= 2 && cutsceneTimer > 140) { triggerVictory(); return; }
        keys.ArrowUp = true; 
    });
    document.getElementById('btnShoot').addEventListener(evt, (e) => { 
        e.preventDefault(); 
        if (gameState === 'CUTSCENE' && cutscenePhase >= 2 && cutsceneTimer > 140) { triggerVictory(); return; }
        keys[" "] = true; 
    });
});

['touchend', 'mouseup', 'mouseleave'].forEach(evt => {
    document.getElementById('btnLeft').addEventListener(evt, (e) => { e.preventDefault(); keys.ArrowLeft = false; });
    document.getElementById('btnRight').addEventListener(evt, (e) => { e.preventDefault(); keys.ArrowRight = false; });
    document.getElementById('btnJump').addEventListener(evt, (e) => { e.preventDefault(); keys.ArrowUp = false; });
    document.getElementById('btnShoot').addEventListener(evt, (e) => { e.preventDefault(); keys[" "] = false; });
});

// Check touch support to show controls
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.getElementById('mobileControls').classList.remove('hidden');
}

// --- Levels ---
// 0: Air, 1: Solid block, 2: Collectible (Cupcake), 3: Enemy Spawner, 4: Gift, 5: Goal, 6: Spikes
// Secret room portal: 7
const levels = [
    {
        // Level 1: Birthday Meadow - Mario staircase: ground -> step1 -> step2 -> step3 -> step4 -> step5 -> GOAL
        map: [
            "1111111111111111111111111111111111111111",  // 0  ceiling
            "1000000000000000000000000000000000000001",  // 1
            "1000000000000000000000000000000000000001",  // 2
            "1000000000000000000000000000000000000001",  // 3
            "1000000000000000000000000000004000020001",  // 4  bonus cupcake at top right col 36, gift col 30
            "1000000000000000000000000000000000005001",  // 5  GOAL (portal) col 36
            "1000000000000000000000004000000001111001",  // 6  GOAL platform cols 33-36, gift col 24
            "1000000000000000000000000000011110000001",  // 7  step5 cols 28-31
            "1000000000000000000000011110000000000001",  // 8  step4 cols 22-25
            "1000000000000020084000000000000000000001",  // 9  cupcake col 14, ant, gift col 18
            "1000000000000000011110000000000000000001",  // 10 step3 cols 16-19
            "1000000020084000000000000000000000000001",  // 11 cupcake col 7, ant, gift col 12
            "1000000000011110000000000000000000000001",  // 12 step2 cols 10-13
            "1000000000000000000020000000000000000001",  // 13 extra cupcake
            "1000020800000000000000000000000000000001",  // 14 cupcake col 4 (reward on step1), ant
            "1001111000000000000000000000000000000001",  // 15 step1 cols 2-5
            "1000000000000000040000000000000000000001",  // 16 gift col 17
            "10P0020800000300000000000000000000000001",  // 17 player col2, cupcake col5, ant col6, bomb col12
            "1111111111111111111111111111111111111111",  // 18 ground floor
            "1111111111111111111111111111111111111111"   // 19
        ],
        targetScore: 3,
        bg: '#87CEEB',
        floorColor: '#7CFC00'
    },
    {
        // Level 2: Gift Valley
        // Platforms arranged as a zigzag staircase players must climb
        map: [
            "1111111111111111111111111111111111111111",  // 0
            "1000000000000000000000000000000000000001",  // 1
            "1000000000000000000000000000000000000001",  // 2
            "1000000000000000000000000000000000000001",  // 3
            "1000000000000000004000000000000000000001",  // 4 gift high right
            "1000000000000000111100000000000000000001",  // 5 platform under gift
            "1000000000000000000000000000020000000001",  // 6 cupcake high left
            "1001111000000000000000000000111000000001",  // 7 left HIGH + right
            "1000000000020080000000000000000000000001",  // 8  ant
            "1000000000111110000000000000000000000001",  // 9 MID platform center
            "1000000000000000000000000003000000000001",  // 10 bomb
            "1000000000000000008000011110000000000001",  // 11 ant on MID right
            "1000000000000000000000000000000000000001",  // 12
            "1000000020000000000000000000000004000001",  // 13 extra cupcake col 8, gift
            "1001111100000000000000000000001111100001",  // 14 STEP platforms
            "1000000000000000000000000000000000000001",  // 15
            "1000080000000000000000000000000800000001",  // 16 ants
            "10P9020030000080000000000020000000007051",  // 17 player, BACK-DOOR col3, cupcake col5, bomb, ant, items, portal
            "1111000001110000011111111000001111111111",  // 18 broken floor
            "1111666661116666611111111666661111111111"   // 19 spikes
        ],
        targetScore: 10,
        bg: '#FFB6C1',
        floorColor: '#FF69B4'
    },
    {
        // Level 3: Goblin Castle (Boss level)
        // Dramatic castle layout with stepped battlements and the boss at top right
        map: [
            "1111111111111111111111111111111111111111",  // 0
            "1000000000000000000000000000000000000001",  // 1
            "1000000000020002000200000000000000000001",  // 2 (+3 cupcakes)
            "1000000000000000000002000000000000000001",  // 3 cupcake high
            "1000000000000011110000000000000000000001",  // 4 HIGHEST platform
            "1000020000000000000000000000020000000001",  // 5 (+2 cupcakes)
            "1000000000000000000000000000030000000001",  // 6 bomb
            "1000000000000000000000001111100000000001",  // 7 castle rampart right
            "1001111002002000000000000000000000000001",  // 8 castle rampart left (+2 cupcakes)
            "1000000000000000002000000000000000000001",  // 9
            "1000000000000011100000001110000000000001",  // 10 mid platforms
            "1000000000000020000000200000000000000001",  // 11 (+2 cupcakes)
            "1000000000200000000000000000000000000001",  // 12 extra cupcake
            "1001110000000000000000000000000001110001",  // 13 step platforms
            "1000000200000000000000000000000200000001",  // 14 (+2 cupcakes)
            "1000000000000000000000000000000000000001",  // 15
            "1000000000000000000000000000000000000001",  // 16
            "100P002000000000000000000000B00B00000001",  // 17 ground with 2 bosses, extra cupcake
            "1111111111111111111111111111111111111111",  // 18
            "1111111111111111111111111111111111111111"   // 19
        ],
        targetScore: 0,
        bg: '#483D8B',
        floorColor: '#696969'
    }
];

// --- Engine Classes ---
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    update(target) {
        // Center on target
        this.x = target.x - GAME_WIDTH / 2;
        this.y = target.y - GAME_HEIGHT / 2 + 100;
        
        // Clamp to level bounds
        if (this.x < 0) this.x = 0;
        const maxScrollX = mapWidth * TILE_SIZE - GAME_WIDTH;
        if (this.x > maxScrollX) this.x = maxScrollX;
        
        // Vertical scroll
        if (this.y < 0) this.y = 0;
        const maxScrollY = mapHeight * TILE_SIZE - GAME_HEIGHT;
        if (this.y > maxScrollY) this.y = maxScrollY > 0 ? maxScrollY : 0;
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 48; // Taller than a tile so they must crouch under 1-tile gaps
        this.vx = 0;
        this.vy = 0;
        this.speed = MAX_SPEED;
        this.grounded = false;
        this.crouching = false;
        this.hp = 3;
        this.invulnerable = 0;
        this.facingRight = true;
        this.jumps = 0;
        this.maxJumps = 2;
        this.jumpKeyWasPressed = false;
    }

    update() {
        if (this.invulnerable > 0) this.invulnerable--;

        // Input
        if (keys.ArrowLeft || keys.a) {
            this.vx -= 1;
            this.facingRight = false;
        } else if (keys.ArrowRight || keys.d) {
            this.vx += 1;
            this.facingRight = true;
        } else {
            this.vx *= FRICTION;
        }
        
        // Crouch
        if ((keys.ArrowDown || keys.s) && this.grounded) {
            if (!this.crouching) {
                this.y += (this.h - this.h / 1.5); // Move top edge down
                this.crouching = true;
            }
            this.vx *= 0.5; // Slow down when crouching
        } else {
            if (this.crouching) {
                this.y -= (this.h - this.h / 1.5); // Move top edge back up
                this.crouching = false;
            }
        }

        // Clamp velocity
        if (this.vx > this.speed) this.vx = this.speed;
        if (this.vx < -this.speed) this.vx = -this.speed;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;

        // Jump
        const jumpPressed = keys.ArrowUp || keys.w;
        if (jumpPressed && !this.jumpKeyWasPressed) {
            if (this.grounded) {
                this.vy = JUMP_POWER;
                this.grounded = false;
                this.jumps = 1;
                playSound('jump');
            } else if (this.jumps < this.maxJumps) {
                this.vy = JUMP_POWER;
                this.jumps++;
                playSound('jump');
            }
        }
        this.jumpKeyWasPressed = jumpPressed;

        // Shoot
        const shootPressed = keys[" "];
        if (shootPressed && !this.shootKeyWasPressed) {
            const vx = this.facingRight ? 10 : -10;
            projectiles.push(new Projectile(this.x + this.w/2, this.y + this.h/2 - 10, vx, 0, true, 'orange', 8));
            playSound('jump'); // Or generic sound
        }
        this.shootKeyWasPressed = shootPressed;

        this.vy += GRAVITY;

        // Physics X
        this.x += this.vx;
        this.checkCollisions('x');

        // Physics Y
        this.y += this.vy;
        this.checkCollisions('y');
        
        // Death by falling
        if (this.y > mapHeight * TILE_SIZE) {
            this.takeDamage(100); // instant death
        }
    }

    checkCollisions(axis) {
        this.grounded = false;
        
        let currentH = this.crouching ? this.h / 1.5 : this.h;

        // Determine grid cells the player occupies
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.w - 0.1) / TILE_SIZE);
        const top = Math.floor(this.y / TILE_SIZE);
        const bottom = Math.floor((this.y + currentH - 0.1) / TILE_SIZE);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                const tile = getTile(c, r);
                if (tile === 1) { // Solid wall
                    const tx = c * TILE_SIZE;
                    const ty = r * TILE_SIZE;

                    if (axis === 'x') {
                        if (this.vx > 0) {
                            this.x = tx - this.w;
                            this.vx = 0;
                        } else if (this.vx < 0) {
                            this.x = tx + TILE_SIZE;
                            this.vx = 0;
                        }
                    } else if (axis === 'y') {
                        if (this.vy > 0) {
                            this.y = ty - currentH;
                            this.vy = 0;
                            this.grounded = true;
                            this.jumps = 0;
                        } else if (this.vy < 0) {
                            this.y = ty + TILE_SIZE;
                            this.vy = 0;
                        }
                    }
                } else if (tile === 6) { // Spikes
                    if (this.y + currentH > r * TILE_SIZE + 20) { // Simple hitbox for spikes
                        this.takeDamage(1);
                        this.vy = -8; // bounce off spikes
                    }
                }
            }
        }
    }

    takeDamage(amount) {
        if (this.invulnerable > 0) return;
        this.hp -= amount;
        playSound('hurt');
        this.invulnerable = 60; // 1 second of i-frames
        updateHUD();
        
        if (this.hp <= 0) {
            gameState = 'GAMEOVER';
            showOverlay('gameOverOverlay');
        }
    }

    draw(ctx, camX, camY) {
        // Flash if invulnerable
        if (this.invulnerable > 0 && Math.floor(Date.now() / 100) % 2 === 0) return;

        ctx.save();
        ctx.translate(this.x - camX + this.w/2, this.y - camY + this.h/2);
        if (!this.facingRight) ctx.scale(-1, 1);
        
        // Crouching offset
        const crouchOffset = this.crouching ? 10 : 0;
        
        ctx.save();
        ctx.translate(0, crouchOffset);

        // Legs
        ctx.strokeStyle = '#ffdfc4'; // Skin tone
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Left leg
        ctx.moveTo(-5, 20);
        ctx.lineTo(-7, 30 - crouchOffset/2);
        // Right leg
        ctx.moveTo(5, 20);
        ctx.lineTo(7, 30 - crouchOffset/2);
        ctx.stroke();

        // Arms (Hands)
        ctx.beginPath();
        // Left arm
        ctx.moveTo(-10, 5);
        ctx.lineTo(-15, 15);
        // Right arm
        ctx.moveTo(10, 5);
        ctx.lineTo(15, 15);
        ctx.stroke();

        // Body (Dress)
        ctx.fillStyle = '#ff7096'; // Dress
        ctx.beginPath();
        ctx.moveTo(-10, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(12, 0);
        ctx.lineTo(-12, 0);
        ctx.fill();
        
        // Pigtails (Hair)
        ctx.fillStyle = '#3a2e25'; // Hair
        ctx.beginPath();
        ctx.arc(-15, -10, 6, 0, Math.PI * 2);
        ctx.arc(15, -10, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#ffdfc4'; // Skin tone
        ctx.beginPath();
        ctx.arc(0, -15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair Top
        ctx.fillStyle = '#3a2e25'; // Hair
        ctx.beginPath();
        ctx.arc(0, -18, 16, Math.PI, 0);
        ctx.fill();
        
        // Crown
        ctx.fillStyle = '#ffd166'; // Gold
        ctx.beginPath();
        ctx.moveTo(-10, -32);
        ctx.lineTo(-5, -20);
        ctx.lineTo(0, -35);
        ctx.lineTo(5, -20);
        ctx.lineTo(10, -32);
        ctx.lineTo(10, -18);
        ctx.lineTo(-10, -18);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(5, -15, 2, 0, Math.PI * 2);
        ctx.arc(10, -15, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(7.5, -10, 3, 0, Math.PI);
        ctx.stroke();

        ctx.restore();

        ctx.restore();
    }
}

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 32;
        this.vx = 1.5;
        this.vy = 0;
        this.type = type;
        this.active = true;
    }
    update() {
        if (!this.active) return;
        
        if (this.type === 'ant') {
            // Apply gravity so ants stay on bricks
            this.vy = (this.vy || 0) + GRAVITY;
            this.y += this.vy;
            
            // Vertical collision with tiles
            const col = Math.floor((this.x + this.w / 2) / TILE_SIZE);
            const botRow = Math.floor((this.y + this.h) / TILE_SIZE);
            if (getTile(col, botRow) === 1) {
                this.y = botRow * TILE_SIZE - this.h;
                this.vy = 0;
            }
            
            // Horizontal patrol
            this.x += this.vx;
            // Turn at ledge (no tile below next step) or wall
            const ahead = this.vx > 0 ? Math.floor((this.x + this.w) / TILE_SIZE) : Math.floor(this.x / TILE_SIZE);
            const belowAhead = Math.floor((this.y + this.h + 2) / TILE_SIZE);
            if (getTile(ahead, Math.floor(this.y / TILE_SIZE)) === 1 || getTile(ahead, belowAhead) === 0) {
                this.vx *= -1;
            }
        } else if (this.type === 'bomb') {
            // Bombs also fall and rest on solid surfaces (stationary once landed)
            this.vy = (this.vy || 0) + GRAVITY;
            this.y += this.vy;
            const col = Math.floor((this.x + this.w / 2) / TILE_SIZE);
            const botRow = Math.floor((this.y + this.h) / TILE_SIZE);
            if (getTile(col, botRow) === 1) {
                this.y = botRow * TILE_SIZE - this.h;
                this.vy = 0;
            }
        }

        // Check collision with player
        if (rectIntersect(this, player)) {
            player.takeDamage(1);
        }
    }
    draw(ctx, camX, camY) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x - camX, this.y - camY);
        ctx.font = '32px sans-serif';
        if (this.type === 'bomb') {
            ctx.fillText('💣', 0, 30); 
        }
        else if (this.type === 'ant') ctx.fillText('🐜', 0, 30); // Ant
        else ctx.fillText('👹', 0, 30); // Goblin default
        ctx.restore();
    }
}

class Collectible {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 32;
        this.type = type; // 'cupcake', 'gift', 'portal'
        this.active = true;
        this.floatOffset = Math.random() * Math.PI;
        this.cooldown = 0;
    }
    update() {
        if (!this.active) return;
        if (this.cooldown > 0) this.cooldown--;
        
        // Check collision with player
        if (this.cooldown === 0 && rectIntersect(this, player)) {
            this.collect();
        }
    }
    collect() {
        if (this.type === 'portal') {
            const remainingGifts = collectibles.filter(c => c.type === 'gift' && c.active).length;
            
            if (remainingGifts === 0) {
                this.active = false;
                levelComplete();
            } else {
                let msg = `You must collect ${remainingGifts} more gift${remainingGifts !== 1 ? 's' : ''}!`;
                this.cooldown = 60; // 1 second cooldown so it doesn't spam
                player.x -= (player.vx || 2); // gently push player back
                showMessage(msg);
            }
        } else if (this.type === 'backportal') {
            this.cooldown = 60;
            player.x -= (player.vx || 2);
            gameState = 'PAUSED';
            showOverlay('confirmOverlay');
        } else {
            this.active = false;
            if (this.type === 'cupcake') {
                score++;
                if (score > 0 && score % 2 === 0) {
                    player.hp++; // Grant an extra life every 2 cupcakes indefinitely
                }
                playSound('collect');
                spawnParticles(this.x, this.y, '#ffd166');
                updateHUD();
            } else if (this.type === 'gift') {
                giftsFound++;
                playSound('collect');
                spawnParticles(this.x, this.y, '#ff477e');
                updateHUD();
                showSecretMessage();
            }
        }
    }
    draw(ctx, camX, camY) {
        if (!this.active) return;
        ctx.save();
        // Floating animation
        const yOffset = Math.sin(Date.now() / 200 + this.floatOffset) * 5;
        ctx.translate(this.x - camX, this.y - camY + yOffset);
        
        ctx.font = '32px sans-serif';
        if (this.type === 'cupcake') ctx.fillText('🧁', 0, 30);
        else if (this.type === 'gift') ctx.fillText('🎁', 0, 30);
        else if (this.type === 'portal') {
            // Draw glowing door
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 16;
            ctx.fillText('🚪', 0, 30);
            ctx.shadowBlur = 0;
        }
        else if (this.type === 'backportal') {
            // Draw back-door in a different glow
            ctx.shadowColor = '#ffaa00';
            ctx.shadowBlur = 16;
            ctx.fillText('🔙', 0, 30);
            ctx.shadowBlur = 0;
        }
        
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10 - 2;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.02;
        this.size = Math.random() * 5 + 3;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.life -= this.decay;
    }
    draw(ctx, camX, camY) {
        if (this.life <= 0) return;
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y - camY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class Projectile {
    constructor(x, y, vx, vy, isPlayer, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isPlayer = isPlayer;
        this.color = color;
        this.size = size;
        this.active = true;
        this.w = size * 2;
        this.h = size * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > mapWidth * TILE_SIZE || this.y < 0 || this.y > mapHeight * TILE_SIZE) {
            this.active = false;
        }
    }
    draw(ctx, camX, camY) {
        if (!this.active) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x - camX + this.size, this.y - camY + this.size, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Boss class
class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 64;
        this.hp = 10;
        this.maxHp = 10;
        this.vx = 2;
        this.vy = 0;
        this.active = true;
        this.state = 'patrol';
        this.timer = 0;
    }
    update() {
        if (!this.active) return;
        this.timer++;
        
        if (this.state === 'patrol') {
            this.x += this.vx;
            if (this.x < player.x - 400 || this.x > player.x + 400 || this.x < 100 || this.x > 1500) {
                this.vx *= -1;
            }
            
            // Boss shoots every 120 frames (2s)
            if (this.timer % 120 === 0) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 0) {
                    const speed = 6;
                    const vx = (dx / dist) * speed;
                    const vy = (dy / dist) * speed;
                    projectiles.push(new Projectile(this.x + this.w/2, this.y + this.h/2, vx, vy, false, 'red', 6));
                }
            }

            if (this.timer > 120 && Math.random() > 0.5) {
                this.state = 'jump';
                this.vy = -12;
                this.timer = 0;
            }
        } else if (this.state === 'jump') {
            this.x += this.vx * 1.5;
            this.y += this.vy;
            this.vy += GRAVITY;
            const floorY = (mapHeight - 3) * TILE_SIZE - this.h;
            if (this.y >= floorY) {
                this.y = floorY;
                this.vy = 0;
                this.state = 'patrol';
                this.timer = 0;
                // create shockwave effect (omitted for brevity)
            }
        }

        // Player stomp boss
        if (rectIntersect(player, this)) {
            if (player.vy > 0 && player.y + player.h < this.y + this.h / 2) {
                // Stomp
                player.vy = -10;
                this.takeDamage();
            } else {
                player.takeDamage(1);
            }
        }
    }
    takeDamage() {
        this.hp--;
        playSound('hurt');
        spawnParticles(this.x + this.w/2, this.y + this.h/2, '#000');
        if (this.hp <= 0) {
            this.active = false;
            spawnParticles(this.x + this.w/2, this.y + this.h/2, '#ffd700');
            const remainingActive = bosses.filter(b => b.active).length;
            if (remainingActive === 0 && gameState !== 'CUTSCENE' && gameState !== 'VICTORY') {
                triggerCutscene();
            }
        }
    }
    draw(ctx, camX, camY) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x - camX, this.y - camY);
        ctx.font = '64px sans-serif';
        ctx.fillText('👺', 0, 50);
        
        // Health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(0, -10, this.w, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(0, -10, this.w * (this.hp / this.maxHp), 5);
        ctx.restore();
    }
}

// --- Globals ---
let player;
let camera;
let currentMap = [];
let mapWidth = 0;
let mapHeight = 0;
let enemies = [];
let collectibles = [];
let particles = [];
let projectiles = [];
let bosses = [];
let bgmStarted = false;
let cutsceneTimer = 0;
let cutscenePhase = 0;
let cutsceneCakeX = 0;
let cutsceneCakeY = 0;
let cutsceneSamuelX = 0;
let cutsceneSamuelY = 0;
let victoryInterval = null;

function triggerCutscene() {
    gameState = 'CUTSCENE';
    cutsceneTimer = 0;
    cutscenePhase = 0;
    bosses = [];
    enemies = [];
    collectibles = [];
    projectiles = []; // Clear boss projectiles so none hit the player!

    if (player) {
        player.vx = 0;
        player.vy = 0;
        player.invulnerable = 99999;
    }

    // Hide HUD for cinematic cutscene presentation
    const hudEl = document.getElementById('hud');
    if (hudEl) hudEl.classList.add('hidden');

    // Smart placement of Cake and Samuel Bekoe near Elizabeth
    const pX = player ? player.x : 400;
    const pY = player ? player.y : (mapHeight - 3) * TILE_SIZE;

    // Check if player is near right edge of the level
    if (pX > (mapWidth * TILE_SIZE) - 340) {
        cutsceneCakeX = pX - 140;
        cutsceneSamuelX = cutsceneCakeX - 70;
        if (player) player.facingRight = false;
    } else {
        cutsceneCakeX = pX + 110;
        cutsceneSamuelX = cutsceneCakeX + 70;
        if (player) player.facingRight = true;
    }

    cutsceneCakeX = Math.max(80, Math.min(mapWidth * TILE_SIZE - 180, cutsceneCakeX));
    cutsceneSamuelX = Math.max(60, Math.min(mapWidth * TILE_SIZE - 120, cutsceneSamuelX));

    // Calculate ground height directly below cutsceneCakeX
    const col = Math.max(1, Math.min(mapWidth - 2, Math.floor(cutsceneCakeX / TILE_SIZE)));
    let groundRow = mapHeight - 2;
    for (let r = Math.max(0, Math.floor(pY / TILE_SIZE)); r < mapHeight; r++) {
        if (getTile(col, r) === 1) {
            groundRow = r;
            break;
        }
    }
    cutsceneCakeY = groundRow * TILE_SIZE - 54;
    cutsceneSamuelY = groundRow * TILE_SIZE - 68;

    playSound('win');
}

// --- Helper Functions ---
function drawRoundedRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
    } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

function getTile(col, row) {
    if (col < 0 || col >= mapWidth || row < 0 || row >= mapHeight) return 1; // Wall out of bounds
    const char = currentMap[row][col];
    return parseInt(char, 10);
}

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.w || 
             r2.x + r2.w < r1.x || 
             r2.y > r1.y + r1.h ||
             r2.y + r2.h < r1.y);
}

function spawnParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// --- Level Loading ---
function loadLevel(lvlIndex) {
    const lvl = levels[lvlIndex - 1];
    currentMap = [...lvl.map];
    mapHeight = currentMap.length;
    mapWidth = currentMap[0].length;
    
    enemies = [];
    collectibles = [];
    particles = [];
    projectiles = [];
    bosses = [];
    
    for (let r = 0; r < mapHeight; r++) {
        for (let c = 0; c < mapWidth; c++) {
            const tile = currentMap[r][c];
            if (tile === 'P') {
                const savedHp = player ? player.hp : 3;
                player = new Player(c * TILE_SIZE, r * TILE_SIZE);
                player.hp = savedHp; // Keep health between levels
                // Clear the tile logically
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === '2') {
                collectibles.push(new Collectible(c * TILE_SIZE, r * TILE_SIZE, 'cupcake'));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === '3') {
                enemies.push(new Enemy(c * TILE_SIZE, r * TILE_SIZE, 'bomb'));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === '8') {
                enemies.push(new Enemy(c * TILE_SIZE, r * TILE_SIZE, 'ant'));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === '4') {
                collectibles.push(new Collectible(c * TILE_SIZE, r * TILE_SIZE, 'gift'));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === '5') {
                collectibles.push(new Collectible(c * TILE_SIZE, r * TILE_SIZE, 'portal'));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === '9') {
                collectibles.push(new Collectible(c * TILE_SIZE, r * TILE_SIZE, 'backportal'));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            } else if (tile === 'B') {
                bosses.push(new Boss(c * TILE_SIZE, r * TILE_SIZE));
                let rowStr = currentMap[r];
                currentMap[r] = rowStr.substr(0, c) + '0' + rowStr.substr(c + 1);
            }
        }
    }
    
    camera = new Camera();
    updateHUD();
    document.getElementById('levelDisplay').innerText = `Level ${currentLevel}`;
}

// --- Main Loop ---
function update() {
    if (gameState === 'PLAYING') {
        player.update();
        camera.update(player);
        
        enemies.forEach(e => e.update());
        collectibles.forEach(c => c.update());
        bosses.forEach(b => b.update());
        
        // Remove inactive entities
        enemies = enemies.filter(e => e.active);
        collectibles = collectibles.filter(c => c.active);
        bosses = bosses.filter(b => b.active);
        
        // Projectiles
        projectiles.forEach(p => {
            p.update();
            if (!p.active) return;
            
            if (p.isPlayer) {
                bosses.forEach(b => {
                    if (b.active && rectIntersect(p, b)) {
                        b.takeDamage();
                        p.active = false;
                    }
                });
                
                enemies.forEach(e => {
                    if (e.active && e.type !== 'bomb' && rectIntersect(p, e)) {
                        e.active = false;
                        p.active = false;
                        spawnParticles(e.x + e.w/2, e.y + e.h/2, '#555');
                        playSound('hurt'); // Or a small pop sound
                        score += 2; // Extra points for killing an enemy
                        updateHUD();
                    }
                });
            }
            
            if (!p.isPlayer) {
                if (rectIntersect(p, player)) {
                    player.takeDamage(1);
                    p.active = false;
                }
            }
        });
        projectiles = projectiles.filter(p => p.active);
        
        // Particles
        particles.forEach(p => p.update());
        particles = particles.filter(p => p.life > 0);
    } else if (gameState === 'CUTSCENE') {
        cutsceneTimer++;

        // Smooth camera glide to frame Elizabeth, Cake, and Samuel Bekoe perfectly
        if (player) {
            const focusX = (player.x + cutsceneSamuelX) / 2;
            const focusY = (player.y + cutsceneSamuelY) / 2;
            const maxScrollX = mapWidth * TILE_SIZE - GAME_WIDTH;
            const targetCamX = Math.max(0, Math.min(Math.max(0, maxScrollX), focusX - GAME_WIDTH / 2));
            const maxScrollY = mapHeight * TILE_SIZE - GAME_HEIGHT;
            const targetCamY = Math.max(0, Math.min(Math.max(0, maxScrollY), focusY - GAME_HEIGHT / 2 + 30));
            camera.x += (targetCamX - camera.x) * 0.08;
            camera.y += (targetCamY - camera.y) * 0.08;
        }

        if (cutscenePhase === 0 && cutsceneTimer > 45) {
            cutscenePhase = 1;
            spawnParticles(cutsceneSamuelX, cutsceneSamuelY + 20, '#4a90e2');
            spawnParticles(cutsceneSamuelX, cutsceneSamuelY + 20, '#ffd700');
        } else if (cutscenePhase === 1 && cutsceneTimer > 110) {
            cutscenePhase = 2;
            spawnParticles(cutsceneCakeX + 32, cutsceneCakeY, '#ff7096');
        } else if (cutscenePhase === 2 && cutsceneTimer > 800) { // ~13.5s auto-advance
            triggerVictory();
        }

        // Keep updating particles during cutscene
        particles.forEach(p => p.update());
        particles = particles.filter(p => p.life > 0);
    }
    // Level banner countdown
    if (levelBannerTimer > 0) levelBannerTimer--;
}

function draw() {
    if (gameState === 'MENU' || gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAMEOVER' || gameState === 'VICTORY' || gameState === 'CUTSCENE') {
        const lvl = levels[currentLevel - 1];
        
        // Background
        ctx.fillStyle = lvl.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (!camera) return;

        // Background Clouds (simple parallax)
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '64px sans-serif';
        for(let i=0; i<5; i++) {
            ctx.fillText('☁️', ((i * 300) - (camera.x * 0.2)) % (mapWidth*TILE_SIZE), 100 + (i%2)*50);
        }

        ctx.save();
        
        // Draw Map
        ctx.fillStyle = lvl.floorColor;
        for (let r = 0; r < mapHeight; r++) {
            for (let c = 0; c < mapWidth; c++) {
                const tile = getTile(c, r);
                if (tile === 1) {
                    ctx.fillRect(c * TILE_SIZE - camera.x, r * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
                    // Add some pattern
                    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                    ctx.strokeRect(c * TILE_SIZE - camera.x, r * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
                } else if (tile === 6) {
                    ctx.fillStyle = 'gray';
                    ctx.beginPath();
                    const px = c * TILE_SIZE - camera.x;
                    const py = r * TILE_SIZE - camera.y + TILE_SIZE;
                    ctx.moveTo(px, py);
                    ctx.lineTo(px + TILE_SIZE/2, py - TILE_SIZE/2);
                    ctx.lineTo(px + TILE_SIZE, py);
                    ctx.fill();
                    ctx.fillStyle = lvl.floorColor; // reset
                }
            }
        }
        
        // Draw Entities
        collectibles.forEach(c => c.draw(ctx, camera.x, camera.y));
        enemies.forEach(e => e.draw(ctx, camera.x, camera.y));
        bosses.forEach(b => b.draw(ctx, camera.x, camera.y));
        
        // Projectiles
        projectiles.forEach(p => p.draw(ctx, camera.x, camera.y));
        
        // Player
        if (player) player.draw(ctx, camera.x, camera.y);
        
        if (gameState === 'CUTSCENE') {
            ctx.save();
            ctx.translate(-camera.x, -camera.y);

            const cakeX = cutsceneCakeX;
            const cakeY = cutsceneCakeY;

            // Sparkles around cake
            if (cutsceneTimer % 12 === 0) {
                spawnParticles(cakeX + 32, cakeY + 20, '#ffd700');
            }

            // Draw Cake
            ctx.font = '64px sans-serif';
            ctx.fillText('🎂', cakeX, cakeY + 50);

            if (cutscenePhase >= 1) {
                // Draw Samuel Bekoe popping out with a celebratory bounce
                const bobbing = Math.sin(cutsceneTimer * 0.12) * 3;
                const samuelX = cutsceneSamuelX;
                const samuelY = cutsceneSamuelY + bobbing;

                // Samuel Body
                ctx.fillStyle = '#4a90e2'; // Blue shirt
                ctx.beginPath();
                ctx.moveTo(samuelX - 15, samuelY + 40);
                ctx.lineTo(samuelX + 15, samuelY + 40);
                ctx.lineTo(samuelX + 20, samuelY + 70);
                ctx.lineTo(samuelX - 20, samuelY + 70);
                ctx.fill();

                // Head
                ctx.fillStyle = '#8d5524'; // Skin tone
                ctx.beginPath();
                ctx.arc(samuelX, samuelY + 20, 15, 0, Math.PI * 2);
                ctx.fill();

                // Friendly Eyes & Smile
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(samuelX - 5, samuelY + 18, 2.5, 0, Math.PI * 2);
                ctx.arc(samuelX + 5, samuelY + 18, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(samuelX - 5, samuelY + 18, 1.2, 0, Math.PI * 2);
                ctx.arc(samuelX + 5, samuelY + 18, 1.2, 0, Math.PI * 2);
                ctx.fill();

                // Hair
                ctx.fillStyle = '#000000'; // Black hair
                ctx.beginPath();
                ctx.arc(samuelX, samuelY + 15, 16, Math.PI, 0);
                ctx.fill();

                // Waving hand
                ctx.fillStyle = '#8d5524';
                ctx.beginPath();
                const waveArm = Math.sin(cutsceneTimer * 0.18) * 8;
                ctx.arc(samuelX + 22, samuelY + 28 + waveArm, 6, 0, Math.PI * 2);
                ctx.fill();

                // Name tag
                ctx.fillStyle = '#ff477e';
                ctx.font = 'bold 16px "Fredoka One", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⭐ Samuel Bekoe ⭐', samuelX, samuelY - 8);
                ctx.textAlign = 'left';

                if (cutscenePhase >= 2) {
                    // Chat Bubble - Clamped safely inside visible screen view!
                    const bubbleW = Math.min(300, canvas.width - 40);
                    const bubbleH = 142;
                    
                    let bubbleX = samuelX - bubbleW / 2;
                    let bubbleY = samuelY - bubbleH - 22;

                    // Clamping bubble within current camera viewport
                    const minWorldX = camera.x + 20;
                    const maxWorldX = camera.x + canvas.width - bubbleW - 20;
                    bubbleX = Math.max(minWorldX, Math.min(maxWorldX, bubbleX));
                    
                    if (bubbleY < camera.y + 15) {
                        bubbleY = samuelY + 80;
                    }

                    // Shadow
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    drawRoundedRect(ctx, bubbleX + 4, bubbleY + 4, bubbleW, bubbleH, 14);
                    ctx.fill();

                    // Bubble body
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#ff7096';
                    ctx.lineWidth = 3;
                    drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 14);
                    ctx.fill();
                    ctx.stroke();

                    // Bubble tail pointing towards Samuel
                    const tailX = Math.max(bubbleX + 24, Math.min(bubbleX + bubbleW - 24, samuelX));
                    ctx.beginPath();
                    if (bubbleY < samuelY) {
                        ctx.moveTo(tailX - 10, bubbleY + bubbleH);
                        ctx.lineTo(samuelX, samuelY - 4);
                        ctx.lineTo(tailX + 10, bubbleY + bubbleH);
                    } else {
                        ctx.moveTo(tailX - 10, bubbleY);
                        ctx.lineTo(samuelX, samuelY + 75);
                        ctx.lineTo(tailX + 10, bubbleY);
                    }
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                    ctx.stroke();

                    // Hide tail inner stroke overlap
                    ctx.fillStyle = '#ffffff';
                    if (bubbleY < samuelY) {
                        ctx.fillRect(tailX - 9, bubbleY + bubbleH - 3, 18, 6);
                    } else {
                        ctx.fillRect(tailX - 9, bubbleY - 3, 18, 6);
                    }

                    // Message Header
                    ctx.fillStyle = '#ff477e';
                    ctx.font = 'bold 15px "Fredoka One", sans-serif';
                    ctx.fillText('💌 Samuel Bekoe says:', bubbleX + 16, bubbleY + 25);

                    // Message Lines
                    ctx.fillStyle = '#222222';
                    ctx.font = 'bold 13px sans-serif';
                    ctx.fillText('Happy Birthday Elizabeth! 🎉🎂', bubbleX + 16, bubbleY + 50);
                    ctx.font = '13px sans-serif';
                    ctx.fillText('Congrats on bagging your UCC degree! 🎓', bubbleX + 16, bubbleY + 70);
                    ctx.fillText('The hottest & smartest graduate in Ghana! 🔥', bubbleX + 16, bubbleY + 90);
                    ctx.fillText('Enjoy your cake & soft life, Queen Lizzy! ✨', bubbleX + 16, bubbleY + 110);

                    // Skip prompt (pulsing)
                    const pulseAlpha = 0.5 + 0.5 * Math.sin(cutsceneTimer * 0.12);
                    ctx.fillStyle = `rgba(255, 71, 126, ${pulseAlpha})`;
                    ctx.font = 'bold 11px sans-serif';
                    ctx.textAlign = 'right';
                    ctx.fillText('[Tap / Press Space to continue ⏩]', bubbleX + bubbleW - 14, bubbleY + 130);
                    ctx.textAlign = 'left';
                }
            }
            ctx.restore();
        }

        // Draw Particles
        particles.forEach(p => p.draw(ctx, camera.x, camera.y));
        
        ctx.restore();

        // Draw level banner if active
        if (levelBannerTimer > 0) {
            const alpha = Math.min(1, levelBannerTimer / 30);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(canvas.width/2 - 160, canvas.height/2 - 36, 320, 72);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 36px Fredoka One, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(levelBannerText, canvas.width/2, canvas.height/2 + 12);
            ctx.textAlign = 'left';
            ctx.restore();
        }
    }
}

let lastTime = 0;
const fpsInterval = 1000 / 60;

function gameLoop(timestamp) {
    if (!timestamp) timestamp = performance.now();
    if (!lastTime) lastTime = timestamp;
    
    const elapsed = timestamp - lastTime;
    
    if (elapsed > fpsInterval) {
        // Adjust for any minor offset to keep it smooth
        lastTime = timestamp - (elapsed % fpsInterval);
        update();
        draw();
    }
    
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- UI & Logic Flow ---
const overlays = document.querySelectorAll('.overlay');
function hideAllOverlays() {
    overlays.forEach(o => o.classList.add('hidden'));
}
function showOverlay(id) {
    hideAllOverlays();
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function startGame() {
    if (victoryInterval) {
        clearInterval(victoryInterval);
        victoryInterval = null;
    }
    if (!bgmStarted) {
        bgm.play().catch(e => console.log('Audio play prevented by browser'));
        bgmStarted = true;
    }
    
    currentLevel = 1;
    score = 0;
    giftsFound = 0;
    // shuffleArray(giftData); // Disabled so gifts cycle through all 6 pictures before repeating
    player = null; // Reset player completely so they spawn with 3 hearts
    startTime = Date.now();
    loadLevel(currentLevel);
    gameState = 'PLAYING';
    
    hideAllOverlays();
    document.getElementById('hud').classList.remove('hidden');
}

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        showOverlay('pauseOverlay');
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        hideAllOverlays();
    }
}

function updateHUD() {
    if (!player) return;
    let heartsHTML = '';
    for (let i = 0; i < player.hp; i++) {
        heartsHTML += '❤️';
    }
    document.getElementById('hearts').innerHTML = heartsHTML;
    document.getElementById('cupcakeCount').innerText = score;
    document.getElementById('giftCount').innerText = giftsFound;
}

function showMessage(msg) {
    document.getElementById('messageText').innerText = msg;
    showOverlay('messageOverlay');
    gameState = 'PAUSED';
}

function showSecretMessage() {
    // Smart non-repeating gift drawer
    const currentGift = getNextGift();
    
    document.getElementById('messagePic').classList.remove('hidden');
    
    const imgEl = document.getElementById('secretPic');
    const vidEl = document.getElementById('secretVid');
    
    if (currentGift.img.endsWith('.mp4')) {
        imgEl.style.display = 'none';
        imgEl.src = '';
        vidEl.style.display = 'block';
        vidEl.src = '../Pics/' + currentGift.img;
        vidEl.play().catch(e => {});
    } else {
        vidEl.pause();
        vidEl.style.display = 'none';
        vidEl.src = '';
        imgEl.style.display = 'block';
        imgEl.onerror = function() {
            if (!this.triedFallback) {
                this.triedFallback = true;
                this.src = 'Pics/' + currentGift.img;
            }
        };
        imgEl.triedFallback = false;
        imgEl.src = '../Pics/' + currentGift.img;
    }
    
    showMessage(currentGift.msg);
}

function levelComplete() {
    spawnParticles(player.x, player.y, '#ffd700');
    if (currentLevel < levels.length) {
        currentLevel++;
        score = 0; // Reset score for new level
        loadLevel(currentLevel);
        showLevelBanner(`Level ${currentLevel}`);
    } else {
        triggerCutscene();
    }
}

function goBackLevel() {
    if (currentLevel > 1) {
        currentLevel--;
        score = 0;
        loadLevel(currentLevel);
        showLevelBanner(`Back to Level ${currentLevel}`);
    }
}

let levelBannerTimer = 0;
let levelBannerText = '';
function showLevelBanner(text) {
    levelBannerText = text;
    levelBannerTimer = 180; // 3 seconds at 60fps
}

function triggerVictory() {
    gameState = 'VICTORY';
    playSound('win');
    const hudEl = document.getElementById('hud');
    if (hudEl) hudEl.classList.add('hidden');
    
    const timeSecs = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(timeSecs / 60).toString().padStart(2, '0');
    const s = (timeSecs % 60).toString().padStart(2, '0');
    
    document.getElementById('finalCupcakes').innerText = score;
    document.getElementById('finalGifts').innerText = giftsFound;
    document.getElementById('finalTime').innerText = `${m}:${s}`;
    
    // Fireworks effect on canvas
    if (victoryInterval) clearInterval(victoryInterval);
    victoryInterval = setInterval(() => {
        if (gameState === 'VICTORY') {
            const x = Math.random() * canvas.width + camera.x;
            const y = Math.random() * (canvas.height/2) + camera.y;
            const colors = ['#ff0', '#f0f', '#0ff', '#0f0', '#f00', '#ff7096'];
            const color = colors[Math.floor(Math.random()*colors.length)];
            spawnParticles(x, y, color);
        }
    }, 350);

    showOverlay('victoryOverlay');
}

// Canvas tap/click to advance cutscene
canvas.addEventListener('click', () => {
    if (gameState === 'CUTSCENE' && cutscenePhase >= 2 && cutsceneTimer > 140) {
        triggerVictory();
    }
});

// --- Event Listeners ---
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('instructionsBtn').addEventListener('click', () => showOverlay('instructionsOverlay'));
document.getElementById('creditsBtn').addEventListener('click', () => showOverlay('creditsOverlay'));
document.getElementById('backFromInstBtn').addEventListener('click', () => showOverlay('menuOverlay'));
document.getElementById('backFromCreditsBtn').addEventListener('click', () => showOverlay('menuOverlay'));

document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', () => {
    loadLevel(currentLevel);
    gameState = 'PLAYING';
    hideAllOverlays();
});
document.getElementById('menuBtn').addEventListener('click', () => {
    gameState = 'MENU';
    document.getElementById('hud').classList.add('hidden');
    showOverlay('menuOverlay');
});

document.getElementById('retryBtn').addEventListener('click', () => {
    loadLevel(currentLevel);
    gameState = 'PLAYING';
    hideAllOverlays();
});
document.getElementById('goMenuBtn').addEventListener('click', () => {
    gameState = 'MENU';
    document.getElementById('hud').classList.add('hidden');
    showOverlay('menuOverlay');
});

document.getElementById('replayBtn').addEventListener('click', startGame);

document.getElementById('dismissOrientationBtn').addEventListener('click', () => {
    document.getElementById('orientation-overlay').classList.add('dismissed');
});

document.getElementById('closeMsgBtn').addEventListener('click', () => {
    gameState = 'PLAYING';
    hideAllOverlays();
});

document.getElementById('confirmYesBtn').addEventListener('click', () => {
    gameState = 'PLAYING';
    hideAllOverlays();
    goBackLevel();
});

document.getElementById('confirmNoBtn').addEventListener('click', () => {
    gameState = 'PLAYING';
    hideAllOverlays();
});

// Start loop
gameLoop();
