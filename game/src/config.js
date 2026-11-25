// Dapur Kilat — every tuning number, colour and layout constant in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the
// window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** A shift lasts this long; when it runs out the shift is complete. */
export const SHIFT_SECONDS = 150;

export const HEARTS = 3;

/** Level rises every LEVEL_SECONDS; spawn and ticket pace stop growing at LEVEL_MAX. */
export const LEVEL = { seconds: 30, max: 6 };

/** Seconds between new orders at level 1, shrinking per level. */
export const SPAWN = { base: 10, perLevel: 1.1, min: 4.5 };

/** How long an order ticket lives, in seconds, at level 1, shrinking per level. */
export const TICKET = { base: 34, perLevel: 2, min: 19 };

/** First order arrives this many seconds after the shift starts. */
export const FIRST_ORDER_IN = 4;

/** At most this many tickets on the board at once. */
export const MAX_TICKETS = 3;

/** Coins per served dish by recipe length, times the combo multiplier. */
export const COINS = { base: 10, perIngredient: 5 };

/** Score is coins times this, plus a flat serve bonus. */
export const SCORE = { serveBonus: 25, perCoin: 10 };

/** Combo grows per correct serve in a row and resets on an expired order. */
export const COMBO = { max: 5, step: 1 };

/** Ingredients on the counter, in bin order. Keys 1..7. */
export const INGREDIENTS = [
  { id: 'roti', name: 'Roti', key: '1', top: '#f0c169', bottom: '#c98f3d', accent: '#8a5a22' },
  { id: 'daging', name: 'Daging', key: '2', top: '#8a5136', bottom: '#5f3520', accent: '#3f2113' },
  { id: 'telur', name: 'Telur', key: '3', top: '#fff8e7', bottom: '#f2e3c2', accent: '#f2b705' },
  { id: 'keju', name: 'Keju', key: '4', top: '#ffd94a', bottom: '#f0a500', accent: '#c77f00' },
  { id: 'selada', name: 'Selada', key: '5', top: '#8fd45e', bottom: '#4e9b2e', accent: '#2f6b1a' },
  { id: 'tomat', name: 'Tomat', key: '6', top: '#ef4b3a', bottom: '#c22a1e', accent: '#7d1608' },
  { id: 'saus', name: 'Saus', key: '7', top: '#d43d2a', bottom: '#a11f16', accent: '#ff8a70' },
];

export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((ing) => [ing.id, ing]));

/** The menu: dish name, recipe (ingredient ids in order), and a short blurb. */
export const DISHES = [
  { name: 'Burger Kilat', recipe: ['roti', 'daging', 'keju', 'selada'], blurb: 'Klasik cepat saji' },
  { name: 'Sandwich Telur', recipe: ['roti', 'telur', 'tomat', 'selada'], blurb: 'Ringan dan segar' },
  { name: 'Omelet Keju', recipe: ['telur', 'keju', 'tomat'], blurb: 'Leleh di mulut' },
  { name: 'Salad Segar', recipe: ['selada', 'tomat', 'saus'], blurb: 'Sehat kilat' },
  { name: 'Double Kilat', recipe: ['roti', 'daging', 'daging', 'keju', 'saus'], blurb: 'Porsi jumbo' },
  { name: 'Roti Telur Saus', recipe: ['roti', 'telur', 'saus'], blurb: 'Sarapan juara' },
];

/** Layout of the kitchen, in logical pixels. */
export const LAYOUT = {
  topBar: { y: 0, height: 104 },
  board: { x: 330, y: 10, width: 620, ticketWidth: 198, ticketHeight: 84, gap: 12 },
  hud: { left: 16, right: 16 },
  counter: { y: 452, height: 118 },
  plate: { x: 640, y: 330, radius: 96 },
  bins: { y: 580, height: 112, gap: 10, margin: 16 },
  serve: { x: 1096, y: 580, width: 168, height: 52 },
  clear: { x: 1096, y: 640, width: 168, height: 52 },
};

export const PALETTE = {
  wall: '#f7e8c9',
  wallTile: '#efd9ae',
  wallDark: '#e3c892',
  counterTop: '#b07a45',
  counterFront: '#8a5a2b',
  counterEdge: '#6e451f',
  board: '#3d2c1e',
  boardRail: '#5a4230',
  ticket: '#fff8e7',
  ticketInk: '#3a2a18',
  ticketUrgent: '#e23b2e',
  plate: '#fdfdf8',
  plateRim: '#d9d4c5',
  text: '#2e2114',
  muted: '#8b7a5f',
  cream: '#fff6e0',
  gold: '#f2b705',
  green: '#4e9b2e',
  red: '#e23b2e',
  blue: '#3a7bd5',
  shadow: 'rgba(46, 33, 20, 0.25)',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'dapur-kilat.best';
