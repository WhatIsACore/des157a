'use strict';

let characters = {
  cat: null,
  minion1: null,
  minion2: null,
  enemy1: null,
  enemy2: null,
  enemy3: null
}

const Character = function(src, id, isPC) {
  this.isPC = isPC;
  this.name = src.name;
  this.sprite = src.sprite;
  this.maxHealth = src.health;
  this.health = src.health;
  this.speed = src.speed;
  this.energy = 0;
  this.skills = [...src.skills];
  this.assignId(id);
}

// assign id: on creation and on position change (such as on capture)
Character.prototype.assignId = function(id) {
  if (this.id != null) {
    this.el.innerHTML = null;
    delete characters[this.id];
  }
  this.id = id;
  this.el = $('#' + id);
  this.buildHTML();
  characters[id] = this;
  this.updateHTML();
}
Character.prototype.animate = function(effect, ms) {  // play a css animation on this character
  this.el.classList.add(effect);
  setTimeout(() => {this.el.classList.remove(effect)}, ms);
}
Character.prototype.damage = async function(amount) {  // hurt this character
  sounds['hit.mp3'].play();
  this.animate('_damage', 500);
  this.health -= amount;
  this.updateHTML();
}
Character.prototype.heal = function(amount) {  // heal this character
  this.animate('_heal', 500);
  this.health += amount;
  if (this.health > this.maxHealth) this.health = this.maxHealth;
  this.updateHTML();
}
Character.prototype.die = async function() {  // dead this character :O
  await timeout(500);
  dialogue(`<span>${this.name} is defeated!</span>`);
  this.el.classList.add('_die');
  await timeout(750);
  this.el.innerHTML = '';
  this.el.classList.remove('_die');
  delete characters[this.id];
}

Character.prototype.getAllies = function(includeSelf) {  // return a list of characters considered "allies" of this caracter
    let res = this.isPC ? [characters.cat, characters.minion1, characters.minion2] : [characters.enemy1, characters.enemy2, characters.enemy3];
    res = res.filter(x => x != null);
    if (!includeSelf) res = res.filter(x => x.id !== this.id);
    return res;
}
Character.prototype.getEnemies = function() {  // return a list of characters considered "enemies" of this character
  let res = this.isPC ? [characters.enemy1, characters.enemy2, characters.enemy3] : [characters.cat, characters.minion1, characters.minion2];
  res = res.filter(x => x != null);
  return res;
}

// build this character's html
Character.prototype.buildHTML = function() {
  this.el.innerHTML = `
    <div class="picture">
      <img src="images/${this.sprite}">
    </div>
    <div class='target-selector'></div>
    <div class="info">
      <div class="left">
        <div class="name">${this.name}</div>
      </div>
      <div class="right">
        <div class="healthbar">
          <div class="remaining-health"></div>
        </div>
        <div class="actionbar"></div>
      </div>
    </div>
  `;
  this.el.querySelector('.target-selector').addEventListener('click', e => resolveTarget(e.currentTarget.parentNode.id));
}

// update this character's health, energy, and other displays
Character.prototype.updateHTML = function() {
  let healthiness = this.health / this.maxHealth * 100;
  if (healthiness < 0) healthiness = 0;
  this.el.querySelector('.remaining-health').style.width = `${healthiness}%`;
  let actionProgress = this.energy / this.actionEnergy() * 100;
  if (actionProgress > 100) actionProgress = 100;
  this.el.querySelector('.actionbar').style.width = `${actionProgress}%`;
}

Character.prototype.actionEnergy = function() {
  return 1000 / this.speed;
}

// defines what characters appear each wave
const waves = {
  1: {
    intro: 'fight for your life!',
    enemies: ['martina']
  },
  2: {
    intro: 'two hoodlums appear in front of you!',
    enemies: ['max', 'sabrina']
  },
  3: {
    intro: 'it looks like a photography club!',
    enemies: ['martina', 'martina', 'martina']
  },
  4: {
    intro: 'you stumble across a strange enemy!',
    enemies: ['ashwin']
  },
  5: {
    intro: 'almost there!',
    enemies: ['sabrina', 'sabrina'],
  }
}

// list of characters and their data
const characterData = {
  cat: {
    name: 'cat',
    sprite: 'cat.png',
    health: 200,
    speed: 20,
    skills: ['pounce', 'hiss', 'lickself', 'capture']
  },
  sabrina: {
    name: 'sabrina',
    sprite: 'sabrina.png',
    health: 130,
    speed: 18,
    skills: ['punch', 'doublepunch']
  },
  max: {
    name: 'max',
    sprite: 'max.png',
    health: 130,
    speed: 16,
    skills: ['punch', 'rave']
  },
  ashwin: {
    name: 'ashwin',
    sprite: 'ashwin.png',
    health: 190,
    speed: 14,
    skills: ['drainwave']
  },
  martina: {
    name: 'martina',
    sprite: 'martina.png',
    health: 110,
    speed: 15,
    skills: ['punch']
  }
}
