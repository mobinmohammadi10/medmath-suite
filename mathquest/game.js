/* =========================================================
   ── MathQuest RPG — game engine
   Solve math → attack monsters → level up → unlock harder math.
   ========================================================= */
(() => {
"use strict";

/* ---------------- Save / state ---------------- */
const SAVE_KEY = "mathquest_save_v1";

const defaultState = () => ({
  level: 1, xp: 0, gold: 0, potions: 1, hints: 1,
  maxHp: 100, hp: 100,
  stats: { battles: 0, wins: 0, bestStreak: 0 },
});

let state = defaultState();
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) state = Object.assign(defaultState(), JSON.parse(raw));
} catch { /* fresh start */ }

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
}

/* ---------------- DOM helpers ---------------- */
const $ = (id) => document.getElementById(id);
const el = {
  hudLevel: $("hud-level"), xpFill: $("xp-fill"), xpText: $("xp-text"),
  hudGold: $("hud-gold"), btnSound: $("btn-sound"),
  battle: $("battle-screen"), shop: $("shop-screen"),
  monsterName: $("monster-name"), monsterHp: $("monster-hp"),
  monsterHpText: $("monster-hp-text"), monsterSprite: $("monster-sprite"),
  monsterCard: $("monster-card"), monsterDmg: $("monster-dmg"),
  playerHp: $("player-hp"), playerHpText: $("player-hp-text"),
  playerSprite: $("player-sprite"), playerCard: $("player-card"),
  playerDmg: $("player-dmg"), plLevel: $("pl-level"),
  combo: $("combo-banner"), question: $("question-text"),
  timerFill: $("timer-fill"), answer: $("answer-input"),
  btnSubmit: $("btn-submit"), btnHint: $("btn-hint"),
  hintText: $("hint-text"), btnPotion: $("btn-potion"),
  btnFlee: $("btn-flee"), hintCount: $("hint-count"),
  potionCount: $("potion-count"), log: $("log"),
  shopTitle: $("shop-title"), shopSub: $("shop-sub"), campStats: $("camp-stats"),
  buyPotion: $("buy-potion"), buyHint: $("buy-hint"), buyMaxHp: $("buy-maxhp"),
  btnNext: $("btn-next-battle"),
  overlay: $("modal-overlay"), modalIcon: $("modal-icon"),
  modalTitle: $("modal-title"), modalText: $("modal-text"), modalBtn: $("modal-btn"),
};

/* ---------------- Tiny audio (WebAudio, no files) ---------------- */
let audioCtx = null, soundOn = true;
function beep(freq, dur = 0.12, type = "square", vol = 0.15) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch {}
}
const sfx = {
  correct: () => { beep(660, .1); setTimeout(() => beep(880, .15), 90); },
  levelup: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18, "triangle"), i * 110)); },
  wrong: () => beep(140, .3, "sawtooth", .2),
  hit: () => beep(180, .12, "triangle"),
  heal: () => { beep(520, .12, "sine"); setTimeout(() => beep(780, .2, "sine"), 100); },
  click: () => beep(440, .05, "sine", .08),
};

/* ---------------- Math problem generators ----------------
   Tier 1: + / −          Lv 1+
   Tier 2: × / ÷          Lv 4+
   Tier 3: fractions / %  Lv 7+
   Tier 4: algebra        Lv 10+
   Tier 5: expert mix     Lv 13+
--------------------------------------------------------- */
const mathTier = () => {
  const lv = state.level;
  if (lv >= 13) return 5;
  if (lv >= 10) return 4;
  if (lv >= 7) return 3;
  if (lv >= 4) return 2;
  return 1;
};

const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const simp = (a, b) => { const g = gcd(Math.abs(a), Math.abs(b)) || 1; const s = a < 0 !== b < 0 ? -1 : 1; return `${s * Math.abs(a) / g}/${Math.abs(b) / g}`; };

