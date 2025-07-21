// Collection Filter Generator Web Component для Taptop
class CollectionFilterGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;

    // Конфигурация правил фильтрации
    this.filterRules = [];
    this.sortRules = [];
    this.ruleIdCounter = 1;
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

      .collection-filter-generator {
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
        --error-color: #dc3545;

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
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
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
        line-height: 1.4;
        margin: 0;
      }

      .rules-container {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 15px;
        box-shadow: var(--shadow-sm);
      }

      .rules-header {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 15px;
      }


      .add-rule-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 15px;
        background-color: rgba(68, 131, 245, 0.08);
        border: 2px dashed rgba(68, 131, 245, 0.3);
        border-radius: var(--radius-md);
        color: var(--primary-color);
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
        font-size: 15px;
      }

      .add-rule-btn:hover {
        background-color: rgba(68, 131, 245, 0.12);
        border-color: rgba(68, 131, 245, 0.5);
        transform: translateY(-2px);
      }

      .add-rule-btn:active {
        transform: translateY(0);
      }

      .rules-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .rule-card {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 15px;
      }

      
      .rules-list > :last-child {
        margin-bottom: 15px;
      }

      .settings-column {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
      }

      .rule-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
      }

      .rule-number {
        font-weight: 600;
        color: var(--primary-color);
        font-size: 14px;
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
        background-color: #dc3545;
        color: white;
        transform: scale(1.1);
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

      .rule-title {
        font-weight: 600;
        color: var(--text-dark);
        display: flex;
        align-items: center;
      }

      .rule-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .rule-row {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .conditional-field {
        transition: var(--transition);
      }

      .conditional-field.hidden, .hidden {
        display: none !important;
      }

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0 0 0;
        cursor: pointer;
      }

      .checkbox-container input[type="checkbox"] {
        margin: 0;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        cursor: pointer;
      }

      .checkbox-container label {
        font-size: 14px;
        color: var(--text-dark);
        line-height: 1.4;
        cursor: pointer;
        margin: 0;
      }

      .action-section {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }

      .generate-button {
        display: flex;
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

      /* Табы */
      .tabs-container {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        gap: 24px;
        padding: 14px 16px;
        margin-bottom: 20px;
      }

      .tab {
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.28px;
        line-height: 1.2;
        padding: 0;
        position: relative;
        text-align: center;
        transition: color 0.2s ease;
      }

      .tab.active {
        color: #000;
      }

      .tab.active::after {
        background: var(--primary-color);
        border-radius: 1px;
        bottom: -14px;
        content: '';
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
      }

      .tab:hover:not(.active) {
        color: #333;
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      /* Стили для радио-кнопок */
      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }



      .radio-container {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-size: 14px;
        color: var(--text-dark);
      }

      .radio-container input[type="radio"] {
        width: 18px;
        height: 18px;
        margin: 0;
        cursor: pointer;
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
        height: 20px;
        width: 20px;
        margin: 0;
        left: 0;
        top: 0;
      }

      .radio-checkmark {
        position: absolute;
        left: 0;
        top: 0;
        height: 20px;
        width: 20px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 50%;
        transition: all 0.2s ease;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        pointer-events: none;
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

      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        cursor: pointer;
        position: relative;
        user-select: none;
      }

      .checkbox-container input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }

      .checkmark {
        position: relative;
        height: 18px;
        width: 18px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        transition: all 0.2s ease;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      .checkbox-container:hover input[type="checkbox"] ~ .checkmark {
        background-color: #e0e0e0;
        border-color: #bbb;
      }

      .checkbox-container input[type="checkbox"]:checked ~ .checkmark {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        box-shadow: none;
      }

      .checkmark:after {
        content: "";
        position: absolute;
        display: none;
      }

      .checkbox-container input[type="checkbox"]:checked ~ .checkmark:after {
        display: block;
      }

      .checkbox-container .checkmark:after {
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      .checkbox-option-label {
        font-size: 14px;
        color: var(--text-dark);
        line-height: 1.4;
        cursor: pointer;
      }

      .required-indicator {
        color: #e74c3c;
      }

      .code-highlight {
        background: rgba(68, 131, 245, 0.1);
        color: #2c5282;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;
        font-weight: 500;
        border: 1px solid rgba(68, 131, 245, 0.2);
        margin: 0px 3px;
      }
    `;
  }

  getTemplate() {
    return `
      <div class="collection-filter-generator">
        <!-- Табы навигации -->
        <div class="tabs-container">
          <button type="button" class="tab active" data-tab="basic">
            Основные настройки
          </button>
          <button type="button" class="tab" data-tab="filtering">
            Фильтрация
          </button>
          <button type="button" class="tab" data-tab="sorting">
            Сортировка
          </button>
          <button type="button" class="tab" data-tab="pagination">
            Пагинация
          </button>
        </div>

        <form class="form-grid">
            <!-- Основные настройки -->
            <div class="tab-content active" id="basicTab">
                <div class="settings-column">
                    <div class="setting-group">
                        <label for="collectionId">ID Коллекции <span class="required-indicator">*</span></label>
                        <input type="number" id="collectionId" class="text-input" placeholder="Например: 123456" required>
                        <div class="helper-text">Как узнать? см. инструкцию</div>
                    </div>

                    <div class="setting-group">
                        <label for="widgetClass">Класс виджета Коллекции <span class="required-indicator">*</span></label>
                        <input type="text" id="widgetClass" class="text-input" placeholder="collection" required>
                        <div class="helper-text">Укажите класс (источник стилей) основного блока вашего виджета "Collection" Taptop. Если на странице только один виджет, можно оставить collection.</div>
                    </div>

                    <div class="setting-group">
                        <label for="applyBtnClass">Класс кнопки "Применить"</label>
                        <input type="text" id="applyBtnClass" class="text-input" placeholder="apply-filters">
                        <div class="helper-text">Укажите класс (источник стилей) кнопки для применения всех фильтров сразу. Оставьте пустым, если фильтрация мгновенная.</div>
                    </div>

                    <div class="setting-group">
                        <label for="resetBtnClass">Класс кнопки "Сбросить всё"</label>
                        <input type="text" id="resetBtnClass" class="text-input" placeholder="reset-filters">
                        <div class="helper-text">Укажите класс (источник стилей) кнопки для сброса всех фильтров.</div>
                    </div>
                </div>
            </div>

            <!-- Правила фильтрации -->
            <div class="tab-content" id="filteringTab">
                <div class="settings-column">
                    <div class="rules-container">
                        <div class="rules-list" id="filterRulesList">
                          <!-- Динамические правила фильтрации -->
                        </div>
                        <button type="button" class="add-rule-btn" id="addFilterRule">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          Добавить поле фильтрации
                        </button>
                    </div>
                </div>
            </div>

            <!-- Правила сортировки -->
            <div class="tab-content" id="sortingTab">
                <div class="settings-column">  
                    <div class="setting-group">
                      <label for="commonSortSelector">Класс (источник стилей) общего элемента <span class="code-highlight">&lt;select&gt;</span> для сортировки:</label>
                      <input type="text" id="commonSortSelector" class="text-input" placeholder="Например: product-sorter">
                      <div class="helper-text">Если все опции сортировки находятся в одном выпадающем списке, укажите его Класс (источник стилей) здесь.</div>
                    </div>

                    <div class="setting-group">
                      <label style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Применять сортировку:</label>
                      <div class="radio-group">
                        <label class="radio-container">
                          <input type="radio" name="apply-sort-timing" value="instant" checked>
                          <span class="radio-checkmark"></span>
                          Мгновенно при выборе
                        </label>
                        <label class="radio-container">
                          <input type="radio" name="apply-sort-timing" value="button">
                          <span class="radio-checkmark"></span>
                          По кнопке "Применить фильтры" (если она настроена для фильтров)
                        </label>
                      </div>
                    </div>

                    <div class="setting-group">
                      <label for="defaultSortLabel">Текст опции "Без сортировки" (если есть в <span class="code-highlight">&lt;select&gt;</span>):</label>
                      <input type="text" id="defaultSortLabel" class="text-input" placeholder="Например: По умолчанию">
                      <div class="helper-text">Если в вашем <span class="code-highlight">&lt;select&gt;</span> есть опция сброса сортировки, укажите ее точный текст здесь.</div>
                    </div>

                    <div class="rules-container">
                        <div class="rules-list" id="sortRulesList">
                          <!-- Динамические правила сортировки -->
                        </div>
                        <button type="button" class="add-rule-btn" id="addSortRule">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          Добавить поле сортировки
                        </button>
                    </div>
                </div>
            </div>

            <!-- Настройки пагинации -->
            <div class="tab-content" id="paginationTab">
                <div class="settings-column">
                        <div class="setting-group">
                            <label for="paginationType">Тип Пагинации:</label>
                            <select id="paginationType" class="select-styled">
                                <option value="none">Без пагинации</option>
                                <option value="prev_next">Кнопки Вперед/Назад</option>
                                <option value="load_more">Кнопка "Загрузить еще"</option>
                                <option value="numbers">Номера страниц</option>
                            </select>
                            <div class="helper-text">Как отображать навигацию по отфильтрованным результатам.</div>
                        </div>
                        <div class="setting-group">
                            <label for="itemsPerPage">Количество элементов на странице<span class="required-indicator">*</span></label>
                            <input type="number" id="itemsPerPage" class="text-input" value="10" min="1" max="100" required>
                            <div class="helper-text">(макс. 100).</div>
                        </div>
                        <div class="setting-group">
                            <label for="paginationBg">Акцентный цвет для кнопок пагинации и лоадера</label>
                            <input type="color" id="paginationBg" value="#4483f5" style="height: 38px; padding: 4px; width: 50%;">
                            <div class="helper-text">Какой основной цвет будет у элементов пагинации.</div>
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-container">
                                <input type="checkbox" id="showLoader" checked>
                                <span class="checkmark"></span>
                                <span class="checkbox-option-label">Показывать индикатор загрузки</span>
                            </label>
                            <div class="helper-text">Показывать анимацию во время загрузки данных.</div>
                        </div>
                </div>
            </div>
        </form>

        <div class="action-section">
          <button type="button" class="generate-button" id="generateBtn">Сгенерировать код</button>
        </div>
      </div>

      <!-- Templates для динамических элементов -->
      <template id="filterRuleTemplate">
        <div class="rule-card" data-rule-id="">
          <div class="rule-card-header">
            <div class="rule-title">Фильтр <span class="rule-badge rule-number">1</span></div>
            <button type="button" class="remove-rule-button" aria-label="Удалить правило">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="rule-content">
            <div class="settings-column">
              <div class="setting-group">
                <label>Имя<span class="required-indicator">*</span></label>
                <input type="text" class="text-input field-name" placeholder="Например: title, Цена, a1b2c3" required>
                <div class="helper-text">Введите имя поля из коллекции в Taptop (напр. <span class="code-highlight">Цена</span>)</div>
              </div>
              
              <div class="setting-group">
                <label>Тип UI Фильтра</label>
                <select class="select-styled ui-type">
                  <option value="input">🔍 Текстовое поле (поиск)</option>
                  <option value="select">🔽 Выпадающий список</option>
                  <option value="radio">⚪ Радио-кнопки</option>
                  <option value="buttons">🗂️ Кнопки-теги</option>
                  <option value="checkbox">☑️ Чекбокс (Есть/Нет)</option>
                </select>
                <div class="helper-text">Как пользователь будет фильтровать.</div>
              </div>
              
              <div class="setting-group">
                <label>Класс элемента(ов) фильтра<span class="required-indicator">*</span></label>
                <input type="text" class="text-input element-class" placeholder="имя-класса-без-точки" required>
                <div class="helper-text">Класс элемента управления (input, select, кнопки).</div>
              </div>
              
              <div class="setting-group">
                <label>Класс кнопки 'Сбросить это поле'</label>
                <input type="text" class="text-input clear-btn-class" placeholder="опционально">
                <div class="helper-text">Класс кнопки для сброса только этого фильтра.</div>
              </div>
              
              <div class="setting-group first-is-all-container">
                <label class="checkbox-container">
                  <input type="checkbox" class="first-is-all">
                  <span class="checkmark"></span>
                  <span class="checkbox-option-label">Первый пункт = "Все"</span>
                </label>
              </div>
              
              <div class="setting-group instant-filter-container">
                <label class="checkbox-container">
                  <input type="checkbox" class="instant-filter">
                  <span class="checkmark"></span>
                  <span class="checkbox-option-label">Мгновенный фильтр</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template id="sortRuleTemplate">
        <div class="rule-card" data-rule-id="">
          <div class="rule-card-header">
            <div class="rule-title">Правило сортировки <span class="rule-badge rule-number">#1</span></div>
            <button type="button" class="remove-rule-button remove-sort-rule-button" aria-label="Удалить правило">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="rule-content">
            <div class="settings-column">
              <div class="setting-group">
                <label for="sort-field-id-placeholder">Имя поля / ID поля из коллекции<span class="required-indicator">*</span></label>
                <input type="text" class="text-input sort-field-id" placeholder="Например: Цена или f1d2c3" required>
                <div class="helper-text">Укажите имя поля из вашей коллекции (например, <span class="code-highlight">Цена</span>) или его ID. Чувствительно к регистру.</div>
              </div>
              
              <div class="setting-group">
                <label>Направление сортировки<span class="required-indicator">*</span></label>
                <div class="radio-group" style="margin-top: 7px;">
                  <label class="radio-container">
                    <input type="radio" name="sort-direction-placeholder" class="sort-direction direction" value="asc" checked>
                    <span class="radio-checkmark"></span>
                    По возрастанию
                  </label>
                  <label class="radio-container">
                    <input type="radio" name="sort-direction-placeholder" class="sort-direction direction" value="desc">
                    <span class="radio-checkmark"></span>
                    По убыванию
                  </label>
                </div>
              </div>
              
              <div class="setting-group">
                <label for="sort-label-placeholder">Метка на сайте (текст опции/кнопки)<span class="required-indicator">*</span></label>
                <input type="text" class="text-input sort-label" placeholder="Например: По цене (сначала дешевые)" required>
                <div class="helper-text">Текст, который дизайнер должен будет указать в <span class="code-highlight">&lt;option&gt;</span> или на кнопке/ссылке. <strong>Должно быть точное совпадение.</strong></div>
              </div>
              
              <div class="setting-group">
                <label for="sort-element-selector-placeholder">Класс (источник стилей) отдельного элемента для этой опции:</label>
                <input type="text" class="text-input sort-element-selector" placeholder="Например: sort-by-price-asc">
                <div class="helper-text">Если эта опция сортировки управляется отдельной кнопкой/ссылкой, укажите ее уникальный Класс (источник стилей). Если используется общий <span class="code-highlight">&lt;select&gt;</span> из "Общих настроек", оставьте это поле пустым.</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    `;
  }

  findElements() {
    // Табы
    this.elements.tabButtons = this.shadowRoot.querySelectorAll(".tab");
    this.elements.tabContents =
      this.shadowRoot.querySelectorAll(".tab-content");

    // Основные элементы формы
    this.elements.collectionId = this.shadowRoot.getElementById("collectionId");
    this.elements.widgetClass = this.shadowRoot.getElementById("widgetClass");
    this.elements.applyBtnClass =
      this.shadowRoot.getElementById("applyBtnClass");
    this.elements.resetBtnClass =
      this.shadowRoot.getElementById("resetBtnClass");

    // Пагинация
    this.elements.paginationType =
      this.shadowRoot.getElementById("paginationType");
    this.elements.paginationSettings =
      this.shadowRoot.getElementById("paginationSettings");
    this.elements.itemsPerPage = this.shadowRoot.getElementById("itemsPerPage");
    this.elements.paginationBg = this.shadowRoot.getElementById("paginationBg");
    this.elements.showLoader = this.shadowRoot.getElementById("showLoader");

    // Правила
    this.elements.addFilterRule =
      this.shadowRoot.getElementById("addFilterRule");
    this.elements.addSortRule = this.shadowRoot.getElementById("addSortRule");
    this.elements.filterRulesList =
      this.shadowRoot.getElementById("filterRulesList");
    this.elements.sortRulesList =
      this.shadowRoot.getElementById("sortRulesList");

    // Templates
    this.elements.filterRuleTemplate =
      this.shadowRoot.getElementById("filterRuleTemplate");
    this.elements.sortRuleTemplate =
      this.shadowRoot.getElementById("sortRuleTemplate");

    // Общие настройки сортировки
    this.elements.commonSortSelector =
      this.shadowRoot.getElementById("commonSortSelector");
    this.elements.defaultSortLabel =
      this.shadowRoot.getElementById("defaultSortLabel");
    this.elements.applySortTiming = this.shadowRoot.querySelectorAll(
      'input[name="apply-sort-timing"]'
    );

    // Генерация
    this.elements.generateBtn = this.shadowRoot.getElementById("generateBtn");
  }

  bindEvents() {
    // Табы
    this.elements.tabButtons.forEach((button) => {
      const tabClickHandler = (e) => this.handleTabClick(e);
      button.addEventListener("click", tabClickHandler);
      this.eventHandlers.set(
        `tab_${button.dataset.tab}_click`,
        tabClickHandler
      );
    });

    // Пагинация
    const paginationChangeHandler = () => this.handlePaginationTypeChange();
    this.elements.paginationType.addEventListener(
      "change",
      paginationChangeHandler
    );
    this.eventHandlers.set("paginationType_change", paginationChangeHandler);

    // Правила
    const addFilterHandler = () => this.addFilterRule();
    this.elements.addFilterRule.addEventListener("click", addFilterHandler);
    this.eventHandlers.set("addFilterRule_click", addFilterHandler);

    const addSortHandler = () => this.addSortRule();
    this.elements.addSortRule.addEventListener("click", addSortHandler);
    this.eventHandlers.set("addSortRule_click", addSortHandler);

    // Делегирование событий для динамических элементов
    const rulesContainerHandler = (e) => this.handleRulesContainerClick(e);
    this.elements.filterRulesList.addEventListener(
      "click",
      rulesContainerHandler
    );
    this.elements.sortRulesList.addEventListener(
      "click",
      rulesContainerHandler
    );
    this.eventHandlers.set("rulesContainer_click", rulesContainerHandler);

    const rulesChangeHandler = (e) => this.handleRulesChange(e);
    this.elements.filterRulesList.addEventListener(
      "change",
      rulesChangeHandler
    );
    this.elements.filterRulesList.addEventListener("input", rulesChangeHandler);
    this.elements.sortRulesList.addEventListener("change", rulesChangeHandler);
    this.elements.sortRulesList.addEventListener("input", rulesChangeHandler);
    this.eventHandlers.set("rulesFilter_change", rulesChangeHandler);

    // Генерация
    const generateHandler = () => this.handleGenerate();
    this.elements.generateBtn.addEventListener("click", generateHandler);
    this.eventHandlers.set("generateBtn_click", generateHandler);

    // Инициализация состояния
    this.handlePaginationTypeChange();
  }

  handlePaginationTypeChange() {
    const paginationType = this.elements.paginationType.value;
    const isVisible = paginationType !== "none";
    this.elements.paginationSettings.classList.toggle("hidden", !isVisible);
  }

  addFilterRule() {
    const ruleId = this.ruleIdCounter++;
    const template = this.elements.filterRuleTemplate.content.cloneNode(true);
    const ruleCard = template.querySelector(".rule-card");

    ruleCard.dataset.ruleId = ruleId;
    ruleCard.querySelector(".rule-number").textContent =
      this.filterRules.length + 1;

    // Обновляем ID для checkbox'ов
    const firstIsAllCheckbox = ruleCard.querySelector(".first-is-all");
    const instantFilterCheckbox = ruleCard.querySelector(".instant-filter");
    firstIsAllCheckbox.id = `firstIsAll_${ruleId}`;
    instantFilterCheckbox.id = `instantFilter_${ruleId}`;

    firstIsAllCheckbox.nextElementSibling.setAttribute(
      "for",
      `firstIsAll_${ruleId}`
    );
    instantFilterCheckbox.nextElementSibling.setAttribute(
      "for",
      `instantFilter_${ruleId}`
    );

    // Применяем начальную видимость для типа "input"
    const firstIsAllContainer = ruleCard.querySelector(
      ".first-is-all-container"
    );
    const instantFilterContainer = ruleCard.querySelector(
      ".instant-filter-container"
    );

    // Для "input" скрываем оба чекбокса
    if (firstIsAllContainer) {
      firstIsAllContainer.classList.add("hidden");
    }
    if (instantFilterContainer) {
      instantFilterContainer.classList.add("hidden");
    }

    this.elements.filterRulesList.appendChild(ruleCard);

    // Добавляем в массив правил
    this.filterRules.push({
      id: ruleId,
      fieldName: "",
      uiType: "input",
      elementClass: "",
      clearBtnClass: "",
      firstIsAll: false,
      instantFilter: false,
    });
  }

  addSortRule() {
    const ruleId = this.ruleIdCounter++;
    const template = this.elements.sortRuleTemplate.content.cloneNode(true);
    const ruleCard = template.querySelector(".rule-card");

    ruleCard.dataset.ruleId = ruleId;
    ruleCard.querySelector(".rule-number").textContent =
      this.sortRules.length + 1;

    // Обновляем имена радио-кнопок для уникальности групп
    const radioButtons = ruleCard.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.name = `sort-direction-${ruleId}`;
    });

    this.elements.sortRulesList.appendChild(ruleCard);

    // Добавляем в массив правил
    this.sortRules.push({
      id: ruleId,
      fieldName: "",
      direction: "asc",
      labelText: "",
      elementClass: "",
    });
  }

  handleRulesContainerClick(e) {
    if (e.target.closest(".remove-rule-button")) {
      const ruleCard = e.target.closest(".rule-card");
      const ruleId = parseInt(ruleCard.dataset.ruleId);

      if (ruleCard.closest("#filterRulesList")) {
        this.removeFilterRule(ruleId);
      } else {
        this.removeSortRule(ruleId);
      }

      ruleCard.remove();
      this.updateRuleNumbers();
    }
  }

  handleRulesChange(e) {
    const target = e.target;
    const ruleCard = target.closest(".rule-card");
    if (!ruleCard) return;

    const ruleId = parseInt(ruleCard.dataset.ruleId);

    if (ruleCard.closest("#filterRulesList")) {
      const rule = this.filterRules.find((r) => r.id === ruleId);
      if (!rule) return;

      if (target.classList.contains("ui-type")) {
        rule.uiType = target.value;

        // Показываем поле кнопки очистки только для определенных типов
        const clearBtnField = ruleCard.querySelector(".clear-btn-field");
        if (clearBtnField) {
          const showClearBtn = [
            "select",
            "radio",
            "buttons",
            "checkbox",
          ].includes(target.value);
          clearBtnField.classList.toggle("hidden", !showClearBtn);
        }

        // Условная видимость чекбоксов
        const firstIsAllContainer = ruleCard.querySelector(
          ".first-is-all-container"
        );
        const instantFilterContainer = ruleCard.querySelector(
          ".instant-filter-container"
        );
        const instantFilterCheckbox = ruleCard.querySelector(".instant-filter");

        // "Первый пункт все" показываем только для select, radio, buttons
        const showFirstIsAll = ["select", "radio", "buttons"].includes(
          target.value
        );
        if (firstIsAllContainer) {
          firstIsAllContainer.classList.toggle("hidden", !showFirstIsAll);
        }

        // "Мгновенный фильтр" скрываем только для input
        const showInstantFilter = target.value !== "input";
        if (instantFilterContainer) {
          instantFilterContainer.classList.toggle("hidden", !showInstantFilter);
        }

        // Обновляем значение мгновенного фильтра
        if (instantFilterCheckbox) {
          if (target.value === "input") {
            rule.instantFilter = false;
            instantFilterCheckbox.checked = false;
          } else if (rule.instantFilter === undefined) {
            rule.instantFilter = true;
            instantFilterCheckbox.checked = true;
          }
        }
      } else if (target.classList.contains("field-name")) {
        rule.fieldName = target.value.trim();
      } else if (target.classList.contains("element-class")) {
        rule.elementClass = target.value.trim();
      } else if (target.classList.contains("clear-btn-class")) {
        rule.clearBtnClass = target.value.trim();
      } else if (target.classList.contains("first-is-all")) {
        rule.firstIsAll = target.checked;
      } else if (target.classList.contains("instant-filter")) {
        rule.instantFilter = target.checked;
      }
    } else if (ruleCard.closest("#sortRulesList")) {
      const rule = this.sortRules.find((r) => r.id === ruleId);
      if (!rule) return;

      if (target.classList.contains("sort-field-id")) {
        rule.fieldIdOrName = target.value.trim();
      } else if (target.classList.contains("sort-direction")) {
        rule.direction = target.value;
      } else if (target.classList.contains("sort-label")) {
        rule.label = target.value.trim();
      } else if (target.classList.contains("sort-element-selector")) {
        rule.elementSelector = target.value.trim();
      }
    }
  }

  removeFilterRule(ruleId) {
    this.filterRules = this.filterRules.filter((rule) => rule.id !== ruleId);
  }

  removeSortRule(ruleId) {
    this.sortRules = this.sortRules.filter((rule) => rule.id !== ruleId);
  }

  updateRuleNumbers() {
    // Обновляем номера правил фильтрации
    const filterCards =
      this.elements.filterRulesList.querySelectorAll(".rule-card");
    filterCards.forEach((card, index) => {
      card.querySelector(".rule-number").textContent = index + 1;
    });

    // Обновляем номера правил сортировки
    const sortCards =
      this.elements.sortRulesList.querySelectorAll(".rule-card");
    sortCards.forEach((card, index) => {
      card.querySelector(".rule-number").textContent = index + 1;
    });
  }

  handleTabClick(e) {
    e.preventDefault();
    const clickedTab = e.target.closest(".tab");
    const targetTabId = clickedTab.dataset.tab;

    // Убираем активный класс со всех табов и контента
    this.elements.tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.elements.tabContents.forEach((content) =>
      content.classList.remove("active")
    );

    // Добавляем активный класс к выбранному табу
    clickedTab.classList.add("active");

    // Показываем соответствующий контент
    const targetContent = this.shadowRoot.getElementById(`${targetTabId}Tab`);
    if (targetContent) {
      targetContent.classList.add("active");
    }
  }

  async handleGenerate() {
    const data = this.collectData();
    if (!data) return;

    try {
      const generatedCode = this.generateCode(data);
      const minifiedCode = await this.enhancedMinify(generatedCode);

      await this.copyToClipboard(minifiedCode);
      this.showSuccessPopup();

      console.log("Collection Filter code generated and copied to clipboard");
    } catch (error) {
      console.error("Error generating Collection Filter code:", error);
      alert(
        "Ошибка при генерации кода. Проверьте настройки и попробуйте снова."
      );
    }
  }

  collectData() {
    // Сбор базовых настроек
    const baseSettings = {
      collectionId: parseInt(this.elements.collectionId.value.trim()) || null,
      targetSelector: this.elements.widgetClass.value.trim() || null,
      applyButtonSelector: this.elements.applyBtnClass.value.trim() || null,
      resetButtonSelector: this.elements.resetBtnClass.value.trim() || null,
      itemsPerPage: parseInt(this.elements.itemsPerPage.value) || 10,
      paginationType: this.elements.paginationType.value || "none",
      primaryColor: this.elements.paginationBg.value || "#4483f5",
      showLoader: this.elements.showLoader.checked,
    };

    // Сбор правил фильтрации из DOM
    const collectedFields = [];
    const filterCards =
      this.elements.filterRulesList.querySelectorAll(".rule-card");

    filterCards.forEach((card) => {
      const rule = {
        fieldId: card.querySelector(".field-name").value.trim(),
        uiType: card.querySelector(".ui-type").value,
        elementSelector: card.querySelector(".element-class").value.trim(),
        clearButtonSelector:
          card.querySelector(".clear-btn-class").value.trim() || null,
        firstIsAll: card.querySelector(".first-is-all").checked,
        instantFilter: card.querySelector(".instant-filter").checked,
      };

      // Определяем тип условия на основе UI типа
      let condition = null;
      switch (rule.uiType) {
        case "input":
          condition = "FILTER_CONTAINS";
          break;
        case "select":
        case "radio":
        case "buttons":
          condition = "FILTER_EQUAL";
          break;
        case "checkbox":
          condition = "FILTER_IS_ON";
          break;
      }

      if (rule.fieldId && rule.uiType) {
        collectedFields.push({ ...rule, condition });
      }
    });

    // Сбор правил сортировки из DOM
    const collectedSortRules = [];
    const sortCards =
      this.elements.sortRulesList.querySelectorAll(".rule-card");

    sortCards.forEach((card) => {
      const rule = {
        fieldIdOrName: card.querySelector(".sort-field-id").value.trim(),
        direction: card.querySelector(".sort-direction:checked").value,
        label: card.querySelector(".sort-label").value.trim(),
        elementSelector:
          card.querySelector(".sort-element-selector").value.trim() || null,
      };

      if (rule.fieldIdOrName && rule.label) {
        collectedSortRules.push(rule);
      }
    });

    // Получаем настройки сортировки
    const getCheckedApplySortTiming = () => {
      for (let radio of this.elements.applySortTiming) {
        if (radio.checked) return radio.value;
      }
      return "instant"; // default
    };

    const settings = {
      ...baseSettings,
      fields: collectedFields,
      sortConfig: {
        rules: collectedSortRules,
        commonSelectSelector:
          this.elements.commonSortSelector.value.trim() || null,
        applyInstantly: getCheckedApplySortTiming() === "instant",
        defaultSortLabel: this.elements.defaultSortLabel.value.trim() || null,
      },
    };

    // Валидация
    if (!this._validateSettings(settings)) {
      return null;
    }

    return settings;
  }

  _validateSettings(settings) {
    if (!settings.collectionId) {
      alert("Укажите ID Коллекции.");
      return false;
    }
    if (!settings.targetSelector) {
      alert("Укажите Класс виджета Коллекции.");
      return false;
    }

    const itemsPerPage = settings.itemsPerPage;
    if (
      itemsPerPage === undefined ||
      !Number.isInteger(itemsPerPage) ||
      itemsPerPage < 1 ||
      itemsPerPage > 100
    ) {
      alert(
        "Укажите корректное число элементов на странице API (от 1 до 100)."
      );
      return false;
    }

    const isInvalidClassName = (value, label) => {
      if (!value) return false;
      if (/[.#\s\[\]>+~:()]/.test(value)) {
        alert(
          `${label}: Класс не должен содержать точки, решетки, пробелы или другие спецсимволы CSS-селекторов.`
        );
        return true;
      }
      return false;
    };

    if (isInvalidClassName(settings.targetSelector, "Класс виджета Коллекции"))
      return false;
    if (
      isInvalidClassName(
        settings.applyButtonSelector,
        'Класс кнопки "Применить"'
      )
    )
      return false;
    if (
      isInvalidClassName(
        settings.resetButtonSelector,
        'Класс кнопки "Сбросить"'
      )
    )
      return false;

    if (!Array.isArray(settings.fields)) settings.fields = [];
    let requiresApplyButton = false;
    const elementSelectorsUsed = new Map();
    const clearButtonSelectorsUsed = new Map();

    for (const [index, field] of settings.fields.entries()) {
      const fieldLabelPrefix = `Поле #${index + 1} (${
        field.label || field.fieldId || "???"
      })`;
      if (!field.fieldId) {
        alert(`Поле #${index + 1}: не указано Имя или ID Поля.`);
        return false;
      }
      const isFilterType = field.uiType;

      if (isFilterType) {
        if (!field.elementSelector) {
          alert(`${fieldLabelPrefix}: не указан Класс элемента(ов) фильтра.`);
          return false;
        }
        if (
          isInvalidClassName(
            field.elementSelector,
            `${fieldLabelPrefix}: Класс элемента(ов) фильтра`
          )
        )
          return false;
        if (
          isInvalidClassName(
            field.clearButtonSelector,
            `${fieldLabelPrefix}: Класс кнопки 'Сбросить это поле'`
          )
        )
          return false;

        if (elementSelectorsUsed.has(field.elementSelector)) {
          if (
            field.fieldId !== elementSelectorsUsed.get(field.elementSelector)
          ) {
            alert(
              `Класс фильтра '${field.elementSelector}' используется для разных полей.`
            );
            return false;
          }
        } else {
          elementSelectorsUsed.set(field.elementSelector, field.fieldId);
        }
        if (field.clearButtonSelector) {
          if (clearButtonSelectorsUsed.has(field.clearButtonSelector)) {
            alert(
              `Ошибка: Класс кнопки сброса '${field.clearButtonSelector}' используется для нескольких полей.`
            );
            return false;
          } else {
            clearButtonSelectorsUsed.set(
              field.clearButtonSelector,
              field.fieldId
            );
          }
        }
        if (!field.instantFilter) requiresApplyButton = true;
      }
    }

    if (requiresApplyButton && !settings.applyButtonSelector) {
      alert(
        'Хотя бы один из настроенных фильтров не является "Мгновенным". Укажите Класс (источник стилей) для кнопки "Применить все фильтры" в Основных настройках или сделайте все фильтры мгновенными.'
      );
      return false;
    }

    // Валидация настроек сортировки
    if (settings.sortConfig) {
      const { rules, commonSelectSelector } = settings.sortConfig;
      if (
        commonSelectSelector &&
        isInvalidClassName(
          commonSelectSelector,
          "Класс (источник стилей) общего элемента <select> для сортировки"
        )
      )
        return false;

      if (Array.isArray(rules) && rules.length > 0) {
        const sortLabelsUsed = new Set();
        const sortElementSelectorsUsed = new Set();

        for (const [index, rule] of rules.entries()) {
          const sortRuleLabelPrefix = `Правило сортировки #${index + 1} ('${
            rule.label || rule.fieldIdOrName || "Не указано"
          }')`;
          if (!rule.fieldIdOrName) {
            alert(
              `${sortRuleLabelPrefix}: не указано Имя или ID Поля для сортировки.`
            );
            return false;
          }
          if (!rule.label) {
            alert(
              `${sortRuleLabelPrefix}: не указана "Метка на сайте" для опции сортировки.`
            );
            return false;
          }

          if (commonSelectSelector) {
            if (sortLabelsUsed.has(rule.label)) {
              alert(
                `${sortRuleLabelPrefix}: Метка на сайте "${rule.label}" уже используется. Для общего <select> все метки должны быть уникальны.`
              );
              return false;
            }
            sortLabelsUsed.add(rule.label);
          }

          if (rule.elementSelector) {
            if (
              isInvalidClassName(
                rule.elementSelector,
                `${sortRuleLabelPrefix}: Класс (источник стилей) отдельной кнопки/ссылки`
              )
            )
              return false;
            if (sortElementSelectorsUsed.has(rule.elementSelector)) {
              alert(
                `${sortRuleLabelPrefix}: Класс (источник стилей) "${rule.elementSelector}" для отдельного элемента сортировки уже используется другим правилом.`
              );
              return false;
            }
            sortElementSelectorsUsed.add(rule.elementSelector);
          }
        }
      }
    }
    return true;
  }

  generateCode(settings = {}) {
    // Константы для типов фильтров и UI (полные определения из оригинала)
    const FILTER_TYPES = {
      EQUAL: "FILTER_EQUAL",
      CONTAINS: "FILTER_CONTAINS",
      NOT_EQUAL: "FILTER_NOT_EQUAL",
      NOT_CONTAINS: "FILTER_NOT_CONTAINS",
      IS_SET: "FILTER_IS_SET",
      IS_NOT_SET: "FILTER_IS_NOT_SET",
      COLLECTION_TEXT: "FILTER_COLLECTION_TEXT",
      IS_ON: "FILTER_IS_ON",
      IS_OFF: "FILTER_IS_OFF",
    };

    const UI_TYPES = {
      INPUT: "input",
      SELECT: "select",
      RADIO: "radio",
      BUTTONS: "buttons",
      CHECKBOX_SET: "checkbox",
      CHECKBOX_GROUP: "checkbox-group",
    };

    // Создание конфигурации времени выполнения
    const runtimeConfig = {
      collectionId: settings.collectionId,
      targetSelector: settings.targetSelector,
      applyButtonSelector: settings.applyButtonSelector || null,
      resetButtonSelector: settings.resetButtonSelector || null,
      itemsPerPage: settings.itemsPerPage || 9,
      paginationType: settings.paginationType || "none",
      showLoader: true,
      primaryColor: settings.primaryColor || "#4483f5",
      fields:
        settings.fields?.map((f) => ({
          fieldIdOrName: f.fieldId,
          label: f.fieldId,
          uiType: f.uiType,
          elementSelector: f.elementSelector || null,
          clearButtonSelector: f.clearButtonSelector || null,
          firstIsAll: f.firstIsAll !== false,
          instantFilter: f.instantFilter ?? f.uiType !== UI_TYPES.INPUT,
          condition: f.condition,
        })) || [],
      apiEndpoint: "/-/x-api/v1/public/",
      debounceTimeout: 50,
      imageFieldSynonyms: [
        "изображение",
        "картинка",
        "фото",
        "image",
        "picture",
      ],
      priceFieldSynonyms: ["цена", "стоимость", "price", "cost"],
      categoryFieldSynonyms: [
        "категория",
        "раздел",
        "тип",
        "category",
        "section",
        "type",
      ],
      tagFieldSynonyms: ["тег", "метка", "tag", "label"],
      stockFieldSynonyms: [
        "наличие",
        "остаток",
        "stock",
        "available",
        "quantity",
        "qty",
      ],
      descriptionFieldSynonyms: [
        "описание",
        "description",
        "текст",
        "text",
        "desc",
      ],
      sortConfig: settings.sortConfig
        ? {
            rules: (settings.sortConfig.rules || []).map((r) => ({
              fieldIdOrName: r.fieldIdOrName,
              direction: r.direction,
              label: r.label,
              elementSelector: r.elementSelector || null,
            })),
            commonSelectSelector:
              settings.sortConfig.commonSelectSelector || null,
            applyInstantly: settings.sortConfig.applyInstantly !== false,
            defaultSortLabel: settings.sortConfig.defaultSortLabel || null,
          }
        : {
            rules: [],
            commonSelectSelector: null,
            applyInstantly: true,
            defaultSortLabel: null,
          },
    };

    const runtimeConfigJSON = JSON.stringify(runtimeConfig);

    const scriptCode = `
      <style>
        .cf-custom-pagination-container,
        .cf-loader-overlay { --cf-primary-color: ${
          runtimeConfig.primaryColor || "#4483f5"
        }; }
        .cf-loader-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.7); display: flex; justify-content: center; align-items: center; z-index: 10; transition: opacity 0.3s ease, visibility 0.3s ease; opacity: 0; visibility: hidden; }
        .cf-loader-overlay.is-active { opacity: 1; visibility: visible; }
        .cf-loader { width: 38px; height: 38px; border: 4px solid rgba(0, 0, 0, 0.1); border-bottom-color: var(--cf-primary-color); border-radius: 50%; display: inline-block; box-sizing: border-box; animation: cf-rotation 1s linear infinite; }
        @keyframes cf-rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .cf-custom-pagination-container { display: flex; justify-content: center; align-items: center; padding: 15px 0; gap: 5px; flex-wrap: wrap; }
        .cf-pagination__button, .cf-pagination__number, .cf-pagination__ellipsis { min-width: 36px; height: 36px; padding: 0 10px; border: 1px solid #ddd; background-color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; line-height: 34px; text-align: center; display: inline-flex; justify-content: center; align-items: center; text-decoration: none; color: #333; }
        .cf-pagination__button:disabled { cursor: not-allowed; opacity: 0.5; background-color: #f5f5f5; }
        .cf-pagination__button:not(:disabled):hover, .cf-pagination__number:not(.is-active):not(.is-disabled):hover { border-color: var(--cf-primary-color); color: var(--cf-primary-color); background-color: rgba(68, 131, 245, 0.05); }
        .cf-pagination__number.is-active { background-color: var(--cf-primary-color); color: white; border-color: var(--cf-primary-color); cursor: default; }
        .cf-pagination__ellipsis { border: none; background: none; cursor: default; padding: 0 5px; }
        .${
          runtimeConfig.targetSelector || "collection"
        } .collection__list { visibility: hidden; opacity: 0; transition: opacity 0.3s ease, visibility 0s linear 0.3s; }
        .${
          runtimeConfig.targetSelector || "collection"
        }.cf-initialized .collection__list { visibility: visible; opacity: 1; transition-delay: 0s; }
        .${
          runtimeConfig.targetSelector || "collection"
        }.cf-loading .collection__list { opacity: 0.4 !important; transition: none !important; pointer-events: none; }
        .${
          runtimeConfig.targetSelector || "collection"
        } .collection__pagination.is-removed { display: none !important; }
        .${
          runtimeConfig.targetSelector || "collection"
        } .collection__pagination-pages, .${
      runtimeConfig.targetSelector || "collection"
    } .collection__pagination-load, .${
      runtimeConfig.targetSelector || "collection"
    } .collection__pagination-page-by-page { display: none !important; }
        .cf-error-message { color: red; padding: 10px; border: 1px solid red; margin: 10px 0; border-radius: 4px; background: rgba(255, 0, 0, 0.05); }
        .active-sort-option {
            background-color: var(--cf-primary-color) !important;
            color: white !important;
            border-color: var(--cf-primary-color) !important;
        }
      </style>
      <script>
        document.addEventListener("DOMContentLoaded", async () => {
          const FILTER_TYPES = ${JSON.stringify(FILTER_TYPES)};
          const UI_TYPES = ${JSON.stringify(UI_TYPES)};

          function debounce(func, wait) {
            let timeout;
            const d = function (...a) {
              const c = this;
              clearTimeout(timeout);
              timeout = setTimeout(() => { timeout = null; func.apply(c, a); }, wait);
            };
            d.cancel = () => { clearTimeout(timeout); timeout = null; };
            return d;
          }

          class TaptopCollectionFilter {
            constructor(configObject) {
              this.config = configObject || {};
              this.widgetId = null;
              this.itemTemplateString = "";
              this.schema = null;
              this.currentPage = 1;
              this.totalPages = 1;
              this.currentFilters = { apiFilters: [], clientFilters: [] };
              this.sortConfig = this.config.sortConfig || { rules: [], commonSelectSelector: null, applyInstantly: true, defaultSortLabel: null };
              this.currentSortParams = null; 
              this.collectionSlug = null;

              this.elements = {
                filterControls: {},
                clearButtons: {},
                customPagination: {},
                sortControlElements: { 
                    commonSelect: null,
                    specificButtons: [],
                    allActiveElements: []
                }
              };
              this.isLoading = false;
              this.fetchTimeout = null;
              this.fieldIdMap = new Map();
              this.initialDataLoadPromise = null;
              this.latestTotalItemsCount = 0;
              this.applyFiltersDebounced = debounce(() => this.applyFilters(true), this.config.debounceTimeout || 300);
              this._boundHandleCustomPaginationClick = this._handleCustomPaginationClick.bind(this);
              this._boundHandleSortChange = this._handleSortChange.bind(this);
              this.isInitialLoad = true;
            }

            async _init() {
              this.elements.widget = document.querySelector("." + this.config.targetSelector);
              if (!this.elements.widget) { console.error("[CF] Виджет не найден:", this.config.targetSelector); return; }

              this.widgetId = this.elements.widget.dataset.widgetId || null;
              if (!this.widgetId) {
                const firstCollectionItem = this.elements.widget.querySelector(".collection__item[id]");
                if (firstCollectionItem && firstCollectionItem.id) {
                  const idParts = firstCollectionItem.id.split("_");
                  this.widgetId = idParts[0];
                  if (!this.widgetId) {
                    console.error("[CF Init Error] Не удалось извлечь widget_id из ID элемента .collection__item:", firstCollectionItem.id);
                    this._showErrorMessage("Ошибка инициализации: Некорректный ID у элемента .collection__item."); return;
                  }
                  console.log("[CF Init] Автоматически определен widget_id из .collection__item:", this.widgetId);
                } else {
                  console.error("[CF Init Error] Не удалось найти data-widget-id у виджета или .collection__item[id] для определения widget_id.");
                  this._showErrorMessage("Ошибка инициализации: Не удалось определить ID виджета."); return;
                }
              } else {
                console.log("[CF Init] widget_id найден в data-widget-id:", this.widgetId);
              }

              if (window.getComputedStyle(this.elements.widget).position === "static") { this.elements.widget.style.position = "relative"; }
              this.elements.targetContainer = this.elements.widget.querySelector(".collection__list");
              if (!this.elements.targetContainer) { console.error("[CF] Контейнер .collection__list не найден."); return; }
              
              this.elements.taptopPaginationContainer = this.elements.widget.querySelector(".collection__pagination");
              if (this.elements.taptopPaginationContainer) {
                this.elements.taptopPaginationContainer.classList.add("cf-custom-pagination-container");
                this.elements.taptopPaginationContainer.style.display = "";
                this.elements.taptopPaginationContainer.addEventListener("click", this._boundHandleCustomPaginationClick);
              } else {
                console.warn("[CF] Контейнер пагинации Taptop (.collection__pagination) не найден.");
              }
              if (this.config.showLoader) {
                this.elements.loaderOverlay = document.createElement("div");
                this.elements.loaderOverlay.className = "cf-loader-overlay";
                this.elements.loaderOverlay.innerHTML = '<span class="cf-loader"></span>';
                this.elements.widget.appendChild(this.elements.loaderOverlay);
              }
              
              this.initialDataLoadPromise = this._fetchTemplateAndSchema();
              this.elements.notFoundElement = this.elements.widget.querySelector(".collection__empty");
              this._findControlsAndButtons();
              this._initSortControls(); 

              try {
                await this.initialDataLoadPromise;
                this._bindEvents();
                console.log("[CF Init] Шаблон и схема загружены. Фильтр инициализирован.");
                const taptopNativePaginationParts = this.elements.widget.querySelectorAll(".collection__pagination-pages, .collection__pagination-load, .collection__pagination-page-by-page");
                taptopNativePaginationParts.forEach((el) => el.classList.add("is-removed"));
                if (this.config.showLoader) this._setLoadingState(true);
                await this.fetchAndRenderItems([], this.currentPage, false, true);
              } catch (error) {
                console.error("[CF Init Error] Критическая ошибка во время инициализации (шаблон/схема):", error);
                this._showErrorMessage(\`Критическая ошибка инициализации: \${error.message}.\`);
                if (this.config.showLoader) this._setLoadingState(false);
              } finally {
                if (this.elements.notFoundElement) this.elements.notFoundElement.classList.add("is-removed");
              }
            }

            async _fetchTemplateAndSchema() {
              if (!this.config.collectionId) throw new Error("ID Коллекции не определен для загрузки шаблона/схемы.");
              if (!this.widgetId) throw new Error("ID Виджета не определен для загрузки шаблона/схемы.");
              const getItemsUrl = new URL(this.config.apiEndpoint, window.location.origin);
              getItemsUrl.searchParams.set("method", "mosaic/collectionGetItems");
              getItemsUrl.searchParams.set("param[collection_id]", this.config.collectionId);
              getItemsUrl.searchParams.set("param[widget_id]", this.widgetId);
              getItemsUrl.searchParams.set("param[page]", "1");
              getItemsUrl.searchParams.set("param[per_page]", "1");
              let templateResponseData;
              try {
                const response = await fetch(getItemsUrl.toString());
                if (!response.ok) throw new Error(\`API collectionGetItems (\${response.status}): \${response.statusText}. URL: \${getItemsUrl.toString()}\`);
                templateResponseData = await response.json();
                if (templateResponseData.error) throw new Error(\`API collectionGetItems error: \${templateResponseData.error.message}\`);
                if (!templateResponseData.result || !templateResponseData.result.item_template) {
                  throw new Error("item_template не найден в ответе collectionGetItems.");
                }
                this.itemTemplateString = templateResponseData.result.item_template;
                
                function getFirstSlugSegment(path) {
                  const segments = (path || '').split("/").filter(Boolean);
                  return segments[0] || "";
                }
                if (templateResponseData.result && templateResponseData.result.items && templateResponseData.result.items[0]) {
                  const slug = getFirstSlugSegment(templateResponseData.result.items[0].slug);
                  this.collectionSlug = slug;
                   console.log("[CF Init] Slug для динамических страницы:", this.collectionSlug);
                } else {
                  this.collectionSlug = null;
                  console.warn("[CF Init] Collection slug не найден. Ссылки на динамические страницы могут быть корректны.");
                }

              } catch (error) {
                console.error("[CF FetchSchema] Ошибка при загрузке item_template:", error);
                throw error;
              }
              if (templateResponseData.result && (templateResponseData.result.c_schema || templateResponseData.result.settings) && (Array.isArray(templateResponseData.result.c_schema) || Array.isArray(templateResponseData.result.settings))) {
                this.schema = { c_schema: templateResponseData.result.c_schema || [], settings: templateResponseData.result.settings || [] };
              } else {
                await this._fetchSchemaViaCollectionSearch();
              }
              this._buildFieldIdMap();
            }

            async _fetchSchemaViaCollectionSearch() {
              if (!this.config.collectionId) { console.warn("[CF Schema] ID Коллекции не указан для collectionSearch."); return; }
              const schemaUrl = new URL(this.config.apiEndpoint, window.location.origin);
              schemaUrl.searchParams.set("method", "mosaic/collectionSearch");
              schemaUrl.searchParams.set("param[collection_id]", this.config.collectionId);
              schemaUrl.searchParams.set("param[per_page]", "0");
              try {
                const response = await fetch(schemaUrl);
                if (!response.ok) throw new Error(\`API collectionSearch (\${response.status}): \${response.statusText}. URL: \${schemaUrl.toString()}\`);
                const data = await response.json();
                if (data.error) throw new Error(\`API collectionSearch error: \${data.error.message}\`);
                if (!data.result || (!data.result.c_schema && !data.result.settings) || (!Array.isArray(data.result.c_schema) && !Array.isArray(data.result.settings))) {
                  throw new Error("Схема полей (c_schema/settings) не найдена или некорректна в ответе collectionSearch.");
                }
                this.schema = { c_schema: data.result.c_schema || [], settings: data.result.settings || [] };
              } catch (error) {
                console.error("[CF FetchSchema] Ошибка при загрузке схемы полей из collectionSearch:", error);
                throw error;
              }
            }

            _buildFieldIdMap() {
              this.fieldIdMap.clear();
              if (!this.schema) { console.warn("[CF Map] Схема для построения fieldIdMap отсутствует."); return; }
              const schemaFields = [...(this.schema.c_schema || []), ...(this.schema.settings || [])];
              if (schemaFields.length === 0) { console.warn("[CF Map] Схема найдена, но пуста."); return; }
              const nameToIdMap = new Map();
              schemaFields.forEach((field) => {
                const fId = String(field.id).trim();
                let fName = (field.field_name || "").trim().toLowerCase();
                if (!fName) {
                  if (field.type === "title" || fId === "title") fName = "title";
                  else if (field.type === "slug" || fId === "slug") fName = "slug";
                }
                if (fId) {
                  nameToIdMap.set(fId.toLowerCase(), fId);
                  if (fName) nameToIdMap.set(fName, fId);
                }
              });
              if (Array.isArray(this.config.fields)) {
                this.config.fields.forEach((confField) => {
                  const fIdOrName = String(confField.fieldIdOrName || "").trim();
                  const fIdOrNameLower = fIdOrName.toLowerCase();
                  let foundId = nameToIdMap.get(fIdOrNameLower);
                  if (!foundId) {
                    const synGroups = [this.config.imageFieldSynonyms, this.config.priceFieldSynonyms, this.config.categoryFieldSynonyms, this.config.tagFieldSynonyms, this.config.stockFieldSynonyms, this.config.descriptionFieldSynonyms];
                    for (const group of synGroups) {
                      if (group && group.includes(fIdOrNameLower)) {
                        for (const syn of group) {
                          foundId = nameToIdMap.get(syn);
                          if (foundId) break;
                        }
                      }
                      if (foundId) break;
                    }
                  }
                  if (!foundId && !/^[a-f0-9]{6,}$/i.test(fIdOrName)) {
                    let partialMatchId = null;
                    for (const [name, id] of nameToIdMap.entries()) {
                      if (!/^[a-f0-9]{6,}$/i.test(name) && name !== "title" && name !== "slug" && name.includes(fIdOrNameLower)) {
                        partialMatchId = id; break;
                      }
                    }
                    if (partialMatchId) foundId = partialMatchId;
                  }
                  if (foundId) {
                    this.fieldIdMap.set(confField.fieldIdOrName, foundId);
                  } else {
                    if (/^[a-f0-9]{6,}$/i.test(fIdOrName) || fIdOrName === "title" || fIdOrName === "slug") {
                      this.fieldIdMap.set(confField.fieldIdOrName, fIdOrName);
                    } else {
                      console.warn(\`[CF Map] Поле '\${confField.fieldIdOrName}' (Метка: '\${confField.label}') не найдено в схеме коллекции. Фильтрация по нему не будет работать.\`);
                    }
                  }
                });
              }
              if (this.sortConfig && Array.isArray(this.sortConfig.rules)) {
                  this.sortConfig.rules.forEach(sortRule => {
                      const fIdOrName = String(sortRule.fieldIdOrName || "").trim();
                      if (!fIdOrName) return;
                      const fIdOrNameLower = fIdOrName.toLowerCase();
                      let foundId = nameToIdMap.get(fIdOrNameLower);
                      if (foundId) {
                          this.fieldIdMap.set(sortRule.fieldIdOrName, foundId);
                      } else {
                           if (/^[a-f0-9]{6,}$/i.test(fIdOrName) || fIdOrName === "title" || fIdOrName === "slug") {
                              this.fieldIdMap.set(sortRule.fieldIdOrName, fIdOrName);
                           } else {
                              console.warn(\`[CF Sort Map] Поле сортировки '\${sortRule.fieldIdOrName}' (Метка: '\${sortRule.label}') не найдено в схеме коллекции. Сортировка по нему может не работать.\`);
                           }
                      }
                  });
              }
            }

            _getRealFieldId(fieldIdOrName) {
              return this.fieldIdMap.get(String(fieldIdOrName)) || String(fieldIdOrName);
            }

            _findControlsAndButtons() {
              if (this.config.applyButtonSelector) this.elements.applyButton = document.querySelector("." + this.config.applyButtonSelector);
              if (this.config.resetButtonSelector) this.elements.resetButton = document.querySelector("." + this.config.resetButtonSelector);
              this.elements.filterControls = {};
              this.elements.clearButtons = {};
              if (!Array.isArray(this.config.fields)) return;
              this.config.fields.forEach((field) => {
                if (field.elementSelector && field.condition) {
                  const controls = document.querySelectorAll("." + field.elementSelector);
                  if (controls.length > 0) this.elements.filterControls[field.fieldIdOrName] = controls;
                  else console.warn("[CF] Элемент управления фильтром не найден:", field.elementSelector, "для поля", field.fieldIdOrName);
                }
                if (field.clearButtonSelector) {
                  const btn = document.querySelector("." + field.clearButtonSelector);
                  if (btn) this.elements.clearButtons[field.fieldIdOrName] = btn;
                  else console.warn("[CF] Кнопка сброса поля не найдена:", field.clearButtonSelector, "для поля", field.fieldIdOrName);
                }
              });
              const needsApply = this.config.fields.some((f) => f.condition && f.instantFilter === false);
              if (needsApply && !this.elements.applyButton) console.error('[CF] Кнопка "Применить" (' + this.config.applyButtonSelector + ") не найдена, но требуется для некоторых фильтров.");
            }
            
            _initSortControls() {
              const { rules, commonSelectSelector } = this.sortConfig;
              if (!rules || rules.length === 0) {
                  return;
              }

            if (commonSelectSelector) {
                const selectElement = document.querySelector('select.' + commonSelectSelector);
                if (selectElement) {
                    this.elements.sortControlElements.commonSelect = selectElement;
                    selectElement.addEventListener('change', this._boundHandleSortChange);
                    this.elements.sortControlElements.allActiveElements.push(selectElement);
                    console.log(\`[CF Sort] Общий <select> (\${commonSelectSelector}) для сортировки найден.\`);
                } else {
                    console.warn(\`[CF Sort] Общий <select> "\${commonSelectSelector}" не найден.\`);
                }
            }

             rules.forEach(rule => {
        if (rule.elementSelector) {
            const elements = document.querySelectorAll('.' + rule.elementSelector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    el.addEventListener('click', (event) => this._handleSortChange(event, rule));
                    const buttonRule = { element: el, rule: rule };
                    this.elements.sortControlElements.specificButtons.push(buttonRule);
                    this.elements.sortControlElements.allActiveElements.push(el);
                });
            }
        }
    });
    }

            _handleSortChange(event, specificRule = null) {
    if (this.isLoading) return;
    if (event.type === 'click') event.preventDefault();

    let newSortParams = null;
    let newActiveRuleLabel = null;

    if (specificRule) {
        newSortParams = { fieldIdOrName: specificRule.fieldIdOrName, direction: specificRule.direction };
        newActiveRuleLabel = specificRule.label;
    } else if (event.target && event.target.tagName === 'SELECT') {
        const selectElement = event.target;
        const selectedOptionText = selectElement.options[selectElement.selectedIndex]?.text?.trim();

        if (this.sortConfig.defaultSortLabel !== null && selectedOptionText === this.sortConfig.defaultSortLabel) {
            newSortParams = null;
            newActiveRuleLabel = this.sortConfig.defaultSortLabel;
        } else {
            const matchedRule = this.sortConfig.rules.find(rule => rule.label === selectedOptionText);
            if (matchedRule) {
                newSortParams = { fieldIdOrName: matchedRule.fieldIdOrName, direction: matchedRule.direction };
                newActiveRuleLabel = matchedRule.label;
            }
        }
    }

    const sortChanged = JSON.stringify(this.currentSortParams) !== JSON.stringify(newSortParams);

    if (sortChanged) {
        this.currentSortParams = newSortParams;
        console.log('[CF Sort] Установлены параметры сортировки:', this.currentSortParams);

        if (this.elements.sortControlElements.commonSelect) {
            const selectEl = this.elements.sortControlElements.commonSelect;
            let targetOptionFound = false;
            if (this.currentSortParams) {
                const activeRule = this.sortConfig.rules.find(r => 
                    r.fieldIdOrName === this.currentSortParams.fieldIdOrName && 
                    r.direction === this.currentSortParams.direction
                );
                if (activeRule) {
                    const optIndex = Array.from(selectEl.options).findIndex(opt => opt.text.trim() === activeRule.label);
                    if (optIndex !== -1) {
                        selectEl.selectedIndex = optIndex;
                        targetOptionFound = true;
                    }
                }
            }
            if (!targetOptionFound) {
                 if (this.sortConfig.defaultSortLabel !== null) {
                    const optIndex = Array.from(selectEl.options).findIndex(opt => opt.text.trim() === this.sortConfig.defaultSortLabel);
                    selectEl.selectedIndex = (optIndex !== -1) ? optIndex : 0;
                 } else {
                     selectEl.selectedIndex = 0;
                 }
            }
        }

        this.elements.sortControlElements.specificButtons?.forEach(item => {
            item.element.classList.remove('active-sort-option');
            if (this.currentSortParams && item.rule.label === newActiveRuleLabel) {
                item.element.classList.add('active-sort-option');
            }
        });
        
        if (this.sortConfig.applyInstantly || !this.elements.applyButton) {
            this.currentPage = 1; 
            this.fetchAndRenderItems(this.currentFilters, this.currentPage, false, false);
        } else {
            console.log('[CF Sort] Сортировка будет применена с фильтрами.');
        }
    }
}

            _bindEvents() {
              this.elements.applyButton?.addEventListener("click", () => this.applyFilters(false));
              this.elements.resetButton?.addEventListener("click", () => this.resetFilters());
              Object.entries(this.elements.clearButtons).forEach(([fId, btn]) => btn.addEventListener("click", (e) => this._handleClearFieldClick(e, fId)));
              if (!Array.isArray(this.config.fields)) return;
              this.config.fields.forEach((field) => {
                if (!field.elementSelector || !field.condition) return;
                const controls = this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;
                const isInstant = field.instantFilter;
                const handler = isInstant ? this.applyFiltersDebounced : () => {};
                switch (field.uiType) {
                  case UI_TYPES.INPUT:
                    const input = controls[0]; if (!input) break;
                    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (!isInstant) { if (this.applyFiltersDebounced.cancel) this.applyFiltersDebounced.cancel(); this.applyFilters(false); } } });
                    if (isInstant) input.addEventListener("input", handler);
                    break;
                  case UI_TYPES.SELECT: case UI_TYPES.CHECKBOX_SET:
                    controls.forEach((c) => (c.matches("input,select") ? c : c.querySelector("input,select"))?.addEventListener("change", handler));
                    break;
                  case UI_TYPES.RADIO:
                    controls.forEach((c) => { const radios = c.matches('input[type="radio"]') ? [c] : Array.from(c.querySelectorAll('input[type="radio"]')); radios.forEach((r) => r.addEventListener("change", handler)); });
                    break;
                  case UI_TYPES.BUTTONS:
                    const isTaptopTabs = controls[0].classList.contains("tabs__item");
                    controls.forEach((buttonOrTab) => buttonOrTab.addEventListener("click", (e) => {
                      if (this.isLoading) return;
                      if (!isTaptopTabs) { e.preventDefault(); controls.forEach((btn) => btn.classList.remove("tp-filter-button-active")); e.currentTarget.classList.add("tp-filter-button-active"); }
                      if (isInstant) handler();
                    }));
                    break;
                }
              });
            }

            applyFilters(isDebounced = false) {
              if (this.isLoading && isDebounced) { return; }
              if (this.isLoading && !isDebounced) { return; }

              this.currentPage = 1;
              this.currentFilters = this._collectFilterValues();
              this.fetchAndRenderItems(this.currentFilters, this.currentPage, false, true); 
            }

            resetFilters() {
              if (this.isLoading) return;
              if (!Array.isArray(this.config.fields)) return;
              this.config.fields.forEach((field) => {
                if (!field.elementSelector) return;
                const controls = this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;
                switch (field.uiType) {
                  case UI_TYPES.INPUT: controls[0].value = ""; break;
                  case UI_TYPES.SELECT: controls[0].selectedIndex = 0; break;
                  case UI_TYPES.RADIO: let firstRadio = true; controls.forEach((c) => { const radios = c.matches('input[type="radio"]') ? [c] : Array.from(c.querySelectorAll('input[type="radio"]')); radios.forEach((r) => { r.checked = firstRadio && field.firstIsAll; firstRadio = false; }); }); break;
                  case UI_TYPES.BUTTONS: const isTaptopTabs = controls[0].classList.contains("tabs__item"); if (isTaptopTabs) { controls.forEach((tab, i) => { const isActive = i === 0 && field.firstIsAll; tab.classList.toggle("is-opened", isActive); }); } else { controls.forEach((btn, i) => btn.classList.toggle("tp-filter-button-active", i === 0 && field.firstIsAll)); } break;
                  case UI_TYPES.CHECKBOX_SET: const cb = controls[0]?.querySelector('input[type="checkbox"]') || (controls[0]?.matches('input[type="checkbox"]') ? controls[0] : null); if (cb) cb.checked = false; break;
                  case UI_TYPES.CHECKBOX_GROUP: controls.forEach(control => { if (control.matches('input[type="checkbox"]')) { control.checked = false; } else { const checkboxes = control.querySelectorAll('input[type="checkbox"]'); checkboxes.forEach(cb => cb.checked = false); } }); break;
                  default: if ("value" in controls[0]) controls[0].value = ""; break;
                }
              });
              
              this.currentSortParams = null;
                 if (this.elements.sortControlElements.commonSelect) {
        let defaultOptionIndex = 0;
        if (this.sortConfig.defaultSortLabel !== null) {
            const optIndex = Array.from(this.elements.sortControlElements.commonSelect.options).findIndex(opt => opt.text.trim() === this.sortConfig.defaultSortLabel);
            defaultOptionIndex = (optIndex !== -1) ? optIndex : 0;
        } else if (this.elements.sortControlElements.commonSelect.options.length > 0) {
            const firstOptionText = this.elements.sortControlElements.commonSelect.options[0].text.trim();
            const firstOptionIsSpecificRule = this.sortConfig.rules.some(rule => rule.label === firstOptionText);
            if (!firstOptionIsSpecificRule) {
                 defaultOptionIndex = 0;
            }
        }
        this.elements.sortControlElements.commonSelect.selectedIndex = defaultOptionIndex;
    }
    this.elements.sortControlElements.specificButtons?.forEach(item => {
        item.element.classList.remove('active-sort-option');
    });
    console.log('[CF] Сортировка сброшена визуально и в состоянии.');
    
    this.currentPage = 1;
    this.currentFilters = { apiFilters: [], clientFilters: [] };
    this.fetchAndRenderItems(this.currentFilters, this.currentPage, false, true);
            }

            _handleClearFieldClick(event, fieldIdOrNameToClear) {
              event.preventDefault();
              if (this.isLoading || !fieldIdOrNameToClear) return;
              const fieldConfig = this.config.fields.find((f) => f.fieldIdOrName === fieldIdOrNameToClear);
              if (!fieldConfig || !fieldConfig.elementSelector) return;
              const controls = this.elements.filterControls[fieldIdOrNameToClear];
              if (!controls || controls.length === 0) return;
              switch (fieldConfig.uiType) {
                case UI_TYPES.INPUT: controls[0].value = ""; break;
                case UI_TYPES.SELECT: controls[0].selectedIndex = 0; break;
                case UI_TYPES.RADIO: const firstRadio = controls[0]?.querySelector('input[type="radio"]') || (controls[0]?.matches('input[type="radio"]') ? controls[0] : null); if (firstRadio && fieldConfig.firstIsAll) firstRadio.checked = true; else controls.forEach((c) => ((c.querySelector('input[type="radio"]') || c).checked = false)); break;
                case UI_TYPES.BUTTONS: const isTaptopTabs = controls[0].classList.contains("tabs__item"); if (isTaptopTabs) { controls.forEach((tab, i) => { const shouldBeActive = i === 0 && fieldConfig.firstIsAll; tab.classList.toggle("is-opened", shouldBeActive); }); } else { controls.forEach((btn, i) => btn.classList.toggle("tp-filter-button-active", i === 0 && fieldConfig.firstIsAll)); } break;
                case UI_TYPES.CHECKBOX_SET: const checkbox = controls[0]?.querySelector('input[type="checkbox"]') || (controls[0]?.matches('input[type="checkbox"]') ? controls[0] : null); if (checkbox) checkbox.checked = false; break;
                default: if ("value" in controls[0]) controls[0].value = ""; break;
              }
              if (fieldConfig?.instantFilter) this.applyFiltersDebounced();
              else if (this.elements.applyButton) console.log('[CF Clear] Требуется нажатие "Применить".');
              else this.applyFiltersDebounced();
            }

            _collectFilterValues() {
              const apiFilters = [];
              const clientFilters = [];
              if (!Array.isArray(this.config.fields)) return { apiFilters, clientFilters };
              this.config.fields.forEach((field) => {
                if (!field.elementSelector || !field.condition) return;
                const realFieldId = this._getRealFieldId(field.fieldIdOrName);
                if (!realFieldId) return;
                const controls = this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;
                let value = null, skipFilter = false;
                
                if (field.uiType === UI_TYPES.CHECKBOX_GROUP) {
                  const checkedValues = [];
                  controls.forEach(control => {
                    if (control.matches('input[type="checkbox"]') && control.checked) {
                      checkedValues.push((control.value || control.getAttribute('data-value') || '').trim());
                    } else {
                      const checkboxes = control.querySelectorAll('input[type="checkbox"]:checked');
                      checkboxes.forEach(cb => {
                        checkedValues.push((cb.value || cb.getAttribute('data-value') || '').trim());
                      });
                    }
                  });
                  if (checkedValues.length > 0) {
                    clientFilters.push({
                      fieldIdOrName: field.fieldIdOrName,
                      realFieldId: realFieldId,
                      values: checkedValues.filter(v => v !== ''),
                      logic: 'OR'
                    });
                  }
                  return;
                }
                
                switch (field.uiType) {
                  case UI_TYPES.INPUT: value = controls[0].value?.trim(); break;
                  case UI_TYPES.SELECT: value = controls[0].value?.trim(); skipFilter = controls[0].selectedIndex === 0 && field.firstIsAll; break;
                  case UI_TYPES.RADIO: let firstRadio = null, checkedRadio = null; for (const c of controls) { const radios = c.matches('input[type="radio"]') ? [c] : Array.from(c.querySelectorAll('input[type="radio"]')); if (!firstRadio && radios.length > 0) firstRadio = radios[0]; const checked = radios.find((i) => i.checked); if (checked) { checkedRadio = checked; break; } } value = checkedRadio ? checkedRadio.value?.trim() : null; skipFilter = checkedRadio === firstRadio && field.firstIsAll; break;
                  case UI_TYPES.BUTTONS: const isTaptopTabs = controls[0].classList.contains("tabs__item"); let firstBtnOrTab = controls[0], activeBtnOrTab = null; if (isTaptopTabs) { activeBtnOrTab = Array.from(controls).find((el) => el.classList.contains("is-opened")); if (activeBtnOrTab) { const titleEl = activeBtnOrTab.querySelector(".tabs__item-title"); value = titleEl ? titleEl.textContent?.trim() : activeBtnOrTab.textContent?.trim(); } else value = null; } else { activeBtnOrTab = Array.from(controls).find((el) => el.classList.contains("tp-filter-button-active")); if (activeBtnOrTab) { value = activeBtnOrTab.dataset.value?.trim() || activeBtnOrTab.textContent?.trim(); } else value = null; } skipFilter = activeBtnOrTab === firstBtnOrTab && field.firstIsAll; break;
                  case UI_TYPES.CHECKBOX_SET: let checkbox = null; if (controls[0]?.matches('input[type="checkbox"]')) checkbox = controls[0]; else if (controls[0]) checkbox = controls[0].querySelector('input[type="checkbox"]'); value = checkbox ? checkbox.checked : null; break;
                  default: if ("value" in controls[0]) value = controls[0].value?.trim(); else if ("checked" in controls[0]) value = controls[0].checked;
                }
                if (!skipFilter) {
                  if (field.uiType === UI_TYPES.CHECKBOX_SET) {
                    if (value === true) { apiFilters.push({ field_id: realFieldId, type: FILTER_TYPES.IS_ON }); }
                  } else {
                    const hasVal = value !== null && value !== "" && value !== false;
                    if (hasVal) { apiFilters.push({ field_id: realFieldId, type: field.condition, value: String(value) }); }
                  }
                }
              });
              return { apiFilters, clientFilters };
            }

            _applyClientSideFilters(items, clientFilters) {
              if (!clientFilters || clientFilters.length === 0) {
                return items;
              }

              return items.filter(item => {
                return clientFilters.every(filter => {
                  const realFieldId = filter.realFieldId;
                  
                  const itemField = item.fields?.find(f => f.field_id === realFieldId);
                  const fieldValue = itemField?.value || itemField?.text || '';

                  if (!fieldValue || typeof fieldValue !== 'string') {
                    return false;
                  }
                  
                  return filter.values.some(filterValue => 
                      fieldValue.toLowerCase().includes(filterValue.toLowerCase())
                  );
                });
              });
            }

            async fetchAndRenderItems(filters = [], page = 1, append = false, usePassedFiltersDirectly = false) {
              if (this.initialDataLoadPromise) {
                try { await this.initialDataLoadPromise; this.initialDataLoadPromise = null; } 
                catch (error) { console.error("[CF Fetch] Ошибка при ожидании initialDataLoadPromise:", error); this._showErrorMessage(\`Ошибка инициализации перед загрузкой данных: \${error.message}\`); this.isLoading = false; this._setLoadingState(false); return; }
              }
              if (!append && this.isLoading) { if (this.applyFiltersDebounced.cancel) this.applyFiltersDebounced.cancel(); if (this.fetchTimeout) clearTimeout(this.fetchTimeout); return; }
              if (append && this.isLoading) { return; }

              let activeFilterInputSelector = null;
              let activeFilterInputValue = '';
              let activeFilterInputSelectionStart = 0;
              let activeFilterInputSelectionEnd = 0;

              const focusedElement = document.activeElement;
              if (focusedElement && focusedElement.tagName === 'INPUT') {
                  const fieldConfig = this.config.fields.find(field => {
                      if (field.uiType === UI_TYPES.INPUT && field.elementSelector) {
                          const controls = this.elements.filterControls[field.fieldIdOrName];
                          return controls && controls[0] === focusedElement;
                      }
                      return false;
                  });

                  if (fieldConfig) {
                      activeFilterInputSelector = '.' + fieldConfig.elementSelector;
                      activeFilterInputValue = focusedElement.value;
                      try {
                          activeFilterInputSelectionStart = focusedElement.selectionStart;
                          activeFilterInputSelectionEnd = focusedElement.selectionEnd;
                      } catch (error) {
                          console.error("[CF Fetch] Ошибка при сохранении состояния инпута фильтрации:", error);
                      }  
                  }
              }

              this.isLoading = true;
              this._setLoadingState(true);
              if (!append) this.currentPage = page;
              if (this.fetchTimeout) clearTimeout(this.fetchTimeout);

              const filtersData = usePassedFiltersDirectly ? filters : this._collectFilterValues();
              const apiFilters = filtersData.apiFilters || (Array.isArray(filtersData) ? filtersData : []);
              const clientFilters = filtersData.clientFilters || [];
              
              const apiUrl = new URL(this.config.apiEndpoint, window.location.origin);
              apiUrl.searchParams.set('method', 'mosaic/collectionSearch');
              apiUrl.searchParams.set('param[collection_id]', this.config.collectionId);
              if (apiFilters.length > 0) apiUrl.searchParams.set('param[filters]', JSON.stringify(apiFilters));
              apiUrl.searchParams.set('param[page]', this.currentPage);
              apiUrl.searchParams.set('param[per_page]', this.config.itemsPerPage);

              if (this.currentSortParams && this.currentSortParams.fieldIdOrName) {
                  const sortField = this._getRealFieldId(this.currentSortParams.fieldIdOrName);
                  if (sortField) {
                      const sortParamValue = this.currentSortParams.direction === 'desc' ? \`^\${sortField}\` : sortField;
                      apiUrl.searchParams.set('param[sort]', JSON.stringify([sortParamValue]));
                  } else {
                      console.warn(\`[CF Fetch] Не удалось определить реальный ID для поля сортировки "\${this.currentSortParams.fieldIdOrName}". Сортировка не применена.\`);
                      apiUrl.searchParams.set('param[sort]', JSON.stringify([]));
                  }
              } else {
                  apiUrl.searchParams.set('param[sort]', JSON.stringify([])); 
              }
              
              const controller = new AbortController();
              this.fetchTimeout = setTimeout(() => { controller.abort(); console.warn("[CF Fetch] Таймаут запроса."); }, 15000);

              try {
                const response = await fetch(apiUrl, { signal: controller.signal });
                clearTimeout(this.fetchTimeout); this.fetchTimeout = null;
                if (!response.ok) throw new Error(\`Ошибка API collectionSearch: \${response.status}\`);
                const data = await response.json();
                if (data.error) throw new Error(\`Ошибка API collectionSearch: \${data.error.message}\`);
                const totalItems = data.result?.page?.all_items_count ?? 0;
                const itemsReceived = data.result?.page?.items || [];
                
                const finalItems = this._applyClientSideFilters(itemsReceived, clientFilters);
                
                this.latestTotalItemsCount = totalItems;
                this._renderResults(finalItems, append);
                this._renderPaginationControls(this.latestTotalItemsCount);
              } catch (error) {
                clearTimeout(this.fetchTimeout); this.fetchTimeout = null;
                console.error("[CF] Ошибка при загрузке данных:", error);
                if (error.name !== "AbortError") { this._showErrorMessage(\`Ошибка загрузки данных: \${error.message}\`); }
                else { this._showErrorMessage("Превышено время ожидания ответа от сервера."); }
                if (!append) this._renderPaginationControls(0);
              } finally {
                this.isLoading = false;
                this._setLoadingState(false);
                if (this.isInitialLoad) {
                  if (this.elements.widget) this.elements.widget.classList.add("cf-initialized");
                  this.isInitialLoad = false;
                }

                if (activeFilterInputSelector) {
                    requestAnimationFrame(() => {
                        const inputElementToRestore = document.querySelector(activeFilterInputSelector);
                        if (inputElementToRestore) {
                            if (inputElementToRestore.tagName === 'INPUT') {
                                inputElementToRestore.value = activeFilterInputValue;
                                inputElementToRestore.focus();
                                try {
                                    inputElementToRestore.setSelectionRange(activeFilterInputSelectionStart, activeFilterInputSelectionEnd);
                                } catch (e) { /* Игнорируем */ }
                            } 
                        } 
                    });
                }
              }
            }

            _setLoadingState(isLoading) {
              this.elements.widget?.classList.toggle("cf-loading", isLoading);
              Object.values(this.elements.filterControls).forEach((controls) => controls?.forEach((c) => { const i = c.matches("input,select,button") ? c : c.querySelector("input,select,button"); if (i) i.disabled = isLoading; }));
              Object.values(this.elements.clearButtons).forEach((btn) => (btn.disabled = isLoading));
              if (this.elements.applyButton) this.elements.applyButton.disabled = isLoading;
              if (this.elements.resetButton) this.elements.resetButton.disabled = isLoading;
              if (this.elements.customPagination.prevButton) this.elements.customPagination.prevButton.disabled = isLoading || this.currentPage <= 1;
              if (this.elements.customPagination.nextButton) this.elements.customPagination.nextButton.disabled = isLoading || this.currentPage >= this.totalPages;
              if (this.elements.customPagination.loadMoreButton) this.elements.customPagination.loadMoreButton.disabled = isLoading || this.currentPage >= this.totalPages;
              this.elements.taptopPaginationContainer?.querySelectorAll(".cf-pagination__number[data-page]").forEach((el) => (el.style.pointerEvents = isLoading ? "none" : ""));
              if (this.config.showLoader && this.elements.loaderOverlay) { this.elements.loaderOverlay.classList.toggle("is-active", isLoading); }
              if (isLoading) this.elements.widget?.querySelector(".cf-error-message")?.remove();
              
              if (this.elements.sortControlElements.commonSelect) {
                  this.elements.sortControlElements.commonSelect.disabled = isLoading;
              }
              this.elements.sortControlElements.specificButtons?.forEach(item => {
                  item.element.style.pointerEvents = isLoading ? 'none' : '';
              });
            }

            _formatDate(dateValue) {
              if (!dateValue || (typeof dateValue !== "string" && typeof dateValue !== "number")) return "";
              try {
                let date;
                if (typeof dateValue === "number" || /^\\d{10,}$/.test(String(dateValue))) {
                  const numValue = Number(dateValue);
                  date = new Date(numValue < 10000000000 ? numValue * 1000 : numValue);
                } else if (typeof dateValue === "string") {
                  const partsDMY = dateValue.match(/^(\\d{1,2})[./-](\\d{1,2})[./-](\\d{4})$/);
                  const partsYMD = dateValue.match(/^(\\d{4})[./-](\\d{1,2})[./-](\\d{1,2})$/);
                  if (partsDMY) { const day = parseInt(partsDMY[1], 10); const month = parseInt(partsDMY[2], 10) - 1; const year = parseInt(partsDMY[3], 10); date = new Date(Date.UTC(year, month, day)); if (isNaN(date.getTime()) || date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) date = new Date(NaN); }
                  else if (partsYMD) { const year = parseInt(partsYMD[1], 10); const month = parseInt(partsYMD[2], 10) - 1; const day = parseInt(partsYMD[3], 10); date = new Date(Date.UTC(year, month, day)); if (isNaN(date.getTime()) || date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) date = new Date(NaN); }
                  else { date = new Date(dateValue); }
                } else { date = new Date(NaN); }
                if (isNaN(date.getTime())) { return String(dateValue); }
                const dayF = String(date.getUTCDate()).padStart(2, "0");
                const monthF = String(date.getUTCMonth() + 1).padStart(2, "0");
                const yearF = date.getUTCFullYear();
                return \`\${dayF}.\${monthF}.\${yearF}\`;
              } catch (e) { console.error("[CF FormatDate] Ошибка форматирования даты:", dateValue, e); return String(dateValue); }
            }

            _renderResults(items = [], append = false) {
              if (!this.elements.targetContainer) { this._showErrorMessage("Ошибка отображения: не найден контейнер для элементов."); return; }
              this.elements.widget?.querySelector(".cf-error-message")?.remove();
              if (!append) { this.elements.targetContainer.innerHTML = ""; }
              if (items.length === 0 && !append) {
                if (this.elements.notFoundElement) { this.elements.notFoundElement.classList.remove("is-removed"); } 
                else { this.elements.targetContainer.innerHTML = '<p style="text-align:center;padding:20px;color:#555;">Ничего не найдено.</p>'; }
                return;
              } else if (items.length > 0) {
                if (this.elements.notFoundElement) this.elements.notFoundElement.classList.add("is-removed");
              }
              if (!this.itemTemplateString) { this._showErrorMessage("Ошибка отображения: отсутствует шаблон элемента."); return; }
              const fragment = document.createDocumentFragment();
              let renderedCount = 0;
              items.forEach((item) => { const el = this._renderSingleItem(item); if (el) { fragment.appendChild(el); renderedCount++; } });
              if (renderedCount > 0) { this.elements.targetContainer.appendChild(fragment); } 
              else if (items.length > 0) {
                this._showErrorMessage("Проблема с отображением элементов. Возможно, шаблон или данные несовместимы.");
                if (this.elements.notFoundElement && !append) { this.elements.notFoundElement.classList.remove("is-removed"); }
              }
            }

            _renderSingleItem(apiItemData) {
              if (!this.itemTemplateString) return null;
              if (!apiItemData || typeof apiItemData !== "object" || (!apiItemData.fields && apiItemData.title === undefined && apiItemData.slug === undefined)) {
                console.warn("[CF Render] Отсутствуют или некорректные данные для элемента (apiItemData).", apiItemData); return null;
              }
              let itemHtml = this.itemTemplateString.replace(/&amp;#123;|&#123;|&lbrace;/g, "{").replace(/&amp;#125;|&#125;|&rbrace;/g, "}");
              const itemValues = {};
              if (Array.isArray(apiItemData.fields)) {
                apiItemData.fields.forEach((field) => { if (field && field.field_id) itemValues[field.field_id] = field; });
              }
              if (apiItemData.hasOwnProperty("title")) itemValues.title = { value: apiItemData.title, _isSystem: true };
              if (apiItemData.hasOwnProperty("slug")) itemValues.slug = { field_id: "slug", url: apiItemData.slug };
              
              try {
                itemHtml = itemHtml.replace(/\\{\\$item\\.([\\w.]+)\\}/g, (match, fullPath) => {
                  const pathParts = fullPath.split(".");
                  const fieldKey = pathParts[0];
                  const dataNode = itemValues[fieldKey];
                  let valueForFormatting = undefined;
                  if (dataNode !== undefined) {
                    if (pathParts.length === 1) {
                      if (fieldKey === "title" && dataNode.hasOwnProperty("title") && typeof dataNode.title === "string") valueForFormatting = dataNode.title;
                      else if (fieldKey === "slug" && dataNode.hasOwnProperty("url") && typeof dataNode.url === "string") valueForFormatting = dataNode.url;
                      else if (dataNode.hasOwnProperty("text")) valueForFormatting = dataNode.text;
                      else if (dataNode.hasOwnProperty("number")) valueForFormatting = dataNode.number;
                      else if (dataNode.hasOwnProperty("value")) valueForFormatting = dataNode.value;
                      else if (dataNode.hasOwnProperty("date_time")) valueForFormatting = dataNode.date_time;
                      else if (dataNode.hasOwnProperty("rich_text")) valueForFormatting = dataNode.rich_text;
                      else if (dataNode.hasOwnProperty("link")) valueForFormatting = dataNode.link;
                      else if (dataNode.image && dataNode.image.hasOwnProperty("src")) valueForFormatting = dataNode.image.src;
                    } else {
                      let currentContext = dataNode;
                      for (let i = 1; i < pathParts.length; i++) {
                        const subKey = pathParts[i];
                        if (i === 1 && currentContext.hasOwnProperty("image") && typeof currentContext.image === "object" && currentContext.image !== null && currentContext.image.hasOwnProperty(subKey)) {
                          currentContext = currentContext.image[subKey];
                        } else if (currentContext && typeof currentContext === "object" && currentContext.hasOwnProperty(subKey)) {
                          currentContext = currentContext[subKey];
                        } else { currentContext = undefined; break; }
                      }
                      valueForFormatting = currentContext;
                    }
                  }
                  let replacementValue = "";
                  if (valueForFormatting !== undefined && valueForFormatting !== null) {
                    const fieldSchemaInfo = this.schema ? [...(this.schema.c_schema || []), ...(this.schema.settings || [])].find((f) => f.id === fieldKey) : null;
                    const isSystemSlugPlaceholder = fieldKey === "slug" && match === "{$item.slug}";
                    if (isSystemSlugPlaceholder && this.collectionSlug && typeof valueForFormatting === "string") {
                      const elementSlugClean = valueForFormatting.replace(/^\\/+|\\/+$/g, "");
                      if (elementSlugClean) replacementValue = \`/\${this.collectionSlug}/\${elementSlugClean}\`;
                      else replacementValue = "";
                    } else if (fieldSchemaInfo && fieldSchemaInfo.type === "date" && (typeof valueForFormatting === "number" || typeof valueForFormatting === "string")) {
                      replacementValue = this._formatDate(valueForFormatting);
                    } else if (fieldSchemaInfo && fieldSchemaInfo.type === "switcher") {
                      replacementValue = String(valueForFormatting === true || String(valueForFormatting).toLowerCase() === "true" || String(valueForFormatting) === "1");
                    } else if (typeof valueForFormatting === "object" && !(fieldSchemaInfo && fieldSchemaInfo.type === "rich_text")) {
                      replacementValue = "";
                    } else {
                      replacementValue = String(valueForFormatting);
                    }
                  }
                  return replacementValue;
                });
              } catch (e) { console.error("[CF Render] Ошибка во время замены плейсхолдеров:", e, "HTML:", itemHtml, "Data:", apiItemData); return null; }
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = itemHtml.trim();
              if (tempDiv.firstChild && tempDiv.firstChild.nodeType === Node.ELEMENT_NODE) return tempDiv.firstChild;
              if (tempDiv.childNodes.length > 0) { const wrapperDiv = document.createElement("div"); while (tempDiv.firstChild) wrapperDiv.appendChild(tempDiv.firstChild); return wrapperDiv; }
              return null;
            }

            _renderPaginationControls(totalItems) {
              const container = this.elements.taptopPaginationContainer;
              if (!container) return;
              container.querySelectorAll(".cf-pagination__button, .cf-pagination__info, .cf-pagination__numbers, .cf-pagination__number, .cf-pagination__ellipsis").forEach((el) => el.remove());
              this.elements.customPagination = {};
              this.totalPages = Math.ceil(totalItems / this.config.itemsPerPage);
              const showPagination = this.totalPages > 1 && this.config.paginationType !== "none";
              container.classList.toggle("is-removed", !showPagination);
              if (!showPagination) return;
              const isFirst = this.currentPage <= 1;
              const isLast = this.currentPage >= this.totalPages;
              const createButton = (text, direction, disabled, cssClass) => { const btn = document.createElement("button"); btn.type = "button"; btn.className = \`cf-pagination__button \${cssClass}\`; btn.textContent = text; btn.disabled = disabled || this.isLoading; btn.dataset.direction = direction; return btn; };
              const createPageNumber = (page) => { const el = document.createElement(page === this.currentPage ? "span" : "a"); el.className = "cf-pagination__number"; el.textContent = page; if (page === this.currentPage) el.classList.add("is-active"); else { el.href = "#"; el.dataset.page = page; } el.setAttribute("aria-label", \`Страница \${page}\`); if (page === this.currentPage) el.setAttribute("aria-current", "page"); return el; };
              const createEllipsis = () => { const el = document.createElement("span"); el.className = "cf-pagination__ellipsis"; el.textContent = "..."; return el; };
              if (this.config.paginationType === "prev_next") { const prev = createButton("Назад", "-1", isFirst, "cf-pagination__prev"); const next = createButton("Вперед", "1", isLast, "cf-pagination__next"); const info = document.createElement("span"); info.className = "cf-pagination__info"; info.textContent = \`\${this.currentPage} / \${this.totalPages}\`; container.appendChild(prev); container.appendChild(info); container.appendChild(next); this.elements.customPagination = { prevButton: prev, nextButton: next }; }
              else if (this.config.paginationType === "load_more") { if (!isLast) { const loadMore = createButton("Загрузить еще", "+1", this.isLoading, "cf-pagination__load-more"); loadMore.dataset.action = "load_more"; container.appendChild(loadMore); this.elements.customPagination.loadMoreButton = loadMore; } }
              else if (this.config.paginationType === "numbers") { const prev = createButton("‹", "-1", isFirst, "cf-pagination__prev"); const next = createButton("›", "1", isLast, "cf-pagination__next"); container.appendChild(prev); const numbersContainer = document.createElement("span"); numbersContainer.className = "cf-pagination__numbers"; const maxVisible = 5; const sideCount = Math.floor((maxVisible - 3) / 2); const showEllipsisThreshold = maxVisible - 1; if (this.totalPages <= showEllipsisThreshold + 2) { for (let i = 1; i <= this.totalPages; i++) numbersContainer.appendChild(createPageNumber(i)); } else { numbersContainer.appendChild(createPageNumber(1)); if (this.currentPage > sideCount + 2) numbersContainer.appendChild(createEllipsis()); const start = Math.max(2, this.currentPage - sideCount); const end = Math.min(this.totalPages - 1, this.currentPage + sideCount); for (let i = start; i <= end; i++) numbersContainer.appendChild(createPageNumber(i)); if (this.currentPage < this.totalPages - sideCount - 1) numbersContainer.appendChild(createEllipsis()); numbersContainer.appendChild(createPageNumber(this.totalPages)); } container.appendChild(numbersContainer); container.appendChild(next); this.elements.customPagination = { prevButton: prev, nextButton: next }; }
            }

            _handleCustomPaginationClick(event) {
              const button = event.target.closest(".cf-pagination__button");
              const pageLink = event.target.closest(".cf-pagination__number[data-page]");
              if ((!button && !pageLink) || this.isLoading) return;
              event.preventDefault();
              let newPage = this.currentPage; let appendResults = false;
              if (button) { const action = button.dataset.action; const direction = parseInt(button.dataset.direction, 10); if (action === "load_more") { newPage = this.currentPage + 1; appendResults = true; } else if (!isNaN(direction)) { newPage = this.currentPage + direction; } else return; }
              else if (pageLink) { newPage = parseInt(pageLink.dataset.page, 10); if (isNaN(newPage)) return; } else return;
              newPage = Math.max(1, Math.min(newPage, this.totalPages));
              if (newPage !== this.currentPage || appendResults) {
                if (appendResults) { this.currentPage = newPage; this.fetchAndRenderItems(this.currentFilters, newPage, true, false); }
                else { this.fetchAndRenderItems(this.currentFilters, newPage, false, false); }
              }
            }

            _showErrorMessage(message) {
              const cssClass = "cf-error-message";
              let div = this.elements.widget?.querySelector("." + cssClass);
              if (!div && this.elements.widget) { div = document.createElement("div"); div.className = cssClass; const beforeEl = this.elements.targetContainer || this.elements.widget.firstChild; this.elements.widget.insertBefore(div, beforeEl); }
              if (div) div.textContent = message;
            }
          }

          try {
            const filterInstance = new TaptopCollectionFilter(${runtimeConfigJSON});
            await filterInstance._init();
          } catch (e) {
            console.error("[CF] Критическая ошибка инициализации фильтра:", e);
            const widget = document.querySelector(".${
              settings.targetSelector || "collection"
            }");
            if (widget) {
              const errorDiv = document.createElement("div");
              errorDiv.className = "cf-error-message";
              errorDiv.textContent = \`Ошибка инициализации скрипта фильтра: \${e.message}. Проверьте настройки генератора и консоль браузера (F12).\`;
              const beforeEl = widget.querySelector(".collection__list") || widget.firstChild;
              widget.insertBefore(errorDiv, beforeEl);
            }
          }
        });
      </script>
  `;
    return scriptCode;
  }

  // Enhanced минификация - встроенная версия для максимального сжатия
  async enhancedMinify(code) {
    // Separate style, script and other content
    const parts = this.parseCode(code);

    // Minify each part
    const minifiedCSS = parts.css ? this.minifyCSS(parts.css) : "";
    const minifiedJS = parts.js ? await this.minifyJS(parts.js) : "";
    const minifiedHTML = parts.html ? this.minifyHTML(parts.html) : "";

    // Combine back
    let result = "";
    if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
    if (minifiedJS) result += `<script>${minifiedJS}</script>`;
    if (minifiedHTML) result += minifiedHTML;

    return result;
  }

  async minifyJS(jsCode) {
    if (!jsCode) return "";

    try {
      // Load Terser from CDN if not already loaded
      if (typeof Terser === "undefined") {
        await this.loadTerser();
      }

      const result = await Terser.minify(jsCode, {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: [],
          passes: 2,
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
      });

      return result.code || jsCode;
    } catch (error) {
      console.warn("Terser minification failed, using fallback:", error);
      return this.minifyJSAggressive(jsCode);
    }
  }

  loadTerser() {
    return new Promise((resolve, reject) => {
      if (typeof Terser !== "undefined") {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/terser@5.43.0/dist/bundle.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Terser"));
      document.head.appendChild(script);
    });
  }

  parseCode(code) {
    const result = { css: "", js: "", html: "" };

    // Extract CSS from <style> tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(code)) !== null) {
      result.css += styleMatch[1];
    }

    // Extract JS from <script> tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(code)) !== null) {
      result.js += scriptMatch[1];
    }

    // Remove style and script tags for HTML part
    result.html = code
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .trim();

    return result;
  }

  minifyCSS(css) {
    return (
      css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Remove unnecessary whitespace
        .replace(/\s+/g, " ")
        // Remove spaces around symbols
        .replace(/\s*([{}:;,>+~])\s*/g, "$1")
        // Remove trailing semicolons before }
        .replace(/;}/g, "}")
        // Remove spaces around parentheses
        .replace(/\s*\(\s*/g, "(")
        .replace(/\s*\)\s*/g, ")")
        // Compress color values
        .replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, "#$1$2$3")
        // Remove quotes from font names when possible
        .replace(/font-family:\s*["']([^"',]+)["']/g, "font-family:$1")
        .trim()
    );
  }

  minifyHTML(html) {
    if (!html) return "";

    return (
      html
        // Remove comments
        .replace(/<!--[\s\S]*?-->/g, "")
        // Collapse whitespace
        .replace(/>\s+</g, "><")
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  minifyJSAggressive(js) {
    // More aggressive JS minification
    let minified = js;

    // Remove comments (single and multi-line)
    minified = this.removeComments(minified);

    // Simplify variable declarations and assignments
    minified = this.simplifyDeclarations(minified);

    // Compress object and array literals
    minified = this.compressLiterals(minified);

    // Remove unnecessary semicolons and whitespace
    minified = this.cleanupWhitespace(minified);

    // Shorten common patterns
    minified = this.shortenPatterns(minified);

    return minified;
  }

  removeComments(code) {
    let result = "";
    let inString = false;
    let stringChar = "";
    let inBlockComment = false;
    let inLineComment = false;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const next = code[i + 1] || "";

      // Handle strings
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

      // Handle comments
      if (!inString) {
        if (!inBlockComment && !inLineComment && char === "/" && next === "*") {
          inBlockComment = true;
          i++; // skip next char
          continue;
        } else if (inBlockComment && char === "*" && next === "/") {
          inBlockComment = false;
          i++; // skip next char
          continue;
        } else if (
          !inBlockComment &&
          !inLineComment &&
          char === "/" &&
          next === "/"
        ) {
          inLineComment = true;
          i++; // skip next char
          continue;
        } else if (inLineComment && (char === "\n" || char === "\r")) {
          inLineComment = false;
          result += char; // keep newline to prevent syntax errors
          continue;
        }
      }

      // Add character if not in comment
      if (!inBlockComment && !inLineComment) {
        result += char;
      }
    }

    return result;
  }

  simplifyDeclarations(code) {
    // Convert function declarations to expressions where possible
    code = code.replace(
      /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
      "function $1("
    );

    // Simplify const/let/var declarations
    code = code.replace(
      /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g,
      "const $1="
    );
    code = code.replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "let $1=");
    code = code.replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "var $1=");

    return code;
  }

  compressLiterals(code) {
    // Remove spaces in object literals
    code = code.replace(/{\s*([^}]+)\s*}/g, (match, content) => {
      const compressed = content
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*,\s*/g, ",");
      return `{${compressed}}`;
    });

    // Remove spaces in array literals
    code = code.replace(/\[\s*([^\]]+)\s*\]/g, (match, content) => {
      const compressed = content.replace(/\s*,\s*/g, ",");
      return `[${compressed}]`;
    });

    return code;
  }

  cleanupWhitespace(code) {
    // Remove unnecessary whitespace while preserving syntax
    return (
      code
        // Remove spaces around operators
        .replace(/\s*([=+\-*/%<>&|!])\s*/g, "$1")
        .replace(/\s*([(){}[\];,])\s*/g, "$1")
        // Remove multiple whitespace
        .replace(/\s+/g, " ")
        // Remove spaces after keywords
        .replace(
          /\b(if|for|while|switch|catch|function|class|return|throw|new|typeof|instanceof)\s+/g,
          "$1 "
        )
        // Keep space after 'else'
        .replace(/\belse\s+/g, "else ")
        // Remove trailing spaces and empty lines
        .replace(/\s*\n\s*/g, "\n")
        .replace(/\n+/g, "\n")
        .trim()
    );
  }

  shortenPatterns(code) {
    // Shorten common patterns
    code = code.replace(
      /document\.addEventListener/g,
      "document.addEventListener"
    );
    code = code.replace(/console\.log/g, "console.log");
    code = code.replace(/document\.querySelector/g, "document.querySelector");
    code = code.replace(
      /document\.querySelectorAll/g,
      "document.querySelectorAll"
    );

    // Compress true/false to !0/!1 where safe
    code = code.replace(/\btrue\b/g, "!0");
    code = code.replace(/\bfalse\b/g, "!1");

    // Compress undefined to void 0
    code = code.replace(/\bundefined\b/g, "void 0");

    return code;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      throw new Error("Не удалось скопировать код в буфер обмена");
    }
  }

  showSuccessPopup() {
    const popup = document.querySelector(".pop-up-success");
    if (popup) {
      popup.style.display = "flex";

      const closeHandler = () => {
        popup.style.display = "none";
        popup.removeEventListener("click", closeHandler);
      };

      popup.addEventListener("click", closeHandler);
      this.eventHandlers.set("popup_close", closeHandler);
    }
  }

  unbindEvents() {
    this.eventHandlers.forEach((handler, key) => {
      const [elementKey, eventType] = key.split("_");
      if (this.elements[elementKey]) {
        this.elements[elementKey].removeEventListener(eventType, handler);
      }
    });
    this.eventHandlers.clear();
  }

  destroy() {
    this.unbindEvents();
    this.elements = {};
    this.filterRules = [];
    this.sortRules = [];
  }
}

// Регистрируем веб-компонент
customElements.define("collection-filter-generator", CollectionFilterGenerator);
