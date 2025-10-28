// Final version
// Feature: top-left shows total hearts so far and hearts left today
registerSketch('sk3', function (p) {
  const W = 800, H = 800;
  let paused = false;
  let heartPositions = [];
  let startMinute = null;

  const PAD = 120, MIN_DIST = 140, MAX_TRIES = 80;

  p.setup = function () {
    p.createCanvas(W, H);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    startMinute = new Date().getMinutes();
  };

  // Draw heart shape
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
  function pad2(n) { return n < 10 ? "0" + n : n; }

  // Place new heart in non-overlapping position
  function placeHeart() {
    for (let i = 0; i < MAX_TRIES; i++) {
      const cand = {
        x: p.random(PAD, W - PAD),
        y: p.random(PAD, H - PAD - 60),
        base: p.random(100, 140)
      };
      let ok = true;
      for (const h of heartPositions) {
        if (dist2(cand, h) < MIN_DIST * MIN_DIST) { ok = false; break; }
      }
      if (ok) { heartPositions.push(cand); return; }
    }
    heartPositions.push({ x: p.random(PAD, W - PAD), y: p.random(PAD, H - PAD - 60), base: p.random(100, 140) });
  }

  p.mousePressed = function () { paused = !paused; };

  p.draw = function () {
    const now = nowSeattle();
    const hr = now.getHours(), mn = now.getMinutes(), sc = now.getSeconds();
    const ms = p.millis();

    if (startMinute === null) startMinute = mn;
    const timePassed = ((mn - startMinute) + 60) % 60;
    while (heartPositions.length < timePassed + 1) placeHeart();

    // Background color by hour
    const r = p.map(hr, 0, 23, 255, 120),
          g = p.map(hr, 0, 23, 210, 160),
          b = p.map(hr, 0, 23, 160, 255);
    p.background(r, g, b);

    // Breathing animation
    const phase = (ms % 1000) / 1000 * p.TWO_PI;
    const breath = paused ? 0 : 0.1 * p.sin(phase);

    const vivid = p.color(255, 120, 160);
    const muted = p.color(190, 175, 185);

    // Draw all hearts — size & brightness decay by age
    for (let i = 0; i < heartPositions.length; i++) {
      const pos = heartPositions[i];
      const age = heartPositions.length - 1 - i; // 0 = newest
      const t = p.constrain(age / 15, 0, 1);
      const decay = p.pow(1 - t, 2.2);
      const col = p.lerpColor(vivid, muted, 1 - decay);
      col.setAlpha(p.map(decay, 1, 0, 255, 90));

      const scale = decay * (1 + breath * 0.6);
      const size = pos.base * scale;
      drawHeart(pos.x, pos.y, size, col);
    }

    // --- Top-left text info ---
    const minutesElapsedToday = hr * 60 + mn;
    const heartsSoFar = heartPositions.length;

    p.textAlign(p.LEFT, p.TOP);
    p.fill(255, 245);
    p.textSize(16);
    p.text(`Hearts so far: ${heartsSoFar}`, 16, 14);
    p.text(`Minutes elapsed today: ${minutesElapsedToday}`, 16, 34);

    // --- Bottom: live Seattle time ---
    let hr12 = hr % 12; if (hr12 === 0) hr12 = 12;
    const ampm = hr < 12 ? "AM" : "PM";
    const timeStr = `${hr12}:${pad2(mn)}:${pad2(sc)} ${ampm} (Seattle)`;
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255);
    p.textSize(24);
    p.text(timeStr, W / 2, H - 40);

    // Interaction hint
    p.textSize(16);
    p.fill(255, 230);
    p.text(paused ? "Click to resume breathing" : "Click to pause breathing", W / 2, H - 16);
  };
});
