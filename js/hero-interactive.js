/* ── CARROT. Hero Interactive ──────────────────────────────────── */

(function () {
  /* ── DOM refs ─────────────────────────────────────────────────── */
  const hero         = document.getElementById('hero');
  const stampLayer   = document.getElementById('stamp-layer');
  const fpLayer      = document.getElementById('footprint-layer');
  const lineup       = document.getElementById('criminal-lineup');
  const cursorEl     = document.getElementById('cursor');
  const hintEl       = document.getElementById('hero-hint');
  const counterEl    = document.getElementById('stamp-counter');
  const toast        = document.getElementById('toast');
  const sizeSlider   = document.getElementById('size-slider');
  const shapeSlider  = document.getElementById('shape-slider');
  const fdm          = document.getElementById('fdm');

  if (!hero) return;   /* safety: only run on index.html */

  /* ── SVG carrot stamp shape ───────────────────────────────────── */
  /* Flat 2D graphic style — bold solid shapes, no outlines, no gradients */
  function carrotSVG(bodyColor) {
    const leaf = '#6BBF4E';
    return `<svg viewBox="0 -18 80 108" xmlns="http://www.w3.org/2000/svg">
      <!-- Body: tapered, broad at top, soft tip at bottom -->
      <path d="M40,90 C20,70 8,44 12,20 C16,2 28,0 40,0 C52,0 64,2 68,20 C72,44 60,70 40,90Z" fill="${bodyColor}"/>
      <!-- Left leaf: swept left and up -->
      <path d="M32,8 C24,-4 4,2 4,10 C10,18 28,16 32,8Z" fill="${leaf}"/>
      <!-- Center leaf: upright ellipse -->
      <ellipse cx="40" cy="-5" rx="5" ry="13" fill="${leaf}"/>
      <!-- Right leaf: swept right and up -->
      <path d="M48,8 C56,-4 76,2 76,10 C70,18 52,16 48,8Z" fill="${leaf}"/>
    </svg>`;
  }

  /* ── State ────────────────────────────────────────────────────── */
  const INK_COLORS = ['#FF6200', '#0055BF', '#FF3EB5', '#6BBF4E'];
  let colorIdx     = 0;
  let stampCount   = 0;
  let stampSize    = parseInt(sizeSlider.value, 10);  /* px */
  let distortion   = 0;
  let firstClick   = true;
  let criminals    = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let nearCriminal = null;   /* criminal whose footprint cursor is near */

  /* ── Custom cursor ────────────────────────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.left = mouseX + 'px';
    cursorEl.style.top  = mouseY + 'px';
  });

  /* ── Sliders ──────────────────────────────────────────────────── */
  sizeSlider.addEventListener('input', (e) => {
    stampSize = parseInt(e.target.value, 10);
  });

  shapeSlider.addEventListener('input', (e) => {
    distortion = parseInt(e.target.value, 10);
    if (fdm) fdm.setAttribute('scale', (distortion * 0.9).toFixed(1));
  });

  /* ── Stamp on click ───────────────────────────────────────────── */
  hero.addEventListener('click', (e) => {
    /* Don't stamp if clicking a slider or catching a criminal */
    if (e.target.closest('.hero-slider')) return;
    if (nearCriminal) { catchCriminal(nearCriminal); return; }

    placeStamp(e.clientX, e.clientY);
  });

  /* Double-click: clear stamps */
  hero.addEventListener('dblclick', (e) => {
    if (e.target.closest('.hero-slider')) return;
    stampLayer.innerHTML = '';
    stampCount = 0;
    updateCounter();
  });

  /* Touch support */
  hero.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    placeStamp(t.clientX, t.clientY);
  }, { passive: true });

  /* ── Place stamp ──────────────────────────────────────────────── */
  function placeStamp(x, y) {
    /* Hide hint after first interaction */
    if (firstClick && hintEl) {
      firstClick = false;
      hintEl.classList.add('hidden');
    }

    const color = INK_COLORS[colorIdx % INK_COLORS.length];
    colorIdx++;

    const rot   = (Math.random() * 50 - 25).toFixed(1);
    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.innerHTML = carrotSVG(color);
    stamp.style.cssText = [
      `left: ${x}px`,
      `top: ${y}px`,
      `width: ${stampSize}px`,
      `height: ${stampSize}px`,
      `--rot: ${rot}deg`,
      distortion > 4 ? `filter: url(#distort)` : ''
    ].filter(Boolean).join('; ');

    stampLayer.appendChild(stamp);
    stampCount++;
    updateCounter();

    /* Cap at 60 stamps */
    const all = stampLayer.querySelectorAll('.stamp');
    if (all.length > 60) all[0].remove();

    splatter(x, y, color);

    /* Spawn criminal (60% chance, max 3 active) */
    if (criminals.filter(c => !c.caught && !c.escaped).length < 3) {
      if (Math.random() < 0.60) spawnCriminal(x, y);
    }
  }

  function updateCounter() {
    if (counterEl) counterEl.textContent = stampCount > 0 ? `× ${stampCount}` : '';
  }

  /* ── Ink splatter ─────────────────────────────────────────────── */
  function splatter(x, y, color) {
    for (let i = 0; i < 5; i++) {
      const angle  = (Math.PI * 2 / 5) * i + Math.random() * 0.8;
      const dist   = 20 + Math.random() * 30;
      const dx     = (Math.cos(angle) * dist).toFixed(1);
      const dy     = (Math.sin(angle) * dist).toFixed(1);
      const dot    = document.createElement('div');
      dot.className = 'splatter-dot';
      dot.style.cssText = [
        `left: ${x}px`,
        `top: ${y}px`,
        `background: ${color}`,
        `width: ${3 + Math.random() * 5}px`,
        `height: ${3 + Math.random() * 5}px`,
        `--dx: ${dx}px`,
        `--dy: ${dy}px`
      ].join('; ');
      hero.appendChild(dot);
      setTimeout(() => dot.remove(), 500);
    }
  }

  /* ── Criminal ─────────────────────────────────────────────────── */
  const ANIMALS = ['🐭', '🐹', '🐰', '🦔', '🦦', '🐿️', '🦫'];

  function spawnCriminal(x, y) {
    criminals.push(new Criminal(x, y));
  }

  class Criminal {
    constructor(x, y) {
      this.x      = x;
      this.y      = y;
      this.angle  = Math.random() * Math.PI * 2;
      this.speed  = 1.2 + Math.random() * 0.8;
      this.animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      this.footprintEls = [];
      this.frameCount   = 0;
      this.stepEvery    = 22;
      this.escaped      = false;
      this.caught       = false;
    }

    update() {
      /* Smooth random walk */
      this.angle += (Math.random() - 0.5) * 0.28;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      this.frameCount++;
      if (this.frameCount % this.stepEvery === 0) {
        this.stampFootprint();
      }

      /* Mark latest 3 footprints as catchable */
      this.footprintEls.forEach((fp, i) => {
        const isCatchable = i >= this.footprintEls.length - 3;
        fp.classList.toggle('catchable', isCatchable);
        fp.dataset.idx = i;
      });

      /* Escaped? */
      const pad = 80;
      if (this.x < -pad || this.x > window.innerWidth + pad ||
          this.y < -pad || this.y > window.innerHeight + pad) {
        this.escaped = true;
        this.fadeFootprints();
      }
    }

    stampFootprint() {
      const rot = (this.angle * 180 / Math.PI + 90).toFixed(1);
      const fp  = document.createElement('div');
      fp.className = 'footprint';
      fp.textContent = '🐾';
      fp.style.cssText = `left:${this.x}px; top:${this.y}px; --rot:${rot}deg;`;
      fp._criminal = this;  /* back-reference for catch */
      fpLayer.appendChild(fp);
      this.footprintEls.push(fp);
    }

    fadeFootprints() {
      this.footprintEls.forEach((fp, i) => {
        fp.classList.remove('catchable');
        fp.style.transition = `opacity ${1.5 + i * 0.08}s ease`;
        fp.style.opacity = '0';
        setTimeout(() => fp.remove(), (1500 + i * 80) + 500);
      });
    }
  }

  /* ── Catch criminal ───────────────────────────────────────────── */
  function catchCriminal(criminal) {
    if (criminal.caught) return;
    criminal.caught = true;

    criminal.footprintEls.forEach(fp => {
      fp.classList.remove('catchable');
      fp.style.transition = 'opacity 0.4s ease';
      fp.style.opacity = '0';
      setTimeout(() => fp.remove(), 450);
    });

    /* Add silhouette to lineup */
    const sil = document.createElement('div');
    sil.className = 'silhouette';
    sil.textContent = criminal.animal;
    lineup.appendChild(sil);

    showToast('범인 검거! Criminal caught.');
    cursorEl.textContent = '🥕';
    nearCriminal = null;
  }

  /* ── Mouse proximity check ────────────────────────────────────── */
  function checkProximity() {
    let closest = null;
    let minDist = 44;

    criminals.forEach(c => {
      if (c.caught || c.escaped) return;
      /* Check last 3 footprints */
      const recent = c.footprintEls.slice(-3);
      recent.forEach(fp => {
        const rect = fp.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const d    = Math.hypot(mouseX - cx, mouseY - cy);
        if (d < minDist) { minDist = d; closest = c; }
      });
    });

    if (closest !== nearCriminal) {
      nearCriminal = closest;
      cursorEl.textContent = closest ? '🔍' : '🥕';
    }
  }

  /* ── Toast ────────────────────────────────────────────────────── */
  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ── Animation loop ───────────────────────────────────────────── */
  function loop() {
    criminals.forEach(c => { if (!c.caught && !c.escaped) c.update(); });
    criminals = criminals.filter(c => !c.caught && c.footprintEls.length > 0
      ? true    /* keep until footprints are gone */
      : !c.caught
    );
    checkProximity();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

})();
