/* =========================================================
   MedMath Lab — app engine: map, lessons, quizzes, review
   ========================================================= */
"use strict";

const SAVE_KEY = "medmath_lab_v1";
const $ = (id) => document.getElementById(id);
const el = {
  totalProgress: $("total-progress"), progressText: $("progress-text"),
  reviewBtn: $("btn-reviews"), reviewCount: $("review-count"),
  map: $("map-screen"), lesson: $("lesson-screen"), review: $("review-screen"),
  papers: $("papers-screen"), papersCount: $("papers-count"), btnPapers: $("btn-papers"),
  btnBackPapers: $("btn-back-papers"), paperFilters: $("paper-filters"),
  paperList: $("paper-list"), hideRead: $("hide-read"), btnLessonPapers: $("btn-lesson-papers"),
  unitGrid: $("unit-grid"), lessonBody: $("lesson-body"), quizBox: $("quiz-box"),
  lessonCrumb: $("lesson-crumb"), btnBack: $("btn-back"),
  btnNext: $("btn-next-lesson"), reviewBox: $("review-box"),
  reviewDone: $("review-done"), btnBackReview: $("btn-back-review"),
  overlay: $("modal-overlay"), modalIcon: $("modal-icon"),
  modalTitle: $("modal-title"), modalText: $("modal-text"), modalBtn: $("modal-btn"),
  reset: $("btn-reset"),
};

const DAY = 86400000;
const INTERVALS = [1, 3, 7, 14, 30]; // days per successful recall

let state = load() || {
  completed: {},          // lessonId -> true
  reviews: {},            // qid -> {due, streak}
};
if (!state.papersRead) state.papersRead = {}; // paperId -> true

function load() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {} }

/* ---------------- Unit lock logic ---------------- */
function unitLessons(u) { return u.lessons || []; }
function unitProgress(u) {
  const total = unitLessons(u).length;
  if (!total) return 0;
  const done = unitLessons(u).filter(l => state.completed[l.id]).length;
  return Math.round((done / total) * 100);
}
function isUnlocked(u, idx) {
  if (u.phase > 1) return { ok: false, reason: `Built in Phase ${u.phase}` };
  for (let j = idx - 1; j >= 0; j--) {
    if (UNITS[j].phase > 1) break;
    if (unitProgress(UNITS[j]) < 80) return { ok: false, reason: "Finish ≥80% previous unit" };
  }
  return { ok: true };
}

/* ---------------- Course map ---------------- */
function renderMap() {
  el.unitGrid.innerHTML = "";
  UNITS.forEach((u, idx) => {
    const lk = isUnlocked(u, idx);
    const pct = unitProgress(u);
    const card = document.createElement("div");
    card.className = "unit-card" + (lk.ok ? "" : " locked");
    const totalL = unitLessons(u).length;
    const np = papersOfUnit(u.id).length;
    card.innerHTML = u.phase > 1
      ? `🔒<span class="lock-tag">Phase ${u.phase}</span>
         <div class="unit-head"><span class="unit-emoji">${u.emoji}</span>
         <div><h3>${u.title}</h3><div class="unit-sub">${u.sub}</div></div></div>
         <div class="unit-meta"><span>Coming soon</span><span></span></div>`
      : `<div class="unit-head"><span class="unit-emoji">${u.emoji}</span>
         <div><h3>${u.title}</h3><div class="unit-sub">${u.sub}</div></div></div>
         <div class="unit-bar"><div style="width:${pct}%"></div></div>
         <div class="unit-meta"><span>${pct}% complete</span><span>${totalL} lessons</span></div>
         ${np ? `<div class="unit-papers">📄 ${np} landmark paper${np > 1 ? "s" : ""}</div>` : ""}`
      ;
    if (!lk.reason && lk.ok) card.addEventListener("click", () => {
      if (!totalL) return;
      currentUnit = u;
      showLesson(firstIncompleteIdx(u)); // pass the index, not the lesson object
    });
    else if (lk.reason) card.title = lk.reason;
    el.unitGrid.appendChild(card);
  });
  // overall
  const live = UNITS.filter(u => u.phase === 1);
  const tot = live.reduce((s, u) => s + unitLessons(u).length, 0);
  const done = live.reduce((s, u) => s + unitLessons(u).filter(l => state.completed[l.id]).length, 0);
  const pct = tot ? Math.round((done / tot) * 100) : 0;
  el.totalProgress.style.width = pct + "%";
  el.progressText.textContent = pct + "% of current units";
  // reviews
  const due = dueReviews().length;
  el.reviewCount.textContent = due;
  el.reviewBtn.classList.toggle("has-due", due > 0);
  updatePapersCount();
}

