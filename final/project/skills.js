'use strict';

// every skill and its behaviors are defined here
const skills = {
  pounce: {
    name: 'pounce',
    description: 'pounce on an enemy and deal damage!',
    targeting: 'one enemy',
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} pounces on ${target.name}!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(40);
      await timeout(350);
    }
  },
  hiss: {
    name: 'hiss!!',
    description: 'slightly damages and decreases the action meters of all enemies',
    targeting: false,
    execute: async (user) => {
      sounds['hiss.mp3'].play();
      dialogue(`${user.name} hisses menacingly!`);
      user.animate('_fast-bounce', 800)
      await timeout(700);
      user.getEnemies().forEach(async x => {
        x.damage(10);
        await timeout(500);
        x.changeEnergy(-15);
        x.animate('_shake', 800);
      });
      await timeout(1000);
    }
  },
  lickself: {
    name: 'lick self',
    description: 'groom yourself in public. this recovers some health',
    targeting: false,
    execute: async (user) => {
      sounds['meow.mp3'].play();
      dialogue(`${user.name} licks themselves!`);
      user.animate('_use', 500);
      await timeout(600);
      user.heal(70);
      await timeout(250);
    }
  },
  capture: {
    name: 'befriend',
    description: 'turn an enemy into your minion! more likely to work if you beat them up first.',
    targeting: true,
    validTargets: user => {
      if (characters.minion1 == null || characters.minion2 == null)
       return user.getEnemies();
      return [];
    },
    execute: async (user, target) => {
      dialogue(`attempting to convert ${target.name}...`);
      target.el.classList.add('_capturing');
      const successChance = 1 - (target.health / target.maxHealth - 0.15) / 0.6;
      await timeout(3000);
      target.el.classList.remove('_capturing');
      if (Math.random() < successChance) {
        target.isPC = true;
        let id;
        if (characters.minion2 == null) id = 'minion2';
        if (characters.minion1 == null) id = 'minion1';
        dialogue(`> successfully convinced ${target.name} to be your minion!`);
        target.assignId(id);
        target.heal(10);
      } else {
        dialogue(`> it didn't work! ${target.name} escapes!`);
      }
      await timeout(250);
    }
  },
  bite: {
    name: 'bite',
    description: 'nibble on the target.',
    targeting: true,
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} bites ${target.name}!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(10);
      await timeout(350);
    }
  },
  chomp: {
    name: 'chomp',
    description: 'chomp on the target!',
    targeting: true,
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} chomps ${target.name}!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(30);
      await timeout(350);
    }
  },
  bigchomp: {
    name: 'bigchomp',
    description: 'eat the target!',
    targeting: true,
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} chomps ${target.name}! it really really hurts!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(50);
      await timeout(350);
    }
  },
  ratquake: {
    name: 'ratquake',
    description: 'creates an earthquake, hurting everyone. can summon a rat',
    targeting: false,
    execute: async (user) => {
      dialogue(`${user.name} stomps up and down, creating a ratquake!`);
      user.animate('_fast-bounce', 800)
      await timeout(400);
      animateScreen('_quake', 800);
      await timeout(300);
      if (user.getAllies(true).length < 3) {
        const id = (user.isPC ? ['minion1', 'minion2'] : ['enemy1', 'enemy2', 'enemy3']).find(x => characters[x] == null);
        const rand = Math.random();
        let type = 'rat';
        if (rand < 0.3) type = 'sadrat';
        if (rand < 0.1) type = 'peacerat';
        let rat = new Character(characterData[type], id, user.isPC);
        rat.animate('_drop-in', 400);
        await timeout(500);
      }
      [...user.getEnemies(), ...user.getAllies(false)].forEach(x => x.damage(20));
      await timeout(300);
    }
  },
  yap: {
    name: 'yap',
    description: 'yap on about world peace (does nothing)',
    targeting: false,
    execute: async (user) => {
      dialogue(`${user.name} is yapping!`);
      user.animate('_fast-bounce', 800)
      await timeout(700);
    }
  },
  punch: {
    name: 'punch',
    description: 'punches an enemy.',
    targeting: true,
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} punches ${target.name}!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(20);
      await timeout(350);
    }
  },
  drainpunch: {
    name: 'drain punch',
    description: 'punches an enemy, stealing their life force.',
    targeting: true,
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} punches ${target.name} and drains their health!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(30);
      await timeout(350);
      user.heal(15);
      await timeout(250);
    }
  },
  heal: {
    name: 'heal',
    description: 'heals the target!',
    targeting: true,
    validTargets: user => user.getAllies(true).filter(x => x.health < x.maxHealth),
    execute: async (user, target) => {
      user.animate('_use', 500);
      if (user.id === target.id) {
        dialogue(`${user.name} heals themselves!`);
        await timeout(600);
        user.heal(user.isPC ? 30 : 20);  // slightly weaker heal if used by enemy
      } else {
        dialogue(`${user.name} heals ${target.name}!`);
        await timeout(600);
        target.heal(30);
      }
      await timeout(250);
    }
  },
  rally: {
    name: 'rally',
    description: 'rally an ally, increasing their action meter!',
    targeting: true,
    validTargets: user => user.getAllies(false),
    execute: async (user, target) => {
      dialogue(`${user.name} rallies ${target.name}, increasing their action meter!`);
      user.animate('_fast-bounce', 800);
      target.animate('_fast-bounce', 800);
      await timeout(500);
      target.changeEnergy(25);
      await timeout(500);
    }
  },
  doublepunch: {
    name: 'double punch',
    description: 'swing at an enemy twice! this attack can miss.',
    targeting: true,
    validTargets: user => user.getEnemies(),
    execute: async (user, target) => {
      dialogue(`${user.name} charges ${target.name} with a two-punch combo!`);
      await timeout(300);
      for (let i = 0; i < 2; i++) {
        user.animate('_attack', 500);
        await timeout(100);
        if (Math.random() < 0.75) {
          target.damage(20);
          dialogue(`> (hit!)`);
        } else {
          target.animate('_fast-bounce', 400);
          dialogue(`> (miss!)`);
        }
        await timeout(500);
      }
    }
  },
  rave: {
    name: 'pom rave',
    description: 'heals all friends and slightly hurts all enemies.',
    targeting: false,
    execute: async (user) => {
      dialogue(`${user.name} plays dancey music!`);
      user.getAllies(true).forEach(x => x.animate('_fast-bounce', 800));
      await timeout(800);
      user.getAllies(true).forEach(x => x.heal(20));
      await timeout(500);
      const enemies = user.getEnemies();
      enemies.forEach(x => x.damage(10));
      await timeout(300);
    }
  },
  drainwave: {
    name: 'energy wave',
    description: 'release a wave of energy that damages everyone, including allies.',
    targeting: false,
    execute: async (user) => {
      sounds['glitch.mp3'].play();
      dialogue(`${user.name} unleashes a wave of energy!`);
      animateScreen('_drainwave', 800);
      await timeout(800);
      [...user.getEnemies(), ...user.getAllies(false)].forEach(x => x.damage(40));
      user.damage(20);
      await timeout(800);
    }
  },
  spinattack: {
    name: 'spinattack',
    description: 'spin around, hitting enemies at random!',
    targeting: false,
    execute: async (user) => {
      dialogue(`${user.name} spins rapidly!`);
      user.animate('_spin', 1000);
      let enemies = user.getEnemies();
      for (let i = 0; i < 4; i++) {
        await timeout(200);
        let target = enemies[Math.random() * enemies.length >> 0];
        if (Math.random() < 0.75) {
          target.damage(15);
          dialogue(`> (hits ${target.name}!)`);
        } else {
          target.animate('_fast-bounce', 400);
          dialogue(`> (misses ${target.name}!)`);
        }
      }
      await timeout(500);
    }
  },
  killall: {
    name: 'kill all',
    description: 'for testing purposes',
    targeting: false,
    execute: async (user) => {
      user.getEnemies().forEach(x => x.damage(1000000));
      await timeout(350);
    }
  }
};

function animateScreen(effect, ms) {
  document.body.classList.add(effect);
  setTimeout(() => {document.body.classList.remove(effect)}, ms);
}
