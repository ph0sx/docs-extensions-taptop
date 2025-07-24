// Counter Generator Web Component для Taptop
class CounterGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.elements = {};
    this.eventHandlers = new Map();
    this.initialized = false;
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

      .counter-generator {
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
        overflow: auto; /* Изменить с scroll на auto */
        /* Добавить эти свойства: */
        min-height: 0; /* Предотвращает flex overflow */
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
        display: flex;
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

      .helper-text {
        font-size: 13px;
        color: var(--text-light);
        margin-top: 5px;
        line-height: 1.4;
      }

      .required-indicator {
        color: #e74c3c;
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

      .conditional-field {
        margin-top: 10px;
        transition: all 0.3s ease;
      }

      .conditional-field.hidden {
        display: none;
      }
    `;
  }

  getTemplate() {
    return `
      <div class="counter-generator">
        <div class="form-grid">
          <div class="section-title">1. Целевой элемент и значения</div>
          
          <div class="setting-group">
            <label for="target-class">CSS-класс целевого элемента <span class="required-indicator">*</span></label>
            <input type="text" id="target-class" class="text-input" placeholder="Например: my-counter" required>
            <div class="helper-text">Класс элемента, где будет счетчик</div>
          </div>

          <div class="setting-group">
            <label for="start-value">Начальное значение</label>
            <input type="number" id="start-value" class="number-input" value="0">
            <div class="helper-text">Число, с которого начнется анимация</div>
          </div>

          <div class="setting-group">
            <label for="end-value">Конечное значение <span class="required-indicator">*</span></label>
            <input type="number" id="end-value" class="number-input" value="1000" required>
            <div class="helper-text">Число, на котором анимация остановится</div>
          </div>

          <div class="section-title">2. Анимация</div>

          <div class="setting-group">
            <label for="duration">Длительность анимации (мс)</label>
            <input type="number" id="duration" class="number-input" value="2000" min="100" step="100">
            <div class="helper-text">Время в миллисекундах. 1000мс = 1 секунда</div>
          </div>

          <div class="setting-group">
            <label for="delay">Задержка перед стартом (мс)</label>
            <input type="number" id="delay" class="number-input" value="0" min="0" step="100">
            <div class="helper-text">Пауза перед началом анимации в миллисекундах</div>
          </div>

          <div class="setting-group">
            <label for="easing">Функция плавности</label>
            <select id="easing" class="select-styled">
              <option value="easeOutQuad" selected>Ease Out Quad (стандарт)</option>
              <option value="linear">Linear</option>
              <option value="easeInQuad">Ease In Quad</option>
              <option value="easeInOutQuad">Ease In Out Quad</option>
              <option value="easeInCubic">Ease In Cubic</option>
              <option value="easeOutCubic">Ease Out Cubic</option>
              <option value="easeInOutCubic">Ease In Out Cubic</option>
              <option value="easeInQuart">Ease In Quart</option>
              <option value="easeOutQuart">Ease Out Quart</option>
              <option value="easeInOutQuart">Ease In Out Quart</option>
              <option value="easeInQuint">Ease In Quint</option>
              <option value="easeOutQuint">Ease Out Quint</option>
              <option value="easeInOutQuint">Ease In Out Quint</option>
              <option value="easeInSine">Ease In Sine</option>
              <option value="easeOutSine">Ease Out Sine</option>
              <option value="easeInOutSine">Ease In Out Sine</option>
              <option value="easeInExpo">Ease In Expo</option>
              <option value="easeOutExpo">Ease Out Expo</option>
              <option value="easeInOutExpo">Ease In Out Expo</option>
              <option value="easeInCirc">Ease In Circ</option>
              <option value="easeOutCirc">Ease Out Circ</option>
              <option value="easeInOutCirc">Ease In Out Circ</option>
            </select>
            <div class="helper-text">Определяет характер ускорения/замедления анимации. Недоступно при эффекте одометра</div>
          </div>

          <div class="section-title">3. Форматирование и отображение</div>

          <div class="setting-group">
            <label for="prefix">Текстовый префикс</label>
            <input type="text" id="prefix" class="text-input" placeholder="Например: $ или +">
            <div class="helper-text">Текст, отображаемый перед числом</div>
          </div>

          <div class="setting-group">
            <label for="suffix">Текстовый суффикс</label>
            <input type="text" id="suffix" class="text-input" placeholder="Например: + или %">
            <div class="helper-text">Текст, отображаемый после числа</div>
          </div>

          <div class="setting-group">
            <label for="decimals">Количество десятичных знаков</label>
            <input type="number" id="decimals" class="number-input" value="0" min="0" max="5" step="1">
            <div class="helper-text">Сколько знаков показывать после точки (0-5)</div>
          </div>

          <div class="setting-group">
            <label class="checkbox-container">
              <input type="checkbox" id="use-separator">
              <span class="checkbox-option-label">Использовать разделитель тысяч</span>
            </label>
            <div class="helper-text">Разделяет группы разрядов для лучшей читаемости</div>
          </div>

          <div class="setting-group conditional-field hidden" id="separator-field">
            <label for="separator-symbol">Символ разделителя тысяч</label>
            <select id="separator-symbol" class="select-styled">
              <option value="," selected>Запятая (,)</option>
              <option value=" ">Пробел ( )</option>
              <option value=".">Точка (.)</option>
            </select>
            <div class="helper-text">Выберите символ для разделения</div>
          </div>

          <div class="section-title">4. Поведение</div>

          <div class="setting-group">
            <label class="checkbox-container">
              <input type="checkbox" id="play-on-view" checked>
              <span class="checkbox-option-label">Запуск при появлении в области видимости</span>
            </label>
            <div class="helper-text">Анимация начнется, когда счетчик станет виден на экране</div>
          </div>

          <div class="setting-group">
            <label class="checkbox-container">
              <input type="checkbox" id="loop">
              <span class="checkbox-option-label">Повторять анимацию (циклично)</span>
            </label>
            <div class="helper-text">Анимация будет бесконечно повторяться</div>
          </div>

          <div class="setting-group">
            <label class="checkbox-container">
              <input type="checkbox" id="odometer-effect">
              <span class="checkbox-option-label">Эффект "Одометра" (прокрутка цифр)</span>
            </label>
            <div class="helper-text">Создает эффект перелистывания отдельных цифр</div>
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
    this.elements.codeOutput = this.shadowRoot.getElementById("code-output");

    // Форма
    this.elements.targetClass = this.shadowRoot.getElementById("target-class");
    this.elements.startValue = this.shadowRoot.getElementById("start-value");
    this.elements.endValue = this.shadowRoot.getElementById("end-value");
    this.elements.duration = this.shadowRoot.getElementById("duration");
    this.elements.delay = this.shadowRoot.getElementById("delay");
    this.elements.easing = this.shadowRoot.getElementById("easing");
    this.elements.prefix = this.shadowRoot.getElementById("prefix");
    this.elements.suffix = this.shadowRoot.getElementById("suffix");
    this.elements.decimals = this.shadowRoot.getElementById("decimals");
    this.elements.useSeparator =
      this.shadowRoot.getElementById("use-separator");
    this.elements.separatorSymbol =
      this.shadowRoot.getElementById("separator-symbol");
    this.elements.playOnView = this.shadowRoot.getElementById("play-on-view");
    this.elements.loop = this.shadowRoot.getElementById("loop");
    this.elements.odometerEffect =
      this.shadowRoot.getElementById("odometer-effect");
    this.elements.separatorField =
      this.shadowRoot.getElementById("separator-field");

    // Внешние элементы модалки будут искаться динамически в showSuccessPopup()
  }

  bindEvents() {
    // Обработчик для кнопки генерации
    if (this.elements.generateBtn) {
      const handler = () => this.generateCode();
      this.eventHandlers.set("generate", handler);
      this.elements.generateBtn.addEventListener("click", handler);
    }

    // Условное отображение поля разделителя
    if (this.elements.useSeparator) {
      const handler = () => this.toggleSeparatorField();
      this.eventHandlers.set("separator-toggle", handler);
      this.elements.useSeparator.addEventListener("change", handler);
    }

    // Отключение easing при одометре
    if (this.elements.odometerEffect) {
      const handler = () => this.toggleEasingField();
      this.eventHandlers.set("odometer-toggle", handler);
      this.elements.odometerEffect.addEventListener("change", handler);
    }

    // Обработчики модального окна теперь привязываются динамически в showSuccessPopup()
  }

  // bindModalEvents() удален - обработчики теперь привязываются динамически в showSuccessPopup()

  toggleSeparatorField() {
    if (this.elements.useSeparator.checked) {
      this.elements.separatorField.classList.remove("hidden");
    } else {
      this.elements.separatorField.classList.add("hidden");
    }
  }

  toggleEasingField() {
    if (this.elements.odometerEffect.checked) {
      this.elements.easing.disabled = true;
      this.elements.easing.style.opacity = "0.5";
    } else {
      this.elements.easing.disabled = false;
      this.elements.easing.style.opacity = "1";
    }
  }

  collectData() {
    const targetClass = this.elements.targetClass.value.trim();
    const endValue = parseFloat(this.elements.endValue.value);

    // Валидация обязательных полей
    if (!targetClass) {
      alert("Пожалуйста, укажите CSS-класс целевого элемента");
      return null;
    }

    if (isNaN(endValue)) {
      alert("Пожалуйста, укажите корректное конечное значение");
      return null;
    }

    // Дополнительная валидация значений
    const duration = parseInt(this.elements.duration.value) || 2000;
    if (duration < 100) {
      alert("Длительность анимации должна быть не менее 100 мс");
      return null;
    }

    return {
      targetClass: targetClass,
      startValue: parseFloat(this.elements.startValue.value) || 0,
      endValue: endValue,
      duration: duration,
      delay: parseInt(this.elements.delay.value) || 0,
      easing: this.elements.easing.value || "easeOutQuad",
      prefix: this.elements.prefix.value || "",
      suffix: this.elements.suffix.value || "",
      decimals: parseInt(this.elements.decimals.value) || 0,
      useThousandsSeparator: this.elements.useSeparator.checked,
      thousandsSeparator: this.elements.separatorSymbol.value || ",",
      playOnView: this.elements.playOnView.checked,
      loop: this.elements.loop.checked,
      odometerEffect: this.elements.odometerEffect.checked,
    };
  }

  async generateCode() {
    try {
      const data = this.collectData();
      if (!data) return;

      const rawCode = this.generateCounterCode(data);
      const code = await this.minifyGeneratedCode(rawCode);

      if (this.elements.codeOutput) {
        this.elements.codeOutput.textContent = code;
      }

      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (error) {
      console.error("Ошибка генерации кода:", error);
    }
  }

  // Минификация генерируемого кода
  async minifyGeneratedCode(code) {
    try {
      // Парсим код на части
      const parts = this.parseGeneratedCode(code);

      // Минифицируем каждую часть
      const minifiedCSS = parts.css ? this.minifyCSS(parts.css) : "";
      const minifiedJS = parts.js ? this.minifyJS(parts.js) : "";
      const minifiedHTML = parts.html ? this.minifyHTML(parts.html) : "";

      // Собираем обратно
      let result = "";
      if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
      if (minifiedJS) result += `<script>${minifiedJS}</script>`;
      if (minifiedHTML) result += minifiedHTML;

      return result;
    } catch (error) {
      console.warn('Минификация генерируемого кода не удалась, используем оригинал:', error);
      return code;
    }
  }

  parseGeneratedCode(code) {
    const result = { css: "", js: "", html: "" };

    // Извлекаем CSS из <style> тегов
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(code)) !== null) {
      result.css += match[1];
    }

    // Извлекаем JS из <script> тегов
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(code)) !== null) {
      result.js += match[1];
    }

    // Убираем style и script теги для HTML части
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

    // Удаляем комментарии
    minified = this.removeJSComments(minified);

    // Упрощаем объявления переменных
    minified = minified
      .replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "const $1=")
      .replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "let $1=")
      .replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "var $1=");

    // Безопасная обработка простых массивов (только если содержимое простое)
    minified = minified
      .replace(/\[\s*([0-9,\s.]+)\s*\]/g, (match, content) => {
        const compressed = content.replace(/\s*,\s*/g, ",").replace(/\s+/g, "");
        return `[${compressed}]`;
      });

    // Безопасная обработка операторов (НЕ трогаем пробелы внутри строк!)
    minified = minified
      .replace(/\s*(=|\+=|-=|\*=|\/=|%=|==|===|!=|!==)\s*/g, "$1")
      .replace(/\s*([<>&|])\s*/g, "$1")
      .replace(/\s*([(){}[\];,])\s*/g, "$1")
      .replace(/\s*([:?])\s*/g, "$1");

    // Убираем лишние пробелы но сохраняем критические и пробелы в строках
    minified = minified
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\n+/g, "\n")
      .replace(/\b(if|for|while|switch|catch|function|return|throw|new|typeof)\s+/g, "$1 ")
      .replace(/\belse\s+/g, "else ")
      .trim();

    // Убираем замену булевых значений - слишком рискованно

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

      // Обработка строк
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

      // Обработка комментариев
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

      // Добавляем символ если не в комментарии
      if (!inBlockComment && !inLineComment) {
        result += char;
      }
    }

    return result;
  }

  generateCounterCode(data) {
    const needsNumberFlip = data.odometerEffect;
    const numberFlipCDN = "https://cdn.jsdelivr.net/npm/number-flip@1.2.3/+esm";
    
    let libraryLoader = "";
    if (needsNumberFlip) {
      libraryLoader = `
// Динамическая загрузка number-flip библиотеки
async function loadNumberFlipLibrary(callback) {
  if (typeof window.Flip === 'function') {
    callback(); 
    return;
  }

  try {
    const mod = await import('${numberFlipCDN}');
    window.Flip = window.Flip || mod.Flip || mod.default;

    if (typeof window.Flip !== 'function') {
      console.warn('Taptop Counter: number-flip загружен, но Flip не найден – будет простой счётчик.');
    }
  } catch (err) {
    console.error('Taptop Counter: ошибка загрузки number-flip →', err);
  }

  callback();
}`;
    }

    return `<!-- Расширение - Анимированный счетчик -->
<script>
${needsNumberFlip ? 
`${libraryLoader}

loadNumberFlipLibrary(() => {` : 
'document.addEventListener("DOMContentLoaded", () => {'}
// Настройки счетчика
const counterConfig = {
  targetClass: "${data.targetClass}",
  startValue: ${data.startValue},
  endValue: ${data.endValue},
  duration: ${data.duration},
  delay: ${data.delay},
  easing: "${data.easing}",
  prefix: "${data.prefix}",
  suffix: "${data.suffix}",
  decimals: ${data.decimals},
  useThousandsSeparator: ${data.useThousandsSeparator},
  thousandsSeparator: "${data.thousandsSeparator}",
  playOnView: ${data.playOnView},
  loop: ${data.loop},
  odometerEffect: ${data.odometerEffect}
};

// Функции плавности
const easingFunctions = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + (--t) * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  easeInCirc: t => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: t => Math.sqrt(1 - (t - 1) * (t - 1)),
  easeInOutCirc: t => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2
};

// Форматирование числа
function formatNumber(num, config) {
  let formatted = num.toFixed(config.decimals);
  
  if (config.useThousandsSeparator && !config.odometerEffect) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, config.thousandsSeparator);
    formatted = parts.join('.');
  }
  
  return config.prefix + formatted + config.suffix;
}

// Обсервер пересечений для запуска при появлении
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// Анимация счетчика
function animateCounter(element, config) {
  if (config.odometerEffect) {
    animateOdometer(element, config);
  } else {
    animateRegularCounter(element, config);
  }
}

// Обычная анимация счетчика
function animateRegularCounter(element, config) {
  const startTime = performance.now();
  const easingFn = easingFunctions[config.easing] || easingFunctions.easeOutQuad;
  
  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / config.duration, 1);
    const easedProgress = easingFn(progress);
    const currentValue = config.startValue + (config.endValue - config.startValue) * easedProgress;
    
    element.textContent = formatNumber(currentValue, config);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else if (config.loop) {
      setTimeout(() => animateCounter(element, config), 500);
    }
  }
  
  setTimeout(() => requestAnimationFrame(update), config.delay);
}

// Анимация одометра
function animateOdometer(element, config) {
  element.innerHTML = '';

  /* ---------- prefix ---------- */
  if (config.prefix) {
    const prefixSpan = document.createElement('span');
    prefixSpan.className = 'taptop-counter-prefix';
    prefixSpan.textContent = config.prefix;
    element.appendChild(prefixSpan);
  }

  /* ---------- основной узел одометра ---------- */
  const integerPartNode = document.createElement('span');
  integerPartNode.className = 'taptop-odometer-integer-part';
  element.appendChild(integerPartNode);

  /* ---------- подготовка чисел ---------- */
  const [startIntStr, startDecStr = ''] = String(config.startValue).split('.');
  const [endIntStr] = String(config.endValue).split('.');
  const startInt = parseInt(startIntStr, 10) || 0;
  const endInt = parseInt(endIntStr, 10) || 0;

  /* ---------- разделитель тысяч ---------- */
  const separatorChar = config.useThousandsSeparator
        ? (config.thousandsSeparator === ' ' ? '\u00A0' : config.thousandsSeparator)
        : undefined;

  let flipInstance = null;
  let decimalDisplayElement = null;

  try {
    if (typeof window.Flip === 'function') {
      flipInstance = new window.Flip({
        node: integerPartNode,
        from: startInt,
        to: endInt,
        duration: (config.duration || 2000) / 1000,
        delay: (config.delay || 0) / 1000,
        direct: false,
        separator: separatorChar,
        separateEvery: config.useThousandsSeparator ? 3 : undefined,
      });
    } else {
      console.warn('Taptop Counter (' + config.targetClass + '): number-flip library not loaded. Falling back to simple counter.');
      // Fallback to simple counter
      animateRegularCounter(element, config);
      return;
    }
  } catch (e) {
    console.error('Error initializing Flip for ' + config.targetClass + ':', e, config);
    // Fallback to simple counter
    animateRegularCounter(element, config);
    return;
  }

  /* ---------- дробная часть ---------- */
  if (config.decimals > 0) {
    decimalDisplayElement = document.createElement('span');
    decimalDisplayElement.className = 'taptop-odometer-decimal-part';
    const decimalValue = startDecStr
      ? ('.' + startDecStr.padEnd(config.decimals, '0').slice(0, config.decimals))
      : ('.' + '0'.repeat(config.decimals));
    decimalDisplayElement.textContent = decimalValue;
    element.appendChild(decimalDisplayElement);
  }

  /* ---------- suffix ---------- */
  if (config.suffix) {
    const suffixSpan = document.createElement('span');
    suffixSpan.className = 'taptop-counter-suffix';
    suffixSpan.textContent = config.suffix;
    element.appendChild(suffixSpan);
  }

  // Start animation
  function startOdometer() {
    if (!flipInstance) return;
    
    const [targetIntegerPartStr] = String(config.endValue).split('.');
    const targetIntegerEndValue = parseInt(targetIntegerPartStr, 10) || 0;

    flipInstance.flipTo({ to: targetIntegerEndValue });

    // Handle decimal part animation if needed
    if (decimalDisplayElement && config.decimals > 0) {
      const [, endDecStr = ''] = String(config.endValue).split('.');
      const targetDecimalValue = endDecStr
        ? ('.' + endDecStr.padEnd(config.decimals, '0').slice(0, config.decimals))
        : ('.' + '0'.repeat(config.decimals));
      
      // Animate decimal part separately
      setTimeout(() => {
        if (decimalDisplayElement) {
          decimalDisplayElement.textContent = targetDecimalValue;
        }
      }, config.duration * 0.8); // Start decimal animation near the end
    }

    if (config.loop) {
      const loopDelay = (config.duration || 0) + (config.delay || 0) + 500;
      setTimeout(() => {
        if (element.parentNode) {
          const [currentIntegerStart] = String(config.startValue).split('.');
          flipInstance.flipTo({ to: parseInt(currentIntegerStart, 10) || 0, duration: 0.01 });
          
          // Reset decimal part for loop
          if (decimalDisplayElement && config.decimals > 0) {
            const startDecimalValue = startDecStr
              ? ('.' + startDecStr.padEnd(config.decimals, '0').slice(0, config.decimals))
              : ('.' + '0'.repeat(config.decimals));
            decimalDisplayElement.textContent = startDecimalValue;
          }
          
          setTimeout(() => startOdometer(), config.delay || 50);
        }
      }, loopDelay);
    }
  }

  // Add styles if not already present
  const styleId = 'taptop-counter-odometer-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = 
      '.taptop-counter-prefix,' +
      '.taptop-counter-suffix {' +
        'display: inline-block;' +
        'margin: 0 0.2em;' +
      '}' +
      '.taptop-odometer-decimal-part {' +
        'display: inline-block;' +
        'margin: 0;' +
      '}' +
      '.taptop-odometer-integer-part {' +
        'display: inline-block;' +
        'vertical-align: baseline;' +
      '}' +
      '.taptop-odometer-integer-part .ctnr {' +
        'display: inline-block;' +
        'font: inherit;' +
        'line-height: inherit;' +
        'overflow: hidden;' +
        'vertical-align: top;' +
        'user-select: none;' +
      '}' +
      '.taptop-odometer-integer-part .digit {' +
        'display: block;' +
        'font: inherit;' +
        'line-height: inherit;' +
        'text-align: center;' +
        'user-select: none;' +
      '}' +
      '.taptop-odometer-integer-part .sprtr {' +
        'display: inline-block;' +
        'white-space: pre;' +
      '}';
    document.head.appendChild(style);
  }

  setTimeout(() => startOdometer(), config.delay || 0);
}

// Инициализация счетчика
function initCounter() {
  const elements = document.querySelectorAll('.' + counterConfig.targetClass);
  
  elements.forEach(element => {
    if (counterConfig.playOnView) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target, counterConfig);
            if (!counterConfig.loop) {
              observer.unobserve(entry.target);
            }
          }
        });
      }, observerOptions);
      
      observer.observe(element);
    } else {
      animateCounter(element, counterConfig);
    }
  });
}

// Запуск
${needsNumberFlip ? 
  'document.addEventListener("DOMContentLoaded", initCounter);' : 
  'initCounter();'}
});
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
    // 1. Найти элементы попапа динамически каждый раз при вызове
    const successPopup = document.querySelector(".pop-up-success");
    const popupAcceptBtn = document.querySelector("[data-popup-accept-btn]");
    const popupCloseBtn = document.querySelector("[data-popup-close-btn]");
    // Найдем элемент содержимого попапа для корректной проверки клика по оверлею
    const popupContent = successPopup ? successPopup.querySelector('.pop-up__content') : null;

    if (!successPopup) {
      console.warn("CounterGenerator: Success popup element (.pop-up-success) not found.");
      return;
    }

    // 2. Определить функцию скрытия
    const hidePopupFunction = () => {
      successPopup.style.display = "none";
      console.log("CounterGenerator: Popup hidden");
    };

    // 3. Привязать обработчики только если элементы найдены
    if (popupAcceptBtn) {
      popupAcceptBtn.removeEventListener('click', hidePopupFunction);
      popupAcceptBtn.addEventListener("click", hidePopupFunction);
      console.log("CounterGenerator: Accept button handler bound");
    } else {
      console.warn("CounterGenerator: Accept button [data-popup-accept-btn] not found");
    }

    if (popupCloseBtn) {
      popupCloseBtn.removeEventListener('click', hidePopupFunction);
      popupCloseBtn.addEventListener("click", hidePopupFunction);
      console.log("CounterGenerator: Close button handler bound");
    } else {
      console.warn("CounterGenerator: Close button [data-popup-close-btn] not found");
    }

    // Улучшенный обработчик клика по overlay
    const overlayClickHandler = (event) => {
      console.log("CounterGenerator: Overlay click detected", {
        target: event.target.className,
        currentTarget: event.currentTarget.className,
        popupContentExists: !!popupContent
      });

      // Проверяем, существует ли элемент содержимого попапа
      if (popupContent) {
        // Проверяем, что клик был НЕ по элементу содержимого попапа и не по его потомкам
        if (!popupContent.contains(event.target)) {
          console.log("CounterGenerator: Click outside popup content - hiding popup");
          hidePopupFunction();
        } else {
          console.log("CounterGenerator: Click inside popup content - keeping popup open");
        }
      } else {
        console.warn("CounterGenerator: Popup content (.pop-up__content) not found inside .pop-up-success.");
        // Fallback к старой логике, если структура нестандартная
        if (event.target === successPopup) {
          console.log("CounterGenerator: Using fallback logic - hiding popup");
          hidePopupFunction();
        }
      }
    };

    successPopup.removeEventListener('click', overlayClickHandler);
    successPopup.addEventListener("click", overlayClickHandler);
    console.log("CounterGenerator: Enhanced overlay click handler bound", {
      popupContentFound: !!popupContent
    });

    // 4. Показать попап
    successPopup.style.display = "flex";
    console.log("CounterGenerator: Popup shown");
  }

  hideSuccessPopup() {
    const successPopup = document.querySelector(".pop-up-success");
    if (successPopup) {
      successPopup.style.display = "none";
      console.log("CounterGenerator: Popup hidden via hideSuccessPopup");
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

    // Отвязываем условные обработчики
    if (
      this.elements.useSeparator &&
      this.eventHandlers.has("separator-toggle")
    ) {
      this.elements.useSeparator.removeEventListener(
        "change",
        this.eventHandlers.get("separator-toggle")
      );
    }

    if (
      this.elements.odometerEffect &&
      this.eventHandlers.has("odometer-toggle")
    ) {
      this.elements.odometerEffect.removeEventListener(
        "change",
        this.eventHandlers.get("odometer-toggle")
      );
    }

    // unbindModalEvents больше не нужен - обработчики модального окна управляются в showSuccessPopup()
    this.eventHandlers.clear();
  }

  unbindModalEvents() {
    // Отвязываем обработчики модалки
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
customElements.define("counter-generator", CounterGenerator);
