// All sound is synthesised with WebAudio — no audio files, no network.
// The context is created lazily on the first user gesture (browsers require it),
// every call is guarded, and M toggles mute. Headless screenshot runs never
// gesture, so they stay silent.

let context = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ensureContext() {
  if (muted) return null;
  try {
    if (!context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

/** A short tone: frequency in Hz, length in seconds, wave shape, volume 0..1. */
function tone(frequency, seconds, type = 'sine', volume = 0.12, when = 0) {
  const ctx = ensureContext();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + when;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + seconds);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + seconds + 0.05);
  } catch {
    // Sound is garnish: never let it break the game.
  }
}

export const sfx = {
  /** Ingredient dropped on the plate. */
  add() {
    tone(520, 0.08, 'triangle', 0.1);
    tone(780, 0.06, 'sine', 0.06, 0.03);
  },
  /** Dish served correctly: a little two-note chime. */
  serve() {
    tone(660, 0.1, 'sine', 0.12);
    tone(880, 0.14, 'sine', 0.12, 0.09);
    tone(1320, 0.16, 'sine', 0.07, 0.18);
  },
  /** Wrong serve: a low buzz. */
  wrong() {
    tone(140, 0.22, 'sawtooth', 0.09);
    tone(110, 0.22, 'sawtooth', 0.07, 0.05);
  },
  /** An order expired: a falling tone. */
  expire() {
    tone(420, 0.16, 'triangle', 0.1);
    tone(260, 0.24, 'triangle', 0.1, 0.12);
  },
  /** Last seconds of a ticket: a tick. */
  tick() {
    tone(980, 0.05, 'square', 0.05);
  },
  /** New order arrived on the board. */
  order() {
    tone(740, 0.07, 'sine', 0.08);
    tone(990, 0.07, 'sine', 0.07, 0.06);
  },
  /** Button press / game start. */
  click() {
    tone(600, 0.06, 'triangle', 0.08);
  },
};
