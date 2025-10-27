// Feature: Add brown stem and green leaves behind petals for realism
registerSketch('sk2', function (p) {
  const W = 800, H = 800;

  p.setup = function () {
    p.createCanvas(W, H);
    p.angleMode(p.DEGREES);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(252);
    const cx = W / 2, cy = H / 2;

    // Draw stem and leaves first (background)
    const stemLength = 180;
    p.stroke(139, 69, 19);
    p.strokeWeight(5);
    p.line(cx, cy + 40, cx, cy + 40 + stemLength);
    p.noStroke();

    p.fill(90, 190, 80);
    const leafY = cy + 40 + stemLength * 0.85;
    p.ellipse(cx - 30, leafY, 46, 62);
    p.ellipse(cx + 30, leafY, 46, 62);

    // Petals (time-based)
    const petals = p.map(p.second(), 0, 59, 4, 20);
    p.fill(255, 180, 210);
    p.push();
    p.translate(cx, cy);
    for (let i = 0; i < petals; i++) {
      const angle = (360 / petals) * i;
      p.rotate(angle);
      p.ellipse(0, -80, 50, 100);
    }
    p.pop();

    // Center
    p.fill(255, 220, 230);
    p.ellipse(cx, cy, 80, 80);
  };
});