// Dapur Kilat — everything on screen, drawn on one canvas. The playfield is a
// fixed 1280x720 logical area, letterboxed to the window; no rule here depends
// on the screen size. All art is drawn with canvas paths: no image files.

import { FIELD, FONT, INGREDIENTS, ING_BY_ID, LAYOUT, PALETTE } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_OVER = 'over';

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function text(ctx, value, x, y, size, color, weight = 700, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(value, x, y);
}

/** Draw one ingredient's picture at (cx, cy), fitting in a `size` square. */
export function drawIngredient(ctx, id, cx, cy, size) {
  const ing = ING_BY_ID[id];
  if (!ing) return;
  const s = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  if (id === 'roti') {
    ctx.fillStyle = ing.bottom;
    roundRect(ctx, -s * 0.9, -s * 0.1, s * 1.8, s * 0.5, s * 0.2);
    ctx.fill();
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.1, s * 0.9, s * 0.62, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#fff3c4';
    for (const [dx, dy] of [[-0.45, -0.42], [0, -0.58], [0.45, -0.42], [-0.2, -0.3], [0.25, -0.3]]) {
      ctx.beginPath();
      ctx.ellipse(dx * s, dy * s, s * 0.09, s * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'daging') {
    ctx.fillStyle = ing.bottom;
    roundRect(ctx, -s * 0.95, -s * 0.32, s * 1.9, s * 0.64, s * 0.3);
    ctx.fill();
    ctx.fillStyle = ing.top;
    roundRect(ctx, -s * 0.95, -s * 0.42, s * 1.9, s * 0.5, s * 0.25);
    ctx.fill();
    ctx.fillStyle = ing.accent;
    for (const [dx, dy] of [[-0.5, -0.15], [0.1, -0.25], [0.55, -0.1], [-0.15, 0.05], [0.35, 0.12]]) {
      ctx.beginPath();
      ctx.arc(dx * s, dy * s, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'telur') {
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    ctx.ellipse(-s * 0.15, 0, s * 0.75, s * 0.55, 0, 0, Math.PI * 2);
    ctx.ellipse(s * 0.35, s * 0.1, s * 0.5, s * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ing.accent;
    ctx.beginPath();
    ctx.arc(s * 0.05, -s * 0.05, s * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd94a';
    ctx.beginPath();
    ctx.arc(-s * 0.02, -s * 0.12, s * 0.16, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'keju') {
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    ctx.moveTo(-s * 0.9, s * 0.4);
    ctx.lineTo(s * 0.9, s * 0.4);
    ctx.lineTo(0, -s * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = ing.bottom;
    ctx.beginPath();
    ctx.arc(-s * 0.3, s * 0.12, s * 0.12, 0, Math.PI * 2);
    ctx.arc(s * 0.35, s * 0.18, s * 0.1, 0, Math.PI * 2);
    ctx.arc(s * 0.05, -s * 0.18, s * 0.09, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'selada') {
    ctx.fillStyle = ing.bottom;
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const x = -s * 0.8 + i * s * 0.4;
      ctx.arc(x, s * 0.05, s * 0.34, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const x = -s * 0.8 + i * s * 0.4;
      ctx.arc(x, -s * 0.08, s * 0.3, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.strokeStyle = ing.accent;
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.moveTo(-s * 0.7, -s * 0.05);
    ctx.quadraticCurveTo(0, s * 0.25, s * 0.7, -s * 0.05);
    ctx.stroke();
  } else if (id === 'tomat') {
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    ctx.arc(0, s * 0.08, s * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ing.bottom;
    ctx.beginPath();
    ctx.arc(-s * 0.15, s * 0.2, s * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4e9b2e';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.lineTo(-s * 0.28, -s * 0.78);
    ctx.lineTo(0, -s * 0.62);
    ctx.lineTo(s * 0.28, -s * 0.78);
    ctx.lineTo(0, -s * 0.55);
    ctx.fill();
  } else if (id === 'saus') {
    ctx.strokeStyle = ing.top;
    ctx.lineWidth = s * 0.22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.75, -s * 0.25);
    ctx.bezierCurveTo(-s * 0.3, -s * 0.6, s * 0.1, s * 0.1, s * 0.55, -s * 0.35);
    ctx.bezierCurveTo(s * 0.8, -s * 0.55, s * 0.85, -s * 0.1, s * 0.6, s * 0.15);
    ctx.stroke();
    ctx.fillStyle = ing.top;
    for (const [dx, dy, r] of [[-0.6, 0.35, 0.14], [0.05, 0.42, 0.11], [0.55, 0.3, 0.13]]) {
      ctx.beginPath();
      ctx.arc(dx * s, dy * s, r * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawHeart(ctx, cx, cy, size, filled) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-11, -4, -6, -12, 0, -6);
  ctx.bezierCurveTo(6, -12, 11, -4, 0, 6);
  ctx.closePath();
  ctx.fillStyle = filled ? '#e23b2e' : 'rgba(255,255,255,0.25)';
  ctx.fill();
  ctx.restore();
}

function drawCoin(ctx, cx, cy, radius) {
  ctx.fillStyle = '#f2b705';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c77f00';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, 'C', cx, cy + radius * 0.38, radius * 1.1, '#8a5a00', 800, 'center');
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
    offsetX = (canvas.width - FIELD.width * scale) / 2;
    offsetY = (canvas.height - FIELD.height * scale) / 2;
  }

  function toLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x: (x - offsetX) / scale, y: (y - offsetY) / scale };
  }

  /** Ingredient bin rectangles, in logical coordinates. */
  function binRects() {
    const { bins } = LAYOUT;
    const totalGap = (INGREDIENTS.length - 1) * bins.gap;
    const width = (1072 - bins.margin * 2 - totalGap) / INGREDIENTS.length;
    return INGREDIENTS.map((ing, index) => ({
      id: ing.id,
      x: bins.margin + index * (width + bins.gap),
      y: bins.y,
      width,
      height: bins.height,
    }));
  }

  /** What is at logical point (x, y): an ingredient bin, serve, clear, or null. */
  function pickAt(x, y) {
    for (const rect of binRects()) {
      if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
        return { type: 'ingredient', id: rect.id };
      }
    }
    const { serve, clear } = LAYOUT;
    if (x >= serve.x && x <= serve.x + serve.width && y >= serve.y && y <= serve.y + serve.height) {
      return { type: 'serve' };
    }
    if (x >= clear.x && x <= clear.x + clear.width && y >= clear.y && y <= clear.y + clear.height) {
      return { type: 'clear' };
    }
    return null;
  }

  function drawKitchen(state) {
    // Wall: warm tiles.
    ctx.fillStyle = PALETTE.wall;
    ctx.fillRect(0, 104, FIELD.width, 348);
    ctx.fillStyle = PALETTE.wallTile;
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        if ((row + col) % 2 === 0) ctx.fillRect(col * 80 + (row % 2) * 40 - 40, 116 + row * 44, 78, 42);
      }
    }
    // Window with a sunny street.
    ctx.fillStyle = '#bfe3f2';
    roundRect(ctx, 36, 128, 190, 150, 10);
    ctx.fill();
    ctx.fillStyle = '#ffd94a';
    ctx.beginPath();
    ctx.arc(180, 165, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7bc950';
    ctx.fillRect(36, 248, 190, 30);
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(36, 128, 190, 8);
    ctx.fillRect(36, 270, 190, 8);
    ctx.fillRect(126, 128, 8, 150);
    // Shelf with jars, right side.
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(1050, 150, 190, 10);
    ctx.fillRect(1050, 230, 190, 10);
    const jars = ['#e23b2e', '#f2b705', '#4e9b2e', '#d43d2a', '#3a7bd5', '#f0c169'];
    jars.forEach((color, i) => {
      const x = 1062 + (i % 3) * 62;
      const y = i < 3 ? 108 : 188;
      ctx.fillStyle = color;
      roundRect(ctx, x, y, 44, 42, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(x + 6, y + 6, 32, 8);
    });
    // Hanging lamps.
    for (const x of [430, 640, 850]) {
      ctx.strokeStyle = '#5a4230';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, 104);
      ctx.lineTo(x, 140);
      ctx.stroke();
      ctx.fillStyle = '#3d2c1e';
      ctx.beginPath();
      ctx.moveTo(x - 26, 152);
      ctx.lineTo(x + 26, 152);
      ctx.lineTo(x + 14, 138);
      ctx.lineTo(x - 14, 138);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 217, 74, 0.9)';
      ctx.beginPath();
      ctx.arc(x, 156, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    // Stove with two pots, left of the plate.
    ctx.fillStyle = '#4a4a52';
    roundRect(ctx, 250, 380, 220, 72, 8);
    ctx.fill();
    for (const [x, color] of [[300, '#c9ced6'], [410, '#8a8f99']]) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, 372, 52, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5a4230';
      ctx.fillRect(x - 52, 372, 104, 8);
    }
    // Counter.
    ctx.fillStyle = PALETTE.counterTop;
    ctx.fillRect(0, LAYOUT.counter.y, FIELD.width, 26);
    ctx.fillStyle = PALETTE.counterFront;
    ctx.fillRect(0, LAYOUT.counter.y + 26, FIELD.width, 92);
    ctx.fillStyle = PALETTE.counterEdge;
    for (let x = 0; x < FIELD.width; x += 160) ctx.fillRect(x, LAYOUT.counter.y + 26, 4, 92);
    // Floor strip under the counter.
    ctx.fillStyle = '#d9c39a';
    ctx.fillRect(0, LAYOUT.counter.y + 118, FIELD.width, 720 - LAYOUT.counter.y - 118);
  }

  function drawTicket(ticket, index) {
    const { board } = LAYOUT;
    const x = board.x + index * (board.ticketWidth + board.gap);
    const y = board.y;
    const urgent = ticket.left <= 6;
    const ratio = Math.max(0, ticket.left / ticket.total);
    ctx.save();
    if (urgent) {
      ctx.shadowColor = 'rgba(226,59,46,0.8)';
      ctx.shadowBlur = 12 + Math.sin(Date.now() / 120) * 5;
    }
    ctx.fillStyle = PALETTE.ticket;
    roundRect(ctx, x, y, board.ticketWidth, board.ticketHeight, 8);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = urgent ? PALETTE.ticketUrgent : '#d9c9a8';
    ctx.lineWidth = urgent ? 3 : 1.5;
    roundRect(ctx, x, y, board.ticketWidth, board.ticketHeight, 8);
    ctx.stroke();
    text(ctx, `#${ticket.id} ${ticket.dish}`, x + 10, y + 22, 15, PALETTE.ticketInk, 800);
    ticket.recipe.forEach((id, i) => {
      drawIngredient(ctx, id, x + 22 + i * 34, y + 48, 26);
    });
    // Countdown bar.
    ctx.fillStyle = '#e8ddc4';
    roundRect(ctx, x + 10, y + board.ticketHeight - 14, board.ticketWidth - 20, 7, 3);
    ctx.fill();
    ctx.fillStyle = ratio > 0.5 ? '#4e9b2e' : ratio > 0.25 ? '#f0a500' : '#e23b2e';
    roundRect(ctx, x + 10, y + board.ticketHeight - 14, (board.ticketWidth - 20) * ratio, 7, 3);
    ctx.fill();
    if (urgent) text(ctx, `${Math.ceil(ticket.left)}d`, x + board.ticketWidth - 12, y + 22, 15, '#e23b2e', 800, 'right');
  }

  function drawPlate(state) {
    const { plate } = LAYOUT;
    const shakeX = state.shake > 0 ? (Math.random() - 0.5) * state.shake * 22 : 0;
    ctx.save();
    ctx.translate(shakeX, 0);
    // Cutting board under the plate.
    ctx.fillStyle = '#c98f5f';
    roundRect(ctx, plate.x - 132, plate.y - 96, 264, 200, 14);
    ctx.fill();
    ctx.fillStyle = '#b57e4e';
    roundRect(ctx, plate.x - 132, plate.y - 96, 264, 200, 14);
    ctx.stroke();
    // Plate.
    ctx.fillStyle = PALETTE.plate;
    ctx.beginPath();
    ctx.ellipse(plate.x, plate.y + 18, plate.radius, plate.radius * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.plateRim;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#efe9d8';
    ctx.beginPath();
    ctx.ellipse(plate.x, plate.y + 18, plate.radius * 0.78, plate.radius * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stacked ingredients, bottom-up, squashed into layers.
    state.plate.forEach((id, i) => {
      const layerY = plate.y + 30 - i * 15;
      ctx.save();
      ctx.translate(plate.x, layerY);
      ctx.scale(1, 0.5);
      drawIngredient(ctx, id, 0, 0, 120);
      ctx.restore();
    });
    if (state.plate.length === 0) {
      text(ctx, 'Piring kosong — pilih bahan di bawah', plate.x, plate.y + 22, 14, PALETTE.muted, 600, 'center');
    }
    // Serve flash.
    if (state.flash > 0) {
      ctx.fillStyle = `rgba(120, 220, 90, ${state.flash * 0.5})`;
      ctx.beginPath();
      ctx.ellipse(plate.x, plate.y + 18, plate.radius + 14, (plate.radius + 14) * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Steam.
    for (const puff of state.steam) {
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, puff.alpha)})`;
      ctx.beginPath();
      ctx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    // Floating popups.
    for (const pop of state.pops) {
      ctx.globalAlpha = Math.max(0, Math.min(1, pop.life));
      text(ctx, pop.text, pop.x, pop.y, 24, pop.color, 800, 'center');
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawBins(state) {
    for (const rect of binRects()) {
      const ing = ING_BY_ID[rect.id];
      const inPlate = state.plate.includes(rect.id);
      ctx.fillStyle = inPlate ? '#ffe9b0' : '#fff6e0';
      roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 12);
      ctx.fill();
      ctx.strokeStyle = inPlate ? '#f0a500' : '#d9c9a8';
      ctx.lineWidth = inPlate ? 3 : 1.5;
      roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 12);
      ctx.stroke();
      drawIngredient(ctx, rect.id, rect.x + rect.width / 2, rect.y + 44, 56);
      text(ctx, ing.name, rect.x + rect.width / 2, rect.y + 88, 15, PALETTE.text, 700, 'center');
      // Key cap.
      ctx.fillStyle = '#3d2c1e';
      roundRect(ctx, rect.x + 8, rect.y + 8, 24, 24, 6);
      ctx.fill();
      text(ctx, ing.key, rect.x + 20, rect.y + 25, 14, '#fff6e0', 800, 'center');
    }
    // Serve + clear buttons. Green only when the plate is a complete recipe
    // for a ticket on the board; a wrong plate stays grey until cleared.
    const { serve, clear } = LAYOUT;
    const canServe =
      state.plate.length > 0 &&
      state.tickets.some(
        (ticket) =>
          ticket.recipe.length === state.plate.length &&
          ticket.recipe.every((id, index) => id === state.plate[index]),
      );
    const glow = state.serveGlow > 0 ? 0.6 + 0.4 * Math.sin(Date.now() / 130) : 0;
    ctx.save();
    if (glow > 0) {
      ctx.shadowColor = 'rgba(78,155,46,0.9)';
      ctx.shadowBlur = 18 * glow;
    }
    ctx.fillStyle = canServe ? '#4e9b2e' : '#9db38a';
    roundRect(ctx, serve.x, serve.y, serve.width, serve.height, 12);
    ctx.fill();
    ctx.restore();
    text(ctx, 'SAJIKAN ⏎', serve.x + serve.width / 2, serve.y + 34, 20, '#ffffff', 800, 'center');
    ctx.fillStyle = '#efe6d2';
    roundRect(ctx, clear.x, clear.y, clear.width, clear.height, 12);
    ctx.fill();
    ctx.strokeStyle = '#c9b896';
    ctx.lineWidth = 1.5;
    roundRect(ctx, clear.x, clear.y, clear.width, clear.height, 12);
    ctx.stroke();
    text(ctx, 'Bersihkan ⌫', clear.x + clear.width / 2, clear.y + 34, 16, '#6b5a41', 700, 'center');
  }

  function drawTopBar(state) {
    ctx.fillStyle = PALETTE.board;
    ctx.fillRect(0, 0, FIELD.width, LAYOUT.topBar.height);
    ctx.fillStyle = PALETTE.boardRail;
    ctx.fillRect(0, LAYOUT.topBar.height - 6, FIELD.width, 6);
    // Logo + shift timer.
    text(ctx, 'DAPUR KILAT', 16, 34, 30, '#ffd94a', 900);
    text(ctx, 'Warung cepat saji', 16, 56, 13, '#d9c9a8', 600);
    const timeRatio = Math.max(0, state.timeLeft / 150);
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = Math.floor(state.timeLeft % 60);
    text(ctx, `SHIFT ${minutes}:${String(seconds).padStart(2, '0')}`, 16, 88, 16, timeRatio < 0.15 ? '#ff7a6b' : '#fff6e0', 800);
    ctx.fillStyle = '#5a4230';
    roundRect(ctx, 150, 76, 150, 8, 4);
    ctx.fill();
    ctx.fillStyle = timeRatio < 0.15 ? '#e23b2e' : '#4e9b2e';
    roundRect(ctx, 150, 76, 150 * timeRatio, 8, 4);
    ctx.fill();
    // Order board.
    text(ctx, 'PESANAN', 330, 30, 12, '#d9c9a8', 800);
    if (state.tickets.length === 0) {
      text(ctx, 'Belum ada pesanan — siap-siap!', 340, 62, 15, '#d9c9a8', 600);
    }
    state.tickets.forEach((ticket, index) => drawTicket(ticket, index));
    // Score, coins, hearts, level.
    const right = FIELD.width - 16;
    text(ctx, `SKOR ${state.score.toLocaleString('en-US')}`, right, 30, 20, '#fff6e0', 800, 'right');
    drawCoin(ctx, right - 118, 52, 12);
    text(ctx, `${state.coins}`, right - 100, 57, 18, '#ffd94a', 800);
    for (let i = 0; i < 3; i += 1) drawHeart(ctx, right - 56 + i * 26, 52, 20, i < state.hearts);
    text(ctx, `Level ${state.level}${state.combo >= 2 ? `  •  KOMBO x${state.combo}` : ''}`, right, 88, 15, state.combo >= 2 ? '#ff9a3d' : '#d9c9a8', 800, 'right');
  }

  function drawTitle(state, best) {
    ctx.fillStyle = 'rgba(30, 20, 10, 0.55)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    text(ctx, 'DAPUR KILAT', FIELD.width / 2, 210, 84, '#ffd94a', 900, 'center');
    text(ctx, 'Masak cepat, sajikan tepat!', FIELD.width / 2, 252, 26, '#fff6e0', 600, 'center');
    const lines = [
      'Pesanan muncul di papan atas — rakit hidangannya di piring.',
      'Klik bahan atau tekan tombol 1–7, lalu SAJIKAN (Spasi) saat resepnya cocok.',
      'Pesanan yang kedaluwarsa bikin pelanggan pergi. Tiga kali gagal, shift berakhir!',
    ];
    lines.forEach((line, i) => text(ctx, line, FIELD.width / 2, 316 + i * 30, 18, '#fff6e0', 600, 'center'));
    if (best > 0) text(ctx, `Skor terbaik: ${best.toLocaleString('en-US')}`, FIELD.width / 2, 430, 20, '#ffd94a', 800, 'center');
    const pulse = 0.65 + 0.35 * Math.sin(Date.now() / 280);
    ctx.globalAlpha = pulse;
    text(ctx, 'Tekan SPASI atau klik untuk mulai', FIELD.width / 2, 500, 24, '#ffffff', 800, 'center');
    ctx.globalAlpha = 1;
    text(ctx, 'P jeda  •  M suara  •  ⌫ bersihkan piring', FIELD.width / 2, 540, 15, '#d9c9a8', 600, 'center');
  }

  function drawOver(state, best) {
    ctx.fillStyle = 'rgba(30, 20, 10, 0.6)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = PALETTE.cream;
    roundRect(ctx, 380, 150, 520, 400, 18);
    ctx.fill();
    ctx.strokeStyle = '#d9c9a8';
    ctx.lineWidth = 2;
    roundRect(ctx, 380, 150, 520, 400, 18);
    ctx.stroke();
    text(ctx, state.won ? 'SHIFT SELESAI!' : 'DAPUR TUTUP!', 640, 220, 44, state.won ? '#4e9b2e' : '#e23b2e', 900, 'center');
    text(ctx, state.won ? 'Semua pesanan terlayani sampai shift berakhir.' : 'Tiga pelanggan pergi — shift berakhir lebih awal.', 640, 256, 16, PALETTE.muted, 600, 'center');
    const rows = [
      ['Skor akhir', state.score.toLocaleString('en-US')],
      ['Koin didapat', `${state.coins}`],
      ['Hidangan disajikan', `${state.served}`],
      ['Pesanan kedaluwarsa', `${state.expired}`],
      ['Kombo terbaik', `x${state.bestCombo}`],
      ['Skor terbaik', best.toLocaleString('en-US')],
    ];
    rows.forEach(([label, value], i) => {
      const y = 300 + i * 32;
      text(ctx, label, 430, y, 18, PALETTE.text, 600);
      text(ctx, value, 830, y, 18, PALETTE.text, 800, 'right');
    });
    const pulse = 0.65 + 0.35 * Math.sin(Date.now() / 280);
    ctx.globalAlpha = pulse;
    text(ctx, 'Tekan R atau klik untuk main lagi', 640, 516, 20, PALETTE.text, 800, 'center');
    ctx.globalAlpha = 1;
  }

  function drawPaused() {
    ctx.fillStyle = 'rgba(30, 20, 10, 0.55)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    text(ctx, 'JEDA', FIELD.width / 2, 340, 64, '#fff6e0', 900, 'center');
    text(ctx, 'Tekan P atau klik untuk lanjut', FIELD.width / 2, 388, 20, '#d9c9a8', 600, 'center');
  }

  function draw(state, screen, best) {
    resize();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#241a10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    ctx.save();
    if (state.shake > 0 && screen === SCREEN_PLAY) {
      ctx.translate((Math.random() - 0.5) * state.shake * 14, (Math.random() - 0.5) * state.shake * 10);
    }
    drawKitchen(state);
    drawTopBar(state);
    drawPlate(state);
    drawBins(state);
    if (screen === SCREEN_TITLE) drawTitle(state, best);
    else if (screen === SCREEN_PAUSED) drawPaused();
    else if (screen === SCREEN_OVER) drawOver(state, best);
    ctx.restore();
  }

  return { draw, toLogical, pickAt, resize };
}
