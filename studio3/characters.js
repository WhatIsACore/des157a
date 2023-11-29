const Character = function(src, el) {
  this.el = el;
  this.name = src.name;
  this.sprite = src.sprite;
  this.maxHealth = src.health;
  this.health = src.health;
  this.speed = src.speed;
  this.energy = 0;
  this.attacks = [...src.attacks];
}

Character.prototype.buildHTML = function() {
  this.el.innerHTML = `
    <div class="picture">
      <img src="images/${this.sprite}">
    </div>
    <div class="info">
      <div class="left">
        <div class="name">${this.name}</div>
      </div>
      <div class="right">
        <div class="healthbar"></div>
        <div class="actionbar"></div>
      </div>
    </div>
  `;
}

Character.prototype.updateHTML = function() {
  const healthiness = this.health / this.maxHealth * 100;
  this.el.querySelector('.healthbar').style.width = `${healthiness}%`;
  let actionProgress = this.energy / this.maxEnergy() * 100;
  if (actionProgress > 100) actionProgress = 100;
  this.el.querySelector('.actionbar').style.width = `${actionProgress}%`;
}

Character.prototype.maxEnergy = function() {
  return 1000 / this.speed;
}

const characters = {
  cat: {
    name: 'cat',
    sprite: 'cat.png',
    health: 100,
    speed: 20,
    attacks: ['pounce', 'hiss', 'lick wounds']
  },
  martina: {
    name: 'martina',
    sprite: 'martina.png',
    health: 100,
    speed: 15,
    attacks: []
  },
  ashwin: {
    name: 'ashwin',
    sprite: 'ashwin.png',
    health: 150,
    speed: 18,
    attacks: []
  },
  sabrina: {
    name: 'sabrina',
    sprite: 'sabrina.png',
    health: 150,
    speed: 18,
    attacks: []
  },
  max: {
    name: 'max',
    sprite: 'max.png',
    health: 150,
    speed: 18,
    attacks: []
  }
}