function firstIncompleteIdx(u) {
  const i = unitLessons(u).findIndex(l => !state.completed[l.id]);
  return i === -1 ? 0 : i;
}

/* ---------------- Lesson flow ---------------- */
let currentUnit = null, currentIdx = 0, quizIdx = 0, quizCorrect = 0;

function showLesson(idx) {
  currentIdx = idx;
  const les = unitLessons(currentUnit)[idx];
  el.map.classList.add("hidden");
  el.review.classList.add("hidden");
  el.papers.classList.add("hidden");
  el.lesson.classList.remove("hidden");
  el.lessonCrumb.textContent = `${currentUnit.title} · Lesson ${idx + 1}/${unitLessons(currentUnit).length}`;
  el.btnNext.classList.add("hidden");
  el.lessonBody.innerHTML = "";
  window.scrollTo(0, 0);

  const head = document.createElement("h2");
  head.className = "lesson-head";
  head.textContent = les.title;
  head.style.cssText = "font-size:20px;margin-bottom:4px";
  const sub = document.createElement("div");
  sub.className = "lesson-head-sub";
  sub.textContent = `${unitLessons(currentUnit).filter(l => state.completed[l.id]).length >= idx && state.completed[les.id] ? "🔁 " + les.sections.length + " cards — review by scrolling" : les.sections.length + " concept cards + quiz"}`;
  sub.style.cssText = "color:var(--muted);font-size:12px;margin-bottom:12px";
  el.lessonBody.append(head, sub);

  les.sections.forEach(s => {
    const d = document.createElement("div");
    d.className = "sec " + s.type;
    d.innerHTML = `<h4>${{ intuition: "💡 Intuition", notation: "✒️ Notation", example: "🧪 Worked example", insight: "🩺 Medicine connection", demo: "🎛️ Playground" }[s.type]}</h4>`;
    if (s.html) {
      const p = document.createElement("p");
      p.innerHTML = s.html;
      if (s.type === "notation") p.className = "formula";
      d.appendChild(p);
    }
    if (s.demo && DEMOS[s.demo]) {
      const dm = document.createElement("div");
      dm.className = "demo";
      d.appendChild(dm);
      DEMOS[s.demo](dm);
    }
    el.lessonBody.appendChild(d);
  });

  quizIdx = 0; quizCorrect = 0;
  renderQuizCard(les);
}

function renderQuizCard(les) {
  const box = el.quizBox;
  box.innerHTML = "";
  if (quizIdx >= les.quiz.length) { onLessonQuizDone(les); return; }

  const q = les.quiz[quizIdx];
  const card = document.createElement("div");
  card.className = "quiz-card";
  card.innerHTML = `<div class="quiz-label">✅ Check yourself — question ${quizIdx + 1}/${les.quiz.length}</div>
                    <div class="quiz-q">${q.q}</div>`;
  let answered = false;
  q.choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = c;
    b.onclick = () => {
      if (answered) return;
      answered = true;
      const ok = i === q.answer;
      if (ok) quizCorrect++;
      [...card.querySelectorAll(".choice")].forEach((bb, j) => {
        bb.disabled = true;
        if (j === q.answer) bb.classList.add("correct");
        else if (j === i) bb.classList.add("wrong");
      });
      const ex = document.createElement("div");
      ex.className = "quiz-explain";
      ex.innerHTML = (ok ? "🎉 <b>Correct.</b> " : "🤔 <b>Not quite.</b> ") + q.explain;
      card.appendChild(ex);
      const act = document.createElement("div");
      act.className = "quiz-actions";
      const next = document.createElement("button");
      next.className = "btn primary";
      next.textContent = quizIdx + 1 < les.quiz.length ? "Next question →" : "Finish ✓";
      next.onclick = () => { quizIdx++; renderQuizCard(les); };
      act.appendChild(next);
      card.appendChild(act);
    };
    card.appendChild(b);
  });
  box.appendChild(card);
}

