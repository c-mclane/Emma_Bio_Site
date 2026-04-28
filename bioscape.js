const canvas = document.querySelector("#bioscape");
const ctx = canvas.getContext("2d");
const pointer = { x: 0.5, y: 0.5 };
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let width = 0;
let height = 0;
let dpr = 1;
let frame = 0;

const biologyBits = [
  "DNA",
  "RNA",
  "cell",
  "gene",
  "virus",
  "protein",
  "enzyme",
  "vaccine",
  "antibody",
  "evidence",
  "peer review",
  "microscope"
];
const glyphs = Array.from({ length: 34 }, (_, index) => ({
  text: biologyBits[index % biologyBits.length],
  x: Math.random(),
  y: Math.random(),
  speed: 0.18 + Math.random() * 0.34,
  phase: Math.random() * Math.PI * 2,
  size: 12 + Math.random() * 18
}));

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawCurve(time, orbit, hueShift) {
  const cx = width * (0.5 + Math.sin(time * 0.31 + orbit) * 0.08);
  const cy = height * (0.48 + Math.cos(time * 0.27 + orbit) * 0.08);
  const radius = Math.min(width, height) * (0.18 + orbit * 0.018);
  const points = 620;

  ctx.beginPath();
  for (let i = 0; i <= points; i += 1) {
    const t = (i / points) * Math.PI * 2;
    const wobble = Math.sin(t * (3 + orbit) + time * 1.3) * 0.22;
    const px = cx + Math.sin(t * (2 + orbit * 0.35) + time + pointer.x) * radius * (1 + wobble);
    const py = cy + Math.sin(t * (3 + orbit * 0.27) + time * 0.82 + pointer.y) * radius * 0.68;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.lineWidth = 1.75 + orbit * 0.2;
  ctx.strokeStyle = `hsla(${(time * 55 + hueShift + orbit * 58) % 360}, 94%, 48%, 0.34)`;
  ctx.shadowBlur = 22;
  ctx.shadowColor = `hsla(${(time * 55 + hueShift + orbit * 58) % 360}, 94%, 50%, 0.42)`;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawHelix(cx, cy, length, phase, hue) {
  const turns = 9;
  const step = length / turns;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(phase) * 0.35);

  for (let i = 0; i < turns; i += 1) {
    const x = i * step - length / 2;
    const yA = Math.sin(i * 0.9 + phase) * 18;
    const yB = -yA;

    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue + i * 8}, 92%, 42%, 0.54)`;
    ctx.lineWidth = 1.7;
    ctx.moveTo(x, yA);
    ctx.lineTo(x + step * 0.7, yB);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = `hsla(${hue + i * 11}, 92%, 44%, 0.66)`;
    ctx.arc(x, yA, 4.2, 0, Math.PI * 2);
    ctx.arc(x, yB, 4.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCell(cx, cy, radius, phase, hue) {
  ctx.beginPath();
  for (let i = 0; i <= 90; i += 1) {
    const angle = (i / 90) * Math.PI * 2;
    const edge = radius + Math.sin(angle * 5 + phase) * 4;
    const x = cx + Math.cos(angle) * edge;
    const y = cy + Math.sin(angle) * edge;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.fillStyle = `hsla(${hue}, 85%, 56%, 0.14)`;
  ctx.strokeStyle = `hsla(${hue}, 85%, 40%, 0.48)`;
  ctx.lineWidth = 1.8;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = `hsla(${hue + 50}, 90%, 44%, 0.34)`;
  ctx.arc(cx + Math.cos(phase) * radius * 0.22, cy + Math.sin(phase) * radius * 0.18, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function drawBiologyLabels(time) {
  ctx.font = "700 14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textAlign = "center";

  glyphs.forEach((glyph, index) => {
    const drift = (time * glyph.speed + glyph.phase) % 1;
    const x = glyph.x * width + Math.sin(time + glyph.phase) * 42;
    const y = ((glyph.y + drift) % 1) * height;
    const hue = (time * 48 + index * 21) % 360;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.7 + glyph.phase) * 0.18);
    ctx.font = `800 ${glyph.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${hue}, 90%, 54%, 0.26)`;
    ctx.fillStyle = `hsla(${hue}, 82%, 30%, 0.42)`;
    ctx.fillText(glyph.text, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
  });
}

function drawBiologyForms(time) {
  for (let i = 0; i < 7; i += 1) {
    const phase = time * (0.9 + i * 0.08) + i * 1.7;
    const x = width * (0.16 + ((i * 0.13 + Math.sin(phase) * 0.04) % 0.72));
    const y = height * (0.16 + ((i * 0.19 + Math.cos(phase * 0.7) * 0.05) % 0.7));
    const hue = (time * 54 + i * 38) % 360;

    if (i % 2 === 0) {
      drawHelix(x, y, 96 + i * 9, phase, hue);
    } else {
      drawCell(x, y, 30 + i * 3, phase, hue);
    }
  }
}

function drawOrbitDots(time) {
  const cx = width * (0.5 + (pointer.x - 0.5) * 0.1);
  const cy = height * (0.52 + (pointer.y - 0.5) * 0.1);

  for (let ring = 0; ring < 5; ring += 1) {
    const count = 9 + ring * 4;
    const rx = width * (0.13 + ring * 0.045);
    const ry = height * (0.08 + ring * 0.032);

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + time * (0.32 + ring * 0.04);
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle * 1.7 + ring) * ry;
      const hue = (time * 70 + i * 13 + ring * 46) % 360;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${hue}, 95%, 44%, 0.48)`;
      ctx.arc(x, y, 2.8 + ring * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function animate() {
  frame += 1;
  const time = frame / 90;

  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";

  for (let orbit = 0; orbit < 7; orbit += 1) {
    drawCurve(time * (0.75 + orbit * 0.035), orbit, orbit * 23);
  }

  drawOrbitDots(time);
  drawBiologyForms(time);
  drawBiologyLabels(time);
  ctx.globalCompositeOperation = "source-over";

  requestAnimationFrame(animate);
}

function tiltCards(event) {
  pointer.x = event.clientX / Math.max(width, 1);
  pointer.y = event.clientY / Math.max(height, 1);

  document.querySelectorAll(".content-card, .member-card, .signal-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      card.style.transform = "";
      return;
    }

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
  });
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", tiltCards);
window.addEventListener("pointerleave", () => {
  document.querySelectorAll(".content-card, .member-card, .signal-card").forEach((card) => {
    card.style.transform = "";
  });
});

resize();

if (!prefersReducedMotion) {
  animate();
}
