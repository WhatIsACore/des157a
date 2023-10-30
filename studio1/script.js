'use strict';
const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

const layers = ["#sky", "#treeline", "#foreground"].map(x => $(x));
function updateParallax(e) {
  const diffX = (e.clientX - screen.width / 2) / (screen.width / 2);
  const diffY = (e.clientY - screen.height / 2) / (screen.height / 2);

  layers[0].style.top = (-diffY * 5 - 5) + 'px'; // sky
  layers[0].style.left = (-diffX * 10 - 10) + 'px';

  layers[1].style.top = (-diffY * 10 - 10) + 'px';
  layers[1].style.left = (-diffX * 20 - 20) + 'px';

  layers[2].style.top = (-diffY * 20) + 'px';
  layers[2].style.left = (-diffX * 40) + 'px';
}
addEventListener("mousemove", updateParallax);

let start = addEventListener('click', e => {
  removeEventListener('click', start);
  $('h2').className += 'activated';
  $('header').style.opacity = 0;
  $('main').style.display = 'block';
  setTimeout(() => {
    $('header').style.display = 'none';
    $('main').style.opacity = 1;
  }, 200);
});

// 0 = input type, 1 = label, 2 = name
const formData = {
  '#page1': [
    ['text', 'pick a name', 'name'],
    ['text', 'pick an animal', 'animal'],
    ['text', 'pick another animal', 'friend'],
    ['text', 'pick a place (no pronouns)', 'place']
  ],
  '#page2': [
    ['text', 'noun', 'noun'],
    ['text', 'plural noun', 'nouns'],
    ['text', 'plural noun', 'nouns2'],
    ['text', 'plural noun', 'nouns3']
  ],
  '#page3': [
    ['text', 'verb', 'verb'],
    ['text', 'verb with -ing', 'verbing'],
    ['text', 'verb with -ing', 'verbing2'],
    ['text', 'number', 'n'],
    ['text', 'another number', 'n2']
  ],
  '#page4': [
    ['text', 'adj one', 'adj'],
    ['text', 'adj two', 'adj2'],
    ['text', 'adj three', 'adj3'],
    ['text', 'adj four', 'adj4'],
    ['text', 'adj five', 'adj5'],
    ['text', 'adj six', 'adj6']
  ]
};

function toTarget(e) {
  e.preventDefault();

  if (e.target.dataset.target === 'submit') {
    generateResult();
    return;
  }

  const currentPage = $('.page.active');
  currentPage.style.opacity = 0;
  $(e.target.dataset.target).className = 'page active';
  setTimeout(() => {
    currentPage.className = 'page';
    $('.page.active').style.opacity = 1;
  }, 200);
}
function generateForm() {
  $('.page.active').style.opacity = 1;
  for (let page of Object.keys(formData))
    for (let input of formData[page])
      $(page + ' .rows').innerHTML += `
        <div class='form-row'>
          <label for='${input[2]}'>${input[1]}:</label>
          <input type='${input[0]}' name='${input[2]}'/>
        </div>
      `;
  $$('.page button').forEach(x => x.addEventListener('click', toTarget));
}
generateForm();

function generateResult() {
  const data = Object.fromEntries(new FormData($('form')));
  $('#madlib').innerHTML = `
      <p>
        ${data.name} the ${data.animal}
      </p>

      <p>
        One night, while ${data.name} was ${data.verbing} in the ${data.place}, they suddenly came upon a ${data.noun} that looked particularly ${data.adj}. ${data.name} couldn't resist the temptation and pounced on it.
        To their surprise, the ${data.noun} turned out to be a portal that transported ${data.name} to a ${data.adj3} world filled with ${data.nouns}. Their adventure had just begun!
      </p>

      <p>
        In this ${data.adj2} land, ${data.name} met a ${data.adj3} ${data.friend} who spoke in ${data.adj4} rhymes. They began ${data.verbing2} together, embarking on ${data.n} quests together to ${data.verb} the land.
        As they journeyed through this ${data.adj2} realm, ${data.name} discovered their true goal, which was to bring ${data.nouns2} and ${data.nouns3} to everyone they met. With their newfound ${data.friend}, they went on to achieve this.
      </p>

      <p>
        Finally, after ${data.n2} days, ${data.name} found another magical portal that led them back to the ${data.place}. They returned home from their adventure, but were forever changed.
        From that day on, ${data.name} was ${data.adj5} and ${data.adj6}, never forgetting the adventure.
      </p>
    `;

  $('.page.active').style.opacity = 0;
  $('#madlib').style.display = 'block';
  setTimeout(() => {
    $('.page.active').className = 'page';
    $('#madlib').style.opacity = 1;
  }, 200);
}
