(function () {
  'use strict';

  var paperText = document.getElementById('paperText');
  var caret = document.getElementById('caret');
  var keyOverlay = document.getElementById('keyOverlay');

  if (!paperText || !keyOverlay) return;

  // Text buffer (single string with \n for newlines)
  var buffer = '';

  // Map event.key to data-key (normalize so we find the overlay key)
  function getDataKey(ev) {
    var key = ev.key;
    if (key.length === 1) {
      return key.toLowerCase();
    }
    if (key === ' ') return ' ';
    if (key === 'Shift') return 'Shift';
    if (key === 'Backspace') return 'Backspace';
    if (key === 'Enter') return 'Enter';
    if (key === 'Tab') return 'Tab';
    if (key === 'CapsLock') return 'CapsLock';
    return key;
  }

  // Find all overlay elements that match this key (e.g. both Shifts)
  function getKeyElements(dataKey) {
    if (dataKey === 'Shift') {
      return keyOverlay.querySelectorAll('[data-key="Shift"], [data-key="ShiftRight"]');
    }
    return keyOverlay.querySelectorAll('[data-key="' + CSS.escape(dataKey) + '"]');
  }

  function setPressed(dataKey, pressed) {
    var els = getKeyElements(dataKey);
    for (var i = 0; i < els.length; i++) {
      els[i].classList.toggle('pressed', pressed);
    }
  }

  // Play typewriter sound (Web Audio click so it works without external files)
  var audioCtx = null;
  function playTypewriterSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.02);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Optional: use a real WAV if present
  var strikeAudio = null;
  function playStrikeSound() {
    if (strikeAudio) {
      strikeAudio.currentTime = 0;
      strikeAudio.play().catch(function () {});
    } else {
      playTypewriterSound();
    }
  }

  // Preload optional typewriter-strike.wav
  var wav = new Audio('assets/typewriter-strike.wav');
  wav.addEventListener('canplaythrough', function () {
    strikeAudio = wav;
  });
  wav.addEventListener('error', function () {});

  function isPrintableKey(key) {
    return key.length === 1 && (key >= ' ' || key === '\n' || key === '\t');
  }

  function renderPaper() {
    var text = buffer || '';
    var caretHtml = '<span class="caret" id="caret">|</span>';
    paperText.innerHTML = escapeHtml(text) + caretHtml;
    var el = document.getElementById('caret');
    if (el) caret = el;
    var paper = document.getElementById('paper');
    if (paper) paper.scrollTop = paper.scrollHeight;
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function onKeyDown(ev) {
    var dataKey = getDataKey(ev);
    setPressed(dataKey, true);

    // Don't capture when typing in an input (accessibility)
    if (ev.target.closest('input, textarea, [contenteditable="true"]')) return;

    var key = ev.key;

    if (key === 'Backspace') {
      ev.preventDefault();
      buffer = buffer.slice(0, -1);
      playStrikeSound();
      renderPaper();
      return;
    }
    if (key === 'Enter') {
      ev.preventDefault();
      buffer += '\n';
      playStrikeSound();
      renderPaper();
      return;
    }
    if (key === 'Tab') {
      ev.preventDefault();
      buffer += '    ';
      playStrikeSound();
      renderPaper();
      return;
    }
    if (key === ' ') {
      ev.preventDefault();
      buffer += ' ';
      playStrikeSound();
      renderPaper();
      return;
    }

    if (isPrintableKey(key)) {
      ev.preventDefault();
      buffer += key;
      playStrikeSound();
      renderPaper();
    }
  }

  function onKeyUp(ev) {
    var dataKey = getDataKey(ev);
    setPressed(dataKey, false);
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  var wrap = document.getElementById('typewriterWrap');
  if (wrap) {
    wrap.addEventListener('click', function () { wrap.focus(); });
  }

  // Scale keyboard to fit overlay (Figma Make export is 1120×570)
  var keyboard = document.getElementById('keyOverlay');
  var keyboardInner = keyboard && keyboard.querySelector('.keyboard-inner');
  function scaleKeyboard() {
    if (!keyboard || !keyboardInner) return;
    var w = keyboard.clientWidth;
    var h = keyboard.clientHeight;
    var scale = Math.min(1, w / 1120, h / 570);
    keyboardInner.style.transform = 'scale(' + scale + ')';
    keyboardInner.style.transformOrigin = 'center center';
  }
  if (keyboardInner) {
    scaleKeyboard();
    window.addEventListener('resize', scaleKeyboard);
  }

  renderPaper();
})();
