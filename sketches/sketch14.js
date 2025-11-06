registerSketch("sk14", function (p) {

  let table;
  let data = [];
  let hoverPoint = null;
  let chart1Bars = []; // ✅ for hover regions in chart 1

  p.preload = () => {
    table = p.loadTable("sketches/Sleep.csv", "csv", "header");
  };

  p.setup = () => {
    p.createCanvas(1080, 2000);
    p.textFont("Helvetica");

    for (let r = 0; r < table.getRowCount(); r++) {
      data.push({
        gender: table.getString(r, "Gender"),
        bmi: table.getString(r, "BMI Category"),
        sleep: table.getNum(r, "Sleep Duration"),
        steps: table.getNum(r, "Daily Steps"),
        hr: table.getNum(r, "Heart Rate"),
      });
    }
  };

  p.draw = () => {
    drawBackground();
    drawTitle();
    drawChart1();
    drawAnalysis1();
    drawChart1Hover();   // ✅ Now Chart 1 hover works
    drawChart2();
    drawAnalysis2();
    drawTooltip();       // Chart 2 tooltip
  };

  // -------- Background --------
  function drawBackground() {
    let t = (Math.sin(p.frameCount * 0.002) + 1) / 2; // slow easing between 0-1
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(
        p.color("#DFF4FF"),
        p.color("#B4D6F6"),
        inter * 0.8 + t * 0.2
      );
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }

  // -------- Title --------
  function drawTitle() {
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(48);
    p.textStyle(p.BOLD);

    // Create a slow color shift using frameCount
    let t = p.sin(p.frameCount * 0.01) * 0.5 + 0.5; // oscillates between 0 and 1

    // Interpolate between two colors
    let c1 = p.color("#0033FF");   // deep blue
    let c2 = p.color("#66CCFF");   // light cyan
    let dynamicColor = p.lerpColor(c1, c2, t);

    p.fill(dynamicColor);
    p.text("Why College Students Aren't Sleeping Well?", p.width / 2, 60);
  }


  // -------- Chart 1 --------
  function drawChart1() {
    let chartTop = 240;
    let chartBottom = 520;
    let xPos = [260, 460, 680, 880];
    let labels = ["Male Normal", "Male Overweight", "Female Normal", "Female Overweight"];
    let stats = computeStats(chartBottom, chartTop);

    // Title
    p.textAlign(p.CENTER);
    p.fill(20);
    p.textSize(28);
    p.text("Sleep Duration by Gender × BMI Category", p.width / 2, 160);
    p.textSize(18);
    p.text("Overweight students consistently sleep less across genders.", p.width / 2, 190);

    // Y Axis + grid
    drawYAxis(chartTop, chartBottom, 5, 9);

    // Y-axis label
    p.push();
    p.translate(80 - 55, (chartTop + chartBottom) / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER);
    p.textSize(18);
    p.text("Sleep Duration (hours)", 0, 0);
    p.pop();

    // X-axis label
    p.textAlign(p.CENTER);
    p.textSize(18);
    p.text("Gender × BMI Category", p.width / 2, chartBottom + 95);

    // Reset hover regions
    chart1Bars = [];

    // Draw bars
    for (let i = 0; i < stats.length; i++) {
      let { mean, sd, yMean, yTop, yBottom } = stats[i];

      // Bar
      p.fill("#4B9CD3");
      p.rect(xPos[i] - 45, yMean, 90, chartBottom - yMean, 6);

      // Store interactive region
      chart1Bars.push({
        x: xPos[i] - 45,
        y: yMean,
        w: 90,
        h: chartBottom - yMean,
        gender: labels[i].split(" ")[0],
        bmi: labels[i].split(" ")[1],
        sleep: mean
      });

      // Error bar
      p.stroke(40);
      p.strokeWeight(2);
      p.line(xPos[i], yTop, xPos[i], yBottom);
      p.line(xPos[i] - 8, yTop, xPos[i] + 8, yTop);
      p.line(xPos[i] - 8, yBottom, xPos[i] + 8, yBottom);

      // Category labels under bars
      p.noStroke();
      p.fill(20);
      p.textSize(14);
      p.text(labels[i].replace(" ", "\n"), xPos[i], chartBottom + 45);
    }
  }

  function computeStats(bottom, top) {
    function mean(arr) { return arr.reduce((a,b)=>a+b,0)/arr.length; }
    function sd(arr) { let m = mean(arr); return Math.sqrt(arr.map(x=>Math.pow(x-m,2)).reduce((a,b)=>a+b)/arr.length); }

    let groups = [
      data.filter(d => d.gender==="Male" && d.bmi.includes("Normal")),
      data.filter(d => d.gender==="Male" && d.bmi==="Overweight"),
      data.filter(d => d.gender==="Female" && d.bmi.includes("Normal")),
      data.filter(d => d.gender==="Female" && d.bmi==="Overweight")
    ];

    return groups.map(g => {
      let m = mean(g.map(d=>d.sleep));
      let s = sd(g.map(d=>d.sleep));
      return {
        mean: m,
        sd: s,
        yMean: p.map(m, 5, 9, bottom, top),
        yTop: p.map(m+s, 5, 9, bottom, top),
        yBottom: p.map(m-s, 5, 9, bottom, top)
      };
    });
  }

  function drawYAxis(top, bottom, min, max) {
    p.stroke(0);
    p.line(80, top, 80, bottom);
    for (let h = min; h <= max; h++) {
      let y = p.map(h, min, max, bottom, top);
      p.noStroke();
      p.fill(20);
      p.textSize(14);
      p.text(h + "h", 48, y + 4);
      p.stroke(200);
      p.line(80, y, p.width - 100, y);
    }
  }

  // -------- Analysis Text --------
  function drawAnalysis1() {
    p.textAlign(p.LEFT, p.TOP);
    p.fill(20);
    p.textSize(18);
    p.text(
      "Analysis: From this comparison, we can see that students in the overweight group consistently sleep fewer hours than those in the normal-weight group, regardless of gender. " +
      "The gap is small in hours, but meaningful in impact: the overweight groups not only sleep less but also show larger variability, which suggests more irregular nightly routines. " +
      "In contrast, normal-weight students tend to maintain more stable sleep duration, indicating steadier daily rhythms and possibly lower physiological stress.\n\n" +
      "Reflection: This makes me realize that sleep is not just about how long we stay in bed, but how our bodies are functioning overall. The pattern here hints that metabolic and lifestyle factors may quietly shape sleep quality. " +
      "It also suggests that supporting healthier daily habits—like consistent schedules, movement, and stress recovery—could play a larger role in improving sleep than we usually acknowledge.",
      80, 650, 900, 260
    );
  }


  // -------- Chart 1 Hover Tooltip --------
  function drawChart1Hover() {
    for (let b of chart1Bars) {
      if (p.mouseX > b.x && p.mouseX < b.x + b.w && p.mouseY > b.y && p.mouseY < b.y + b.h) {

        let bmiInfo = classifyBMI(b.bmi);
        let slInfo = classifySleepHours(b.sleep);

        let txt = `
Gender: ${b.gender}
BMI: ${b.bmi} → ${bmiInfo.meaning}
Avg Sleep: ${b.sleep.toFixed(2)}h → ${slInfo.level}
(${slInfo.meaning})
        `.trim();

        let boxW = 360, boxH = 140;
        let x = p.mouseX + 20;
        let y = p.mouseY - boxH - 10;

        // prevent overflow right side
        if (x + boxW > p.width - 20) x = p.mouseX - boxW - 20;
        // prevent overflow top
        if (y < 80) y = p.mouseY + 20;

        p.fill(255);
        p.stroke(60);
        p.rect(x, y, boxW, boxH, 12);

        p.noStroke();
        p.fill(20);
        p.textSize(15);
        p.text(txt, x + 14, y + 14, boxW - 20, boxH - 20);
      }
    }
  }

  // -------- Chart 2 --------
  function drawChart2() {
    let chartTop = 1150;
    let height = 350, width = 820;
    let x0 = 120, y0 = chartTop + height;

    // TITLE (centered)
    p.fill(20);
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.text("Daily Steps vs Sleep Duration (Color = Heart Rate)", p.width / 2, chartTop - 60);

    // === GRID BACKGROUND ===
    p.stroke(200);
    p.strokeWeight(1);

    // Horizontal grid lines (sleep duration)
    for (let h = 5.5; h <= 8.5; h += 0.5) {
      let yTick = p.map(h, 5.5, 8.8, y0, y0 - height);
      p.line(x0, yTick, x0 + width, yTick);
    }

    // Vertical grid lines (steps)
    for (let s = 3000; s <= 10000; s += 1000) {
      let xTick = p.map(s, 3000, 10000, x0, x0 + width);
      p.line(xTick, y0, xTick, y0 - height);
    }

    // === AXES ===
    p.stroke(0);
    p.strokeWeight(2);
    p.line(x0, y0, x0, y0 - height); // Y-axis
    p.line(x0, y0, x0 + width, y0); // X-axis

    // === X-AXIS LABEL ===
    p.textSize(18);
    p.textAlign(p.CENTER);
    p.noStroke();
    p.fill(20);
    p.text("Daily Steps", x0 + width / 2, y0 + 50);

    // === Y-AXIS LABEL ===
    p.push();
    p.translate(x0 - 60, y0 - height / 2);
    p.rotate(-p.HALF_PI);
    p.text("Sleep Duration (hours)", 0, 0);
    p.pop();

    // === X-AXIS TICKS ===
    p.textSize(14);
    p.textAlign(p.CENTER, p.TOP);
    for (let s = 3000; s <= 10000; s += 1000) {
      let xTick = p.map(s, 3000, 10000, x0, x0 + width);
      p.fill(20);
      p.noStroke();
      p.text(s, xTick, y0 + 14);
    }

    // === Y-AXIS TICKS ===
    p.textAlign(p.RIGHT, p.CENTER);
    for (let h = 5.5; h <= 8.5; h += 0.5) {
      let yTick = p.map(h, 5.5, 8.8, y0, y0 - height);
      p.fill(20);
      p.text(h.toFixed(1) + "h", x0 - 12, yTick);
    }

    // === PLOT POINTS ===
    data.forEach(d => {
      let x = p.map(d.steps, 3000, 10000, x0, x0 + width);
      let y = p.map(d.sleep, 5.5, 8.8, y0, y0 - height);

      let t = p.map(d.hr, 60, 90, 0, 1); // color opacity mapped to HR  
      let col = p.color(
        p.lerp(255, 255, t),
        p.lerp(230, 120, t),
        p.lerp(50, 10, t)
      );

      if (p.dist(p.mouseX, p.mouseY, x, y) < 10) hoverPoint = d;

      p.noStroke();
      p.fill(col);
      p.circle(x, y, 12);
    });
  }




  // -------- Classification Helpers --------
  function classifySteps(steps) {
    if (steps < 3000) return { cat: "Sedentary", meaning: "Circadian rhythm weakened; harder to initiate sleep." };
    if (steps < 6000) return { cat: "Light Active", meaning: "Beginning to improve sleep regulation." };
    if (steps < 9000) return { cat: "Optimal for Sleep", meaning: "Research links this range to deeper sleep." };
    return { cat: "High Activity", meaning: "May shorten recovery if stress is elevated." };
  }

  function classifyHR(hr) {
    if (hr < 65) return { state: "Strong Recovery", meaning: "Easier transition into deep sleep." };
    if (hr <= 80) return { state: "Neutral Balance", meaning: "Sleep quality depends on stress patterns." };
    return { state: "Sympathetic Activation", meaning: "Can reduce deep sleep recovery." };
  }

  function classifyBMI(bmi) {
    if (bmi.includes("Normal")) return { meaning: "More stable metabolic recovery during sleep." };
    if (bmi.includes("Overweight")) return { meaning: "Elevated cortisol may disrupt sleep rhythms." };
    return { meaning: "Potential inflammatory stress affecting sleep depth." };
  }

  function classifySleepHours(h) {
    if (h >= 8) return { level: "Optimal Sleep", meaning: "Full neural & metabolic recovery." };
    if (h >= 7) return { level: "Typical Sleep", meaning: "Functional but may lack full recovery." };
    if (h >= 6) return { level: "Insufficient Sleep", meaning: "Likely cognitive & mood decline." };
    return { level: "Sleep Debt", meaning: "Heightened stress & immune strain." };
  }

  // -------- Chart 2 Hover Tooltip --------
  function drawTooltip() {
    if (!hoverPoint) return;

    let sInfo = classifySteps(hoverPoint.steps);
    let hrInfo = classifyHR(hoverPoint.hr);
    let bmiInfo = classifyBMI(hoverPoint.bmi);
    let slInfo = classifySleepHours(hoverPoint.sleep);

    let lines = [
      `Sleep: ${hoverPoint.sleep.toFixed(1)}h → ${slInfo.level}`,
      slInfo.meaning,
      ``,
      `Steps: ${hoverPoint.steps} → ${sInfo.cat}`,
      sInfo.meaning,
      ``,
      `HR: ${hoverPoint.hr} BPM → ${hrInfo.state}`,
      hrInfo.meaning
    ];

    let padding = 16;
    p.textSize(15);
    p.textAlign(p.LEFT, p.TOP);

    // Compute box width & height based on longest line
    let boxWidth = 0;
    lines.forEach(line => {
      boxWidth = Math.max(boxWidth, p.textWidth(line));
    });
    boxWidth += padding * 2;
    let boxHeight = lines.length * 20 + padding * 1.5;

    // Default tooltip position near mouse
    let x = p.mouseX + 18;
    let y = p.mouseY - boxHeight - 10;

    // ✅ Prevent overflow RIGHT
    if (x + boxWidth > p.width - 20) {
      x = p.mouseX - boxWidth - 18;
    }

    // ✅ Prevent overflow TOP
    if (y < 20) {
      y = p.mouseY + 20;
    }

    // Draw Tooltip Box
    p.fill(255);
    p.stroke(80);
    p.strokeWeight(1.2);
    p.rect(x, y, boxWidth, boxHeight, 10);

    // Draw Text
    p.noStroke();
    p.fill(20);

    let ty = y + padding;
    lines.forEach(line => {
      p.text(line, x + padding, ty);
      ty += 20;
    });

    hoverPoint = null;
  }
  function drawAnalysis2() {
    let textY = 1600; // adjust downward if needed after preview

    p.textAlign(p.LEFT, p.TOP);
    p.fill(20);
    p.textSize(18);
    p.textStyle(p.BOLD);

    p.text(
      "Analysis: This scatterplot shows a clear trend: students who walk in the moderate range of about 6,000–9,000 steps per day tend to sleep longer (around 7.2–8.5 hours) and also maintain lower resting heart rates. " +
      "This suggests that steady daily movement supports better physiological recovery and helps the body enter deeper, more restorative sleep.\n\n" +

      "Meanwhile, students who walk very little (under 3,000 steps) generally sleep less (around 6.0–6.5 hours) and often have higher resting heart rates. " +
      "This combination may signal disrupted circadian rhythms or stress that carries into the night, making deep sleep harder to maintain. Interestingly, extremely high step counts don't always lead to better sleep either — " +
      "some students who are very active still show shorter sleep if their stress levels remain high.\n\n" +

      "Reflection: What stands out to me is that the goal isn’t to push for the most activity possible, but to find a healthy middle ground where movement supports recovery rather than becoming another stressor. " +
      "Balanced routines — not extremes — seem to make the biggest difference in sleep quality.",
      80, textY, 900, 350
    );
  }

});
