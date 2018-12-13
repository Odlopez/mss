const links = document.querySelectorAll(`[href='#map']`);
const map = document.querySelector(`#map`);
const HEIGHT = 500;

const toLinkClick = function (e) {
  map.style.height = `${HEIGHT}px`;
};

if (links && map) {
  Array.from(links).forEach(it => {
    it.addEventListener(`click`, toLinkClick);
  });
};
