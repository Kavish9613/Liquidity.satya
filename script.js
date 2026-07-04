// ===== SMC animated chart =====
// Draws a candlestick sequence illustrating: buy-side liquidity build-up,
// a sweep above it, CHoCH, an order block, and entry into a bearish leg.

const NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("smc-chart");
const caption = document.getElementById("chart-caption");

function el(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

// Candle data: [x, open, close, high, low] in local SVG units (y grows downward)
const candles = [
  [20, 300, 280, 305, 275],
  [50, 280, 260, 285, 255],
  [80, 260, 268, 265, 250],
  [110, 268, 245, 270, 240],
  [140, 245, 250, 255, 238],   // equal-ish highs building liquidity
  [170, 250, 230, 253, 225],
  [200, 230, 234, 236, 224],   // liquidity pool forms around y ~222
  [230, 234, 222, 238, 218],
  [260, 222, 226, 228, 216],
  [290, 226, 210, 230, 205],   // the sweep: wick pokes above pool then closes lower
  [320, 210, 218, 214, 200],
  [350, 218, 195, 222, 190],   // CHoCH candle, breaks below
  [380, 195, 175, 198, 170],
  [410, 175, 182, 180, 165],   // pullback into order block
  [440, 182, 150, 186, 145],
  [470, 150, 130, 155, 120],
  [500, 130, 138, 134, 122],
  [530, 138, 105, 142, 100],
  [560, 105, 112, 108, 96],
  [590, 112, 80, 116, 74],
];

const liquidityY = 221; // horizontal pool level swept around candle index 9
const obTop = 232, obBottom = 246; // order block zone (candle idx 6 body area)

function drawChart() {
  svg.innerHTML = "";

  // background grid
  for (let gy = 40; gy < 400; gy += 40) {
    svg.appendChild(el("line", {
      x1: 0, y1: gy, x2: 640, y2: gy,
      stroke: "#1c1c21", "stroke-width": 1
    }));
  }

  // order block zone rectangle
  const obRect = el("rect", {
    x: 195, y: obTop, width: 250, height: obBottom - obTop,
    class: "ob-zone", id: "ob-zone"
  });
  svg.appendChild(obRect);

  // liquidity line
  const liqLine = el("line", {
    x1: 0, y1: liquidityY, x2: 640, y2: liquidityY,
    class: "liquidity-line", id: "liq-line"
  });
  svg.appendChild(liqLine);

  // candles
  candles.forEach((c, i) => {
    const [x, o, cl, h, l] = c;
    const up = cl < o; // lower y = higher price = bullish close
    const color = up ? "candle-up" : "candle-down";
    const bodyTop = Math.min(o, cl);
    const bodyH = Math.max(Math.abs(cl - o), 2);

    svg.appendChild(el("line", {
      x1: x + 9, y1: h, x2: x + 9, y2: l,
      class: "candle-wick", stroke: up ? "#6a8f78" : "#9a5f5f"
    }));
    svg.appendChild(el("rect", {
      x: x, y: bodyTop, width: 18, height: bodyH,
      class: color, rx: 1
    }));
  });

  // labels (positioned near relevant candles)
  addLabel("bsl-label", 130, 208, "buy-side liquidity");
  addLabel("sweep-label", 275, 200, "sweep ↑");
  addLabel("choch-label", 345, 172, "CHoCH");
  addLabel("ob-label", 380, 260, "order block");
  addLabel("entry-label", 500, 95, "entry → target");

  // sweep arrow
  const sweepArrow = el("path", {
    d: "M 282 260 C 282 235, 300 210, 300 205 C 300 200, 292 198, 288 202",
    class: "sweep-arrow", id: "sweep-arrow"
  });
  svg.appendChild(sweepArrow);
}

function addLabel(id, x, y, text) {
  const t = el("text", { x, y, class: "chart-label", id });
  t.textContent = text;
  svg.appendChild(t);
}

drawChart();

// ===== Sequenced reveal, synced with captions =====
const steps = [
  { delay: 300,  captions: "watching for buy-side liquidity…", show: [] },
  { delay: 1400, captions: "liquidity pool marked above equal highs", show: ["liq-line", "bsl-label"] },
  { delay: 2600, captions: "price wicks through the pool — the sweep", show: ["sweep-arrow", "sweep-label"] },
  { delay: 3800, captions: "structure breaks — CHoCH confirmed", show: ["choch-label"] },
  { delay: 5000, captions: "price returns to mitigate the order block", show: ["ob-zone", "ob-label"] },
  { delay: 6200, captions: "entry taken, target set on the move down", show: ["entry-label"] },
];

function runSequence() {
  steps.forEach(step => {
    setTimeout(() => {
      caption.textContent = step.captions;
      step.show.forEach(id => {
        const node = document.getElementById(id);
        if (node) node.classList.add("visible");
      });
    }, step.delay);
  });
}

let sequenceStarted = false;
function maybeStart() {
  if (sequenceStarted) return;
  const rect = svg.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    sequenceStarted = true;
    runSequence();
    loopSequence();
  }
}

function loopSequence() {
  const totalDuration = steps[steps.length - 1].delay + 4000;
  setInterval(() => {
    document.querySelectorAll(".visible").forEach(n => n.classList.remove("visible"));
    caption.textContent = steps[0].captions;
    runSequence();
  }, totalDuration);
}

window.addEventListener("scroll", maybeStart);
window.addEventListener("load", maybeStart);

// ===== Smooth nav highlight (optional light touch) =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
