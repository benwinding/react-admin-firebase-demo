// Browser version of xid-js (which needs Node's os, crypto and Buffer):
// 12 bytes = 4 bytes time, 5 random bytes (machine id + pid), 3 bytes counter,
// encoded as 20 base32 characters with the same alphabet.
const alphabet = "0123456789abcdefghjkmnpqrstvwxyz";

const random = crypto.getRandomValues(new Uint8Array(8));
let seq = (random[5] << 16) | (random[6] << 8) | random[7];

function encode(bytes) {
  let out = "";
  let buffer = 0;
  let bits = 0;
  for (const byte of bytes) {
    // at most 4 bits are left over from the previous byte
    buffer = ((buffer << 8) | byte) & 0xfff;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(buffer >> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += alphabet[(buffer << (5 - bits)) & 0x1f];
  }
  return out;
}

export function next() {
  const bytes = new Uint8Array(12);
  const time = (Date.now() / 1000) | 0;
  bytes[0] = (time >>> 24) & 0xff;
  bytes[1] = (time >>> 16) & 0xff;
  bytes[2] = (time >>> 8) & 0xff;
  bytes[3] = time & 0xff;
  bytes.set(random.subarray(0, 5), 4);
  const c = seq & 0xffffff;
  seq += 1;
  bytes[9] = (c >>> 16) & 0xff;
  bytes[10] = (c >>> 8) & 0xff;
  bytes[11] = c & 0xff;
  return encode(bytes);
}
