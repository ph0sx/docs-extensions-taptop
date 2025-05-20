import { BaseGenerator } from "./base/baseGenerator.js";

const LOADER_PREVIEW_CLASS = "taptop-loader-preview"; // Класс для стилизации превью
const TARGET_CLASS = "taptop-custom-loader-animation"; // Наш фиксированный класс для кастомной анимации
const CUSTOM_PREVIEW_STYLE_ID = "loader-custom-preview-styles"; // ID для тега <style> в превью

export class LoaderGenerator extends BaseGenerator {
  constructor() {
    super();
    this.configDefaults = {
      animationType: "spinner",
      bgColor: "#ffffff",
      animationColor: "#4483f5",
      minDisplayTime: 500,
      hideDelay: 100,
      hideDuration: 300,
      customCssCode: "", // Новое свойство по умолчанию
    };

    // Привязка обработчиков
    this._boundUpdatePreview = this._updatePreview.bind(this);
    this._boundHandleAnimationTypeChange =
      this._handleAnimationTypeChange.bind(this);
  }

  /**
   * @override
   */
  findElements() {
    super.findElements(); // Находим базовые элементы

    this.elements.animationTypeSelect = document.getElementById(
      "loader-animation-type"
    );
    this.elements.bgColorInput = document.getElementById("loader-bg-color");
    this.elements.animationColorInput = document.getElementById(
      "loader-animation-color"
    );
    this.elements.animationColorGroup = document.getElementById(
      // Группа для цвета анимации
      "loader-animation-color-group"
    );
    this.elements.animationColorHelper = document.getElementById(
      // Helper-text для цвета анимации
      "loader-animation-color-helper"
    );
    this.elements.minDisplayTimeInput = document.getElementById(
      "loader-min-display-time"
    );
    this.elements.hideDelayInput = document.getElementById("loader-hide-delay");
    this.elements.hideDurationInput = document.getElementById(
      "loader-hide-duration"
    );
    this.elements.previewArea = document.getElementById("loader-preview-area");
    this.elements.previewAnimationContainer =
      this.elements.previewArea?.querySelector(".loader-preview__animation");

    // Новые элементы для Custom CSS
    this.elements.customCssInput = document.getElementById("loader-custom-css");
    this.elements.customCssGroup = document.getElementById(
      "loader-custom-css-group"
    );

    // Проверка наличия ключевых элементов
    const requiredBaseElements =
      !this.elements.animationTypeSelect ||
      !this.elements.bgColorInput ||
      !this.elements.animationColorInput ||
      !this.elements.animationColorGroup ||
      !this.elements.animationColorHelper ||
      !this.elements.minDisplayTimeInput ||
      !this.elements.hideDelayInput ||
      !this.elements.hideDurationInput ||
      !this.elements.previewArea ||
      !this.elements.previewAnimationContainer;

    const requiredCustomElements =
      !this.elements.customCssInput || !this.elements.customCssGroup;

    if (requiredBaseElements || requiredCustomElements) {
      console.error("LoaderGenerator: Не найдены все необходимые элементы UI.");
      if (this.elements.generateButton) {
        this.elements.generateButton.disabled = true;
        this.elements.generateButton.title =
          "Ошибка: не найдены элементы интерфейса.";
      }
    }
  }

  /**
   * @override
   */
  bindEvents() {
    super.bindEvents();

    const elementsToWatchForPreview = [
      this.elements.bgColorInput,
      this.elements.animationColorInput,
      this.elements.minDisplayTimeInput,
      this.elements.hideDelayInput,
      this.elements.hideDurationInput,
    ];

    elementsToWatchForPreview.forEach((el) => {
      if (el) {
        // Используем 'input' для color picker и number, 'change' для select
        const eventType =
          el.type === "color" || el.type === "number" ? "input" : "change";
        el.addEventListener(eventType, this._boundUpdatePreview);
      }
    });

    // Отдельный обработчик для типа анимации, т.к. он меняет UI
    if (this.elements.animationTypeSelect) {
      this.elements.animationTypeSelect.addEventListener(
        "change",
        this._boundHandleAnimationTypeChange
      );
    }

    // Слушатель для textarea с Custom CSS
    if (this.elements.customCssInput) {
      this.elements.customCssInput.addEventListener(
        "input",
        this._boundUpdatePreview
      ); // Временно без debounce для теста
    }
  }

