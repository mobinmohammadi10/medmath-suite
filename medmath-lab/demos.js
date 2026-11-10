/* =========================================================
   MedMath Lab — interactive demos (canvas + controls)
   Each demo: DEMOS.<id>(mountElement)
   ========================================================= */
"use strict";

const DEMOS = {};
window.DEMOS = DEMOS; // ensure cross-script access even if a bundler wraps this

/* helpers */
function mkcv(mount, w, h) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  mount.appendChild(cv);
  return cv;
}
function axis(ctx, w, h, ox, oy) {
  ctx.strokeStyle = "rgba(255,255,255,.25)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
}
function slider(mount, label, min, max, step, val, fmt) {
  const d = document.createElement("div");
  d.className = "ctl";
  const display = fmt ? fmt(val) : val;
  d.innerHTML = `<b>${label}: <span>${display}</span></b>`;
  const inp = document.createElement("input");
  inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = val;
  d.appendChild(inp);
  mount.appendChild(d);
  const span = d.querySelector("span");
  inp.addEventListener("input", () => {
    const v = parseFloat(inp.value);
    span.textContent = fmt ? fmt(v) : v;
  });
  return { inp, get: () => parseFloat(inp.value), span };
}
function out(mount, cls) {
  const d = document.createElement("div");
  d.className = cls || "demo-output";
  mount.appendChild(d);
  return d;
}
function note(mount, text) {
  const d = document.createElement("div");
  d.className = "demo-note";
  d.textContent = text;
  mount.appendChild(d);
}

/* ---------- 1. Line graph: y = a·x + b ---------- */
DEMOS.funcgraph = function (mount) {
  mount.innerHTML = `<div class="demo-title">📈 Live line: y = a·x + b</div>`;
  const cv = mkcv(mount, 320, 220);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sA = slider(ctr, "slope a", -5, 5, 0.5, 1);
  const sB = slider(ctr, "intercept b", -8, 8, 1, 0);
  const outp = out(mount);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, ox = w / 2, oy = h / 2, sc = 12;
    ctx.clearRect(0, 0, w, h);
    axis(ctx, w, h, ox, oy);
    // grid
    ctx.strokeStyle = "rgba(255,255,255,.07)";
    for (let gx = 0; gx < w; gx += sc * 2) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
    for (let gy = 0; gy < h; gy += sc * 2) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
    // line
    const a = sA.get(), b = sB.get();
    ctx.strokeStyle = "#2dd4bf"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < w; px++) {
      const x = (px - ox) / sc;
      const y = a * x + b;
      const py = oy - y * sc;
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    outp.textContent = `y = ${a}x + ${b}`;
  }
  sA.inp.addEventListener("input", draw);
  sB.inp.addEventListener("input", draw);
  draw();
  note(mount, "Slope = steepness. Negative slope = falling line. b slides it up/down.");
};

/* ---------- 2. Linear vs exponential growth ---------- */
DEMOS.growthdemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">🚀 Linear vs. exponential</div>`;
  const cv = mkcv(mount, 320, 220);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sT = slider(ctr, "steps t", 0, 30, 1, 8);
  const outp = out(mount);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 24;
    ctx.clearRect(0, 0, w, h);
    const tmax = 30;
    const emax = 2 ** tmax; // exp cap for scale
    // linear line (gold)
    ctx.strokeStyle = "#ffd34d"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, pad); ctx.stroke();
    // exponential (red)  y = 2^t scaled to fit
    ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let t = 0; t <= tmax; t++) {
      const px = pad + (t / tmax) * (w - 2 * pad);
      const py = h - pad - ((2 ** t) / emax) * (h - 2 * pad);
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    // markers at t
    const t = sT.get();
    const px = pad + (t / tmax) * (w - 2 * pad);
    ctx.fillStyle = "#ffd34d";
    const ly = h - pad - (t / tmax) * (h - 2 * pad);
    ctx.beginPath(); ctx.arc(px, ly, 5, 0, 7); ctx.fill();
    ctx.fillStyle = "#f87171";
    const ey = h - pad - ((2 ** t) / emax) * (h - 2 * pad);
    ctx.beginPath(); ctx.arc(px, ey, 5, 0, 7); ctx.fill();
    outp.innerHTML = `steps: <b>${t}</b> &nbsp;|&nbsp; linear: <b style="color:#ffd34d">${t}</b> &nbsp;|&nbsp; exponential 2ᵗ: <b style="color:#f87171">${2 ** t}</b>`;
  }
  sT.inp.addEventListener("input", draw);
  draw();
  note(mount, "Same starting speed — very different destiny. This is why parameter counts explode.");
};

/* ---------- 3. Log scale number line ---------- */
DEMOS.logscale = function (mount) {
  mount.innerHTML = `<div class="demo-title">🔬 Logarithmic ruler</div>`;
  const cv = mkcv(mount, 420, 110);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sN = slider(ctr, "number n", 0, 4, 0.01, 2, (v) => (10 ** v).toPrecision(3));
  const outp = out(mount);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 34;
    ctx.clearRect(0, 0, w, h);
    const y = h - 42, oy = h - 42;
    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.beginPath(); ctx.moveTo(pad, oy); ctx.lineTo(w - pad, oy); ctx.stroke();
    // ticks at powers of 10, equally spaced (that's the log magic)
    ctx.fillStyle = "#a9b0cf"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
    for (let p = 0; p <= 4; p++) {
      const x = pad + (p / 4) * (w - 2 * pad);
      ctx.strokeStyle = "rgba(255,255,255,.3)";
      ctx.beginPath(); ctx.moveTo(x, oy - 6); ctx.lineTo(x, oy + 6); ctx.stroke();
      ctx.fillText("10" + "⁰¹²³⁴"[p], x, oy + 22);
    }
    const n = sN.get();
    const x = pad + (n / 4) * (w - 2 * pad);
    ctx.fillStyle = "#2dd4bf";
    ctx.beginPath(); ctx.arc(x, oy - 14, 7, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(45,212,191,.5)";
    ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy - 20); ctx.stroke();
    outp.textContent = `log₁₀(n) = ${n.toFixed(2)}`;
  }
  sN.inp.addEventListener("input", draw);
  draw();
  note(mount, "Equal distances on a log ruler = equal RATIOS (×10), not equal amounts. This is how cross-entropy sees probabilities.");
};

