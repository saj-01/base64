/**
 * Base64 Link Tool - Live Dual Field Synchronizer & Matrix Background
 * Desktop & Mobile Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const b64TextEl = document.getElementById('b64-text');
  const plainTextEl = document.getElementById('plain-text');

  const b64Counter = document.getElementById('b64-counter');
  const textCounter = document.getElementById('text-counter');

  const b64Status = document.getElementById('b64-status');
  const textStatus = document.getElementById('text-status');

  const optUrlSafe = document.getElementById('opt-url-safe');
  const btnSample = document.getElementById('btn-sample');
  const btnClearAll = document.getElementById('btn-clear-all');

  const btnPasteB64 = document.getElementById('btn-paste-b64');
  const btnCopyB64 = document.getElementById('btn-copy-b64');

  const btnPasteText = document.getElementById('btn-paste-text');
  const btnCopyText = document.getElementById('btn-copy-text');

  const btnSwap = document.getElementById('btn-swap');

  const linkPreviewCard = document.getElementById('link-preview-card');
  const detectedUrlLink = document.getElementById('detected-url-link');
  const btnOpenDetected = document.getElementById('btn-open-detected');
  const btnCopyDetected = document.getElementById('btn-copy-detected');

  const historyList = document.getElementById('history-list');
  const btnClearHistory = document.getElementById('btn-clear-history');

  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // Application State
  let lastActiveField = 'b64'; // 'b64' (Left) or 'text' (Right)
  let isUpdating = false;
  let history = JSON.parse(localStorage.getItem('base64_matrix_history') || '[]');

  const SAMPLE_LINK = 'https://github.com/anthropics/claude-code';

  /* ==========================================================================
     Slow Matrix Rain Canvas Animation
     ========================================================================== */

  function initMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (Base64 + Katakana + Numbers)
    const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/=ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const fontSize = 14;
    let columns = Math.max(10, Math.floor(canvas.width / fontSize));
    let drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    let lastTime = 0;
    const targetFps = 18; // Slow Matrix Rain Speed
    const frameInterval = 1000 / targetFps;

    function renderMatrix(currentTime) {
      requestAnimationFrame(renderMatrix);

      const elapsed = currentTime - lastTime;
      if (elapsed < frameInterval) return;
      lastTime = currentTime - (elapsed % frameInterval);

      // Re-calculate columns if window width changes
      const currentCols = Math.max(10, Math.floor(canvas.width / fontSize));
      if (currentCols !== drops.length) {
        columns = currentCols;
        drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
      }

      // Trail fade effect
      ctx.fillStyle = 'rgba(6, 9, 14, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading bright white character
        if (Math.random() > 0.93) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = 'rgba(0, 255, 102, 0.75)'; // Glowing Green Matrix Rain
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    requestAnimationFrame(renderMatrix);
  }

  /* ==========================================================================
     UTF-8 Base64 Engine
     ========================================================================== */

  function encodeBase64(str, urlSafe = false) {
    if (!str) return '';
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    let base64 = btoa(binString);

    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return base64;
  }

  function decodeBase64(base64Str) {
    if (!base64Str) return '';
    let cleaned = base64Str.trim().replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (cleaned.length % 4)) % 4;
    cleaned += '='.repeat(pad);

    if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
      throw new Error('Invalid Base64 characters');
    }

    const binString = atob(cleaned);
    const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function isValidHttpUrl(str) {
    try {
      const u = new URL(str.trim());
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  /* ==========================================================================
     Live Bi-Directional Synchronizer
     ========================================================================== */

  function syncFromB64() {
    if (isUpdating) return;
    isUpdating = true;

    const b64Val = b64TextEl.value;
    b64Counter.textContent = `${b64Val.length} chars`;

    if (!b64Val.trim()) {
      plainTextEl.value = '';
      textCounter.textContent = '0 chars';
      textStatus.textContent = 'Ready';
      textStatus.className = 'status-tag';
      b64Status.textContent = 'Ready';
      b64Status.className = 'status-tag';
      hideLinkPreview();
      isUpdating = false;
      return;
    }

    try {
      const decoded = decodeBase64(b64Val);
      plainTextEl.value = decoded;
      textCounter.textContent = `${decoded.length} chars`;

      b64Status.textContent = 'Valid Base64';
      b64Status.className = 'status-tag success';

      textStatus.textContent = isValidHttpUrl(decoded) ? 'Decoded URL' : 'Decoded Text';
      textStatus.className = 'status-tag success';

      if (isValidHttpUrl(decoded)) {
        showLinkPreview(decoded.trim());
      } else {
        hideLinkPreview();
      }

      saveToHistory(decoded.trim(), b64Val.trim());

    } catch (err) {
      b64Status.textContent = 'Invalid Base64';
      b64Status.className = 'status-tag error';
      textStatus.textContent = 'Decode Error';
      textStatus.className = 'status-tag error';
      hideLinkPreview();
    }

    isUpdating = false;
  }

  function syncFromText() {
    if (isUpdating) return;
    isUpdating = true;

    const plainVal = plainTextEl.value;
    const isUrlSafe = optUrlSafe.checked;

    textCounter.textContent = `${plainVal.length} chars`;

    if (!plainVal) {
      b64TextEl.value = '';
      b64Counter.textContent = '0 chars';
      textStatus.textContent = 'Ready';
      textStatus.className = 'status-tag';
      b64Status.textContent = 'Ready';
      b64Status.className = 'status-tag';
      hideLinkPreview();
      isUpdating = false;
      return;
    }

    try {
      const encoded = encodeBase64(plainVal, isUrlSafe);
      b64TextEl.value = encoded;
      b64Counter.textContent = `${encoded.length} chars`;

      textStatus.textContent = isValidHttpUrl(plainVal) ? 'Valid URL' : 'Plain Text';
      textStatus.className = 'status-tag success';

      b64Status.textContent = 'Encoded Base64';
      b64Status.className = 'status-tag success';

      if (isValidHttpUrl(plainVal)) {
        showLinkPreview(plainVal.trim());
      } else {
        hideLinkPreview();
      }

      saveToHistory(plainVal.trim(), encoded);

    } catch (err) {
      b64Status.textContent = 'Encoding Error';
      b64Status.className = 'status-tag error';
      hideLinkPreview();
    }

    isUpdating = false;
  }

  /* ==========================================================================
     Link Preview Handling
     ========================================================================== */

  function showLinkPreview(url) {
    detectedUrlLink.textContent = url;
    detectedUrlLink.href = url;
    btnOpenDetected.href = url;
    linkPreviewCard.classList.remove('hidden');
  }

  function hideLinkPreview() {
    linkPreviewCard.classList.add('hidden');
  }

  /* ==========================================================================
     History Storage
     ========================================================================== */

  function saveToHistory(text, b64) {
    if (!text || !b64) return;
    if (history.length > 0 && history[0].text === text) return;

    const item = {
      id: Date.now(),
      text,
      b64,
      isLink: isValidHttpUrl(text),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    history.unshift(item);
    if (history.length > 10) history.pop();

    localStorage.setItem('base64_matrix_history', JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No recent conversions yet.</div>';
      return;
    }

    historyList.innerHTML = history.map((item) => `
      <div class="history-item" data-id="${item.id}">
        <div class="history-item-left">
          <span class="history-type-badge">${item.isLink ? 'LINK' : 'TEXT'}</span>
          <span class="history-text" title="${escapeHtml(item.text)}">${escapeHtml(item.text)}</span>
        </div>
        <span class="text-btn">${item.time}</span>
      </div>
    `).join('');

    document.querySelectorAll('.history-item').forEach((el) => {
      el.addEventListener('click', () => {
        const id = Number(el.dataset.id);
        const item = history.find((h) => h.id === id);
        if (item) {
          b64TextEl.value = item.b64;
          plainTextEl.value = item.text;
          lastActiveField = 'text';
          syncFromText();
          showToast('Loaded from history');
        }
      });
    });
  }

  function clearHistory() {
    history = [];
    localStorage.removeItem('base64_matrix_history');
    renderHistory();
    showToast('History cleared');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */

  let toastTimer;
  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  /* ==========================================================================
     Event Listeners
     ========================================================================== */

  // Bi-directional live typing listeners
  b64TextEl.addEventListener('input', () => {
    lastActiveField = 'b64';
    syncFromB64();
  });

  plainTextEl.addEventListener('input', () => {
    lastActiveField = 'text';
    syncFromText();
  });

  optUrlSafe.addEventListener('change', () => {
    if (lastActiveField === 'text') syncFromText();
    else syncFromB64();
  });

  // Paste into Base64 (Left)
  btnPasteB64.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        b64TextEl.value = text;
        lastActiveField = 'b64';
        syncFromB64();
        showToast('Pasted into Base64 field!');
      }
    } catch (_) {
      showToast('Clipboard access denied');
    }
  });

  // Paste into Plain Text (Right)
  btnPasteText.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        plainTextEl.value = text;
        lastActiveField = 'text';
        syncFromText();
        showToast('Pasted into text field!');
      }
    } catch (_) {
      showToast('Clipboard access denied');
    }
  });

  // Copy Base64 (Left)
  btnCopyB64.addEventListener('click', () => {
    if (!b64TextEl.value) {
      showToast('Nothing to copy!');
      return;
    }
    navigator.clipboard.writeText(b64TextEl.value);
    showToast('Copied Base64 to clipboard!');
  });

  // Copy Plain Text (Right)
  btnCopyText.addEventListener('click', () => {
    if (!plainTextEl.value) {
      showToast('Nothing to copy!');
      return;
    }
    navigator.clipboard.writeText(plainTextEl.value);
    showToast('Copied text to clipboard!');
  });

  // Swap Left and Right Contents
  btnSwap.addEventListener('click', () => {
    const b64Val = b64TextEl.value;
    const textVal = plainTextEl.value;

    b64TextEl.value = textVal;
    plainTextEl.value = b64Val;

    if (lastActiveField === 'b64') {
      lastActiveField = 'text';
      syncFromText();
    } else {
      lastActiveField = 'b64';
      syncFromB64();
    }
    showToast('Swapped field contents!');
  });

  // Sample Link
  btnSample.addEventListener('click', () => {
    plainTextEl.value = SAMPLE_LINK;
    lastActiveField = 'text';
    syncFromText();
    showToast('Sample link loaded!');
  });

  // Clear All
  btnClearAll.addEventListener('click', () => {
    b64TextEl.value = '';
    plainTextEl.value = '';
    syncFromB64();
    showToast('Cleared all fields');
  });

  // Clear History
  btnClearHistory.addEventListener('click', clearHistory);

  // Copy Detected URL
  btnCopyDetected.addEventListener('click', () => {
    navigator.clipboard.writeText(detectedUrlLink.href);
    showToast('Copied URL to clipboard!');
  });

  // Initialize
  initMatrixCanvas();
  renderHistory();
});
