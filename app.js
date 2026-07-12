'use strict';
/* ============================================================
   HOPE — app.js  |  Problem Statement 3
   ============================================================ */

// ─── STATE ──────────────────────────────────────────────────
const state = {
  selectedAmount: 1000,
  activeCrisis: null,
  storyIndex: 0,
  storyAutoplay: null,
  donorCounts: { 'crisis-flood': 187, 'crisis-earthquake': 124, 'crisis-medical': 98 },
  notifications: [
    {
      id: 1, unread: true, icon: '🌊',
      title: 'Assam Flood — Supply confirmed',
      desc: '500 hygiene kits delivered to Kamrup District. Photo receipt available.',
      time: '2 hours ago'
    },
    {
      id: 2, unread: true, icon: '🏔️',
      title: 'Nepal Earthquake — School rebuilt',
      desc: '140 children returned to class today. Field report from Sunita Karki.',
      time: '6 hours ago'
    }
  ]
};

const IMPACT_MAP = {
  250:  { icon: '💧', text: '₹250 provides 2 days of clean drinking water for a family of 4' },
  500:  { icon: '🍱', text: '₹500 provides emergency food rations for a family for 2 days' },
  1000: { icon: '🍱', text: '₹1,000 provides emergency food for a family of 4 for 3 days' },
  2500: { icon: '⛺', text: '₹2,500 funds one emergency shelter tent for a displaced family' },
  5000: { icon: '🏥', text: '₹5,000 provides full cholera treatment for 8 patients' }
};

const CRISIS_INFO = {
  'crisis-flood': {
    title: 'Assam Floods',
    emoji: '🌊',
    desc: 'Your support reaches 2,400 displaced families. Every rupee is GPS-tracked and field-confirmed.'
  },
  'crisis-earthquake': {
    title: 'Nepal Earthquake',
    emoji: '🏔️',
    desc: 'Your support helps 1,800 children get safe shelter and return to school. Fully audited.'
  },
  'crisis-medical': {
    title: 'South Sudan Medical',
    emoji: '🏥',
    desc: 'Your support sends life-saving medicine to cholera patients. Supply delivered within 8 hrs.'
  }
};