/* ---------- 4. Dot product as match score ---------- */
DEMOS.dotproduct = function (mount) {
  mount.innerHTML = `<div class="demo-title">🎯 Dot product: a · b</div>`;
  const cv = mkcv(mount, 300, 200);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sAX = slider(ctr, "a·x", -5, 5, 1, 3);
  const sAY = slider(ctr, "a·y", -5, 5, 1, 2);
  const sBX = slider(ctr, "b·x", -5, 5, 1, 2);
  const sBY = slider(ctr, "b·y", -5, 5, 1, -1);
  const outp = out(mount);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, ox = w / 2, oy = h / 2, sc = 16;
    ctx.clearRect(0, 0, w, h);
    axis(ctx, w, h, ox, oy);
    function arrow(vx, vy, color) {
      const ex = ox + vx * sc, ey = oy - vy * sc;
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, 7); ctx.fill();
    }
    arrow(sAX.get(), sAY.get(), "#2dd4bf");
    arrow(sBX.get(), sBY.get(), "#ffc247");
    const dot = sAX.get() * sBX.get() + sAY.get() * sBY.get();
    const mood = dot > 12 ? " — strong match! 🔥" : dot > 0 ? " — related 😊" : dot === 0 ? " — perpendicular / unrelated 😐" : " — pointing opposite 😠";
    outp.innerHTML = `a · b = <b>${dot}</b>${mood}`;
  }
  [sAX, sAY, sBX, sBY].forEach(s => s.inp.addEventListener("input", draw));
  draw();
  note(mount, "Match the directions (values) and the score grows. This is 'similarity' inside AI — the sum of multiplied features.");
};

/* ---------- 5. Matrix multiplication playground ---------- */
DEMOS.matrixmul = function (mount) {
  mount.innerHTML = `<div class="demo-title">✖️ (2×2) · (2×2)</div>`;
  const wrap = document.createElement("div");
  wrap.className = "mm-wrap";
  mount.appendChild(wrap);

  function grid(cls) {
    const g = document.createElement("div");
    g.className = "mm " + cls;
    for (let i = 0; i < 4; i++) {
      const inp = document.createElement("input");
      inp.type = "number"; inp.value = cls === "res" ? 0 : [1, 2, 3, 4, 0, 1, 1, 0][i];
      if (cls === "res") { inp.disabled = true; inp.value = ""; }
      g.appendChild(inp);
    }
    wrap.appendChild(g);
    return g;
  }
  const A = grid("a"), B = grid("b");
  wrap.appendChild(document.createTextNode("·"));
  const eq = document.createElement("div"); eq.textContent = "="; eq.className = "mm-row-label"; wrap.appendChild(eq);
  const R = grid("res");
  const label = out(mount);
  label.className = "mm-row-label";

  function cell(g, i, j) { return g.children[i * 2 + j]; }
  function update(highlight) {
    const a = [[+cell(A, 0, 0).value, +cell(A, 0, 1).value], [+cell(A, 1, 0).value, +cell(A, 1, 1).value]];
    const b = [[+cell(B, 0, 0).value, +cell(B, 0, 1).value], [+cell(B, 1, 0).value, +cell(B, 1, 1).value]];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++)
      cell(R, i, j).value = a[i][0] * b[0][j] + a[i][1] * b[1][j];
    label.textContent = "";
    if (highlight) {
      const i = highlight[0], j = highlight[1];
      label.innerHTML = `<code style="font-size:13px">row ${i + 1} of A · col ${j + 1} of B = (${a[i][0]})·(${b[0][j]}) + (${a[i][1]})·(${b[1][j]})</code>`;
    }
  }
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
    cell(R, i, j).addEventListener("click", () => update([i, j]));
  }
  [...A.children, ...B.children].forEach(inp => inp.addEventListener("input", () => update()));

  update();
  note(mount, "Click any result cell to see its dot-product breakdown. Try swapping A and B — order matters!");
};

/* ---------- 6. Image as a matrix ---------- */
DEMOS.pixelmatrix = function (mount) {
  mount.innerHTML = `<div class="demo-title">🖼️ Edit pixels → the matrix changes</div>`;
  const grid = document.createElement("div");
  grid.className = "pixel-grid";
  mount.appendChild(grid);
  const vals = [];
  for (let i = 0; i < 64; i++) {
    const v = (i * 37) % 8; // deterministic pattern
    vals.push(v);
    const c = document.createElement("div");
    c.className = "pixel-cell";
    grid.appendChild(c);
  }
  const outp = out(mount);
  outp.className = "matrix-out";
  const btns = document.createElement("div"); btns.className = "demo-btns"; mount.appendChild(btns);

  function render() {
    [...grid.children].forEach((c, i) => {
      const v = vals[i];
      const shade = Math.round(v * 255 / 7);
      c.style.background = `rgb(${shade},${shade},${shade})`;
    });
    let s = "";
    for (let r = 0; r < 8; r++) s += vals.slice(r * 8, r * 8 + 8).join("  ") + "\n";
    outp.textContent = s.trim();
  }
  [...grid.children].forEach((c, i) => c.addEventListener("click", () => { vals[i] = (vals[i] + 1) % 8; render(); }));

  const invert = document.createElement("button");
  invert.className = "btn ghost"; invert.textContent = "Invert (8−v)";
  invert.onclick = () => { for (let i = 0; i < 64; i++) vals[i] = 7 - vals[i]; render(); };
  const zero = document.createElement("button");
  zero.className = "btn ghost"; zero.textContent = "All zeros";
  zero.onclick = () => { vals.fill(0); render(); };
  const rand = document.createElement("button");
  rand.className = "btn ghost"; rand.textContent = "Noise";
  rand.onclick = () => { for (let i = 0; i < 64; i++) vals[i] = Math.floor(Math.random() * 8); render(); };
  btns.append(invert, zero, rand);

  render();
  note(mount, "Click pixels to brighten (wraps 0→7). 'Invert' is exactly how a photo negative works: 8 − v.");
};

