'use strict';

// useful shortcuts
const $ = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

let resolveInput, resolveTarget;
let money = 100;
let cat = new Character(characters.cat, $('#char_cat'), true);
let minion1, minion2;
let enemy1, enemy2, enemy3;
let battlePhase = 'none';
let wave = 0;
const waves = {
  1: {
    intro: 'three clumsy hoodlums appear in front of you!',
    enemies: ['max', 'ashwin', 'sabrina']
  }
}
let actionQueue = [];
let actingCharacter;

const screens = {};
screens.battle = {
  init: async () => {
    cat.buildHTML();
    battlePhase = 'intro';
    nextWave();
  },
  step: async () => {
    let everyone = [cat, minion1, minion2, enemy1, enemy2, enemy3].filter(x => x != null);

    if (battlePhase === 'intro') {
      // TODO: add intro
      battlePhase = 'wait';
    }

    if (battlePhase === 'wait') {
      everyone.forEach(x => {
        x.energy++;
        x.updateHTML();
        if (x.energy > x.actionEnergy()) actionQueue.push(x);
      });

      actionQueue.sort((a, b) => a.energy - b.energy);

      if (actionQueue.length > 0)
        battlePhase = 'action';
    }

    if (battlePhase === 'action') {
      actingCharacter = actionQueue.pop();
      if (actingCharacter.isPC) {
        await getAction(actingCharacter);
      } else {
        await enemyTurn(actingCharacter);
      }
      actingCharacter.energy = 0;
      if (actionQueue.length < 1)
        battlePhase = 'wait';
    }

  }
}

let skillsListEl = $('#skills_list')
async function getAction(character) {
  character.el.classList.add('active');

  $('.actions').style.display = 'block';
  $('#acting_name').innerText = character.name;
  skillsListEl.innerHTML = '';
  for (let skill of character.skills)
    skillsListEl.innerHTML += `<div class="action-btn skill-btn" data-id="${skill}">${skills[skill].name}</div>`;
  $$('.skill-btn').forEach(x => x.addEventListener('click', useSkill));

  await new Promise(resolve => resolveInput = resolve);
  character.el.classList.remove('active');
  $('.actions').style.display = 'none';
}
function useSkill(e) {
  let skill = skills[e.currentTarget.dataset.id];
  dialogue(`${actingCharacter.name} used ${skill.name}!`);
  resolveInput();
}

async function enemyTurn(character) {
  await timeout(500);
  dialogue(`${character.name} used a move!`);
}

function nextWave() {
  let w = waves[++wave];
  enemy1 = new Character(characters[w.enemies[0]], $('#char_enemy1'), false);
  enemy1.buildHTML();
  if (w.enemies.length > 1) {
    enemy2 = new Character(characters[w.enemies[1]], $('#char_enemy2'), false);
    enemy2.buildHTML();
  }
  if (w.enemies.length > 2) {
    enemy3 = new Character(characters[w.enemies[2]], $('#char_enemy3'), false);
    enemy3.buildHTML();
  }
  dialogue(w.intro);
}

let currentScreen;
async function setScreen(screen) {
  $$('.screen').forEach(x => x.className = x.id === 'screen_' + screen ? 'screen active' : 'screen');
  currentScreen = screens[screen];
  await currentScreen.init();
}

const dialogueBox = $('#dialogue');
function dialogue(content) {
  const text = `<div class="dialogue-line">${content}</div>`;
  dialogueBox.insertAdjacentHTML('afterbegin', text);
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