function generateProblem(tier) {
  const pick = ri(1, tier === 5 ? 9 : 4 + tile(tier));
  function tile(t) { return [0, 3, 6, 7, 4][t] ?? 4; }

  switch (tier) {
    case 1: {
      if (pick <= 2) { // addition
        const a = ri(5, 60), b = ri(5, 60);
        return { text: `${a} + ${b}`, answer: a + b };
      } else { // subtraction (keep positive)
        let a = ri(20, 99), b = ri(1, a - 1);
        if (Math.random() < .4) { a = ri(10, 60); b = ri(2, Math.max(3, a / 2)); }
        return { text: `${a} − ${b}`, answer: a - b };
      }
    }
    case 2: {
      if (pick <= 2) { // multiplication (tables up to 12)
        const a = ri(2, 12), b = ri(2, 12);
        return { text: `${a} × ${b}`, answer: a * b };
      } else { // exact division
        const b = ri(2, 12), q = ri(2, 12), a = b * q;
        return { text: `${a} ÷ ${b}`, answer: q };
      }
    }
    case 3: {
      if (pick <= 2) { // percentage — nice integers
        const pct = [10, 20, 25, 50, 75][ri(0, 4)], b = ri(2, 20) * 4;
        return { text: `${pct}% of ${b}`, answer: (pct / 100) * b };
      } else if (pick <= 3) { // same-denominator fractions
        const d = ri(4, 12), n1 = ri(1, d - 2), n2 = ri(1, d - n1 - 1 || 1);
        const num = n1 + n2;
        if (num >= d && num % d === 0) return { text: `${n1}/${d} + ${n2}/${d}`, answer: num / d };
        return { text: `${n1}/${d} + ${n2}/${d}`, answer: num >= d ? `${num - d}/${d}` : simp(num, d), isFraction: true, fallback: num / d };
      } else { // order of operations: a + b × c
        const a = ri(1, 15), b = ri(2, 9), c = ri(2, 9);
        return { text: `${a} + ${b} × ${c}`, answer: a + b * c };
      }
    }
    case 4: {
      const x = ri(2, 12);
      if (pick <= 2) { // ax + b = c
        const a = ri(2, 6), b = ri(1, 20);
        return { text: `${a}x + ${b} = ${a * x + b}`, answer: x };
      } else if (pick <= 3) { // ax − b = c
        const a = ri(2, 6), b = ri(1, 15);
        return { text: `${a}x − ${b} = ${a * x - b}`, answer: x };
      } else { // ax + b = cx + d  (x ≥ 2 keeps both sides integer-negative safe)
        const a = ri(1, 4), c = a + ri(0, 3), b = ri(1, 12), d = b - (c - a) * x;
        return { text: `${a}x + ${b} = ${c}x + ${d}`, answer: x };
      }
    }
    case 5: {
      const v = ri(1, 4);
      if (v === 1) { // 3-term with brackets
        const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
        return { text: `(${a} + ${b}) × ${c}`, answer: (a + b) * c };
      }
      if (v === 2) { // bigger multiplication
        const a = ri(5, 25), b = ri(5, 15);
        return { text: `${a} × ${b}`, answer: a * b };
      }
      if (v === 3) { // simple powers
        const a = ri(2, 12), p = ri(2, 3);
        return { text: `${a}${p === 2 ? "²" : "³"}`, answer: Math.pow(a, p), mirror: `${a}^${p}` };
      }
      if (v === 4) { // two-step equation
        const x = ri(2, 10), a = ri(2, 5), b = ri(1, 12), c = ri(1, 10);
        return { text: `${a}x + ${b} − ${c} = ${a * x + b - c}`, answer: x };
      }
      if (v === 5) { // mixed division
        const b = ri(4, 15), q = ri(4, 15), a = b * q, k = ri(1, 9);
        return { text: `${a + k} ÷ ${b}, remainder?`, answer: k, hintIsRemainder: true };
      }
      if (v === 6) { // percent change
        const p = [25, 50, 75][ri(0, 2)], n = ri(2, 10) * 8;
        return { text: `${p}% of ${n} (nearest integer)`, answer: Math.round((p / 100) * n) };
      }
      if (v === 7) { // fraction of a number
        const d = [2, 3, 4][ri(0, 2)], n = d * ri(4, 20);
        return { text: `${d === 2 ? "½" : d === 3 ? "⅓" : "¼"} of ${n}`, answer: n / d };
      }
      if (v === 8) { // squared then add
        const a = ri(2, 10), b = ri(1, 12);
        return { text: `${a}² + ${b}`, answer: a * a + b };
      }
      { // c(x+d)=n
        const x = ri(2, 9), c = ri(2, 5), d = ri(1, 6), n = c * (x + d);
        return { text: `${c}(x + ${d}) = ${n}`, answer: x };
      }
    }
    case 6: {
      // MedAI boss problems — counts on 1,000 patients (integer-safe combos)
      const v = ri(1, 6);
      const N = [1000, 2000, 10000][ri(0, 2)];
      const prev = [5, 10, 20, 25, 50][ri(0, 4)];
      const sick = N * prev / 100;
      const healthy = N - sick;
      if (v === 1) { // missed patients (false negatives)
        const opts = [50, 60, 75, 80, 90].filter((s) => (sick * (100 - s)) % 100 === 0);
        const sens = opts[ri(0, opts.length - 1)];
        return { text: `N=${N}, ${prev}% sick, test catches ${sens}%. How many missed?`,
                 answer: sick * (100 - sens) / 100 };
      }
      if (v === 2) { // false positives from healthy
        const spec = [80, 90][ri(0, 1)];
        return { text: `N=${N}, ${prev}% sick. Healthy false-alarm rate ${100 - spec}%. False positives?`,
                 answer: healthy * (100 - spec) / 100 };
      }
      if (v === 3) { // PPV when prevalence is 50% and se=sp=s
        const s = [70, 75, 80, 85, 90][ri(0, 4)];
        return { text: `Prevalence 50%, sensitivity ${s}%, specificity ${s}%. PPV?`,
                 answer: s };
      }
      if (v === 4) { // z-score
        const mu = [10, 20, 30, 50, 100][ri(0, 4)];
        const sd = [5, 10, 15, 20][ri(0, 3)];
        const k = ri(1, 3);
        return { text: `μ=${mu}, σ=${sd}, patient=${mu + k * sd}. z-score?`, answer: k };
      }
      if (v === 5) { // derivative
        const a = [2, 3, 5][ri(0, 2)], p = ri(1, 3);
        return { text: `f(x) = ${a}x². f′(${p}) = ?`, answer: 2 * a * p };
      }
      { // neuron weighted sum + bias
        const w1 = ri(1, 5), w2 = ri(1, 5), x1 = ri(1, 5), x2 = ri(1, 5), b = ri(0, 3);
        return { text: `Neuron: ${w1}·${x1} + ${w2}·${x2} + ${b} = ?`, answer: w1 * x1 + w2 * x2 + b };
      }
    }
    default: return { text: `${ri(1,9)} + ${ri(1,9)}`, answer: 18 };
  }
}

