import { BaseGenerator } from "./baseGenerator.js";

export class CookieGenerator extends BaseGenerator {
  constructor() {
    super();
    // Конфигурация по умолчанию
    this.config = {
      cookieName: "cookieAgreement",
      expiryDays: 30,
      popupClass: "popup-cookie",
      consentBtnClass: "button-cookie",
      rejectBtnClass: "button-no-cookie",
    };
  }

  findElements() {
    super.findElements();
    this.elements = {
      ...this.elements,
      inputs: {
        expiryDays: document.getElementById("expiry-days"),
        popupClass: document.getElementById("popup-class"),
        consentBtnClass: document.getElementById("consent-btn-class"),
        rejectBtnClass: document.getElementById("reject-btn-class"),
      },
    };
  }

  bindEvents() {
    // Генерация кода по клику
    this.elements.generateButton?.addEventListener("click", () =>
      this.generateAndCopyCode()
    );

    // Обработчики для модального окна
    this.elements.closeModal?.forEach((btn) =>
      btn.addEventListener("click", () => this.closeModal())
    );
    this.elements.modal?.addEventListener("click", (event) => {
      if (event.target === this.elements.modal) this.closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        this.elements.modal?.style.display !== "none"
      ) {
        this.closeModal();
      }
    });
  }

  generateAndCopyCode() {
    // Собираем настройки из формы
    const settings = this.collectData();

    // Фиксированные классы для закрывающих элементов
    const closeBtnClass = "pop-up__inside-close-button";
    const overlayClass = "pop-up__overlay";

    // Генерируем код и выводим его (например, для отладки)
    const generatedCode = this.generateCode(
      settings,
      closeBtnClass,
      overlayClass
    );
    if (this.elements.jsCode) {
      this.elements.jsCode.textContent = generatedCode;
    }
    // Копируем код в буфер обмена
    this.copyAndNotify(generatedCode);
  }

  collectData() {
    const { inputs } = this.elements;
    return {
      cookieName: this.config.cookieName,
      expiryDays: inputs.expiryDays?.value || this.config.expiryDays,
      popupClass: inputs.popupClass?.value || this.config.popupClass,
      consentBtnClass:
        inputs.consentBtnClass?.value || this.config.consentBtnClass,
      rejectBtnClass:
        inputs.rejectBtnClass?.value || this.config.rejectBtnClass,
    };
  }

  generateCode(settings, closeBtnClass, overlayClass) {
    return `<script>
document.addEventListener("DOMContentLoaded", () => {
  // Функции для работы с cookie
  const cookies = {
    get: (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : undefined;
    },
    set: (name, value, options = {}) => {
      options = { path: '/', ...options };
      if (options.expires) {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        options.expires = date.toUTCString();
      }
      let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      for (const [key, val] of Object.entries(options)) {
        updatedCookie += '; ' + key + (val !== true ? '=' + val : '');
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

  const hideBanner = () => {
    if (ui.banner) ui.banner.style.display = "none";
  };

  // Если cookie отсутствует и баннер найден – показываем баннер и назначаем обработчики
  if (cookies.get("${settings.cookieName}") === undefined && ui.banner) {
    ui.banner.style.display = "flex";
    ui.closeBtn?.addEventListener("click", hideBanner, { once: true });
    ui.overlay?.addEventListener("click", hideBanner, { once: true });
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
</script>`;
  }
}

// Вспомогательная функция для создания и инициализации генератора
const createAndInitGenerator = (generatorId, GeneratorClass) => {
  if (document.getElementById(generatorId)) {
    const generator = new GeneratorClass();
    generator.init();
    return generator;
  }
  return null;
};

// Инициализация генератора при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  createAndInitGenerator("cookie-generator", CookieGenerator);
});

// Экспорт для инициализации через Docsify
window.initCookieGenerator = () =>
  createAndInitGenerator("cookie-generator", CookieGenerator);

