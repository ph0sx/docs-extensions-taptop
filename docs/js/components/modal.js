/**
 * Модульный компонент для управления модальными окнами
 */
export class Modal {
  /**
   * Создает новый экземпляр модального окна
   * @param {Object} options - Настройки модального окна
   * @param {string|HTMLElement} options.element - ID элемента или HTML-элемент модального окна
   * @param {string} [options.closeSelector='.close-modal, .close-button'] - CSS-селектор для кнопок закрытия
   * @param {boolean} [options.closeOnEscape=true] - Закрывать по нажатию Escape
   * @param {boolean} [options.closeOnOutsideClick=true] - Закрывать по клику вне окна
   */
  constructor(options = {}) {
    this.options = {
      closeSelector: ".close-modal, .close-button",
      closeOnEscape: true,
      closeOnOutsideClick: true,
      ...options,
    };

    this.modal =
      typeof this.options.element === "string"
        ? document.getElementById(this.options.element)
        : this.options.element;

    if (!this.modal) {
      console.error("Модальное окно не найдено:", this.options.element);
      return;
    }

    this.isOpen = false;
    this.bindEvents();
  }

  /**
   * Привязывает обработчики событий
   */
  bindEvents() {
    // Обработчики для кнопок закрытия
    this.closeButtons = this.modal.querySelectorAll(this.options.closeSelector);
    this.closeButtons.forEach((button) => {
      button.addEventListener("click", () => this.close());
    });

    // Закрытие по клику вне модального окна
    if (this.options.closeOnOutsideClick) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Закрытие по Escape
    if (this.options.closeOnEscape) {
      this.handleEscapeKey = (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      };
    }
  }

  /**
   * Открывает модальное окно
   */
  open() {
    if (this.isOpen) return;

    this.modal.style.display = "flex";
    document.body.classList.add("modal-open");

    if (this.options.closeOnEscape) {
      document.addEventListener("keydown", this.handleEscapeKey);
    }

    this.isOpen = true;

    // Триггерим событие открытия
    const event = new CustomEvent("modal:open", { detail: { modal: this } });
    this.modal.dispatchEvent(event);
  }

  /**
   * Закрывает модальное окно
   */
  close() {
    if (!this.isOpen) return;

    this.modal.style.display = "none";
    document.body.classList.remove("modal-open");

    if (this.options.closeOnEscape) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }

    this.isOpen = false;

    // Триггерим событие закрытия
    const event = new CustomEvent("modal:close", { detail: { modal: this } });
    this.modal.dispatchEvent(event);
  }

  /**
   * Переключает состояние модального окна
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Уничтожает экземпляр модального окна и удаляет обработчики событий
   */
  destroy() {
    this.closeButtons.forEach((button) => {
      button.removeEventListener("click", () => this.close());
    });

    if (this.options.closeOnEscape) {
      document.removeEventListener("keydown", this.handleEscapeKey);
    }

    this.modal.removeEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
  }
}
