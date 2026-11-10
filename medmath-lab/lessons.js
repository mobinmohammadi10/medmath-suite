/* =========================================================
   MedMath Lab — curriculum content (Units 0 & 1)
   Section types: intuition | notation | example | insight | demo
   ========================================================= */

const UNITS = [
  {
    id: "u0", phase: 1, emoji: "🔢", title: "Foundations Refresher",
    sub: "Functions, slope, exponents, logs — the working toolkit",
    lessons: [
      {
        id: "u0-1", title: "Functions — the machine",
        sections: [
          { type: "intuition", html: `Think of a <b>function</b> as a machine: you feed it an input, it always produces the same output. Put in 3, <code>f(x) = 2x + 1</code> spits out 7 — every single time. That predictability is why we trust them.` },
          { type: "example", html: `Worked example with <code>f(x) = 3x − 2</code>:<br>• f(0) = 3·0 − 2 = <b>−2</b><br>• f(4) = 3·4 − 2 = <b>10</b><br>• f(−1) = −3 − 2 = <b>−5</b>` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a classifier like "diabetes risk" is just a function. Input = a patient's data, output = a risk score. Same patient in → same risk out. Nearly everything you'll read in papers is a function being tuned.` },
        ],
        quiz: [
          { q: "If f(x) = 3x − 2, what is f(4)?", choices: ["6", "10", "12", "14"], answer: 1, explain: "f(4) = 3·4 − 2 = 12 − 2 = 10. Multiply first, then subtract." },
          { q: "A model that maps a patient's data to a risk score is best described as…", choices: ["A database", "A function", "A diagnosis", "A chart"], answer: 1, explain: "Every AI model is a function: data in → prediction out. Papers describe exactly what that function is." },
        ],
      },
      {
        id: "u0-2", title: "Graphs & slope",
        sections: [
          { type: "intuition", html: `Plot a function and you can <b>see</b> it. The <b>slope</b> is how fast y rises as x moves: <span class="formula">slope = rise / run</span>. Slope 2 means "y goes up 2 for every step of x". Flat = slope 0. Downhill = negative.` },
          { type: "notation", html: `The line <span class="formula">y = a·x + b</span> has slope <b>a</b> and intercept <b>b</b> (where it crosses the vertical axis). Play with it:`, demo: "funcgraph" },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "dose-response curves" are graphs, and in Unit 2 the slope of a loss curve tells a model <em>which way to learn</em>. Slope is the single most reused idea in this course.` },
        ],
        quiz: [
          { q: "What is the slope of y = 5x + 3?", choices: ["3", "5", "8", "5/3"], answer: 1, explain: "The number multiplying x is the slope: 5. The +3 just slides the line up; it doesn't change steepness." },
          { q: "A line with slope 0 looks…", choices: ["Vertical", "Flat/horizontal", "Steeply rising", "Curved"], answer: 1, explain: "Slope 0 = no rise as x moves = a perfectly flat line." },
        ],
      },
      {
        id: "u0-3", title: "Exponents — repeated multiplication",
        sections: [
          { type: "intuition", html: `<span class="formula">2³ = 2 × 2 × 2 = 8</span>. Exponents are multiplication done to itself. They grow <b>fast</b> — watch linear growth get destroyed by exponential growth:`, demo: "growthdemo" },
          { type: "notation", html: `<code>2⁰ = 1</code>, <code>2¹ = 2</code>, <code>2¹⁰ = 1024</code>. A negative exponent flips: <code>2⁻² = 1/4</code>. Powers of 2 are everywhere in computing — 8 bits = 2⁸ = 256 values.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a genome has ~3×10⁹ base pairs; networks have millions of weights. Exponential notation is how the field talks about big numbers without fainting.` },
        ],
        quiz: [
          { q: "2¹⁰ = ?", choices: ["20", "100", "512", "1024"], answer: 3, explain: "2¹⁰ = 2·2·2·2·2·2·2·2·2·2 = 1024. Doubling ten times." },
          { q: "A model doubles in size every year. After 3 years starting at 1M parameters it has…", choices: ["3M", "6M", "8M", "12M"], answer: 2, explain: "2³ = 8, so 8M. That's exponential — linear thinking would guess 3M." },
        ],
      },
      {
        id: "u0-4", title: "Logarithms — the undo button for exponents",
        sections: [
          { type: "intuition", html: `A logarithm asks: <b>"2 raised to WHAT gives me this number?"</b> Since 2¹⁰ = 1024, we say <span class="formula">log₂(1024) = 10</span>. Logs shrink huge ranges into small, comfortable ones:`, demo: "logscale" },
          { type: "notation", html: `<code>log₂(8) = 3</code> because 2³ = 8. <code>log₁₀(1000) = 3</code> because 10³ = 1000. logs also turn multiplication into addition: <code>log(a·b) = log(a) + log(b)</code>.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> the standard loss function of classification (<b>cross-entropy</b>, Unit 4) is a logarithm of a probability. If a paper says "loss = 0.23", a log is hiding inside. Also: pH of blood, deciBels, CT Hounsfield units — logs all the way down.` },
        ],
        quiz: [
          { q: "log₂(64) = ?", choices: ["6", "8", "32", "16"], answer: 0, explain: "2⁶ = 64, so log₂(64) = 6." },
          { q: "Why do loss functions use logarithms?", choices: ["To make numbers bigger", "To turn tiny probabilities into informative penalties", "Because it looks scientific", "To avoid division"], answer: 1, explain: "A confident wrong prediction gets a HUGE log penalty; a nearly-correct one gets near zero. Logs make confidence mistakes expensive." },
        ],
      },
      {
        id: "u0-5", title: "Sigma (Σ) & weighted sums",
        sections: [
          { type: "intuition", html: `<b>Σ</b> (sigma) means "add these up". <span class="formula">Σ xᵢ = x₁ + x₂ + … + xₙ</span>. A <b>weighted sum</b> gives each number its own importance: <span class="formula">w₁x₁ + w₂x₂</span> — like a final grade: 60% exams + 40% homework.` },
          { type: "example", html: `Weighted sum of lab values, weights = importance:<br><code>0.5×BP(120) + 0.3×Sugar(90) + 0.2×BMI(25)</code><br>= 60 + 27 + 5 = <b>92</b>. The weights decide what matters most.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> <b>every neuron in every neural network computes exactly this</b>: a weighted sum of its inputs, plus an offset. When you finally see <code>Σ wᵢxᵢ + b</code> in Unit 1, you're looking at the atom of AI.` },
        ],
        quiz: [
          { q: "Σ over [2, 3, 4] equals…", choices: ["7", "9", "24", "12"], answer: 1, explain: "Just add: 2+3+4 = 9." },
          { q: "Weighted sum: 0.2×10 + 0.8×5 = ?", choices: ["5", "6", "7.5", "15"], answer: 1, explain: "2 + 4 = 6. The big weight (0.8) pulls the answer toward 5." },
        ],
      },
    ],
  },
  {
    id: "u1", phase: 1, emoji: "🧮", title: "Linear Algebra",
    sub: "Vectors, matrices, dot products — the language of data",
    lessons: [
      {
        id: "u1-1", title: "Vectors — lists with meaning",
        sections: [
          { type: "intuition", html: `A <b>vector</b> is just an ordered list of numbers: <span class="formula">[72, 120, 90, 26]</span>. If the labels are [heart rate, BP, BMI, age], that vector <em>is</em> a patient. Same shape of data, no magic.` },
          { type: "notation", html: `Vector addition is element-by-element: <code>[1,2] + [3,1] = [4,3]</code>. Scaling multiplies every entry: <code>2·[3,1] = [6,2]</code>. Two common notations: column (stacked) or row (side-by-side).` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> models never see "patients" — they see <b>feature vectors</b>. "Similar patients" = vectors pointing in similar directions. That's Unit 1's superpower: geometry for medicine.` },
        ],
        quiz: [
          { q: "[2, 5] + [1, 3] = ?", choices: ["[3, 8]", "[2, 15]", "[3, 15]", "[2, 8]"], answer: 0, explain: "Add element-wise: 2+1=3, 5+3=8 → [3, 8]." },
          { q: "In ML terms, one patient's lab panel is usually stored as…", choices: ["A sentence", "A vector", "A folder", "An image only"], answer: 1, explain: "One row of numbers = one feature vector. A whole dataset is a stack of these (a matrix — next lesson!)." },
        ],
      },
      {
        id: "u1-2", title: "Dot product — the match score",
        sections: [
          { type: "intuition", html: `The <b>dot product</b> multiplies matching features and adds them up — a <b>match score</b> between two vectors. Big positive = " these agree", ~0 = "unrelated", negative = "opposed". Try it:`, demo: "dotproduct" },
          { type: "notation", html: `<span class="formula">a · b = a₁b₁ + a₂b₂ + … + aₙbₙ</span><br>Example: <code>[1,2,3] · [4,5,6] = 4 + 10 + 18 = 32</code>. Same length vectors required.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a naive risk score IS a dot product (weights · patient values). Inside neural networks, "is this image patch a tumor?" is answered by dot products between patch features and learned patterns. You just learned the most-computed operation in AI.` },
        ],
        quiz: [
          { q: "[1, 2, 3] · [4, 5, 6] = ?", choices: ["21", "26", "32", "6"], answer: 2, explain: "(1·4) + (2·5) + (3·6) = 4 + 10 + 18 = 32." },
          { q: "Weights [0.5, -0.5] on a patient vector [2, 3] give a score of…", choices: ["-0.5", "0.5", "2.5", "-2.5"], answer: 0, explain: "0.5·2 + (−0.5)·3 = 1 − 1.5 = −0.5. The negative weight penalizes high feature 2." },
        ],
      },
      {
        id: "u1-3", title: "Matrices — grids of numbers",
        sections: [
          { type: "intuition", html: `A <b>matrix</b> is a rectangular grid of numbers. One hundred patients × 8 features = a 100×8 matrix. A grayscale image = a matrix of pixel brightnesses. A neural network layer = a matrix of weights. <b>Matrices are how ML stores literally everything.</b>` },
          { type: "notation", html: `Size is written <b>rows × columns</b>. A 2×3 matrix has 2 rows, 3 columns. <b>Matrix × vector</b>: each output = a dot product of a matrix row with the vector:<br><code>[2 1]   [3]   [2·3 + 1·1]   [7]<br>[0 4] · [1] = [0·3 + 4·1] = [4]</code>` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "The model processes a batch of 32 scans" = a 32×H×W matrix flows through weight matrices. Data shapes must line up or the code crashes — now you can read shape errors like a pro.` },
        ],
        quiz: [
          { q: "A matrix of shape (2×3) times a vector… requires the vector to be shape…", choices: ["(2)", "(3)", "(6)", "any"], answer: 1, explain: "Inner dimensions must match: (2×3)·(3) ✓ → result (2). This is THE rule to memorize." },
          { q: "Row [0, 4] dotted with vector [3, 1] gives…", choices: ["4", "3", "12", "7"], answer: 0, explain: "0·3 + 4·1 = 4." },
        ],
      },
      {
        id: "u1-4", title: "Matrix multiplication",
        sections: [
          { type: "intuition", html: `Matrix × matrix = "run a bunch of dot products at once". Row of the first meets column of the second → each result cell. Play with it (click a result cell to see its row·col breakdown):`, demo: "matrixmul" },
          { type: "notation", html: `<span class="formula">(m×n) · (n×p) → (m×p)</span> — inner dimensions must match. <b>Warning:</b> A·B ≠ B·A in general (unlike regular numbers).<br><code>[1 2]   [0 1]   [2 1]<br>[3 4] · [1 0] = [4 3]</code>` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> GPU speed comes from doing millions of these dot products in parallel — that's why training a model on 50,000 X-rays takes hours, not decades. Every paper's "we used an A100 GPU" means matrix multiplication on steroids.` },
        ],
        quiz: [
          { q: "(3×4) · (4×2) results in what shape?", choices: ["(4×4)", "(3×2)", "(2×3)", "error"], answer: 1, explain: "Inner 4s match ✓ → drop both, keep outer: (3×2)." },
          { q: "Computing one cell of a matrix product is a…", choices: ["Single number swap", "Dot product of a row and a column", "Division", "Gradient"], answer: 1, explain: "Row of A · column of B = that cell. Matrix multiply is just dot products, packaged." },
        ],
      },
      {
        id: "u1-5", title: "Data & images as matrices",
        sections: [
          { type: "intuition", html: `An image is a matrix where each entry is a <b>brightness</b> (0 = black, 255 = white). Increase a number → brighter pixel. Flip all numbers → a negative image. Try editing this 8×8 scan:`, demo: "pixelmatrix" },
          { type: "notation", html: `A real medical image is bigger: a chest X-ray ≈ 1024×1024 = <b>over a million numbers</b>. Color adds 3 channels (RGB). "The tensor shape is 32×1024×1024×3" now means: 32 images, each 1024×1024, in color.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> when a paper says "we augment with intensity shifts", it means <em>adding numbers to the matrix</em>. Image preprocessing = matrix arithmetic. Demystified: AI looks at lungs through grids of numbers — like this demo.` },
        ],
        quiz: [
          { q: "In a grayscale image matrix, a pixel value of 0 usually means…", choices: ["White", "Black", "Error", "Blur"], answer: 1, explain: "0 = no brightness = black; 255 = full brightness = white." },
          { q: "A 1024×1024 grayscale image contains how many numbers?", choices: ["1024", "2048", "~1 million", "~10 billion"], answer: 2, explain: "1024 × 1024 = 1,048,576 ≈ 1M numbers (pixels)." },
        ],
      },
      {
        id: "u1-6", title: "A neural network in matrix language",
        sections: [
          { type: "intuition", html: `Time to assemble everything. A neuron: <span class="formula">weighted sum + bias</span>, then a <b>sigmoid</b> squashes it between 0 and 1 (a smooth yes/no dial: σ(z) = 1/(1+e⁻ᶻ)). A layer of neurons = a <b>matrix</b> of weights. Drive this tiny 2→2→1 network yourself:`, demo: "forwardpass" },
          { type: "notation", html: `One layer in one line: <span class="formula">h = σ(W·x + b)</span><br>W = weight matrix, x = input vector, b = bias vector, σ = sigmoid applied element-wise. Stack layers: <code>h1 = σ(W₁x + b₁)</code>, <code>y = σ(W₂h1 + b₂)</code>. That IS "forward propagation".` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "The network takes a patient vector and outputs P(disease)" is no longer jargon — it's <code>σ(W₂·σ(W₁·x + b₁) + b₂)</code>. One formula. You can now read the first three equations of most neural network papers. 🎉` },
        ],
        quiz: [
          { q: "σ(1.0) ≈ 0.73. A neuron computes z = 1 and applies sigmoid. Output ≈ ?", choices: ["0.5", "0.73", "1.0", "2.7"], answer: 1, explain: "The sigmoid squashes 1.0 to ~0.73 — leaning toward 'yes' but not certain." },
          { q: "In h = σ(W·x + b), what is b?", choices: ["The batch size", "A bias/offset added before squashing", "A bug", "The blood value"], answer: 1, explain: "The bias shifts the neuron's threshold — how easily it fires, even when all inputs are zero." },
          { q: "Stacking two layers means the second layer's input is…", choices: ["The raw data again", "The first layer's output", "Zero", "The labels"], answer: 1, explain: "Each layer transforms the previous layer's output. That chaining is the 'deep' in deep learning." },
        ],
      },
    ],
  },
  {
    id: "u2", phase: 1, emoji: "📐", title: "Calculus & Optimization",
    sub: "Derivatives, chain rule, gradient descent — the training engine",
    lessons: [
      {
        id: "u2-1", title: "The derivative — a slope detector",
        sections: [
          { type: "intuition", html: `A line's slope was easy: rise ÷ run. But curves bend — their steepness <b>changes from point to point</b>. The <b>derivative</b> answers: "if I freeze at this exact point, what's the slope right here?" Move the point and watch the tangent line spin:`, demo: "derivvis" },
          { type: "notation", html: `We write it <span class="formula">f′(x)</span> ("f-prime") or <b>dy/dx</b>. Example: for <code>f(x) = x²</code>, the derivative is <code>f′(x) = 2x</code>. At x = 2 slope is 4 (rising fast); at x = 0 slope is 0 (bottom of the valley, flat!)` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a training model sees a <b>loss curve</b> (error vs. weights). The derivative tells it which direction is downhill. Every step of learning is: <em>measure slope → step downhill → repeat.</em>` },
        ],
        quiz: [
          { q: "For f(x) = x², what is f′(x)?", choices: ["x", "2x", "2", "x²/3"], answer: 1, explain: "Power rule: bring the exponent down and reduce it: 2·x¹ = 2x." },
          { q: "For f(x) = x², the slope at x = 3 is…", choices: ["3", "6", "9", "0"], answer: 1, explain: "f′(3) = 2·3 = 6. The curve is climbing steeply there." },
          { q: "If the derivative equals 0 at some point, the curve there is…", choices: ["Vertical", "Momentarily flat", "Undefined", "Exploding"], answer: 1, explain: "Slope 0 = tangent is horizontal. That's exactly how we FIND valley bottoms (minimums) — next lesson!" },
        ],
      },
      {
        id: "u2-2", title: "Derivative rules — the toolkit",
        sections: [
          { type: "intuition", html: `Nobody recomputes slopes from scratch — mathematicians distilled everything into a few <b>rules</b>. They're mechanical, like grammar: once you know them you can differentiate any formula in a paper on sight.` },
          { type: "notation", html: `<b>Power rule:</b> <span class="formula">d/dx xⁿ = n·xⁿ⁻¹</span> (multiply by exponent, drop exponent by 1)<br><b>Sum rule:</b> derivative of a sum = sum of derivatives: <code>(f + g)′ = f′ + g′</code><br><b>Constant:</b> <code>d/dx 9 = 0</code> — flat line never tilts.<br><br>Worked example: <code>d/dx (3x² + 2x + 7)</code> = <b>6x + 2</b> (+0 for the constant).` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> paper formulas like "L = Σ(yᵢ − ŷᵢ)²" look scary — but taken term by term they're just power + sum rules. after this lesson, notation stops being a wall.` },
        ],
        quiz: [
          { q: "d/dx (5x³) = ?", choices: ["15x²", "5x²", "15x³", "3x²"], answer: 0, explain: "Power rule: 5·3·x² = 15x²." },
          { q: "d/dx (2x + 9) = ?", choices: ["11", "2", "2x", "0"], answer: 1, explain: "Slope of 2x is 2; the constant 9 contributes nothing (flat)." },
          { q: "d/dx (x⁴) at x = 1 = ?", choices: ["1", "4", "16", "0.25"], answer: 1, explain: "f′(x) = 4x³, so f′(1) = 4." },
        ],
      },
      {
        id: "u2-3", title: "The chain rule — why backpropagation works",
        sections: [
          { type: "intuition", html: `What if functions are <b>nested machines</b>? x goes into machine g, its output goes into machine f. The total sensitivity = <b>multiply the sensitivities of each stage</b> — like multiplying gear ratios in a bicycle drivetrain. Spin the pedal slow → wheel spins slow·fast.` },
          { type: "notation", html: `<span class="formula">d/dx f(g(x)) = f′(g(x)) · g′(x)</span><br>Worked example: differentiate <code>(3x + 1)²</code>:<br>Outer: <code>u² → 2u</code>. Inner: <code>3x+1 → 3</code>. Answer: <code>2(3x+1)·3 = 6(3x+1)</code>.<br>Rule of thumb: <b>derivative of outside × derivative of inside</b>.` },
          { type: "insight", html: `🧠 <b>The big reveal:</b> a neural network IS nested functions — layer inside layer. To know how the loss changes with a weight deep inside layer 1, you must chain sensitivities backward through every layer. That chain-rule sweep is called <b>backpropagation</b>. It was understood by 1986 — it powers everything from ECG classifiers to GPT.` },
        ],
        quiz: [
          { q: "d/dx (2x + 3)³ = ?", choices: ["3(2x+3)²", "6(2x+3)²", "2(2x+3)²", "6(2x+3)"], answer: 1, explain: "Chain rule: 3(2x+3)² from the outside × 2 from the inside = 6(2x+3)²." },
          { q: "Backpropagation is essentially…", choices: ["A database", "The chain rule applied layer-by-layer", "A blood test", "Matrix inversion"], answer: 1, explain: "It's an efficient application of the chain rule that computes sensitivities for millions of parameters at once." },
          { q: "To find sensitivity to a weight in layer 1 of a 5-layer net, the chain rule must run through…", choices: ["Only layer 1", "All 5 layers", "The data", "The optimizer"], answer: 1, explain: "Every stage contributes a link in the chain — that's why it's called an error being 'propagated' back." },
        ],
      },
      {
        id: "u2-4", title: "Gradient descent & the learning rate",
        sections: [
          { type: "intuition", html: `<b>Loss</b> = a single number scoring how wrong the model is. Imagine the loss as a <b>valley</b> and the model's weight as a ball. We want the ball at the valley bottom. The derivative tells us the slope; we step the ball <b>opposite</b> to it. Try it — and especially try a big learning rate 💥:`, demo: "gdplay" },
          { type: "notation", html: `One training step: <span class="formula">w ← w − α · ∂L/∂w</span><br>• ∂L/∂w = slope of loss with respect to this weight (the chain rule computes it)<br>• α (alpha) = <b>learning rate</b> — step size<br>• When there are millions of weights, the set of all slopes is the <b>gradient</b> — hence the name.` },
          { type: "insight", html: `🩺 <b>Decoding paper language:</b> "trained with Adam, learning rate 3×10⁻⁴" now fully parses: Adam = a smarter step-sizing variant of this rule, and the rate was chosen because (you saw it!) big rates diverge, tiny rates crawl. The playground you just played IS what happens 500,000 times when a model trains on 50,000 chest X-rays.` },
        ],
        quiz: [
          { q: "If ∂L/∂w = +5 (loss rises as w grows), gradient descent should…", choices: ["Increase w", "Decrease w", "Keep w", "Delete w"], answer: 1, explain: "Step OPPOSITE the slope: w ← w − α·5 shrinks w and reduces loss." },
          { q: "A learning rate that's too HIGH causes…", choices: ["Faster, stable learning", "Loss to overshoot and explode", "Better accuracy", "Nothing"], answer: 1, explain: "You saw it: each step overshoots the valley bottom, bouncing worse each time until it diverges." },
          { q: "In a paper, 'lr = 3e-4' means the learning rate is…", choices: ["3 to the power of 4", "0.0003", "3.4", "30,000"], answer: 1, explain: "Science notation: 3×10⁻⁴ = 0.0003. Small but not tiny — a classic sweet spot." },
        ],
      },
      {
        id: "u2-5", title: "Reading training curves in papers",
        sections: [
          { type: "intuition", html: "Figure 3 of every deep-learning paper is a <b>loss curve</b>: loss vs. training time. Now you can diagnose one at a glance — and know the vocabulary of the training loop." },
          { type: "notation", html: `• <b>Epoch</b> = one complete pass over the training data<br>• <b>Batch</b> = small chunk (e.g. 32 patients) — weights update after each batch<br>• <b>Converged</b> = the curve flattens; more training barely helps<br>• <b>Spikes</b> = loss suddenly jumps → learning rate too high or bad data<br>• <b>Overfitting</b> = training loss keeps falling while validation loss RISES (Unit 4!)` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> flattening early = the model stopped learning (maybe missed subtle cases); spikes = unstable hospital data pipeline; the train/validation gap tells you if the model memorized instead of learned. Curves are the ECG of training — you've just learned to read them.` },
        ],
        quiz: [
          { q: "One epoch means…", choices: ["One weight update", "One full pass over all training data", "One patient", "One GPU hour"], answer: 1, explain: "Each epoch sweeps through every training example once (in batches)." },
          { q: "The training loss suddenly jumps upward several times during training. Most likely cause?", choices: ["Model is perfect", "Learning rate too high or data glitch", "Too few epochs", "Too many patients"], answer: 1, explain: "Big steps overshooting or a bad batch both launch the ball out of the valley — exactly your playground explosion." },
          { q: "Training loss ↓ but validation loss ↑ means the model is…", choices: ["Converging", "Overfitting — memorizing instead of learning", "Exploding", "Undertrained"], answer: 1, explain: "It's getting better at seen data and worse at unseen data — the classic overfitting X-shape you'll meet again in Unit 4." },
        ],
      },
      {
        id: "u2-m", title: "📄 Paper mission — the noisy training curve",
        sections: [
          { type: "example", html: `📄 <em>Abstract, "GlucoPredict"</em>: "We trained a diabetes-risk model for 40 epochs. Training loss fell from 2.1 to 0.05. Validation loss reached its minimum 0.61 at epoch 12, then climbed steadily to 2.8 by epoch 40. We report the epoch-40 model, which achieved training loss 0.05."` },
          { type: "notation", html: `Diagnose with Unit 2:<br>1. Validation loss bottomed at <b>epoch 12</b> — the model stopped generalizing there.<br>2. After epoch 12 it <b>overfit</b>: training ↓, validation ↑ (the X-shape).<br>3. Reporting the epoch-40 model is reporting the <b>memorized</b> one.<br>4. Better: early stopping at ~epoch 12, or regularization / lower learning rate.` },
          { type: "insight", html: `🩺 You just read a loss curve like a training engineer. Onward to Unit 3's probability toolbox — where the base-rate bombshell waits.` },
        ],
        quiz: [
          { q: "The validation curve's minimum at epoch 12 tells you the best-generalizing model is…", choices: ["The epoch-40 one", "The epoch-12 one (use early stopping)", "Epoch 1", "Undefined"], answer: 1, explain: "Validation loss tracks generalization; its minimum marks the sweet spot before overfitting takes over." },
          { q: "Reporting the epoch-40 model is a problem because…", choices: ["40 is unlucky", "It generalizes worse than the epoch-12 model — training loss is misleading", "It's too fast", "Nothing wrong"], answer: 1, explain: "Training loss 0.05 looks great but it reflects memorization; validation performance is what matters." },
          { q: "Which fix does NOT address this curve's problem?", choices: ["Early stopping", "Regularization", "Adding more epochs to train longer", "Lower learning rate"], answer: 2, explain: "More epochs worsens overfitting here; the others constrain or stabilize learning." },
        ],
      },
    ],
  },
  {
    id: "u3", phase: 1, emoji: "🎲", title: "Probability & Bayes",
    sub: "Uncertainty, conditional reasoning, and the base-rate trap",
    lessons: [
      {
        id: "u3-1", title: "Probability — the language of uncertainty",
        sections: [
          { type: "intuition", html: `Medicine has no certainties: same virus, different outcomes. <b>Probability</b> is the number language for that uncertainty — always between <b>0</b> (impossible) and <b>1</b> (certain). 0.5 = coin flip; 0.02 = 2% chance; 0.98 = "almost surely".` },
          { type: "notation", html: `• <b>Complement:</b> if P(side effect) = 0.02, then P(no side effect) = <span class="formula">1 − 0.02 = 0.98</span><br>• <b>Disjoint events add:</b> P(blood type A or B) = P(A) + P(B) (can't be both)<br>• <b>All outcomes sum to 1</b> — a "probability distribution" is just a list of these numbers.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> when a model outputs "0.87" for a patient, that's a probability, not a verdict. Papers report probabilities constantly; a whole field (Bayesian models) is built on treating even the disease itself as uncertain-until-observed.` },
        ],
        quiz: [
          { q: "P(rare side effect) = 0.02. P(no side effect) = ?", choices: ["0.02", "0.2", "0.98", "2"], answer: 2, explain: "Complement rule: 1 − 0.02 = 0.98." },
          { q: "Which is a valid probability value?", choices: ["1.5", "−0.1", "0.7", "27"], answer: 2, explain: "Probabilities must lie between 0 and 1." },
          { q: "All possible outcomes of one experiment have probabilities that…", choices: ["Are all equal", "Sum to 1", "Sum to 0", "Are all 0.5"], answer: 1, explain: "Something must happen — total certainty spread across outcomes sums to exactly 1." },
        ],
      },
      {
        id: "u3-2", title: "Conditional probability — reasoning with evidence",
        sections: [
          { type: "intuition", html: `New evidence changes everything. <b>P(sick | symptom)</b> means: "among people WITH the symptom, how many are sick?" You're zooming into a smaller pool and re-asking the question. Evidence doesn't change the sick — it changes <em>which crowd you're looking at</em>.` },
          { type: "example", html: `100 patients. 40 have the symptom. Of those 40, only 10 are actually sick.<br>Then:<br>• P(sick) = 10/100 = 0.10 (before evidence)<br>• <b>P(sick | symptom) = 10/40 = 0.25</b> (after evidence — the symptom tripled suspicion!)` },
          { type: "notation", html: `<span class="formula">P(A | B) = P(A and B) / P(B)</span><br>Two events are <b>independent</b> when evidence says nothing: P(A|B) = P(A).<br><b>Warning:</b> P(sick | test+) ≠ P(test+ | sick) in general! Reversing the condition changes the crowd.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> that reversal trap is the engine of Unit 3's grand finale (Bayes). Every diagnostic claim in every paper is a conditional probability — and misreading which-way-round the condition goes is the #1 rookie error.` },
        ],
        quiz: [
          { q: "100 patients, 20 have fever, 5 of them have the disease. P(disease | fever) = ?", choices: ["0.05", "0.20", "0.25", "0.80"], answer: 2, explain: "5 out of the 20 feverish patients = 5/20 = 0.25." },
          { q: "If P(A|B) = P(A), then A and B are…", choices: ["Identical", "Independent", "Expired", "Negatively correlated"], answer: 1, explain: "B provides zero information about A — the textbook definition of independence." },
          { q: "P(rain tomorrow) = 0.3 and P(rain tomorrow | dark clouds today) = 0.7. Therefore P(rain | dark clouds) vs P(rain) shows evidence…", choices: ["Was ignored", "Raised the probability", "Lowered it", "Is irrelevant"], answer: 1, explain: "0.7 > 0.3: the evidence (dark clouds) raised our belief — that's conditional reasoning carrying information." },
        ],
      },
      {
        id: "u3-3", title: "Distributions — the shape of a population",
        sections: [
          { type: "intuition", html: `Blood pressure, height, lab values: measure many people and the numbers form a <b>distribution</b> — most cluster in the middle, extremes are rare. The most famous shape: the <b>normal</b> (bell) curve. Squeeze the spread slider — that's what "the population is more variable" looks like:`, demo: "normaldemo" },
          { type: "notation", html: `• <b>Mean μ</b> = average (where the peak sits)<br>• <b>Standard deviation σ</b> = Typical distance from the mean (spread)<br>• Papers report: "SBP = 120 ± 10 mmHg" — that's μ ± σ!<br>• <b>The 68–95 rule:</b> 68% of people within 1σ, 95% within 2σ. A value 3σ out is a genuine outlier (0.3% chance).` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "is 145 high?" depends on the distribution — it's 2.5σ above a healthy mean (rare!) if σ=10, unremarkable if σ=20. And in ML: before training, features are <b>standardized</b> to μ=0, σ=1 so no feature dominates just because of its units. Vitals → z-scores → fair model input.` },
        ],
        quiz: [
          { q: "About 95% of a normal distribution lies within…", choices: ["±1σ", "±2σ", "±3σ", "±10σ"], answer: 1, explain: "The 68–95 rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ." },
          { q: "A larger σ means the distribution is…", choices: ["Taller and narrower", "Wider and flatter", "Shifted right", "Zero"], answer: 1, explain: "σ is the spread — bigger spread = more people far from the mean = wider bell." },
          { q: "If μ = 10 and σ = 5, a value of 20 is how many standard deviations above the mean (its z-score)?", choices: ["1", "2", "5", "10"], answer: 1, explain: "(20 − 10)/5 = 2. It's at the 97.7th percentile — rare for one sample." },
        ],
      },
      {
        id: "u3-4", title: "Bayes' theorem — updating beliefs with evidence",
        sections: [
          { type: "intuition", html: `You already reason like Bayes: a positive test on a 1%-prevalence disease <em>raises</em> suspicion — but surely not to 100%? Bayes' theorem is the exact machinery for that update. It <b>flips</b> the test fact ("sick people usually test positive") into what you actually want ("positive-test people — how likely sick?"). The bridge is the base rate`, demo: "testlab" },
          { type: "notation", html: `<span class="formula">P(sick | test+) = P(test+ | sick) · P(sick) / P(test+)</span><br>Naming the pieces:<br>• <b>Prior</b> P(sick) — suspicion before the test (≈ prevalence)<br>• <b>Likelihood</b> P(test+ | sick) — the sensitivity<br>• <b>Evidence</b> P(test+) — overall positivity rate<br>• <b>Posterior</b> — the updated suspicion` },
          { type: "example", html: `Worked by hand, 10,000 people, prevalence 1%, sensitivity 95%, specificity 90%:<br>• Sick: 100 → <b>true positives 95</b>, 5 missed<br>• Healthy: 9,900 → <b>false positives 990</b>, 8,910 clean<br>• Positive tests: 95 + 990 = 1,085<br>• P(sick | test+) = 95/1,085 ≈ <b>8.8%!!</b> A "95%-accurate" test leaves 9 of 10 positives healthy. 💡` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> this single computation is why screening programs are designed so carefully, why follow-up confirmatory tests exist, and why every medical AI paper reports <b>PPV per prevalence setting</b>, not just accuracy. Congratulations — you can now compute the most misquoted number in medicine.` },
        ],
        quiz: [
          { q: "In Bayes' formula, the 'prior' is…", choices: ["The test result", "P(sick) before seeing evidence", "The final updated belief", "The sensitivity"], answer: 1, explain: "Prior = your belief before the evidence; posterior = after the update." },
          { q: "Prevalence 1%, sensitivity 95%, specificity 90%. A positive patient is truly sick with probability ≈", choices: ["95%", "50%", "8.8%", "99%"], answer: 2, explain: "95 true positives vs 990 false positives → 95/1085 ≈ 8.8%. The base rate dominates." },
          { q: "To make the posterior higher WITHOUT changing prevalence, you'd want a higher…", choices: ["Specificity (fewer false positives)", "Epoch count", "Learning rate", "Sample size"], answer: 0, explain: "False positives dilute the positive pool — killing them (higher specificity) purifies PPV." },
        ],
      },
      {
        id: "u3-5", title: "The accuracy paradox — read any screening claim",
        sections: [
          { type: "intuition", html: `Somebody hands you: "Our AI diagnoses disease X with <b>98% accuracy!</b>" If X affects only 1% of people, the dumbest possible model — <b>"everyone is healthy"</b> — scores <b>99% accuracy</b> while catching zero patients. Accuracy hides the truth; the base rate decides. Run the Diagnostic Test Lab again, sweep prevalence tiny→big, and watch PPV crumble:`, demo: "testlab" },
          { type: "notation", html: `In words:<br>• <b>Accuracy</b> = (correct / all) — dominated by the majority class<br>• <b>PPV</b> = TP/(TP+FP) — what a positive MEANS, depends on prevalence<br>• <b>Specificity</b> protects PPV: each FP <em>poisons</em> the positive pool<br>• Screening (prevalence ~0.5%) vs hospital triage (~30%): <b>same model, same output, wildly different meaning</b>.` },
          { type: "insight", html: `🩺 <b>Your first paper-reading superpower:</b> next time you see "89% accuracy, deployable today!", you'll ask — prevalence? sensitivity? PPV at screening prevalence? If the paper doesn't say, that's a red flag the size of a CT scanner. This chapter of reasoning is literally the difference between hype and clinical value.` },
        ],
        quiz: [
          { q: "Disease prevalence 0.1%. A 'predict everyone healthy' model achieves accuracy…", choices: ["0.1%", "≈99.9% — while finding zero patients", "50%", "Impossible to know"], answer: 1, explain: "99.9% are healthy, so predicting all-healthy is right 99.9% of the time — and medically useless. Accuracy ≠ value." },
          { q: "Same test, same day: used for population screening (0.5% prevalence) vs hospital patients (30% prevalence). PPV will be…", choices: ["Equal — same test!", "Astronomically higher in the hospital group", "Lower in hospital", "Zero in both"], answer: 1, explain: "The positive pool keeps its false positives but gains true positives → PPV grows with prevalence. Same test, different meaning." },
          { q: "The single most useful number to demand from a screening-tool paper is…", choices: ["Accuracy", "PPV at deployment prevalence (= sensitivity + specificity + prevalence together)", "Number of GPUs", "Training loss"], answer: 1, explain: "PPV is the posterior you just computed — it integrates all three ingredients and answers the only question that matters: what does POSITIVE mean?" },
        ],
      },
      {
        id: "u3-m", title: "📄 Paper mission — the 1%-prevalence screening AI",
        sections: [
          { type: "example", html: `📄 <em>Abstract, "RareFind"</em>: "Our AI screens for rare disease X (prevalence 1%) with sensitivity 98% and specificity 92%. Conclusion: 'a positive result means the patient almost certainly has the disease.'"` },
          { type: "example", html: `Run the counts on 10,000 people:<br>• Sick: 100 → true positives 100 × 0.98 = <b>98</b><br>• Healthy: 9,900 → false positives 9,900 × 0.08 = <b>792</b><br>• Positive tests: 98 + 792 = 890<br>• <b>PPV = 98/890 ≈ 11%</b> — nine of ten positives are false alarms! Sensitivity and specificity were good, but prevalence owns the meaning.` },
          { type: "insight", html: `🩺 The fix isn't more sensitivity — it's fewer false positives (higher specificity) or a second confirmatory test. You just computed the most important correction to a screening claim you'll ever make. Base-rate superpower acquired.` },
        ],
        quiz: [
          { q: "PPV for this test at 1% prevalence ≈ ?", choices: ["11%", "50%", "92%", "98%"], answer: 0, explain: "98 true positives vs 792 false positives → 98/890 ≈ 11%. The base rate crushed the positive's meaning." },
          { q: "The abstract's conclusion ('almost certainly has it') is…", choices: ["Correct", "Dangerously wrong — a positive means ~11%", "Roughly right", "Unprovable"], answer: 1, explain: "Misreading PPV as sensitivity is exactly the base-rate fallacy this unit exists to kill." },
          { q: "To raise PPV at 1% prevalence without losing sensitivity, improve…", choices: ["Specificity (fewer healthy flagged)", "The font", "The GPU", "The number of features"], answer: 0, explain: "False positives from the huge healthy group flood the positive pool; cutting them (higher specificity) purifies PPV." },
        ],
      },
    ],
  },
  {
    id: "u4", phase: 1, emoji: "🤖", title: "Machine Learning Core",
    sub: "Loss functions, overfitting, leakage — how training really works",
    lessons: [
      {
        id: "u4-1", title: "Training vs testing — the golden rule",
        sections: [
          { type: "intuition", html: `A student who memorizes past exam answers looks brilliant on those exact questions and fails the real exam. Models are identical: their skill is only meaningful on <b>patients they have never seen</b>. So we split data: <b>training set</b> to learn, <b>validation set</b> to tune, <b>test set</b> kept locked in a drawer until the very end.` },
          { type: "notation", html: `Typical split: <code>80% train / 10% validation / 10% test</code>.<br>• <b>Train</b> — model sees features and labels; gradient descent minimizes loss<br>• <b>Validation</b> — used to choose hyperparameters (learning rate, model size)<br>• <b>Test / held-out / external</b> — touched once; if you keep tuning on it, it stops being a test.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a model that reports 99% on data from the same hospital that trained it may be learning that hospital's scanner quirks. Papers that matter report performance on <b>external sites</b>. "External validation" is now a phrase you read instantly.` },
        ],
        quiz: [
          { q: "Why must the test set stay untouched during development?", choices: ["It's expensive", "Otherwise you tune to it and its score becomes meaningless", "It has no labels", "Regulations require it"], answer: 1, explain: "Tuning on the test set leaks information — you've effectively trained on it, so its score no longer estimates real-world performance." },
          { q: "A model scores 0.94 on training data and 0.71 on held-out patients. The honest estimate of its ability is…", choices: ["0.94", "0.71", "0.83 (average)", "Unknown"], answer: 1, explain: "Held-out performance is the only honest estimate. The 0.94 gap is the smell of overfitting (next lessons)." },
          { q: "Best evidence a medical AI works across hospitals is…", choices: ["High train accuracy", "External validation on data from other sites", "Many parameters", "A GPU cluster"], answer: 1, explain: "Generalization to unseen sites is the real test — that's what external validation measures." },
        ],
      },
      {
        id: "u4-2", title: "Loss functions — how wrong is wrong?",
        sections: [
          { type: "intuition", html: `Training needs a <b>single number</b> that says "how bad is the model right now?" — otherwise there's nothing to improve. For predicting a value, the classic is <b>MSE</b>: average squared error. Drag the sliders and watch the number you must minimize:`, demo: "lossdemo" },
          { type: "notation", html: `<span class="formula">MSE = (1/n) · Σ (yᵢ − ŷᵢ)²</span><br>yᵢ = true value, ŷᵢ = prediction. Squaring means a miss twice as big costs <b>four times</b> more — the model hates big misses. Training = find weights making this number smallest (Unit 2's gradient descent, applied for real).` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "loss" is the number in every training curve. Choosing the loss IS choosing what the model cares about — MSE treats all misses equally, but in medicine missing a cancer by an inch and by a mile are not the same. papers pick losses deliberately; now you know why.` },
        ],
        quiz: [
          { q: "MSE of predictions [2, 4] vs truths [3, 3] = ?", choices: ["1", "0.5", "2", "5"], answer: 0, explain: "Errors: (2−3)²=1 and (4−3)²=1 → mean (1+1)/2 = 1." },
          { q: "Why square the errors instead of just summing them?", choices: ["Squares look nicer", "To punish large errors more and stop negatives cancelling", "To make numbers bigger", "No reason"], answer: 1, explain: "Without squaring, −5 and +5 errors cancel to zero. Squaring makes every error positive and makes big misses disproportionately costly." },
          { q: "Training a model means…", choices: ["Filling a database", "Choosing weights that minimize the loss", "Increasing the learning rate", "Writing more code"], answer: 1, explain: "That's it — minimize loss over the training data using gradients (Unit 2)." },
        ],
      },
      {
        id: "u4-3", title: "Sigmoid & cross-entropy — probability outputs",
        sections: [
          { type: "intuition", html: `A classifier's raw score z (any number) is squashed by the <b>sigmoid</b> into a probability between 0 and 1. Then we score the answer with <b>cross-entropy</b> — which uses a logarithm to make <b>confident-and-wrong</b> catastrophic. Slide z and watch both penalties:`, demo: "sigdemo" },
          { type: "notation", html: `sigmoid: <span class="formula">σ(z) = 1 / (1 + e⁻ᶻ)</span><br>cross-entropy for one patient: <span class="formula">loss = −log(pᵢ)</span>, where pᵢ is the probability assigned to the TRUE class.<br>Hand-check: truth = sick, model says p = 0.9 → loss 0.105. Same truth, model says p = 0.1 → loss <b>2.30</b> — 22× worse for the same wrongness!` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "loss = 0.32" in a paper means average cross-entropy. More importantly: the model outputs a probability you can act on ("73% risk") — Unit 5 will show how to check whether those 73%s are trustworthy (calibration) and how to pick an action threshold.` },
        ],
        quiz: [
          { q: "σ(0) = ?", choices: ["0", "0.5", "1", "0.73"], answer: 1, explain: "1/(1+e⁰) = 1/(1+1) = 0.5 — the raw score of 0 is precisely the coin-flip point." },
          { q: "True label is 'sick'. Which model is penalized more: one saying p(sick)=0.95, or one saying 0.55?", choices: ["0.95 (more extreme)", "0.55", "Same", "Neither"], answer: 1, explain: "−log(0.55)=0.60 vs −log(0.95)=0.05. Confident-and-correct (0.95) is rewarded; hesitance (0.55) costs. Flip it and 0.05 costs ~3.0 — that's the design." },
          { q: "The raw score z = −3 through a sigmoid gives a probability of…", choices: ["~0.95", "~0.05", "−3", "0.5"], answer: 1, explain: "σ(−3) ≈ 0.047 — strongly leaning 'healthy/negative'. Negative z → probability below 0.5." },
        ],
      },
      {
        id: "u4-4", title: "Overfitting — memorizing is not learning",
        sections: [
          { type: "intuition", html: `Give a model enough flexibility and it stops finding the trend and starts <b>memorizing the noise</b> — including the scanner artifacts of training patients. Test it on new patients and it collapses. Turn the wiggle dial and watch train vs test error diverge:`, demo: "overfitdemo" },
          { type: "notation", html: `Three regimes as model capacity grows:<br>• <b>Underfit</b> (too stiff) — train AND test error high. It misses the pattern.<br>• <b>Sweet spot</b> — both low. It generalized.<br>• <b>Overfit</b> (too flexible) — train error → 0 while test error climbs.<br>The classic remedy is more data, but also: regularization, dropout, simpler models, augmentation.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a model might memorize "patients from scanner 3 tend to have labels X" instead of the disease itself. Overfit models often look <em>better</em> in the training hospital and fail quietly elsewhere. If a paper shows train ≈ test but both are high, that's underfitting — a different disease with a different cure.` },
        ],
        quiz: [
          { q: "Training error 0.001, test error 0.42. Diagnosis?", choices: ["Underfitting", "Overfitting", "Perfect model", "Bad data only"], answer: 1, explain: "It memorized training data and fails to generalize — textbook overfitting." },
          { q: "Training error 0.4, test error 0.45. Diagnosis?", choices: ["Underfitting — the model is too simple", "Overfitting", "Impossible", "Perfect"], answer: 0, explain: "Both high and close together = the model simply can't capture the pattern." },
          { q: "Which does NOT reduce overfitting?", choices: ["More training data", "Regularization", "A bigger, deeper model", "Simpler features"], answer: 2, explain: "More capacity usually worsens overfitting. The others add constraints or information." },
        ],
      },
      {
        id: "u4-5", title: "Leakage — the medical AI trap",
        sections: [
          { type: "intuition", html: `Leakage = information from the future/test sneaking into training. The famous medical flavor: a CT dataset has <b>many slices per patient</b>. If slices from the same patient land in both train and test, the model can learn <b>which patient</b> (from body shape) instead of the disease — and score 0.99 while being useless.` },
          { type: "notation", html: `Split by <b>patient</b>, never by image/slice/visit:<br>✓ Patient A → all slices only in train &nbsp; ✓ Patient B → all slices only in test<br>✗ Slices 1–7 of patient A train, slice 8 test (same person both sides!)<br>Other leaks: features unavailable at prediction time (e.g., "took antibiotic" recorded <em>after</em> the diagnosis), preprocessing fit on the whole dataset before splitting.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "we split by image" hidden in a methods section can inflate AUC by 0.1–0.2. When you read "patient-level split" or "grouped split", you now know exactly what it defends against. Naming leakage is one mark of a great reviewer.` },
        ],
        quiz: [
          { q: "A paper splits chest-CT slices randomly into train (80%) and test (20%). The problem is…", choices: ["80% is too much", "Slices from the same patient appear on both sides — the model may recognize patients, not disease", "CT images are too big", "Nothing"], answer: 1, explain: "Same patient on both sides lets the model memorize the individual — a classic medical leakage that inflates AUC." },
          { q: "A feature says 'patient started blood thinners'. This is leakage if it…", choices: ["Is numeric", "Was recorded after the diagnosis you're predicting", "Is rare", "None — features are features"], answer: 1, explain: "At prediction time that information wouldn't exist yet — the model gets a peek at the future." },
          { q: "The healthy way to separate a patient-rich dataset is splitting by…", choices: ["Random slice index", "Random row of the table", "Patient (all their data on one side)", "Alphabetical name"], answer: 2, explain: "Group/patient-level splits keep each individual entirely on one side of the wall." },
        ],
      },
      {
        id: "u4-6", title: "📄 Paper mission — the 0.99 AUC model",
        sections: [
          { type: "example", html: `📄 <em>Abstract, "DeepLung"</em>: "We trained a CNN on 12,000 chest CT images from 800 patients (avg 15 slices each) achieving sensitivity 0.97, specificity 0.96, AUC 0.99 on the held-out 20% of images. Dataset split randomly per image. Conclusion: this system is ready for clinical deployment."` },
          { type: "notation", html: `Use your whole toolkit on those four sentences:<br>1. <b>Split by image</b> → leakage (u4-5): same patients likely on both sides<br>2. <b>Test from the same hospital</b> → no external validation (u4-1)<br>3. <b>Numbers look perfect</b> → too good; ask for PPV at screening prevalence (u3-5)<br>4. <b>"Ready for deployment"</b> → needs calibration (u5-5), thresholds assessed per site, prospective trials` },
          { type: "insight", html: `🩺 This abstract is invented but every flaw is real and common. You just performed a peer review in three minutes with Unit 1–4 tools. That's already more than many readers do.` },
        ],
        quiz: [
          { q: "The most concerning single flaw in the mission abstract is…", choices: ["12000 images", "Random per-image split of multi-slice patients", "Using a CNN", "AUC 0.99"], answer: 1, explain: "Per-image splits put the same patient on both sides — the model can recognize individuals instead of pathology, so 0.97/0.96/0.99 are all suspect." },
          { q: "To make the evidence trustworthy, the authors should…", choices: ["Add more countries' images", "Split by patient and validate externally on a different site", "Use a bigger GPU", "Report training accuracy too"], answer: 1, explain: "Patient-level split removes leakage; external validation shows real generalization." },
          { q: "Why is '96% specificity' insufficient for deployment readiness?", choices: ["It's a typo", "Deployment needs prevalence-dependent PPV, calibration and local thresholds materialized", "Specificity is never useful", "Because CTs are 3D"], answer: 1, explain: "What a positive means depends on the setting — the numbers must be converted to bedside consequences before any 'ready' claim." },
        ],
      },
    ],
  },
  {
    id: "u5", phase: 1, emoji: "📊", title: "Evaluation for Medicine",
    sub: "Sensitivity, specificity, ROC/AUC, calibration — the numbers that judge AI",
    lessons: [
      {
        id: "u5-1", title: "The confusion matrix in 4 numbers",
        sections: [
          { type: "intuition", html: `Every test decision lands the patient in one of four boxes. Get this table cold — <b>all</b> of Unit 5 is arithmetic on it.` },
          { type: "notation", html: `<b>Confusion matrix:</b><br>• <b>TP</b> true positive — sick, test says sick ✅ (caught)<br>• <b>FN</b> false negative — sick, test says healthy ❌ (missed — the scary one)<br>• <b>FP</b> false positive — healthy, test says sick (false alarm)<br>• <b>TN</b> true negative — healthy, test says healthy ✅<br>First derived pair: sensitivity = TP/(TP+FN) (catch rate among sick). Specificity = TN/(TN+FP) (clearance among healthy).` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> each cell has a human face. FN = a patient sent home; FP = anxiety, biopsy, cost. Choosing a threshold is choosing which human error you're making more of — there's no way to erase both down to zero.` },
        ],
        quiz: [
          { q: "100 sick patients; the test catches 90. TP = ?, FN = ?", choices: ["90 and 10", "10 and 90", "0 and 100", "90 and 100"], answer: 0, explain: "Caught = true positives (90); missed = false negatives (10). Sensitivity = 0.90." },
          { q: "Which error is usually most feared in screening?", choices: ["False positive", "False negative (missed disease)", "True negative", "True positive"], answer: 1, explain: "Missing a sick patient delays treatment — that's why screening turns the dial toward high sensitivity, accepting more false alarms." },
          { q: "Sensitivity = TP/(TP+FN) because it asks…", choices: ["Among the sick, how many were caught?", "Among positives, how many are sick?", "How many tests total?", "How accurate overall?"], answer: 0, explain: "It conditions on the sick population. The flipped question (among positives…) is PPV — coming in u5-4." },
        ],
      },
      {
        id: "u5-2", title: "Sensitivity & specificity — the trade-off dial",
        sections: [
          { type: "intuition", html: `Real scores overlap: some healthy people score high, some sick people score low. A single <b>threshold</b> decides who counts as positive. Slide it and watch the two errors trade places — you cannot push both to the floor:`, demo: "thrdemo" },
          { type: "notation", html: `• Move threshold <b>left</b>: catch more sick (↑sensitivity) but false alarms soar (↓specificity). <b>Screening</b> lives here.<br>• Move threshold <b>right</b>: fewer false alarms (↑specificity) but you miss patients (↓sensitivity). <b>Confirmation</b> lives here.<br>Useful shortcut: <b>LR+ = Se/(1−Sp)</b> — how much a positive multiplies the odds.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> a paper reporting "sensitivity 0.95" is meaningless without its specificity AND threshold — you can always hit 0.95 sensitivity by calling everyone sick. Papers must show the whole curve, which is exactly the next lesson.` },
        ],
        quiz: [
          { q: "The radiology team wants to avoid missing any cancer. They should…", choices: ["Raise the threshold", "Lower the threshold (accept more false alarms)", "Keep it neutral", "Buy a bigger scanner"], answer: 1, explain: "Lower threshold → more things flagged positive → higher sensitivity at the cost of specificity." },
          { q: "Sensitivity 0.60 and specificity 0.98. This test is best used as a…", choices: ["Screening test (rule-out)", "Confirmation test (rule-in)", "Neither", "Perfect test"], answer: 1, explain: "High specificity with a positive result strongly confirms. Sensitivity is too low to rule anyone out." },
          { q: "You claim sensitivity 0.99. What must you also report?", choices: ["Nothing else", "The threshold and specificity (e.g., threshold that yields spec 0.20!)", "The GPU used", "The file format"], answer: 1, explain: "Calling everyone positive gives 0.99+ sensitivity and terrible specificity — the pair and the threshold travel together." },
        ],
      },
      {
        id: "u5-3", title: "ROC & AUC — the whole dial, in one curve",
        sections: [
          { type: "intuition", html: `Instead of arguing about one threshold, sweep <b>all</b> of them and plot sensitivity (TPR) against false-alarm rate (FPR). That curve is the <b>ROC</b>; its area is <b>AUC</b> — the model's threshold-free quality score. Play with it:`, demo: "rocdemo" },
          { type: "notation", html: `• Axes: x = FPR (1−specificity), y = TPR (sensitivity).<br>• Each point = one threshold; the white dot rides the curve.<br>• <b>AUC = probability a random sick patient scores higher than a random healthy one.</b> 0.5 = coin flip; 1.0 = perfect separation.<br>• Weak model = curve hugs the diagonal; strong model bulges to the top-left.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> AUC is the headline number of nearly every medical-AI paper — and now you know both what it means and its limits: it's <b>prevalence-independent</b>, so it says nothing about PPV. Papers must pair AUC with operating-point sens/spec at a clinical threshold.` },
        ],
        quiz: [
          { q: "AUC = 0.5 means the model…", choices: ["Is perfect", "Ranks patients no better than a coin flip", "Has no data", "Is overfit"], answer: 1, explain: "The curve is the diagonal: 50/50 chance of ordering a random sick patient above a random healthy one." },
          { q: "AUC = 0.90. In plain words…", choices: ["90% accuracy", "90% chance a random sick patient scores above a random healthy patient", "90% specificity", "90% sensitivity"], answer: 1, explain: "The probability-of-correct-ranking interpretation — and it is NOT accuracy, specificity, or sensitivity." },
          { q: "Two models have equal AUC 0.85. Clinically they may differ because…", choices: ["AUC hides where the operating threshold sits", "AUC changes hourly", "They can't differ", "AUC includes cost"], answer: 0, explain: "Same overall separation, but one might be better specifically at the low-FPR region you actually deploy in. Inspect the curve near the operating point." },
        ],
      },
      {
        id: "u5-4", title: "PPV, NPV & prevalence — Bayes at the bedside",
        sections: [
          { type: "intuition", html: `Sensitivity and specificity describe the <b>test</b>. Patients ask a different question: "my test is positive — <b>am I sick?</b>" That's PPV, and it depends on prevalence exactly as Bayes taught in Unit 3. Same test, same sensitivity, different ward → different meaning.` },
          { type: "notation", html: `• <b>PPV</b> = TP/(TP+FP) — among positives, how many are truly sick<br>• <b>NPV</b> = TN/(TN+FN) — among negatives, how many are truly healthy<br>• Both move with prevalence; Se/Sp do not.<br>Costly asymmetric errors (missing sepsis) are handled with <b>weighted</b> thresholds, or reporting sensitivity at a fixed operating specificity.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> this is the exact computation from your Diagnostic Test Lab — now you know its name and its place in the paper. When a clinic asks "should we deploy?", the honest first answer is "what's the prevalence in OUR waiting room?"` },
        ],
        quiz: [
          { q: "PPV asks…", choices: ["Among the sick, how many test positive?", "Among positives, how many are truly sick?", "Among negatives, how many are sick?", "How many patients total?"], answer: 1, explain: "PPV conditions on a positive test — the patient's actual question." },
          { q: "An excellent test (Se 0.95, Sp 0.95) used in a 0.5%-prevalence population yields PPV ≈ …", choices: ["~9%", "~50%", "~95%", "0%"], answer: 0, explain: "Low prevalence floods the positive pool with false positives; PPV collapses to single digits — the base-rate trap again." },
          { q: "A paper reports only AUC 0.95 with no prevalence. What's missing for a clinic to decide?", choices: ["Nothing", "PPV/NPV at their prevalence and a chosen operating threshold", "More GPUs", "The year"], answer: 1, explain: "Deployment is a bedside decision: what does POSITIVE mean here, at this prevalence, at this threshold." },
        ],
      },
      {
        id: "u5-5", title: "Calibration — probabilities you can trust",
        sections: [
          { type: "intuition", html: `A model can rank well (high AUC) yet its numbers lie: when it says 10%, maybe 40% actually have the disease. <b>Calibration</b> asks: do the predicted probabilities match reality? Take all patients the model scored ~30% — about 30% of them should truly be sick.` },
          { type: "notation", html: `Reliability curve: bin predictions (0–10%, 10–20%, …); plot predicted vs observed. Perfect calibration = the diagonal.<br>• Overconfident: predicted 70%, observed 45% → treat threshold decisions with care.<br>• Fixes: <b>Platt scaling</b>, isotonic regression, temperature scaling — small post-hoc corrections that don't change ranking (AUC) but make probabilities usable.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> acting on a probability needs trustworthy probability: "treat if risk > 10%" requires the 10% to mean 10%. Papers reporting AUC must also show calibration — especially when they set clinical thresholds, because treatment decisions are made on probabilities, not ranks.` },
        ],
        quiz: [
          { q: "A model is well calibrated if patients scored ~0.30…", choices: ["Are mostly healthy", "Have roughly a 30% observed event rate", "All are sick", "None have events"], answer: 1, explain: "Calibration = predicted probability equals observed frequency in that bin." },
          { q: "Platt/isotonic scaling aims to fix…", choices: ["Speed", "The probability scale (calibration), without changing ranking", "Class imbalance", "File size"], answer: 1, explain: "These post-hoc mappings recalibrate probabilities to reality; the ordering (and thus AUC) is essentially preserved." },
          { q: "Can a model have high AUC but poor calibration?", choices: ["No, AUC requires calibration", "Yes — great ranking, lying probabilities", "Only with tiny datasets", "Never"], answer: 1, explain: "AUC is rank-based; probabilities can be systematically off while ordering stays excellent — a common and dangerous gap." },
        ],
      },
      {
        id: "u5-6", title: "📄 Paper mission — the '98% accurate' chest X-ray",
        sections: [
          { type: "example", html: `📄 <em>Abstract, "ChestNet"</em>: "Our deep network detects pneumonia on chest X-rays with 98% accuracy on 5,000 images, beating radiologists. Test set: random 20% of images from the same database. No sensitivity, specificity, PPV or calibration is reported. Conclusion: ready for hospital use worldwide."` },
          { type: "notation", html: `Interrogate with Unit 5's kit:<br>1. <b>98% accuracy</b> → what's prevalence? (pneumonia may be ~5% → all-negative scores 95%!)<br>2. <b>No Se/Sp</b> → can't tell missed cases from false alarms<br>3. <b>No PPV</b> → can't convert to patient meaning at any ward's prevalence<br>4. <b>No calibration</b> → no safe treatment threshold<br>5. <b>"Worldwide"</b> → no external validation (u4-1)` },
          { type: "insight", html: `🩺 Notice the pattern across every mission: the flaws are never exotic math — they're missing prevalence, missing thresholds, missing splits, missing calibration. <b>You now have the complete checklist a clinical-AI reviewer uses.</b> That checklist alone will change how you read this literature.` },
        ],
        quiz: [
          { q: "Pneumonia prevalence here is 5%. A 'predict nobody' model's accuracy is…", choices: ["5%", "95% — and it finds no patients", "50%", "98%"], answer: 1, explain: "95% of images are healthy, so all-negative scores 95% accuracy while being useless — accuracy alone is the wrong metric here." },
          { q: "Which upgrade makes the claim clinically interpretable?", choices: ["More images", "Report Se/Sp at a threshold + PPV at target prevalence + calibration", "A bigger model", "More radiologist comparisons"], answer: 1, explain: "Those three turn an abstract accuracy into a number a clinic can act on." },
          { q: "'Beating radiologists' on a same-source random split is weak because…", choices: ["Radiologists are always right", "Same-source data and possible leakage make the comparison non-general", "X-rays are hard", "Accuracy is illegal"], answer: 1, explain: "The comparison isn't like-for-like until the model is tested on external data under real prevalence." },
        ],
      },
    ],
  },
  {
    id: "u6", phase: 1, emoji: "🧠", title: "Deep Learning for Medicine",
    sub: "CNNs, embeddings, attention, LLMs — the architecture section of papers",
    lessons: [
      {
        id: "u6-1", title: "Depth & activations — why 'deep' matters",
        sections: [
          { type: "intuition", html: `One layer can only make soft blends of inputs (Unit 1). Stack layers with a <b>nonlinearity</b> between them and you can carve almost any boundary — curves, islands, subtle interactions like "diabetes risk is high when BMI AND age are high, but only if BP is normal". Depth = expressive power.` },
          { type: "notation", html: `h₁ = σ(W₁x + b₁) → h₂ = σ(W₂h₁ + b₂) → … → ŷ<br>• Without σ (or ReLU) between layers, two linear layers collapse into one — depth buys <b>nothing</b>.<br>• ReLU(z) = max(0, z) — the modern default; cheap, keeps gradients alive.<br>• Parameter count ≈ Σ layer sizes; "a 110M-parameter model" = that many numbers learned by gradient descent (your Unit 2 loop, 110 million times).` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "multi-layer perceptron with 3 hidden layers of 256 units" in a methods section now parses into a picture: three matrix multiplications with nonlinearities. External validity and leakage still matter more than architecture — hype often inverts that priority.` },
        ],
        quiz: [
          { q: "Two stacked linear layers with no nonlinearity are equivalent to…", choices: ["A deeper network", "A single linear layer", "A CNN", "Random noise"], answer: 1, explain: "Linear ∘ linear is still linear — the activation functions are what make depth useful." },
          { q: "ReLU(z) = max(0, z) means a neuron outputs…", choices: ["0 for negative inputs, else z", "Always positive", "Always 0", "log of z"], answer: 0, explain: "It passes positives unchanged and clips negatives to zero — simple and gradient-friendly." },
          { q: "A model with more parameters than training patients will tend to…", choices: ["Generalize better", "Overfit", "Underfit", "Become calibrated"], answer: 1, explain: "Huge capacity + little data = memorization (Unit 4). This is why medical datasets push toward regularization and augmentation." },
        ],
      },
      {
        id: "u6-2", title: "CNNs — filters that see images",
        sections: [
          { type: "intuition", html: `A radiologist's eye has internalized texture-detection rules ("bright rim against dark region = fracture edge"). A <b>convolutional</b> layer does the same, but learns its rules: a small 3×3 <b>filter</b> slides over the image computing dot products, producing a map of "where did this pattern appear?". Choose a filter and watch:`, demo: "cnndemo" },
          { type: "notation", html: `output[r, c] = Σ over the 3×3 patch of (kernel ⊙ patch) — one value per position.<br>• A CNN learns <b>hundreds</b> of such filters per layer.<br>• <b>Pooling</b> shrinks resolution (max of a 2×2 region) — invariance to small shifts.<br>• Stacking filters → "edge" → "texture" → "organ" → "lesion": the famous hierarchy.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> when a paper says "ResNet-50 backbone with pretrained ImageNet weights", it means a deep stack of learned filters whose early edge-detectors transfer from natural images to X-rays and get fine-tuned. Understanding filters is understanding the whole figure.` },
        ],
        quiz: [
          { q: "A convolution layer's output at a position is…", choices: ["A random number", "A dot product of the filter with the local image patch", "The whole image average", "The gradient"], answer: 1, explain: "Exactly the dot product from Unit 1 — a match score between the filter's pattern and the local patch." },
          { q: "Pooling layers mainly…", choices: ["Add parameters", "Reduce spatial size and add small-shift tolerance", "Detect edges exactly", "Calibrate the model"], answer: 1, explain: "Pooling compresses resolution — cheaper compute and robustness to tiny translations." },
          { q: "Early CNN filters in pretrained models typically encode…", choices: ["Diagnoses", "Basic edges/directions", "Patient IDs", "Text"], answer: 1, explain: "Early layers learn generic low-level features (edges/orientations), which is why transfer learning from natural images helps medical imaging." },
        ],
      },
      {
        id: "u6-3", title: "Embeddings — meaning as geometry",
        sections: [
          { type: "intuition", html: `How do you feed "diagnosis: asthma" to a dot-product engine? Turn every word/code into a <b>vector</b>. The magic: learned embeddings place similar things close — "asthma" near "wheezing", far from "fracture". Meaning becomes <b>geometry</b>, and your Unit 1 toolkit becomes a semantic ruler.` },
          { type: "notation", html: `• Embedding matrix: one row per token (word, ICD code, medication, patient).<br>• Similarity: cosine/dot product of vectors (Unit 1-2!).<br>• The famous trick: <code>king − man + woman ≈ queen</code>.<br>• <b>Patient embeddings</b>: run all of a patient's codes through a model → one vector capturing their "clinical fingerprint" — used for clustering, retrieval, similarity search.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> "we embed ICD-10 codes into 128 dimensions" or "patient similarity search" now fully parse. Embeddings also carry risks: if training data encodes historical biases (e.g., under-diagnosis in some groups), the geometry inherits them — a real fairness issue in clinical ML.` },
        ],
        quiz: [
          { q: "Two words end up with a dot product near 1 (cosine ~1). They are…", choices: ["Unrelated", "Used in very similar contexts (semantically close)", "Opposites", "Identical spelling"], answer: 1, explain: "Embeddings align when contexts/semantics are similar — the dot product is the similarity score." },
          { q: "A 'patient embedding' is…", choices: ["A single number", "A vector summarizing a patient's record for similarity/comparison", "A JPEG", "A billing code"], answer: 1, explain: "It's a dense vector — patients close in that space are 'similar' according to the model's training data." },
          { q: "Embeddings can encode historical bias because…", choices: ["Vectors are inherently biased", "They inherit patterns from the (unequal) training data", "They are random", "Gradients cancel"], answer: 1, explain: "If some groups were historically under-diagnosed, the geometry reflects that — fairness work examines and mitigates such biases." },
        ],
      },
      {
        id: "u6-4", title: "Attention & transformers",
        sections: [
          { type: "intuition", html: `When a clinician reads "the patient's <b>blood pressure</b> is <b>high</b>", the word "High" borrows meaning from "Pressure" — nearby and relevant words sharpen each other. <b>Attention</b> formalizes that: each word asks <em>"which other words matter to me?"</em> and pulls in a weighted blend. Pick a query word and watch who gets attended to:`, demo: "attndemo" },
          { type: "notation", html: `For every token: project into a <b>query</b> q, a <b>key</b> k, a <b>value</b> v.<br>• score(i,j) = qᵢ · kⱼ (dot product! Unit 1)<br>• weights = <b>softmax</b>(scores / temperature) (Unit 3!)<br>• output_i = Σⱼ weight(i,j) · vⱼ<br>Stack attention layers → transformer. Unlike a CNN, everything can attend to everything → long-range context, parallel training.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> transformers now dominate clinical NLP (discharge summaries, radiology reports, patient messages). Attention picks out which findings modify which diagnosis across a whole note — and its weights are sometimes inspected to ask "what is the model looking at?", the closest thing AI has to a reasoning trace.` },
        ],
        quiz: [
          { q: "Attention weights are produced by…", choices: ["A convolution", "softmax of query–key dot products", "Random sampling", "Sorting alphabetically"], answer: 1, explain: "Similarity scores (dot products) normalized by softmax — Unit 1 math feeding Unit 3 math." },
          { q: "The attention output for a token is…", choices: ["A fixed constant", "A weighted blend of other tokens' values", "The token itself always", "A gradient"], answer: 1, explain: "It integrates information from the tokens it attended to, weighted by relevance." },
          { q: "Transformers beat older sequence models on clinical notes largely because…", choices: ["They are smaller", "They model long-range dependencies and train in parallel", "They avoid math", "They read images"], answer: 1, explain: "Global attention gives every token access to the whole note, and the architecture parallelizes far better than recurrent models." },
        ],
      },
      {
        id: "u6-5", title: "LLMs in the clinic — promise & the hallucination wall",
        sections: [
          { type: "intuition", html: `A large language model is a stack of attention layers (u6-4) trained to predict the next token over enormous text. Used on clinical text it can summarize, extract findings, draft letters — and it can state falsehoods with total fluency. Fluency is not evidence.` },
          { type: "notation", html: `• <b>Fine-tuning</b>: continue training on domain data (e.g., discharge notes) — adjusts all weights.<br>• <b>Prompting / RAG</b>: keep the model fixed; supply relevant documents in context ("grounding"). RAG lets the model quote the chart instead of its memory.<br>• Evaluation must still be Unit 5: sensitivity/specificity on extracting each fact, PPV against chart review, calibration… human oversight before any action.` },
          { type: "insight", html: `🩺 <b>Why medicine cares:</b> the safety move is architecture-agnostic — <b>ground the output in retrieved evidence, verify against the record, never let it act unreviewed</b>. Papers claiming "GPT diagnoses accurately" are judged by your whole checklist: leakage? prevalence? calibration? external validity? The tool changed; the standards didn't.` },
        ],
        quiz: [
          { q: "The core risk of LLMs in clinical use is…", choices: ["Typing speed", "Confident hallucination — fluent but false statements", "Too few parameters", "Green text"], answer: 1, explain: "Fluency != truth. Systems must ground outputs in evidence and keep human verification." },
          { q: "RAG means…", choices: ["Retrieve relevant documents and provide them in context", "Randomly augment gradients", "A GPU brand", "Retrain all weights"], answer: 0, explain: "Retrieval-Augmented Generation grounds generation in fetched evidence — the safest common pattern for chart questions." },
          { q: "To judge an 'LLM extracts allergies from notes' study you'd ask for…", choices: ["The prompt only", "Sensitivity/specificity vs chart review, plus error analysis", "The model size", "The temperature setting"], answer: 1, explain: "Compare against a human-reviewed reference on the same four-cell matrix — the same Unit 5 discipline as any test." },
        ],
      },
      {
        id: "u6-6", title: "🎓 Capstone — read like a reviewer",
        sections: [
          { type: "example", html: `📄 <em>Abstract, "GPT-Doc: The future of diagnosis"</em>: "We fine-tuned an LLM on 1,000 patient cases and built a CNN for the attached images. Our system reports 99% accuracy, outperforming doctors, and is ready for deployment. Data were split randomly per note and per image, all from one hospital. The model's confidence score is its output probability. No calibration, PPV, or external validation is reported."` },
          { type: "notation", html: `You now hold the full reviewer's checklist. Count the flaws:<br>1. <b>Split per note / per image</b> → leakage from the same patients (u4-5)<br>2. <b>99% accuracy, outperforming doctors</b> → meaningless without prevalence + PPV (u3, u5-4)<br>3. <b>One hospital</b> → no external validation (u4-1)<br>4. <b>"Confidence = output probability"</b> → uncalibrated probabilities steer unsafe thresholds (u5-5)<br>5. <b>"Ready for deployment"</b> → prospective trials, monitoring, prospective safety evidence absent<br>Bonus: mixing an LLM and a CNN with a single accuracy number hides which component fails where (u6).` },
          { type: "insight", html: `🎓 <b>You've finished the journey.</b> Basic functions, linear algebra, calculus, probability — assembled into the ability to dissect a clinical-AI paper's claims using first principles. Keep the review queue alive (spaced repetition), and every new paper becomes practice reps. The next frontier is practice: read one real paper a week and interrogate it, mission-style.` },
        ],
        quiz: [
          { q: "The 99% accuracy claim is most damaged by which single omission?", choices: ["GPU model", "Prevalence / PPV context — accuracy hides base rates", "The training temperature", "The prompt text"], answer: 1, explain: "Without prevalence and PPV, 99% could coexist with catching almost no true cases — the Unit 3–5 lesson." },
          { q: "'Confidence = output probability' is unsafe as stated because…", choices: ["Probabilities are illegal", "Uncalibrated probabilities may not match reality, so thresholds mislead", "Confidence should be 0 always", "It's fine"], answer: 1, explain: "The model must be calibrated (predicted 10% → observed ~10%) before its probabilities drive treatment decisions." },
          { q: "Which would most raise your trust in the system?", choices: ["A bigger LLM", "Patient-level splits + external multi-site validation + calibration + prospective trial", "More images", "Faster GPUs"], answer: 1, explain: "Every one of these closes a specific hole you learned to spot: leakage, generalizability, reliability, and real-world safety." },
          { q: "You've dissected the abstract. The single most transferable habit for your career is…", choices: ["Memorizing architectures", "Asking about prevalence, splits, metrics and calibration every time", "Trusting the abstract", "Counting parameters"], answer: 1, explain: "Those four questions carry across every paper, model, and decade of the field — that habit IS the competency." },
        ],
      },
    ],
  },
];
