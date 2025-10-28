// Commit 3: Add breathing motion and fading by age
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
    const hr = now.getHours(), mn = now.getMinutes();
    const ms = p.millis();

    if (startMinute === null) startMinute = mn;
    const timePassed = ((mn - startMinute) + 60) % 60;
    while (heartPositions.length < timePassed + 1) placeHeart();

    const r = p.map(hr, 0, 23, 255, 120);
    const g = p.map(hr, 0, 23, 210, 160);
    const b = p.map(hr, 0, 23, 160, 255);
    p.background(r, g, b);

    const phase = (ms % 1000) / 1000 * p.TWO_PI;
    const breath = 0.1 * p.sin(phase);
    const vivid = p.color(255, 120, 160);
    const muted = p.color(190, 175, 185);

    for (let i = 0; i < heartPositions.length; i++) {
      const pos = heartPositions[i];
      const age = heartPositions.length - 1 - i;
      const t = p.constrain(age / 15, 0, 1);
      const decay = p.pow(1 - t, 2.2);
      const col = p.lerpColor(vivid, muted, 1 - decay);
      col.setAlpha(p.map(decay, 1, 0, 255, 90));
      const size = pos.base * decay * (1 + breath);
      drawHeart(pos.x, pos.y, size, col);
    }
  };
});