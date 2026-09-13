# FanScroll — Sensu (扇子)

A Chrome/Edge extension that lets you scroll any webpage by clicking and dragging the background — just like on mobile.

Inspired by the Japanese *Sensu* (扇子) fan: open it up and let the page flow.

## Why

Scrollbars on some pages (e.g. Microsoft Forms, data tables) are too small to click reliably. FanScroll lets you drag the background to scroll instead.

## Features

- Click and drag any empty background area to scroll
- Works on pages where `window.scrollBy` is insufficient — automatically finds the scrollable ancestor element
- Skips interactive elements (links, buttons, inputs, etc.) so normal clicks still work
- ON/OFF toggle via the toolbar icon
- 3px dead zone prevents accidental scrolls on normal clicks

## How it works

The content script registers mouse event listeners at `document_start` (before page scripts load) using capture phase. This ensures the listeners run even on pages that call `stopImmediatePropagation()` on mousedown.

On drag, it walks up the DOM from the clicked element to find the nearest scrollable ancestor (`overflow: auto/scroll`), then adjusts `scrollLeft`/`scrollTop` directly. Falls back to `window.scrollBy` if no scrollable ancestor is found.

### Why `<all_urls>` and `document_start`?

- `<all_urls>`: Drag scrolling needs to work on every page the user visits, including internal tools and SaaS apps with tiny scrollbars.
- `document_start`: Some pages (e.g. Microsoft Forms) call `stopImmediatePropagation()` on mousedown in their own scripts. Registering before page scripts load ensures our listener is not blocked.

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Saves the ON/OFF toggle state across sessions |

No data is collected, transmitted, or stored outside the browser.

## Privacy

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md).

## Installation (development)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `drag-scroll/` folder

## Links

- GitHub: https://github.com/taroyamadax/fanscroll
