'use strict';

const $ = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);

let money = 100;
let cat = new Character(characters.cat, $('#char_cat'));
let minion1, minion2;
let enemy1, enemy2, enemy3;
let battlePhase = 'none';
let wave = 0;
const waves = {
  1: ['max', 'ashwin', 'sabrina']
}

const screens = {};
screens.battle = {
  init: async () => {
    cat.buildHTML();
    battlePhase = 'intro';
    nextWave();
  },
  step: async () => {
    cat.updateHTML();
    if (enemy1) enemy1.updateHTML();
    if (enemy2) enemy2.updateHTML();
    if (enemy3) enemy3.updateHTML();

    cat.energy++;
    if (enemy1) enemy1.energy++;
    if (enemy2) enemy2.energy++;
    if (enemy3) enemy3.energy++;

    if (battlePhase === 'intro') {
    }

  }
}

function nextWave() {
  let w = waves[++wave];
  enemy1 = new Character(characters[w[0]], $('#char_enemy1'));
  enemy1.buildHTML();
  if (w.length > 1) {
    enemy2 = new Character(characters[w[1]], $('#char_enemy2'));
    enemy2.buildHTML();
  }
  if (w.length > 2) {
    enemy3 = new Character(characters[w[2]], $('#char_enemy3'));
    enemy3.buildHTML();
  }
}

let currentScreen;
async function setScreen(screen) {
  $$('.screen').forEach(x => x.className = x.id === 'screen_' + screen ? 'screen active' : 'screen');
  currentScreen = screens[screen];
  await currentScreen.init();
}

async function step() {
  await currentScreen.step();
  requestAnimationFrame(step);
}

async function init() {
  await setScreen('battle');
  requestAnimationFrame(step);
}
init();
