const products = [
  {
    id: 'pencil-lens',
    name: 'Pencil + Lens',
    emoji: '🥕',
    tagline: 'Writes. Then investigates.',
    /* Vivid orange bg + blue halftone dots — carrot color */
    cardBg: '#FF6200',
    bubbleClass: 'speech-bubble-orange',
    functions: {
      stationery: { label: 'As stationery', desc: '0.5mm mechanical pencil. Field notes, evidence sketches, suspect composites. Replaceable lead.' },
      equipment:  { label: 'As equipment',  desc: '3× optical magnifier. Twist cap to deploy. UV lamp compatible for night operations.' }
    },
    sizes: {
      S: { name: 'S — Rabbit / Fox', desc: '110mm / 18g. Fits a document pocket completely.', badge: 'Best Seller' },
      M: { name: 'M — Standard',     desc: '140mm / 24g. Fits most builds. Standard pen holder.', badge: '' },
      L: { name: 'L — Bear / Rhino', desc: '170mm / 31g. 28mm lens, extended magnification.', badge: '' }
    },
    irony: "It's just a pencil. There's a magnifier inside — but that's also just office supplies."
  },
  {
    id: 'tape-measure',
    name: 'Tape + Measure',
    emoji: '🥕',
    tagline: 'Marks the layout. Marks the scene.',
    cardBg: '#0055BF',   /* already bright */
    bubbleClass: 'speech-bubble-blue',
    functions: {
      stationery: { label: 'As stationery', desc: '24mm masking tape. Layout work, note fixing, packaging. Peels clean every time.' },
      equipment:  { label: 'As equipment',  desc: '5m reinforced tape measure. Field survey, evidence zone perimeter. Lock button.' }
    },
    sizes: {
      S: { name: 'S', desc: '18mm tape / 3m measure. Indoor scenes only.', badge: '' },
      M: { name: 'M', desc: '24mm tape / 5m measure. Standard field response.', badge: 'Recommended' },
      L: { name: 'L', desc: '36mm tape / 8m measure. Wide-area operations.', badge: '' }
    },
    irony: "Office supplies. Completely, unambiguously, beyond all doubt — office supplies."
  },
  {
    id: 'file-board',
    name: 'File + Board',
    emoji: '🥕',
    tagline: 'Stores. Then erases.',
    cardBg: '#FF3EB5',   /* already bright */
    bubbleClass: 'speech-bubble-pink',
    functions: {
      stationery: { label: 'As stationery', desc: 'A4 file holder. Document sorting, approval workflows, instant clipboard mode.' },
      equipment:  { label: 'As equipment',  desc: 'Flip-side whiteboard. Briefing diagrams, suspect maps, operation notes — write and wipe. Marker included.' }
    },
    sizes: {
      S: { name: 'S — A5', desc: 'A5 / 120g. One-hand operation on patrol.', badge: '' },
      M: { name: 'M — A4', desc: 'A4 / 180g. Full standard document capacity.', badge: 'Standard' },
      L: { name: 'L — A3', desc: 'A3 / 290g. Field briefing. Maximum board area.', badge: '' }
    },
    irony: "Just a clipboard. Flip it and it's a board — but that's still just office supplies. Really."
  },
  {
    id: 'tumbler-spray',
    name: 'Tumbler + Spray',
    emoji: '🥕',
    tagline: 'Drinks. Then neutralizes.',
    cardBg: '#6BBF4E',   /* already bright */
    bubbleClass: 'speech-bubble-yellow',
    functions: {
      stationery: { label: 'As stationery', desc: '350ml insulated tumbler. 12hr heat, 8hr cold. Stakeout caffeine supply — not optional.' },
      equipment:  { label: 'As equipment',  desc: 'Grip-twist pepper spray. Same form, immediate deployment. 3m effective range. Rechargeable.' }
    },
    sizes: {
      S: { name: 'S — Espresso',  desc: '200ml / 180g. Barely enough for one.', badge: '' },
      M: { name: 'M — Americano', desc: '350ml / 240g. Optimal for 2hr stakeouts.', badge: 'Best' },
      L: { name: 'L — Bear Size', desc: '500ml / 310g. Night-shift operations.', badge: '' }
    },
    irony: "It's a beverage container. It's hot. In several senses — be careful."
  }
];

