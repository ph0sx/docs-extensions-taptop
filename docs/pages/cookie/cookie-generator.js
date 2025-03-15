/**
 * Самовызывающаяся функция для изоляции кода
 */
(function () {
  /**
   * Инициализация генератора
   * Находит элементы и привязывает обработчики событий
   */
  function initGenerator() {
    // Находим необходимые DOM-элементы
    const elements = {
      generateBtn: document.getElementById("generate-btn"),
      jsCode: document.getElementById("js-code"),
      modal: document.getElementById("success-modal"),
      closeModal: document.querySelectorAll(".close-modal, .close-btn"),
      inputs: {
        expiryDays: document.getElementById("expiry-days"),
        popupClass: document.getElementById("popup-class"),
        consentBtnClass: document.getElementById("consent-btn-class"),
        rejectBtnClass: document.getElementById("reject-btn-class"),
      },
    };

    // Если элементы не найдены, пробуем позже
    if (!elements.generateBtn) {
      setTimeout(initGenerator, 500);
      return;
    }

    /**
     * Функция для генерации кода, копирования в буфер обмена и показа модального окна
     */
    function generateAndCopyCode() {
      // Получаем значения из формы с проверкой на значения по умолчанию
      const settings = {
        cookieName: "cookieAgreement", // Фиксированное значение
        expiryDays: elements.inputs.expiryDays.value || 7,
        popupClass: elements.inputs.popupClass.value || "popup-cookie",
        consentBtnClass:
          elements.inputs.consentBtnClass.value || "button-cookie",
        rejectBtnClass:
          elements.inputs.rejectBtnClass.value || "button-no-cookie",
      };

      // Фиксированные классы
      const closeBtnClass = "pop-up__inside-close-button";
      const overlayClass = "pop-up__overlay";

      // Генерируем JavaScript код
      const generatedCode = `<script>
document.addEventListener("DOMContentLoaded", () => {
  // Вспомогательные функции для работы с cookie
  const cookies = {
    get: (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : undefined;
    },
    set: (name, value, options = {}) => {
      options = {
        path: '/',
        ...options
      };
      
      if (options.expires) {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        options.expires = date.toUTCString();
      }
      
      let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      
      for (const [key, val] of Object.entries(options)) {
        updatedCookie += '; ' + key;
        if (val !== true) {
          updatedCookie += '=' + val;
        }
      }
      
      document.cookie = updatedCookie;
    }
  };
  
  const ui = {
    banner: document.querySelector(".${settings.popupClass}"),
    consentBtn: document.querySelector(".${settings.consentBtnClass}"),
    rejectBtn: document.querySelector(".${settings.rejectBtnClass}"),
    closeBtn: document.querySelector(".${closeBtnClass}"),
    overlay: document.querySelector(".${overlayClass}")
  };
  
  const hideBanner = () => ui.banner && (ui.banner.style.display = "none");
  
  // Проверяем и показываем баннер если нужно
  if (cookies.get("${settings.cookieName}") === undefined && ui.banner) {
    ui.banner.style.display = "flex";
    
    // Добавляем обработчики для закрытия
    ui.closeBtn?.addEventListener("click", hideBanner, { once: true });
    ui.overlay?.addEventListener("click", hideBanner, { once: true });
    
    // Обработчики кнопок
    ui.consentBtn?.addEventListener("click", () => {
      cookies.set("${settings.cookieName}", "true", { expires: ${settings.expiryDays} });
      hideBanner();
    });
    
    ui.rejectBtn?.addEventListener("click", () => {
      cookies.set("${settings.cookieName}", "false", { expires: ${settings.expiryDays} });
      hideBanner();
    });
  }
});
<\/script>`;

      //Сохраняем код в скрытый элемент (для отладки)
      elements.jsCode.textContent = generatedCode;

      //Минифицируем код!
      const minifiedCode = minifyCode(generatedCode);

      // Копируем код в буфер обмена
      copyToClipboard(minifiedCode);

      // Показываем модальное окно с подтверждением
      elements.modal.style.display = "flex";
    }

    /**
     * Функция для копирования текста в буфер обмена
     */
    function copyToClipboard(text) {
      // Создаем временный элемент для копирования
      const tempElement = document.createElement("textarea");
      tempElement.value = text;
      tempElement.setAttribute("readonly", "");
      tempElement.style.position = "absolute";
      tempElement.style.left = "-9999px";
      document.body.appendChild(tempElement);

      // Выделяем и копируем текст
      tempElement.select();
      tempElement.setSelectionRange(0, 99999);
      document.execCommand("copy");

      // Удаляем временный элемент
      document.body.removeChild(tempElement);
    }

    /**
     * Функция для закрытия модального окна
     */
    function closeModalWindow() {
      elements.modal.style.display = "none";
    }

    // Привязываем обработчики событий
    elements.generateBtn.addEventListener("click", generateAndCopyCode);

    // Добавляем обработчики для закрытия модального окна
    elements.closeModal.forEach((btn) => {
      btn.addEventListener("click", closeModalWindow);
    });

    // Закрытие модального окна при клике на оверлей
    elements.modal.addEventListener("click", function (event) {
      if (event.target === this) {
        closeModalWindow();
      }
    });

    // Закрытие модального окна при нажатии Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && elements.modal.style.display !== "none") {
        closeModalWindow();
      }
    });
  }

  // Запускаем инициализацию
  initGenerator();

  // Для Docsify также добавляем обработчик на изменение страницы
  if (typeof window.$docsify !== "undefined") {
    window.$docsify.plugins = window.$docsify.plugins || [];
    window.$docsify.plugins.push(function (hook) {
      hook.doneEach(function () {
        initGenerator();
      });
    });
  }
})();
