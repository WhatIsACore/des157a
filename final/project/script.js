'use strict';

// useful shortcuts
const $ = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

// sounds
const sounds = {};
['flutey.mp3', 'click.mp3', 'hit.mp3', 'meow.mp3', 'hiss.mp3', 'glitch.mp3'].forEach(x => sounds[x] = new Audio('sounds/' + x));

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

    // charge everyone's energy meters until one fills
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

    // execute actions and reset energy meters
    if (battlePhase === 'action') {
      actingCharacter = actionQueue.pop();
      if (actingCharacter == null) return;
      if (actingCharacter.health <= 0) return;  // already dead cant move

      tutorials.actionBar();

      if (actingCharacter.isPC) {
        await getAction(actingCharacter);
      } else {
        await enemyTurn(actingCharacter);
      }
      await timeout(600);
      actingCharacter.energy = 0;

      // kill anyone that died
      await Promise.all(everyone.map(async x => {
        if (x.health <= 0) await x.die()
      }));

      // all enemies defeated or captured? to shop
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
    setScreen('battle');  // todo: make shop for upgrades between waves
  },
  step: async () => {}
};

let skillsListEl = $('#skills_list')
async function getAction(character) {
  character.el.classList.add('active');

  // display the skills available to acting character
  $('.actions').style.display = 'block';
  $('#acting_name').innerText = character.name;
  skillsListEl.innerHTML = '';
  for (let i of character.skills) {
    const skill = skills[i];
    const usable = skill.targeting ? skill.validTargets(actingCharacter).length > 0 : true;
    const desc = skill.description.replace(/ (?=[^ ]*$)/i, "&nbsp;");  // regex non-break the last space to avoid orphan words
    skillsListEl.innerHTML += `
      <div class="action-btn skill-btn${usable ? '' : ' disabled'}" data-id="${i}" data-description="${desc}">${skill.name}</div>
    `;
  }

  if (
    actingCharacter.id === 'cat' &&
    actingCharacter.getEnemies().find(x => x.health / x.maxHealth < 0.35) != null
  ) tutorials.capture();

  $$('.skill-btn').forEach(x => x.addEventListener('click', useSkill));

  await new Promise(resolve => resolveInput = resolve);  // wait for skill to be used before continuing
}

async function useSkill(e) {
  const skill = typeof(e) === "string" ? skills[e] : skills[e.currentTarget.dataset.id];
  if (skill.targeting && skill.validTargets(actingCharacter).length < 0) return;

  sounds['click.mp3'].play();

  // handle targeting options
  if (skill.targeting) {
    const enemy = await getTarget(skill.validTargets(actingCharacter));
    sounds['click.mp3'].play();
    hideSkillMenu();
    await skill.execute(actingCharacter, enemy);
  } else {
    hideSkillMenu();
    await skill.execute(actingCharacter);
  }

  resolveInput();
}

function hideSkillMenu() {
  actingCharacter.el.classList.remove('active');
  $('.actions').style.display = 'none';
}

async function getTarget(validTargets) {
  // display the relevant target selectors
  $('.actions-list').style.display = 'none';
  $('.targeting-message').style.display = 'block';
  validTargets.forEach(x => x.el.querySelector('.target-selector').style.display = 'block');

  const id = await new Promise(resolve => resolveTarget = resolve);

  $('.actions-list').style.display = 'flex';
  $$('.target-selector').forEach(x => x.style.display = 'none');
  $('.targeting-message').style.display = 'none';

  return characters[id];
}

async function enemyTurn(character) {
  // enemies: pick a random move and random valid target
  let validSkills = character.skills.filter(x => {
    if (!skills[x].targeting) return true;
    return skills[x].validTargets(character).length > 0;
  });
  let skill = skills[validSkills[Math.random() * validSkills.length >> 0]];

  await timeout(200);

  if (skill.targeting) {
      let validTargets = skill.validTargets(character);
      let target = validTargets[Math.random() * validTargets.length >> 0];
      await skill.execute(actingCharacter, target);
  } else {
      await skill.execute(actingCharacter);
  }
}

function nextWave() {
  // get the data for the next wave and build the characters involved
  let w = waves[++wave];
  new Character(characterData[w.enemies[0]], 'enemy1', false);
  if (w.enemies.length > 1)
    new Character(characterData[w.enemies[1]], 'enemy2', false);
  if (w.enemies.length > 2)
    new Character(characterData[w.enemies[2]], 'enemy3', false);
  dialogue(`<span class='lore'>${w.intro}</span>`);

  // set the background
  $('.backdrop').style.backgroundImage = `url(images/${w.backdrop}.png)`;
}

let currentScreen;
async function setScreen(screen) {
  $$('.screen').forEach(x => x.className = x.id === 'screen_' + screen ? 'screen active' : 'screen');
  currentScreen = screens[screen];
  await currentScreen.init();
}

const dialogueBox = $('#dialogue');
function dialogue(content) {  // outputs dialogue to the dialogue box
  const text = `<div class="dialogue-line">${content}</div>`;
  dialogueBox.insertAdjacentHTML('afterbegin', text);
}

async function step() {
  await currentScreen.step();
  requestAnimationFrame(step);
}

async function init() {  // initialize everything on form submit (input name)
  const name = $('#cat_name').value;
  if (name.length < 1) return;

  sounds['click.mp3'].play();
  sounds['flutey.mp3'].loop = true;
  sounds['flutey.mp3'].play();  // music
  sounds['meow.mp3'].play();

  new Character(characterData.cat, 'cat', true).name = name;
  await setScreen('battle');
  requestAnimationFrame(step);
}
$('#start').addEventListener('click', init);
$('#cat_name').focus();
$('#cat_name').addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  init();
});
