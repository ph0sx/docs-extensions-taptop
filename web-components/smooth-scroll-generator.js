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
        display: flex;
        align-items: center;
        font-weight: 500;
        color: var(--text-dark);
        font-size: 14px;
      }

      .text-input, .number-input, .select-styled {
        width: 100%;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        font-size: 14px;
        color: var(--text-dark);
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
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

      .text-input:focus, .number-input:focus, .select-styled:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
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
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--primary-gradient);
        color: white;
        padding: 12px 24px;
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
              <div class="helper-text" id="preset-description">Рекомендованные настройки Lenis</div>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Сгенерировать код</span>
          </button>
        </div>
      </form>
    `;
  }

  findElements() {
    const elements = {
      presetSelect: this.shadowRoot.getElementById("preset-select"),
      presetDescription: this.shadowRoot.getElementById("preset-description"),
      lerpSlider: this.shadowRoot.getElementById("lerp-slider"),
      lerpValueDisplay: this.shadowRoot.getElementById("lerp-value-display"),
      speedSlider: this.shadowRoot.getElementById("speed-slider"),
      speedValueDisplay: this.shadowRoot.getElementById("speed-value-display"),
      excludeSelectors: this.shadowRoot.getElementById("exclude-selectors"),
      generateButton: this.shadowRoot.getElementById("generate-btn")
    };

    // Поиск внешних элементов модалки
    elements.successPopup = document.querySelector(".pop-up-success");
    elements.popupAcceptBtn = document.querySelector("[data-popup-accept-btn]");
    elements.popupCloseBtn = document.querySelector("[data-popup-close-btn]");

    this.elements = elements;
  }

  bindEvents() {
    const handlers = {
      handleGenerate: this.generateAndCopyCode.bind(this),
      handlePresetChange: (e) => this.applyPreset(e.target.value),
      handleLerpInput: () => this.updateLerpUI(),
      handleSpeedInput: () => this.updateSpeedUI()
    };

    this.eventHandlers = handlers;

    this.elements.generateButton?.addEventListener("click", handlers.handleGenerate);
    this.elements.presetSelect?.addEventListener("change", handlers.handlePresetChange);
    this.elements.lerpSlider?.addEventListener("input", handlers.handleLerpInput);
    this.elements.speedSlider?.addEventListener("input", handlers.handleSpeedInput);
    
    this.bindModalEvents();
  }

  unbindEvents() {
    if (this.eventHandlers) {
      this.elements.generateButton?.removeEventListener("click", this.eventHandlers.handleGenerate);
      this.elements.presetSelect?.removeEventListener("change", this.eventHandlers.handlePresetChange);
      this.elements.lerpSlider?.removeEventListener("input", this.eventHandlers.handleLerpInput);
      this.elements.speedSlider?.removeEventListener("input", this.eventHandlers.handleSpeedInput);
      
      // Отвязка обработчиков модалки
      if (this.eventHandlers.has("popup-accept")) {
        this.elements.popupAcceptBtn?.removeEventListener("click", this.eventHandlers.get("popup-accept"));
      }
      if (this.eventHandlers.has("popup-close")) {
        this.elements.popupCloseBtn?.removeEventListener("click", this.eventHandlers.get("popup-close"));
      }
      if (this.eventHandlers.has("popup-overlay")) {
        this.elements.successPopup?.removeEventListener("click", this.eventHandlers.get("popup-overlay"));
      }
      
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

    const {
      presetDescription,
      lerpSlider,
      speedSlider,
      excludeSelectors,
    } = this.elements;

    if (presetDescription) presetDescription.textContent = preset.description;
    if (lerpSlider) {
      // Обратное преобразование для инвертированной логики: lerp -> slider позиция
      const lerpSliderValue = Math.round((0.1 - preset.lerp) / 0.05 * 99 + 1);
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
    const lerpValue = 0.1 - (lerpSliderValue - 1) / 99 * 0.05;
    const percentage = Math.round((lerpSliderValue - 1) / 99 * 100);
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
    const speedSliderValue = parseInt(this.elements.speedSlider?.value, 10) || 50;
    
    // Инвертированная логика: слайдер 1 = lerp 0.1 (0%), слайдер 100 = lerp 0.05 (100%)
    const lerp = 0.1 - (lerpSliderValue - 1) / 99 * 0.05;
    
    return {
      lerp: Math.max(0.05, Math.min(0.1, lerp)),
      duration: 1.2,
      wheelMultiplier: speedSliderValue / 50,
      excludeSelectors: (this.elements.excludeSelectors?.value || "").trim(),
    };
  }

  generateCode(settings = {}) {
    const excludeSelectorsCode = this._getExcludeSelectorsCode(settings.excludeSelectors);
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
    const selectors = excludeSelectors.split(",").map((s) => s.trim()).filter(Boolean);
    if (!selectors.length) {
      return "// Нет исключаемых элементов";
    }
    return `
    // Добавление data-lenis-prevent атрибутов к исключаемым элементам
    const excludeClasses = [${selectors.map(s => `'${s}'`).join(", ")}];
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
      console.warn('Минификация генерируемого кода не удалась, используем оригинал:', error);
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

    result.html = code
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .trim();

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

  async generateAndCopyCode() {
    const settings = this.collectData();
    const rawCode = this.generateCode(settings);
    const code = await this.minifyGeneratedCode(rawCode);
    
    try {
      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (err) {
      console.error('Не удалось скопировать код:', err);
    }
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

  async copyToClipboard(text) {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (err) {
        console.log("Ошибка clipboard API:", err);
      }
    }

    // Fallback для старых браузеров
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand("copy");
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
}

customElements.define('smooth-scroll-generator', SmoothScrollGenerator);