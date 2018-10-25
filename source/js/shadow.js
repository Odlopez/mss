import {OPACITY, TAIL, LENGTH} from './constants';

class Shadow {
  constructor() {
    this.opacity = OPACITY;
    this.top = this.getShadow(`top`);
    this.right = this.getShadow(`right`);
    this.bottom = this.getShadow(`bottom`);
    this.left = this.getShadow(`left`);
  }

  /**
   * Функция возвращает строку с сгенерированными стилями плавной тени в виде "хвоста". Принимает строку обозначающую направление тени
   * @param {String} direction
   */
  getShadow(direction) {
    let boxShadow = ``;

    for (let i = 1; i <= TAIL; i++) {
      let punctuation = (i === TAIL) ? `` : `,`;

      if (direction === `left`) {
        boxShadow += `${-i * LENGTH / TAIL}px 0 0 rgba(29, 196, 221, ${this.opacity * (TAIL - i) / 10})${punctuation}`;
      } else if (direction === `right`) {
        boxShadow += `${i * LENGTH / TAIL}px 0 0 rgba(29, 196, 221, ${this.opacity * (TAIL - i) / 10})${punctuation}`;
      } else if (direction === `top`) {
        boxShadow += `0 ${-i * LENGTH / TAIL}px 0 rgba(29, 196, 221, ${this.opacity * (TAIL - i) / 10})${punctuation}`;
      } else {
        boxShadow += `0 ${i * LENGTH / TAIL}px 0 rgba(29, 196, 221, ${this.opacity * (TAIL - i) / 10})${punctuation}`;
      }
    }

    return boxShadow;
  };
};

export default Shadow;
