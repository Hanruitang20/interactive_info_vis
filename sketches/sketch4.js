// Commit 1: Base Pomodoro layout with timer and selectable duration buttons
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

  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  p.draw = function () {
    p.background(230);
    const msNow = p.millis();
    let elapsed = 0;
    if (running && startTime !== null) elapsed = msNow - startTime;
    const remaining = p.constrain(duration - elapsed, 0, duration);

    // Center timer display
    p.fill(60);
    p.textSize(48);
    if (running) p.text(formatTime(remaining), W / 2, H / 2);
    else p.text("Select focus time", W / 2, H / 2);

    // Draw buttons
    for (let b of buttons) {
      p.fill(255);
      p.rect(b.x, b.y, b.w, b.h, 10);
      p.fill(50);
      p.textSize(16);
      p.text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    }
  };
});