function makeCard(p) {
  /* Riso-style: slightly muted bg + halftone dots */
  const bgStyle = [
    `background-color: ${p.cardBg}`,
    `background-image: radial-gradient(circle, rgba(244,237,216,0.28) 24%, transparent 25%)`,
    `background-size: 9px 9px`
  ].join(';');

  return `
    <a href="product.html?id=${p.id}" class="product-card">
      <div class="product-card-visual" style="${bgStyle}">
        <span class="card-carrot-ghost">${p.emoji}</span>
        <span class="card-carrot">${p.emoji}</span>
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-tagline">${p.tagline}</div>
        <div class="size-badges">
          <span class="size-badge">S</span>
          <span class="size-badge">M</span>
          <span class="size-badge">L</span>
        </div>
      </div>
    </a>`;
}

/* Render conveyor belt cards — products duplicated for seamless loop */
function renderProductCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  /* Duplicate so the animation can loop seamlessly (-50% = back to start) */
  const doubled = [...products, ...products];
  container.innerHTML = doubled.map(makeCard).join('');
}

/* Render product detail */
function renderProductDetail() {
  const id      = new URLSearchParams(window.location.search).get('id');
  const product = products.find(p => p.id === id) || products[0];

  document.title = `${product.name} — CARROT`;

  document.getElementById('product-name').textContent    = product.name;
  document.getElementById('product-tagline').textContent = product.tagline;

  const header = document.getElementById('product-header');
  header.style.backgroundColor   = product.cardBg;
  header.style.backgroundImage   = `radial-gradient(circle, rgba(244,237,216,0.22) 26%, transparent 27%)`;
  header.style.backgroundSize    = '9px 9px';

  /* Carrot emojis */
  ['product-emoji', 'product-emoji-ghost'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = product.emoji;
  });

  /* Functions */
  document.getElementById('func-stationery-label').textContent = product.functions.stationery.label;
  document.getElementById('func-stationery-desc').textContent  = product.functions.stationery.desc;
  document.getElementById('func-equipment-label').textContent  = product.functions.equipment.label;
  document.getElementById('func-equipment-desc').textContent   = product.functions.equipment.desc;

  /* Irony bubble */
  const bubble = document.getElementById('product-bubble');
  bubble.className = `speech-bubble ${product.bubbleClass}`;
  document.getElementById('product-irony').textContent = product.irony;

  const tail = document.getElementById('bubble-tail');
  if (tail) tail.style.borderTopColor = product.cardBg;

  /* Size selector */
  const selector = document.getElementById('size-selector');
  const infoEl   = document.getElementById('size-info');

  function updateSize(key) {
    const s = product.sizes[key];
    selector.querySelectorAll('.size-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.size === key)
    );
    infoEl.innerHTML = `
      <div class="size-info-title">${s.name}</div>
      <div class="size-info-desc">${s.desc}</div>
      ${s.badge ? `<div class="size-info-badge">${s.badge}</div>` : ''}
    `;
  }

  selector.innerHTML = ['S','M','L'].map(k =>
    `<button class="size-btn" data-size="${k}">${k}</button>`
  ).join('');

  selector.querySelectorAll('.size-btn').forEach(btn =>
    btn.addEventListener('click', () => updateSize(btn.dataset.size))
  );
  updateSize('M');

  /* Prev / next */
  const idx  = products.findIndex(p => p.id === product.id);
  const prev = products[idx - 1];
  const next = products[idx + 1];

  const prevEl = document.getElementById('product-prev');
  const nextEl = document.getElementById('product-next');

  if (prevEl) {
    prev ? (prevEl.href = `product.html?id=${prev.id}`, prevEl.textContent = `← ${prev.name}`)
         : (prevEl.style.visibility = 'hidden');
  }
  if (nextEl) {
    next ? (nextEl.href = `product.html?id=${next.id}`, nextEl.textContent = `${next.name} →`)
         : (nextEl.style.visibility = 'hidden');
  }
}