function onLessonQuizDone(les) {
  const passed = quizCorrect >= Math.ceil(les.quiz.length * 0.5);
  const wasDone = !!state.completed[les.id];
  if (passed) {
    state.completed[les.id] = true;
    // schedule reviews for these questions
    const now = Date.now();
    les.quiz.forEach((q, i) => {
      const qid = `${les.id}q${i}`;
      if (!state.reviews[qid]) state.reviews[qid] = { due: now + INTERVALS[0] * DAY, streak: 0 };
    });
    save();
  }
  el.quizBox.innerHTML = `<div class="quiz-card" style="text-align:center">
      <div class="quiz-label">Lesson ${quizIdx && passed ? "complete" : "attempt"}</div>
      <div style="font-size:40px;margin:8px 0">${passed ? (wasDone ? "🔁" : "🎓") : "💪"}</div>
      <div class="quiz-q">${passed ? (quizCorrect === les.quiz.length ? "Perfect score — " : "") + (wasDone ? "Refreshed!" : "Lesson learned!") : "Almost — give it another go to lock it in."}</div>
      <div style="color:var(--muted);font-size:13px">${passed ? "Review scheduled: these questions will resurface automatically." : "Reread the cards above, then retry."}</div>
    </div>`;
  if (passed) {
    el.btnNext.classList.remove("hidden");
    const last = currentIdx + 1 >= unitLessons(currentUnit).length;
    el.btnNext.textContent = last ? `${currentUnit.emoji} Unit complete — back to map →` : "Next lesson →";
    el.btnNext.onclick = () => {
      if (last) { goMap(); maybeCongratulate(); }
      else showLesson(currentIdx + 1);
    };
  } else {
    const retry = document.createElement("button");
    retry.className = "btn primary"; retry.textContent = "↻ Retry quiz";
    retry.onclick = () => { quizIdx = 0; quizCorrect = 0; renderQuizCard(les); };
    retry.style.cssText = "display:block;margin:10px auto 0";
    el.quizBox.appendChild(retry);
  }
  renderMap();
}

function maybeCongratulate() {
  const u = currentUnit;
  if (u && unitLessons(u).length && unitProgress(u) === 100) {
    showModal("🏆", `${u.emoji} ${u.title} — mastered!`,
      `100% complete. These tools are now yours forever (the review queue will keep them sharp). Next unit builds directly on this.`);
  }
}

/* ---------------- Spaced review ---------------- */
function dueReviews() {
  const now = Date.now();
  return Object.entries(state.reviews).filter(([, r]) => r.due <= now);
}
function findQuestion(qid) {
  // qid format: <lessonId>q<questionIndex>, e.g. "u0-1q0", "u2-mq1"
  const m = /^(.+?)q(\d+)$/.exec(qid);
  if (!m) return null;
  const lesIdPart = m[1], qIdx = +m[2];
  for (const u of UNITS) for (const l of unitLessons(u))
    if (l.id === lesIdPart) return { les: l, q: l.quiz[qIdx], qIdx };
  return null;
}

