const video = document.getElementById('video');
const startBtn = document.getElementById('startBtn');
const flipBtn = document.getElementById('flipBtn');
// NOTE: captureBtn is declared in capture.js — do NOT redeclare here

let facingMode = 'user';
let stream = null;

startBtn.addEventListener('click', toggleCamera);
flipBtn.addEventListener('click', flipCamera);

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.documentElement.style.setProperty('--accent', btn.dataset.color);
  });
});

async function startStream() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
  }
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false
  });
  video.srcObject = stream;
}

async function toggleCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    startBtn.textContent = 'Start Camera';
    flipBtn.disabled = true;
    document.getElementById('captureBtn').disabled = true;
    stopAscii();
    asciiOutput.innerHTML = '<span class="placeholder">[ camera off ]</span>';
  } else {
    try {
      await startStream();
      startBtn.textContent = 'Stop Camera';
      flipBtn.disabled = false;
      document.getElementById('captureBtn').disabled = false;
      video.addEventListener('playing', startAscii, { once: true });
    } catch (err) {
      alert('Could not access camera: ' + err.message);
    }
  }
}

async function flipCamera() {
  if (!stream) return;
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  try {
    await startStream();
    video.addEventListener('playing', startAscii, { once: true });
  } catch (err) {
    facingMode = facingMode === 'user' ? 'environment' : 'user'; // revert
    try {
      await startStream();
      video.addEventListener('playing', startAscii, { once: true });
    } catch (e) {}
    alert('Back camera not available on this device.');
  }
}