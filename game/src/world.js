// Dapur Kilat — the simulation: orders, tickets, the plate, the shift timer.
// Pure rules, no drawing and no sound: step() returns an event bitmask and the
// caller (main.js) turns events into sounds and announcements.

import {
  COMBO,
  COINS,
  DISHES,
  FIRST_ORDER_IN,
  HEARTS,
  ING_BY_ID,
  LEVEL,
  MAX_TICKETS,
  SCORE,
  SHIFT_SECONDS,
  SPAWN,
  STEP,
  TICKET,
} from './config.js';
import { pick } from './random.js';

export const EVENT_NONE = 0;
export const EVENT_ORDER = 1 << 0;
export const EVENT_ADD = 1 << 1;
export const EVENT_SERVE = 1 << 2;
export const EVENT_WRONG = 1 << 3;
export const EVENT_EXPIRE = 1 << 4;
export const EVENT_OVER = 1 << 5;
export const EVENT_TICK = 1 << 6;

/** Seconds until the next order at this level. */
function spawnInterval(level) {
  return Math.max(SPAWN.min, SPAWN.base - (level - 1) * SPAWN.perLevel);
}

/** How long a ticket lives at this level. */
function ticketLifetime(level) {
  return Math.max(TICKET.min, TICKET.base - (level - 1) * TICKET.perLevel);
}

