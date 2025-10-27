// Feature: Add interaction - drag to rotate flower, press R to reset
registerSketch('sk2', function (p) {
  const W = 800, H = 800;
  let rotationOffset = 0, dragging = false, lastX = 0;

  p.setup = function () {
    p.createCanvas(W, H);
    p.angleMode(p.DEGREES);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
  };

  // Interaction
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
    const cx = W / 2, cy = H / 2;

    // Stem and leaves
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
    const petals = p.map(p.second(), 0, 59, 4, 20);
    p.fill(255, 180, 210);
    p.push();
    p.translate(cx, cy);
    p.rotate(rotationOffset);
    for (let i = 0; i < petals; i++) {
      const angle = (360 / petals) * i;
      p.rotate(angle);
      p.ellipse(0, -80, 50, 100);
    }
    p.pop();

    // Center
    p.fill(255, 220, 230);
    p.ellipse(cx, cy, 80, 80);

    // Hint
    p.fill(80, 120);
    p.textSize(14);
    p.text("Drag to rotate • Press R to reset", W / 2, H - 18);
  };
});