function openReview() {
  const due = dueReviews().sort((a, b) => a[1].due - b[1].due);
  el.map.classList.add("hidden");
  el.lesson.classList.add("hidden");
  el.papers.classList.add("hidden");
  el.review.classList.remove("hidden");
  el.reviewDone.classList.toggle("hidden", due.length > 0);
  el.reviewBox.innerHTML = "";
  if (!due.length) return;

  const [qid, rec] = due[0];
  const found = findQuestion(qid);
  if (!found || !found.q) { delete state.reviews[qid]; save(); renderMap(); return; }

  const { les, q } = found;
  const card = document.createElement("div");
  card.className = "quiz-card";
  card.innerHTML = `<div class="quiz-label">📦 From: ${les.title}</div><div class="quiz-q">${q.q}</div>`;
  let answered = false;
  q.choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "choice"; b.textContent = c;
    b.onclick = () => {
      if (answered) return;
      answered = true;
      const ok = i === q.answer;
      [...card.querySelectorAll(".choice")].forEach((bb, j) => {
        bb.disabled = true;
        if (j === q.answer) bb.classList.add("correct");
        else if (j === i) bb.classList.add("wrong");
      });
      const ex = document.createElement("div");
      ex.className = "quiz-explain";
      ex.innerHTML = (ok ? "🎉 <b>Correct.</b> " : "🤔 <b>Not quite.</b> ") + q.explain;
      card.appendChild(ex);
      // schedule
      if (ok) rec.streak = Math.min(rec.streak + 1, INTERVALS.length - 1);
      else rec.streak = 0;
      rec.due = Date.now() + INTERVALS[rec.streak] * DAY;
      save();
      const act = document.createElement("div");
      act.className = "quiz-actions";
      const next = document.createElement("button");
      next.className = "btn primary";
      next.textContent = ok ? `💪 Locked in — next in ${INTERVALS[rec.streak]} day${INTERVALS[rec.streak] > 1 ? "s" : ""}. Next card →` : "🔁 Will resurface tomorrow. Next card →";
      next.onclick = openReview; // re-render with next due
      act.appendChild(next);
      card.appendChild(act);
    };
    card.appendChild(b);
  });
  el.reviewBox.appendChild(card);
}

/* ---------------- Landmark papers library ---------------- */
let paperFilter = "all";      // "all" or a unit id
let paperHideReadFlag = false;

const UNIT_TITLE = {};
UNITS.forEach(u => { UNIT_TITLE[u.id] = u.emoji + " " + u.title; });
const DIFF_LABEL = { 1: "★ easy", 2: "★★ research", 3: "★★★ deep end" };

function papersOfUnit(uid) { return PAPERS.filter(p => p.unit === uid); }
function papersReadCount() { return PAPERS.filter(p => state.papersRead[p.id]).length; }

function updatePapersCount() {
  el.papersCount.textContent = papersReadCount() + "/" + PAPERS.length;
}

function openPapers(unitId) {
  paperFilter = unitId || "all";
  el.map.classList.add("hidden");
  el.lesson.classList.add("hidden");
  el.review.classList.add("hidden");
  el.papers.classList.remove("hidden");
  window.scrollTo(0, 0);
  renderPapers();
}

