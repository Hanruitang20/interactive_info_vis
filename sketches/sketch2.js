// Feature: Encode time by mapping second() to number of petals
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