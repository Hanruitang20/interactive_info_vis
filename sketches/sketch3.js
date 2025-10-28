// Commit 1: Base setup with one breathing heart and hour-based color background
registerSketch('sk3', function (p) {
  const W = 800, H = 800;
  let paused = false;

  p.setup = function () {
    p.createCanvas(W, H);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
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

  function nowSeattle() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  }

  p.mousePressed = function () { paused = !paused; };

  p.draw = function () {
    const now = nowSeattle();
    const hr = now.getHours();
    const ms = p.millis();

    // Background changes with hour (warm → cool)
    const r = p.map(hr, 0, 23, 255, 120);
    const g = p.map(hr, 0, 23, 210, 160);
    const b = p.map(hr, 0, 23, 160, 255);
    p.background(r, g, b);

    // Heart breathing
    const phase = (ms % 1000) / 1000 * p.TWO_PI;
    const breath = paused ? 0 : 0.1 * p.sin(phase);

    const c = p.color(255, 120, 160);
    const size = 150 * (1 + breath);
    drawHeart(W / 2, H / 2, size, c);

    // Click interaction hint
    p.fill(255);
    p.textSize(18);
    p.text(paused ? "Click to resume breathing" : "Click to pause breathing", W / 2, H - 20);
  };
});