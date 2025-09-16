(() => {
  "use strict";

  const previousEl = document.querySelector('[data-previous]');
  const currentEl = document.querySelector('[data-current]');
  const keysEl = document.querySelector('.keys');
  const historyPanel = document.querySelector('[data-history-panel]');
  const historyList = document.querySelector('[data-history-list]');
  const themeToggle = document.querySelector('[data-action="theme"]');
  const historyToggle = document.querySelector('[data-action="history"]');
  const themeIcon = document.querySelector('.theme-icon');

  const MAX_DISPLAY_LEN = 16;
  const PRECISION = 12;

  const state = {
    current: '0',
    previous: '',
    operation: null,
    overwrite: false,
    history: [],
    isLightTheme: false,
    historyVisible: false,
  };

  // Sound effects
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  function playSound(frequency = 800, duration = 100) {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }

  function addToHistory(expression, result) {
    state.history.unshift({ expression, result, timestamp: Date.now() });
    if (state.history.length > 50) {
      state.history = state.history.slice(0, 50);
    }
    updateHistoryDisplay();
  }

  function updateHistoryDisplay() {
    if (state.history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
      return;
    }

    historyList.innerHTML = state.history.map(item => `
      <div class="history-item" data-expression="${item.expression}" data-result="${item.result}">
        <div class="history-expression">${item.expression}</div>
        <div class="history-result">${item.result}</div>
      </div>
    `).join('');
  }

  function toggleTheme() {
    state.isLightTheme = !state.isLightTheme;
    document.body.classList.toggle('light-theme', state.isLightTheme);
    themeIcon.textContent = state.isLightTheme ? '☀️' : '🌙';
    localStorage.setItem('calculator-theme', state.isLightTheme ? 'light' : 'dark');
    playSound(600, 80);
  }

  function toggleHistory() {
    state.historyVisible = !state.historyVisible;
    historyPanel.classList.toggle('visible', state.historyVisible);
    playSound(500, 80);
  }

  function clearHistory() {
    state.history = [];
    updateHistoryDisplay();
    playSound(400, 100);
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme === 'light') {
      state.isLightTheme = true;
      document.body.classList.add('light-theme');
      themeIcon.textContent = '☀️';
    }
  }

  function countFractionDigits(value) {
    const s = String(value);
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
  }

  function trimTrailingZeros(numStr) {
    if (!numStr.includes('.')) return numStr;
    let s = numStr.replace(/\.0+$/, '').replace(/(\.[0-9]*?)0+$/, '$1');
    if (s.endsWith('.')) s = s.slice(0, -1);
    return s;
  }

  function add(a, b) {
    const da = countFractionDigits(a);
    const db = countFractionDigits(b);
    const scale = 10 ** Math.max(da, db);
    const res = Math.round(Number(a) * scale + Number(b) * scale) / scale;
    return res;
  }

  function subtract(a, b) {
    const da = countFractionDigits(a);
    const db = countFractionDigits(b);
    const scale = 10 ** Math.max(da, db);
    const res = Math.round(Number(a) * scale - Number(b) * scale) / scale;
    return res;
  }

  function multiply(a, b) {
    const da = countFractionDigits(a);
    const db = countFractionDigits(b);
    const scale = 10 ** (da + db);
    const ia = Number(String(a).replace('.', ''));
    const ib = Number(String(b).replace('.', ''));
    const res = ia * ib / scale;
    return res;
  }

  function divide(a, b) {
    if (Number(b) === 0) return NaN;
    const res = Number(a) / Number(b);
    return Number(res.toFixed(PRECISION));
  }

  function operate(a, b, op) {
    switch (op) {
      case '+': return add(a, b);
      case '-': return subtract(a, b);
      case '*': return multiply(a, b);
      case '/': return divide(a, b);
      default: return Number(b);
    }
  }

  function formatForDisplay(value) {
    if (value == null || Number.isNaN(value)) return 'Error';
    let s = typeof value === 'number' ? String(value) : value;
    if (Math.abs(Number(s)) >= 1e12 || (Math.abs(Number(s)) !== 0 && Math.abs(Number(s)) < 1e-9)) {
      s = Number(s).toExponential(8);
    } else {
      s = trimTrailingZeros(Number(s).toFixed(12));
    }
    if (s.length > MAX_DISPLAY_LEN) {
      s = Number(s).toExponential(6);
    }
    return s;
  }

  function updateDisplay() {
    currentEl.textContent = state.current;
    const prevText = state.previous && state.operation ? `${state.previous} ${symbolForOp(state.operation)}` : '';
    previousEl.textContent = prevText;
  }

  function symbolForOp(op) {
    return op === '*' ? '×' : op === '/' ? '÷' : op;
  }

  function clearAll() {
    state.current = '0';
    state.previous = '';
    state.operation = null;
    state.overwrite = false;
    updateDisplay();
    playSound(300, 120);
  }

  function deleteOne() {
    if (state.overwrite) {
      state.current = '0';
      state.overwrite = false;
    } else {
      state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
    }
    updateDisplay();
    playSound(200, 80);
  }

  function appendDigit(d) {
    if (state.overwrite) {
      state.current = d;
      state.overwrite = false;
    } else {
      if (state.current === '0') state.current = d;
      else state.current += d;
    }
    updateDisplay();
    playSound(800 + parseInt(d) * 50, 60);
  }

  function appendDot() {
    if (state.overwrite) {
      state.current = '0.';
      state.overwrite = false;
    } else if (!state.current.includes('.')) {
      state.current += '.';
    }
    updateDisplay();
    playSound(700, 60);
  }

  function chooseOperation(op) {
    if (state.operation && !state.overwrite) {
      // compute with existing op first (chaining)
      equals();
    }
    state.operation = op;
    state.previous = state.current;
    state.overwrite = true;
    updateDisplay();
    playSound(900, 80);
  }

  function toggleSign() {
    if (state.current === '0') return;
    state.current = state.current.startsWith('-') ? state.current.slice(1) : '-' + state.current;
    updateDisplay();
    playSound(600, 70);
  }

  function percent() {
    const num = Number(state.current);
    const res = num / 100;
    state.current = formatForDisplay(res);
    state.overwrite = true;
    updateDisplay();
    playSound(500, 80);
  }

  function equals() {
    if (!state.operation || state.previous === '') return;
    const a = state.previous;
    const b = state.current;
    const result = operate(a, b, state.operation);
    const formatted = formatForDisplay(result);
    
    // Add to history
    const expression = `${a} ${symbolForOp(state.operation)} ${b}`;
    addToHistory(expression, formatted);
    
    state.current = formatted;
    state.previous = '';
    state.operation = null;
    state.overwrite = true;
    updateDisplay();
    playSound(1000, 100);
  }

  function handleKey(value) {
    if (/^[0-9]$/.test(value)) return appendDigit(value);
    switch (value) {
      case '.': return appendDot();
      case '+':
      case '-':
      case '*':
      case '/':
        return chooseOperation(value);
      case 'Enter':
      case '=':
        return equals();
      case 'Backspace':
        return deleteOne();
      case 'Escape':
        return clearAll();
      case '%':
        return percent();
      default:
        return;
    }
  }

  // Event Listeners
  keysEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    // Add visual feedback
    btn.style.transform = 'translateY(2px) scale(0.98)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
    
    const digit = btn.getAttribute('data-digit');
    const op = btn.getAttribute('data-operation');
    const action = btn.getAttribute('data-action');

    if (digit) return appendDigit(digit);
    if (op) return chooseOperation(op);
    if (action === 'dot') return appendDot();
    if (action === 'equals') return equals();
    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteOne();
    if (action === 'sign') return toggleSign();
    if (action === 'percent') return percent();
  });

  // Theme and history controls
  themeToggle.addEventListener('click', toggleTheme);
  historyToggle.addEventListener('click', toggleHistory);
  
  document.querySelector('[data-action="clear-history"]').addEventListener('click', clearHistory);

  // History item clicks
  historyList.addEventListener('click', (e) => {
    const item = e.target.closest('.history-item');
    if (!item) return;
    
    const result = item.getAttribute('data-result');
    if (result && result !== 'Error') {
      state.current = result;
      state.overwrite = true;
      updateDisplay();
      playSound(800, 80);
    }
  });

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    // Prevent page scroll on Space when button focused
    if (key === ' ') { e.preventDefault(); return; }
    handleKey(key);
  });

  // Initialize
  loadTheme();
  updateDisplay();
  updateHistoryDisplay();
})();


