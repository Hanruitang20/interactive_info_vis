// Final version
// Petal color darkens as hours pass; live Seattle time shown below
registerSketch('sk2', function (p) {
  const W = 800, H = 800;
  let rotationOffset = 0, dragging = false, lastX = 0;

  p.setup = function () {
    p.createCanvas(W, H);
    p.angleMode(p.DEGREES);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
  };

  function nowSeattle() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  // Drag rotation
  p.mousePressed = function () { dragging = true; lastX = p.mouseX; };
  p.mouseReleased = function () { dragging = false; };
  p.mouseDragged = function () {
    if (!dragging) return;
    const dx = p.mouseX - lastX;
    rotationOffset += dx * 0.3;
    lastX = p.mouseX;
  };
  p.keyPressed = function () {
    if (p.key === 'r' || p.key === 'R') rotationOffset = 0;
  };

  p.draw = function () {
    p.background(252);

    const now = nowSeattle();
    const hr24 = now.getHours();
    const mn = now.getMinutes();
    const sc = now.getSeconds();
    const ms = p.millis();

    // Hour-based color gradient (light morning → dark night)
    const brightness = p.map(hr24, 6, 21, 255, 120, true);
    const petalColor = p.color(255, brightness - 40, brightness - 45);

    // Petal count with seconds
    const petals = p.map((mn * 60 + sc) % 60, 0, 59, 4, 20);
    const sway = p.sin(ms / 1000 * 90) * 3;

    const cx = W / 2, cy = H / 2;

    // Stem and leaves (background)
    const stemLength = 180;
    p.stroke(139, 69, 19);
    p.strokeWeight(5);
    p.line(cx, cy + 40, cx, cy + 40 + stemLength);
    p.noStroke();
    p.fill(90, 190, 80);
    const leafY = cy + 40 + stemLength * 0.85;
    p.ellipse(cx - 30, leafY, 46, 62);
    p.ellipse(cx + 30, leafY, 46, 62);

    // Petals
    p.push();
    p.translate(cx, cy);
    p.rotate(rotationOffset + sway);
    p.fill(petalColor);
    for (let i = 0; i < petals; i++) {
      const angle = (360 / petals) * i;
      p.push();
      p.rotate(angle);
      p.ellipse(0, -80, 50, 100);
      p.pop();
    }
    p.pop();

    // Center
    p.fill(255, 220, 230);
    p.ellipse(cx, cy, 80, 80);
    p.fill(255, 245, 250, 200);
    p.ellipse(cx - 10, cy - 10, 20, 20);

    // Time display (Seattle)
    let hr12 = hr24 % 12; if (hr12 === 0) hr12 = 12;
    const ampm = hr24 < 12 ? "AM" : "PM";
    const timeStr = `${hr12}:${pad2(mn)}:${pad2(sc)} ${ampm} (Seattle)`;
    p.fill(30);
    p.textSize(22);
    p.text(timeStr, W / 2, H - 42);

    // Interaction hint
    p.fill(80, 120);
    p.textSize(14);
    p.text("Drag to rotate • Press R to reset", W / 2, H - 18);
  };
});