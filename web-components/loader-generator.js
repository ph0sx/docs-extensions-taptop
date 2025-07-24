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
        scrollbar-width: thin;
        scrollbar-color: #A9A9A9 transparent;
      }

      /* Webkit browsers (Chrome, Safari, Edge) */
      *::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      *::-webkit-scrollbar-track {
        background: transparent;
      }

      *::-webkit-scrollbar-thumb {
        background: var(--grey-500, #A9A9A9);
        border-radius: 95px;
      }

      :host {
        /* Typography */
        --ttg-font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --ttg-font-weight-medium: 400;
        --ttg-letter-spacing: -0.02em;
        
        /* Text sizes */
        --ttg-text-size-m: 16px;
        --ttg-text-line-height-m: 24px;
        --ttg-text-size-s: 14px;
        --ttg-text-line-height-s: 20px;
        --ttg-text-size-xs: 12px;
        --ttg-text-line-height-xs: 16px;
        
        /* Text colors */
        --ttg-color-text-black: #333333;
        --ttg-color-text-gray-900: #666666;
        --ttg-color-text-gray-700: #888888;
        --ttg-color-text-gray-500: #A9A9A9;
        --ttg-color-text-gray-300: #D5D5D5;
        --ttg-color-text-white: #FFFFFF;
        --ttg-color-text-blue-base: #3290FF;
        --ttg-color-text-critical: #FF2B71;
        
        /* Background colors */
        --ttg-color-bg-black: #333333;
        --ttg-color-bg-gray-900: #666666;
        --ttg-color-bg-gray-700: #888888;
        --ttg-color-bg-gray-500: #A9A9A9;
        --ttg-color-bg-gray-300: #D5D5D5;
        --ttg-color-bg-gray-100: #F5F5F5;
        --ttg-color-bg-white: #FFFFFF;
        --ttg-color-bg-blue-base: #3290FF;
        --ttg-color-bg-blue-dark: #137BEC;
        --ttg-color-bg-blue-darker: #0A60C2;
        --ttg-color-bg-blue-light: #073DFE;
        --ttg-color-bg-blue-lighter: #E9F3FF;
        
        /* Stroke colors */
        --ttg-color-stroke-black: #333333;
        --ttg-color-stroke-gray-300: #D5D5D5;
        --ttg-color-stroke-blue-base: #3290FF;
        --ttg-color-stroke-critical: #FF2B71;
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
        font-family: var(--ttg-font-family);
        font-size: var(--ttg-text-size-s);
        font-weight: var(--ttg-font-weight-medium);
        line-height: var(--ttg-text-line-height-s);
        letter-spacing: var(--ttg-letter-spacing);
        color: var(--ttg-color-text-black);
        display: block;
        margin-bottom: 8px;
      }

      /* TTG-адаптированные существующие инпуты */
      .text-input, .number-input {
        width: 100%;
        height: 52px;
        padding: 16px 12px 16px 16px;
        border-radius: 10px;
        background: var(--ttg-color-bg-gray-100);
        border: 1px solid transparent;
        transition: border-color 0.3s ease;
        color: var(--ttg-color-text-gray-900);
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: -0.28px;
        outline: none;
        box-sizing: border-box;
        min-width: 0;
        max-width: 100%;
      }

      .text-input::placeholder, .number-input::placeholder {
        color: var(--ttg-color-text-gray-500);
      }

      .text-input:hover, .number-input:hover {
        border: 1px solid var(--ttg-color-stroke-gray-300);
      }

      .text-input:focus, .number-input:focus {
        border: 1px solid var(--ttg-color-stroke-black);
        color: var(--ttg-color-text-black);
      }

      .select-styled {
        width: 100%;
        height: 52px;
        padding: 16px 32px 16px 16px;
        border-radius: 10px;
        background: var(--ttg-color-bg-gray-100);
        border: 1px solid transparent;
        transition: border-color 0.3s ease;
        color: var(--ttg-color-text-gray-900);
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: -0.28px;
        outline: none;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 12px center;
        background-repeat: no-repeat;
        background-size: 16px;
        box-sizing: border-box;
        max-width: 100%;
      }

      .select-styled:hover {
        border: 1px solid var(--ttg-color-stroke-gray-300);
      }

      .select-styled:focus {
        border: 1px solid var(--ttg-color-stroke-black);
        color: var(--ttg-color-text-black);
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
        width: 100%;
        padding: 14px 24px 14px 20px;
        gap: 10px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s ease;
        background: var(--ttg-color-bg-blue-base);
        color: var(--ttg-color-text-white);
        text-align: center;
        font-family: var(--ttg-font-family);
        font-size: var(--ttg-text-size-m);
        font-weight: var(--ttg-font-weight-medium);
        line-height: var(--ttg-text-line-height-m);
        letter-spacing: -0.32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .generate-button:hover {
        background: var(--ttg-color-bg-blue-dark);
      }

      .generate-button:active {
        background: var(--ttg-color-bg-blue-darker);
        outline: none;
      }

      .generate-button:disabled {
        background: var(--ttg-color-bg-gray-100);
        cursor: not-allowed;
      }

      .generate-button * {
        cursor: pointer;
      }

      .generate-button:disabled * {
        cursor: not-allowed;
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

    // Внешние элементы модалки будут искаться динамически в showSuccessPopup()
  }

  bindEvents() {
    // Обработчик для кнопки генерации
    if (this.elements.generateBtn) {
      const handler = () => this.generateAndCopyCode();
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

    // Обработчики модального окна теперь привязываются динамически в showSuccessPopup()
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
    // Обработчики модального окна теперь привязываются динамически в showSuccessPopup()
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

      const rawCode = this.generateLoaderCode(data);
      const code = await this.minifyGeneratedCode(rawCode);
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

  async minifyGeneratedCode(code) {
    try {
      const parts = this.parseGeneratedCode(code);
      const minifiedCSS = parts.css ? this.minifyCSS(parts.css) : "";
      const minifiedJS = parts.js ? this.minifyJS(parts.js) : "";
      const minifiedHTML = parts.html ? this.minifyHTML(parts.html) : "";

      let result = "";
      if (minifiedHTML) result += minifiedHTML;
      if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
      if (minifiedJS) result += `<script>${minifiedJS}</script>`;

      return result;
    } catch (error) {
      console.warn('Минификация генерируемого кода не удалась, используем оригинал:', error);
      return code;
    }
  }

  parseGeneratedCode(code) {
    const result = { css: "", js: "", html: "" };

    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(code)) !== null) {
      result.css += match[1];
    }

    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(code)) !== null) {
      result.js += match[1];
    }

    result.html = code
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .trim();

    return result;
  }

  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,>+~])\s*/g, "$1")
      .replace(/;}/g, "}")
      .replace(/\s*\(\s*/g, "(")
      .replace(/\s*\)\s*/g, ")")
      .replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, "#$1$2$3")
      .trim();
  }

  minifyHTML(html) {
    if (!html) return "";
    return html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();
  }

  minifyJS(js) {
    let minified = js;

    minified = this.removeJSComments(minified);

    minified = minified
      .replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "const $1=")
      .replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "let $1=")
      .replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "var $1=");

    minified = minified
      .replace(/{\s*([^}]+)\s*}/g, (match, content) => {
        const compressed = content
          .replace(/\s*:\s*/g, ":")
          .replace(/\s*,\s*/g, ",");
        return `{${compressed}}`;
      })
      .replace(/\[\s*([^\]]+)\s*\]/g, (match, content) => {
        const compressed = content.replace(/\s*,\s*/g, ",");
        return `[${compressed}]`;
      });

    minified = minified
      .replace(/\s*([=+\-*/%<>&|!])\s*/g, "$1")
      .replace(/\s*([(){}[\];,])\s*/g, "$1")
      .replace(/\s+/g, " ")
      .replace(/\b(if|for|while|switch|catch|function|return|throw|new|typeof)\s+/g, "$1 ")
      .replace(/\belse\s+/g, "else ")
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\n+/g, "\n")
      .trim();

    minified = minified
      .replace(/\btrue\b(?=\s*[,;\}\)\]])/g, "!0")
      .replace(/\bfalse\b(?=\s*[,;\}\)\]])/g, "!1")
      .replace(/\bundefined\b(?=\s*[,;\}\)\]])/g, "void 0");

    return minified;
  }

  removeJSComments(code) {
    let result = "";
    let inString = false;
    let stringChar = "";
    let inBlockComment = false;
    let inLineComment = false;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const next = code[i + 1] || "";

      if (!inBlockComment && !inLineComment) {
        if (!inString && (char === '"' || char === "'" || char === "`")) {
          inString = true;
          stringChar = char;
          result += char;
          continue;
        } else if (inString && char === stringChar && code[i - 1] !== "\\") {
          inString = false;
          result += char;
          continue;
        } else if (inString) {
          result += char;
          continue;
        }
      }

      if (!inString) {
        if (!inBlockComment && !inLineComment && char === "/" && next === "*") {
          inBlockComment = true;
          i++;
          continue;
        } else if (inBlockComment && char === "*" && next === "/") {
          inBlockComment = false;
          i++;
          continue;
        } else if (!inBlockComment && !inLineComment && char === "/" && next === "/") {
          inLineComment = true;
          i++;
          continue;
        } else if (inLineComment && (char === "\n" || char === "\r")) {
          inLineComment = false;
          result += char;
          continue;
        }
      }

      if (!inBlockComment && !inLineComment) {
        result += char;
      }
    }

    return result;
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
    // 1. Найти элементы попапа динамически каждый раз при вызове
    const successPopup = document.querySelector(".pop-up-success");
    const popupAcceptBtn = document.querySelector("[data-popup-accept-btn]");
    const popupCloseBtn = document.querySelector("[data-popup-close-btn]");
    // Найдем элемент содержимого попапа для корректной проверки клика по оверлею
    const popupContent = successPopup ? successPopup.querySelector('.pop-up__content') : null;

    if (!successPopup) {
      console.warn("LoaderGenerator: Success popup element (.pop-up-success) not found.");
      return;
    }

    // 2. Определить функцию скрытия
    const hidePopupFunction = () => {
      successPopup.style.display = "none";
      console.log("LoaderGenerator: Popup hidden");
    };

    // 3. Привязать обработчики только если элементы найдены
    if (popupAcceptBtn) {
      popupAcceptBtn.removeEventListener('click', hidePopupFunction);
      popupAcceptBtn.addEventListener("click", hidePopupFunction);
      console.log("LoaderGenerator: Accept button handler bound");
    } else {
      console.warn("LoaderGenerator: Accept button [data-popup-accept-btn] not found");
    }

    if (popupCloseBtn) {
      popupCloseBtn.removeEventListener('click', hidePopupFunction);
      popupCloseBtn.addEventListener("click", hidePopupFunction);
      console.log("LoaderGenerator: Close button handler bound");
    } else {
      console.warn("LoaderGenerator: Close button [data-popup-close-btn] not found");
    }

    // Улучшенный обработчик клика по overlay
    const overlayClickHandler = (event) => {
      console.log("LoaderGenerator: Overlay click detected", {
        target: event.target.className,
        currentTarget: event.currentTarget.className,
        popupContentExists: !!popupContent
      });

      // Проверяем, существует ли элемент содержимого попапа
      if (popupContent) {
        // Проверяем, что клик был НЕ по элементу содержимого попапа и не по его потомкам
        if (!popupContent.contains(event.target)) {
          console.log("LoaderGenerator: Click outside popup content - hiding popup");
          hidePopupFunction();
        } else {
          console.log("LoaderGenerator: Click inside popup content - keeping popup open");
        }
      } else {
        console.warn("LoaderGenerator: Popup content (.pop-up__content) not found inside .pop-up-success.");
        // Fallback к старой логике, если структура нестандартная
        if (event.target === successPopup) {
          console.log("LoaderGenerator: Using fallback logic - hiding popup");
          hidePopupFunction();
        }
      }
    };

    successPopup.removeEventListener('click', overlayClickHandler);
    successPopup.addEventListener("click", overlayClickHandler);
    console.log("LoaderGenerator: Enhanced overlay click handler bound", {
      popupContentFound: !!popupContent
    });

    // 4. Показать попап
    successPopup.style.display = "flex";
    console.log("LoaderGenerator: Popup shown");
  }

  hideSuccessPopup() {
    const successPopup = document.querySelector(".pop-up-success");
    if (successPopup) {
      successPopup.style.display = "none";
      console.log("LoaderGenerator: Popup hidden via hideSuccessPopup");
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

    // unbindModalEvents больше не нужен - обработчики модального окна управляются в showSuccessPopup()
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

  collectData() {
    return {
      animationType: this.elements.animationType?.value || this.configDefaults.animationType,
      bgColor: this.elements.bgColor?.value || this.configDefaults.bgColor,
      animationColor: this.elements.animationColor?.value || this.configDefaults.animationColor,
      minDisplayTime: parseInt(this.elements.minDisplayTime?.value, 10) || this.configDefaults.minDisplayTime,
      hideDelay: parseInt(this.elements.hideDelay?.value, 10) || this.configDefaults.hideDelay,
      hideDuration: parseInt(this.elements.hideDuration?.value, 10) || this.configDefaults.hideDuration,
      customCssCode: this.elements.customCss?.value || this.configDefaults.customCssCode,
    };
  }

  generateCode(settings = {}) {
    const animationCSS = this.getAnimationCSS(settings);
    const loaderLogic = this.getLoaderLogic(settings);

    return `<!-- Loader Extension -->
<script>
${loaderLogic}
</script>
<style>
${animationCSS}
</style>`;
  }

  getAnimationCSS(settings) {
    if (settings.animationType === "custom" && settings.customCssCode) {
      return settings.customCssCode;
    }

    const baseCSS = `
.taptop-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${settings.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity ${settings.hideDuration}ms ease-out;
}

.taptop-loader.fade-out {
  opacity: 0;
}`;

    let animationCSS = "";
    switch (settings.animationType) {
      case "spinner":
        animationCSS = `
.taptop-loader .loader-animation {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-left: 4px solid ${settings.animationColor};
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
        break;
      case "dots":
        animationCSS = `
.taptop-loader .loader-animation {
  display: flex;
  gap: 8px;
}

.taptop-loader .loader-animation div {
  width: 12px;
  height: 12px;
  background-color: ${settings.animationColor};
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.taptop-loader .loader-animation div:nth-child(1) { animation-delay: -0.32s; }
.taptop-loader .loader-animation div:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}`;
        break;
      case "bars":
        animationCSS = `
.taptop-loader .loader-animation {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.taptop-loader .loader-animation div {
  width: 6px;
  height: 30px;
  background-color: ${settings.animationColor};
  animation: bars 1.2s ease-in-out infinite;
}

.taptop-loader .loader-animation div:nth-child(1) { animation-delay: -0.4s; }
.taptop-loader .loader-animation div:nth-child(2) { animation-delay: -0.2s; }
.taptop-loader .loader-animation div:nth-child(3) { animation-delay: 0s; }

@keyframes bars {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}`;
        break;
    }

    return baseCSS + animationCSS;
  }

  getLoaderLogic(settings) {
    return `
(function() {
  if (window.taptopLoaderInitialized) return;
  window.taptopLoaderInitialized = true;

  let loaderElement;
  let startTime = Date.now();
  let minDisplayReached = false;
  let pageLoaded = false;

  // Создаем лоудер
  function createLoader() {
    loaderElement = document.createElement('div');
    loaderElement.className = 'taptop-loader';
    
    const animation = document.createElement('div');
    animation.className = 'loader-animation';
    
    ${this.getAnimationHTML(settings)}
    
    loaderElement.appendChild(animation);
    document.body.appendChild(loaderElement);
  }

  // Скрываем лоудер
  function hideLoader() {
    if (!loaderElement) return;
    
    setTimeout(() => {
      loaderElement.classList.add('fade-out');
      setTimeout(() => {
        if (loaderElement && loaderElement.parentNode) {
          loaderElement.parentNode.removeChild(loaderElement);
        }
      }, ${settings.hideDuration});
    }, ${settings.hideDelay});
  }

  // Проверяем условия для скрытия
  function checkHideConditions() {
    if (minDisplayReached && pageLoaded) {
      hideLoader();
    }
  }

  // Создаем лоудер при загрузке скрипта
  createLoader();

  // Минимальное время показа
  setTimeout(() => {
    minDisplayReached = true;
    checkHideConditions();
  }, ${settings.minDisplayTime});

  // Ждем полной загрузки страницы
  if (document.readyState === 'complete') {
    pageLoaded = true;
    checkHideConditions();
  } else {
    window.addEventListener('load', () => {
      pageLoaded = true;
      checkHideConditions();
    });
  }

  // Глобальная функция для ручного скрытия (опционально)
  window.hideLoader = hideLoader;
})();`;
  }

  getAnimationHTML(settings) {
    switch (settings.animationType) {
      case "dots":
        return "animation.innerHTML = '<div></div><div></div><div></div>';";
      case "bars":
        return "animation.innerHTML = '<div></div><div></div><div></div>';";
      default:
        return "// Spinner не требует дополнительных элементов";
    }
  }

  async generateAndCopyCode() {
    try {
      const settings = this.collectData();
      if (!settings) {
        console.warn("LoaderGenerator: Настройки не получены");
        return;
      }

      const rawCode = this.generateCode(settings);
      if (!rawCode) {
        console.warn("LoaderGenerator: Код не сгенерирован");
        return;
      }

      const code = await this.minifyGeneratedCode(rawCode);
      
      console.log("LoaderGenerator: Генерация завершена, копирую в буфер");
      await this.copyToClipboard(code);
      this.showSuccessPopup();
      console.log("LoaderGenerator: Код успешно скопирован");
    } catch (error) {
      console.error("LoaderGenerator: Ошибка генерации/копирования кода:", error);
      alert("Произошла ошибка при генерации кода. Попробуйте еще раз.");
    }
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("LoaderGenerator: Код скопирован в буфер обмена");
    } catch (error) {
      this.fallbackCopy(text);
    }
  }

  fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    try {
      if (textarea.select && document.execCommand) {
        textarea.select();
        if (!document.execCommand("copy")) {
          throw new Error("Не удалось скопировать код в буфер обмена");
        }
        console.log("LoaderGenerator: Код скопирован в буфер обмена (fallback)");
      } else {
        throw new Error("Копирование не поддерживается браузером");
      }
    } finally {
      document.body.removeChild(textarea);
    }
  }

  showSuccessPopup() {
    // 1. Найти элементы попапа динамически каждый раз при вызове
    const successPopup = document.querySelector(".pop-up-success");
    const popupAcceptBtn = document.querySelector("[data-popup-accept-btn]");
    const popupCloseBtn = document.querySelector("[data-popup-close-btn]");
    // Найдем элемент содержимого попапа для корректной проверки клика по оверлею
    const popupContent = successPopup ? successPopup.querySelector('.pop-up__content') : null;

    if (!successPopup) {
      console.warn("LoaderGenerator: Success popup element (.pop-up-success) not found.");
      return;
    }

    // 2. Определить функцию скрытия
    const hidePopupFunction = () => {
      successPopup.style.display = "none";
      console.log("LoaderGenerator: Popup hidden");
    };

    // 3. Привязать обработчики только если элементы найдены
    if (popupAcceptBtn) {
      popupAcceptBtn.removeEventListener('click', hidePopupFunction);
      popupAcceptBtn.addEventListener("click", hidePopupFunction);
      console.log("LoaderGenerator: Accept button handler bound");
    } else {
      console.warn("LoaderGenerator: Accept button [data-popup-accept-btn] not found");
    }

    if (popupCloseBtn) {
      popupCloseBtn.removeEventListener('click', hidePopupFunction);
      popupCloseBtn.addEventListener("click", hidePopupFunction);
      console.log("LoaderGenerator: Close button handler bound");
    } else {
      console.warn("LoaderGenerator: Close button [data-popup-close-btn] not found");
    }

    // Улучшенный обработчик клика по overlay
    const overlayClickHandler = (event) => {
      console.log("LoaderGenerator: Overlay click detected", {
        target: event.target.className,
        currentTarget: event.currentTarget.className,
        popupContentExists: !!popupContent
      });

      // Проверяем, существует ли элемент содержимого попапа
      if (popupContent) {
        // Проверяем, что клик был НЕ по элементу содержимого попапа и не по его потомкам
        if (!popupContent.contains(event.target)) {
          console.log("LoaderGenerator: Click outside popup content - hiding popup");
          hidePopupFunction();
        } else {
          console.log("LoaderGenerator: Click inside popup content - keeping popup open");
        }
      } else {
        console.warn("LoaderGenerator: Popup content (.pop-up__content) not found inside .pop-up-success.");
        // Fallback к старой логике, если структура нестандартная
        if (event.target === successPopup) {
          console.log("LoaderGenerator: Using fallback logic - hiding popup");
          hidePopupFunction();
        }
      }
    };

    successPopup.removeEventListener('click', overlayClickHandler);
    successPopup.addEventListener("click", overlayClickHandler);
    console.log("LoaderGenerator: Enhanced overlay click handler bound", {
      popupContentFound: !!popupContent
    });

    // 4. Показать попап
    successPopup.style.display = "flex";
    console.log("LoaderGenerator: Popup shown");
  }

  hideSuccessPopup() {
    const successPopup = document.querySelector(".pop-up-success");
    if (successPopup) {
      successPopup.style.display = "none";
      console.log("LoaderGenerator: Popup hidden via hideSuccessPopup");
    }
  }

  bindModalEvents() {
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

  destroy() {
    this.unbindEvents();
    this.initialized = false;
  }
}

// Регистрируем веб-компонент
customElements.define("loader-generator", LoaderGenerator);