/* Answer matching: accepts "a/b" for fractions & "^" notation */
function answersMatch(user, problem) {
  const u = String(user).trim().replace(/\s+/g, "");
  if (!u) return false;
  const targets = [problem.answer];
  if (problem.isFraction) targets.push(problem.fallback, problem.answer);
  if (problem.mirror) targets.push(problem.mirror);
  return targets.some((t) => {
    if (typeof t === "number") {
      const n = Number(u);
      return !Number.isNaN(n) && Math.abs(n - t) < 1e-9;
    }
    // fraction text like "3/4"
    const m = /^(-?\d+)\/(\d+)$/.exec(String(t));
    if (!m) return String(t).toLowerCase() === u.toLowerCase();
    return simp(Number(m[1]), Number(m[2])) === normFrac(u);
  });
}
function normFrac(s) {
  const m = /^(-?\d+)\/(\d+)$/.exec(s);
  if (!m) return "";
  return simp(Number(m[1]), Number(m[2]));
}

/* Hint text per problem */
function makeHint(problem) {
  const a = problem.answer;
  if (typeof a === "number") {
    if (a >= 0 && a < 100) return `💡 The answer is ${a % 2 === 0 ? "even" : "odd"} and ${a <= 9 ? "a single digit" : a <= 50 ? "between 10 and 50" : "between 51 and 99"}.`;
    return `💡 The answer has ${String(a).length} digit${String(a).length > 1 ? "s" : ""}.`;
  }
  const [n, d] = a.split("/").map(Number);
  return `💡 The numerator is ${n % 2 === 0 ? "even" : "odd"}.`;
}

