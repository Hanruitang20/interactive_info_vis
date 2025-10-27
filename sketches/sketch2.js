<<<<<<< HEAD
// Instance-mode sketch for tab 2 — commit 1
=======
// Instance-mode sketch for tab 2 — Flower Clock base version
>>>>>>> 41fd892
// Feature: Draw static petals and a central core (no time interaction yet)
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

    // Static pink petals
    p.fill(255, 180, 210);
    p.push();
    p.translate(cx, cy);
    for (let i = 0; i < 12; i++) {
      p.rotate(30);
      p.ellipse(0, -80, 50, 100);
    }
    p.pop();

    // Flower center
    p.fill(255, 220, 230);
    p.ellipse(cx, cy, 80, 80);
  };
});