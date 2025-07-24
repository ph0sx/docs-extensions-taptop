// Smooth Scroll Generator Web Component для Taptop
class SmoothScrollGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;
    this.presets = {
      standard: {
        description: "Сбалансированная настройка",
        lerp: 0.1,
        duration: 1.2,
        wheelMultiplier: 1,
        excludeSelectors: "",
      },
      smooth: {
        description: "Максимально плавная прокрутка",
        lerp: 0.05,
        duration: 1.8,
        wheelMultiplier: 0.7,
        excludeSelectors: "",
      },
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

      .smooth-scroll-generator {
        --primary-color: #4483f5;
        --primary-light: rgba(68, 131, 245, 0.15);
        --primary-gradient: linear-gradient(90deg, #4483f5 0%, #5e6ffd 100%);
        --text-dark: #333333;
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
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0, 0, 0, 0.05);
        color: var(--text-dark);
        min-width: 350px;
      }

      .form-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 20px;
        background: white;
        padding: 15px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        width: 100%;
        max-height: calc(100vh - 65px - 76px - 55px - 97px - 55px);
        overflow: auto;
      }

      fieldset {
        border: none;
        padding: 0;
        margin: 0;
      }

      legend {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-dark);
        padding-bottom: 8px;
        border-bottom: 2px solid var(--bg-light);
        width: 100%;
        margin-bottom: 15px;
      }

      .setting-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .setting-group label {
        font-family: var(--ttg-font-family);
        font-size: var(--ttg-text-size-s);
        font-weight: var(--ttg-font-weight-medium);
        line-height: var(--ttg-text-line-height-s);
        letter-spacing: var(--ttg-letter-spacing);
        color: var(--ttg-color-text-black);
        display: flex;
        align-items: center;
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
        line-height: 1.4;
        margin: 0;
      }

      .helper-text:not(:last-child) {
        margin-bottom: 15px;
      }

      .slider-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .slider {
        width: 100%;
        -webkit-appearance: none;
        height: 4px;
        border-radius: 2px;
        background: #e0e0e0;
        outline: none;
        margin: 15px 0;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        box-shadow: 0 0 0 5px rgba(68, 131, 245, 0.2);
        border: 2px solid white;
        transition: all 0.2s ease;
      }

      .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        box-shadow: 0 0 0 5px rgba(68, 131, 245, 0.2);
        border: 2px solid white;
        transition: all 0.2s ease;
      }

      .slider::-webkit-slider-thumb:hover,
      .slider::-moz-range-thumb:hover {
        box-shadow: 0 0 0 7px rgba(68, 131, 245, 0.3);
      }

      .slider:active::-webkit-slider-thumb,
      .slider:active::-moz-range-thumb {
        box-shadow: 0 0 0 10px rgba(68, 131, 245, 0.4);
      }

      .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text-light);
      }

      .slider-value {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
      }

      .slider-value-primary {
        font-weight: 600;
        color: var(--primary-color);
      }

      .slider-value-secondary {
        color: var(--text-light);
      }

      .tabs-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .tab-buttons {
        display: flex;
        gap: 2px;
        background: var(--bg-light);
        padding: 4px;
        border-radius: var(--radius-sm);
      }

      .tab-button {
        flex: 1;
        padding: 8px 12px;
        border: none;
        background: transparent;
        color: var(--text-light);
        font-size: 14px;
        font-weight: 500;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: var(--transition);
      }

      .tab-button.active {
        background: white;
        color: var(--text-dark);
        box-shadow: var(--shadow-sm);
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      .settings-column {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        cursor: pointer;
      }

      .checkbox-container input[type="checkbox"] {
        margin: 0;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        cursor: pointer;
      }

      .checkbox-option-label {
        font-size: 14px;
        color: var(--text-dark);
        line-height: 1.4;
        cursor: pointer;
      }

      .keyboard-option {
        display: none;
      }

      .keyboard-option.visible {
        display: block;
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
        display: flex;
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
    `;
  }

  getTemplate() {
    return `
      <form class="smooth-scroll-generator">
        <div class="form-grid">
          <fieldset>
            <legend>Готовые пресеты</legend>
            <div class="setting-group">
              <label for="preset-select">Выберите пресет:</label>
              <select id="preset-select" class="select-styled">
                <option value="standard">Стандартный</option>
                <option value="smooth">Плавный</option>
              </select>
              <div class="helper-text" id="preset-description">Рекомендованные настройки</div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Точная настройка</legend>
            <div class="settings-column">
              <div class="setting-group">
                <label for="lerp-slider">Интенсивность плавности:</label>
                <div class="slider-container">
                  <input type="range" id="lerp-slider" min="1" max="100" value="50" class="slider">
                  <div class="slider-labels">
                    <span>Менее плавная</span>
                    <span>Очень плавная</span>
                  </div>
                  <div class="slider-value">
                    <span id="lerp-value-display" class="slider-value-primary">0.1</span>
                  </div>
                </div>
                <div class="helper-text">Чем выше процент, тем более плавная прокрутка</div>
              </div>

              <div class="setting-group">
                <label for="speed-slider">Скорость прокрутки:</label>
                <div class="slider-container">
                  <input type="range" id="speed-slider" min="1" max="100" value="50" class="slider">
                  <div class="slider-labels">
                    <span>Медленная</span>
                    <span>Быстрая</span>
                  </div>
                  <div class="slider-value">
                    <span id="speed-value-display" class="slider-value-primary">1.0x</span>
                  </div>
                </div>
                <div class="helper-text">Как быстро прокрутка реагирует на движения мыши/тачпада</div>
              </div>

              <div class="setting-group">
                <label for="exclude-selectors">Исключить элементы (опционально):</label>
                <input type="text" id="exclude-selectors" class="text-input" placeholder="map, slider, gallery">
                <div class="helper-text">Классы элементов (через запятую, без точек)</div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="action-section">
          <button type="button" class="generate-button" id="generate-btn">
            <span>Сгенерировать код</span>
          </button>
        </div>
      </form>
    `;
  }

  findElements() {
    // Внутренние элементы Shadow DOM
    this.elements.presetSelect = this.shadowRoot.getElementById("preset-select");
    this.elements.presetDescription = this.shadowRoot.getElementById("preset-description");
    this.elements.lerpSlider = this.shadowRoot.getElementById("lerp-slider");
    this.elements.lerpValueDisplay = this.shadowRoot.getElementById("lerp-value-display");
    this.elements.speedSlider = this.shadowRoot.getElementById("speed-slider");
    this.elements.speedValueDisplay = this.shadowRoot.getElementById("speed-value-display");
    this.elements.excludeSelectors = this.shadowRoot.getElementById("exclude-selectors");
    this.elements.generateButton = this.shadowRoot.getElementById("generate-btn");

    // Внешние элементы модалки будут искаться динамически в showSuccessPopup()
  }

  bindEvents() {
    const handlers = {
      handleGenerate: this.generateAndCopyCode.bind(this),
      handlePresetChange: (e) => this.applyPreset(e.target.value),
      handleLerpInput: () => this.updateLerpUI(),
      handleSpeedInput: () => this.updateSpeedUI(),
    };

    this.eventHandlers = handlers;

    this.elements.generateButton?.addEventListener(
      "click",
      handlers.handleGenerate
    );
    this.elements.presetSelect?.addEventListener(
      "change",
      handlers.handlePresetChange
    );
    this.elements.lerpSlider?.addEventListener(
      "input",
      handlers.handleLerpInput
    );
    this.elements.speedSlider?.addEventListener(
      "input",
      handlers.handleSpeedInput
    );

    // Обработчики модального окна теперь привязываются динамически в showSuccessPopup()
  }

  unbindEvents() {
    if (this.eventHandlers) {
      this.elements.generateButton?.removeEventListener(
        "click",
        this.eventHandlers.handleGenerate
      );
      this.elements.presetSelect?.removeEventListener(
        "change",
        this.eventHandlers.handlePresetChange
      );
      this.elements.lerpSlider?.removeEventListener(
        "input",
        this.eventHandlers.handleLerpInput
      );
      this.elements.speedSlider?.removeEventListener(
        "input",
        this.eventHandlers.handleSpeedInput
      );

      // unbindModalEvents больше не нужен - обработчики модального окна управляются в showSuccessPopup()
      this.eventHandlers.clear();
    }
  }

  destroy() {
    this.unbindEvents();
    this.initialized = false;
    console.log("SmoothScrollGenerator: Генератор уничтожен");
  }

  setInitialState() {
    if (this.elements.presetSelect) {
      this.applyPreset(this.elements.presetSelect.value);
    }
    this.updateLerpUI();
    this.updateSpeedUI();
  }

  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return;

    const { presetDescription, lerpSlider, speedSlider, excludeSelectors } =
      this.elements;

    if (presetDescription) presetDescription.textContent = preset.description;
    if (lerpSlider) {
      // Обратное преобразование для инвертированной логики: lerp -> slider позиция
      const lerpSliderValue = Math.round(((0.1 - preset.lerp) / 0.05) * 99 + 1);
      lerpSlider.value = Math.max(1, Math.min(100, lerpSliderValue));
    }
    if (speedSlider) {
      const speedValue = Math.round(preset.wheelMultiplier * 50);
      speedSlider.value = speedValue;
    }
    if (excludeSelectors) excludeSelectors.value = preset.excludeSelectors;

    this.updateLerpUI();
    this.updateSpeedUI();
  }

  updateLerpUI() {
    const { lerpSlider, lerpValueDisplay } = this.elements;
    if (!lerpSlider || !lerpValueDisplay) return;

    const lerpSliderValue = parseInt(lerpSlider.value, 10) || 50;
    // Инвертированная логика: слайдер 1 = lerp 0.1 (0%), слайдер 100 = lerp 0.05 (100%)
    const lerpValue = 0.1 - ((lerpSliderValue - 1) / 99) * 0.05;
    const percentage = Math.round(((lerpSliderValue - 1) / 99) * 100);
    lerpValueDisplay.textContent = `${percentage}%`;
  }

  updateSpeedUI() {
    const { speedSlider, speedValueDisplay } = this.elements;
    if (!speedSlider || !speedValueDisplay) return;

    const speedSliderValue = parseInt(speedSlider.value, 10) || 50;
    const speedMultiplier = (speedSliderValue / 50).toFixed(1);
    speedValueDisplay.textContent = `${speedMultiplier}x`;
  }

  collectData() {
    const lerpSliderValue = parseInt(this.elements.lerpSlider?.value, 10) || 50;
    const speedSliderValue =
      parseInt(this.elements.speedSlider?.value, 10) || 50;

    // Инвертированная логика: слайдер 1 = lerp 0.1 (0%), слайдер 100 = lerp 0.05 (100%)
    const lerp = 0.1 - ((lerpSliderValue - 1) / 99) * 0.05;

    return {
      lerp: Math.max(0.05, Math.min(0.1, lerp)),
      duration: 1.2,
      wheelMultiplier: speedSliderValue / 50,
      excludeSelectors: (this.elements.excludeSelectors?.value || "").trim(),
    };
  }

  generateCode(settings = {}) {
    const excludeSelectorsCode = this._getExcludeSelectorsCode(
      settings.excludeSelectors
    );
    const lenisCSS = this._getLenisCSS();

    return `<script>
(function() {
  if (window.lenisInitialized) return;
  window.lenisInitialized = true;
  
  // Плавная прокрутка с поддержкой якорных ссылок
  // Любые ссылки вида <a href="#section"> будут автоматически прокручиваться плавно
  
  // Подключение Lenis
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
  script.onload = function() {
    ${lenisCSS}
    ${excludeSelectorsCode}
    
    // Инициализация Lenis с поддержкой якорных ссылок
    const lenis = new Lenis({
      lerp: ${settings.lerp.toFixed(3)},
      duration: ${settings.duration.toFixed(1)},
      wheelMultiplier: ${settings.wheelMultiplier.toFixed(1)},
      anchors: true, // Автоматическая плавная прокрутка для ссылок <a href="#section">
      gestureOrientation: 'vertical',
      normalizeWheel: false,
      smoothTouch: false
    });
    
    // Добавление класса к HTML для CSS стилей
    document.documentElement.classList.add('lenis');
    
    // Запуск анимации
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Глобальный доступ для отладки
    window.lenis = lenis;
  };
  document.head.appendChild(script);
})();
</script>`;
  }

  _getExcludeSelectorsCode(excludeSelectors) {
    if (!excludeSelectors) {
      return "// Нет исключаемых элементов";
    }
    const selectors = excludeSelectors
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!selectors.length) {
      return "// Нет исключаемых элементов";
    }
    return `
    // Добавление data-lenis-prevent атрибутов к исключаемым элементам
    const excludeClasses = [${selectors.map((s) => `'${s}'`).join(", ")}];
    excludeClasses.forEach(className => {
      document.querySelectorAll('.' + className).forEach(element => {
        element.setAttribute('data-lenis-prevent', 'true');
      });
    });`;
  }

  _getLenisCSS() {
    return `
    // Добавление обязательных CSS стилей для Lenis
    const style = document.createElement('style');
    style.textContent = \`
      html.lenis, html.lenis body {
        height: auto;
      }
      .lenis.lenis-smooth {
        scroll-behavior: auto !important;
      }
      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }
      .lenis.lenis-stopped {
        overflow: hidden;
      }
      .lenis.lenis-smooth iframe {
        pointer-events: none;
      }
    \`;
    document.head.appendChild(style);`;
  }

  async minifyGeneratedCode(code) {
    try {
      const parts = this.parseGeneratedCode(code);
      const minifiedJS = parts.js ? this.minifyJS(parts.js) : "";
      const minifiedHTML = parts.html ? this.minifyHTML(parts.html) : "";

      let result = "";
      if (minifiedHTML) result += minifiedHTML;
      if (minifiedJS) result += `<script>${minifiedJS}</script>`;

      return result;
    } catch (error) {
      console.warn(
        "Минификация генерируемого кода не удалась, используем оригинал:",
        error
      );
      return code;
    }
  }

  parseGeneratedCode(code) {
    const result = { js: "", html: "" };

    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(code)) !== null) {
      result.js += match[1];
    }

    result.html = code.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").trim();

    return result;
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
      .replace(
        /\b(if|for|while|switch|catch|function|return|throw|new|typeof)\s+/g,
        "$1 "
      )
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
        } else if (
          !inBlockComment &&
          !inLineComment &&
          char === "/" &&
          next === "/"
        ) {
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

  async generateAndCopyCode() {
    try {
      const settings = this.collectData();
      if (!settings) {
        console.warn("SmoothScrollGenerator: Настройки не получены");
        return;
      }

      const rawCode = this.generateCode(settings);
      if (!rawCode) {
        console.warn("SmoothScrollGenerator: Код не сгенерирован");
        return;
      }

      const code = await this.minifyGeneratedCode(rawCode);
      
      console.log("SmoothScrollGenerator: Генерация завершена, копирую в буфер");
      await this.copyToClipboard(code);
      this.showSuccessPopup();
      console.log("SmoothScrollGenerator: Код успешно скопирован");
    } catch (err) {
      console.error("SmoothScrollGenerator: Ошибка генерации/копирования кода:", err);
      alert("Произошла ошибка при генерации кода. Попробуйте еще раз.");
    }
  }

  // bindModalEvents() удален - обработчики теперь привязываются динамически в showSuccessPopup()


  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("SmoothScrollGenerator: Код скопирован в буфер обмена");
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
        console.log("SmoothScrollGenerator: Код скопирован в буфер обмена (fallback)");
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
      console.warn("SmoothScrollGenerator: Success popup element (.pop-up-success) not found.");
      return;
    }

    // 2. Определить функцию скрытия
    const hidePopupFunction = () => {
      successPopup.style.display = "none";
      console.log("SmoothScrollGenerator: Popup hidden");
    };

    // 3. Привязать обработчики только если элементы найдены
    if (popupAcceptBtn) {
      popupAcceptBtn.removeEventListener('click', hidePopupFunction);
      popupAcceptBtn.addEventListener("click", hidePopupFunction);
      console.log("SmoothScrollGenerator: Accept button handler bound");
    } else {
      console.warn("SmoothScrollGenerator: Accept button [data-popup-accept-btn] not found");
    }

    if (popupCloseBtn) {
      popupCloseBtn.removeEventListener('click', hidePopupFunction);
      popupCloseBtn.addEventListener("click", hidePopupFunction);
      console.log("SmoothScrollGenerator: Close button handler bound");
    } else {
      console.warn("SmoothScrollGenerator: Close button [data-popup-close-btn] not found");
    }

    // Улучшенный обработчик клика по overlay
    const overlayClickHandler = (event) => {
      console.log("SmoothScrollGenerator: Overlay click detected", {
        target: event.target.className,
        currentTarget: event.currentTarget.className,
        popupContentExists: !!popupContent
      });

      // Проверяем, существует ли элемент содержимого попапа
      if (popupContent) {
        // Проверяем, что клик был:
        // 1. По элементу successPopup (оверлей) ИЛИ его прямым потомкам (кроме контента)
        // 2. НЕ по элементу содержимого попапа и не по его потомкам
        if (!popupContent.contains(event.target)) {
          console.log("SmoothScrollGenerator: Click outside popup content - hiding popup");
          hidePopupFunction();
        } else {
          console.log("SmoothScrollGenerator: Click inside popup content - keeping popup open");
        }
      } else {
        console.warn("SmoothScrollGenerator: Popup content (.pop-up__content) not found inside .pop-up-success.");
        // Fallback к старой логике, если структура нестандартная
        if (event.target === successPopup) {
          console.log("SmoothScrollGenerator: Using fallback logic - hiding popup");
          hidePopupFunction();
        }
      }
    };

    successPopup.removeEventListener('click', overlayClickHandler);
    successPopup.addEventListener("click", overlayClickHandler);
    console.log("SmoothScrollGenerator: Enhanced overlay click handler bound", {
      popupContentFound: !!popupContent
    });

    // 4. Показать попап
    successPopup.style.display = "flex";
    console.log("SmoothScrollGenerator: Popup shown");
  }

  hideSuccessPopup() {
    const successPopup = document.querySelector(".pop-up-success");
    if (successPopup) {
      successPopup.style.display = "none";
      console.log("SmoothScrollGenerator: Popup hidden via hideSuccessPopup");
    }
  }

  // unbindModalEvents() удален - обработчики модального окна управляются в showSuccessPopup()

}

customElements.define("smooth-scroll-generator", SmoothScrollGenerator);
