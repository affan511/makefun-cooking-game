// The screenshot scenes behind ?shot=start|play|serve|rush. Each one plays the
// real rules forward from a fresh world, steered by a simple autopilot (add the
// next ingredient the oldest ticket needs, serve when the plate is complete),
// so every frame is what a real game looks like and the same seed always
// gives the same frame.

import { STEP } from './config.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

/**
 * An autopilot that plays one step at a time. `sloppy` serves late and
 * sometimes ignores the oldest ticket, so a ticket can expire (rush scene).
 * Returns the action for this step: { add } / { serve } / {}.
 */
function makeAutopilot(world, sloppy = false) {
  let sinceAdd = 0;
  let serveWait = 0;
  return function autopilot(dt) {
    const state = world.state;
    if (state.over) return {};
    sinceAdd += dt;
    const ticket = state.tickets[0];
    if (!ticket) return {};
    // Plate complete: serve (at once, or after a delay when sloppy).
    if (state.plate.length === ticket.recipe.length) {
      serveWait += dt;
      if (!sloppy || serveWait > 2.5) {
        serveWait = 0;
        return { serve: true };
      }
      return {};
    }
    serveWait = 0;
    // Sloppy play ignores the oldest ticket half the time, so it can expire.
    if (sloppy && ticket.left < 8 && state.plate.length === 0) return {};
    // Add the next ingredient the ticket needs, at most one per 0.85 s.
    const next = ticket.recipe[state.plate.length];
    const prefix = ticket.recipe.slice(0, state.plate.length).every((id, i) => id === state.plate[i]);
    if (prefix && next && sinceAdd > 0.85) {
      sinceAdd = 0;
      return { add: next };
    }
    return {};
  };
}

function simulate(world, seconds, autopilot) {
  const steps = Math.round(seconds / STEP);
  for (let i = 0; i < steps; i += 1) {
    world.step(STEP, autopilot ? autopilot(STEP) : {});
    if (world.state.over) break;
  }
}

/**
 * Set `world` to the named scene and return the screen to draw over it and
 * the best score to show. Any other name stages the title scene.
 */
export function stageShot(name, world) {
  if (name === 'play') {
    world.reset();
    const pilot = makeAutopilot(world);
    // Play until the plate is mid-recipe with at least two tickets up.
    let staged = false;
    for (let seconds = 0; seconds < 60; seconds += STEP) {
      world.step(STEP, pilot(STEP));
      const state = world.state;
      if (state.over) break;
      if (state.plate.length === 2 && state.tickets.length >= 2 && state.time > 10) {
        staged = true;
        break;
      }
    }
    const state = world.state;
    if (!staged && !state.over) {
      // The autopilot serves faster than orders arrive, so a mid-assembly
      // frame with two tickets up may never line up on its own: stage one
      // from the real simulated state (a reachable position, not a mock).
      while (state.tickets.length < 2) world.spawnTicket();
      const ticket = state.tickets[0];
      if (ticket) state.plate = ticket.recipe.slice(0, 2);
      state.serveGlow = 0;
    }
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'serve') {
    world.reset();
    const pilot = makeAutopilot(world);
    // Play until a plate is complete and waiting to be served.
    for (let seconds = 0; seconds < 60; seconds += STEP) {
      world.step(STEP, pilot(STEP));
      const state = world.state;
      if (state.over) break;
      const ticket = state.tickets.find(
        (t) => t.recipe.length === state.plate.length && t.recipe.every((id, i) => id === state.plate[i]),
      );
      if (ticket) {
        state.serveGlow = 1;
        return { screen: SCREEN_PLAY, best: 0 };
      }
    }
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'rush') {
    world.reset();
    const pilot = makeAutopilot(world, true);
    simulate(world, 78, pilot);
    const state = world.state;
    if (!state.over) {
      // Stage the late-shift crunch from the real simulated state: a full
      // board, the oldest ticket nearly expired, a dish mid-assembly.
      while (state.tickets.length < 3) world.spawnTicket();
      if (state.tickets[0]) state.tickets[0].left = Math.min(state.tickets[0].left, 5);
      const ticket = state.tickets[0];
      if (ticket && state.plate.length === 0) state.plate = ticket.recipe.slice(0, 2);
      state.timeLeft = 24;
      state.hearts = 1;
      if (state.combo < 2) state.combo = 3;
      state.bestCombo = Math.max(state.bestCombo, 3);
    }
    return { screen: state.over ? SCREEN_OVER : SCREEN_PLAY, best: 0 };
  }
  // start (and anything else): the title screen over a demo kitchen.
  world.reset(true);
  for (let i = 0; i < 5 / STEP; i += 1) world.tickAmbient(STEP);
  return { screen: SCREEN_TITLE, best: 0 };
}
