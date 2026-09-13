(function () {
  let enabled = true;
  let dragging = false;
  let startX, startY;
  let moved = false;
  let scrollTarget = null;

  const SKIP_TAGS = new Set(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT',
    'LABEL', 'VIDEO', 'CANVAS', 'SUMMARY']);

  function isInteractive(el) {
    while (el && el !== document.body) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.isContentEditable) return true;
      if (el.getAttribute('role') === 'button' || el.getAttribute('role') === 'link') return true;
      el = el.parentElement;
    }
    return false;
  }

  // クリック位置から上に向かってスクロール可能な要素を探す
  function findScrollable(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;
      const canScrollY = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
      const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth;
      if (canScrollY || canScrollX) return node;
      node = node.parentElement;
    }
    // 見つからなければwindow
    return window;
  }

  function doScrollBy(target, dx, dy) {
    if (target === window) {
      window.scrollBy(dx, dy);
    } else {
      target.scrollLeft += dx;
      target.scrollTop += dy;
    }
  }

  document.addEventListener('mousedown', (e) => {
    if (!enabled || e.button !== 0 || isInteractive(e.target)) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    scrollTarget = findScrollable(e.target);
  }, true);

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = startX - e.clientX;
    const dy = startY - e.clientY;
    if (!moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
    moved = true;
    if (document.body) document.body.style.userSelect = 'none';
    if (document.body) document.body.style.cursor = 'grabbing';
    doScrollBy(scrollTarget, dx, dy);
    startX = e.clientX;
    startY = e.clientY;
  }, true);

  document.addEventListener('mouseup', (e) => {
    if (moved) {
      e.stopPropagation();
      e.preventDefault();
    }
    dragging = false;
    moved = false;
    scrollTarget = null;
    if (document.body) document.body.style.userSelect = '';
    if (document.body) document.body.style.cursor = '';
  }, true);

  chrome.storage.local.get('dragScrollEnabled', (r) => {
    if (r.dragScrollEnabled === false) enabled = false;
  });
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.dragScrollEnabled) enabled = changes.dragScrollEnabled.newValue;
  });
})();
