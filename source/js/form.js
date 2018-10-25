import {CLASS_ERROR_NAME} from './constants';

class Form {
  constructor(node) {
    this.form = node;
    this.inputs = Array.from(node.elements).filter((it) => {
      return it.tagName.toLowerCase() === `input` || it.tagName.toLowerCase() === `textarea`;
    });
    this.invalidInputs = this.getInvalidInputs();
  };

  /**
   * Проверяет все input'ы в форме на валидность. Возвращает результат проверки в виде булевого значения.
   */
  get isValid() {
    return this.inputs.every((it) => {
      return it.validity.valid;
    });
  };

  /**
   * Проходит по всем input'ам формы, помечает невалидные.
   */
  getInvalidInputs() {
    return this.inputs.filter((it) => {
      if (it.validity.valid) {
        it.classList.remove(CLASS_ERROR_NAME);
      } else {
        it.classList.add(CLASS_ERROR_NAME);
        return true;
      }
    });
  };

  /**
   * Функция возвращает в виде строки состояние формы: валидно, имеет пустые обязательные поля ввода, имеет некорректно заполненные поля ввода.
   */
  get correctness() {
    if (this.isValid) {
      return `valid`;
    } else if (this.invalidInputs[0].validity.valueMissing) {
      return `empty`;
    } else {
      return `typeMismatch`;
    }
  };
};

export default Form;