const PAGE_CONTENT = {
  mission: `
    <span class="page-tag">Our Mission</span>
    <h2>Why We Built Hope</h2>
    <p>During natural disasters and humanitarian crises, people want to help — but they're stopped by uncertainty. Where does the money go? Is this organization legitimate? How do I know it makes a difference?</p>
    <p>Hope was built to eliminate that uncertainty. We believe that transparency, simplicity, and emotional connection are the three pillars of meaningful emergency giving. Every design decision we make serves those three values.</p>
    <h4>Our Core Commitments</h4>
    <p>🔒 <strong>Financial Security:</strong> 100% RBI-compliant payment processing. No financial data stored on our servers.</p>
    <p>📊 <strong>Full Audit Trail:</strong> Every transaction is independently audited and logged on our public ledger.</p>
    <p>📬 <strong>Real Updates:</strong> You receive actual field photos and coordinator reports — not automated emails.</p>
    <p>🌐 <strong>Zero Hidden Fees:</strong> 92% of your donation goes to relief. 5% covers logistics. 3% covers platform costs. Always published.</p>
    <p>We are a registered non-profit. Our accounts are publicly available. We will never ask for trust — only offer evidence of it.</p>
  `,
  ngos: `
    <span class="page-tag">Verified Partners</span>
    <h2>Our Partner NGOs</h2>
    <p>Every organization listed below is legally registered, field-verified, and independently audited before joining the Hope network. We review each partner every 6 months.</p>
    <div class="ngo-list">
      <div class="ngo-item">
        <span class="ngo-flag">🇮🇳</span>
        <div><div class="ngo-name">Assam Relief Foundation</div><div class="ngo-type">Flood Response · Registered 2008</div></div>
        <span class="ngo-check">✅ Verified & Active</span>
      </div>
      <div class="ngo-item">
        <span class="ngo-flag">🇳🇵</span>
        <div><div class="ngo-name">Himalayan SafeBuild Trust</div><div class="ngo-type">Earthquake Response · Registered 2015</div></div>
        <span class="ngo-check">✅ Verified & Active</span>
      </div>
      <div class="ngo-item">
        <span class="ngo-flag">🇸🇸</span>
        <div><div class="ngo-name">Riverside Medical Partners</div><div class="ngo-type">Medical Emergency · Registered 2011</div></div>
        <span class="ngo-check">✅ Verified & Active</span>
      </div>
      <div class="ngo-item">
        <span class="ngo-flag">🇧🇩</span>
        <div><div class="ngo-name">Bengal Clean Water Initiative</div><div class="ngo-type">Water Relief · Registered 2019</div></div>
        <span class="ngo-check">✅ Verified & Active</span>
      </div>
      <div class="ngo-item">
        <span class="ngo-flag">🌍</span>
        <div><div class="ngo-name">Global Emergency Supply Chain</div><div class="ngo-type">Logistics & Delivery · Registered 2014</div></div>
        <span class="ngo-check">✅ Verified & Active</span>
      </div>
    </div>
  `,
  ledger: `
    <span class="page-tag">Public Ledger</span>
    <h2>Every Rupee — Tracked & Published</h2>
    <p>This is a real-time view of our public transaction ledger. Every inflow (donation) and outflow (supply purchase, logistics) is recorded here within 24 hours of processing.</p>
    <table class="ledger-table">
      <thead>
        <tr><th>Date</th><th>Campaign</th><th>Type</th><th>Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr><td>Jul 11</td><td>Assam Floods</td><td>Donation Pool</td><td class="ledger-amount">+₹3,20,000</td><td>✅ Audited</td></tr>
        <tr><td>Jul 11</td><td>Assam Floods</td><td>Hygiene Kit Supply</td><td class="ledger-amount" style="color:#FF8A80">-₹1,80,000</td><td>📍 GPS Delivered</td></tr>
        <tr><td>Jul 10</td><td>Nepal Earthquake</td><td>Donation Pool</td><td class="ledger-amount">+₹2,40,000</td><td>✅ Audited</td></tr>
        <tr><td>Jul 10</td><td>Nepal Earthquake</td><td>School Build Materials</td><td class="ledger-amount" style="color:#FF8A80">-₹2,24,000</td><td>📍 GPS Delivered</td></tr>
        <tr><td>Jul 09</td><td>South Sudan</td><td>Donation Pool</td><td class="ledger-amount">+₹1,60,000</td><td>✅ Audited</td></tr>
        <tr><td>Jul 09</td><td>South Sudan</td><td>ORS + Antibiotics</td><td class="ledger-amount" style="color:#FF8A80">-₹98,000</td><td>📍 GPS Delivered</td></tr>
        <tr><td>Jul 08</td><td>Platform Ops</td><td>Operational Cost (3%)</td><td class="ledger-amount" style="color:#FF8A80">-₹14,700</td><td>📊 Published</td></tr>
      </tbody>
    </table>
    <p style="margin-top:16px;font-size:0.8rem;">Full audit report available for download. Last independent audit: July 10, 2026 by Deloitte India.</p>
  `,
  contact: `
    <span class="page-tag">Contact Us</span>
    <h2>Get in Touch</h2>
    <p>Have a question, want to partner with us, or need help with your donation? We respond to every message within 24 hours.</p>
    <p>📧 <strong>Email:</strong> support@hope-relief.org</p>
    <p>📞 <strong>Phone:</strong> +91 98765 43210 (Mon–Sat, 9am–6pm IST)</p>
    <p>🏢 <strong>Office:</strong> Hope Relief Foundation, 42 Anna Salai, Chennai 600002</p>
    <form class="contact-form" onsubmit="submitContact(event)">
      <input type="text" class="form-input" placeholder="Your name" required />
      <input type="email" class="form-input" placeholder="Your email" required />
      <textarea class="form-input" placeholder="Your message..." required style="resize:vertical;min-height:100px;padding:12px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:#fff;font-size:0.9rem;font-family:inherit;"></textarea>
      <button type="submit" class="btn-submit" style="max-width:200px;">Send Message →</button>
    </form>
  `
};

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  animateCounters();
  animateProgressBars();
  renderNotifications();
  updateSubmitBtn();
  startStoryAutoplay();
  initPacker();
});

// ─── NAVBAR ──────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  const isOpen = menu.classList.contains('open');
  
  menu.classList.toggle('open', !isOpen);
  hamburger.classList.toggle('open', !isOpen);
}

// ─── PARTICLES (Ken Burns complement) ───────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create subtle floating light dots
  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── COUNTER ANIMATION ───────────────────────────────────────
function animateCounters() {
  const els = document.querySelectorAll('[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      countUp(el, target, prefix);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
}

function countUp(el, target, prefix) {
  const duration = 1800;
  const start = performance.now();
  const run = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(target * eased);
    el.textContent = prefix + val.toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = prefix + target.toLocaleString('en-IN');
  };
  requestAnimationFrame(run);
}