/* ---------- 7. Neural network forward pass ---------- */
DEMOS.forwardpass = function (mount) {
  mount.innerHTML = `<div class="demo-title">🧠 2 inputs → 2 hidden neurons → 1 output</div>`;
  const cv = mkcv(mount, 360, 190);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sX1 = slider(ctr, "x₁", 0, 1, 0.1, 1);
  const sX2 = slider(ctr, "x₂", 0, 1, 0.1, 0);
  const outp = out(mount);
  outp.className = "fp-output";
  const sig = z => 1 / (1 + Math.exp(-z));
  // fixed weights: layer1 (2x2), biases, layer2 (2)
  const W1 = [[2, -1], [-1, 2]], B1 = [0.5, -0.5], W2 = [3, 2], B2 = -2.2;

  function draw() {
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    const x1 = sX1.get(), x2 = sX2.get();
    const z1 = W1[0][0] * x1 + W1[0][1] * x2 + B1[0];
    const z2 = W1[1][0] * x1 + W1[1][1] * x2 + B1[1];
    const h1 = sig(z1), h2 = sig(z2);
    const zo = W2[0] * h1 + W2[1] * h2 + B2;
    const y = sig(zo);
    // draw network
    const nodes = [
      { x: 50, y: 60, v: x1, l: "x₁" }, { x: 50, y: 130, v: x2, l: "x₂" },
      { x: 180, y: 60, v: h1, l: "h₁" }, { x: 180, y: 130, v: h2, l: "h₂" },
      { x: 310, y: 95, v: y, l: "y" },
    ];
    // edges
    ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 1.5;
    const pairs = [[0, 2], [0, 3], [1, 2], [1, 3], [2, 4], [3, 4]];
    pairs.forEach(([i, j]) => {
      ctx.beginPath(); ctx.moveTo(nodes[i].x + 14, nodes[i].y); ctx.lineTo(nodes[j].x - 14, nodes[j].y); ctx.stroke();
    });
    // nodes sized by value
    nodes.forEach(n => {
      const r = 8 + n.v * 8;
      ctx.fillStyle = `rgba(45,212,191,${0.35 + n.v * 0.65})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "11px monospace"; ctx.textAlign = "center";
      ctx.fillText(n.l, n.x, n.y - r - 5);
    });
    outp.innerHTML =
      `z₁ = 2·${x1} + (−1)·${x2} + 0.5 = <b>${z1.toFixed(2)}</b> → h₁ = σ = <span class="hl">${h1.toFixed(2)}</span><br>` +
      `z₂ = (−1)·${x1} + 2·${x2} + (−0.5) = <b>${z2.toFixed(2)}</b> → h₂ = σ = <span class="hl">${h2.toFixed(2)}</span><br>` +
      `output = σ(3·${h1.toFixed(2)} + 2·${h2.toFixed(2)} − 2.2) = <span class="hl">P(positive) = ${y.toFixed(2)}</span>`;
  }
  sX1.inp.addEventListener("input", draw);
  sX2.inp.addEventListener("input", draw);
  draw();
  note(mount, "Bigger node = more activated. Output reads as a probability. Real networks just have far more of these genius-simple neurons.");
};

/* =========================================================
   PHASE 2 DEMOS — Calculus & Probability
   ========================================================= */

/* ---------- 8. Derivative visualizer ---------- */
DEMOS.derivvis = function (mount) {
  mount.innerHTML = `<div class="demo-title">📈 Tangent line = derivative</div>`;
  const cv = mkcv(mount, 340, 210);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sX = slider(ctr, "point x", -2, 2, 0.1, 1, v => v.toFixed(1));
  const outp = out(mount);

  const FUNCS = [
    { name: "x²", f: x => x * x, d: x => 2 * x, label: "f(x) = x²,  f′(x) = 2x" },
    { name: "x³", f: x => x * x * x, d: x => 3 * x * x, label: "f(x) = x³,  f′(x) = 3x²" },
    { name: "sin(x)", f: x => 5 * Math.sin(x), d: x => 5 * Math.cos(x), label: "f(x) = 5·sin(x),  f′(x) = 5·cos(x)" },
  ];
  let sel = FUNCS[0];
  const selBox = document.createElement("select");
  selBox.className = "choice"; selBox.style.cssText = "width:auto;display:inline-block;padding:6px 10px;font-size:13px";
  FUNCS.forEach((fu, i) => { const o = document.createElement("option"); o.value = i; o.textContent = fu.name; selBox.appendChild(o); });
  selBox.onchange = () => { sel = FUNCS[+selBox.value]; draw(); };
  ctr.appendChild(selBox);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, ox = w / 2, oy = h / 2 - 8, sc = 26;
    ctx.clearRect(0, 0, w, h);
    axis(ctx, w, h, ox, oy);
    ctx.strokeStyle = "rgba(255,255,255,.06)";
    for (let gx = 0; gx < w; gx += sc) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
    // curve
    ctx.strokeStyle = "#2dd4bf"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - ox) / sc;
      const py = oy - sel.f(x) * sc;
      px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    // point + tangent
    const x = sX.get();
    const fx = sel.f(x), dx = sel.d(x);
    const px = ox + x * sc, py = oy - fx * sc;
    ctx.strokeStyle = "#ffc247"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px - 50, py + dx * 50);
    ctx.lineTo(px + 50, py - dx * 50);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill();
    outp.textContent = `x = ${x.toFixed(1)} → slope f′ = ${dx.toFixed(2)}`;
  }
  sX.inp.addEventListener("input", draw);
  selBox.onchange = () => { sel = FUNCS[+selBox.value]; draw(); lbl.textContent = FUNCS[+selBox.value].label; };
  draw();
  const lbl = out(mount, "demo-note");
  lbl.textContent = FUNCS[0].label;
  note(mount, "The yellow line is the tangent — its steepness IS the derivative at that point. Slide x and feel the slope change.");
};

/* ---------- 9. Gradient descent playground ---------- */
DEMOS.gdplay = function (mount) {
  mount.innerHTML = `<div class="demo-title">🎳 Train your weight downhill</div>`;
  const cv = mkcv(mount, 360, 200);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sLR = slider(ctr, "learning rate α", 0.01, 1.2, 0.02, 0.3, v => v.toFixed(2));
  const btns = document.createElement("div"); btns.className = "demo-btns"; mount.appendChild(btns);
  const outp = out(mount);

  const MIN = 3; // minimum at w = 3
  let w = 0, trail = [], steps = 0, exploded = false;
  const L = x => (x - MIN) * (x - MIN);
  const grad = x => 2 * (x - MIN);

  function mkbtn(txt, fn) {
    const b = document.createElement("button");
    b.className = "btn ghost"; b.textContent = txt; b.onclick = fn;
    btns.appendChild(b); return b;
  }
  mkbtn("Step ×1", () => { if (!exploded) { update(); donep("after 1 step"); } });
  mkbtn("Step ×10", () => { if (!exploded) { for (let i = 0; i < 10; i++) update(); donep("after 10 steps"); } });
  mkbtn("↺ Reset", () => { reset(); });

  function update() {
    trail.push(w);
    w = w - sLR.get() * grad(w);
    steps++;
    if (!Number.isFinite(w) || Math.abs(w - MIN) > 500) exploded = true;
  }
  function donep(tag) { draw(); outTag(`w = ${w.toFixed(2)}, loss = ${L(w).toFixed(2)}` + tagMsg(tag)); save0(); }
  function tagMsg(tag) {
    if (exploded) return ` after ${steps} steps — <span style="color:#f87171">💥 LOSS EXPLODED! α too big.</span>`;
    if (Math.abs(L(w)) < 0.05) return ` after ${steps} steps — <span style="color:#6bffa1">🎉 converged!</span>`;
    return ` after ${steps} steps`;
  }
  function outTag(html) { outp.innerHTML = html; }
  function reset() { w = 0; trail = []; steps = 0; exploded = false; draw(); outTag("Fresh start. Step down the slope!"); }
  function draw() {
    const ctx = cv.getContext("2d");
    const wd = cv.width, h = cv.height, pad = 20;
    ctx.clearRect(0, 0, wd, h);
    const wmin = -1, wmax = 7, Lmax = 10;
    const X = v => pad + (v - wmin) / (wmax - wmin) * (wd - 2 * pad);
    const Y = v => h - pad - (Math.min(v, Lmax) / Lmax) * (h - 2 * pad);
    // curve
    ctx.strokeStyle = "#2dd4bf"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= wd; px++) {
      const wv = wmin + (px - pad) / (wd - 2 * pad) * (wmax - wmin);
      const py = Y(L(wv));
      px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    // minimum marker
    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(X(MIN), Y(0)); ctx.lineTo(X(MIN), Y(Lmax)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#fff"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("best model", X(MIN), Y(Lmax) + 12);
    // trail
    trail.forEach((tw, i) => {
      ctx.fillStyle = `rgba(255,211,77,${0.25 + 0.6 * i / Math.max(1, trail.length)})`;
      ctx.beginPath(); ctx.arc(X(tw), Y(L(tw)), 3.5, 0, 7); ctx.fill();
    });
    // ball
    if (Number.isFinite(w) && Math.abs(w - MIN) < 500) {
      ctx.fillStyle = exploded ? "#f87171" : "#fff";
      ctx.beginPath(); ctx.arc(X(Math.max(wmin, Math.min(wmax, w))), Y(L(w)), 6, 0, 7); ctx.fill();
    }
    if (exploded) { ctx.fillStyle = "#f87171"; ctx.font = "bold 14px sans-serif"; ctx.fillText("💥 diverged — pick a smaller α", wd / 2, 24); }
  }
  function save0(){}
  reset();
  note(mount, "L(w) = (w − 3)² is the 'loss valley'. Step = w ← w − α·slope. Small α = slow crawling, big α = explosion. This is literally how models train — just in 1000s of dimensions.");
};

/* ---------- 10. Normal distribution ---------- */
DEMOS.normaldemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">🔔 The bell curve & the 68–95 rule</div>`;
  const cv = mkcv(mount, 380, 190);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sMu = slider(ctr, "mean μ (BP)", 100, 150, 1, 120);
  const sSd = slider(ctr, "spread σ", 5, 30, 1, 10);
  const outp = out(mount);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 16;
    ctx.clearRect(0, 0, w, h);
    const mu = sMu.get(), sd = sSd.get();
    const lo = mu - 4 * sd, hi = mu + 4 * sd;
    const X = v => pad + (v - lo) / (hi - lo) * (w - 2 * pad);
    const H = v => Math.exp(-0.5 * ((v - mu) / sd) ** 2); // 0..1
    const Y = v => h - 30 - v * (h - 60);
    // shaded ±1σ and ±2σ
    function band(a, b, alpha) {
      ctx.fillStyle = `rgba(45,212,191,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(X(a), h - 30);
      for (let px = X(a); px <= X(b); px += 2) {
        const v = lo + (px - pad) / (w - 2 * pad) * (hi - lo);
        ctx.lineTo(px, Y(H(v)));
      }
      ctx.lineTo(X(b), h - 30); ctx.closePath(); ctx.fill();
    }
    band(mu - 2 * sd, mu + 2 * sd, 0.15);
    band(mu - sd, mu + sd, 0.3);
    // curve
    ctx.strokeStyle = "#2dd4bf"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = pad; px <= w - pad; px += 2) {
      const v = lo + (px - pad) / (w - 2 * pad) * (hi - lo);
      ctx.lineTo(px, Y(H(v)));
    }
    ctx.stroke();
    // μ tick
    ctx.strokeStyle = "#fff";
    ctx.beginPath(); ctx.moveTo(X(mu), h - 30); ctx.lineTo(X(mu), Y(H(mu))); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    [68, 95].forEach((pct, i) => ctx.fillText(`±${i + 1}σ = ${pct}%`, X(mu), 16 + i * 15));
    outp.textContent = `μ = ${mu}, σ = ${sd} — 68% of people in ${mu - sd}–${mu + sd}, 95% in ${mu - 2 * sd}–${mu + 2 * sd}`;
  }
  sMu.inp.addEventListener("input", draw);
  sSd.inp.addEventListener("input", draw);
  draw();
  note(mount, "A blood-pressure distribution. σ bigger = wider population spread. '68–95 rule' helps you read any paper that reports mean ± SD.");
};

/* ---------- 11. Diagnostic Test Lab (Bayes) ---------- */
DEMOS.testlab = function (mount) {
  mount.innerHTML = `<div class="demo-title">🩺 Diagnostic Test Lab — 10,000 patients</div>`;
  const cv = mkcv(mount, 380, 190);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sPrev = slider(ctr, "prevalence", 0.5, 30, 0.5, 1, v => v.toFixed(1) + "%");
  const sSe = slider(ctr, "sensitivity", 50, 100, 1, 95, v => v + "%");
  const sSp = slider(ctr, "specificity", 50, 100, 1, 90, v => v + "%");
  const outp = out(mount);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 46, colW = (w - pad - 90) / 2;
    ctx.clearRect(0, 0, w, h);
    const N = 10000;
    const prev = sPrev.get() / 100, se = sSe.get() / 100, sp = sSp.get() / 100;
    const sick = N * prev, healthy = N - sick;
    const tp = sick * se, fn = sick - tp, fp = healthy * (1 - sp), tn = healthy - fp;
    const ppv = tp + fp > 0 ? tp / (tp + fp) : 0, npv = tn / (tn + fn);

    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    // column headers
    ctx.fillStyle = "#fff";
    ctx.fillText("Test Positive", pad + colW / 2, 16);
    ctx.fillText("Test Negative", pad + colW * 1.5, 16);
    ctx.textAlign = "right";
    ctx.fillText("Sick:", pad - 8, 40);
    ctx.fillText("Healthy:", pad - 8, 76);
    ctx.textAlign = "center";
    // cells proportional-ish
    const cells = [
      [tp, "#4ade80", pad, 24], [fn, "#f87171", pad + colW, 24],
      [fp, "#fb923c", pad, 60], [tn, "#60a5fa", pad + colW, 60],
    ];
    cells.forEach(([v, color, x, y]) => {
      const frac = Math.sqrt(v / N);
      ctx.fillStyle = color; ctx.globalAlpha = 0.75;
      const bw = Math.max(14, frac * colW), bh = Math.max(12, frac * 34);
      ctx.fillRect(x + colW / 2 - bw / 2, y - bh / 2, bw, bh);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace";
      ctx.fillText(Math.round(v).toLocaleString(), x + colW / 2, y + 3);
    });
    outp.innerHTML =
      `Test POSITIVE → (${Math.round(tp)} + ${Math.round(fp)}) people. Truly sick: <b style="color:#6bffa1">${(ppv * 100).toFixed(1)}%</b> (PPV)<br>` +
      `Test NEGATIVE → chance you're truly healthy: <b>${(npv * 100).toFixed(2)}%</b> (NPV)`;
  }
  [sPrev, sSe, sSp].forEach(s => s.inp.addEventListener("input", draw));
  draw();
  note(mount, "Watch the true-positive (green) pool evaporate as prevalence drops! '95% accurate' means nothing without the base rate — this chart is the vaccine against that fallacy.");
};

/* =========================================================
   PHASE 3-4 DEMOS — ML core, evaluation, deep learning
   ========================================================= */

/* shared normal CDF (Abramowitz–Stegun) */
function ncdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
/* least-squares polynomial fit via normal equations */
function gaussSolve(M, b) {
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let piv = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[piv][i])) piv = r;
    [M[i], M[piv]] = [M[piv], M[i]]; [b[i], b[piv]] = [b[piv], b[i]];
    if (Math.abs(M[i][i]) < 1e-12) return null;
    for (let r = i + 1; r < n; r++) {
      const f = M[r][i] / M[i][i];
      for (let c = i; c < n; c++) M[r][c] -= f * M[i][c];
      b[r] -= f * b[i];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let c = i + 1; c < n; c++) s -= M[i][c] * x[c];
    x[i] = s / M[i][i];
  }
  return x;
}
function polyfit(pts, deg) {
  const n = deg + 1;
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  const b = new Array(n).fill(0);
  for (const [x, y] of pts) {
    let v = 1; const pow = [];
    for (let k = 0; k < n; k++) { pow.push(v); v *= x; }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) M[i][j] += pow[i] * pow[j];
      b[i] += pow[i] * y;
    }
  }
  return gaussSolve(M, b) || new Array(n).fill(0);
}
const polyval = (c, x) => c.reduce((s, k, i) => s + k * Math.pow(x, i), 0);

