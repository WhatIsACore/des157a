let fields = ['name', 'animal', 'verbing', 'place', 'noun', 'adj', 'adj2', 'nouns', 'adj3', 'friend', 'adj4', 'verbing2', 'n', 'verb', 'nouns2', 'nouns3', 'n2', 'adj5', 'adj6'];
fields.forEach(f => {
  $('#inputs').innerHTML += `
    <div class='form-row'><label for="${f}">${f}:</label><input type="text" name="${f}"></div>
  `;
});

const form = $('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (Object.values(data).indexOf('') > -1)
    return alert('must fill everything in!');

  form.style.display = 'none';
  $('#madlib').innerHTML = `
        <h3>
          ${data.name} the ${data.animal}
        </h3>

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
});
