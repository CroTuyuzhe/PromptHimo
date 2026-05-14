const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const sizes = [16, 24, 32, 48, 64, 128, 256];

const pngBuffers = sizes.map((s) =>
  fs.readFileSync(path.join(buildDir, `icon_${s}.png`))
);
console.log("PNG sizes:", pngBuffers.map((b, i) => `${sizes[i]}px=${b.length}b`).join(", "));

const count = pngBuffers.length;
const headerSize = 6;
const dirEntrySize = 16;
let dataOffset = headerSize + dirEntrySize * count;

const parts = [];

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(count, 4);
parts.push(header);

const dirEntries = Buffer.alloc(dirEntrySize * count);
for (let i = 0; i < count; i++) {
  const s = sizes[i];
  const off = i * dirEntrySize;
  dirEntries.writeUInt8(s >= 256 ? 0 : s, off);
  dirEntries.writeUInt8(s >= 256 ? 0 : s, off + 1);
  dirEntries.writeUInt8(0, off + 2);
  dirEntries.writeUInt8(0, off + 3);
  dirEntries.writeUInt16LE(1, off + 4);
  dirEntries.writeUInt16LE(32, off + 6);
  dirEntries.writeUInt32LE(pngBuffers[i].length, off + 8);
  dirEntries.writeUInt32LE(dataOffset, off + 12);
  dataOffset += pngBuffers[i].length;
}
parts.push(dirEntries);

for (const buf of pngBuffers) {
  parts.push(buf);
}

const ico = Buffer.concat(parts);
fs.writeFileSync(path.join(buildDir, "icon.ico"), ico);
console.log(`Generated icon.ico (${ico.length} bytes)`);
