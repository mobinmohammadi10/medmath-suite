# MedMath Suite

**A dependency-free, offline learning suite for the mathematics behind AI in medicine.**

Two apps, one repo:

| App | What it is |
| --- | --- |
| [**MedMath Lab**](medmath-lab/) | A 7-unit interactive course that takes you from arithmetic to reading clinical-AI papers like a reviewer. |
| [**MathQuest**](mathquest/) | A math RPG where solving problems *is* your weapon — the math you learn becomes the game's combat system. |

No build step, no package manager, no network required. Open an `index.html` and go.

## Live demo

- **MedMath Lab:** <https://mobinmohammadi10.github.io/medmath-suite/medmath-lab/>
- **MathQuest:** <https://mobinmohammadi10.github.io/medmath-suite/mathquest/>
- **Landing page:** <https://mobinmohammadi10.github.io/medmath-suite/>

---

## Why this exists

Medical-AI papers assume a toolkit most readers never assembled: linear algebra, calculus and gradients, probability and Bayes, evaluation metrics, and enough deep-learning vocabulary to parse a methods section. MedMath Lab builds that toolkit in order — intuition first, then notation, then a worked example, then the medicine connection — and ends with structured peer-review missions that put the tools to work on realistic (invented but faithful) abstracts.

MathQuest is the practice loop: the same math, turned into combat against monsters and MedAI bosses, with streaks, speed bonuses and a save file.

---

## Features

### MedMath Lab
- **7 units / 41 lessons / 114 quiz questions**
  - 0 Foundations · 1 Linear Algebra · 2 Calculus & Optimization · 3 Probability & Bayes
  - 4 ML Core · 5 Evaluation for Medicine · 6 Deep Learning for Medicine
- **18 interactive canvas demos** — function graphs, dot products, gradient descent, the diagnostic-test lab, threshold dials, ROC curves, overfitting, CNN filters, attention, and more.
- **Progressive unlocking** — the next unit opens at ≥80% of the previous.
- **📄 Paper missions** — capstone "read like a reviewer" drills in every unit.
- **📚 Landmark papers library** — 27 curated papers tagged to the units that unlock their ideas, each with *why it matters*, *what to read it for*, a **reviewer's drill** with a hidden model answer, and a Google Scholar link.
- **📦 Spaced review** — every learned question resurfaces on an Anki-style 1 / 3 / 7 / 14 / 30-day schedule.

### MathQuest
- **6 math tiers** from addition/subtraction up to MedAI boss battles.
- **MedAI bosses** — Dr. Bayes, Overfit Ogre, The Transformer and the False-Positive Phantom — with clinical count problems (missed patients, false positives, PPV, z-scores, derivatives, neuron weighted sums).
- Streak- and speed-based damage, a camp shop, and LocalStorage saving.

Both apps save progress locally in your browser (`localStorage`); nothing is uploaded anywhere.

---

## Run it

There is nothing to install.

```bash
git clone <your-repo-url>
cd medmath-suite
```

Then open the app in a browser:

- **MedMath Lab:** open `medmath-lab/index.html`
- **MathQuest:** open `mathquest/index.html`

(Opening the file directly works because everything is plain HTML/CSS/JS and all resources are local. For the cleanest experience you can also serve the folder with any static server, e.g. `python3 -m http.server`.)

---

## Repository layout

```
medmath-suite/
├── medmath-lab/
│   ├── index.html      # course map / lesson / review / papers screens
│   ├── lessons.js      # units, lessons, quizzes, paper missions
│   ├── papers.js       # 27 landmark papers + reviewer's drills
│   ├── demos.js        # 18 canvas-based interactive demos
│   ├── lab.js          # app engine (progress, review queue, papers)
│   └── style.css
├── mathquest/
│   ├── index.html      # game UI
│   ├── game.js         # engine: tiers, problems, bosses, save
│   └── style.css
├── LICENSE
└── README.md
```

The ⚔️ Game button in MedMath Lab links to `../mathquest/index.html`, so keep the two folders as siblings.

---

## Curriculum at a glance

| Unit | Title | You learn |
| --- | --- | --- |
| 0 | Foundations Refresher | functions, graphs, slope, exponents, logs, sigma/weighted sums |
| 1 | Linear Algebra | vectors, dot products, matrices, images as matrices, `y = σ(Wx + b)` |
| 2 | Calculus & Optimization | derivatives, chain rule, gradient descent |
| 3 | Probability & Bayes | probability rules, distributions, the Diagnostic Test Lab |
| 4 | Machine Learning Core | train/test splits, loss functions, overfitting, leakage |
| 5 | Evaluation for Medicine | sensitivity/specificity, ROC/AUC, PPV/NPV, calibration |
| 6 | Deep Learning for Medicine | CNNs, embeddings, attention/transformers, LLMs, capstone review |

---

## Contributing

Issues and pull requests are welcome. The apps are intentionally dependency-free; please keep them runnable by opening a file directly.

---

## License

[MIT](LICENSE) © 2026 MedMath Suite contributors.

---

## Disclaimer

This is an educational project. It is **not** medical software and must not be used for diagnosis, treatment, or any clinical decision. Paper abstracts used in the missions are illustrative reconstructions, not verbatim reproductions.