/* ---------- 12. Loss = line-fitting cost ---------- */
DEMOS.lossdemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">📏 MSE: how wrong is your line?</div>`;
  const cv = mkcv(mount, 340, 220);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sM = slider(ctr, "slope m", -0.5, 2, 0.05, 0.3, v => v.toFixed(2));
  const sC = slider(ctr, "intercept c", -6, 6, 0.5, 1, v => v.toFixed(1));
  const outp = out(mount);
  // fixed "patient data": (BMI, glucose-ish), deterministic
  const PTS = [[1, 2.4], [1.6, 3.7], [2, 2.1], [2.7, 4.1], [3.2, 5.0], [3.8, 4.2], [4.4, 6.1], [5, 6.0], [5.5, 7.3], [6, 6.9]];

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 26;
    ctx.clearRect(0, 0, w, h);
    const xmin = 0, xmax = 7, ymin = 0, ymax = 9;
    const X = v => pad + (v - xmin) / (xmax - xmin) * (w - 2 * pad);
    const Y = v => h - pad - (v - ymin) / (ymax - ymin) * (h - 2 * pad);
    ctx.strokeStyle = "rgba(255,255,255,.3)";
    ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, h - pad); ctx.stroke();
    const m = sM.get(), c = sC.get();
    let mse = 0;
    // residuals + points
    PTS.forEach(([x, y]) => {
      const yh = m * x + c;
      mse += (y - yh) ** 2;
      ctx.strokeStyle = "rgba(248,113,113,.6)"; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(X(x), Y(y)); ctx.lineTo(X(x), Y(yh)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#2dd4bf";
      ctx.beginPath(); ctx.arc(X(x), Y(y), 4.5, 0, 7); ctx.fill();
    });
    mse /= PTS.length;
    ctx.strokeStyle = "#ffd347"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(X(0), Y(c)); ctx.lineTo(X(7), Y(m * 7 + c)); ctx.stroke();
    outp.textContent = `MSE = ${mse.toFixed(2)} — the training goal: make this number small`;
  }
  sM.inp.addEventListener("input", draw);
  sC.inp.addEventListener("input", draw);
  draw();
  note(mount, "Red dashed = each error. Squaring punishes big misses hard. 'Training' just means letting math find the m, c that minimize MSE — that's gradient descent from Unit 2!");
};

