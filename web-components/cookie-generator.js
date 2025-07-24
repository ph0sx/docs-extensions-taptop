class CookieGenerator extends HTMLElement {
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

      .cookie-generator {
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
      }

      .settings-row {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .setting-group {
        width: 100%;
        min-width: 0;
        flex-shrink: 1;
      }

      .setting-group label {
        display: block;
        margin-bottom: 10px;
        font-weight: 500;
        color: var(--text-dark);
      }

      .text-input {
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
      }

      .text-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-light);
      }

      .helper-text {
        font-size: 13px;
        color: var(--text-light);
        margin-top: 5px;
        line-height: 1.4;
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
      <div class="cookie-generator">
        <div class="form-grid">
            <div class="setting-group">
              <label for="expiry-days">Срок хранения выбора пользователя (дни):</label>
              <input type="number" id="expiry-days" class="text-input" value="30" min="1">
              <div class="helper-text">Определяет, как долго будет храниться выбор пользователя в браузере</div>
            </div>
            <div class="setting-group">
              <label for="popup-class">CSS-класс всплывающего окна:</label>
              <input type="text" id="popup-class" class="text-input" value="popup-cookie">
              <div class="helper-text">Класс блока с уведомлением о cookie</div>
            </div>
            <div class="setting-group">
              <label for="consent-btn-class">CSS-класс кнопки согласия:</label>
              <input type="text" id="consent-btn-class" class="text-input" value="button-cookie">
              <div class="helper-text">Класс кнопки "Принять" или "Согласен"</div>
            </div>
            <div class="setting-group">
              <label for="reject-btn-class">CSS-класс кнопки отказа:</label>
              <input type="text" id="reject-btn-class" class="text-input" value="button-no-cookie">
              <div class="helper-text">Класс кнопки "Отклонить" или "Отказаться"</div>
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
    this.elements.codeOutput = this.shadowRoot.getElementById("code-output");

    // Внешние элементы модалки будут искаться динамически в showSuccessPopup
  }

  bindEvents() {
    // Обработчик для кнопки генерации
    if (this.elements.generateBtn) {
      const handler = () => this.generateCode();
      this.eventHandlers.set('generate', handler);
      this.elements.generateBtn.addEventListener('click', handler);
    }

    // Модальные события будут привязываться динамически
  }


  collectData() {
    return {
      expiryDays: this.shadowRoot.getElementById("expiry-days").value || 30,
      popupClass:
        this.shadowRoot.getElementById("popup-class").value || "popup-cookie",
      consentBtnClass:
        this.shadowRoot.getElementById("consent-btn-class").value ||
        "button-cookie",
      rejectBtnClass:
        this.shadowRoot.getElementById("reject-btn-class").value ||
        "button-no-cookie",
    };
  }

  async generateCode() {
    try {
      const data = this.collectData();
      if (!data) return;

      const rawCode = this.generateCookieCode(data);
      const code = await this.minifyGeneratedCode(rawCode);

      if (this.elements.codeOutput) {
        this.elements.codeOutput.textContent = code;
      }

      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (error) {
      console.error('Ошибка генерации кода:', error);
    }
  }

  generateCookieCode(data) {
    return `<!-- Расширение - Cookie  -->
<script>
document.addEventListener("DOMContentLoaded", () => {
// Функции для работы с cookie
const cookies = {
  get: (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : undefined;
  },
  set: (name, value, options = {}) => {
    options = { path: '/', ...options };
    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      options.expires = date.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (const [key, val] of Object.entries(options)) {
      updatedCookie += '; ' + key + (val !== true ? '=' + val : '');
    }
    document.cookie = updatedCookie;
  }
};

const ui = {
  banner: document.querySelector(".${data.popupClass}"),
  consentBtn: document.querySelector(".${data.consentBtnClass}"),
  rejectBtn: document.querySelector(".${data.rejectBtnClass}"),
  closeBtn: document.querySelector(".pop-up__inside-close-button"),
  overlay: document.querySelector(".pop-up__overlay")
};

const hideBanner = () => {
  if (ui.banner) ui.banner.style.setProperty('display', 'none', 'important');
};

// Если cookie отсутствует и баннер найден – показываем баннер и назначаем обработчики
if (cookies.get("cookieAgreement") === undefined && ui.banner) {
  ui.banner.style.display = "flex";
  ui.closeBtn?.addEventListener("click", hideBanner);
  ui.overlay?.addEventListener("click", hideBanner);
  ui.consentBtn?.addEventListener("click", () => {
    cookies.set("cookieAgreement", "true", { expires: ${data.expiryDays} });
    hideBanner();
  });
  ui.rejectBtn?.addEventListener("click", () => {
    cookies.set("cookieAgreement", "false", { expires: ${data.expiryDays} });
    hideBanner();
  });
}
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

  async copyToClipboard(code) {
    const minified = code.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

    try {
      await navigator.clipboard.writeText(minified);
      console.log("Код скопирован в буфер обмена");
    } catch (error) {
      this.fallbackCopy(minified);
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
    console.log('showSuccessPopup вызван');
    
    // Динамический поиск элементов попапа
    const successPopup = document.querySelector('.pop-up-success');
    const popupAcceptBtn = document.querySelector('[data-popup-accept-btn]');
    const popupCloseBtn = document.querySelector('[data-popup-close-btn]');
    const popupContent = document.querySelector('.pop-up__content');
    
    console.log('Найдены элементы:', {
      successPopup: !!successPopup,
      popupAcceptBtn: !!popupAcceptBtn, 
      popupCloseBtn: !!popupCloseBtn,
      popupContent: !!popupContent
    });
    
    if (!successPopup) {
      console.warn('Попап не найден');
      return;
    }
    
    // Показываем попап
    successPopup.style.display = 'flex';
    
    // Обработчики закрытия
    const closeHandler = () => {
      console.log('closeHandler вызван');
      this.hideSuccessPopup();
    };
    
    // Кнопка принять
    if (popupAcceptBtn) {
      console.log('Добавляем обработчик для кнопки принять');
      const acceptHandler = closeHandler;
      this.eventHandlers.set('popup-accept', acceptHandler);
      popupAcceptBtn.addEventListener('click', acceptHandler);
    }
    
    // Кнопка закрыть
    if (popupCloseBtn) {
      console.log('Добавляем обработчик для кнопки закрыть');
      const closeHandlerForBtn = closeHandler;
      this.eventHandlers.set('popup-close', closeHandlerForBtn);
      popupCloseBtn.addEventListener('click', closeHandlerForBtn);
    }
    
    // Клик по оверлею
    if (successPopup && popupContent) {
      console.log('Добавляем обработчик для оверлея');
      const overlayHandler = (event) => {
        console.log('Клик по попапу, цель:', event.target);
        console.log('popupContent.contains(event.target):', popupContent.contains(event.target));
        
        if (!popupContent.contains(event.target)) {
          console.log('Клик за пределами контента - закрываем');
          closeHandler();
        }
      };
      this.eventHandlers.set('popup-overlay', overlayHandler);
      successPopup.addEventListener('click', overlayHandler);
    } else if (successPopup) {
      // Fallback для случаев без .pop-up__content
      console.log('Fallback - добавляем обработчик оверлея без проверки content');
      const overlayHandler = (event) => {
        if (event.target === successPopup) {
          closeHandler();
        }
      };
      this.eventHandlers.set('popup-overlay', overlayHandler);
      successPopup.addEventListener('click', overlayHandler);
    }
  }

  hideSuccessPopup() {
    console.log('hideSuccessPopup вызван');
    
    // Динамический поиск элементов
    const successPopup = document.querySelector('.pop-up-success');
    const popupAcceptBtn = document.querySelector('[data-popup-accept-btn]');
    const popupCloseBtn = document.querySelector('[data-popup-close-btn]');
    
    // Скрываем попап
    if (successPopup) {
      successPopup.style.display = 'none';
    }
    
    // Отвязываем обработчики
    if (popupAcceptBtn && this.eventHandlers.has('popup-accept')) {
      popupAcceptBtn.removeEventListener('click', this.eventHandlers.get('popup-accept'));
      this.eventHandlers.delete('popup-accept');
    }
    
    if (popupCloseBtn && this.eventHandlers.has('popup-close')) {
      popupCloseBtn.removeEventListener('click', this.eventHandlers.get('popup-close'));
      this.eventHandlers.delete('popup-close');
    }
    
    if (successPopup && this.eventHandlers.has('popup-overlay')) {
      successPopup.removeEventListener('click', this.eventHandlers.get('popup-overlay'));
      this.eventHandlers.delete('popup-overlay');
    }
  }

  unbindEvents() {
    // Отвязываем обработчик генерации
    if (this.elements.generateBtn && this.eventHandlers.has('generate')) {
      this.elements.generateBtn.removeEventListener('click', this.eventHandlers.get('generate'));
    }

    // Модальные события отвязываются автоматически в hideSuccessPopup
    this.eventHandlers.clear();
  }


  destroy() {
    this.unbindEvents();
    this.initialized = false;
  }
}

// Регистрируем веб-компонент
customElements.define("cookie-generator", CookieGenerator);