// ─── PROGRESS BARS ───────────────────────────────────────────
function animateProgressBars() {
  const fills = document.querySelectorAll('.card-progress-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 250);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
}

// ─── DONATION MODAL ──────────────────────────────────────────
function openModal(crisisId) {
  state.activeCrisis = crisisId;
  const info = CRISIS_INFO[crisisId];
  const overlay = document.getElementById('modalOverlay');

  document.getElementById('modalHeader').innerHTML = `
    <h3>${info.emoji} Support ${info.title}</h3>
    <p>${info.desc}</p>
  `;

  // Reset form
  document.getElementById('donationForm').reset();
  selectAmount(1000, true);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(event, forced) {
  if (forced || !event || event.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ─── AMOUNT SELECTION ────────────────────────────────────────
function selectAmount(val, skipCustom) {
  // Deselect all
  document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));

  const customWrap = document.getElementById('customWrap');

  if (val === 'custom') {
    // Highlight Custom button
    document.querySelector('.amount-btn[data-val="custom"]').classList.add('selected');
    customWrap.style.display = 'block';
    document.getElementById('impactPreview').style.display = 'none';
    state.selectedAmount = 0;
  } else {
    state.selectedAmount = val;
    // Highlight matching button
    const btn = document.querySelector(`.amount-btn[data-val="${val}"]`);
    if (btn) btn.classList.add('selected');
    if (!skipCustom) customWrap.style.display = 'none';
    showImpact(val);
  }
  updateSubmitBtn();
}

function showImpact(amount) {
  const preview = document.getElementById('impactPreview');
  const text    = document.getElementById('impactText');
  const icon    = document.getElementById('impactIcon');
  preview.style.display = 'flex';

  const match = IMPACT_MAP[amount] || {
    icon: '❤️',
    text: `₹${Number(amount).toLocaleString('en-IN')} goes directly to verified emergency relief`
  };
  icon.textContent = match.icon;
  text.textContent = match.text;
}

function updateCustom(val) {
  const amount = parseInt(val) || 0;
  state.selectedAmount = amount;
  updateSubmitBtn();
  showImpact(amount);
}

function updateSubmitBtn() {
  const btn = document.getElementById('submitText');
  if (!btn) return;
  const a = state.selectedAmount;
  btn.textContent = a > 0
    ? `Donate ₹${Number(a).toLocaleString('en-IN')} →`
    : 'Enter an amount →';
}

// ─── DONATION SUBMIT ─────────────────────────────────────────
function submitDonation(e) {
  e.preventDefault();
  const name   = document.getElementById('donorName').value.trim();
  const email  = document.getElementById('donorEmail').value.trim();
  const amount = state.selectedAmount;

  if (!amount || amount <= 0) {
    showToast('Please select a donation amount', '');
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  document.getElementById('submitText').textContent = 'Processing…';

  setTimeout(() => {
    closeModal(null, true);

    const info = CRISIS_INFO[state.activeCrisis];
    showToast(
      `Thank you ${name}! ₹${Number(amount).toLocaleString('en-IN')} confirmed.`,
      `Your support for ${info.title} is on its way. Field update incoming.`
    );

    // Push a new receipt notification
    addNotification({
      icon: info.emoji,
      title: `Receipt: ₹${Number(amount).toLocaleString('en-IN')} → ${info.title}`,
      desc: `Donation confirmed, ${name}. GPS-tracked supply dispatch initiated. Field photo update coming within 48 hrs.`,
      time: 'Just now'
    });

    // Increment donor count on card
    state.donorCounts[state.activeCrisis]++;
    const el = document.getElementById(`donors-${state.activeCrisis}`);
    if (el) el.textContent = `${state.donorCounts[state.activeCrisis]} donors`;

    document.getElementById('donationForm').reset();
    btn.disabled = false;
    updateSubmitBtn();
  }, 1400);
}

// ─── NOTIFICATION PANEL ──────────────────────────────────────
function renderNotifications() {
  const list  = document.getElementById('notifList');
  const badge = document.getElementById('notifBadge');
  if (!list) return;

  const unread = state.notifications.filter(n => n.unread).length;
  badge.textContent = unread;
  badge.style.display = unread > 0 ? 'flex' : 'none';

  list.innerHTML = '';
  if (state.notifications.length === 0) {
    list.innerHTML = `<div style="padding:32px 20px;text-align:center;color:rgba(255,255,255,0.3);font-size:0.88rem;">No notifications yet.<br/>They'll appear here after you donate.</div>`;
    return;
  }

  state.notifications.forEach(n => {
    const item = document.createElement('div');
    item.className = `notif-item ${n.unread ? 'unread' : ''}`;
    item.onclick = () => markRead(n.id);
    item.innerHTML = `
      <div class="notif-item-icon">${n.icon}</div>
      <div class="notif-item-body">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-desc">${n.desc}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>
    `;
    list.appendChild(item);
  });
}

function addNotification(notif) {
  state.notifications.unshift({ id: Date.now(), unread: true, ...notif });
  renderNotifications();
}

function markRead(id) {
  const n = state.notifications.find(x => x.id === id);
  if (n) { n.unread = false; renderNotifications(); }
}

function markAllRead() {
  state.notifications.forEach(n => n.unread = false);
  renderNotifications();
}

function toggleNotifPanel() {
  const panel   = document.getElementById('notifPanel');
  const overlay = document.getElementById('notifOverlay');
  const isOpen  = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  if (!isOpen) {
    // Mark all read after viewing
    setTimeout(markAllRead, 3000);
  }
}

function closeNotifPanel() {
  document.getElementById('notifPanel').classList.remove('open');
  document.getElementById('notifOverlay').classList.remove('open');
}

// ─── STORIES SLIDER ──────────────────────────────────────────
function slideStory(dir) {
  const slides = document.querySelectorAll('.story-slide');
  const dots   = document.querySelectorAll('.dot');
  const total  = slides.length;

  slides[state.storyIndex].classList.remove('active');
  dots[state.storyIndex].classList.remove('active');

  state.storyIndex = (state.storyIndex + dir + total) % total;

  slides[state.storyIndex].classList.add('active');
  dots[state.storyIndex].classList.add('active');
}

function goToStory(idx) {
  const slides = document.querySelectorAll('.story-slide');
  const dots   = document.querySelectorAll('.dot');

  slides[state.storyIndex].classList.remove('active');
  dots[state.storyIndex].classList.remove('active');

  state.storyIndex = idx;

  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
}

function startStoryAutoplay() {
  state.storyAutoplay = setInterval(() => slideStory(1), 6000);

  // Pause on hover
  const slider = document.getElementById('storiesSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(state.storyAutoplay));
    slider.addEventListener('mouseleave', () => {
      state.storyAutoplay = setInterval(() => slideStory(1), 6000);
    });
  }
}

// ─── FAQ ACCORDION ───────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

  // Open clicked (unless it was already open)
  if (!isOpen) item.classList.add('open');
}

// ─── PAGE MODALS ─────────────────────────────────────────────
function openPageModal(page) {
  const overlay = document.getElementById('pageModalOverlay');
  const content = document.getElementById('pageModalContent');
  content.innerHTML = PAGE_CONTENT[page] || '<p>Content not found.</p>';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePageModal(event, forced) {
  if (forced || !event || event.target === document.getElementById('pageModalOverlay')) {
    document.getElementById('pageModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ─── CONTACT FORM ─────────────────────────────────────────────
function submitContact(e) {
  e.preventDefault();
  closePageModal(null, true);
  showToast('Message sent!', 'We\'ll reply within 24 hours. Thank you for reaching out.');
}

// ─── NEWSLETTER ─────────────────────────────────────────────
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address', '');
    return;
  }
  addNotification({
    icon: '📬',
    title: 'Crisis Alerts Activated',
    desc: `You'll receive field updates and emergency alerts at ${email}. Welcome to Hope.`,
    time: 'Just now'
  });
  showToast('Subscribed!', `Crisis alerts and field updates will be sent to ${email}`);
  input.value = '';
}

// ─── TOAST ─────────────────────────────────────────────────
function showToast(title, msg) {
  const toast    = document.getElementById('successToast');
  const titleEl  = document.getElementById('toastTitle');
  const msgEl    = document.getElementById('toastMsg');
  titleEl.textContent = title;
  msgEl.textContent   = msg;
  toast.classList.remove('hidden');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(closeToast, 7000);
}

function closeToast() {
  document.getElementById('successToast').classList.add('hidden');
}

// ─── INTERACTIVE PACKER STATE & DATA ────────────────────────
const packerState = {
  activeCrisis: 'crisis-flood',
  budget: 1500
};

const PACKER_ITEMS = {
  'crisis-flood': [
    { name: 'Water Purifying Drops (Family Kit)', cost: 100, icon: '💧' },
    { name: 'Dry Food Packs (Multi-Meal)', cost: 250, icon: '🍱' },
    { name: 'Mosquito Protection Net', cost: 300, icon: '🦟' },
    { name: 'Hygiene & Sanitizer Pack', cost: 500, icon: '🧴' }
  ],
  'crisis-earthquake': [
    { name: 'Thermal Fleece Blanket', cost: 400, icon: '🧣' },
    { name: 'Solar Emergency Lantern', cost: 500, icon: '☀️' },
    { name: 'Ground Tarpaulin Sheet', cost: 600, icon: '⛺' },
    { name: 'Child Learning & Activity Kit', cost: 350, icon: '📚' }
  ],
  'crisis-medical': [
    { name: 'ORS Packets (Box of 20)', cost: 100, icon: '💊' },
    { name: 'Emergency Antibiotics Course', cost: 300, icon: '🩺' },
    { name: 'Sterile Trauma Dressing Set', cost: 200, icon: '💉' },
    { name: 'Clean Water Jerrican (20L)', cost: 150, icon: '🚰' }
  ]
};

const PACKER_INFO = {
  'crisis-flood': { name: 'Assam Flood Relief Kit', dest: 'Kamrup District, Assam' },
  'crisis-earthquake': { name: 'Nepal Quake Shelter Kit', dest: 'Gorkha District, Nepal' },
  'crisis-medical': { name: 'South Sudan Medical Kit', dest: 'Riverside Clinic, South Sudan' }
};

function initPacker() {
  updatePackerUI();
}

function setPackerCrisis(crisisId) {
  packerState.activeCrisis = crisisId;
  
  // Update active button highlights
  document.querySelectorAll('.packer-crisis-btn').forEach(btn => btn.classList.remove('active'));
  
  const idMap = {
    'crisis-flood': 'btn-pack-flood',
    'crisis-earthquake': 'btn-pack-earthquake',
    'crisis-medical': 'btn-pack-medical'
  };
  const activeBtn = document.getElementById(idMap[crisisId]);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Reset slider budget to default for new crisis
  packerState.budget = 1500;
  const slider = document.getElementById('packerBudgetSlider');
  if (slider) slider.value = 1500;
  
  const display = document.getElementById('packerBudgetValue');
  if (display) display.textContent = packerState.budget.toLocaleString('en-IN');
  
  updatePackerUI();
}

function updatePackerBudget(val) {
  packerState.budget = parseInt(val) || 500;
  const display = document.getElementById('packerBudgetValue');
  if (display) display.textContent = packerState.budget.toLocaleString('en-IN');
  updatePackerUI();
}

function updatePackerUI() {
  const info = PACKER_INFO[packerState.activeCrisis];
  const nameEl = document.getElementById('packerKitName');
  const destEl = document.getElementById('packerKitDestination');
  const totalEl = document.getElementById('packerKitTotal');
  
  if (nameEl) nameEl.textContent = info.name;
  if (destEl) destEl.textContent = `Destination: ${info.dest}`;
  if (totalEl) totalEl.textContent = packerState.budget.toLocaleString('en-IN');

  const container = document.getElementById('packerBoxItems');
  if (!container) return;

  container.innerHTML = '';

  // Pack items proportionally based on budget
  const items = PACKER_ITEMS[packerState.activeCrisis];
  let remaining = packerState.budget;
  const packedCounts = {};

  items.forEach(item => {
    packedCounts[item.name] = 0;
  });

  // Simple distribution loop: distribute item by item as long as budget permits
  let addedAny = true;
  while (remaining >= 50 && addedAny) {
    addedAny = false;
    for (const item of items) {
      if (remaining >= item.cost) {
        packedCounts[item.name]++;
        remaining -= item.cost;
        addedAny = true;
      }
    }
  }

  // Render rows
  items.forEach(item => {
    const qty = packedCounts[item.name];
    if (qty > 0) {
      const row = document.createElement('div');
      row.className = 'kit-item-row';
      row.innerHTML = `
        <span class="kit-item-icon">${item.icon}</span>
        <span class="kit-item-name">${item.name}</span>
        <span class="kit-item-qty" id="qty-${item.name.replace(/\s+/g, '-')}">${qty}x</span>
      `;
      container.appendChild(row);
    }
  });

  if (container.children.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:0.85rem;">Drag slider to add items...</div>`;
  }
}

function donatePackedKit() {
  const amt = packerState.budget;
  openModal(packerState.activeCrisis);
  selectAmount(amt);
}

// ─── KEYBOARD ESC ──────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal(null, true);
  closePageModal(null, true);
  closeNotifPanel();
  closeToast();
});
