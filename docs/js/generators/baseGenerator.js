import { minifyCode } from "../utils/minifyCode.js";

/**
 * Базовый класс для всех генераторов кода
 */
export class BaseGenerator {
  constructor(options = {}) {
    this.options = {
      modalId: "success-modal",
      ...options,
    };

    this.elements = {};
    this.initialized = false;
    this.eventsInitialized = false;
  }

  /**
   * Инициализация генератора
   */
  init() {
    if (this.initialized) {
      console.log(`${this.constructor.name}: Уже инициализирован, пропускаем`);
      return this;
    }

    console.log(`${this.constructor.name}: Инициализация`);

    this.findElements();
    this.bindEvents();
    this.setInitialState();

    this.initialized = true;
    return this;
  }

  /**
   * Поиск необходимых элементов в DOM
   * Переопределяется в дочерних классах
   */
  findElements() {
    this.elements.generateButton = document.getElementById("generate-btn");
    this.elements.modal = document.getElementById(this.options.modalId);
    this.elements.closeModal = document.querySelectorAll(
      ".close-modal, .close-button"
    );
    this.elements.jsCode = document.getElementById("js-code");
  }

  /**
   * Привязка обработчиков событий
   * Переопределяется в дочерних классах
   */
  bindEvents() {
    if (this.eventsInitialized) {
      console.log(`${this.constructor.name}: События уже инициализированы`);
      return;
    }

    this.eventsInitialized = true;
  }

  /**
   * Удаление обработчиков событий
   * Переопределяется в дочерних классах
   */
  unbindEvents() {
    if (!this.eventsInitialized) return;

    console.log(`${this.constructor.name}: Удаление обработчиков событий`);
    this.eventsInitialized = false;
  }

  /**
   * Установка начального состояния генератора
   * Переопределяется в дочерних классах
   */
  setInitialState() {
    // Реализация в дочерних классах
  }

  /**
   * Генерация кода на основе настроек
   * Обязательно переопределяется в дочерних классах
   * @returns {string} - Сгенерированный код
   */

  generateCode() {
    throw new Error(
      "Метод generateCode должен быть переопределен в дочернем классе"
    );
  }

  /**
   * Копирование кода в буфер обмена и отображение уведомления
   * @param {string} code - Код для копирования
   */
  async copyAndNotify(code) {
    const minified = minifyCode(code);

    try {
      await navigator.clipboard.writeText(minified);
      this.showSuccessModal();
    } catch (err) {
      console.error("Ошибка при копировании через Clipboard API:", err);
      this.fallbackCopy(minified);
    }

    return minified;
  }

  /**
   * Резервный метод копирования в буфер обмена
   * @param {string} text - Текст для копирования
   */

  fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    try {
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (success) {
        this.showSuccessModal();
      } else {
        this.showErrorModal("Не удалось скопировать код");
      }
    } catch (err) {
      document.body.removeChild(textarea);
      this.showErrorModal("Возникла ошибка при копировании кода");
    }
  }

  /* 
  generateAndCopyCode() //TODO! ОПИСАТЬ
  collectData() {} //TODO! ОПИСАТЬ */

  closeModal() {
    if (this.elements.modal) {
      this.elements.modal.style.display = "none";
    }
  }

  /**
   * Отображает модальное окно успешного копирования
   */
  showSuccessModal() {
    if (this.elements.modal) {
      this.elements.modal.style.display = "flex";
    } else {
      alert("Код успешно скопирован в буфер обмена!");
    }
  }

  /**
   * Отображает модальное окно с ошибкой
   * @param {string} message - Сообщение об ошибке
   */
  showErrorModal(message) {
    alert(message || "Произошла ошибка. Попробуйте еще раз.");
  }

  /**
   * Уничтожает экземпляр генератора
   */
  destroy() {
    this.unbindEvents();
    console.log(`${this.constructor.name}: Уничтожен`);
    this.initialized = false;
  }
}
