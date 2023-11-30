'use strict';

// useful shortcuts
const $ = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

let resolveInput, resolveTarget;
let money = 100;
let battlePhase = 'none';
let wave = 0;
let actionQueue = [];
let actingCharacter;

const screens = {};
screens.battle = {
  init: async () => {
    characters.cat.buildHTML();
    battlePhase = 'intro';
    nextWave();
  },
  step: async () => {
    let everyone = Object.values(characters).filter(x => x != null);

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
      if (actingCharacter.health <= 0) return;  // already dead cant move

      if (actingCharacter.isPC) {
        await getAction(actingCharacter);
      } else {
        await enemyTurn(actingCharacter);
      }
      await timeout(600);
      actingCharacter.energy = 0;

      await Promise.all(everyone.map(async x => {
        if (x.health <= 0) await x.die()
      }));

      // everyone is defeated or captured
      if (characters.enemy1 == null && characters.enemy2 == null && characters.enemy3 == null)
        return setScreen('shop');

      if (actionQueue.length < 1)
        battlePhase = 'wait';
    }

  }
};

screens.shop = {
  init: async () => {
    await timeout(500);
    setScreen('battle');  // todo: make an actual shop
  },
  step: async () => {}
};

let skillsListEl = $('#skills_list')
async function getAction(character) {
  character.el.classList.add('active');

  $('.actions').style.display = 'block';
  $('#acting_name').innerText = character.name;
  skillsListEl.innerHTML = '';
  for (let i of character.skills) {
    const skill = skills[i];
    const usable = skill.isUsable != null ? skill.isUsable(actingCharacter) : true;
    skillsListEl.innerHTML += `
      <div class="action-btn skill-btn${usable ? '' : ' disabled'}" data-id="${i}" data-description="${skill.description}">${skill.name}</div>
    `;
  }

  $$('.skill-btn').forEach(x => x.addEventListener('click', useSkill));

  await new Promise(resolve => resolveInput = resolve);
}

async function useSkill(e) {
  const skill = skills[e.currentTarget.dataset.id];
  if (skill.isUsable != null && !skill.isUsable(actingCharacter)) return;

  switch (skill.targeting) {
    case 'one enemy':
      const enemy = await getTarget();
      hideSkillMenu();
      await skill.execute(actingCharacter, enemy);
      break;
    default:
      hideSkillMenu();
      await skill.execute(actingCharacter);
  }

  resolveInput();
}

function hideSkillMenu() {
  actingCharacter.el.classList.remove('active');
  $('.actions').style.display = 'none';
}

async function getTarget() {
  $('.actions-list').style.display = 'none';
  $('.targeting-message').style.display = 'block';
  $$('.enemy .target-selector').forEach(x => x.style.display = 'block');

  const id = await new Promise(resolve => resolveTarget = resolve);

  $('.actions-list').style.display = 'flex';
  $$('.target-selector').forEach(x => x.style.display = 'none');
  $('.targeting-message').style.display = 'none';

  return characters[id];
}

async function enemyTurn(character) {
  let skill = character.skills[Math.random() * character.skills.length >> 0];
  skill = skills[skill];

  await timeout(200);

  switch (skill.targeting) {
    case 'one enemy':
      let targets = [characters.cat, characters.minion1, characters.minion2].filter(x => x != null);
      let target = targets[Math.random() * targets.length >> 0];
      await skill.execute(actingCharacter, target);
      break;
    default:
      await skill.execute(actingCharacter);
  }
}

function nextWave() {
  let w = waves[++wave];
  new Character(characterData[w.enemies[0]], 'enemy1', false);
  if (w.enemies.length > 1)
    new Character(characterData[w.enemies[1]], 'enemy2', false);
  if (w.enemies.length > 2)
    new Character(characterData[w.enemies[2]], 'enemy3', false);
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
  characters.cat = new Character(characterData.cat, 'cat', true)
  await setScreen('battle');
  requestAnimationFrame(step);
}
init();
