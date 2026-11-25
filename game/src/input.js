// Keyboard and mouse/touch input. Keys 1-7 (or a click on a bin) queue an
// ingredient; Space serves (or starts on the title / game-over screen);
// Backspace clears the plate; P pauses; M mutes; R restarts after game over.

import { INGREDIENTS } from './config.js';

export const ACTION_CONFIRM = 1 << 0;
export const ACTION_PAUSE = 1 << 1;
export const ACTION_RESTART = 1 << 2;
export const ACTION_MUTE = 1 << 3;
export const ACTION_CLEAR = 1 << 4;

export function createInput(canvas, pickAt, toLogical) {
  let actions = 0;
  const adds = [];

  function queueAdd(id) {
    if (INGREDIENTS.some((ing) => ing.id === id)) adds.push(id);
  }

  function onKeyDown(event) {
    if (event.repeat) return;
    const key = event.key;
    if (key >= '1' && key <= '7') {
      const ing = INGREDIENTS[Number(key) - 1];
      if (ing) queueAdd(ing.id);
      event.preventDefault();
      return;
    }
    if (key === ' ' || key === 'Enter') {
      actions |= ACTION_CONFIRM;
      event.preventDefault();
      return;
    }
    if (key === 'Backspace' || key === 'c' || key === 'C') {
      actions |= ACTION_CLEAR;
      event.preventDefault();
      return;
    }
    if (key === 'p' || key === 'P' || key === 'Escape') actions |= ACTION_PAUSE;
    else if (key === 'm' || key === 'M') actions |= ACTION_MUTE;
    else if (key === 'r' || key === 'R') actions |= ACTION_RESTART;
  }

  function onPointerDown(event) {
    const point = toLogical(event.clientX, event.clientY);
    const hit = pickAt(point.x, point.y);
    if (!hit) {
      actions |= ACTION_CONFIRM;
      return;
    }
    if (hit.type === 'ingredient') queueAdd(hit.id);
    else if (hit.type === 'serve') actions |= ACTION_CONFIRM;
    else if (hit.type === 'clear') actions |= ACTION_CLEAR;
  }

  window.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('pointerdown', onPointerDown);

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    /** Ingredient ids queued since the last call, in order. */
    takeAdds() {
      return adds.splice(0, adds.length);
    },
  };
}
