// Countdown Timer Generator Web Component для Taptop
class CountdownTimerGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;
    this.configDefaults = {
      timerType: "fixed",
      endDate: "",
      endTime: "00:00:00",
      timezone: "auto",
      durationDays: 0,
      durationHours: 1,
      durationMinutes: 0,
      durationSeconds: 0,
      displayClass: "",
      hideClasses: "",
      showClasses: "",
      hideTimerOnEnd: false,
      completionText: "",
      redirectPath: "",
      storageKey: "taptopTimerEnd_",
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

  // Встроенная утилита parseCommaList
  parseCommaList(str) {
    if (!str) return [];
    return str
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
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

      .countdown-timer-generator {
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
        gap: 15px;
        margin-bottom: 20px;
        background: white;
        padding: 15px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        width: 100%;
        max-height: calc(100vh - 65px - 76px - 55px - 97px - 55px);
        overflow: auto;
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

      .helper-text, p.helper-text {
        font-size: 13px;
        color: var(--text-light);
        line-height: 1.4;
        margin: 0;
        margin-top: -5px;
      }

      .helper-text:not(:last-child), 
      p.helper-text:not(:last-child) {
        margin-bottom: 15px;
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
        font-family: var(--ttg-font-family);
        font-size: var(--ttg-text-size-s);
        font-weight: var(--ttg-font-weight-medium);
        line-height: var(--ttg-text-line-height-s);
        letter-spacing: var(--ttg-letter-spacing);
        color: var(--ttg-color-text-black);
        cursor: pointer;
      }

      /* Радио кнопки */
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

      /* Условные группы */
      .time-settings-group {
        padding: 15px;
        background-color: rgba(248, 249, 250, 0.5);
        border-radius: var(--radius-sm);
        border: 1px dashed var(--border-color);
      }

      .time-settings-group.hidden {
        display: none;
      }

      .duration-row {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }

      .settings-column {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .duration-row .setting-group {
        flex: 1;
        min-width: 80px;
        gap: 10px;
      }

      .icon-eye-off {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="%23000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="%23F0F0F0" stroke="%23D1D5DB"/><path d="M4 12s2.5-5 8-5 8 5 8 5-2.5 5-8 5-8-5-8-5z" /><circle cx="12" cy="12" r="3" /><line x1="3" y1="3" x2="21" y2="21" stroke="%23000000" stroke-width="1.8" /></g></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        vertical-align: middle;
      }
    `;
  }

  getTemplate() {
    return `
      <form class="countdown-timer-generator">
        <div class="form-grid">
          <fieldset>
            <legend>1. Тип таймера</legend>
            
            <div class="setting-group">
              <div class="radio-group">
                <label class="radio-container">
                  <input type="radio" name="timerType" value="fixed" checked>
                  <span class="radio-checkmark"></span>
                  До конкретной даты и времени
                </label>
                <label class="radio-container">
                  <input type="radio" name="timerType" value="evergreen">
                  <span class="radio-checkmark"></span>
                  Для каждого посетителя (Вечнозеленый)
                </label>
              </div>
              <div class="helper-text">Выберите, будет ли таймер отсчитывать до одной фиксированной даты для всех, или будет запускаться индивидуально для каждого посетителя.</div>
            </div>
          </fieldset>

          <fieldset>
            <legend>2. Настройки времени</legend>

            <div class="time-settings-group" id="fixed-date-settings">
              <p class="helper-text">Таймер будет отсчитывать время до указанной даты и времени по выбранному часовому поясу.</p>
              
              <div class="settings-column">
                <div class="setting-group">
                  <label for="timer-end-date">Дата окончания:</label>
                  <input type="date" id="timer-end-date" class="text-input">
                </div>
                
                <div class="setting-group">
                  <label for="timer-end-time">Время окончания (с секундами):</label>
                  <input type="time" id="timer-end-time" class="text-input" step="1" value="00:00:00">
                </div>
                
                <div class="setting-group">
                  <label for="timer-timezone">Часовой пояс:</label>
                  <select class="select-styled" id="timer-timezone" name="timezone">
                    <option value="auto" selected>Автоматически (часовой пояс посетителя)</option>
                    <optgroup label="Россия и ближнее зарубежье">
                      <option value="2">UTC+2 (Калининград)</option>
                      <option value="3">UTC+3 (Москва)</option>
                      <option value="4">UTC+4 (Самара)</option>
                      <option value="5">UTC+5 (Екатеринбург)</option>
                      <option value="6">UTC+6 (Омск)</option>
                      <option value="7">UTC+7 (Красноярск)</option>
                      <option value="8">UTC+8 (Иркутск)</option>
                      <option value="9">UTC+9 (Якутск)</option>
                      <option value="10">UTC+10 (Владивосток)</option>
                      <option value="11">UTC+11 (Магадан)</option>
                      <option value="12">UTC+12 (Камчатка)</option>
                    </optgroup>
                    <optgroup label="Западное полушарие">
                      <option value="-12">UTC-12</option>
                      <option value="-11">UTC-11</option>
                      <option value="-10">UTC-10</option>
                      <option value="-9">UTC-9</option>
                      <option value="-8">UTC-8</option>
                      <option value="-7">UTC-7</option>
                      <option value="-6">UTC-6</option>
                      <option value="-5">UTC-5</option>
                      <option value="-4">UTC-4</option>
                      <option value="-3">UTC-3</option>
                      <option value="-2">UTC-2</option>
                      <option value="-1">UTC-1</option>
                    </optgroup>
                    <optgroup label="Центральный регион">
                      <option value="0">UTC+0 (Лондон)</option>
                      <option value="1">UTC+1 (Берлин)</option>
                    </optgroup>
                    <optgroup label="Азия и Океания">
                      <option value="4">UTC+4</option>
                      <option value="5.5">UTC+5:30</option>
                      <option value="8">UTC+8</option>
                      <option value="9">UTC+9</option>
                      <option value="9.5">UTC+9:30</option>
                      <option value="10">UTC+10</option>
                      <option value="12">UTC+12</option>
                      <option value="13">UTC+13</option>
                    </optgroup>
                  </select>
                  <div class="helper-text">Убедитесь, что дата/время установлены по выбранному часовому поясу.</div>
                </div>
              </div>
            </div>

            <div class="time-settings-group hidden" id="evergreen-settings">
              <p class="helper-text">Укажите длительность таймера. Он будет запущен индивидуально для каждого посетителя при первом заходе на страницу.</p>
              
              <div class="duration-row">
                <div class="setting-group">
                  <label for="timer-duration-days">Дни:</label>
                  <input type="number" id="timer-duration-days" class="number-input" value="0" min="0">
                </div>
                <div class="setting-group">
                  <label for="timer-duration-hours">Часы:</label>
                  <input type="number" id="timer-duration-hours" class="number-input" value="1" min="0" max="23">
                </div>
                <div class="setting-group">
                  <label for="timer-duration-minutes">Минуты:</label>
                  <input type="number" id="timer-duration-minutes" class="number-input" value="0" min="0" max="59">
                </div>
                <div class="setting-group">
                  <label for="timer-duration-seconds">Секунды:</label>
                  <input type="number" id="timer-duration-seconds" class="number-input" value="0" min="0" max="59">
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>3. Настройки классов</legend>

            <div class="settings-column">
              <div class="setting-group">
                <label for="timer-display-class">CSS-класс элемента таймера <span class="required-indicator">*</span></label>
                <input type="text" id="timer-display-class" class="text-input" placeholder="Например: timer-text" required>
                <div class="helper-text">Класс элемента (например, текстового блока), где будут отображаться цифры Д:Ч:М:С.</div>
              </div>

              <div class="setting-group">
                <label for="timer-hide-classes">CSS-классы блоков для СКРЫТИЯ</label>
                <input type="text" id="timer-hide-classes" class="text-input" placeholder="Например: offer-block, old-price">
                <div class="helper-text">Классы блоков, которые нужно скрыть по окончании таймера. Оставьте пустым, если ничего скрывать не нужно.</div>
              </div>

              <div class="setting-group">
                <label for="timer-show-classes">CSS-классы блоков для ПОКАЗА (опционально)</label>
                <input type="text" id="timer-show-classes" class="text-input" placeholder="Например: expired-message, subscribe-form">
                <div class="helper-text">Классы блоков, которые нужно показать по окончании таймера. <strong>Важно!</strong> Блокам в Taptop нужно присвоить отдельный класс и через панель стилей установить <code>Отображение: Скрыть элемент <span class="icon-eye-off"></span></code>.</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>4. Дополнительные опции по завершении</legend>

            <div class="settings-column">
              <div class="setting-group">
                <label class="checkbox-container">
                  <input type="checkbox" id="timer-hide-self">
                  <span class="checkbox-option-label">Скрыть элемент таймера</span>
                </label>
                <div class="helper-text">Скрывает элемент, в котором отображаются цифры таймера, когда отсчет дойдет до нуля.</div>
              </div>

              <div class="setting-group">
                <label for="timer-completion-text">Текст по завершении (опционально)</label>
                <input type="text" id="timer-completion-text" class="text-input" placeholder="Например: Акция завершена!">
                <div class="helper-text">Этот текст будет показан в элементе таймера вместо "00:00:00".</div>
              </div>

              <div class="setting-group">
                <label for="timer-redirect-path">Перенаправить на путь (опционально)</label>
                <input type="text" id="timer-redirect-path" class="text-input" placeholder="Например: /sale-over или /catalog">
                <div class="helper-text">Укажите путь на вашем сайте (начинается с /), куда перенаправить пользователя после окончания таймера.</div>
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
    // Внутренние элементы (в Shadow DOM)
    this.elements.generateBtn = this.shadowRoot.getElementById("generate-btn");

    // Радио кнопки и условные группы
    this.elements.timerTypeRadios = this.shadowRoot.querySelectorAll(
      'input[name="timerType"]'
    );
    this.elements.fixedDateSettings = this.shadowRoot.getElementById(
      "fixed-date-settings"
    );
    this.elements.evergreenSettings =
      this.shadowRoot.getElementById("evergreen-settings");

    // Поля для фиксированной даты
    this.elements.endDateInput =
      this.shadowRoot.getElementById("timer-end-date");
    this.elements.endTimeInput =
      this.shadowRoot.getElementById("timer-end-time");
    this.elements.timezoneSelect =
      this.shadowRoot.getElementById("timer-timezone");

    // Поля для вечнозеленого таймера
    this.elements.durationDaysInput = this.shadowRoot.getElementById(
      "timer-duration-days"
    );
    this.elements.durationHoursInput = this.shadowRoot.getElementById(
      "timer-duration-hours"
    );
    this.elements.durationMinutesInput = this.shadowRoot.getElementById(
      "timer-duration-minutes"
    );
    this.elements.durationSecondsInput = this.shadowRoot.getElementById(
      "timer-duration-seconds"
    );

    // Поля для целей
    this.elements.displayClassInput = this.shadowRoot.getElementById(
      "timer-display-class"
    );
    this.elements.hideClassesInput =
      this.shadowRoot.getElementById("timer-hide-classes");
    this.elements.showClassesInput =
      this.shadowRoot.getElementById("timer-show-classes");
    this.elements.hideSelfCheckbox =
      this.shadowRoot.getElementById("timer-hide-self");
    this.elements.completionTextInput = this.shadowRoot.getElementById(
      "timer-completion-text"
    );
    this.elements.redirectPathInput = this.shadowRoot.getElementById(
      "timer-redirect-path"
    );

    // Внешние элементы модалки
    this.elements.successPopup = document.querySelector(".pop-up-success");
    this.elements.popupAcceptBtn = document.querySelector(
      "[data-popup-accept-btn]"
    );
    this.elements.popupCloseBtn = document.querySelector(
      "[data-popup-close-btn]"
    );
  }

  bindEvents() {
    // Обработчик для кнопки генерации
    if (this.elements.generateBtn) {
      const handler = () => this.generateAndCopyCode();
      this.eventHandlers.set("generate", handler);
      this.elements.generateBtn.addEventListener("click", handler);
    }

    // Обработчики для radio buttons
    this.elements.timerTypeRadios.forEach((radio) => {
      const handler = () => this.handleTimerTypeChange();
      this.eventHandlers.set(`timer-type-${radio.value}`, handler);
      radio.addEventListener("change", handler);
    });

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
    // Устанавливаем начальные значения
    this.elements.endTimeInput.value = this.configDefaults.endTime;
    this.elements.timezoneSelect.value = this.configDefaults.timezone;
    this.elements.durationDaysInput.value = this.configDefaults.durationDays;
    this.elements.durationHoursInput.value = this.configDefaults.durationHours;
    this.elements.durationMinutesInput.value =
      this.configDefaults.durationMinutes;
    this.elements.durationSecondsInput.value =
      this.configDefaults.durationSeconds;

    // Устанавливаем видимость групп настроек
    this.handleTimerTypeChange();
  }

  handleTimerTypeChange() {
    const selectedType =
      this.shadowRoot.querySelector('input[name="timerType"]:checked')?.value ||
      "fixed";

    if (this.elements.fixedDateSettings) {
      this.elements.fixedDateSettings.classList.toggle(
        "hidden",
        selectedType !== "fixed"
      );
    }
    if (this.elements.evergreenSettings) {
      this.elements.evergreenSettings.classList.toggle(
        "hidden",
        selectedType !== "evergreen"
      );
    }
  }

  collectData() {
    const timerType =
      this.shadowRoot.querySelector('input[name="timerType"]:checked')?.value ||
      "fixed";
    const displayClass = this.elements.displayClassInput?.value.trim() || "";
    const hideClassesRaw = this.elements.hideClassesInput?.value || "";
    const showClassesRaw = this.elements.showClassesInput?.value || "";
    const hideTimerOnEnd = this.elements.hideSelfCheckbox?.checked || false;
    const completionText =
      this.elements.completionTextInput?.value.trim() || "";
    const redirectPath = this.elements.redirectPathInput?.value.trim() || "";

    // Валидация обязательных полей
    if (!displayClass) {
      alert("Укажите CSS-класс элемента для отображения таймера.");
      return null;
    }

    // Проверка на недопустимые символы в классах
    const invalidCharRegex = /[.#\s\[\]>+~:()]/;
    if (invalidCharRegex.test(displayClass)) {
      alert(
        `Класс элемента таймера "${displayClass}" содержит недопустимые символы (пробелы, точки, # и т.д.).`
      );
      return null;
    }

    const hideClasses = this.parseCommaList(hideClassesRaw);
    if (hideClasses.some((cls) => invalidCharRegex.test(cls))) {
      alert(
        `Один или несколько классов для скрытия ("${hideClassesRaw}") содержат недопустимые символы.`
      );
      return null;
    }

    const showClasses = this.parseCommaList(showClassesRaw);
    if (showClasses.some((cls) => invalidCharRegex.test(cls))) {
      alert(
        `Один или несколько классов для показа ("${showClassesRaw}") содержат недопустимые символы.`
      );
      return null;
    }

    // Валидация пути редиректа
    if (redirectPath && !redirectPath.startsWith("/")) {
      alert(
        `Путь для перенаправления "${redirectPath}" должен начинаться с символа "/".`
      );
      return null;
    }

    const settings = {
      timerType: timerType,
      displayClass: displayClass,
      hideClasses: hideClasses,
      showClasses: showClasses,
      completionText: completionText,
      redirectPath: redirectPath,
      hideTimerOnEnd: hideTimerOnEnd,
      storageKey: this.configDefaults.storageKey + displayClass,
    };

    if (timerType === "fixed") {
      settings.endDate = this.elements.endDateInput?.value || "";
      settings.endTime = this.elements.endTimeInput?.value || "00:00:00";
      settings.timezone = this.elements.timezoneSelect?.value || "auto";

      if (!settings.endDate) {
        alert("Укажите Дату окончания для фиксированного таймера.");
        return null;
      }
    } else {
      settings.durationDays =
        parseInt(this.elements.durationDaysInput?.value, 10) || 0;
      settings.durationHours =
        parseInt(this.elements.durationHoursInput?.value, 10) || 0;
      settings.durationMinutes =
        parseInt(this.elements.durationMinutesInput?.value, 10) || 0;
      settings.durationSeconds =
        parseInt(this.elements.durationSecondsInput?.value, 10) || 0;

      if (
        settings.durationDays === 0 &&
        settings.durationHours === 0 &&
        settings.durationMinutes === 0 &&
        settings.durationSeconds === 0
      ) {
        alert("Укажите ненулевую длительность для вечнозеленого таймера.");
        return null;
      }

      if (
        settings.durationDays < 0 ||
        settings.durationHours < 0 ||
        settings.durationMinutes < 0 ||
        settings.durationSeconds < 0
      ) {
        alert("Длительность не может быть отрицательной.");
        return null;
      }
    }

    return settings;
  }

  async generateAndCopyCode() {
    const settings = this.collectData();
    if (settings === null) {
      console.warn(
        "CountdownTimerGenerator: Генерация кода прервана из-за ошибки валидации."
      );
      return;
    }

    const rawCode = this.generateCode(settings);
    const code = await this.minifyGeneratedCode(rawCode);
    this.copyAndNotify(code);
  }

  generateCode(settings) {
    const { showDisplayType, ...settingsForJson } = settings;
    const configJson = JSON.stringify(settingsForJson, null, 2);

    return `<script>
document.addEventListener('DOMContentLoaded', function() {
const config = ${configJson};
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

let timerDisplayElement = null;
let elementsToHide = [];
let intervalId = null;
let targetTimestamp = 0;

function formatTimeLeft(timeLeftMs) {
  if (timeLeftMs < 0) timeLeftMs = 0;
  const days = Math.floor(timeLeftMs / ONE_DAY);
  const hours = Math.floor((timeLeftMs % ONE_DAY) / ONE_HOUR);
  const minutes = Math.floor((timeLeftMs % ONE_HOUR) / ONE_MINUTE);
  const seconds = Math.floor((timeLeftMs % ONE_MINUTE) / ONE_SECOND);
  let output = "";
  if (days > 0) output += \`\${days.toString()}:\`;
  output += \`\${hours.toString().padStart(2, '0')}:\`;
  output += \`\${minutes.toString().padStart(2, '0')}:\`;
  output += \`\${seconds.toString().padStart(2, '0')}\`;
  return output;
}

function hideTargetElements() {
  elementsToHide.forEach(el => {
    if (el && el.style) {
      el.style.setProperty('display', 'none', 'important');
    }
  });
}

function showTargetElements() {
    if (!config.showClasses || config.showClasses.length === 0) return;

    const selector = config.showClasses.map(cls => '.' + cls.trim()).join(',');
    try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        elements.forEach(el => {
          config.showClasses.forEach(cls => {
             const className = cls.trim();
             if (el.classList.contains(className)) {
               el.classList.remove(className);
             }
          });
        });
    } catch (e) {}
}

function handleTimerCompletion() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (!timerDisplayElement) return;

    timerDisplayElement.textContent = config.completionText || formatTimeLeft(0);
    hideTargetElements();
    showTargetElements();

    if (config.hideTimerOnEnd && timerDisplayElement.style) {
        timerDisplayElement.style.setProperty('display', 'none', 'important');
    }

    if (config.redirectPath && config.redirectPath.startsWith('/')) {
        window.location.href = window.location.origin + config.redirectPath;
    }
}

function updateTimerDisplay() {
  if (!timerDisplayElement) {
      if(intervalId) clearInterval(intervalId);
      return;
  }
  const now = Date.now();
  const timeLeft = targetTimestamp - now;

  if (timeLeft <= 0) {
    handleTimerCompletion();
    return;
  }
  timerDisplayElement.textContent = formatTimeLeft(timeLeft);
}

function calculateFixedTargetTime() {
   if (!config.endDate || !config.endTime) return 0;
   
    const localEndTimeString = config.endDate + 'T' + config.endTime;
    const localEndDate = new Date(localEndTimeString);

    if (isNaN(localEndDate.getTime())) return 0;

    if (config.timezone === 'auto') {
      return localEndDate.getTime();
    } else {
      try {
        const targetOffsetMinutes = parseFloat(config.timezone) * 60;
        if (isNaN(targetOffsetMinutes)) return 0;
        
        const year = localEndDate.getFullYear();
        const month = localEndDate.getMonth();
        const day = localEndDate.getDate();
        const hours = localEndDate.getHours();
        const minutes = localEndDate.getMinutes();
        const seconds = localEndDate.getSeconds();
        const assumedUtcTime = Date.UTC(year, month, day, hours, minutes, seconds);
        return assumedUtcTime - (targetOffsetMinutes * 60000);
      } catch (e) {
        return localEndDate.getTime() - (localEndDate.getTimezoneOffset() * 60000);
      }
    }
}

function calculateOrGetEvergreenTargetTime() {
      const storageKey = config.storageKey || 'taptopTimerEnd_' + config.displayClass;
      const now = Date.now();
      let targetTime = 0;

      try {
         const storedEndTime = localStorage.getItem(storageKey);
         const storedEndTimeParsed = storedEndTime ? parseInt(storedEndTime, 10) : NaN;

         if (!isNaN(storedEndTimeParsed)) {
           targetTime = storedEndTimeParsed;
         } else {
           const durationMillis =
             (config.durationDays * ONE_DAY) +
             (config.durationHours * ONE_HOUR) +
             (config.durationMinutes * ONE_MINUTE) +
             (config.durationSeconds * ONE_SECOND);

           if (durationMillis <= 0) return 0;

           targetTime = now + durationMillis;
           try {
              localStorage.setItem(storageKey, targetTime.toString());
           } catch (e) {}
         }
      } catch (e) {
          const durationMillis =
             (config.durationDays * ONE_DAY) +
             (config.durationHours * ONE_HOUR) +
             (config.durationMinutes * ONE_MINUTE) +
             (config.durationSeconds * ONE_SECOND);
          if (durationMillis > 0) {
              targetTime = now + durationMillis;
          } else {
              return 0;
          }
      }
      return targetTime;
  }

function initializeTimer() {
  timerDisplayElement = document.querySelector('.' + config.displayClass);
  elementsToHide = config.hideClasses.length > 0
      ? document.querySelectorAll(config.hideClasses.map(cls => '.' + cls.trim()).join(','))
      : [];

  if (!timerDisplayElement) return;

  if (config.timerType === 'fixed') {
    targetTimestamp = calculateFixedTargetTime();
  } else {
    targetTimestamp = calculateOrGetEvergreenTargetTime();
  }

  if (targetTimestamp <= 0) {
    timerDisplayElement.textContent = formatTimeLeft(0);
    return;
  }

  const now = Date.now();
  if (targetTimestamp <= now) {
    handleTimerCompletion();
  } else {
    updateTimerDisplay();
    intervalId = setInterval(updateTimerDisplay, ONE_SECOND);
  }
}

initializeTimer();

});
</script>`;
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

  async copyAndNotify(code) {
    try {
      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (error) {
      console.error("Ошибка при копировании кода:", error);
      alert("Произошла ошибка при копировании кода. Попробуйте еще раз.");
    }
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
    textarea.select();
    document.body.removeChild(textarea);
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
    if (this.elements.generateBtn && this.eventHandlers.has("generate")) {
      this.elements.generateBtn.removeEventListener(
        "click",
        this.eventHandlers.get("generate")
      );
    }

    // Отвязываем обработчики radio buttons
    this.elements.timerTypeRadios?.forEach((radio) => {
      const key = `timer-type-${radio.value}`;
      if (this.eventHandlers.has(key)) {
        radio.removeEventListener("change", this.eventHandlers.get(key));
      }
    });

    this.unbindModalEvents();
    this.eventHandlers.clear();
  }

  unbindModalEvents() {
    if (
      this.elements.popupAcceptBtn &&
      this.eventHandlers.has("popup-accept")
    ) {
      this.elements.popupAcceptBtn.removeEventListener(
        "click",
        this.eventHandlers.get("popup-accept")
      );
    }

    if (this.elements.popupCloseBtn && this.eventHandlers.has("popup-close")) {
      this.elements.popupCloseBtn.removeEventListener(
        "click",
        this.eventHandlers.get("popup-close")
      );
    }

    if (this.elements.successPopup && this.eventHandlers.has("popup-overlay")) {
      this.elements.successPopup.removeEventListener(
        "click",
        this.eventHandlers.get("popup-overlay")
      );
    }
  }

  destroy() {
    this.unbindEvents();
    this.initialized = false;
  }
}

// Регистрируем веб-компонент
customElements.define("countdown-timer-generator", CountdownTimerGenerator);