/* ---------------- Monsters ---------------- */
const MONSTERS = [
  { name: "Slime",       emoji: "🟢" },
  { name: "Goblin",      emoji: "👹" },
  { name: "Bat Swarm",   emoji: "🦇" },
  { name: "Dire Wolf",   emoji: "🐺" },
  { name: "Ogre",        emoji: "👺" },
  { name: "Wraith",      emoji: "👻" },
  { name: "Stone Golem", emoji: "🗿" },
  { name: "Warlock",     emoji: "🧙" },
  { name: "Dragon",      emoji: "🐉" },
  { name: "Archlich",    emoji: "☠️" },
];

/* MedAI boss track — unlocked at Level 5 (or after 4 wins) */
const MEDAI_BOSSES = [
  { name: "Dr. Bayes", emoji: "🧟" },
  { name: "Overfit Ogre", emoji: "📈" },
  { name: "The Transformer", emoji: "🤖" },
  { name: "False-Positive Phantom", emoji: "👻" },
];

/* ---------------- Battle variables ---------------- */
let battle = null; // {tier, monster, monsterHp, monsterMax, streak, timerId, deadline, timeMax, active, usedPotion}

const TIERS = [
  { name: "Apprentice", time: 10 },
  { name: "Journeyman", time: 12 },
  { name: "Adept", time: 15 },
  { name: "Mage", time: 20 },
  { name: "Archmage", time: 25 },
  { name: "MedAI Boss", time: 35 },
];

function startBattle() {
  const tier = chooseTier();
  const isBoss = tier === 6;
  const base = isBoss ? 45 + state.level * 2 : 18 + tier * 14;
  const monsterHp = base + ri(0, 10) + (isBoss ? 0 : Math.floor(state.level * 1.5));
  const monster = isBoss
    ? MEDAI_BOSSES[ri(0, MEDAI_BOSSES.length - 1)]
    : MONSTERS[Math.min(MONSTERS.length - 1, ri((tier - 1) * 2, tier * 2))];
  battle = {
    tier, monster,
    monsterHp, monsterMax: monsterHp,
    monsterDmg: (isBoss ? 7 : 4) + tier * 3 + Math.floor(state.level / 2),
    streak: 0, active: true, usedPotion: 0,
    timeMax: TIERS[tier - 1].time,
    deadline: 0, timerId: null,
    problem: null,
  };
  state.stats.battles++;
  save();
  showScreen(el.battle);
  el.hintText.textContent = "";
  delLog([isBoss ? "⚠️ MedAI BOSS: " + battle.monster.name + " blocks the path!" : "A wild " + battle.monster.name + " appears!",
          `Category: ${TIERS[tier - 1].name} math`]);
  updateHud();
  nextQuestion();
}

function chooseTier() {
  // MedAI boss battle: 15% chance once the knight knows enough math
  if ((state.level >= 5 || state.stats.wins >= 4) && Math.random() < 0.15) return 6;
  const max = mathTier();
  // mostly fight at the top tier; sometimes train on a lower one
  if (max > 1 && Math.random() < 0.2) return ri(1, max - 1);
  return max;
}

function nextQuestion() {
  battle.problem = generateProblem(battle.tier);
  el.question.textContent = battle.problem.hintIsRemainder
    ? `${battle.problem.text}` : battle.problem.text;
  el.hintText.textContent = "";
  el.answer.value = "";
  el.answer.className = "";
  el.answer.disabled = false;
  el.btnSubmit.disabled = false;
  el.answer.focus();
  battle.deadline = performance.now() + battle.timeMax * 1000;
  clearInterval(battle.timerId);
  battle.timerId = setInterval(tickTimer, 80);
  tickTimer();
}

