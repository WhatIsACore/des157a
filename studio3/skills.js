'use strict';

const skills = {
  pounce: {
    name: 'pounce',
    description: 'pounce on an enemy and deal damage!',
    targeting: 'one enemy',
    execute: async (user, target) => {
      dialogue(`${user.name} pounces on ${target.name}!`);
      user.el.classList.add('_attack');
      await timeout(150);
      await target.damage(40);
      await timeout(350);
      user.el.classList.remove('_attack');
    }
  },
  hiss: {
    name: 'hiss!!',
    description: 'hiss hisss hisss',
    targeting: 'all enemies',
    execute: async (user) => {
      dialogue(`${user.name} hisses menacingly!`);
    }
  },
  lickself: {
    name: 'lick self',
    description: 'groom yourself in public.',
    targeting: 'self',
    execute: async (user) => {
      dialogue(`${user.name} licks themselves!`);
      user.el.classList.add('_use');
      await timeout(250);
      user.heal(40);
      await timeout(250);
      user.el.classList.remove('_use');

    }
  },
  punch: {
    name: 'punch',
    description: 'punches an enemy.',
    targeting: 'one enemy',
    execute: async (user, target) => {
      dialogue(`${user.name} punches ${target.name}!`);
      user.el.classList.add('_attack');
      await timeout(150);
      await target.damage(20);
      await timeout(350);
      user.el.classList.remove('_attack');
    }
  }
};