  /**
   * @override
   */
  unbindEvents() {
    const elementsToUnwatch = [
      this.elements.bgColorInput,
      this.elements.animationColorInput,
      this.elements.minDisplayTimeInput,
      this.elements.hideDelayInput,
      this.elements.hideDurationInput,
    ];

    elementsToUnwatch.forEach((el) => {
      if (el) {
        const eventType =
          el.type === "color" || el.type === "number" ? "input" : "change";
        el.removeEventListener(eventType, this._boundUpdatePreview);
      }
    });

    if (this.elements.animationTypeSelect) {
      this.elements.animationTypeSelect.removeEventListener(
        "change",
        this._boundHandleAnimationTypeChange
      );
    }
    if (this.elements.customCssInput) {
      this.elements.customCssInput.removeEventListener(
        "input",
        this._debouncedUpdatePreview
      );
    }

    super.unbindEvents();
  }

  /**
   * Обрабатывает изменение типа анимации, управляя видимостью UI элементов.
   * @private
   */
  _handleAnimationTypeChange() {
    const selectedType = this.elements.animationTypeSelect?.value;
    const isCustom = selectedType === "custom";

    if (this.elements.customCssGroup) {
      this.elements.customCssGroup.style.display = isCustom ? "" : "none";
    }
    if (this.elements.animationColorGroup) {
      this.elements.animationColorGroup.style.display = isCustom ? "none" : "";
    }
    if (this.elements.animationColorHelper) {
      this.elements.animationColorHelper.textContent = isCustom
        ? "Основной цвет анимации задается в вашем Custom CSS."
        : "Основной цвет анимированных элементов.";
    }

    this._updatePreview(); // Обновляем предпросмотр при смене типа
  }

  /**
   * @override
   */
  setInitialState() {
    if (!this.elements.animationTypeSelect) {
      console.warn(
        "LoaderGenerator: Элементы UI не найдены, не могу установить начальное состояние."
      );
      return;
    }
    this.elements.animationTypeSelect.value = this.configDefaults.animationType;
    this.elements.bgColorInput.value = this.configDefaults.bgColor;
    this.elements.animationColorInput.value =
      this.configDefaults.animationColor;
    this.elements.minDisplayTimeInput.value =
      this.configDefaults.minDisplayTime;
    this.elements.hideDelayInput.value = this.configDefaults.hideDelay;
    this.elements.hideDurationInput.value = this.configDefaults.hideDuration;

    if (this.elements.customCssInput) {
      this.elements.customCssInput.value = this.configDefaults.customCssCode;
    }

    this._handleAnimationTypeChange(); // Устанавливаем видимость полей и обновляем превью
  }