function tickTimer() {
  if (!battle || !battle.active || !battle.problem) return;
  const left = Math.max(0, battle.deadline - performance.now());
  const pct = left / (battle.timeMax * 1000);
  el.timerFill.style.width = (pct * 100) + "%";
  el.timerFill.classList.toggle("warn", pct < 0.3);
  if (left <= 0) {
    clearInterval(battle.timerId);
    monsterTurn("⏰ Too slow!");
    if (battle.active) nextQuestion();
  }
}

function submitAnswer() {
  if (!battle || !battle.active || !battle.problem) return;
  const ok = answersMatch(el.answer.value, battle.problem);
  if (ok) playerAttack();
  else {
    el.answer.classList.add("bad");
    sfx.wrong();
    monsterTurn("❌ Wrong — the " + battle.monster.name + " strikes!");
    if (battle.active) { battle.streak = 0; battle.problem = null; setTimeout(safeNextQuestion, 700); }
  }
}
function safeNextQuestion() { if (battle && battle.active) nextQuestion(); }

function playerAttack() {
  battle.streak++;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, battle.streak);
  const speedBonus = Math.round(10 * Math.max(0, (battle.deadline - performance.now()) / (battle.timeMax * 1000)));
  const comboMult = Math.min(3, 1 + 0.25 * (battle.streak - 1));
  const dmg = Math.round((10 + battle.tier * 2) * comboMult) + speedBonus;

  el.answer.classList.add("ok");
  sfx.correct();
  showCombo(battle.streak);
  floatDmg(el.monsterDmg, `-${dmg}`, "good");
  animateSprite(el.playerSprite, "attack");
  setTimeout(() => animateSprite(el.monsterSprite, "hurt"), 150);

  battle.monsterHp = Math.max(0, battle.monsterHp - dmg);
  addLog(`⚔️ You hit for ${dmg} damage!`);
  battle.problem = null;
  clearInterval(battle.timerId);
  updateHud();

  if (battle.monsterHp <= 0) { setTimeout(() => winBattle(), 500); return; }
  setTimeout(() => { if (battle && battle.active) nextQuestion(); }, 350);
}

function monsterTurn(msg) {
  if (!battle || !battle.active) return;
  if (battle.streak >= 3) showCombo(0);
  const dmg = battle.monsterDmg + ri(0, 4);
  state.hp = Math.max(0, state.hp - dmg);
  addLog(msg + ` You lose ${dmg} HP.`);
  floatDmg(el.playerDmg, `-${dmg}`, "bad");
  animateSprite(el.monsterSprite, "attack");
  setTimeout(() => { animateSprite(el.playerSprite, "hurt"); shake(); }, 150);
  sfx.hit();
  updateHud();
  if (state.hp <= 0) { battle.active = false; clearInterval(battle.timerId); save(); setTimeout(defeat, 600); }
}

function winBattle() {
  if (!battle) return;
  battle.active = false;
  clearInterval(battle.timerId);
  state.stats.wins++;
  const xp = 18 + battle.tier * 12 + ri(0, 8);
  const gold = 12 + battle.tier * 10 + ri(0, 10);
  let msg = `You defeated the ${battle.monster.name}! +${xp} XP, +${gold} gold.`;
  state.gold += gold;
  if (ri(1, 4) === 1) { state.potions++; msg += " Loot: 🧪 potion!"; }
  state.xp += xp;
  addLog(`🏆 ${msg}`);
  save();

  const leveled = tryLevelUp();
  updateHud();
  setTimeout(() => openShop(msg, leveled), 700);
}