export function createWorld(random) {
  let nextTicketId = 1;

  const state = {
    time: 0,
    timeLeft: SHIFT_SECONDS,
    level: 1,
    score: 0,
    coins: 0,
    combo: 0,
    bestCombo: 0,
    hearts: HEARTS,
    tickets: [],
    plate: [],
    spawnIn: FIRST_ORDER_IN,
    served: 0,
    expired: 0,
    wrong: 0,
    over: false,
    won: false,
    flash: 0,
    shake: 0,
    serveGlow: 0,
    steam: [],
    pops: [],
    lastTickSecond: -1,
  };

  function spawnTicket() {
    if (state.tickets.length >= MAX_TICKETS) return false;
    const onBoard = new Set(state.tickets.map((ticket) => ticket.dish));
    const choices = DISHES.filter((dish) => !onBoard.has(dish.name));
    const dish = pick(random, choices.length > 0 ? choices : DISHES);
    const lifetime = ticketLifetime(state.level);
    state.tickets.push({ id: nextTicketId, dish: dish.name, recipe: [...dish.recipe], left: lifetime, total: lifetime });
    nextTicketId += 1;
    return true;
  }

  function ticketForPlate() {
    return state.tickets.find(
      (ticket) =>
        ticket.recipe.length === state.plate.length &&
        ticket.recipe.every((id, index) => id === state.plate[index]),
    );
  }

  /** Is the plate a strict prefix of some ticket's recipe? */
  function plateIsPrefix() {
    if (state.plate.length === 0) return true;
    return state.tickets.some(
      (ticket) =>
        ticket.recipe.length > state.plate.length &&
        ticket.recipe.slice(0, state.plate.length).every((id, index) => id === state.plate[index]),
    );
  }

  function addIngredient(id) {
    if (state.over || !ING_BY_ID[id]) return EVENT_NONE;
    state.plate.push(id);
    state.serveGlow = 0;
    if (ticketForPlate()) state.serveGlow = 1;
    return EVENT_ADD;
  }

  function serve() {
    if (state.over || state.plate.length === 0) return EVENT_NONE;
    const ticket = ticketForPlate();
    if (!ticket) {
      state.wrong += 1;
      state.shake = 0.45;
      return EVENT_WRONG;
    }
    state.tickets = state.tickets.filter((other) => other.id !== ticket.id);
    state.combo = Math.min(state.combo + COMBO.step, COMBO.max);
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const earned = (COINS.base + COINS.perIngredient * ticket.recipe.length) * state.combo;
    state.coins += earned;
    state.score += SCORE.serveBonus + earned * SCORE.perCoin;
    state.served += 1;
    state.plate = [];
    state.flash = 0.5;
    state.pops.push({ x: 640, y: 300, text: `+${earned} koin`, life: 1.1, color: '#f2b705' });
    if (state.combo >= 2) {
      state.pops.push({ x: 640, y: 340, text: `KOMBO x${state.combo}!`, life: 1.1, color: '#ff7a1a' });
    }
    return EVENT_SERVE;
  }

  function clearPlate() {
    if (state.over) return EVENT_NONE;
    state.plate = [];
    state.serveGlow = 0;
    return EVENT_NONE;
  }

  function spawnSteam() {
    if (state.steam.length > 26) return;
    state.steam.push({
      x: 560 + random() * 160,
      y: 330 + random() * 30,
      radius: 5 + random() * 9,
      rise: 22 + random() * 18,
      drift: (random() - 0.5) * 12,
      alpha: 0.16 + random() * 0.12,
      life: 1,
    });
  }

  function reset(demo = false) {
    nextTicketId = 1;
    state.time = 0;
    state.timeLeft = SHIFT_SECONDS;
    state.level = 1;
    state.score = 0;
    state.coins = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.hearts = HEARTS;
    state.tickets = [];
    state.plate = [];
    state.spawnIn = FIRST_ORDER_IN;
    state.served = 0;
    state.expired = 0;
    state.wrong = 0;
    state.over = false;
    state.won = false;
    state.flash = 0;
    state.shake = 0;
    state.serveGlow = 0;
    state.steam = [];
    state.pops = [];
    state.lastTickSecond = -1;
    if (demo) {
      // The title screen's kitchen: two tickets waiting, a dish half built.
      const first = DISHES[0];
      const second = DISHES[2];
      state.tickets.push(
        { id: nextTicketId, dish: first.name, recipe: [...first.recipe], left: 26, total: 34 },
        { id: nextTicketId + 1, dish: second.name, recipe: [...second.recipe], left: 18, total: 34 },
      );
      nextTicketId += 2;
      state.plate = [first.recipe[0], first.recipe[1]];
      state.score = 120;
      state.coins = 40;
    }
  }

  /** Ambient animation only (title screen): steam drifts, nothing expires. */
  function tickAmbient(dt) {
    if (Math.random() < dt * 6) spawnSteam();
    for (const puff of state.steam) {
      puff.y -= puff.rise * dt;
      puff.x += puff.drift * dt;
      puff.life -= dt * 0.45;
      puff.alpha = Math.max(0, puff.alpha - dt * 0.1);
    }
    state.steam = state.steam.filter((puff) => puff.life > 0 && puff.y > 120);
  }

  /**
   * Advance the world one fixed step. `action` is { add, serve, clear } from the
   * input (at most one add per step). Returns an event bitmask.
   */
  function step(dt, action = {}) {
    if (state.over) {
      tickAmbient(dt);
      return EVENT_NONE;
    }
    let events = EVENT_NONE;
    state.time += dt;
    state.timeLeft -= dt;
    state.level = Math.min(LEVEL.max, 1 + Math.floor(state.time / LEVEL.seconds));
    if (state.flash > 0) state.flash -= dt;
    if (state.shake > 0) state.shake -= dt;
    if (state.serveGlow > 0) state.serveGlow -= dt * 0.4;

    if (action.add) events |= addIngredient(action.add);
    if (action.clear) events |= clearPlate();
    if (action.serve) events |= serve();

    // Orders arrive on a schedule while the board has room.
    state.spawnIn -= dt;
    if (state.spawnIn <= 0) {
      if (spawnTicket()) events |= EVENT_ORDER;
      state.spawnIn = spawnInterval(state.level);
    }

    // Tickets count down; an expired one costs a heart and breaks the combo.
    for (const ticket of state.tickets) {
      ticket.left -= dt;
      const whole = Math.ceil(ticket.left);
      if (ticket.left <= 5 && ticket.left > 0 && whole !== state.lastTickSecond) {
        state.lastTickSecond = whole;
        events |= EVENT_TICK;
      }
    }
    const expired = state.tickets.filter((ticket) => ticket.left <= 0);
    if (expired.length > 0) {
      state.tickets = state.tickets.filter((ticket) => ticket.left > 0);
      state.hearts -= expired.length;
      state.combo = 0;
      state.expired += expired.length;
      events |= EVENT_EXPIRE;
      if (state.hearts <= 0) {
        state.hearts = 0;
        state.over = true;
        state.won = false;
        events |= EVENT_OVER;
      }
    }

    // A plate that matches no recipe prefix is a dead end: mark it by shaking.
    if (state.plate.length > 0 && !plateIsPrefix() && !ticketForPlate()) {
      state.shake = Math.max(state.shake, 0.15);
    }

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.over = true;
      state.won = true;
      events |= EVENT_OVER;
    }

    tickAmbient(dt);
    for (const pop of state.pops) {
      pop.y -= 34 * dt;
      pop.life -= dt;
    }
    state.pops = state.pops.filter((pop) => pop.life > 0);
    return events;
  }

  return { state, reset, step, tickAmbient, spawnTicket, ticketForPlate, plateIsPrefix };
}
