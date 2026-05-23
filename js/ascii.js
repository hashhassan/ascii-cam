let ASCII_CHARS = ' .:-=+*#%@';

const asciiCanvas = document.createElement('canvas');
const asciiCtx = asciiCanvas.getContext('2d');
const asciiOutput = document.getElementById('ascii-output');

const isMobile = window.innerWidth <= 480;
asciiCanvas.width  = isMobile ? 213 : 257;
asciiCanvas.height = isMobile ? 140 : 100;

let contrastVal  = 1;
let brightnessVal = 0;
let densityVal   = 10;
let rendering    = false;

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

function applyAdjustments(b) {
  b = b + brightnessVal;
  b = (b - 128) * contrastVal + 128;
  return Math.min(255, Math.max(0, b));
}

function getAsciiChar(brightness) {
  const chars = ASCII_CHARS.slice(0, densityVal);
  const index = Math.floor((brightness / 255) * (chars.length - 1));
  return chars[index];
}

function frameToAscii() {
  if (!rendering) return;
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    requestAnimationFrame(frameToAscii);
    return;
  }

  asciiCtx.drawImage(video, 0, 0, asciiCanvas.width, asciiCanvas.height);
  const pixels = asciiCtx.getImageData(0, 0, asciiCanvas.width, asciiCanvas.height).data;

  let result = '';
  for (let row = 0; row < asciiCanvas.height; row++) {
    for (let col = 0; col < asciiCanvas.width; col++) {
      const i = (row * asciiCanvas.width + col) * 4;
      let b = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2];
      b = applyAdjustments(b);
      result += getAsciiChar(b);
    }
    result += '\n';
  }

  asciiOutput.textContent = result;
  requestAnimationFrame(frameToAscii);
}

function startAscii() {
  rendering = true;
  requestAnimationFrame(frameToAscii);
}

function stopAscii() {
  rendering = false;
}

// Expose the live canvas so capture.js can snapshot it
window._getAsciiSnapshot = function () {
  return asciiCanvas;
};