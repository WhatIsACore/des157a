'use strict';

const skills = {
  pounce: {
    name: 'pounce',
    description: 'pounce on an enemy and deal damage!',
    targeting: 'one enemy',
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
    description: 'hiss hisss hisss',
    targeting: 'all enemies',
    execute: async (user) => {
      dialogue(`${user.name} hisses menacingly!`);
      user.animate('_fast-bounce', 800)
      await timeout(500);
      user.getEnemies().forEach(x => {
        x.animate('_energy-change', 300);
        x.animate('_shake', 800);
        x.energy -= 15;
        x.updateHTML();
      });
      await timeout(500);
    }
  },
  lickself: {
    name: 'lick self',
    description: 'groom yourself in public.',
    targeting: 'self',
    execute: async (user) => {
      dialogue(`${user.name} licks themselves!`);
      user.animate('_use', 500);
      await timeout(250);
      user.heal(70);
      await timeout(250);

    }
  },
  capture: {
    name: 'capture',
    description: 'turn an enemy into your minion! more likely to work if you beat them up first.',
    targeting: 'one enemy',
    isUsable: () => {
      return characters.minion1 == null || characters.minion2 == null;
    },
    execute: async (user, target) => {
      dialogue(`attempting to catch ${target.name}...`);
      target.el.classList.add('_capturing');
      const successChance = 1 - (target.health / target.maxHealth - 0.1) / 0.65;
      await timeout(3000);
      target.el.classList.remove('_capturing');
      if (Math.random() < successChance) {
        target.isPC = true;
        let id;
        if (characters.minion2 == null) id = 'minion2';
        if (characters.minion1 == null) id = 'minion1';
        dialogue(`> successfully turned ${target.name} into your minion!`);
        target.assignId(id);
        target.heal(10);
      } else {
        dialogue(`> it didn't work! ${target.name} escapes!`);
      }
      await timeout(250);
    }
  },
  punch: {
    name: 'punch',
    description: 'punches an enemy.',
    targeting: 'one enemy',
    execute: async (user, target) => {
      dialogue(`${user.name} punches ${target.name}!`);
      user.animate('_attack', 500);
      await timeout(150);
      target.damage(20);
      await timeout(350);
    }
  },
  doublepunch: {
    name: 'double punch',
    description: 'hit em with the wombo combo! might miss.',
    targeting: 'one enemy',
    execute: async (user, target) => {
      dialogue(`${user.name} surprises ${target.name} with a two-punch combo!`);
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
    execute: async (user) => {
      dialogue(`${user.name} plays a bangin mix!`);
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
    name: 'drainwave',
    description: 'send out a wave of drainer energy that hurts everyone.',
    targeting: 'all',
    execute: async (user) => {
      dialogue(`${user.name} unleashes a wave of energy!`);
      animateScreen('_drainwave', 800);
      await timeout(800);
      user.getEnemies().forEach(x => x.damage(40));
      user.getAllies(false).forEach(x => x.damage(40));
      user.damage(20);
      await timeout(800);
    }
  },
  spinattack: {
    name: 'spin attack',
    description: 'spin a lot, hitting random enemies!',
    targeting: 'all enemies',
    execute: async (user) => {

    }
  }
};

function animateScreen(effect, ms) {
  document.body.classList.add(effect);
  setTimeout(() => {document.body.classList.remove(effect)}, ms);
}
