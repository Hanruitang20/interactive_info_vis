// Commit 2: Add random heart placement and time-based generation
registerSketch('sk3', function (p) {
  const W = 800, H = 800;
  let heartPositions = [];
  let startMinute = null;

  const PAD = 120, MIN_DIST = 140, MAX_TRIES = 80;

  p.setup = function () {
    p.createCanvas(W, H);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    startMinute = new Date().getMinutes();
  };

  function drawHeart(x, y, size, c) {
    p.fill(c);
    p.beginShape();
    for (let t = 0; t < p.TWO_PI; t += 0.01) {
      const xh = 16 * p.pow(p.sin(t), 3);
      const yh = -(13 * p.cos(t) - 5 * p.cos(2 * t) - 2 * p.cos(3 * t) - p.cos(4 * t));
      p.vertex(x + (xh * size) / 16, y + (yh * size) / 16);
    }
    p.endShape(p.CLOSE);
  }

  function dist2(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
  function nowSeattle() { return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })); }

  function placeHeart() {
    for (let i = 0; i < MAX_TRIES; i++) {
      const cand = { x: p.random(PAD, W - PAD), y: p.random(PAD, H - PAD - 60), base: p.random(100, 140) };
      let ok = true;
      for (const h of heartPositions) {
        if (dist2(cand, h) < MIN_DIST * MIN_DIST) { ok = false; break; }
      }
      if (ok) { heartPositions.push(cand); return; }
    }
  }

  p.draw = function () {
    const now = nowSeattle();
    const mn = now.getMinutes();
    if (startMinute === null) startMinute = mn;
    const timePassed = ((mn - startMinute) + 60) % 60;
    while (heartPositions.length < timePassed + 1) placeHeart();

    p.background(200, 180, 255);
    for (const h of heartPositions) drawHeart(h.x, h.y, h.base, p.color(255, 120, 160, 180));
  };
});
