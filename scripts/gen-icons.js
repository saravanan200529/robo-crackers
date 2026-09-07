const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

// Returns rgba pixel at normalized (nx, ny) in [-1, 1]
function pixel(nx, ny) {
  // Rounded square background (radius ~0.14)
  const r = 0.14;
  const ax = Math.max(Math.abs(nx) - (1 - r), 0);
  const ay = Math.max(Math.abs(ny) - (1 - r), 0);
  const inside = ax * ax + ay * ay <= r * r && Math.abs(nx) <= 1 && Math.abs(ny) <= 1;

  // Brand colors
  const bg = [217, 35, 45, 255]; // #D9232D
  if (!inside) return [0, 0, 0, 0];

  // White firework spark: 8-point star
  const ang = Math.atan2(ny, nx);
  const rad = Math.hypot(nx, ny);
  const starR = 0.62 * (0.62 + 0.38 * Math.cos(8 * ang));
  if (rad < starR) return [255, 255, 255, 255];

  // Small white spark dots on cross arms
  const cross = Math.abs(Math.cos(ang)) < 0.15 || Math.abs(Math.sin(ang)) < 0.15;
  if (cross && rad > 0.52 && rad < 0.78) {
    const ring = Math.abs(rad - 0.62);
    if (ring < 0.06) return [255, 255, 255, 200];
  }

  return bg;
}

function makeIcon(size, outPath) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = ((y + 0.5) / size) * 2 - 1;
      const p = pixel(nx, ny);
      const i = (y * size + x) * 4;
      rgba[i] = p[0];
      rgba[i + 1] = p[1];
      rgba[i + 2] = p[2];
      rgba[i + 3] = p[3];
    }
  }
  fs.writeFileSync(outPath, encodePng(size, size, rgba));
  console.log("wrote", outPath);
}

const dir = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(dir, { recursive: true });
makeIcon(512, path.join(dir, "icon-512.png"));
makeIcon(192, path.join(dir, "icon-192.png"));