function tryLevelUp() {
  let levels = 0;
  let need = xpNeeded(state.level);
  while (state.xp >= need) {
    state.xp -= need; state.level++; levels++;
    state.maxHp += 6; state.hp = state.maxHp;
    need = xpNeeded(state.level);
  }
  if (levels > 0) {
    sfx.levelup();
    const wasTier = Math.max(0, state.level - levels >= 13 ? 5 : state.level - levels >= 10 ? 4 : state.level - levels >= 7 ? 3 : state.level - levels >= 4 ? 2 : 1);
    const nowTier = mathTier();
    const unlockMsg = nowTier > wasTier ? ` New math unlocked: ${TIERS[nowTier - 1].name}!` : "";
    localStorage.setItem("mq_pending_levelup", String(levels) + "|" + unlockMsg);
    return true;
  }
  return false;
}

function xpNeeded(level) { return 30 + (level - 1) * 18; }

function defeat() {
  state.hp = state.maxHp; // mercy heal — keep progress, keep it fun
  battle = null;
  save();
  showScreen(el.shop);
  el.shopTitle.textContent = "🏕️ Revived & Ready";
  el.shopSub.textContent = "The knight was patched up in the village. Keep your gold and XP — try again!";
  renderShop();
  updateHud();
  showModal("💀", "Defeat!", "No worries — you kept your gold and XP. Rest up and strike back!", "Respawn");
}

/* ---------------- Shop ---------------- */
function openShop(message, showLevelup) {
  showScreen(el.shop);
  const pending = localStorage.getItem("mq_pending_levelup");
  if (showLevelup && pending) {
    const [n, unlock] = pending.split("|");
    localStorage.removeItem("mq_pending_levelup");
    setTimeout(() => showModal("⭐", "LEVEL UP!", `You reached Level ${state.level}.${unlock}`, "Great!"), 200);
  } else {
    el.shopTitle.textContent = "🏕️ Victory Camp";
    el.shopSub.textContent = message;
  }
  el.btnNext.textContent = "⚔️ Fight on!";
  renderShop();
}

function renderShop() {
  el.buyPotion.disabled = state.gold < 30;
  el.buyHint.disabled = state.gold < 20;
  el.buyMaxHp.disabled = state.gold < 50;
  el.campStats.textContent = `Battles: ${state.stats.battles} · Wins: ${state.stats.wins} · Best combo: x${state.stats.bestStreak}`;
}

/* ---------------- UI helpers ---------------- */
function showScreen(scrn) {
  el.battle.classList.toggle("hidden", scrn !== el.battle);
  el.shop.classList.toggle("hidden", scrn !== el.shop);
}

function updateHud() {
  el.hudLevel.textContent = "Lv " + state.level;
  el.hudGold.textContent = state.gold;
  el.xpFill.style.width = Math.min(100, (state.xp / xpNeeded(state.level)) * 100) + "%";
  el.xpText.textContent = `${state.xp} / ${xpNeeded(state.level)} XP`;
  el.hintCount.textContent = state.hints;
  el.potionCount.textContent = state.potions;
  el.btnHint.disabled = state.hints <= 0 || !battle || !battle.active;
  el.btnPotion.disabled = state.potions <= 0 || !battle || !battle.active;

  if (battle) {
    el.monsterName.textContent = battle.monster.name;
    el.monsterSprite.textContent = battle.monster.emoji;
    el.monsterHp.style.width = (battle.monsterHp / battle.monsterMax * 100) + "%";
    el.monsterHpText.textContent = `${battle.monsterHp}/${battle.monsterMax}`;
  }
  el.playerHp.style.width = (state.hp / state.maxHp * 100) + "%";
  el.playerHpText.textContent = `${state.hp}/${state.maxHp}`;
  el.playerHp.classList.toggle("low", state.hp / state.maxHp < 0.3);
  el.plLevel.textContent = state.level;
}