/* ---------- 13. Sigmoid & cross-entropy ---------- */
DEMOS.sigdemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">sigmoid → probability → the log penalty</div>`;
  const cv = mkcv(mount, 340, 200);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sZ = slider(ctr, "raw score z", -6, 6, 0.1, 0, v => v.toFixed(1));
  const outp = out(mount);
  const sig = z => 1 / (1 + Math.exp(-z));

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 22;
    ctx.clearRect(0, 0, w, h);
    const xmin = -6, xmax = 6;
    const X = v => pad + (v - xmin) / (xmax - xmin) * (w - 2 * pad);
    const Y = v => h - pad - v * (h - 2 * pad);
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.beginPath(); ctx.moveTo(pad, Y(0.5)); ctx.lineTo(w - pad, Y(0.5)); ctx.stroke();
    ctx.fillStyle = "#a9b0cf"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
    ctx.fillText("0.5", pad - 14, Y(0.5) + 4);
    ctx.strokeStyle = "#2dd4bf"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = pad; px <= w - pad; px += 2) {
      const z = xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
      const py = Y(sig(z));
      px === pad ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    const z = sZ.get(), p = sig(z);
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(X(z), Y(p), 6, 0, 7); ctx.fill();
    const loss1 = -Math.log(p);
    const loss0 = -Math.log(1 - p);
    outp.innerHTML = `z = ${z.toFixed(1)} → P(sick) = <b>${p.toFixed(2)}</b><br>` +
      `If truly sick: penalty −log(p) = <b style="color:#6bffa1">${loss1.toFixed(2)}</b>` +
      ` &nbsp; If truly healthy: penalty −log(1−p) = <b style="color:${loss0 > 1 ? "#f87171" : "#ffd347"}">${loss0.toFixed(2)}</b>`;
  }
  sZ.inp.addEventListener("input", draw);
  draw();
  note(mount, "Push z high while truth is 'healthy' — the penalty explodes, just as logarithms promised back in Unit 0. Confident + wrong = the most expensive mistake in ML.");
};

