let ASCII_CHARS = ' .:-=+*#%@';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const asciiOutput = document.getElementById('ascii-output');

canvas.width = 257;
canvas.height = 100;

let contrastVal = 1;
let brightnessVal = 0;
let densityVal = 10;

document.getElementById('contrast').addEventListener('input', (e) => {
  contrastVal = parseFloat(e.target.value);
  document.getElementById('contrastVal').textContent = contrastVal;
});

document.getElementById('brightness').addEventListener('input', (e) => {
  brightnessVal = parseInt(e.target.value);
  document.getElementById('brightnessVal').textContent = brightnessVal;
});

document.getElementById('density').addEventListener('input', (e) => {
  densityVal = parseInt(e.target.value);
  document.getElementById('densityVal').textContent = densityVal;
});

document.querySelectorAll('.charset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.charset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ASCII_CHARS = btn.dataset.chars;
  });
});

function applyAdjustments(brightness) {
  let b = brightness + brightnessVal;
  b = (b - 128) * contrastVal + 128;
  b = Math.min(255, Math.max(0, b));
  return b;
}

function getAsciiChar(brightness) {
  const chars = ASCII_CHARS.slice(0, densityVal);
  const index = Math.floor((brightness / 255) * (chars.length - 1));
  return chars[index];
}

function frameToAscii() {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let result = '';

  for (let row = 0; row < canvas.height; row++) {
    for (let col = 0; col < canvas.width; col++) {
      const index = (row * canvas.width + col) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      brightness = applyAdjustments(brightness);
      result += getAsciiChar(brightness);
    }
    result += '\n';
  }

  asciiOutput.textContent = result;
  requestAnimationFrame(frameToAscii);
}

function startAscii() {
  requestAnimationFrame(frameToAscii);
}