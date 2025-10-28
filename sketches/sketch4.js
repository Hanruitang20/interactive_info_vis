// Commit 2: Add background gradient that changes with minutes
registerSketch('sk4', function (p) {
  const W = 800, H = 800;
  let startTime = null;
  let duration = 25 * 60 * 1000;
  let running = false;
  const options = [1, 10, 25, 55, 75];
  let buttons = [];

  p.setup = function () {
    p.createCanvas(W, H);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    createButtons();
  };

  function createButtons() {
    const bx = W / 2 - 160;
    for (let i = 0; i < options.length; i++) {
      const label = options[i] + " min";
      buttons.push({ x: bx + i * 100, y: H - 80, w: 80, h: 35, label });
    }
  }

  p.mousePressed = function () {
    for (let b of buttons) {
      if (p.mouseX > b.x && p.mouseX < b.x + b.w && p.mouseY > b.y && p.mouseY < b.y + b.h) {
        duration = parseInt(b.label) * 60 * 1000;
        startTime = p.millis();
        running = true;
      }
    }
  };

  function nowSeattle() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  }

  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  p.draw = function () {
    const now = nowSeattle();
    const currentMinute = now.getMinutes() + now.getSeconds() / 60;
    const warmShift = (currentMinute % 60) / 60;
    const r = p.lerp(180, 255, warmShift);
    const g = p.lerp(220, 180, warmShift);
    const b = p.lerp(255, 200, warmShift);
    p.background(r, g, b);

    const msNow = p.millis();
    let elapsed = running ? msNow - startTime : 0;
    const remaining = p.constrain(duration - elapsed, 0, duration);

    // Center text
    p.fill(60);
    p.textSize(48);
    p.text(running ? formatTime(remaining) : "Select focus time", W / 2, H / 2);

    for (let b of buttons) {
      p.fill(255);
      p.rect(b.x, b.y, b.w, b.h, 10);
      p.fill(40);
      p.textSize(16);
      p.text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    }
  };
});