/* ---------- 14. Overfitting: degree slider ---------- */
DEMOS.overfitdemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">📈 Wiggle dial: under- vs over-fitting</div>`;
  const cv = mkcv(mount, 360, 220);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sD = slider(ctr, "polynomial degree", 1, 9, 1, 1, v => v);
  const outp = out(mount);

  const U = []; for (let i = 0; i < 11; i++) U.push(-1 + 2 * i / 10);
  const NOISE = [0.05, -0.08, 0.03, -0.05, 0.09, -0.02, 0.06, -0.09, 0.04, -0.04, 0.07];
  const TRUE = u => 0.9 * u * u - 0.3 * u + 0.1;
  const TRAIN = U.map((u, i) => [u, TRUE(u) + NOISE[i]]);

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 24;
    ctx.clearRect(0, 0, w, h);
    const xmin = -1.15, xmax = 1.15, ymin = -0.35, ymax = 1.25;
    const X = v => pad + (v - xmin) / (xmax - xmin) * (w - 2 * pad);
    const Y = v => h - pad - (v - ymin) / (ymax - ymin) * (h - 2 * pad);
    // true curve (dashed gray)
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = pad; px <= w - pad; px += 2) {
      const u = xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
      px === pad ? ctx.moveTo(px, Y(TRUE(u))) : ctx.lineTo(px, Y(TRUE(u)));
    }
    ctx.stroke(); ctx.setLineDash([]);
    const deg = sD.get();
    const coef = polyfit(TRAIN, deg); // x already scaled to [-1,1]
    // fitted curve
    let testMSE = 0;
    for (let i = 0; i <= 60; i++) testMSE += (TRUE(-1 + 2 * i / 60) - polyval(coef, -1 + 2 * i / 60)) ** 2;
    testMSE /= 61;
    let trainMSE = 0;
    TRAIN.forEach(([u, y]) => trainMSE += (y - polyval(coef, u)) ** 2);
    trainMSE /= TRAIN.length;
    const col = testMSE < 0.012 ? "#6bffa1" : testMSE < 0.06 ? "#ffd347" : "#f87171";
    ctx.strokeStyle = col; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = pad; px <= w - pad; px += 2) {
      const u = xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
      const py = Y(Math.max(ymin, Math.min(ymax, polyval(coef, u))));
      px === pad ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    TRAIN.forEach(([u, y]) => {
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(X(u), Y(y), 4, 0, 7); ctx.fill();
    });
    outp.innerHTML = `degree ${deg} — train MSE: <b>${trainMSE.toFixed(4)}</b>, test MSE: <b style="color:${col}">${testMSE.toFixed(4)}</b>` +
      (testMSE > 0.06 ? " ← train keeps falling but test explodes: OVERFIT (memorized noise)" : testMSE < 0.012 ? " ← sweet spot!" : " ← too stiff yet: UNDERFIT");
  }
  sD.inp.addEventListener("input", draw);
  draw();
  note(mount, "White dots = training patients. Dashed gray = reality. Degree 1 ignores the curve (underfit). Degree 9 threads every dot but diverges between them (overfit). Degree 2 is medicine.");
};