function animateSprite(node, cls) {
  node.classList.remove(cls);
  void node.offsetWidth;
  node.classList.add(cls);
}
function floatDmg(layer, text, type) {
  const d = document.createElement("div");
  d.className = "float-dmg " + type;
  d.textContent = text;
  d.style.left = (40 + Math.random() * 20) + "%";
  layer.appendChild(d);
  setTimeout(() => d.remove(), 1000);
}
function showCombo(n) {
  if (n >= 2) {
    el.combo.textContent = `🔥 COMBO x${n}!`;
    el.combo.classList.add("show");
  } else el.combo.classList.remove("show");
}
function shake() {
  const app = $("app");
  app.classList.remove("shake");
  void app.offsetWidth;
  app.classList.add("shake");
}
function addLog(text) {
  const d = document.createElement("div");
  d.textContent = text;
  el.log.appendChild(d);
  while (el.log.children.length > 4) el.log.firstChild.remove();
}
function delLog(lines) { el.log.textContent = ""; lines.forEach(addLog); }

function showModal(icon, title, text, btn) {
  el.modalIcon.textContent = icon;
  el.modalTitle.textContent = title;
  el.modalText.textContent = text;
  el.modalBtn.textContent = btn;
  el.overlay.classList.remove("hidden");
}

/* ---------------- Events ---------------- */
el.btnSubmit.addEventListener("click", submitAnswer);
el.answer.addEventListener("keydown", (e) => { if (e.key === "Enter") submitAnswer(); });

el.btnPotion.addEventListener("click", () => {
  if (state.potions <= 0 || !battle || !battle.active || battle.usedPotion >= 3) return;
  state.potions--;
  battle.usedPotion++;
  const heal = Math.min(40, state.maxHp - state.hp);
  state.hp += heal;
  sfx.heal();
  floatDmg(el.playerDmg, `+${heal}`, "heal");
  addLog(`🧪 Potion restores ${heal} HP.`);
  updateHud();
  save();
  el.answer.focus();
});

el.btnHint.addEventListener("click", () => {
  if (state.hints <= 0 || !battle || !battle.active || !battle.problem) return;
  state.hints--;
  el.hintText.textContent = battle.problem.hintIsRemainder
    ? "💡 Divide fully, the leftover is your answer." : makeHint(battle.problem);
  updateHud();
  save();
});

el.btnFlee.addEventListener("click", () => {
  if (!battle) return;
  battle.active = false;
  clearInterval(battle.timerId);
  battle = null;
  showScreen(el.shop);
  el.shopTitle.textContent = "🏕️ Rest Point";
  el.shopSub.textContent = "You retreated to safety. Regroup and fight on!";
  renderShop();
  updateHud();
});

el.buyPotion.addEventListener("click", () => { if (state.gold >= 30) { state.gold -= 30; state.potions++; sfx.click(); save(); updateHudEl(); } });
el.buyHint.addEventListener("click", () => { if (state.gold >= 20) { state.gold -= 20; state.hints++; sfx.click(); save(); updateHudEl(); } });
el.buyMaxHp.addEventListener("click", () => { if (state.gold >= 50) { state.gold -= 50; state.maxHp += 10; state.hp += 10; sfx.heal(); save(); updateHudEl(); } });
function updateHudEl() { updateHud(); updateHudFixed(); renderShop(); }
function updateHudFixed() { /* placeholder for parity */ }

el.btnNext.addEventListener("click", () => { sfx.click(); startBattle(); });
el.modalBtn.addEventListener("click", () => {
  el.overlay.classList.add("hidden");
  // modal may have appeared over shop; ensure shop visible & fresh text
  if (!el.shop.classList.contains("hidden")) { el.shopTitle.textContent = "🏕️ Victory Camp"; el.shopSub.textContent = "Spend your gold, then fight on!"; }
});

el.btnSound.addEventListener("click", () => {
  soundOn = !soundOn;
  el.btnSound.textContent = soundOn ? "🔊" : "🔇";
  if (soundOn) sfx.click();
});

/* ---------------- Boot ---------------- */
updateHud();
showScreen(el.shop);
el.shopTitle.textContent = "⚔️ MathQuest";
el.shopSub.textContent = "The village knight needs a mathematician. Ready for your first battle, Lv " + state.level + " knight?";
el.btnNext.textContent = state.stats.battles > 0 ? "⚔️ Continue quest!" : "⚔️ Begin quest!";
renderShop();
localStorage.removeItem("mq_pending_levelup");

})();
