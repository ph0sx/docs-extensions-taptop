// Before After Slider Generator Web Component для Taptop
class BeforeAfterSliderGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;
    this.configDefaults = {
      imageUrlBefore: "",
      imageUrlAfter: "",
      containerSelector: "",
      initialPosition: 50,
      orientation: "horizontal",
      hoverMode: false,
      handleOnlyDrag: false,
      dividerWidth: 1,
      dividerColor: "#ffffff",
      handleWidth: 40,
      handleColor: "#ffffff",
      hideHandle: false,
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

      .before-after-slider-generator {
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
        top: 5px;
        left: 5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
      }

      .radio-container input[type="radio"]:checked ~ .radio-checkmark:after {
        display: block;
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

      .color-input {
        width: 60px;
        height: 40px;
        padding: 0;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        background: none;
      }

      .color-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
      }

      .settings-column {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .settings-row {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }

      .settings-row .setting-group {
        flex: 1;
        min-width: 120px;
        gap: 10px;
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

      .preview-container {
        position: relative;
        margin-top: 15px;
        border: 2px dashed var(--border-color);
        border-radius: var(--radius-md);
        background: #fafafa;
        width: 100%;
        max-height: 400px;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .preview-area {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preview-placeholder {
        text-align: center;
        color: var(--text-light);
        font-size: 14px;
        padding: 20px;
        position:absolute;
      }

      .preview-error {
        display: none;
        text-align: center;
        color: #e74c3c;
        font-size: 14px;
        padding: 20px;
        background: rgba(231, 76, 60, 0.1);
        border-radius: var(--radius-sm);
        margin: 10px;
      }

      .preview-settings {
        margin-bottom: 15px;
      }

      img-comparison-slider {
        outline: none !important;
      }
    `;
  }

  getTemplate() {
    return `
      <form class="before-after-slider-generator">
        <div class="form-grid">
          <fieldset>
            <legend>Основные настройки</legend>
            <div class="setting-group">
              <div class="setting-group">
                <label for="image-url-before">URL изображения "До":</label>
                <input type="url" id="image-url-before" class="text-input" placeholder="https://example.com/before.jpg">
                <div class="helper-text">Ссылка на изображение, которое будет показано в левой/верхней части</div>
              </div>

              <div class="setting-group">
                <label for="image-url-after">URL изображения "После":</label>
                <input type="url" id="image-url-after" class="text-input" placeholder="https://example.com/after.jpg">
                <div class="helper-text">Ссылка на изображение, которое будет показано в правой/нижней части</div>
              </div>

              <div class="setting-group">
                <label for="container-selector">CSS-класс контейнера:</label>
                <input type="text" id="container-selector" class="text-input" placeholder="slider-container">
                <div class="helper-text">Класс блока, в который будет добавлен слайдер (без точки)</div>
              </div>

              <div class="setting-group">
                <label for="initial-position">Начальная позиция разделителя:</label>
                <div class="slider-container">
                  <input type="range" id="initial-position" min="0" max="100" value="50" class="slider">
                  <div class="slider-labels">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                  <div class="slider-value">
                    <span id="initial-position-value" class="slider-value-primary">50%</span>
                  </div>
                </div>
                <div class="helper-text">Где будет располагаться разделитель при загрузке страницы</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Поведение слайдера</legend>
            <div class="setting-group">
              <div class="setting-group">
                <label>Ориентация слайдера:</label>
                <div class="radio-group">
                  <label class="radio-container">
                    <input type="radio" name="orientation" value="horizontal" checked>
                    <span class="radio-checkmark"></span>
                    Горизонтальная (слева-направо)
                  </label>
                  <label class="radio-container">
                    <input type="radio" name="orientation" value="vertical">
                    <span class="radio-checkmark"></span>
                    Вертикальная (сверху-вниз)
                  </label>
                </div>
                <div class="helper-text">Направление движения разделителя</div>
              </div>

              <div class="setting-group">
                <label class="checkbox-container">
                  <input type="checkbox" id="hover-mode">
                  <span class="checkbox-option-label">Режим наведения</span>
                </label>
                <div class="helper-text">Слайдер будет следовать за курсором мыши при наведении</div>
              </div>

              <div class="setting-group">
                <label class="checkbox-container">
                  <input type="checkbox" id="handle-only-drag">
                  <span class="checkbox-option-label">Перетаскивание только за ручку</span>
                </label>
                <div class="helper-text">Слайдер можно будет двигать только за ручку, а не по всей области</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Внешний вид</legend>
            <div class="settings-column">
              <div class="setting-group">
                <label for="divider-width">Толщина разделителя (px):</label>
                <input type="number" id="divider-width" class="number-input" value="1" min="0" max="10">
                <div class="helper-text">Ширина линии между изображениями</div>
              </div>

              <div class="setting-group">
                <label for="divider-color">Цвет разделителя:</label>
                <input type="color" id="divider-color" class="color-input" value="#ffffff">
                <div class="helper-text">Цвет линии разделителя</div>
              </div>

              <div class="setting-group">
                <label for="handle-width">Размер ручки (px):</label>
                <input type="number" id="handle-width" class="number-input" value="40" min="20" max="80">
                <div class="helper-text">Размер круглой ручки для перетаскивания</div>
              </div>

              <div class="setting-group">
                <label for="handle-color">Цвет ручки:</label>
                <input type="color" id="handle-color" class="color-input" value="#ffffff">
                <div class="helper-text">Цвет круглой ручки</div>
              </div>

              <div class="setting-group">
                <label class="checkbox-container">
                  <input type="checkbox" id="hide-handle">
                  <span class="checkbox-option-label">Скрыть ручку</span>
                </label>
                <div class="helper-text">Сделать ручку невидимой (слайдер останется функциональным)</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Предпросмотр</legend>
            <div class="setting-group">
              <div class="preview-container" id="preview-container">
                <div id="preview-area" class="preview-area"></div>
                <div id="preview-placeholder" class="preview-placeholder">
                  Укажите URL изображений для предпросмотра
                </div>
                <div id="preview-error" class="preview-error"></div>
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
    // Внутренние элементы (в Shadow DOM)
    const elements = {
      imageUrlBefore: this.shadowRoot.getElementById("image-url-before"),
      imageUrlAfter: this.shadowRoot.getElementById("image-url-after"),
      containerSelector: this.shadowRoot.getElementById("container-selector"),
      initialPosition: this.shadowRoot.getElementById("initial-position"),
      initialPositionValue: this.shadowRoot.getElementById(
        "initial-position-value"
      ),
      orientationRadios: this.shadowRoot.querySelectorAll(
        'input[name="orientation"]'
      ),
      hoverMode: this.shadowRoot.getElementById("hover-mode"),
      handleOnlyDrag: this.shadowRoot.getElementById("handle-only-drag"),
      dividerWidth: this.shadowRoot.getElementById("divider-width"),
      dividerColor: this.shadowRoot.getElementById("divider-color"),
      handleWidth: this.shadowRoot.getElementById("handle-width"),
      handleColor: this.shadowRoot.getElementById("handle-color"),
      hideHandle: this.shadowRoot.getElementById("hide-handle"),
      // Элементы превью
      previewContainer: this.shadowRoot.getElementById("preview-container"),
      previewArea: this.shadowRoot.getElementById("preview-area"),
      previewPlaceholder: this.shadowRoot.getElementById("preview-placeholder"),
      previewError: this.shadowRoot.getElementById("preview-error"),
      generateButton: this.shadowRoot.getElementById("generate-btn"),
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
      handlePositionInput: () => this.updatePositionDisplay(),
      handlePreviewUpdate: () => this.updatePreview(),
    };

    this.eventHandlers = handlers;

    this.elements.generateButton?.addEventListener(
      "click",
      handlers.handleGenerate
    );
    this.elements.initialPosition?.addEventListener(
      "input",
      handlers.handlePositionInput
    );

    // Обработчики для обновления превью
    this.elements.imageUrlBefore?.addEventListener(
      "input",
      handlers.handlePreviewUpdate
    );
    this.elements.imageUrlAfter?.addEventListener(
      "input",
      handlers.handlePreviewUpdate
    );
    this.elements.initialPosition?.addEventListener(
      "input",
      handlers.handlePreviewUpdate
    );
    this.elements.orientationRadios?.forEach((radio) => {
      radio.addEventListener("change", handlers.handlePreviewUpdate);
    });
    this.elements.hoverMode?.addEventListener(
      "change",
      handlers.handlePreviewUpdate
    );
    this.elements.handleOnlyDrag?.addEventListener(
      "change",
      handlers.handlePreviewUpdate
    );
    this.elements.dividerWidth?.addEventListener(
      "input",
      handlers.handlePreviewUpdate
    );
    this.elements.dividerColor?.addEventListener(
      "change",
      handlers.handlePreviewUpdate
    );
    this.elements.handleWidth?.addEventListener(
      "input",
      handlers.handlePreviewUpdate
    );
    this.elements.handleColor?.addEventListener(
      "change",
      handlers.handlePreviewUpdate
    );
    this.elements.hideHandle?.addEventListener(
      "change",
      handlers.handlePreviewUpdate
    );

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
    this.updatePositionDisplay();
    this.loadSliderLibrary(() => {
      this.updatePreview();
    });
  }

  updatePositionDisplay() {
    const { initialPosition, initialPositionValue } = this.elements;
    if (!initialPosition || !initialPositionValue) return;

    const value = initialPosition.value;
    initialPositionValue.textContent = `${value}%`;
  }

  loadSliderLibrary(callback) {
    const sliderLibraryUrl =
      "https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/index.js";
    const sliderStylesUrl =
      "https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/styles.css";
    let scriptLoaded = false;
    let stylesLoaded = false;

    const checkComplete = () => {
      if (scriptLoaded && stylesLoaded) {
        callback();
      }
    };

    // Загрузка стилей
    if (!document.querySelector(`link[href="${sliderStylesUrl}"]`)) {
      const linkTag = document.createElement("link");
      linkTag.rel = "stylesheet";
      linkTag.href = sliderStylesUrl;
      linkTag.onload = () => {
        stylesLoaded = true;
        checkComplete();
      };
      linkTag.onerror = () => {
        stylesLoaded = true; // Продолжаем даже при ошибке
        checkComplete();
      };
      document.head.appendChild(linkTag);
    } else {
      stylesLoaded = true;
    }

    // Загрузка скрипта
    if (!document.querySelector(`script[src="${sliderLibraryUrl}"]`)) {
      const scriptTag = document.createElement("script");
      scriptTag.src = sliderLibraryUrl;
      scriptTag.defer = true;
      scriptTag.onload = () => {
        if (
          window.customElements &&
          typeof window.customElements.whenDefined === "function"
        ) {
          window.customElements
            .whenDefined("img-comparison-slider")
            .then(() => {
              scriptLoaded = true;
              checkComplete();
            })
            .catch(() => {
              scriptLoaded = true;
              checkComplete();
            });
        } else {
          setTimeout(() => {
            scriptLoaded = true;
            checkComplete();
          }, 200);
        }
      };
      scriptTag.onerror = () => {
        scriptLoaded = true; // Продолжаем даже при ошибке
        checkComplete();
      };
      document.head.appendChild(scriptTag);
    } else {
      if (
        window.customElements &&
        window.customElements.get("img-comparison-slider")
      ) {
        scriptLoaded = true;
      } else {
        setTimeout(() => {
          scriptLoaded = true;
          checkComplete();
        }, 100);
        return;
      }
    }

    checkComplete();
  }

  updatePreview() {
    const { previewArea, previewPlaceholder, previewError, previewContainer } =
      this.elements;
    if (!previewArea || !previewContainer) return;

    // Собираем текущие настройки
    const settings = {
      imageUrlBefore: this.elements.imageUrlBefore?.value.trim() || "",
      imageUrlAfter: this.elements.imageUrlAfter?.value.trim() || "",
      initialPosition: parseInt(this.elements.initialPosition?.value, 10) || 50,
      orientation:
        this.shadowRoot.querySelector('input[name="orientation"]:checked')
          ?.value || "horizontal",
      hoverMode: this.elements.hoverMode?.checked || false,
      handleOnlyDrag: this.elements.handleOnlyDrag?.checked || false,
      dividerWidth: parseInt(this.elements.dividerWidth?.value, 10) || 1,
      dividerColor: this.elements.dividerColor?.value || "#ffffff",
      handleWidth: parseInt(this.elements.handleWidth?.value, 10) || 40,
      handleColor: this.elements.handleColor?.value || "#ffffff",
      hideHandle: this.elements.hideHandle?.checked || false,
    };

    // Скрываем ошибки и плейсхолдер по умолчанию
    if (previewPlaceholder) previewPlaceholder.style.display = "none";
    if (previewError) previewError.style.display = "none";

    // Проверяем URL
    if (!settings.imageUrlBefore || !settings.imageUrlAfter) {
      if (previewPlaceholder) previewPlaceholder.style.display = "block";
      // Удаляем старый слайдер, если он был
      const existingSlider = previewArea.querySelector("img-comparison-slider");
      if (existingSlider) existingSlider.remove();
      return;
    }

    // Проверка URL для превью
    const checkPreviewUrl = (url) => {
      if (!url) return true;
      if (
        url.startsWith("http:") ||
        url.startsWith("https:") ||
        url.startsWith("/") ||
        url.startsWith("data:")
      ) {
        return false;
      }
      return true;
    };

    let urlError = false;
    if (
      checkPreviewUrl(settings.imageUrlBefore) ||
      checkPreviewUrl(settings.imageUrlAfter)
    ) {
      urlError = true;
    }

    if (urlError && (settings.imageUrlBefore || settings.imageUrlAfter)) {
      if (previewError) {
        previewError.textContent =
          "Ошибка: URL должен начинаться с http://, https:// или /";
        previewError.style.display = "block";
      }
      const existingSlider = previewArea.querySelector("img-comparison-slider");
      if (existingSlider) existingSlider.remove();
      return;
    }

    // Создаем или обновляем слайдер
    this.createPreviewSlider(settings);
  }

  createPreviewSlider(settings) {
    const { previewArea, previewError } = this.elements;

    // Проверяем доступность библиотеки
    if (
      !window.customElements ||
      !window.customElements.get("img-comparison-slider")
    ) {
      if (previewError) {
        previewError.textContent = "Библиотека слайдера не загружена";
        previewError.style.display = "block";
      }
      return;
    }

    // Удаляем существующий слайдер
    const existingSlider = previewArea.querySelector("img-comparison-slider");
    if (existingSlider) existingSlider.remove();

    // Создаем новый слайдер
    const slider = document.createElement("img-comparison-slider");
    slider.style.width = "100%";
    slider.style.height = "100%";
    slider.style.outline = "none";
    slider.setAttribute("tabindex", "-1");

    // Настройки слайдера
    slider.setAttribute("value", settings.initialPosition);
    slider.setAttribute("direction", settings.orientation);
    if (settings.hoverMode) slider.setAttribute("hover", "true");
    if (settings.handleOnlyDrag) slider.setAttribute("handle", "true");

    // Применение стилей через CSS переменные
    if (settings.dividerWidth >= 0) {
      slider.style.setProperty("--divider-width", `${settings.dividerWidth}px`);
    }
    if (settings.dividerColor) {
      slider.style.setProperty("--divider-color", settings.dividerColor);
    }
    if (settings.handleWidth >= 0) {
      slider.style.setProperty(
        "--default-handle-width",
        `${settings.handleWidth}px`
      );
    }
    if (settings.handleColor) {
      slider.style.setProperty("--default-handle-color", settings.handleColor);
    }
    slider.style.setProperty(
      "--default-handle-opacity",
      settings.hideHandle ? "0" : "1"
    );

    // Создание изображений
    const imgBefore = document.createElement("img");
    imgBefore.setAttribute("slot", "first");
    imgBefore.setAttribute("src", settings.imageUrlBefore);
    imgBefore.setAttribute("alt", "Изображение До");
    imgBefore.style.width = "100%";
    imgBefore.style.height = "auto";
    imgBefore.style.display = "block";

    imgBefore.onerror = () => {
      if (previewError) {
        previewError.textContent = 'Не удалось загрузить изображение "ДО"';
        previewError.style.display = "block";
        slider.style.display = "none";
      }
    };

    imgBefore.onload = () => {
      slider.style.display = "";
      if (previewError) previewError.style.display = "none";
    };

    const imgAfter = document.createElement("img");
    imgAfter.setAttribute("slot", "second");
    imgAfter.setAttribute("src", settings.imageUrlAfter);
    imgAfter.setAttribute("alt", "Изображение После");
    imgAfter.style.width = "100%";
    imgAfter.style.height = "auto";
    imgAfter.style.display = "block";

    imgAfter.onerror = () => {
      if (previewError) {
        previewError.textContent = 'Не удалось загрузить изображение "ПОСЛЕ"';
        previewError.style.display = "block";
        slider.style.display = "none";
      }
    };

    imgAfter.onload = () => {
      slider.style.display = "";
      if (previewError) previewError.style.display = "none";
    };

    // Добавляем изображения в слайдер
    slider.appendChild(imgBefore);
    slider.appendChild(imgAfter);

    // Добавляем слайдер в превью область
    previewArea.appendChild(slider);
  }

  collectData() {
    const imageUrlBefore = this.elements.imageUrlBefore?.value.trim() || "";
    const imageUrlAfter = this.elements.imageUrlAfter?.value.trim() || "";
    const containerSelector =
      this.elements.containerSelector?.value.trim().replace(/^\./, "") || "";

    if (!imageUrlBefore || !imageUrlAfter) {
      alert("Укажите URL для обоих изображений.");
      return null;
    }

    if (!containerSelector) {
      alert("Укажите CSS-класс блока-контейнера.");
      return null;
    }

    const validClassRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validClassRegex.test(containerSelector)) {
      alert(
        `Класс контейнера "${containerSelector}" содержит недопустимые символы.`
      );
      return null;
    }

    const orientation =
      this.shadowRoot.querySelector('input[name="orientation"]:checked')
        ?.value || "horizontal";

    return {
      imageUrlBefore: imageUrlBefore,
      imageUrlAfter: imageUrlAfter,
      containerSelector: containerSelector,
      initialPosition: parseInt(this.elements.initialPosition?.value, 10) || 50,
      orientation: orientation,
      hoverMode: this.elements.hoverMode?.checked || false,
      handleOnlyDrag: this.elements.handleOnlyDrag?.checked || false,
      dividerWidth: parseInt(this.elements.dividerWidth?.value, 10) || 1,
      dividerColor: this.elements.dividerColor?.value || "#ffffff",
      handleWidth: parseInt(this.elements.handleWidth?.value, 10) || 40,
      handleColor: this.elements.handleColor?.value || "#ffffff",
      hideHandle: this.elements.hideHandle?.checked || false,
    };
  }

  generateCode(settings) {
    const settingsJson = JSON.stringify(settings, null, 2);

    const script = `<script>
/* Generated by BeforeAfterSliderGenerator */
document.addEventListener('DOMContentLoaded', () => {
  const config = ${settingsJson};
  const sliderLibraryUrl = 'https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/index.js';
  const sliderStylesUrl = 'https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/styles.css';
  let scriptLoaded = false;
  let stylesLoaded = false;

  const initSlider = () => {
    if (!scriptLoaded || !stylesLoaded) { 
      console.log('[BeforeAfterSlider] Ожидание ресурсов...'); 
      return; 
    }
    
    if (!config.containerSelector) { 
      console.error('[BeforeAfterSlider] Ошибка: Класс контейнера не указан.'); 
      return; 
    }
    
    const container = document.querySelector('.' + config.containerSelector);
    if (!container) { 
      console.error('[BeforeAfterSlider] Ошибка: Контейнер "' + config.containerSelector + '" не найден.'); 
      return; 
    }
    
    if (container.querySelector('img-comparison-slider')) { 
      console.warn('[BeforeAfterSlider] Слайдер в "' + config.containerSelector + '" уже есть.'); 
      return; 
    }

    const slider = document.createElement('img-comparison-slider');
    slider.setAttribute('value', config.initialPosition != null ? config.initialPosition : 50);
    slider.setAttribute('direction', config.orientation || 'horizontal');
    if (config.hoverMode) { slider.setAttribute('hover', 'true'); }
    if (config.handleOnlyDrag) { slider.setAttribute('handle', 'true'); }
    slider.setAttribute('tabindex', '0');
    slider.style.outline = 'none';

    // Применение стилей через CSS переменные
    if (config.dividerWidth != null && config.dividerWidth >= 0) {
      slider.style.setProperty('--divider-width', config.dividerWidth + 'px');
    }
    if (config.dividerColor) {
      slider.style.setProperty('--divider-color', config.dividerColor);
    }
    if (config.handleWidth != null && config.handleWidth >= 0) {
      slider.style.setProperty('--default-handle-width', config.handleWidth + 'px');
    }
    if (config.handleColor) {
      slider.style.setProperty('--default-handle-color', config.handleColor);
    }
    slider.style.setProperty('--default-handle-opacity', config.hideHandle ? '0' : '1');

    // Создание изображений с корректным масштабированием
    const imgBefore = document.createElement('img');
    imgBefore.setAttribute('slot', 'first');
    imgBefore.setAttribute('src', config.imageUrlBefore);
    imgBefore.setAttribute('alt', 'Изображение До');
    imgBefore.style.width = '100%';
    imgBefore.style.height = 'auto';
    imgBefore.style.display = 'block';

    const imgAfter = document.createElement('img');
    imgAfter.setAttribute('slot', 'second');
    imgAfter.setAttribute('src', config.imageUrlAfter);
    imgAfter.setAttribute('alt', 'Изображение После');
    imgAfter.style.width = '100%';
    imgAfter.style.height = 'auto';
    imgAfter.style.display = 'block';

    slider.appendChild(imgBefore);
    slider.appendChild(imgAfter);
    container.appendChild(slider);
    console.log('[BeforeAfterSlider] Слайдер добавлен в "' + config.containerSelector + '".');
  };

  const loadScript = (url, callback) => {
    if (document.querySelector('script[src="' + url + '"]')) {
      if (window.customElements && window.customElements.get('img-comparison-slider')) {
        console.log('[BeforeAfterSlider] Скрипт библиотеки уже загружен.');
        scriptLoaded = true;
        callback();
      } else {
        console.log('[BeforeAfterSlider] Ожидание регистрации компонента...');
        const checkInterval = setInterval(() => {
          if (window.customElements && window.customElements.get('img-comparison-slider')) {
            clearInterval(checkInterval);
            console.log('[BeforeAfterSlider] Компонент зарегистрирован.');
            scriptLoaded = true;
            callback();
          }
        }, 100);
        setTimeout(() => {
          if (!scriptLoaded) {
            clearInterval(checkInterval);
            console.error('[BeforeAfterSlider] Компонент не зарегистрирован.');
            scriptLoaded = true;
            callback();
          }
        }, 5000);
      }
      return;
    }

    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      if (window.customElements && typeof window.customElements.whenDefined === 'function') {
        window.customElements.whenDefined('img-comparison-slider').then(() => {
          console.log('[BeforeAfterSlider] Скрипт загружен, компонент зарегистрирован.');
          scriptLoaded = true;
          callback();
        }).catch(err => {
          console.error('[BeforeAfterSlider] Ошибка ожидания регистрации:', err);
          scriptLoaded = true;
          callback();
        });
      } else {
        console.warn('[BeforeAfterSlider] customElements.whenDefined не поддерживается.');
        setTimeout(() => {
          console.log('[BeforeAfterSlider] Скрипт загружен (с задержкой).');
          scriptLoaded = true;
          callback();
        }, 200);
      }
    };
    scriptTag.onerror = () => {
      console.error('[BeforeAfterSlider] Ошибка загрузки скрипта:', url);
      scriptLoaded = true;
      callback();
    };
    document.head.appendChild(scriptTag);
  };

  const loadStyles = (url, callback) => {
    if (document.querySelector('link[href="' + url + '"]')) {
      console.log('[BeforeAfterSlider] Стили уже загружены.');
      stylesLoaded = true;
      callback();
      return;
    }

    const linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = url;
    let stylesTimer = null;

    linkTag.onload = () => {
      clearTimeout(stylesTimer);
      console.log('[BeforeAfterSlider] Стили загружены (onload).');
      stylesLoaded = true;
      callback();
    };

    linkTag.onerror = () => {
      clearTimeout(stylesTimer);
      console.error('[BeforeAfterSlider] Ошибка загрузки стилей:', url);
      stylesLoaded = true;
      callback();
    };

    document.head.appendChild(linkTag);
    stylesTimer = setTimeout(() => {
      if (!stylesLoaded) {
        console.warn('[BeforeAfterSlider] Стили не загрузились (таймаут).');
        stylesLoaded = true;
        callback();
      }
    }, 1500);
  };

  loadStyles(sliderStylesUrl, () => {
    loadScript(sliderLibraryUrl, () => {
      initSlider();
    });
  });
});
</script>`;

    return script;
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
    const settings = this.collectData();
    if (settings === null) {
      return;
    }

    const rawCode = this.generateCode(settings);
    const code = await this.minifyGeneratedCode(rawCode);

    try {
      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (err) {
      console.error("Не удалось скопировать код:", err);
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

  unbindEvents() {
    // Отвязываем обработчик генерации
    if (this.elements.generateButton && this.eventHandlers.handleGenerate) {
      this.elements.generateButton.removeEventListener(
        "click",
        this.eventHandlers.handleGenerate
      );
    }

    // Отвязываем обработчик слайдера
    if (
      this.elements.initialPosition &&
      this.eventHandlers.handlePositionInput
    ) {
      this.elements.initialPosition.removeEventListener(
        "input",
        this.eventHandlers.handlePositionInput
      );
    }

    // Отвязываем обработчики превью
    if (this.eventHandlers.handlePreviewUpdate) {
      this.elements.imageUrlBefore?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.imageUrlAfter?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.initialPosition?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.orientationRadios?.forEach((radio) => {
        radio.removeEventListener(
          "change",
          this.eventHandlers.handlePreviewUpdate
        );
      });
      this.elements.hoverMode?.removeEventListener(
        "change",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.handleOnlyDrag?.removeEventListener(
        "change",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.dividerWidth?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.dividerColor?.removeEventListener(
        "change",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.handleWidth?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.handleColor?.removeEventListener(
        "change",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.hideHandle?.removeEventListener(
        "change",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.previewWidth?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
      this.elements.previewHeight?.removeEventListener(
        "input",
        this.eventHandlers.handlePreviewUpdate
      );
    }

    // Отвязываем обработчики модалки
    if (this.eventHandlers.has("popup-accept")) {
      this.elements.popupAcceptBtn?.removeEventListener(
        "click",
        this.eventHandlers.get("popup-accept")
      );
    }
    if (this.eventHandlers.has("popup-close")) {
      this.elements.popupCloseBtn?.removeEventListener(
        "click",
        this.eventHandlers.get("popup-close")
      );
    }
    if (this.eventHandlers.has("popup-overlay")) {
      this.elements.successPopup?.removeEventListener(
        "click",
        this.eventHandlers.get("popup-overlay")
      );
    }

    this.eventHandlers.clear();
  }

  destroy() {
    this.unbindEvents();
    this.initialized = false;
    console.log("BeforeAfterSliderGenerator: Генератор уничтожен");
  }
}

customElements.define(
  "before-after-slider-generator",
  BeforeAfterSliderGenerator
);
