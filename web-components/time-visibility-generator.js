// Time Visibility Generator Web Component для Taptop
class TimeVisibilityGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;

    // Конфигурация по умолчанию с одним правилом
    this.config = {
      rules: [this._createDefaultRule()],
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

  // Константы из оригинального генератора
  get HIDING_CLASS() {
    return "js-time-hidden";
  }
  get WEEKDAYS_ORDER() {
    return [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
  }
  get DEFAULT_RULE_STATE() {
    return {
      blockClasses: "",
      startTime: "00:00:00",
      endTime: "23:59:59",
      timezone: "auto",
      weekdays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      hideAfterDate: false,
      hideDate: "",
      hideTime: "23:59:59",
    };
  }
  get STYLE_TAG_ID() {
    return "taptop-time-visibility-styles";
  }

  _createDefaultRule() {
    const defaultStateCopy = structuredClone(this.DEFAULT_RULE_STATE);
    return {
      id: this._generateRuleId(),
      ...defaultStateCopy,
    };
  }

  _generateRuleId() {
    return `rule_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;
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

      .time-visibility-generator {
        --primary-color: #4483f5;
        --primary-hover: #3a70d1;
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
        --radius-lg: 12px;
        --transition: all 0.2s ease;
        --error-color: #dc3545;

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
        max-height: calc(100vh - 65px - 76px - 55px - 97px - 55px);
        overflow: auto;
        min-height: 0;
      }

      .rule-card {
        background: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-color);
        margin-bottom: 15px;
        overflow: hidden;
        transition: var(--transition);
        animation: fadeIn 0.3s ease-out;
      }

      .rule-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #f8fafc;
        border-bottom: 1px solid var(--border-color);
      }

      .rule-title {
        font-weight: 600;
        color: var(--text-dark);
        display: flex;
        align-items: center;
      }

      .rule-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-gradient);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        margin-left: 8px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(68, 131, 245, 0.2);
      }

      .rule-body {
        padding: 20px;
      }

      fieldset {
        border: none;
        padding: 0;
        margin: 0;
      }

      .settings-section {
        margin-bottom: 20px;
      }

      .settings-section-title {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 15px;
        color: var(--text-dark);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
      }

      .settings-row {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .setting-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }

      .setting-group label {
        font-weight: 500;
        color: var(--text-dark);
        font-size: 14px;
      }

      .text-input, .select-styled {
        width: 100%;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        font-size: 14px;
        color: var(--text-dark);
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
        background: white;
      }

      .text-input:focus, .select-styled:focus {
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

      .weekday-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
        margin-bottom: 15px;
      }

      .weekday-item {
        flex: 0 0 auto;
      }

      .weekday-checkbox {
        opacity: 0;
        position: absolute;
      }

      .weekday-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        padding: 8px 12px;
        background: #f1f5f9;
        border-radius: 20px;
        transition: var(--transition);
      }

      .weekday-label:hover {
        background: #e2e8f0;
      }

      .weekday-checkbox:checked + .weekday-label {
        background: var(--primary-color);
        color: white;
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

      .hide-date-section {
            background-color: hsla(0, 0%, 100%, .7);
          border-radius: var(--radius-sm);
          margin-top: 15px;
      }

      .hide-date-row {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .hide-date-field {
        width: 100%;
        display: flex;
        gap: 8px;
        flex-direction: column;
      }

      .hide-date-field label {
        font-size: 14px;
      }

      .add-rule-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 15px;
        background-color: rgba(68, 131, 245, 0.08);
        border: 2px dashed rgba(68, 131, 245, 0.3);
        border-radius: var(--radius-md);
        color: var(--primary-color);
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
        margin-bottom: 20px;
        font-size: 15px;
      }

      .add-rule-button:hover {
        background-color: rgba(68, 131, 245, 0.12);
        border-color: rgba(68, 131, 245, 0.5);
        transform: translateY(-2px);
      }

      .add-rule-button svg {
        margin-right: 8px;
      }

      .remove-rule-button {
        background: rgba(0, 0, 0, 0.05);
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        color: var(--text-light);
      }

      .remove-rule-button:hover {
        background-color: var(--error-color);
        color: white;
        transform: scale(1.1);
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

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
  }

  getTemplate() {
    return `
      <form class="time-visibility-generator">
        <div class="form-grid">
          <div id="rules-container">
            <!-- Правила будут добавляться динамически -->
          </div>
          
          <button type="button" id="add-rule-button" class="add-rule-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Добавить новое правило
          </button>
        </div>

        <div class="action-section">
          <button type="button" class="generate-button" id="generate-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Сгенерировать код</span>
          </button>
        </div>
      </form>
    `;
  }

  getRuleTemplate() {
    return `
      <div class="rule-card" data-rule-id="">
        <div class="rule-header">
          <div class="rule-title">Правило <span class="rule-badge rule-number">1</span></div>
          <button type="button" class="remove-rule-button" aria-label="Удалить правило">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="rule-body">
          <div class="settings-section">
            <div class="settings-section-title">Настройка блоков</div>
            <div class="settings-row">
              <div class="setting-group">
                <label for="block-classes-template">CSS классы блоков:</label>
                <input type="text" class="text-input block-classes" placeholder="promo-banner, sale-popup">
                <div class="helper-text">Укажите классы блоков через запятую (без точки)</div>
              </div>
            </div>
          </div>
          
          <div class="settings-section">
            <div class="settings-section-title">Время показа</div>
            <div class="settings-row">
              <div class="setting-group">
                <label>Время начала показа:</label>
                <input type="time" step="1" class="text-input start-time" value="00:00:00">
              </div>
              <div class="setting-group">
                <label>Время окончания показа:</label>
                <input type="time" step="1" class="text-input end-time" value="23:59:59">
              </div>
              <div class="setting-group">
                <label>Часовой пояс:</label>
                <select class="select-styled timezone-select">
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
                    <option value="-12">UTC-12 (Линия перемены даты)</option>
                    <option value="-11">UTC-11 (о. Мидуэй)</option>
                    <option value="-10">UTC-10 (Гавайи)</option>
                    <option value="-9">UTC-9 (Аляска)</option>
                    <option value="-8">UTC-8 (Тихоокеанское время)</option>
                    <option value="-7">UTC-7 (Горное время)</option>
                    <option value="-6">UTC-6 (Центральное время)</option>
                    <option value="-5">UTC-5 (Восточное время)</option>
                    <option value="-4">UTC-4 (Атлантическое время)</option>
                    <option value="-3">UTC-3 (Буэнос-Айрес)</option>
                    <option value="-2">UTC-2 (Среднеатлантическое время)</option>
                    <option value="-1">UTC-1 (Азорские о-ва)</option>
                  </optgroup>
                  <optgroup label="Центральный регион">
                    <option value="0">UTC+0 (Лондон)</option>
                    <option value="1">UTC+1 (Берлин, Париж)</option>
                  </optgroup>
                  <optgroup label="Азия и Океания">
                    <option value="4">UTC+4 (Дубай)</option>
                    <option value="5.5">UTC+5:30 (Индия)</option>
                    <option value="8">UTC+8 (Китай, Сингапур)</option>
                    <option value="9">UTC+9 (Япония, Корея)</option>
                    <option value="9.5">UTC+9:30 (Центр. Австралия)</option>
                    <option value="10">UTC+10 (Вост. Австралия)</option>
                    <option value="12">UTC+12 (Новая Зеландия)</option>
                    <option value="13">UTC+13 (Самоа)</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
          
          <div class="settings-section">
            <div class="settings-section-title">Дни недели</div>
            <div class="weekday-container">
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox monday-checkbox">
                <label class="weekday-label">Пн</label>
              </div>
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox tuesday-checkbox">
                <label class="weekday-label">Вт</label>
              </div>
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox wednesday-checkbox">
                <label class="weekday-label">Ср</label>
              </div>
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox thursday-checkbox">
                <label class="weekday-label">Чт</label>
              </div>
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox friday-checkbox">
                <label class="weekday-label">Пт</label>
              </div>
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox saturday-checkbox">
                <label class="weekday-label">Сб</label>
              </div>
              <div class="weekday-item">
                <input type="checkbox" class="weekday-checkbox sunday-checkbox">
                <label class="weekday-label">Вс</label>
              </div>
            </div>
            <div class="helper-text">Если не выбран ни один день, блок будет показываться ежедневно</div>
          </div>
          
          <div class="settings-row" style="margin-top: 20px;">
            <div class="setting-group">
              <label class="checkbox-container">
                <input type="checkbox" class="hide-after-date hide-after-date-toggle">
                <span class="checkbox-option-label">Скрыть блок после определенной даты и времени <strong>(навсегда)</strong></span>
              </label>
            </div>
          </div>
          
          <div class="hide-date-section" style="display: none;">
            <div class="hide-date-row">
              <div class="hide-date-field">
                <label>Дата скрытия:</label>
                <input type="date" class="text-input hide-date">
                <div class="helper-text">После наступления указанной даты и времени блок будет скрыт навсегда.</div>
              </div>
              <div class="hide-date-field">
                <label>Время скрытия:</label>
                <input type="time" step="1" class="text-input hide-time" value="23:59:59">
                <div class="helper-text">Точное время скрытия блока</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  findElements() {
    this.elements.rulesContainer =
      this.shadowRoot.getElementById("rules-container");
    this.elements.addRuleButton =
      this.shadowRoot.getElementById("add-rule-button");
    this.elements.generateButton =
      this.shadowRoot.getElementById("generate-btn");

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
    // Основные обработчики
    if (this.elements.addRuleButton) {
      const handler = () => this.addNewRule();
      this.eventHandlers.set("add-rule", handler);
      this.elements.addRuleButton.addEventListener("click", handler);
    }

    if (this.elements.generateButton) {
      const handler = () => this.generateAndCopyCode();
      this.eventHandlers.set("generate", handler);
      this.elements.generateButton.addEventListener("click", handler);
    }

    // Делегирование событий для правил
    if (this.elements.rulesContainer) {
      const inputHandler = (e) => this._handleRuleChange(e);
      const changeHandler = (e) => this._handleRuleChange(e);
      const clickHandler = (e) => this._handleRuleRemoveClick(e);

      this.eventHandlers.set("rules-input", inputHandler);
      this.eventHandlers.set("rules-change", changeHandler);
      this.eventHandlers.set("rules-click", clickHandler);

      this.elements.rulesContainer.addEventListener("input", inputHandler);
      this.elements.rulesContainer.addEventListener("change", changeHandler);
      this.elements.rulesContainer.addEventListener("click", clickHandler);
    }

    this.bindModalEvents();
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

  unbindEvents() {
    // Отвязка основных обработчиков
    if (this.elements.addRuleButton && this.eventHandlers.has("add-rule")) {
      this.elements.addRuleButton.removeEventListener(
        "click",
        this.eventHandlers.get("add-rule")
      );
    }

    if (this.elements.generateButton && this.eventHandlers.has("generate")) {
      this.elements.generateButton.removeEventListener(
        "click",
        this.eventHandlers.get("generate")
      );
    }

    // Отвязка делегированных обработчиков
    if (this.elements.rulesContainer) {
      if (this.eventHandlers.has("rules-input")) {
        this.elements.rulesContainer.removeEventListener(
          "input",
          this.eventHandlers.get("rules-input")
        );
      }
      if (this.eventHandlers.has("rules-change")) {
        this.elements.rulesContainer.removeEventListener(
          "change",
          this.eventHandlers.get("rules-change")
        );
      }
      if (this.eventHandlers.has("rules-click")) {
        this.elements.rulesContainer.removeEventListener(
          "click",
          this.eventHandlers.get("rules-click")
        );
      }
    }

    // Отвязка модальных обработчиков
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

    this.eventHandlers.clear();
  }

  setInitialState() {
    this.renderRules();
  }

  _handleRuleRemoveClick(event) {
    const removeButton = event.target.closest(".remove-rule-button");
    if (!removeButton) return;

    const ruleCard = removeButton.closest(".rule-card[data-rule-id]");
    const ruleId = ruleCard?.dataset.ruleId;

    if (ruleId) {
      event.preventDefault();
      this.removeRule(ruleId);
    }
  }

  _handleRuleChange(event) {
    const target = event.target;
    const ruleCard = target.closest(".rule-card[data-rule-id]");
    const ruleId = ruleCard?.dataset.ruleId;
    if (!ruleId) return;

    const rule = this.config.rules.find((r) => r.id === ruleId);
    if (!rule) return;

    const name = target.name || target.dataset.name;
    if (!name) return;

    const value = target.type === "checkbox" ? target.checked : target.value;

    switch (name) {
      case "block-classes":
        rule.blockClasses = value;
        break;
      case "start-time":
        rule.startTime = value;
        break;
      case "end-time":
        rule.endTime = value;
        break;
      case "timezone":
        rule.timezone = value;
        break;
      case "hide-after-date-toggle":
        rule.hideAfterDate = value;
        this._toggleHideDateSection(ruleCard, value);
        break;
      case "hide-date":
        rule.hideDate = value;
        break;
      case "hide-time":
        rule.hideTime = value;
        break;
      default:
        const weekdayMatch = name.match(
          /^weekday-(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/
        );
        if (weekdayMatch) {
          const dayName = weekdayMatch[1];
          if (rule.weekdays.hasOwnProperty(dayName)) {
            rule.weekdays[dayName] = value;
          }
        }
    }
  }

  _toggleHideDateSection(ruleCardElement, show) {
    const section = ruleCardElement.querySelector(".hide-date-section");
    if (section) {
      section.style.display = show ? "" : "none";
    }
  }

  addNewRule() {
    const newRule = this._createDefaultRule();
    this.config.rules.push(newRule);
    this.renderRule(newRule);
    this._updateRemoveButtonsVisibility();

    const newRuleElement = this.shadowRoot.getElementById(`rule-${newRule.id}`);
    if (newRuleElement) {
      requestAnimationFrame(() => {
        newRuleElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  removeRule(ruleId) {
    this.config.rules = this.config.rules.filter((rule) => rule.id !== ruleId);

    const ruleElement = this.shadowRoot.getElementById(`rule-${ruleId}`);
    if (ruleElement) ruleElement.remove();

    if (this.config.rules.length === 0) {
      this.addNewRule();
    } else {
      this._updateRuleNumbers();
      this._updateRemoveButtonsVisibility();
    }
  }

  _updateRuleNumbers() {
    const ruleCards = this.elements.rulesContainer.querySelectorAll(
      ".rule-card[data-rule-id]"
    );
    ruleCards.forEach((card, index) => {
      const numberElement = card.querySelector(".rule-number");
      if (numberElement) numberElement.textContent = index + 1;
    });
  }

  _updateRemoveButtonsVisibility() {
    const ruleCards = this.elements.rulesContainer.querySelectorAll(
      ".rule-card[data-rule-id]"
    );
    const showRemoveButton = ruleCards.length > 1;
    ruleCards.forEach((card) => {
      const removeButton = card.querySelector(".remove-rule-button");
      if (removeButton) {
        removeButton.style.display = showRemoveButton ? "" : "none";
      }
    });
  }

  renderRules() {
    if (!this.elements.rulesContainer) return;

    this.elements.rulesContainer.innerHTML = "";
    this.config.rules.forEach((rule) => this.renderRule(rule));
    this._updateRemoveButtonsVisibility();
  }

  renderRule(rule) {
    if (!this.elements.rulesContainer) return;

    const ruleTemplate = this.getRuleTemplate();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = ruleTemplate;
    const ruleCard = tempDiv.querySelector(".rule-card");
    if (!ruleCard) return;

    ruleCard.id = `rule-${rule.id}`;
    ruleCard.dataset.ruleId = rule.id;

    // Находим и настраиваем элементы
    const ruleNumber = ruleCard.querySelector(".rule-number");
    const blockClassesInput = ruleCard.querySelector(".block-classes");
    const startTimeInput = ruleCard.querySelector(".start-time");
    const endTimeInput = ruleCard.querySelector(".end-time");
    const timezoneSelect = ruleCard.querySelector(".timezone-select");
    const weekdayContainer = ruleCard.querySelector(".weekday-container");
    const hideAfterDateCheckbox = ruleCard.querySelector(
      ".hide-after-date-toggle"
    );
    const hideDateInput = ruleCard.querySelector(".hide-date");
    const hideTimeInput = ruleCard.querySelector(".hide-time");

    // Заполняем элементы данными
    if (ruleNumber) {
      ruleNumber.textContent = this.config.rules.indexOf(rule) + 1;
    }
    if (blockClassesInput) {
      blockClassesInput.value = rule.blockClasses;
      blockClassesInput.name = "block-classes";
    }
    if (startTimeInput) {
      startTimeInput.value = rule.startTime;
      startTimeInput.name = "start-time";
    }
    if (endTimeInput) {
      endTimeInput.value = rule.endTime;
      endTimeInput.name = "end-time";
    }
    if (timezoneSelect) {
      timezoneSelect.value = rule.timezone;
      timezoneSelect.name = "timezone";
    }

    // Настраиваем дни недели
    if (weekdayContainer) {
      this.WEEKDAYS_ORDER.forEach((day) => {
        const checkbox = weekdayContainer.querySelector(`.${day}-checkbox`);
        if (checkbox) {
          const uniqueId = `${day}-${rule.id}`;
          checkbox.id = uniqueId;
          checkbox.checked = !!rule.weekdays[day];
          checkbox.name = `weekday-${day}`;

          const label = checkbox.nextElementSibling;
          if (label) {
            label.setAttribute("for", uniqueId);
          }
        }
      });
    }

    // Настраиваем скрытие по дате
    if (hideAfterDateCheckbox) {
      hideAfterDateCheckbox.checked = rule.hideAfterDate;
      hideAfterDateCheckbox.name = "hide-after-date-toggle";
    }
    this._toggleHideDateSection(ruleCard, rule.hideAfterDate);

    if (hideDateInput) {
      hideDateInput.value = rule.hideDate;
      hideDateInput.name = "hide-date";
    }
    if (hideTimeInput) {
      hideTimeInput.value = rule.hideTime || "23:59:59";
      hideTimeInput.name = "hide-time";
    }

    this.elements.rulesContainer.appendChild(ruleCard);
  }

  collectData() {
    return {
      rules: structuredClone(this.config.rules),
    };
  }

  generateCode(settings = {}) {
    if (!settings.rules || settings.rules.length === 0) {
      return "<!-- Time Visibility: Правила не настроены. -->";
    }

    // Подготовка правил (идентично оригиналу)
    const processedRules = settings.rules
      .map((rule) => {
        const blockClasses =
          rule.blockClasses
            ?.split(",")
            .map((cls) => cls.trim())
            .filter(Boolean) ?? [];
        if (blockClasses.length === 0) return null;

        const activeWeekdays = this.WEEKDAYS_ORDER.reduce(
          (acc, dayName, index) => {
            if (rule.weekdays[dayName]) acc.push(index);
            return acc;
          },
          []
        );
        const weekdaysArray =
          activeWeekdays.length > 0 ? activeWeekdays : [0, 1, 2, 3, 4, 5, 6];

        let validHideDate = null;
        if (
          rule.hideAfterDate &&
          rule.hideDate &&
          /^\d{4}-\d{2}-\d{2}$/.test(rule.hideDate)
        ) {
          validHideDate = rule.hideDate;
        } else if (rule.hideAfterDate && rule.hideDate) {
          console.warn(
            `[Time Visibility] Неверный формат даты скрытия "${
              rule.hideDate
            }" для правила с классами "${blockClasses.join(
              ", "
            )}". Скрытие по дате игнорируется.`
          );
        }

        return {
          blockClasses,
          startTime: rule.startTime || "00:00:00",
          endTime: rule.endTime || "23:59:59",
          timezone: rule.timezone || "auto",
          weekdays: weekdaysArray,
          hideAfterDate: !!rule.hideAfterDate,
          hideDate: validHideDate,
          hideTime: rule.hideTime || "23:59:59",
        };
      })
      .filter(Boolean);

    if (processedRules.length === 0) {
      return `<!-- Time Visibility: Не найдено валидных правил (проверьте CSS классы блоков). -->`;
    }

    // Подготовка данных для вставки в скрипт
    const rulesJson = JSON.stringify(processedRules, null, 2);
    const hidingClassName = this.HIDING_CLASS;
    const styleTagId = this.STYLE_TAG_ID;

    // Генерируем итоговый скрипт (идентично оригиналу)
    return `<!-- Taptop Extension: Time Visibility -->
<script>
document.addEventListener('DOMContentLoaded', function() {

  // Функция для автоматического добавления CSS правила в <head>
  (function() {
    if (document.getElementById('${styleTagId}')) return; // Не добавлять, если уже есть
    const cssRule = \`.${hidingClassName} { display: none !important; }\`;
    const styleElement = document.createElement('style');
    styleElement.id = '${styleTagId}';
    styleElement.textContent = cssRule;
    try {
      document.head.appendChild(styleElement);
    } catch (e) { // Fallback для старых браузеров или edge cases
      console.error('[TimeVisibility] Не удалось добавить стили в <head>, пробую в <body>', e);
      try { document.body.appendChild(styleElement); } catch (e2) {
        console.error('[TimeVisibility] Не удалось добавить стили и в <body>', e2);
      }
    }
  })();

  // Контроллер видимости блоков
  const timeVisibilityController = {
    rules: ${rulesJson},
    hidingClass: '${hidingClassName}',
    timeoutId: null,

    /** Получает текущее время в нужном часовом поясе */
    getCurrentTimeInZone: function(tzSetting) {
        const now = new Date();
        let targetOffsetHours = -now.getTimezoneOffset() / 60;
        if (tzSetting !== 'auto') {
            const specifiedOffset = parseFloat(tzSetting);
            if (!isNaN(specifiedOffset)) targetOffsetHours = specifiedOffset;
        }
        const utcMillis = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utcMillis + (targetOffsetHours * 3600000));
    },

    /** Проверяет, должен ли блок быть видимым по правилу */
    checkRuleVisibility: function(rule, currentTime) {
        try {
            // 1. Проверка скрытия по дате
            if (rule.hideAfterDate && rule.hideDate) {
                const [hYear, hMonth, hDay] = rule.hideDate.split('-').map(Number);
                const [hHour, hMin, hSec] = rule.hideTime.split(':').map(Number);
                const hideTargetUTC = Date.UTC(hYear, hMonth - 1, hDay, hHour, hMin, hSec);
                // Сравниваем с текущим временем в UTC
                const currentUTC = currentTime.getTime() - (currentTime.getTimezoneOffset() * 60000);
                if (currentUTC >= hideTargetUTC) return false; // Скрыть навсегда
            }

            // 2. Проверка дня недели
            const currentDayOfWeek = currentTime.getDay(); // 0=Вс, 1=Пн..
            if (!rule.weekdays.includes(currentDayOfWeek)) return false;

            // 3. Проверка времени
            const [startH, startM, startS] = rule.startTime.split(':').map(Number);
            const [endH, endM, endS] = rule.endTime.split(':').map(Number);
            const startMillis = (startH * 3600 + startM * 60 + startS) * 1000;
            const endMillis = (endH * 3600 + endM * 60 + endS) * 1000;
            const currentMillis = (currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds()) * 1000;

            // Проверка интервала (включая пересечение полуночи)
            if (startMillis <= endMillis) { // Обычный интервал (09:00-18:00)
                return currentMillis >= startMillis && currentMillis <= endMillis;
            } else { // Интервал через полночь (22:00-06:00)
                return currentMillis >= startMillis || currentMillis <= endMillis;
            }
        } catch (e) {
            console.error('[TimeVisibility] Ошибка при проверке правила:', rule, e);
            return false; // Скрываем в случае ошибки
        }
    },

    /** Применяет правила ко всем блокам и планирует следующую проверку */
    applyAllRulesAndScheduleNextCheck: function() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = null;
        let nextCheckDelay = Infinity;

        this.rules.forEach(rule => {
            const selectors = rule.blockClasses.map(cls => \`.\${cls}\`).join(', ');
            if (!selectors) return;
            const blocks = document.querySelectorAll(selectors);
            if (blocks.length === 0) return;

            const currentTime = this.getCurrentTimeInZone(rule.timezone);
            const shouldShow = this.checkRuleVisibility(rule, currentTime);

            // Управляем классом видимости
            blocks.forEach(block => {
                block.classList.toggle(this.hidingClass, !shouldShow);
            });

            // Рассчитываем задержку до следующей проверки для этого правила
            const ruleDelay = this.calculateNextCheckDelayForRule(rule, currentTime);
            nextCheckDelay = Math.min(nextCheckDelay, ruleDelay);
        });

        // Устанавливаем таймер для следующей проверки
        if (nextCheckDelay === Infinity || nextCheckDelay <= 0) nextCheckDelay = 60000; // Fallback
        const maxDelay = 86400000; // Не ждем дольше суток
        const finalDelay = Math.min(nextCheckDelay, maxDelay);

        this.timeoutId = setTimeout(() => {
            this.applyAllRulesAndScheduleNextCheck();
        }, finalDelay);
    },

    /** Рассчитывает задержку до следующего важного события для правила */
    calculateNextCheckDelayForRule: function(rule, currentTime) {
         let minDelay = Infinity;
         const nowMillis = currentTime.getTime();
         try {
            const momentsToCheck = []; // Массив временных меток (мс) для проверки

            // Время начала сегодня/завтра
            const [startH, startM, startS] = rule.startTime.split(':').map(Number);
            const startTimeToday = new Date(currentTime); startTimeToday.setHours(startH, startM, startS, 0);
            momentsToCheck.push(startTimeToday.getTime()); momentsToCheck.push(startTimeToday.getTime() + 86400000);

            // Время окончания сегодня/завтра
            const [endH, endM, endS] = rule.endTime.split(':').map(Number);
            const endTimeToday = new Date(currentTime); endTimeToday.setHours(endH, endM, endS, 999);
            momentsToCheck.push(endTimeToday.getTime()); momentsToCheck.push(endTimeToday.getTime() + 86400000);

            // Время скрытия по дате (если актуально)
            if (rule.hideAfterDate && rule.hideDate) {
                 const [hYear, hMonth, hDay] = rule.hideDate.split('-').map(Number);
                 const [hHour, hMin, hSec] = rule.hideTime.split(':').map(Number);
                 const hideTargetUTC = Date.UTC(hYear, hMonth - 1, hDay, hHour, hMin, hSec);
                 const currentUTC = currentTime.getTime() - (currentTime.getTimezoneOffset() * 60000);
                 if (hideTargetUTC > currentUTC) { // Если дата еще не наступила
                    // Приближенный расчет локального времени скрытия
                    const targetOffsetHours = (rule.timezone === 'auto') ? - (new Date()).getTimezoneOffset() / 60 : parseFloat(rule.timezone);
                    const hideTargetLocalMillis = hideTargetUTC + (targetOffsetHours * 3600000);
                    if (hideTargetLocalMillis > nowMillis) { // Убедимся, что оно в будущем
                       momentsToCheck.push(hideTargetLocalMillis);
                    }
                 }
            }

            // Следующая полночь
            const nextMidnight = new Date(currentTime); nextMidnight.setHours(24, 0, 0, 0);
            momentsToCheck.push(nextMidnight.getTime());

            // Находим минимальную задержку до будущего момента
            momentsToCheck.forEach(momentMillis => {
                if (momentMillis > nowMillis) minDelay = Math.min(minDelay, momentMillis - nowMillis);
            });

        } catch(e) {
            console.error("[TimeVisibility] Ошибка при расчете задержки:", rule, e);
            return 60000; // Fallback 1 минута
        }
        // Возвращаем задержку > 1 сек
        return Math.max(1000, (minDelay === Infinity ? 60000 : minDelay) + 100); // +100ms буфер
     },

    /** Инициализация контроллера */
    init: function() {
      if (!this.rules || this.rules.length === 0) return; // Нет правил - нет работы
      this.applyAllRulesAndScheduleNextCheck(); // Запуск цикла
    }
  };

  // Запускаем контроллер
  timeVisibilityController.init();
});
</script>
<!-- End Taptop Extension: Time Visibility -->`;
  }

  async generateAndCopyCode() {
    try {
      const settings = this.collectData();
      if (!settings) return;

      const rawCode = this.generateCode(settings);
      const code = await this.minifyGeneratedCode(rawCode);

      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (error) {
      console.error("Ошибка генерации кода:", error);
    }
  }

  // Минификация генерируемого кода
  async minifyGeneratedCode(code) {
    try {
      const parts = this.parseGeneratedCode(code);
      const minifiedCSS = parts.css ? this.minifyCSS(parts.css) : "";
      const minifiedJS = parts.js ? this.minifyJS(parts.js) : "";
      const minifiedHTML = parts.html ? this.minifyHTML(parts.html) : "";

      let result = "";
      if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
      if (minifiedJS) result += `<script>${minifiedJS}</script>`;
      if (minifiedHTML) result += minifiedHTML;

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

  destroy() {
    this.unbindEvents();
    this.initialized = false;
    console.log("TimeVisibilityGenerator: Генератор уничтожен");
  }
}

customElements.define("time-visibility-generator", TimeVisibilityGenerator);