  /**
   * Экранирует строку для использования в регулярном выражении.
   * @param {string} str Исходная строка.
   * @returns {string} Экранированная строка.
   * @private
   */
  _escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& означает всю совпавшую подстроку
  }

  /**
   * Обрабатывает пользовательский CSS, заменяя класс .loader на целевой класс.
   * @param {string} cssCode Пользовательский CSS.
   * @param {string} originalClass Исходный класс (например, "loader").
   * @param {string} targetClass Целевой класс (например, "taptop-custom-loader-animation").
   * @returns {string} Обработанный CSS.
   * @private
   */
  _processCustomCss(cssCode, originalClass, targetClass) {
    if (!cssCode || !originalClass || !targetClass) {
      return cssCode || "";
    }
    // Более точный regex, чтобы заменять только класс `.loader`, а не, например, `.loader-wrapper`
    // Заменяет .loader, но не .loader-suffix или .loaderSomething
    const classSelectorRegex = new RegExp(
      `\\.${this._escapeRegExp(originalClass)}(?![-\\w])`,
      "g"
    );
    let processedCss = cssCode.replace(classSelectorRegex, `.${targetClass}`);

    // Дополнительно обработаем случаи, когда псевдоэлементы написаны слитно или селекторы атрибутов
    // Это упрощенная обработка и может не покрыть все случаи, но покроет основные с css-loaders.com
    const pseudoElements = ["before", "after"];
    pseudoElements.forEach((pseudo) => {
      const pseudoRegexDoubleColon = new RegExp(
        `\\.${this._escapeRegExp(originalClass)}::${pseudo}(?![-\\w])`,
        "g"
      );
      const pseudoRegexSingleColon = new RegExp(
        `\\.${this._escapeRegExp(originalClass)}:${pseudo}(?![-\\w])`,
        "g"
      );
      processedCss = processedCss.replace(
        pseudoRegexDoubleColon,
        `.${targetClass}::${pseudo}`
      );
      processedCss = processedCss.replace(
        pseudoRegexSingleColon,
        `.${targetClass}:${pseudo}`
      );
    });

    return processedCss;
  }

  /**
   * @override
   */
  collectData() {
    const animationType = this.elements.animationTypeSelect?.value || "spinner";
    const bgColor = this.elements.bgColorInput?.value || "#ffffff";
    const animationColor =
      this.elements.animationColorInput?.value || "#4483f5";
    const minDisplayTime = parseInt(
      this.elements.minDisplayTimeInput?.value,
      10
    );
    const hideDelay = parseInt(this.elements.hideDelayInput?.value, 10);
    const hideDuration = parseInt(this.elements.hideDurationInput?.value, 10);
    let customCssCode = "";

    if (animationType === "custom") {
      customCssCode = this.elements.customCssInput?.value.trim() || "";
    }

    // Валидация
    if (isNaN(minDisplayTime) || minDisplayTime < 0) {
      this.showErrorModal(
        "Минимальное время показа должно быть неотрицательным числом."
      );
      return null;
    }
    if (isNaN(hideDelay) || hideDelay < 0) {
      this.showErrorModal(
        "Задержка перед скрытием должна быть неотрицательным числом."
      );
      return null;
    }
    if (isNaN(hideDuration) || hideDuration < 0) {
      this.showErrorModal(
        "Длительность скрытия должна быть неотрицательным числом."
      );
      return null;
    }

    return {
      animationType,
      bgColor,
      animationColor, // Будет использоваться только для стандартных анимаций
      minDisplayTime,
      hideDelay,
      hideDuration,
      customCssCode, // Передаем Custom CSS
    };
  }

  /**
   * @override
   * Переопределяем для добавления специфичной валидации перед генерацией.
   */
  generateAndCopyCode() {
    const settings = this.collectData();
    if (!settings) return; 

    // Специфичная валидация для LoaderGenerator
    if (settings.animationType === "custom" && !settings.customCssCode) {
      this.showErrorModal(
        "Для типа 'Custom CSS' необходимо вставить CSS-код загрузчика."
      );
      return; 
    }

    const code = this.generateCode(settings);
    this.copyAndNotify(code);
  }

  /**
   * @override
   */
  generateCode(settings) {
    if (!settings) return "";

    const {
      animationType,
      bgColor,
      animationColor,
      minDisplayTime,
      hideDelay,
      hideDuration,
      customCssCode,
    } = settings;

    const loaderId = "taptop-loader-generated";
    const overlayClass = "taptop-loader__overlay";
    const animationContainerClass = "taptop-loader__animation"; // Класс для контейнера, куда вставляется HTML анимации
    const hiddenClass = "taptop-loader--hidden";

    let animationHtml = "";
    let animationCss = "";

    // CSS Keyframes и HTML для разных анимаций
    switch (animationType) {
      case "dots":
        animationHtml = `
                    <div class="${animationContainerClass}">
                        <div class="taptop-loader__dot"></div>
                        <div class="taptop-loader__dot"></div>
                        <div class="taptop-loader__dot"></div>
                    </div>`;
        animationCss = `
                    .${animationContainerClass} > .taptop-loader__dot { 
                        width: 12px; height: 12px; margin: 0 5px; background-color: ${animationColor};
                        border-radius: 50%; display: inline-block;
                        animation: taptop-loader-dots-bounce 1.4s infinite ease-in-out both;
                    }
                    .${animationContainerClass} > .taptop-loader__dot:nth-child(1) { animation-delay: -0.32s; }
                    .${animationContainerClass} > .taptop-loader__dot:nth-child(2) { animation-delay: -0.16s; }
                    @keyframes taptop-loader-dots-bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1.0); }
                    }`;
        break;
      case "bars":
        animationHtml = `
                    <div class="${animationContainerClass}">
                        <div class="taptop-loader__bar"></div>
                        <div class="taptop-loader__bar"></div>
                        <div class="taptop-loader__bar"></div>
                        <div class="taptop-loader__bar"></div>
                        <div class="taptop-loader__bar"></div>
                    </div>`;
        animationCss = `
                    .${animationContainerClass} { display: flex; align-items: center; height: 50px; }
                    .${animationContainerClass} > .taptop-loader__bar { /* Уточнили селектор */
                        background-color: ${animationColor}; height: 100%; width: 6px; margin: 0 2px;
                        display: inline-block; animation: taptop-loader-bars-stretch 1.2s infinite ease-in-out;
                    }
                    .${animationContainerClass} > .taptop-loader__bar:nth-child(1) { animation-delay: -1.1s; }
                    .${animationContainerClass} > .taptop-loader__bar:nth-child(2) { animation-delay: -1.0s; }
                    .${animationContainerClass} > .taptop-loader__bar:nth-child(3) { animation-delay: -0.9s; }
                    .${animationContainerClass} > .taptop-loader__bar:nth-child(4) { animation-delay: -0.8s; }
                    .${animationContainerClass} > .taptop-loader__bar:nth-child(5) { animation-delay: -0.7s; }
                    @keyframes taptop-loader-bars-stretch {
                        0%, 40%, 100% { transform: scaleY(0.4); }
                        20% { transform: scaleY(1.0); }
                    }`;
        break;
      case "custom":
        animationHtml = `<div class="${animationContainerClass}"><div class="${TARGET_CLASS}"></div></div>`; // Наш HTML для кастомного лоадера
        animationCss = this._processCustomCss(
          customCssCode,
          "loader",
          TARGET_CLASS
        ); 
        break;
      case "spinner":
      default:
        animationHtml = `<div class="${animationContainerClass}"><div class="taptop-loader__spinner"></div></div>`; // Обернули spinner в animationContainerClass
        animationCss = `
                    .${animationContainerClass} > .taptop-loader__spinner { /* Уточнили селектор */
                        width: 40px; height: 40px; border: 4px solid rgba(0,0,0,0.1);
                        border-left-color: ${animationColor}; border-radius: 50%;
                        animation: taptop-loader-spin 1s linear infinite;
                    }
                    @keyframes taptop-loader-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }`;
        break;
    }

    // Общий CSS для оверлея и контейнера анимации
    const commonCss = `
  .${overlayClass} {
    position: fixed; inset: 0; background-color: ${bgColor};
    z-index: 99999; display: flex; align-items: center; justify-content: center;
    opacity: 1; transition: opacity ${hideDuration}ms ease-out;
  }
  .${hiddenClass} { opacity: 0; pointer-events: none; }
  .${animationContainerClass} { /* Стили для общего контейнера анимации */
    display: flex; /* По умолчанию, чтобы центрировать содержимое */
    align-items: center;
    justify-content: center;
  }
  `;

    return `<style>
  ${commonCss}
  ${animationCss}
</style>
<div id="${loaderId}" class="${overlayClass}">
  ${animationHtml}
</div>
<script>
  (function() {
    const loaderElement = document.getElementById('${loaderId}');
    if (!loaderElement) return;
    const config = {
        minDisplayTime: ${minDisplayTime}, hideDelay: ${hideDelay}, hideDuration: ${hideDuration}
    };
    let pageLoaded = false;
    const startTime = Date.now();

    function attemptToHideLoader() {
        if (!pageLoaded) return; // Если страница еще не загружена, ничего не делаем

        const elapsedTime = Date.now() - startTime;
        const timeToShowFurther = Math.max(0, config.minDisplayTime - elapsedTime);

        setTimeout(() => {
            loaderElement.classList.add('${hiddenClass}');
            setTimeout(() => {
                loaderElement.remove();
            }, config.hideDuration);
        }, config.hideDelay + timeToShowFurther);
    }

    window.addEventListener('load', () => {
        pageLoaded = true;
        attemptToHideLoader();
    });

    // Если minDisplayTime > 0, ставим таймер, чтобы учесть его, даже если 'load' сработает раньше
    if (config.minDisplayTime > 0) {
        setTimeout(() => {
            attemptToHideLoader(); // Попытаться скрыть, если страница уже загрузилась
        }, config.minDisplayTime - (Date.now() - startTime) > 0 ? config.minDisplayTime - (Date.now() - startTime) : 0);
    } 
    
    // Fallback на случай, если событие 'load' по какой-то причине не сработает (очень редкий случай)
    setTimeout(() => {
        if (!pageLoaded && loaderElement.parentElement) { // Если он еще не удален
            console.warn('Taptop Loader: Fallback timeout triggered. Forcing hide.');
            pageLoaded = true; // Считаем страницу загруженной для логики скрытия
            attemptToHideLoader();
        }
    }, Math.max(15000, config.minDisplayTime + config.hideDelay + config.hideDuration + 2000)); // Даем запас времени
  })();
</script>
`;
  }

  /**
   * Обновляет превью лоадера.
   * @private
   */
  _updatePreview() {
    if (!this.elements.previewArea || !this.elements.previewAnimationContainer)
      return;

    const data = this.collectData(); 
    if (!data && this.elements.animationTypeSelect?.value === "custom") {
      const existingCustomStyleTag = document.getElementById(
        CUSTOM_PREVIEW_STYLE_ID
      );
      if (existingCustomStyleTag) existingCustomStyleTag.innerHTML = "";
      this.elements.previewAnimationContainer.innerHTML = ""; 
      return;
    }

    const { animationType, bgColor, animationColor, customCssCode } =
      data || this.configDefaults;

    this.elements.previewArea.style.backgroundColor = bgColor;
    const animContainer = this.elements.previewAnimationContainer;
    animContainer.innerHTML = ""; 

    // Удаляем или очищаем тег <style> для кастомного CSS, если он больше не нужен
    const existingCustomStyleTag = document.getElementById(
      CUSTOM_PREVIEW_STYLE_ID
    );
    if (animationType !== "custom" && existingCustomStyleTag) {
      existingCustomStyleTag.innerHTML = ""; // Очищаем его содержимое
    }

    // Удаляем все классы типов анимации перед добавлением нового
    animContainer.className = "loader-preview__animation"; 

    if (animationType === "custom") {
      animContainer.innerHTML = `<div class="${TARGET_CLASS}"></div>`;
      const processedCss = this._processCustomCss(
        customCssCode,
        "loader",
        TARGET_CLASS
      );

      let styleTag = document.getElementById(CUSTOM_PREVIEW_STYLE_ID);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = CUSTOM_PREVIEW_STYLE_ID;
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = processedCss;
    } else {
      // Логика для стандартных анимаций
      animContainer.style.color = animationColor; // Для spinner, если он через border-color

      switch (animationType) {
        case "dots":
          animContainer.classList.add("taptop-loader-preview--dots");
          animContainer.innerHTML = `
                      <div style="background-color: ${animationColor}"></div>
                      <div style="background-color: ${animationColor}"></div>
                      <div style="background-color: ${animationColor}"></div>`;
          break;
        case "bars":
          animContainer.classList.add("taptop-loader-preview--bars");
          animContainer.innerHTML = `
                      <div style="background-color: ${animationColor}"></div>
                      <div style="background-color: ${animationColor}"></div>
                      <div style="background-color: ${animationColor}"></div>
                      <div style="background-color: ${animationColor}"></div>
                      <div style="background-color: ${animationColor}"></div>`;
          break;
        case "spinner":
        default:
          animContainer.classList.add("taptop-loader-preview--spinner");
          animContainer.style.borderColor = "rgba(0,0,0,0.1)"; 
          animContainer.style.borderLeftColor = animationColor; 
          break;
      }
    }
  }
}