function renderPapers() {
  // filter chips: All + units that have papers
  el.paperFilters.innerHTML = "";
  const mkChip = (label, val) => {
    const b = document.createElement("button");
    b.className = "chip" + (paperFilter === val ? " active" : "");
    b.textContent = label;
    b.onclick = () => { paperFilter = val; renderPapers(); };
    el.paperFilters.appendChild(b);
  };
  mkChip("All (" + PAPERS.length + ")", "all");
  UNITS.forEach(u => {
    const n = papersOfUnit(u.id).length;
    if (n) mkChip(`${u.emoji} ${u.title.split(" ")[0]} (${n})`, u.id);
  });

  // list
  el.paperList.innerHTML = "";
  let list = paperFilter === "all" ? PAPERS.slice() : papersOfUnit(paperFilter);
  if (paperHideReadFlag) list = list.filter(p => !state.papersRead[p.id]);
  list.sort((a, b) => (a.unit === b.unit ? a.year - b.year : a.unit.localeCompare(b.unit)));

  if (!list.length) {
    const d = document.createElement("div");
    d.className = "empty-state";
    d.textContent = paperHideReadFlag ? "Everything here is read. Uncheck 'hide read' to revisit." : "No papers for this filter.";
    el.paperList.appendChild(d);
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "paper-card" + (state.papersRead[p.id] ? " read" : "");
    const stars = "★★★".slice(0, p.diff).padEnd(3, "☆");
    const url = "https://scholar.google.com/scholar?q=" + encodeURIComponent(p.title + " " + p.authors);
    const tags = p.tags.map(t => `<span class="ptag">${t}</span>`).join("");
    card.innerHTML =
      `<div class="paper-head">
         <div class="paper-title"><a href="${url}" target="_blank" rel="noopener">${p.title}</a></div>
         <span class="stars" title="difficulty">${stars}</span>
       </div>
       <div class="paper-meta">${p.authors} · ${p.venue} ${p.year}</div>
       <div class="paper-tagrow"><span class="ptag unit">${UNIT_TITLE[p.unit] || p.unit}</span>${tags}</div>
       <div class="paper-why">${p.why}</div>
       <div class="paper-readfor">🔎 Read it for:
         <ul>${p.readFor.map(r => `<li>${r}</li>`).join("")}</ul>
       </div>`;
    // reviewer's drill
    const drill = document.createElement("div");
    drill.className = "drill";
    drill.innerHTML = `<div class="drill-q">🎯 Reviewer's drill — ${p.drill.q}</div>`;
    const ans = document.createElement("div");
    ans.className = "drill-a";
    ans.textContent = "💡 " + p.drill.a;
    ans.style.display = "none";
    const revealBtn = document.createElement("button");
    revealBtn.className = "btn ghost drill-btn";
    revealBtn.textContent = "Reveal model answer";
    revealBtn.onclick = () => {
      const shown = ans.style.display !== "none";
      ans.style.display = shown ? "none" : "block";
      revealBtn.textContent = shown ? "Reveal model answer" : "Hide answer";
    };
    drill.appendChild(revealBtn);
    drill.appendChild(ans);
    card.appendChild(drill);
    // footer: read toggle + metadata
    const foot = document.createElement("div");
    foot.className = "paper-foot";
    const readBtn = document.createElement("button");
    readBtn.className = "btn ghost read-btn" + (state.papersRead[p.id] ? " primary" : "");
    readBtn.textContent = state.papersRead[p.id] ? "✓ Read" : "Mark as read";
    readBtn.onclick = () => {
      if (state.papersRead[p.id]) delete state.papersRead[p.id];
      else state.papersRead[p.id] = true;
      save();
      updatePapersCount();
      renderPapers();
    };
    foot.appendChild(readBtn);
    const diffNote = document.createElement("span");
    diffNote.className = "paper-meta";
    diffNote.style.margin = "0";
    diffNote.textContent = DIFF_LABEL[p.diff];
    foot.appendChild(diffNote);
    card.appendChild(foot);
    el.paperList.appendChild(card);
  });
}

el.btnPapers.onclick = () => openPapers("all");
el.btnBackPapers.onclick = goMap;
el.btnLessonPapers.onclick = () => {
  const uid = currentUnit ? currentUnit.id : null;
  openPapers(uid && papersOfUnit(uid).length ? uid : "all");
};
el.hideRead.onchange = () => { paperHideReadFlag = !!el.hideRead.checked; renderPapers(); };

/* ---------------- Navigation & misc ---------------- */
function goMap() {
  el.lesson.classList.add("hidden");
  el.review.classList.add("hidden");
  el.papers.classList.add("hidden");
  el.map.classList.remove("hidden");
  renderMap();
  window.scrollTo(0, 0);
}
function showModal(icon, title, text, btn) {
  el.modalIcon.textContent = icon;
  el.modalTitle.textContent = title;
  el.modalText.textContent = text;
  el.modalBtn.textContent = btn || "Continue";
  el.overlay.classList.remove("hidden");
}
el.modalBtn.onclick = () => el.overlay.classList.add("hidden");
el.btnBack.onclick = goMap;
el.btnBackReview.onclick = goMap;
el.reviewBtn.onclick = openReview;
el.reset.onclick = (e) => {
  e.preventDefault();
  if (confirm("Reset ALL progress? This cannot be undone.")) {
    state = { completed: {}, reviews: {}, papersRead: {} };
    save();
    goMap();
  }
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el.overlay.classList.contains("hidden")) el.overlay.classList.add("hidden");
});

/* boot */
renderMap();
