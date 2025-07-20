// Card Flip Generator Web Component для Taptop
class CardFlipGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;
    this.previewFlipCard = null;
    this.previewTriggerElement = null;
    this._previewUpdateControls = [];
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

      .card-flip-generator {
        --primary-color: #4483f5;
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
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0, 0, 0, 0.05);
        color: var(--text-dark);
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
        max-height: calc(100vh - 65px - 76px - 55px - 97px - 55px);
        overflow: auto;
        min-height: 0;
      }

      .form-grid::-webkit-scrollbar {
        width: 6px;
      }

      .form-grid::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      .form-grid::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }

      .form-grid::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }

      .settings-column {
        display: flex;
        flex-direction: column;
        gap: 15px;
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

      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .radio-container {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        padding-left: 30px;
        margin-bottom: 5px;
        user-select: none;
        font-size: 14px;
        color: var(--text-dark);
      }

      .radio-container input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }

      .radio-checkmark {
        position: absolute;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 50%;
        transition: all 0.2s ease;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .radio-container:hover input[type="radio"] ~ .radio-checkmark {
        background-color: #e0e0e0;
        border-color: #bbb;
      }

      .radio-container input[type="radio"]:checked ~ .radio-checkmark {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        box-shadow: none;
      }

      .radio-checkmark:after {
        content: "";
        position: absolute;
        display: none;
      }

      .radio-container input[type="radio"]:checked ~ .radio-checkmark:after {
        display: block;
      }

      .radio-container .radio-checkmark:after {
        top: 5px;
        left: 5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
      }

      .slider-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: var(--border-color);
        outline: none;
        -webkit-appearance: none;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text-light);
      }

      .slider-value {
        text-align: center;
        margin-top: 5px;
      }

      .slider-value-primary {
        font-weight: 500;
        color: var(--primary-color);
        font-size: 14px;
      }

      .helper-text, p.helper-text {
        font-size: 13px;
        color: var(--text-light);
        line-height: 1.4;
        margin: 0;
        margin-top: -5px;
      }

      .helper-text:not(:last-child), p.helper-text:not(:last-child) {
        margin-bottom: 15px;
      }

      .helper-text code {
        background: var(--bg-light);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 11px;
      }

      .required-indicator {
        color: #e74c3c;
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

      .select-styled {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 8px center;
        background-repeat: no-repeat;
        background-size: 16px;
        padding-right: 32px;
      }

      .preview-section {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
      }

      .preview-title {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 15px;
      }

      .preview-area {
        position: relative;
        min-height: 250px;
        width: 100%;
        max-width: 350px;
        margin: 0 auto 10px auto;
        background-color: #f8f9fa;
        border: 1px dashed var(--border-color);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: var(--shadow-sm) inset;
        perspective: 1000px;
      }

      .preview-area flip-card {
        width: 80%;
        height: 200px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-md);
      }

      .preview-area flip-card [slot="front"],
      .preview-area flip-card [slot="back"] {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
        text-align: center;
        border-radius: inherit;
      }

      .preview-area flip-card [slot="front"] {
        background: linear-gradient(135deg, var(--primary-color) 0%, #6a11cb 100%);
      }

      .preview-area flip-card [slot="back"] {
        background: linear-gradient(135deg, #f857a6 0%, #ff5858 100%);
      }

      .preview-placeholder {
        padding: 20px;
        color: var(--text-light);
        text-align: center;
        font-style: italic;
        font-size: 14px;
      }

      .preview-error {
        color: var(--error-color);
        background-color: var(--error-light);
        padding: 10px;
        border-radius: var(--radius-sm);
        margin: 10px;
        text-align: center;
        border: 1px solid rgba(229, 57, 53, 0.3);
        font-size: 13px;
      }

      .preview-helper {
        text-align: center;
        font-size: 13px;
        color: var(--text-light);
        margin-top: 10px;
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

      .generate-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .setting-group[style*="display: none"] {
        display: none !important;
      }

      .cf-vertical flip-card > [slot="back"] {
        transform: scaleY(-1);
      }
    `;
  }

  getTemplate() {
    return `
      <div class="card-flip-generator">
        <div class="form-grid">
          <div class="settings-column">
            <div class="setting-group">
              <label for="cf-container-selector">
                CSS-класс основного блока-контейнера <span class="required-indicator">*</span>
              </label>
              <input type="text" id="cf-container-selector" class="text-input" 
                     placeholder="Например: my-flip-card" required>
              <div class="helper-text">
                Класс, который вы присвоили основному блоку в Taptop. Без точки в начале.
                Убедитесь, что внутри этого контейнера есть ровно два дочерних блока с классами 
                <code>flip-front</code> и <code>flip-back</code>.
              </div>
            </div>

            <fieldset class="setting-group">
              <legend>Триггер переворота</legend>
              <div class="radio-group">
                <label class="radio-container">
                  <input type="radio" name="cf-trigger" value="click" checked>
                  <span class="radio-checkmark"></span>
                  Клик
                </label>
                <label class="radio-container">
                  <input type="radio" name="cf-trigger" value="hover">
                  <span class="radio-checkmark"></span>
                  Наведение мыши
                </label>
              </div>
              <div class="helper-text">
                Как пользователь будет активировать переворот.<br>
                <em>Наведение мыши:</em> на ПК работает от наведения курсора, 
                на мобильных (<992px) автоматически используется клик.
              </div>
            </fieldset>

            <fieldset class="setting-group">
              <legend>Направление переворота</legend>
              <div class="radio-group">
                <label class="radio-container">
                  <input type="radio" name="cf-direction" value="horizontal" checked>
                  <span class="radio-checkmark"></span>
                  Горизонтально (↔)
                </label>
                <label class="radio-container">
                  <input type="radio" name="cf-direction" value="vertical">
                  <span class="radio-checkmark"></span>
                  Вертикально (↕)
                </label>
              </div>
              <div class="helper-text">Вокруг какой оси будет вращаться карточка.</div>
            </fieldset>

            <div class="setting-group">
              <label for="cf-speed-slider">Скорость анимации</label>
              <div class="slider-container">
                <input type="range" id="cf-speed-slider" class="slider" 
                       min="200" max="2500" value="750" step="50">
                <div class="slider-labels">
                  <span>Быстро</span>
                  <span>Медленно</span>
                </div>
                <div class="slider-value">
                  <span id="cf-speed-value-display" class="slider-value-primary">750мс</span>
                </div>
              </div>
              <div class="helper-text">Длительность анимации переворота (в миллисекундах).</div>
            </div>

            <div class="setting-group" id="cf-animation-style-group">
              <label for="cf-animation-style">Стиль анимации (Горизонтальный)</label>
              <select id="cf-animation-style" class="select-styled">
                <option value="default" selected>Объемный 3D (с подъемом)</option>
                <option value="flat">Плоский 2D (без подъема)</option>
              </select>
              <div class="helper-text">"Плоский" может помочь, если карточка выходит за рамки.</div>
            </div>

            <div class="setting-group">
              <label for="cf-border-radius">Скругление углов (px)</label>
              <input type="number" id="cf-border-radius" class="number-input" 
                     value="8" min="0" max="100" step="1">
              <div class="helper-text">
                Радиус скругления углов карточки. Указывайте такой же, как и в редакторе Taptop.
              </div>
            </div>

            <div class="setting-group" id="cf-flip-height-group">
              <label for="cf-flip-height">Высота подъема (0-100)</label>
              <div class="slider-container">
                <input type="range" id="cf-flip-height" class="slider" 
                       min="1" max="100" value="25" step="1">
                <div class="slider-labels">
                  <span>Мин.</span>
                  <span>Макс.</span>
                </div>
                <div class="slider-value">
                  <span id="cf-flip-height-value-display" class="slider-value-primary">25%</span>
                </div>
              </div>
              <div class="helper-text">
                Интенсивность 3D "подъема" при объемной анимации (видна только для стиля "Объемный 3D").
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h3 class="preview-title">Предпросмотр</h3>
            <div id="cf-preview-area" class="preview-area" aria-live="polite">
              <span id="cf-preview-placeholder" class="preview-placeholder">
                Настройте параметры выше, чтобы увидеть предпросмотр.
              </span>
              <div id="cf-preview-error" class="preview-error" style="display: none;"></div>
            </div>
            <div class="preview-helper">
              Кликните или наведите курсор (в зависимости от настроек триггера) 
              на область выше, чтобы увидеть анимацию. Внешний вид (фон, текст) 
              будет зависеть от ваших стилей в Taptop.
            </div>
          </div>
        </div>

        <div class="action-section">
          <button id="generate-btn" class="generate-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const root = this.shadowRoot;

    this.elements.containerSelectorInput = root.getElementById(
      "cf-container-selector"
    );
    this.elements.triggerRadios = root.querySelectorAll(
      'input[name="cf-trigger"]'
    );
    this.elements.directionRadios = root.querySelectorAll(
      'input[name="cf-direction"]'
    );
    this.elements.speedSlider = root.getElementById("cf-speed-slider");
    this.elements.speedSliderGroup =
      this.elements.speedSlider?.closest(".setting-group");
    this.elements.speedValueDisplay = root.getElementById(
      "cf-speed-value-display"
    );
    this.elements.animationStyleSelect =
      root.getElementById("cf-animation-style");
    this.elements.animationStyleGroup =
      this.elements.animationStyleSelect?.closest(".setting-group");
    this.elements.borderRadiusInput = root.getElementById("cf-border-radius");
    this.elements.flipHeightSlider = root.getElementById("cf-flip-height");
    this.elements.flipHeightGroup =
      this.elements.flipHeightSlider?.closest(".setting-group");
    this.elements.flipHeightValueDisplay = root.getElementById(
      "cf-flip-height-value-display"
    );
    this.elements.previewArea = root.getElementById("cf-preview-area");
    this.elements.previewPlaceholder = root.getElementById(
      "cf-preview-placeholder"
    );
    this.elements.previewError = root.getElementById("cf-preview-error");
    this.elements.generateButton = root.getElementById("generate-btn");

    this._previewUpdateControls = [
      this.elements.speedSlider,
      ...(this.elements.triggerRadios || []),
      ...(this.elements.directionRadios || []),
      this.elements.animationStyleSelect,
      this.elements.borderRadiusInput,
      this.elements.flipHeightSlider,
    ].filter((el) => el);
  }

  bindEvents() {
    this.unbindEvents();

    const debouncedUpdatePreview = this.debounce(
      this._updatePreview.bind(this),
      250
    );

    this._previewUpdateControls.forEach((el) => {
      const event =
        el.tagName === "SELECT" ||
        el.type === "radio" ||
        el.type === "range" ||
        el.type === "number"
          ? "change"
          : "input";
      const handler = debouncedUpdatePreview;
      el.addEventListener(event, handler);
      this.eventHandlers.set(el, { event, handler });
    });

    this.elements.directionRadios.forEach((radio) => {
      const handler = this._updateConditionalUI.bind(this);
      radio.addEventListener("change", handler);
      this.eventHandlers.set(radio, { event: "change", handler });
    });

    if (this.elements.animationStyleSelect) {
      const handler = this._updateConditionalUI.bind(this);
      this.elements.animationStyleSelect.addEventListener("change", handler);
      this.eventHandlers.set(this.elements.animationStyleSelect, {
        event: "change",
        handler,
      });
    }

    if (this.elements.speedSlider) {
      const handler = this._updateSpeedSliderDisplay.bind(this);
      this.elements.speedSlider.addEventListener("input", handler);
      this.eventHandlers.set(this.elements.speedSlider, {
        event: "input",
        handler,
      });
    }

    if (this.elements.flipHeightSlider) {
      const handler = this._updateHeightSliderDisplay.bind(this);
      this.elements.flipHeightSlider.addEventListener("input", handler);
      this.eventHandlers.set(this.elements.flipHeightSlider, {
        event: "input",
        handler,
      });
    }

    if (this.elements.generateButton) {
      const handler = this.generateAndCopyCode.bind(this);
      this.elements.generateButton.addEventListener("click", handler);
      this.eventHandlers.set(this.elements.generateButton, {
        event: "click",
        handler,
      });
    }
  }

  unbindEvents() {
    this.eventHandlers.forEach((config, element) => {
      if (element && config.handler) {
        element.removeEventListener(config.event, config.handler);
      }
    });
    this.eventHandlers.clear();
  }

  setInitialState() {
    if (this.elements.speedSlider) this.elements.speedSlider.value = 750;
    if (this.elements.borderRadiusInput)
      this.elements.borderRadiusInput.value = 8;
    if (this.elements.flipHeightSlider)
      this.elements.flipHeightSlider.value = 25;
    if (this.elements.animationStyleSelect)
      this.elements.animationStyleSelect.value = "default";

    this._updateSpeedSliderDisplay();
    this._updateHeightSliderDisplay();
    this._updateConditionalUI();
    this._updatePreview();
  }

  debounce(fn, wait = 250) {
    let timeout;
    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
  }

  _updateConditionalUI() {
    const direction = this.shadowRoot.querySelector(
      'input[name="cf-direction"]:checked'
    )?.value;
    const style = this.elements.animationStyleSelect?.value;

    const showStyle = direction === "horizontal";
    const showHeight = direction === "horizontal" && style === "default";

    if (this.elements.animationStyleGroup) {
      this.elements.animationStyleGroup.style.display = showStyle ? "" : "none";
    }
    if (this.elements.flipHeightGroup) {
      this.elements.flipHeightGroup.style.display = showHeight ? "" : "none";
    }

    this._updatePreview();
  }

  _updateSpeedSliderDisplay() {
    if (this.elements.speedSlider && this.elements.speedValueDisplay) {
      const value = this.elements.speedSlider.value;
      this.elements.speedValueDisplay.textContent = `${value}мс`;
    }
  }

  _updateHeightSliderDisplay() {
    if (
      this.elements.flipHeightSlider &&
      this.elements.flipHeightValueDisplay
    ) {
      const value = this.elements.flipHeightSlider.value;
      this.elements.flipHeightValueDisplay.textContent = `${value}%`;
    }
  }

  _updatePreview() {
    const { previewArea, previewPlaceholder, previewError } = this.elements;
    if (!previewArea) return;

    if (!window.customElements.get("flip-card")) {
      if (previewPlaceholder)
        previewPlaceholder.textContent = "Загрузка компонента...";

      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@auroratide/flip-card/lib/define.js";
      script.onload = () => {
        window.customElements
          .whenDefined("flip-card")
          .then(() => this._updatePreview())
          .catch(() => {
            if (previewError) {
              previewError.style.display = "block";
              previewError.textContent =
                "Не удалось загрузить компонент для превью.";
            }
          });
      };
      document.head.appendChild(script);
      return;
    }

    if (previewPlaceholder) previewPlaceholder.style.display = "none";
    if (previewError) previewError.style.display = "none";

    const trigger =
      this.shadowRoot.querySelector('input[name="cf-trigger"]:checked')
        ?.value || "click";
    const direction =
      this.shadowRoot.querySelector('input[name="cf-direction"]:checked')
        ?.value || "horizontal";
    const duration = parseInt(this.elements.speedSlider?.value, 10) || 750;
    const animationStyle =
      this.elements.animationStyleSelect?.value || "default";
    const borderRadius = parseInt(this.elements.borderRadiusInput?.value, 10);
    const flipHeightPercent =
      parseInt(this.elements.flipHeightSlider?.value, 10) || 25;

    const flipHeightEm = (flipHeightPercent / 100) * 40;

    if (this.elements.previewArea) {
      this.elements.previewArea.style.overflow = "visible";
    }

    if (this.previewFlipCard && previewArea.contains(this.previewFlipCard)) {
      this._removePreviewTrigger();
      this.previewFlipCard.remove();
    }

    this.previewFlipCard = document.createElement("flip-card");
    const front = document.createElement("section");
    front.slot = "front";
    //front.textContent = "Лицевая сторона";
    const back = document.createElement("section");
    back.slot = "back";
    //back.textContent = "Обратная сторона";
    this.previewFlipCard.append(front, back);

    this.previewFlipCard.style.setProperty("--flip-duration", `${duration}ms`);
    this.previewFlipCard.style.borderRadius = `${
      isNaN(borderRadius) ? 8 : borderRadius
    }px`;
    this.previewFlipCard.style.setProperty(
      "--flip-height",
      `${flipHeightEm}em`
    );
    this.previewFlipCard.style.setProperty("--corner-granularity", "8");

    previewArea.appendChild(this.previewFlipCard);
    this.previewTriggerElement = this.previewFlipCard;

    const backSlotElement = this.previewFlipCard.querySelector('[slot="back"]');

    if (direction === "vertical") {
      if (backSlotElement) {
        backSlotElement.style.transform = "scaleY(-1)";
      }
      const kfFront = [
        { transform: "rotateX(180deg)" },
        { transform: "rotateX(270deg)" },
        { transform: "rotateX(360deg)" },
      ];
      const kfBack = [
        { transform: "rotateX(0deg)" },
        { transform: "rotateX(90deg)" },
        { transform: "rotateX(180deg)" },
      ];
      const opts = { easing: "ease-in-out" };
      this.previewFlipCard.setFlipToFrontAnimation(kfFront, opts);
      this.previewFlipCard.setFlipToBackAnimation(kfBack, opts);
    } else if (direction === "horizontal" && animationStyle === "flat") {
      if (backSlotElement) {
        backSlotElement.style.transform = "";
      }
      const kfFront = [
        { transform: "rotateY(180deg)" },
        { transform: "rotateY(270deg)" },
        { transform: "rotateY(360deg)" },
      ];
      const kfBack = [
        { transform: "rotateY(0deg)" },
        { transform: "rotateY(90deg)" },
        { transform: "rotateY(180deg)" },
      ];
      const opts = { easing: "ease-in-out" };
      this.previewFlipCard.setFlipToFrontAnimation(kfFront, opts);
      this.previewFlipCard.setFlipToBackAnimation(kfBack, opts);
    } else {
      if (backSlotElement) {
        backSlotElement.style.transform = "";
      }
    }

    this._bindPreviewTrigger(trigger);
    this.previewFlipCard.setAttribute("tabindex", "0");
  }

  _bindPreviewTrigger(triggerType) {
    if (!this.previewTriggerElement || !this.previewFlipCard) return;
    this._removePreviewTrigger();

    const card = this.previewFlipCard;

    if (triggerType === "hover") {
      let intentToFlipToBack = false;
      let isAnimating = false;

      const flippingListener = () => {
        isAnimating = true;
      };
      const flippedListener = () => {
        isAnimating = false;
        if (!intentToFlipToBack && card.hasAttribute("facedown")) {
          card.flip();
        }
      };

      card.addEventListener("flipping", flippingListener);
      card.addEventListener("flipped", flippedListener);

      this._previewHoverEnter = () => {
        intentToFlipToBack = true;
        if (!isAnimating && !card.hasAttribute("facedown")) {
          card.flip();
        }
      };

      this._previewHoverLeave = () => {
        intentToFlipToBack = false;
        if (!isAnimating && card.hasAttribute("facedown")) {
          card.flip();
        }
      };

      this.previewTriggerElement.addEventListener(
        "mouseenter",
        this._previewHoverEnter
      );
      this.previewTriggerElement.addEventListener(
        "mouseleave",
        this._previewHoverLeave
      );

      this._previewKeydownAction = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isAnimating) card.flip();
        }
      };

      this.previewTriggerElement.addEventListener(
        "keydown",
        this._previewKeydownAction
      );
    } else {
      let isClickFlipping = false;

      this._previewClickAction = () => {
        if (!isClickFlipping) {
          isClickFlipping = true;
          card.flip();
        }
      };

      const clickFlippedListener = () => {
        isClickFlipping = false;
      };

      card.addEventListener("flipped", clickFlippedListener);
      this.previewTriggerElement.addEventListener(
        "click",
        this._previewClickAction
      );

      this._previewKeydownAction = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isClickFlipping) {
            isClickFlipping = true;
            card.flip();
          }
        }
      };

      this.previewTriggerElement.addEventListener(
        "keydown",
        this._previewKeydownAction
      );
    }
  }

  _removePreviewTrigger() {
    if (!this.previewTriggerElement || !this.previewFlipCard) return;

    const card = this.previewFlipCard;

    if (this._previewClickAction) {
      this.previewTriggerElement.removeEventListener(
        "click",
        this._previewClickAction
      );
    }
    if (this._previewHoverEnter) {
      this.previewTriggerElement.removeEventListener(
        "mouseenter",
        this._previewHoverEnter
      );
    }
    if (this._previewHoverLeave) {
      this.previewTriggerElement.removeEventListener(
        "mouseleave",
        this._previewHoverLeave
      );
    }
    if (this._previewKeydownAction) {
      this.previewTriggerElement.removeEventListener(
        "keydown",
        this._previewKeydownAction
      );
    }

    this._previewClickAction = null;
    this._previewHoverEnter = null;
    this._previewHoverLeave = null;
    this._previewKeydownAction = null;
  }

  collectData() {
    const containerSelector = this.elements.containerSelectorInput?.value
      .trim()
      .replace(/^\./, "");
    const trigger =
      this.shadowRoot.querySelector('input[name="cf-trigger"]:checked')
        ?.value || "click";
    const direction =
      this.shadowRoot.querySelector('input[name="cf-direction"]:checked')
        ?.value || "horizontal";
    const duration = parseInt(this.elements.speedSlider?.value, 10) || 750;
    const animationStyle =
      direction === "horizontal"
        ? this.elements.animationStyleSelect?.value || "default"
        : "default";
    const borderRadius = parseInt(this.elements.borderRadiusInput?.value, 10);
    const flipHeightPercent =
      parseInt(this.elements.flipHeightSlider?.value, 10) || 25;

    const rx = /^[a-zA-Z0-9_-]+$/;
    if (!containerSelector) {
      this.showErrorPopup("Укажите CSS‑класс основного блока‑контейнера.");
      return null;
    }
    if (!rx.test(containerSelector)) {
      this.showErrorPopup(
        `Класс "${containerSelector}" содержит недопустимые символы.`
      );
      return null;
    }

    const validateNumber = (value, min, max, defaultValue) => {
      const num = parseInt(value, 10);
      return isNaN(num) || num < min || num > max ? defaultValue : num;
    };

    return {
      containerSelector,
      trigger,
      direction,
      duration: validateNumber(duration, 100, 5000, 750),
      animationStyle,
      borderRadius: validateNumber(borderRadius, 0, 1000, 8),
      flipHeightPercent: validateNumber(flipHeightPercent, 0, 100, 50),
    };
  }

  generateCode(settings) {
    if (!settings) {
      console.error(
        "CardFlipGenerator: Ошибка - нет настроек для генерации кода."
      );
      return "";
    }

    const configJson = JSON.stringify(settings, null, 2);
    const flipCardCDN = "https://unpkg.com/@auroratide/flip-card/lib/define.js";
    const containerClass = settings.containerSelector;

    let styleRules = [];
    let containerSpecificStyles = [];

    if (settings.borderRadius != null && settings.borderRadius >= 0) {
      containerSpecificStyles.push(`border-radius: ${settings.borderRadius}px`);
      containerSpecificStyles.push(`-webkit-transform-style: preserve-3d`);
      containerSpecificStyles.push(`transform-style: preserve-3d`);
    }

    if (settings.showBackInitially) {
      styleRules.push(`
.${containerClass} > .flip-front { display: none !important; }
.${containerClass} > .flip-back { display: block !important; }
      `);
    } else {
      styleRules.push(`
.${containerClass} > .flip-back { display: none !important; }
.${containerClass} > .flip-front { display: block !important; }
      `);
    }

    if (containerSpecificStyles.length > 0) {
      styleRules.push(
        `.${settings.containerSelector} {\n  ${containerSpecificStyles.join(
          ";\n  "
        )};\n}`
      );
    }

    styleRules.push(`
.${containerClass}:not([data-taptop-flip-card-initialized="true"]) {
    overflow: hidden;
}
    `);

    styleRules.push(`
.${containerClass}.cf-vertical flip-card > [slot="back"] { 
    transform: scale(-1);
}
    `);

    const styleBlock = `<style>\n${styleRules.join("\n").trim()}\n</style>`;
    const scriptContent = `
const debounce = (fn, wait = 250) => {
  let t;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
};

function loadFlipCardLibrary(cdnUrl, callback) {
    const scriptId = 'auroratide-flip-card-script';

    if (document.getElementById(scriptId) || window.customElements.get('flip-card')) {
        if (window.customElements.get('flip-card')) {
            console.log('[FlipCard Loader] Компонент уже зарегистрирован.');
            requestAnimationFrame(callback);
        } else {
            console.log('[FlipCard Loader] Скрипт загружается, ожидание регистрации...');
            window.customElements.whenDefined('flip-card')
                .then(() => requestAnimationFrame(callback))
                .catch(err => console.error('[FlipCard Loader] Ошибка ожидания регистрации:', err));
        }
        return;
    }

    console.log('[FlipCard Loader] Загрузка библиотеки с:', cdnUrl);
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'module';
    script.src = cdnUrl;
    script.onload = () => {
        console.log('[FlipCard Loader] Скрипт загружен, ожидание регистрации...');
         window.customElements.whenDefined('flip-card')
             .then(() => {
                 console.log('[FlipCard Loader] Компонент зарегистрирован после загрузки.');
                 requestAnimationFrame(callback);
             })
            .catch(err => console.error('[FlipCard Loader] Ошибка ожидания регистрации после загрузки:', err));
    };
    script.onerror = () => console.error('[FlipCard Loader] Ошибка загрузки скрипта библиотеки:', cdnUrl);
    document.head.appendChild(script);
}

function _createFlipCardElement(config) {
    const flipCardElement = document.createElement('flip-card');
    flipCardElement.style.setProperty('--flip-duration', \`\${config.duration || 750}ms\`);
    if (config.showBackInitially) {
        flipCardElement.setAttribute('facedown', '');
    }
    if (config.borderRadius != null) flipCardElement.style.borderRadius = config.borderRadius + 'px';
    return flipCardElement;
}

function _assignSlotsAndAppend(frontEl, backEl, flipCardElement) {
    if (frontEl) {
        frontEl.setAttribute('slot', 'front');
        flipCardElement.appendChild(frontEl);
         console.log('[FlipCard Slot] Назначен slot="front" существующему .flip-front и добавлен в flip-card.');
    } else {
        console.error('[FlipCard Slot] Оригинальный элемент .flip-front не найден!');
    }

    if (backEl) {
        backEl.setAttribute('slot', 'back');
        flipCardElement.appendChild(backEl);
        console.log('[FlipCard Slot] Назначен slot="back" существующему .flip-back и добавлен в flip-card.');
    } else {
        console.error('[FlipCard Slot] Оригинальный элемент .flip-back не найден!');
    }
}

function initFlipCards(config) {
    try {
       const containers = document.querySelectorAll('.' + config.containerSelector);

       if (containers.length === 0) {
           console.warn(\`[FlipCard Init] Не найдено ни одного контейнера с классом '\${config.containerSelector}'. Убедитесь, что класс указан верно и элементы существуют на странице.\`);
           return;
       }
       console.log(\`[FlipCard Init] Найдено контейнеров для инициализации: \${containers.length}\`);

    containers.forEach((container, index) => {
        const instanceId = \`\${config.containerSelector}-\${index}\`;
        if (container.dataset.taptopFlipCardInitialized === 'true') {
            console.warn(\`[FlipCard Init] \${instanceId}: Контейнер уже инициализирован. Пропускаем.\`);
            return;
        }
        const frontEl = container.querySelector('.flip-front');
        const backEl = container.querySelector('.flip-back');
        if (!frontEl) {
            console.error(\`[FlipCard Init] \${instanceId}: Не найден элемент '.flip-front'. Пропускаем.\`);
            return;
        }
        if (!backEl) {
            console.error(\`[FlipCard Init] \${instanceId}: Не найден элемент '.flip-back'. Пропускаем.\`);
            return;
        }
         console.log(\`[FlipCard Init] \${instanceId}: Найдены .flip-front и .flip-back.\`);

        const flipCardElement = _createFlipCardElement(config);
        _assignSlotsAndAppend(frontEl, backEl, flipCardElement);
        container.appendChild(flipCardElement);
        if (config.borderRadius != null && config.borderRadius >= 0) {
           flipCardElement.style.borderRadius = config.borderRadius + 'px';
        }
        console.log(\`[FlipCard Init] \${instanceId}: <flip-card> создан и добавлен.\`);

        let currentTrigger = config.trigger;
        const hybridBreakpoint = 992;

        function attachEventListeners() {
    const oldListeners = container.__taptopFlipListeners || {};
    if (oldListeners.click) container.removeEventListener('click', oldListeners.click);
    if (oldListeners.keydown) container.removeEventListener('keydown', oldListeners.keydown);
    if (oldListeners.mouseenter) container.removeEventListener('mouseenter', oldListeners.mouseenter);
    if (oldListeners.mouseleave) container.removeEventListener('mouseleave', oldListeners.mouseleave);
    if (oldListeners.focus) container.removeEventListener('focus', oldListeners.focus);
    if (oldListeners.blur) container.removeEventListener('blur', oldListeners.blur);
    
    const cardElement = container.querySelector('flip-card');
    if (cardElement && cardElement.__flippingListener) {
        cardElement.removeEventListener('flipping', cardElement.__flippingListener);
    }
    if (cardElement && cardElement.__flippedListener) {
        cardElement.removeEventListener('flipped', cardElement.__flippedListener);
    }
    container.__taptopFlipListeners = {};

    if (currentTrigger === 'click') {
        let isClickFlipping = false;
        const clickHandler = () => {
            if (isClickFlipping || !cardElement || typeof cardElement.flip !== 'function') return;
            isClickFlipping = true;
            cardElement.flip();
        };
        const keydownHandler = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isClickFlipping || !cardElement || typeof cardElement.flip !== 'function') return;
                isClickFlipping = true;
                cardElement.flip();
            }
        };
        container.addEventListener('click', clickHandler);
        container.addEventListener('keydown', keydownHandler);
        container.__taptopFlipListeners = { click: clickHandler, keydown: keydownHandler };

        if (cardElement) {
            const clickFlippingListener = () => { };
            const clickFlippedListener = (e) => {
                isClickFlipping = false;
                container.setAttribute('aria-pressed', e.detail.facedown ? 'true' : 'false');
            };
            cardElement.addEventListener('flipping', clickFlippingListener);
            cardElement.addEventListener('flipped', clickFlippedListener);
            cardElement.__flippingListener = clickFlippingListener;
            cardElement.__flippedListener = clickFlippedListener;
        }

    } else if (currentTrigger === 'hover') {
        console.log(\`[FlipCard Trigger] \${instanceId}: Hover Logic Active (Smart Hover/Click)\`);
        if (!cardElement || typeof cardElement.flip !== 'function') {
            console.warn(\`[FlipCard Trigger] \${instanceId}: <flip-card> element not found or .flip not a function.\`);
            return;
        }

        let intentToFlipToBack = false;
        let isAnimatingByComponent = false;

        const flippingListener = (e) => {
            isAnimatingByComponent = true;
            container.setAttribute('aria-pressed', e.detail.facedown ? 'true' : 'false');
        };
        const flippedListener = (e) => {
            isAnimatingByComponent = false;
            container.setAttribute('aria-pressed', e.detail.facedown ? 'true' : 'false');
            if (!intentToFlipToBack && cardElement.hasAttribute('facedown')) {
                cardElement.flip();
            }
        };

        cardElement.addEventListener('flipping', flippingListener);
        cardElement.addEventListener('flipped', flippedListener);
        cardElement.__flippingListener = flippingListener;
        cardElement.__flippedListener = flippedListener;

        const mouseEnterHandler = () => {
            intentToFlipToBack = true;
            if (isAnimatingByComponent) {
                return; 
            }
            if (!cardElement.hasAttribute('facedown')) {
                cardElement.flip();
            }
        };

        const mouseLeaveHandler = () => {
            intentToFlipToBack = false;
            if (isAnimatingByComponent) {
                return; 
            }
            if (cardElement.hasAttribute('facedown')) {
                cardElement.flip();
            }
        };
        
        const focusHandler = () => container.classList.add('hover-active');
        const blurHandler = () => container.classList.remove('hover-active');
        
        const keydownHandler = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isAnimatingByComponent && config.trigger === 'hover') {
                    return;
                }
                cardElement.flip();
            }
        };

        container.addEventListener('mouseenter', mouseEnterHandler);
        container.addEventListener('mouseleave', mouseLeaveHandler);
        container.addEventListener('focus', focusHandler);
        container.addEventListener('blur', blurHandler);
        container.addEventListener('keydown', keydownHandler);
        
        container.__taptopFlipListeners = {
            mouseenter: mouseEnterHandler, mouseleave: mouseLeaveHandler,
            focus: focusHandler, blur: blurHandler, keydown: keydownHandler,
            componentFlipping: flippingListener, 
            componentFlipped: flippedListener
        };
    }
}

        const updateTriggerBasedOnScreen = () => {
            const newTriggerBasedOnWidth = window.innerWidth < hybridBreakpoint ? 'click' : 'hover';
            if (newTriggerBasedOnWidth !== currentTrigger) {
                currentTrigger = newTriggerBasedOnWidth;
                console.log(\`[FlipCard Trigger Update] \${instanceId}: Mode switched to \${currentTrigger}. Re-attaching listeners.\`);
                attachEventListeners();
            }
        };
        if (config.trigger === 'hover') {
            container.classList.remove('cf-horizontal', 'cf-vertical');
            currentTrigger = window.innerWidth < hybridBreakpoint ? 'click' : 'hover';
            console.log(\`[FlipCard Init] \${instanceId}: Initial trigger mode for hover config: \${currentTrigger}.\`);
            attachEventListeners();
            if (container.__taptopResizeListener) {
                window.removeEventListener('resize', container.__taptopResizeListener);
            }
            container.__taptopResizeListener = debounce(updateTriggerBasedOnScreen, 200);
            window.addEventListener('resize', container.__taptopResizeListener);
        } else {
            container.classList.remove('cf-horizontal', 'cf-vertical');
            currentTrigger = 'click';
            attachEventListeners();
        }

        const backSlotInGeneratedCard = flipCardElement.querySelector('[slot="back"]');

        if (config.direction === 'vertical' && flipCardElement.setFlipToFrontAnimation) {
             container.classList.add('cf-vertical');
             _applyVerticalAnimation(flipCardElement);
             console.log(\`[FlipCard Init] \${instanceId}: Установлена вертикальная анимация.\`);
        } else if (config.direction === 'horizontal' && config.animationStyle === 'flat' && flipCardElement.setFlipToFrontAnimation) {
             container.classList.add('cf-horizontal');
             const kfFront = [ { transform: "rotateY(180deg)" }, { transform: "rotateY(270deg)" }, { transform: "rotateY(360deg)" } ];
             const kfBack = [ { transform: "rotateY(0deg)" }, { transform: "rotateY(90deg)" }, { transform: "rotateY(180deg)" } ];
             const opts = { easing: "ease-in-out" };
             flipCardElement.setFlipToFrontAnimation(kfFront, opts);
             flipCardElement.setFlipToBackAnimation(kfBack, opts);
             console.log(\`[FlipCard Init] \${instanceId}: Установлена плоская горизонтальная анимация.\`);
        } else {
             container.classList.add('cf-horizontal');
             _resetToHorizontalAnimation(flipCardElement);
             console.log(\`[FlipCard Init] \${instanceId}: Используется стандартная горизонтальная анимация.\`);
        }

        if (config.borderRadius != null && config.borderRadius >= 0) {
           flipCardElement.style.borderRadius = config.borderRadius + 'px';
        }
        const flipHeightEm = ((config.flipHeightPercent != null ? config.flipHeightPercent : 50) / 100) * 40;
        flipCardElement.style.setProperty('--flip-height', \`\${flipHeightEm}em\`);
        flipCardElement.style.setProperty('--corner-granularity', '8');

         container.setAttribute('tabindex', '0');
         if (config.trigger === 'hover') {
             container.style.cursor = 'default'; 
         } else {
             container.style.cursor = 'pointer';
         }
        container.setAttribute('role', 'button');
        container.setAttribute('aria-pressed', flipCardElement.hasAttribute('facedown') ? 'true' : 'false');
        container.setAttribute('aria-label', 'Перевернуть карточку');

        container.dataset.taptopFlipCardInitialized = 'true';
        console.log(\`[FlipCard Init] \${instanceId}: Инициализация завершена.\`);
    });
   } catch (e) {
        console.error(\`[FlipCard Init] Ошибка при поиске или инициализации контейнеров ('\${config.containerSelector}'):\`, e);
   }
}

function _applyVerticalAnimation(flipCardElement) {
     if (!flipCardElement?.setFlipToFrontAnimation) return;
     const vKF = [{ transform: "rotateX(180deg)" },{ transform: "rotateX(270deg)" },{ transform: "rotateX(360deg)" }];
     const vKB = [{ transform: "rotateX(0deg)" },{ transform: "rotateX(90deg)" },{ transform: "rotateX(180deg)" }];
     const opts = { easing: "ease-in-out" };
     flipCardElement.setFlipToFrontAnimation(vKF, opts);
     flipCardElement.setFlipToBackAnimation(vKB, opts);
}

function _resetToHorizontalAnimation(flipCardElement) {
    
}

document.addEventListener('DOMContentLoaded', () => {
     loadFlipCardLibrary('${flipCardCDN}', () => {
        const currentConfig = ${configJson};
        initFlipCards(currentConfig);
    });
});
    `;

    return `${styleBlock}\n<script type="module">\n${scriptContent}\n</script>\n`;
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
      if (minifiedJS) result += `<script type="module">${minifiedJS}</script>`;

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
    const settings = this.collectData();

    if (settings === null) {
      return;
    }

    const rawCode = this.generateCode(settings);
    const code = await this.minifyGeneratedCode(rawCode);
    this.copyToClipboard(code);
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showSuccessPopup();
        })
        .catch(() => {
          this.fallbackCopyToClipboard(text);
        });
    } else {
      this.fallbackCopyToClipboard(text);
    }
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      this.showSuccessPopup();
    } catch (err) {
      console.error("Ошибка копирования:", err);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  showSuccessPopup() {
    const modal = document.querySelector("#success-modal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  showErrorPopup(message) {
    alert(message);
  }

  destroy() {
    this.unbindEvents();
    this._removePreviewTrigger();
    this.initialized = false;
  }
}

customElements.define("card-flip-generator", CardFlipGenerator);
