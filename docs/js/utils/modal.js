/**
 * Утилита для работы с модальными окнами
 */
export const ModalUtils = {
  /**
   * Открывает модальное окно
   * @param {string|HTMLElement} modal - ID модального окна или HTML-элемент
   */
  open(modal) {
    const modalElement =
      typeof modal === "string" ? document.getElementById(modal) : modal;

    if (!modalElement) {
      console.error("Модальное окно не найдено:", modal);
      return;
    }

    modalElement.style.display = "flex";
    document.body.classList.add("modal-open");

    // Добавляем обработчики для закрытия
    this.attachCloseHandlers(modalElement);
  },

  /**
   * Закрывает модальное окно
   * @param {string|HTMLElement} modal - ID модального окна или HTML-элемент
   */
  close(modal) {
    const modalElement =
      typeof modal === "string" ? document.getElementById(modal) : modal;

    if (!modalElement) {
      console.error("Модальное окно не найдено:", modal);
      return;
    }

    modalElement.style.display = "none";
    document.body.classList.remove("modal-open");

    // Удаляем обработчики
    this.detachCloseHandlers(modalElement);
  },

  /**
   * Добавляет обработчики для закрытия модального окна
   * @param {HTMLElement} modalElement - HTML-элемент модального окна
   */
  attachCloseHandlers(modalElement) {
    // Закрытие при клике на крестик
    const closeButtons = modalElement.querySelectorAll(
      ".close-modal, .close-button"
    );
    closeButtons.forEach((button) => {
      button.addEventListener("click", this._handleClose);
    });

    // Закрытие при клике на фон
    modalElement.addEventListener("click", this._handleOutsideClick);

    // Закрытие при нажатии Escape
    document.addEventListener("keydown", this._handleEscapeKey);

    // Сохраняем ссылку на модальное окно для обработчиков
    this._currentModal = modalElement;
  },

  /**
   * Удаляет обработчики закрытия модального окна
   */
  detachCloseHandlers(modalElement) {
    const closeButtons = modalElement.querySelectorAll(
      ".close-modal, .close-button"
    );
    closeButtons.forEach((button) => {
      button.removeEventListener("click", this._handleClose);
    });

    modalElement.removeEventListener("click", this._handleOutsideClick);
    document.removeEventListener("keydown", this._handleEscapeKey);

    this._currentModal = null;
  },

  // Обработчики событий
  _handleClose: function () {
    ModalUtils.close(ModalUtils._currentModal);
  },

  _handleOutsideClick: function (event) {
    if (event.target === ModalUtils._currentModal) {
      ModalUtils.close(ModalUtils._currentModal);
    }
  },

  _handleEscapeKey: function (event) {
    if (event.key === "Escape" && ModalUtils._currentModal) {
      ModalUtils.close(ModalUtils._currentModal);
    }
  },

  // Текущее активное модальное окно
  _currentModal: null,
};
