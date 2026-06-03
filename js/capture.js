const captureBtn   = document.getElementById('captureBtn');
const flashOverlay = document.getElementById('flashOverlay');

captureBtn.addEventListener('click', captureFrame);

function captureFrame() {
  const asciiOutput = document.getElementById('ascii-output');
  const text = asciiOutput.textContent;
  if (!text || text.includes('camera off')) return;

  // Get current accent colour
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#00ff99';

  const lines = text.split('\n');

  const FONT_SIZE   = 7;
  const LINE_HEIGHT = FONT_SIZE * 1.6;
  const FONT        = `${FONT_SIZE}px "Courier New", Courier, monospace`;

  // Measure character width
  const measure = document.createElement('canvas').getContext('2d');
  measure.font  = FONT;
  const charW   = measure.measureText('M').width;
  const maxCols = Math.max(...lines.map(l => l.length));

  // Build output canvas sized to fit the text
  const out    = document.createElement('canvas');
  out.width    = Math.ceil(charW * maxCols);
  out.height   = Math.ceil(LINE_HEIGHT * lines.length);
  const octx   = out.getContext('2d');

  // Black background
  octx.fillStyle = '#0a0a0a';
  octx.fillRect(0, 0, out.width, out.height);
  octx.filter = 'brightness(1.8)';

  // Draw ASCII text in the current accent colour
  octx.fillStyle    = accent;
  octx.font         = FONT;
  octx.textBaseline = 'top';
  lines.forEach((line, i) => {
    octx.fillText(line, 0, i * LINE_HEIGHT);
  });

  // Flash effect
  triggerFlash();

  // iOS Safari ignores <a download> — open in new tab instead
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (isIOS) {
    const dataUrl = out.toDataURL('image/png');
    const win = window.open();
    win.document.write(`
      <html><body style="margin:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh">
        <p style="color:#fff;font-family:monospace;font-size:13px;margin-bottom:12px;letter-spacing:2px">
          LONG-PRESS IMAGE → SAVE TO PHOTOS
        </p>
        <img src="${dataUrl}" style="max-width:100%;border:1px solid #333" />
      </body></html>
    `);
  } else {
    // Desktop + Android: triggers file download
    out.toBlob((blob) => {
      if (!blob) { alert('Capture failed. Try again.'); return; }

      const url  = URL.createObjectURL(blob);
      const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ascii-cam-${ts}.png`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 1500);
    }, 'image/png');
  }
}

function triggerFlash() {
  flashOverlay.classList.add('flash-active');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flashOverlay.classList.remove('flash-active');
    });
  });
}