/* ---------- 15. Sensitivity/specificity threshold dial ---------- */
DEMOS.thrdemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">🎚️ One dial: sensitivity vs specificity</div>`;
  const cv = mkcv(mount, 380, 200);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sT = slider(ctr, "decision threshold", 0, 6, 0.05, 2.2, v => v.toFixed(2));
  const outp = out(mount);

  const MU_H = 0, MU_S = 3, SD = 1.4; // score distributions
  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 18, baseY = h - 30;
    ctx.clearRect(0, 0, w, h);
    const xmin = -1, xmax = 7;
    const X = v => pad + (v - xmin) / (xmax - xmin) * (w - 2 * pad);
    const dens = (v, mu) => Math.exp(-0.5 * ((v - mu) / SD) ** 2);
    const t = sT.get();
    // FP fill (healthy right of t), FN fill (sick left of t)
    ctx.fillStyle = "rgba(251,146,60,.4)";
    ctx.beginPath(); ctx.moveTo(X(t), baseY);
    for (let px = X(t); px <= w - pad; px += 2) {
      const v = xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
      ctx.lineTo(px, baseY - dens(v, MU_H) * 90);
    }
    ctx.lineTo(w - pad, baseY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(248,113,113,.4)";
    ctx.beginPath(); ctx.moveTo(xmin ? X(xmin) : pad, baseY);
    for (let px = pad; px <= X(t); px += 2) {
      const v = xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
      ctx.lineTo(px, baseY - dens(v, MU_S) * 90);
    }
    ctx.lineTo(X(t), baseY); ctx.closePath(); ctx.fill();
    // curves
    [[MU_H, "#60a5fa", "Healthy"], [MU_S, "#f87171", "Sick"]].forEach(([mu, col, lbl]) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = pad; px <= w - pad; px += 2) {
        const v = xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
        const py = baseY - dens(v, mu) * 90;
        px === pad ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = col; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(lbl, X(mu + 2.9), baseY - dens(mu + 2.9, mu) * 92 - 6);
    });
    // threshold line
    ctx.strokeStyle = "#fff"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(X(t), baseY + 4); ctx.lineTo(X(t), 20); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#fff"; ctx.textAlign = "center";
    ctx.fillText("threshold", X(t), 14);
    const se = 1 - ncdf((t - MU_S) / SD);
    const sp = ncdf((t - MU_H) / SD);
    outp.innerHTML = `Sensitivity (sick caught): <b style="color:#f87171">${(se * 100).toFixed(0)}%</b> · Specificity (healthy cleared): <b style="color:#60a5fa">${(sp * 100).toFixed(0)}%</b>`;
  }
  sT.inp.addEventListener("input", draw);
  draw();
  note(mount, "Orange spill = false alarms. Red spill = missed patients. Slide the line left (screening: catch everything) → specificity crumbles. Right (confirmation) → you miss patients. No escape — this IS the trade-off.");
};

/* ---------- 16. ROC & AUC ---------- */
DEMOS.rocdemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">🎯 ROC curve: trace all thresholds</div>`;
  const cv = mkcv(mount, 340, 230);
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sT = slider(ctr, "operating threshold", 0, 6, 0.05, 3, v => v.toFixed(2));
  const outp = out(mount);

  // classifier test score distributions: healthy vs sick
  const CLS = [
    { name: "Strong model", muH: 0, muS: 3, sdH: 1.4, sdS: 1.4, col: "#2dd4bf" },
    { name: "Weak model", muH: 0, muS: 1.2, sdH: 1.8, sdS: 1.8, col: "#ffb347" },
  ];
  function rocOf(c) {
    // sweep threshold 6 → 0, collect (FPR, TPR)
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = 6 - 6 * i / 120;
      pts.push([1 - ncdf((t - c.muH) / c.sdH), 1 - ncdf((t - c.muS) / c.sdS)]);
    }
    return pts;
  }
  function aucOf(pts) {
    let a = 0;
    for (let i = 1; i < pts.length; i++) a += (pts[i][0] - pts[i - 1][0]) * (pts[i][1] + pts[i - 1][1]) / 2;
    return a;
  }

  function draw() {
    const ctx = cv.getContext("2d");
    const w = cv.width, h = cv.height, pad = 30;
    ctx.clearRect(0, 0, w, h);
    const X = v => pad + v * (w - 2 * pad);
    const Y = v => h - pad - v * (h - 2 * pad);
    // grid + diagonal (random guess)
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(1), Y(1)); ctx.stroke();
    ctx.fillStyle = "#a9b0cf"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("random guess", X(0.62), Y(0.52));
    CLS.forEach(c => {
      const pts = rocOf(c);
      const auc = aucOf(pts);
      ctx.strokeStyle = c.col; ctx.lineWidth = 2.5;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(X(p[0]), Y(p[1])) : ctx.lineTo(X(p[0]), Y(p[1])));
      ctx.stroke();
      ctx.fillStyle = c.col;
      ctx.fillText(`${c.name} (AUC ${auc.toFixed(2)})`, X(0.52), Y(0.12) - 14 * (c === CLS[0] ? 0 : 1));
    });
    // marker for strong model at current threshold: op point (FPR, TPR)
    const t = sT.get(), A = CLS[0];
    const fpr = 1 - ncdf((t - A.muH) / A.sdH), tpr = 1 - ncdf((t - A.muS) / A.sdS);
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(X(fpr), Y(tpr), 6, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.5)";
    ctx.beginPath(); ctx.moveTo(X(0), Y(tpr)); ctx.lineTo(X(fpr), Y(tpr)); ctx.lineTo(X(fpr), Y(0)); ctx.stroke();
    outp.textContent = `threshold ${t.toFixed(2)} → TPR ${(tpr * 100).toFixed(0)}%, FPR ${(fpr * 100).toFixed(0)}%`;
  }
  sT.inp.addEventListener("input", draw);
  draw();
  note(mount, "AUC = probability a random sick patient scores higher than a random healthy one (0.5 = coin flip, 1.0 = perfect). The white dot rides the curve as you turn the dial from Unit 5's slider — the whole trade-off curve in one picture.");
};

