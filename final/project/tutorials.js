'use strict';

function makeTutorial(parent, dx, dy, width, content) {
  const t = document.createElement('div');
  t.className = 'tutorial';
  t.style.left = dx + 'px';
  t.style.top = dy + 'px';
  t.style.width = width + 'px';
  t.innerHTML = content;
  t.addEventListener('click', e => {
    e.stopPropagation();
    t.remove()
  });
  parent.appendChild(t);
}

const tutorials = {
  actionBar: () => {
    makeTutorial($('#cat'), 260, 80, 330, `
      <p>this is you!</p>
      <p>
        the green bar represents your <span style="color: #080">health</span>.<br>
        run out of it and you die!
      </p>
      <p>
        the blue bar is your <span style="color: #00f">action meter</span>.<br>
        when it fills up, it's your turn to move!
      </p>
    `);
    tutorials.actionBar = () => {};
  },
  capture: () => {
    const captureBtn = $('.skill-btn[data-id="capture"]')
    makeTutorial(captureBtn, 170, -15, 300, `
      <p>
        one of your enemies is weak! you have a good chance of succeeding if you attempt to <span style="color: #00f">befriend</span> them.
      </p>
    `);
    console.log('hi');
    tutorials.capture = () => {};
  }
}
