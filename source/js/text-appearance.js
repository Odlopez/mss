import {DURATION_HORIZONTAL, DURATION_VERTICAL} from './constants';
import animate from './animate';
import Shadow from './shadow';

const shadow = new Shadow();
const stringWidth = document.querySelector(`.slogan__text`).clientWidth;
const stringHeight = document.querySelector(`.slogan__string`).clientHeight;
const topSquare = document.querySelector(`.slogan__square--top`);
const bottomSquare = document.querySelector(`.slogan__square--bottom`);
const firstEmergingString = document.querySelector(`.slogan__emerging-string--first`);
const secondEmergingString = document.querySelector(`.slogan__emerging-string--second`);
const thirdEmergingString = document.querySelector(`.slogan__emerging-string--third`);
const fourthEmergingString = document.querySelector(`.slogan__emerging-string--fourth`);

/**
 * Функция-callback для первой фазы анимации отрисовки текста и движения квадратов
 * @param {Number} progress
 */
const squareFirstMove = function (progress) {
  topSquare.style.left = `${100 * progress}%`;
  bottomSquare.style.left = `${100 * (1 - progress)}%`;
  topSquare.style.boxShadow = shadow.left;
  bottomSquare.style.boxShadow = shadow.right;
  firstEmergingString.style.clip = `rect(0,${stringWidth * progress}px, 104px, 0)`;
  fourthEmergingString.style.clip = `rect(0, ${stringWidth}px, 104px, ${(stringWidth * (1 - progress))}px)`;
};

/**
 * Функция-callback для второй фазы анимации отрисовки текста и движения квадратов
 * @param {Number} progress
 */
const squareSecondMove = function (progress) {
  topSquare.style.transform = `translateY(${stringHeight * progress}px)`;
  bottomSquare.style.transform = `translateY(${stringHeight * -progress}px)`;
  topSquare.style.boxShadow = shadow.top;
  bottomSquare.style.boxShadow = shadow.bottom;
};

/**
 * Функция-callback для третье фазы анимации отрисовки текста и движения квадратов
 * @param {Number} progress
 */
const squareThirdMove = function (progress) {
  topSquare.style.left = `${100 * (1 - progress)}%`;
  bottomSquare.style.left = `${100 * progress}%`;
  topSquare.style.transform = `translateY(${stringHeight}px)`;
  bottomSquare.style.transform = `translateY(${-stringHeight}px)`;
  thirdEmergingString.style.clip = `rect(0,${stringWidth * progress}px, 104px, 0)`;
  secondEmergingString.style.clip = `rect(0,${stringWidth}px, 104px,${stringWidth * (1 - progress)}px)`;
  topSquare.style.boxShadow = shadow.right;
  bottomSquare.style.boxShadow = shadow.left;
};

/**
 * Функция-callback для последней, четвертой фазы анимации отрисовки текста и движения квадратов
 * @param {Number} progress
 */
const squareFourthMove = function (progress) {
  topSquare.style.transform = `translateY(${stringHeight * (1 - progress)}px)`;
  bottomSquare.style.transform = `translateY(${-stringHeight * (1 - progress)}px)`;
  firstEmergingString.style.clip = `rect(auto, auto, auto, auto)`;
  fourthEmergingString.style.clip = `rect(auto, auto, auto, auto)`;
  thirdEmergingString.style.clip = `rect(auto, auto, auto, auto)`;
  secondEmergingString.style.clip = `rect(auto, auto, auto, auto)`;
  topSquare.style.boxShadow = shadow.bottom;
  bottomSquare.style.boxShadow = shadow.top;
};


/**
 * Удаляет тень на квадратах
 */
const delShadow = function () {
  topSquare.style.boxShadow = `none`;
  bottomSquare.style.boxShadow = `none`;
};

/**
 * Функция-callback, вызывающаяся по окончании первой фазы анимации. Запускает вторую
 */
const launchSecondStepAnimation = function () {
  animate(squareSecondMove, DURATION_VERTICAL, 'linear', launchThirdStepAnimation);
};

/**
 * Функция-callback, вызывающаяся по окончании второй фазы анимации. Запускает третью
 */
const launchThirdStepAnimation = function () {
  animate(squareThirdMove, DURATION_HORIZONTAL, 'linear', launchFourthStepAnimation);
};

/**
 * Функция-callback, вызывающаяся по окончании тьертьей фазы анимации. Запускает четвертую
 */
const launchFourthStepAnimation = function () {
  animate(squareFourthMove, DURATION_VERTICAL, 'linear', delShadow);
};

/**
 * Функция-callback для обработчика загрузки документа. Запускает анимацию отрисовки текста и движения квадратов
 */
const onDocumentLoad = function () {
  animate(squareFirstMove, DURATION_HORIZONTAL, 'linear', launchSecondStepAnimation);
};

export default onDocumentLoad;
