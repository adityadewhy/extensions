(() => {
  const OVERLAY_ID = '__tab_darker_overlay__';
  const pressedKeys = new Set();

  function setBlackout(enable) {
    let overlay = document.getElementById(OVERLAY_ID);

    if (enable) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.setAttribute('aria-hidden', 'true');
        
        // Inline fallback styling with high priority
        overlay.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: #000000 !important;
          background: #000000 !important;
          z-index: 2147483647 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          pointer-events: all !important;
          cursor: default !important;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          filter: none !important;
          box-sizing: border-box !important;
        `;

        const container = document.documentElement || document.body || document.head;
        if (container) {
          container.appendChild(overlay);
        }
      } else {
        overlay.style.setProperty('display', 'block', 'important');
      }
    } else {
      if (overlay) {
        overlay.remove();
      }
    }
  }

  // Cross-frame messaging so shortcut works even inside nested iframes
  window.addEventListener('message', (event) => {
    if (event.data && typeof event.data === 'object' && event.data.type === 'TAB_DARKER_TOGGLE') {
      setBlackout(event.data.enable);
    }
  });

  function triggerAction(enable, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    setBlackout(enable);

    // If triggered inside an iframe, also instruct top frame to toggle
    if (window !== window.top) {
      try {
        window.top.postMessage({ type: 'TAB_DARKER_TOGGLE', enable }, '*');
      } catch (_) {}
    }
  }

  window.addEventListener(
    'keydown',
    (e) => {
      pressedKeys.add(e.code);

      const isSpace = pressedKeys.has('Space') || e.code === 'Space' || e.key === ' ';
      const isComma = pressedKeys.has('Comma') || e.code === 'Comma' || e.key === ',';
      const isPeriod = pressedKeys.has('Period') || e.code === 'Period' || e.key === '.';

      // Space + , => Turn black
      if (isSpace && isComma) {
        triggerAction(true, e);
        return;
      }

      // Space + . => Make normal
      if (isSpace && isPeriod) {
        triggerAction(false, e);
        return;
      }
    },
    true
  );

  window.addEventListener(
    'keyup',
    (e) => {
      pressedKeys.delete(e.code);
      if (e.key === ' ') pressedKeys.delete('Space');
      if (e.key === ',') pressedKeys.delete('Comma');
      if (e.key === '.') pressedKeys.delete('Period');
    },
    true
  );

  window.addEventListener('blur', () => {
    pressedKeys.clear();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pressedKeys.clear();
    }
  });
})();