/* ---------- 17. CNN convolution playground ---------- */
DEMOS.cnndemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">🧻 A CNN filter sliding over an image</div>`;
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;gap:10px;justify-content:center;align-items:center";
  mount.appendChild(wrap);
  const mk = (parent, title) => {
    const d = document.createElement("div");
    d.innerHTML = `<div class="demo-note">${title}</div>`;
    const g = document.createElement("div");
    g.className = "pixel-grid"; g.style.gridTemplateColumns = "repeat(8, 12px)";
    d.appendChild(g);
    parent.appendChild(d);
    return g;
  };
  // wrapper shrink: temporarily widen grid then restore
  const gridIn = mk(wrap, "input image (click to edit)");
  const gridOut = mk(wrap, "filter output");
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const KERNELS = {
    "Edge ∇": [[0, 1, 0], [1, -4, 1], [0, 1, 0]],
    "Sharpen": [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
    "Blur ☁": [[1, 1, 1], [1, 2, 1], [1, 1, 1]],
  };
  const selBox = document.createElement("select");
  selBox.className = "choice"; selBox.style.cssText = "width:auto;padding:6px 10px;font-size:13px";
  const kernelNames = Object.keys(KERNELS);
  kernelNames.forEach(k => { const o = document.createElement("option"); o.value = k; o.textContent = k; selBox.appendChild(o); });
  selBox.value = kernelNames[0];
  selBox.onchange = render;
  ctr.appendChild(selBox);
  const outp = out(mount);

  const vals = [];
  for (let i = 0; i < 64; i++) vals.push((i * 37) % 8); // deterministic pattern

  function render() {
    const K = KERNELS[selBox.value];
    [...gridIn.children].forEach((c, i) => {
      const shade = Math.round(vals[i] * 255 / 7);
      c.style.background = `rgb(${shade},${shade},${shade})`;
    });
    [...gridOut.children].forEach((c, i) => {
      const r = Math.floor(i / 8), q = i % 8;
      if (r === 0 || q === 0 || r === 7 || q === 7) { c.style.background = "transparent"; return; }
      let s = 0;
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++)
        s += K[di + 1][dj + 1] * vals[(r + di) * 8 + (q + dj)];
      const v = Math.max(0, Math.min(7, Math.abs(s) / 6)); // normalize softly
      const shade = Math.round(v * 255 / 7);
      c.style.background = `rgb(${shade},${shade},${shade})`;
    });
    outp.textContent = `output[r,c] = Σ kernel·neighborhood — one filter, slid across every 3×3 patch. A CNN learns HUNDREDS of these.`;
  }
  for (let i = 0; i < 64; i++) {
    const c = document.createElement("div");
    c.className = "pixel-cell"; c.style.width = "12px"; c.style.height = "12px"; c.style.borderRadius = "2px";
    c.addEventListener("click", () => { vals[i] = (vals[i] + 1) % 8; render(); });
    gridIn.appendChild(c);
  }
  for (let i = 0; i < 64; i++) {
    const c = document.createElement("div");
    c.className = "pixel-cell"; c.style.width = "12px"; c.style.height = "12px"; c.style.borderRadius = "2px"; c.style.pointerEvents = "none";
    gridOut.appendChild(c);
  }
  render();
  note(mount, "Edges light up where neighbors differ (transition zones — think bone boundaries in an X-ray). Deep nets AUTO-LEARN their filters from data instead of us choosing 'Edge ∇'.");
};

/* ---------- 18. Attention demo ---------- */
DEMOS.attndemo = function (mount) {
  mount.innerHTML = `<div class="demo-title">👀 Transformer attention: who attends to whom?</div>`;
  const ctr = document.createElement("div"); ctr.className = "demo-controls"; mount.appendChild(ctr);
  const sT = slider(ctr, "temperature (focus)", 0.3, 4, 0.1, 1, v => v.toFixed(1));
  const btnRow = document.createElement("div"); btnRow.className = "demo-btns"; mount.appendChild(btnRow);
  const cv = mkcv(mount, 380, 150);
  const outp = out(mount);

  const WORDS = ["Blood", "Pressure", "is", "High"];
  const V = {
    "Blood": [0.9, 0.5, 0.2], "Pressure": [0.85, 0.9, 0.1],
    "is": [0.1, 0.1, 0.95], "High": [0.15, 0.8, 0.4],
  };
  let query = "High";
  const btns = {};
  WORDS.forEach(word => {
    const b = document.createElement("button");
    b.className = "btn ghost"; b.textContent = word;
    b.onclick = () => { query = word; markActive(); render(); };
    btnRow.appendChild(b);
    btns[word] = b;
  });
  function markActive() {
    WORDS.forEach(w => btns[w].style.borderColor = w === query ? "#2dd4bf" : "rgba(255,255,255,.12)");
  }

  function render() {
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    const T = sT.get();
    const q = V[query];
    const scores = WORDS.map(w => q.reduce((s, v, i) => s + v * V[w][i], 0));
    const maxS = Math.max(...scores);
    const ex = scores.map(s => Math.exp((s - maxS) / T)); // stabilized softmax
    const sum = ex.reduce((a, b) => a + b, 0);
    const wts = ex.map(e => e / sum);
    // bars
    ctx.font = "12px sans-serif"; ctx.textAlign = "left";
    WORDS.forEach((word, i) => {
      const y = 18 + i * 32;
      ctx.fillStyle = "#fff";
      ctx.fillText(word, 8, y + 5);
      const bw = wts[i] * 250;
      ctx.fillStyle = word === query ? "rgba(139,92,246,.75)" : "rgba(45,212,191,.75)";
      ctx.fillRect(75, y, bw, 22);
      ctx.fillStyle = "#fff"; ctx.textAlign = "right";
      ctx.fillText((wts[i] * 100).toFixed(0) + "%", 335, y + 15);
      ctx.textAlign = "left";
    });
    const top = WORDS[wts.indexOf(Math.max(...wts))];
    outp.textContent = query === top
      ? `"${query}" attends mostly to ITSELF — ask it a different word!`
      : `When the model reads "${query}", it looks hardest at "${top}" — context builds meaning. That's attention.`;
  }
  [sT].forEach(s => s.inp.addEventListener("input", render));
  markActive();
  render();
  note(mount, "Score = dot product (Unit 1!) between query and key vectors; softmax (Unit 3!) turns scores into percentages; temperature sharpens focus. Transformers = this, stacked, done in parallel — chatbots AND clinical-notes models.");
};
