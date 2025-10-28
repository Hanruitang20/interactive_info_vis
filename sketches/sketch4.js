

// Instance-mode sketch for tab 4 — Meditation Focus Clock (Pomodoro style)
// Features: minute-based color shift (cool→warm), second-based wave motion, shrinking core
registerSketch('sk4', function (p) {
  const W = 800, H = 800;
  let startTime = null;
  let duration = 25 * 60 * 1000; // default 25 min
  let running = false;
  const options = [1, 10, 25, 55, 75];
  let buttons = [];

  p.setup = function () {
    p.createCanvas(W, H);
    p.angleMode(p.DEGREES);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    createButtons();
  };

  // Create focus-duration selection buttons
  function createButtons() {
    const bx = W / 2 - 160;
    for (let i = 0; i < options.length; i++) {
      const label = options[i] + " min";
      buttons.push({ x: bx + i * 100, y: H - 80, w: 80, h: 35, label });
    }
  }

  // Check if mouse pressed inside any button
  p.mousePressed = function () {
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (p.mouseX > b.x && p.mouseX < b.x + b.w && p.mouseY > b.y && p.mouseY < b.y + b.h) {
        duration = options[i] * 60 * 1000;
        startTime = p.millis();
        running = true;
        return;
      }
    }
  };

  // Convert remaining time (ms) to min:sec
  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function nowSeattle() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  }

  p.draw = function () {
    const now = nowSeattle();
    const msNow = p.millis();
    let elapsed = 0;
    if (running && startTime !== null) elapsed = msNow - startTime;
    const remaining = p.constrain(duration - elapsed, 0, duration);
    const progress = 1 - remaining / duration; // 0 → 1 progress fraction

    // --- 1️⃣ Background color changes per minute (cool → warm)
    const currentMinute = now.getMinutes() + now.getSeconds() / 60;
    const warmShift = (currentMinute % 60) / 60; // cycle every hour
    const r = p.lerp(180, 255, warmShift);
    const g = p.lerp(220, 180, warmShift);
    const b = p.lerp(255, 200, warmShift);
    p.background(r, g, b);

    const cx = W / 2, cy = H / 2;
    const waves = 6; // number of concentric ripples

    // --- 2️⃣ Wave movement follows seconds for vivid effect
    const secPhase = (now.getSeconds() + now.getMilliseconds() / 1000) * 6; // faster cycle
    for (let i = 0; i < waves; i++) {
      const offset = (i / waves + progress * 0.2) % 1;
      const radius = p.map(offset, 0, 1, 80, 380) * (1 - progress); // shrink with time
      const alpha = p.map(offset, 0, 1, 200, 0);
      const waveSize = radius * (1 + 0.06 * p.sin(secPhase + i * 45));
      p.fill(255, 255, 255, alpha * 0.6);
      p.ellipse(cx, cy, waveSize, waveSize);
    }

    // --- 3️⃣ Central shrinking focus circle
    const shrinkFactor = p.lerp(1.0, 0.0, progress);
    const baseSize = 150 * shrinkFactor;
    const pulse = 1 + 0.04 * p.sin(p.millis() / 400);
    p.fill(255, 255, 255, 190);
    p.ellipse(cx, cy, baseSize * pulse, baseSize * pulse);

    // --- 4️⃣ Timer text
    p.fill(0, 80);
    p.textSize(48);
    if (running) {
      p.text(formatTime(remaining), cx, cy);
    } else {
      p.text("Select focus time", cx, cy);
    }

    // --- 5️⃣ Interactive buttons
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      p.fill(255, 255, 255, 210);
      p.rect(b.x, b.y, b.w, b.h, 10);
      p.fill(40, 90, 130);
      p.textSize(16);
      p.text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    }

    // --- 6️⃣ Optional glow outline (subtle)
    p.noFill();
    p.stroke(255, 255, 255, 80);
    p.strokeWeight(4);
    const outerR = 400 * (1 - progress * 0.7);
    p.ellipse(cx, cy, outerR, outerR);
    p.noStroke();

    // Stop when finished
    if (remaining <= 0 && running) {
      running = false;
    }
  };
});