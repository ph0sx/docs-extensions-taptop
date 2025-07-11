// Loader Generator Web Component для Taptop
class LoaderGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;
    this.configDefaults = {
      animationType: "spinner",
      bgColor: "#ffffff",
      animationColor: "#4483f5",
      minDisplayTime: 500,
      hideDelay: 100,
      hideDuration: 300,
      customCssCode: "",
    };
  }

  async connectedCallback() {
    if (!this.initialized) {
      await this.init();
      this.initialized = true;
    }
  }

  disconnectedCallback() {
    this.destroy();
  }

  async init() {
    await this.render();
    this.findElements();
    this.bindEvents();
    this.setInitialState();
  }

  async render() {
    const template = this.getTemplate();
    const styles = this.getStyles();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
  }

  getStyles() {
    return `
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      .loader-generator {
        --primary-color: #4483f5;
        --primary-hover: #3a70d1;
        --primary-light: rgba(68, 131, 245, 0.15);
        --primary-gradient: linear-gradient(90deg, #4483f5 0%, #5e6ffd 100%);
        --text-dark: #333333;
        --text-medium: #555555;
        --text-light: #777777;
        --border-color: #dddddd;
        --bg-light: #f8f9fa;
        --shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
        --radius-sm: 6px;
        --radius-md: 10px;
        --transition: all 0.2s ease;

        background: linear-gradient(to bottom, #f8f9fa, #f0f3f7);
        padding: 15px;
        border-radius: var(--radius-md);
        width: 100%;
        max-width: 100%;
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0, 0, 0, 0.05);
        color: var(--text-dark);
        overflow: hidden;
        min-width: 350px;
      }

      .form-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
        background: white;
        padding: 15px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        width: 100%;
        max-width: 100%;
        max-height: calc(100vh - 65px - 76px - 55px - 97px - 55px);
        overflow: auto;
        min-height: 0;
      }

      .setting-group {
        width: 100%;
        min-width: 0;
        flex-shrink: 1;
      }

      .setting-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-dark);
        font-size: 14px;
      }

      .text-input, .number-input, .select-styled {
        width: 100%;
        max-width: 100%;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        font-size: 14px;
        color: var(--text-dark);
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
        box-sizing: border-box;
        min-width: 0;
        background: white;
      }

      .text-input:focus, .number-input:focus, .select-styled:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
      }

      .select-styled {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 8px center;
        background-repeat: no-repeat;
        background-size: 16px;
        padding-right: 32px;
      }

      .helper-text {
        font-size: 13px;
        color: var(--text-light);
        margin-top: 5px;
        line-height: 1.4;
      }

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-dark);
        padding-bottom: 8px;
        border-bottom: 2px solid var(--bg-light);
      }

      .action-section {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }

      .generate-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 24px;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
        box-shadow: 0 4px 12px rgba(68, 131, 245, 0.3);
      }

      .generate-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(68, 131, 245, 0.4);
      }

      .generate-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(68, 131, 245, 0.3);
      }

      .color-input {
        height: 40px;
        padding: 4px;
        width: 100%;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: var(--transition);
        box-shadow: var(--shadow-sm);
      }

      .color-input:hover {
        border-color: var(--primary-color);
      }

      .textarea-input {
        min-height: 120px;
        resize: vertical;
        font-family: monospace;
        font-size: 13px;
        line-height: 1.4;
      }

      .conditional-field {
        margin-top: 10px;
        transition: all 0.3s ease;
      }

      .conditional-field.hidden {
        display: none;
      }

      .preview-section {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid var(--border-color);
      }

      .preview-title {
        text-align: center;
        border-bottom: none;
        margin-bottom: 15px;
        color: var(--primary-color);
        font-size: 16px;
        font-weight: 600;
      }

      .preview-area {
        position: relative;
        width: 100%;
        height: 150px;
        border-radius: var(--radius-md);
        border: 1px dashed var(--border-color);
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: background-color 0.3s ease;
      }

      .preview-animation {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Анимации для превью */
      .preview-animation.spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .preview-animation.dots {
        display: flex;
        gap: 5px;
      }

      .preview-animation.dots div {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
      }

      .preview-animation.dots div:nth-child(1) { animation-delay: -0.32s; }
      .preview-animation.dots div:nth-child(2) { animation-delay: -0.16s; }

      .preview-animation.bars {
        display: flex;
        align-items: center;
        height: 40px;
        gap: 2px;
      }

      .preview-animation.bars div {
        width: 6px;
        height: 100%;
        animation: stretch 1.2s infinite ease-in-out;
      }

      .preview-animation.bars div:nth-child(1) { animation-delay: -1.1s; }
      .preview-animation.bars div:nth-child(2) { animation-delay: -1.0s; }
      .preview-animation.bars div:nth-child(3) { animation-delay: -0.9s; }
      .preview-animation.bars div:nth-child(4) { animation-delay: -0.8s; }
      .preview-animation.bars div:nth-child(5) { animation-delay: -0.7s; }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }

      @keyframes stretch {
        0%, 40%, 100% { transform: scaleY(0.4); }
        20% { transform: scaleY(1.0); }
      }
    `;
  }

  getTemplate() {
    return `
      <div class="loader-generator">
        <div class="form-grid">
          <div class="section-title">1. Внешний вид</div>
          
          <div class="setting-group">
            <label for="animation-type">Тип анимации:</label>
            <select id="animation-type" class="select-styled">
              <option value="spinner" selected>Spinner (Круг)</option>
              <option value="dots">Dots (Точки)</option>
              <option value="bars">Bars (Полосы)</option>
              <option value="custom">Custom CSS</option>
            </select>
          </div>

          <div class="setting-group">
            <label for="bg-color">Цвет фона оверлея:</label>
            <input type="color" id="bg-color" class="color-input" value="#ffffff">
            <div class="helper-text">Цвет фона, перекрывающего страницу</div>
          </div>

          <div class="setting-group" id="animation-color-group">
            <label for="animation-color">Цвет анимации:</label>
            <input type="color" id="animation-color" class="color-input" value="#4483f5">
            <div class="helper-text">Основной цвет анимированных элементов</div>
          </div>

          <div class="setting-group conditional-field hidden" id="custom-css-group">
            <label for="custom-css">CSS-код загрузчика:</label>
            <textarea id="custom-css" class="text-input textarea-input" placeholder="/* HTML: <div class=&quot;loader&quot;></div> */&#10;.loader {&#10;  /* ... стили вашего лоадера ... */&#10;}"></textarea>
            <div class="helper-text">Вставьте CSS с сайта css-loaders.com или cssloaders.github.io. Класс .loader будет автоматически адаптирован.</div>
          </div>

          <div class="section-title">2. Тайминги</div>

          <div class="setting-group">
            <label for="min-display-time">Мин. длительность показа (мс):</label>
            <input type="number" id="min-display-time" class="number-input" value="500" min="0" step="100">
            <div class="helper-text">Минимальное время показа лоадера. 0 = отключить</div>
          </div>

          <div class="setting-group">
            <label for="hide-delay">Пауза перед скрытием (мс):</label>
            <input type="number" id="hide-delay" class="number-input" value="100" min="0" step="50">
            <div class="helper-text">Пауза после загрузки контента. 0 = отключить</div>
          </div>

          <div class="setting-group">
            <label for="hide-duration">Плавность исчезновения (мс):</label>
            <input type="number" id="hide-duration" class="number-input" value="300" min="0" step="50">
            <div class="helper-text">Время анимации fade-out при скрытии</div>
          </div>

          <div class="preview-section">
            <div class="preview-title">Предпросмотр</div>
            <div class="preview-area" id="preview-area">
              <div class="preview-animation" id="preview-animation"></div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <button class="generate-button" id="generate-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Сгенерировать код</span>
          </button>
        </div>
      </div>
    `;
  }

  findElements() {
    // Внутренние элементы (в Shadow DOM)
    this.elements.generateBtn = this.shadowRoot.getElementById("generate-btn");
    this.elements.animationType = this.shadowRoot.getElementById("animation-type");
    this.elements.bgColor = this.shadowRoot.getElementById("bg-color");
    this.elements.animationColor = this.shadowRoot.getElementById("animation-color");
    this.elements.animationColorGroup = this.shadowRoot.getElementById("animation-color-group");
    this.elements.customCss = this.shadowRoot.getElementById("custom-css");
    this.elements.customCssGroup = this.shadowRoot.getElementById("custom-css-group");
    this.elements.minDisplayTime = this.shadowRoot.getElementById("min-display-time");
    this.elements.hideDelay = this.shadowRoot.getElementById("hide-delay");
    this.elements.hideDuration = this.shadowRoot.getElementById("hide-duration");
    this.elements.previewArea = this.shadowRoot.getElementById("preview-area");
    this.elements.previewAnimation = this.shadowRoot.getElementById("preview-animation");

    // Внешние элементы модалки
    this.elements.successPopup = document.querySelector(".pop-up-success");
    this.elements.popupAcceptBtn = document.querySelector("[data-popup-accept-btn]");
    this.elements.popupCloseBtn = document.querySelector("[data-popup-close-btn]");
  }

  bindEvents() {
    // Обработчик для кнопки генерации
    if (this.elements.generateBtn) {
      const handler = () => this.generateCode();
      this.eventHandlers.set("generate", handler);
      this.elements.generateBtn.addEventListener("click", handler);
    }

    // Обработчики для обновления превью
    const previewElements = [
      this.elements.bgColor,
      this.elements.animationColor,
      this.elements.customCss
    ];

    previewElements.forEach(el => {
      if (el) {
        const eventType = el.type === "color" ? "input" : "input";
        const handler = () => this.updatePreview();
        this.eventHandlers.set(`preview-${el.id}`, handler);
        el.addEventListener(eventType, handler);
      }
    });

    // Обработчик для изменения типа анимации
    if (this.elements.animationType) {
      const handler = () => this.handleAnimationTypeChange();
      this.eventHandlers.set("animation-type-change", handler);
      this.elements.animationType.addEventListener("change", handler);
    }

    this.bindModalEvents();
  }

  bindModalEvents() {
    // Обработчики для попапа успеха
    if (this.elements.popupAcceptBtn) {
      const handler = () => this.hideSuccessPopup();
      this.eventHandlers.set("popup-accept", handler);
      this.elements.popupAcceptBtn.addEventListener("click", handler);
    }

    if (this.elements.popupCloseBtn) {
      const handler = () => this.hideSuccessPopup();
      this.eventHandlers.set("popup-close", handler);
      this.elements.popupCloseBtn.addEventListener("click", handler);
    }

    // Обработчик клика за пределы попапа
    if (this.elements.successPopup) {
      const handler = (event) => {
        if (event.target === this.elements.successPopup) {
          this.hideSuccessPopup();
        }
      };
      this.eventHandlers.set("popup-overlay", handler);
      this.elements.successPopup.addEventListener("click", handler);
    }
  }

  setInitialState() {
    if (!this.elements.animationType) return;

    this.elements.animationType.value = this.configDefaults.animationType;
    this.elements.bgColor.value = this.configDefaults.bgColor;
    this.elements.animationColor.value = this.configDefaults.animationColor;
    this.elements.minDisplayTime.value = this.configDefaults.minDisplayTime;
    this.elements.hideDelay.value = this.configDefaults.hideDelay;
    this.elements.hideDuration.value = this.configDefaults.hideDuration;
    this.elements.customCss.value = this.configDefaults.customCssCode;

    this.handleAnimationTypeChange();
  }

  handleAnimationTypeChange() {
    const selectedType = this.elements.animationType?.value;
    const isCustom = selectedType === "custom";

    if (this.elements.customCssGroup) {
      this.elements.customCssGroup.classList.toggle("hidden", !isCustom);
    }
    if (this.elements.animationColorGroup) {
      this.elements.animationColorGroup.classList.toggle("hidden", isCustom);
    }

    this.updatePreview();
  }

  updatePreview() {
    if (!this.elements.previewArea || !this.elements.previewAnimation) return;

    const animationType = this.elements.animationType.value;
    const bgColor = this.elements.bgColor.value;
    const animationColor = this.elements.animationColor.value;
    const customCss = this.elements.customCss.value;

    // Обновляем фон превью
    this.elements.previewArea.style.backgroundColor = bgColor;

    // Очищаем предыдущую анимацию
    this.elements.previewAnimation.innerHTML = "";
    this.elements.previewAnimation.className = "preview-animation";

    // Удаляем старый кастомный стиль
    const existingCustomStyle = this.shadowRoot.getElementById("custom-preview-style");
    if (existingCustomStyle) {
      existingCustomStyle.remove();
    }

    switch (animationType) {
      case "spinner":
        this.elements.previewAnimation.classList.add("spinner");
        this.elements.previewAnimation.style.borderLeftColor = animationColor;
        break;
      case "dots":
        this.elements.previewAnimation.classList.add("dots");
        this.elements.previewAnimation.innerHTML = `
          <div style="background-color: ${animationColor}"></div>
          <div style="background-color: ${animationColor}"></div>
          <div style="background-color: ${animationColor}"></div>
        `;
        break;
      case "bars":
        this.elements.previewAnimation.classList.add("bars");
        this.elements.previewAnimation.innerHTML = `
          <div style="background-color: ${animationColor}"></div>
          <div style="background-color: ${animationColor}"></div>
          <div style="background-color: ${animationColor}"></div>
          <div style="background-color: ${animationColor}"></div>
          <div style="background-color: ${animationColor}"></div>
        `;
        break;
      case "custom":
        if (customCss) {
          this.elements.previewAnimation.innerHTML = `<div class="taptop-custom-loader-preview"></div>`;
          const processedCss = this.processCustomCss(customCss, "loader", "taptop-custom-loader-preview");
          const styleTag = document.createElement("style");
          styleTag.id = "custom-preview-style";
          styleTag.textContent = processedCss;
          this.shadowRoot.appendChild(styleTag);
        }
        break;
    }
  }

  processCustomCss(cssCode, originalClass, targetClass) {
    if (!cssCode || !originalClass || !targetClass) {
      return cssCode || "";
    }

    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const classSelectorRegex = new RegExp(`\\.${escapeRegExp(originalClass)}(?![-\\w])`, "g");
    let processedCss = cssCode.replace(classSelectorRegex, `.${targetClass}`);

    // Обработка псевдоэлементов
    const pseudoElements = ["before", "after"];
    pseudoElements.forEach((pseudo) => {
      const pseudoRegexDoubleColon = new RegExp(`\\.${escapeRegExp(originalClass)}::${pseudo}(?![-\\w])`, "g");
      const pseudoRegexSingleColon = new RegExp(`\\.${escapeRegExp(originalClass)}:${pseudo}(?![-\\w])`, "g");
      processedCss = processedCss.replace(pseudoRegexDoubleColon, `.${targetClass}::${pseudo}`);
      processedCss = processedCss.replace(pseudoRegexSingleColon, `.${targetClass}:${pseudo}`);
    });

    return processedCss;
  }

  collectData() {
    const animationType = this.elements.animationType?.value || "spinner";
    const bgColor = this.elements.bgColor?.value || "#ffffff";
    const animationColor = this.elements.animationColor?.value || "#4483f5";
    const minDisplayTime = parseInt(this.elements.minDisplayTime?.value, 10);
    const hideDelay = parseInt(this.elements.hideDelay?.value, 10);
    const hideDuration = parseInt(this.elements.hideDuration?.value, 10);
    let customCssCode = "";

    if (animationType === "custom") {
      customCssCode = this.elements.customCss?.value.trim() || "";
    }

    // Валидация
    if (isNaN(minDisplayTime) || minDisplayTime < 0) {
      alert("Минимальное время показа должно быть неотрицательным числом.");
      return null;
    }
    if (isNaN(hideDelay) || hideDelay < 0) {
      alert("Задержка перед скрытием должна быть неотрицательным числом.");
      return null;
    }
    if (isNaN(hideDuration) || hideDuration < 0) {
      alert("Длительность скрытия должна быть неотрицательным числом.");
      return null;
    }

    if (animationType === "custom" && !customCssCode) {
      alert("Для типа 'Custom CSS' необходимо вставить CSS-код загрузчика.");
      return null;
    }

    return {
      animationType,
      bgColor,
      animationColor,
      minDisplayTime,
      hideDelay,
      hideDuration,
      customCssCode,
    };
  }

  async generateCode() {
    try {
      const data = this.collectData();
      if (!data) return;

      const code = this.generateLoaderCode(data);
      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (error) {
      console.error("Ошибка генерации кода:", error);
      alert("Произошла ошибка при генерации кода. Попробуйте еще раз.");
    }
  }

  generateLoaderCode(settings) {
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
    const animationContainerClass = "taptop-loader__animation";
    const targetClass = "taptop-custom-loader-animation";
    const hiddenClass = "taptop-loader--hidden";

    let animationHtml = "";
    let animationCss = "";

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
          .${animationContainerClass} > .taptop-loader__bar {
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
        animationHtml = `<div class="${animationContainerClass}"><div class="${targetClass}"></div></div>`;
        animationCss = this.processCustomCss(customCssCode, "loader", targetClass);
        break;
      case "spinner":
      default:
        animationHtml = `<div class="${animationContainerClass}"><div class="taptop-loader__spinner"></div></div>`;
        animationCss = `
          .${animationContainerClass} > .taptop-loader__spinner {
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

    const commonCss = `
  .${overlayClass} {
    position: fixed; inset: 0; background-color: ${bgColor};
    z-index: 99999; display: flex; align-items: center; justify-content: center;
    opacity: 1; transition: opacity ${hideDuration}ms ease-out;
  }
  .${hiddenClass} { opacity: 0; pointer-events: none; }
  .${animationContainerClass} {
    display: flex; align-items: center; justify-content: center;
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
        if (!pageLoaded) return;

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

    if (config.minDisplayTime > 0) {
        setTimeout(() => {
            attemptToHideLoader();
        }, config.minDisplayTime - (Date.now() - startTime) > 0 ? config.minDisplayTime - (Date.now() - startTime) : 0);
    } 
    
    setTimeout(() => {
        if (!pageLoaded && loaderElement.parentElement) {
            console.warn('Taptop Loader: Fallback timeout triggered. Forcing hide.');
            pageLoaded = true;
            attemptToHideLoader();
        }
    }, Math.max(15000, config.minDisplayTime + config.hideDelay + config.hideDuration + 2000));
  })();
</script>`;
  }

  async copyToClipboard(code) {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Код скопирован в буфер обмена");
    } catch (error) {
      this.fallbackCopy(code);
    }
  }

  fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    try {
      textarea.select();
      const success = document.execCommand("copy");
      if (!success) {
        throw new Error("Не удалось скопировать код в буфер обмена");
      }
      console.log("Код скопирован в буфер обмена (fallback)");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  showSuccessPopup() {
    if (this.elements.successPopup) {
      this.elements.successPopup.style.display = "flex";
    }
  }

  hideSuccessPopup() {
    if (this.elements.successPopup) {
      this.elements.successPopup.style.display = "none";
    }
  }

  unbindEvents() {
    this.eventHandlers.forEach((handler, key) => {
      if (key.startsWith("preview-")) {
        const elementId = key.replace("preview-", "");
        const element = this.shadowRoot.getElementById(elementId);
        if (element) {
          const eventType = element.type === "color" ? "input" : "input";
          element.removeEventListener(eventType, handler);
        }
      }
    });

    if (this.elements.generateBtn && this.eventHandlers.has("generate")) {
      this.elements.generateBtn.removeEventListener("click", this.eventHandlers.get("generate"));
    }

    if (this.elements.animationType && this.eventHandlers.has("animation-type-change")) {
      this.elements.animationType.removeEventListener("change", this.eventHandlers.get("animation-type-change"));
    }

    this.unbindModalEvents();
    this.eventHandlers.clear();
  }

  unbindModalEvents() {
    if (this.elements.popupAcceptBtn && this.eventHandlers.has("popup-accept")) {
      this.elements.popupAcceptBtn.removeEventListener("click", this.eventHandlers.get("popup-accept"));
    }

    if (this.elements.popupCloseBtn && this.eventHandlers.has("popup-close")) {
      this.elements.popupCloseBtn.removeEventListener("click", this.eventHandlers.get("popup-close"));
    }

    if (this.elements.successPopup && this.eventHandlers.has("popup-overlay")) {
      this.elements.successPopup.removeEventListener("click", this.eventHandlers.get("popup-overlay"));
    }
  }

  destroy() {
    this.unbindEvents();
    this.initialized = false;
  }
}

// Регистрируем веб-компонент
customElements.define("loader-generator", LoaderGenerator);