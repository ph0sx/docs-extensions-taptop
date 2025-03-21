/**
 * Модульный компонент для управления слайдерами (range inputs)
 */
export class Slider {
  /**
   * Создает новый экземпляр слайдера
   * @param {Object} options - Настройки слайдера
   * @param {string|HTMLElement} options.element - ID элемента или HTML-элемент слайдера
   * @param {string} [options.valueDisplaySelector] - CSS-селектор для элемента отображения значения
   * @param {string} [options.secondaryDisplaySelector] - CSS-селектор для дополнительного элемента отображения
   * @param {Function} [options.formatValue] - Функция форматирования основного значения
   * @param {Function} [options.formatSecondary] - Функция форматирования дополнительного значения
   */
  constructor(options = {}) {
    this.options = {
      formatValue: (val) => `${val}%`,
      formatSecondary: null,
      ...options,
    };

    this.slider =
      typeof this.options.element === "string"
        ? document.getElementById(this.options.element)
        : this.options.element;

    if (!this.slider) {
      console.error("Слайдер не найден:", this.options.element);
      return;
    }

    this.valueDisplay = this.options.valueDisplaySelector
      ? document.querySelector(this.options.valueDisplaySelector)
      : null;

    this.secondaryDisplay = this.options.secondaryDisplaySelector
      ? document.querySelector(this.options.secondaryDisplaySelector)
      : null;

    this.init();
  }

  /**
   * Инициализирует слайдер
   */
  init() {
    // Начальное обновление отображения
    this.updateDisplays();

    // Привязка обработчиков событий
    this.slider.addEventListener("input", () => this.updateDisplays());
    this.slider.addEventListener("change", () => this.updateDisplays());
  }

  /**
   * Обновляет значения в дисплеях
   */
  updateDisplays() {
    const value = parseInt(this.slider.value, 10);

    if (this.valueDisplay && this.options.formatValue) {
      this.valueDisplay.textContent = this.options.formatValue(value);
    }

    if (this.secondaryDisplay && this.options.formatSecondary) {
      this.secondaryDisplay.textContent = this.options.formatSecondary(value);
    }

    // Триггерим собственное событие
    const event = new CustomEvent("slider:change", {
      detail: {
        value,
        slider: this,
      },
    });
    this.slider.dispatchEvent(event);
  }

  /**
   * Устанавливает значение слайдера
   * @param {number} value - Новое значение
   */
  setValue(value) {
    this.slider.value = value;
    this.updateDisplays();
  }

  /**
   * Возвращает текущее значение слайдера
   * @returns {number} - Текущее значение
   */
  getValue() {
    return parseInt(this.slider.value, 10);
  }

  /**
   * Добавляет обработчик события изменения значения
   * @param {Function} callback - Функция обработчик
   */
  onChange(callback) {
    this.slider.addEventListener("slider:change", callback);
  }

  /**
   * Уничтожает экземпляр слайдера
   */
  destroy() {
    this.slider.removeEventListener("input", () => this.updateDisplays());
    this.slider.removeEventListener("change", () => this.updateDisplays());
  }
}
