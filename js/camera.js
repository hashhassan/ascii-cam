const video = document.getElementById('video');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', toggleCamera);

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const color = btn.dataset.color;
    document.documentElement.style.setProperty('--accent', color);
  });
});

let stream = null;

async function toggleCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    startBtn.textContent = 'Start Camera';
    asciiOutput.innerHTML = '<span class="placeholder">[ camera off ]</span>';
  } else {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      video.srcObject = stream;
      startBtn.textContent = 'Stop Camera';
      video.addEventListener('playing', startAscii, { once: true });
    } catch (error) {
      alert('Could not access camera: ' + error.message);
    }
  }
}