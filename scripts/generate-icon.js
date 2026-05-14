const { createCanvas } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

const size = 1024;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

// Background: rounded square with gradient
const radius = 220;
const gradient = ctx.createLinearGradient(0, 0, size, size);
gradient.addColorStop(0, "#6366f1");   // indigo-500
gradient.addColorStop(1, "#7c3aed");   // violet-600

// Draw rounded rect
ctx.beginPath();
ctx.moveTo(radius, 0);
ctx.lineTo(size - radius, 0);
ctx.quadraticCurveTo(size, 0, size, radius);
ctx.lineTo(size, size - radius);
ctx.quadraticCurveTo(size, size, size - radius, size);
ctx.lineTo(radius, size);
ctx.quadraticCurveTo(0, size, 0, size - radius);
ctx.lineTo(0, radius);
ctx.quadraticCurveTo(0, 0, radius, 0);
ctx.closePath();
ctx.fillStyle = gradient;
ctx.fill();

// Shadow glow (subtle)
ctx.shadowColor = "rgba(99, 102, 241, 0.3)";
ctx.shadowBlur = 40;

// Draw diamond/star shape in white
const cx = size / 2;
const cy = size / 2;
const starSize = 280;

ctx.beginPath();
ctx.moveTo(cx, cy - starSize);           // top
ctx.lineTo(cx + starSize * 0.55, cy - starSize * 0.55);
ctx.lineTo(cx + starSize, cy);           // right
ctx.lineTo(cx + starSize * 0.55, cy + starSize * 0.55);
ctx.lineTo(cx, cy + starSize);           // bottom
ctx.lineTo(cx - starSize * 0.55, cy + starSize * 0.55);
ctx.lineTo(cx - starSize, cy);           // left
ctx.lineTo(cx - starSize * 0.55, cy - starSize * 0.55);
ctx.closePath();

ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
ctx.shadowColor = "transparent";
ctx.fill();

const outDir = path.join(__dirname, "..", "build");
fs.mkdirSync(outDir, { recursive: true });
const pngBuffer = canvas.toBuffer("image/png");
fs.writeFileSync(path.join(outDir, "icon-1024.png"), pngBuffer);
console.log("Generated icon-1024.png");
