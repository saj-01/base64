# b64.io — Minimalist Cyberpunk Base64 Converter

A strictly minimalist, single-screen (`100dvh`) real-time Base64 encoder & decoder built with plain HTML, CSS, and Vanilla JavaScript. Features a green Matrix rain canvas animation, bi-directional live typing synchronization, and a Cyberpunk Violet & Cyan glassmorphic box aesthetic.

![License](https://img.shields.io/badge/license-MIT-purple.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)

---

## ✨ Features

- **Strict 100dvh Viewport**: Fits entirely on a single screen without scrolling (mobile & desktop optimized).
- **Bi-Directional Live Sync**: Real-time encoder and decoder. Type or paste in either field and the opposite field converts instantly.
- **Green Matrix Code Rain**: Smooth HTML5 Canvas background animation running at ~18 FPS with Katakana and Base64 character drops.
- **Cyberpunk Violet Glass Theme**: Translucent dark obsidian cards with glowing neon violet (`#a855f7`) and cyan (`#06b6d4`) accents.
- **URL-Safe Base64**: Configurable URL-safe encoding (`-` and `_` replacing `+` and `/`, unpadded).
- **Detected URL Bar**: Auto-detects valid HTTP/HTTPS links in decoded text and displays a sleek quick-action bar with direct **Open** and **Copy** buttons.
- **100% Client-Side Privacy**: Zero server calls, zero tracking. All encoding and decoding happen locally in your browser.

---

## 🚀 Quick Start / Local Setup

No build step or external npm packages required. Simply serve the directory with any local static HTTP server:

```bash
# Clone repository
git clone https://github.com/your-username/base64-link.git
cd base64-link

# Start local server with Python 3
python3 -m http.server 8080
```

Open `http://localhost:8080` in your web browser.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible structure with clean SVG icon elements.
- **CSS3**: Custom properties, CSS Grid/Flexbox, `backdrop-filter` glassmorphism, dynamic viewport height (`100dvh`).
- **JavaScript (ES6+)**: `TextEncoder` & `TextDecoder` APIs for UTF-8 Unicode support, HTML5 2D Canvas Matrix loop, `localStorage` history management.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
