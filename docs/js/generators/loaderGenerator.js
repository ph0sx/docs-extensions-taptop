import { BaseGenerator } from "./base/baseGenerator.js";

const LOADER_PREVIEW_CLASS = "taptop-loader-preview"; // Класс для стилизации превью

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
    };

    // Привязка обработчиков
    this._boundUpdatePreview = this._updatePreview.bind(this);
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

    // Проверка наличия ключевых элементов
    if (
      !this.elements.animationTypeSelect ||
      !this.elements.bgColorInput ||
      !this.elements.animationColorInput ||
      !this.elements.minDisplayTimeInput ||
      !this.elements.hideDelayInput ||
      !this.elements.hideDurationInput ||
      !this.elements.previewArea ||
      !this.elements.previewAnimationContainer
    ) {
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

    const elementsToWatch = [
      this.elements.animationTypeSelect,
      this.elements.bgColorInput,
      this.elements.animationColorInput,
      this.elements.minDisplayTimeInput,
      this.elements.hideDelayInput,
      this.elements.hideDurationInput,
    ];

    elementsToWatch.forEach((el) => {
      if (el) {
        const eventType = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(eventType, this._boundUpdatePreview);
      }
    });
  }

  /**
   * @override
   */
  unbindEvents() {
    const elementsToUnwatch = [
      this.elements.animationTypeSelect,
      this.elements.bgColorInput,
      this.elements.animationColorInput,
      this.elements.minDisplayTimeInput,
      this.elements.hideDelayInput,
      this.elements.hideDurationInput,
    ];

    elementsToUnwatch.forEach((el) => {
      if (el) {
        const eventType = el.tagName === "SELECT" ? "change" : "input";
        el.removeEventListener(eventType, this._boundUpdatePreview);
      }
    });

    super.unbindEvents();
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

    this._updatePreview(); // Показываем начальное превью
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
      animationColor,
      minDisplayTime,
      hideDelay,
      hideDuration,
    };
  }

  /**
   * @override
   * Переопределяем для добавления валидации перед генерацией.
   */
  generateAndCopyCode() {
    const settings = this.collectData();
    if (settings === null) {
      // Проверка на ошибку валидации
      console.warn(
        "[LoaderGenerator] Генерация кода прервана из-за ошибки валидации."
      );
      return;
    }
    const code = this.generateCode(settings);
    if (this.elements.jsCode) {
      this.elements.jsCode.textContent = code;
    }
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
    } = settings;

    const loaderId = "taptop-loader-generated";
    const overlayClass = "taptop-loader__overlay";
    const animationContainerClass = "taptop-loader__animation";
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
                    .${animationContainerClass} { display: flex; }
                    .taptop-loader__dot {
                        width: 12px; height: 12px; margin: 0 5px; background-color: ${animationColor};
                        border-radius: 50%; display: inline-block;
                        animation: taptop-loader-dots-bounce 1.4s infinite ease-in-out both;
                    }
                    .taptop-loader__dot:nth-child(1) { animation-delay: -0.32s; }
                    .taptop-loader__dot:nth-child(2) { animation-delay: -0.16s; }
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
                    .taptop-loader__bar {
                        background-color: ${animationColor}; height: 100%; width: 6px; margin: 0 2px;
                        display: inline-block; animation: taptop-loader-bars-stretch 1.2s infinite ease-in-out;
                    }
                    .taptop-loader__bar:nth-child(1) { animation-delay: -1.1s; }
                    .taptop-loader__bar:nth-child(2) { animation-delay: -1.0s; }
                    .taptop-loader__bar:nth-child(3) { animation-delay: -0.9s; }
                    .taptop-loader__bar:nth-child(4) { animation-delay: -0.8s; }
                    .taptop-loader__bar:nth-child(5) { animation-delay: -0.7s; }
                    @keyframes taptop-loader-bars-stretch {
                        0%, 40%, 100% { transform: scaleY(0.4); }
                        20% { transform: scaleY(1.0); }
                    }`;
        break;
      case "spinner": // По умолчанию
      default:
        animationHtml = `<div class="${animationContainerClass} taptop-loader__spinner"></div>`;
        animationCss = `
                    .taptop-loader__spinner {
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

    return `<style>
  .${overlayClass} {
    position: fixed; inset: 0; background-color: ${bgColor};
    z-index: 99999; display: flex; align-items: center; justify-content: center;
    opacity: 1; transition: opacity ${hideDuration}ms ease-out;
  }
  .${hiddenClass} { opacity: 0; pointer-events: none; }
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
    const startTime = Date.now(); let pageLoaded = false; let minTimeElapsed = false;

    const hideLoader = () => {
        const elapsedTime = Date.now() - startTime;
        const timeToShow = Math.max(0, config.minDisplayTime - elapsedTime);
        setTimeout(() => {
             loaderElement.classList.add('${hiddenClass}');
             setTimeout(() => { loaderElement.remove(); }, config.hideDuration);
        }, config.hideDelay + timeToShow);
    };

    setTimeout(() => { minTimeElapsed = true; if (pageLoaded) hideLoader(); }, config.minDisplayTime);
    window.addEventListener('load', () => { pageLoaded = true; if (minTimeElapsed) hideLoader(); });
    // Fallback timeout
    // setTimeout(() => { if (!pageLoaded) { console.warn('Taptop Loader: Load timeout'); hideLoader(); } }, 15000);
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

    const { animationType, bgColor, animationColor } =
      this.collectData() || this.configDefaults;

    this.elements.previewArea.style.backgroundColor = bgColor;
    const animContainer = this.elements.previewAnimationContainer;
    animContainer.innerHTML = ""; // Очищаем предыдущую анимацию
    animContainer.style.color = animationColor; // Для spinner, если он через border-color

    // Добавляем классы и структуру для выбранной анимации
    animContainer.classList.remove(
      "taptop-loader-preview--spinner",
      "taptop-loader-preview--dots",
      "taptop-loader-preview--bars"
    );

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
