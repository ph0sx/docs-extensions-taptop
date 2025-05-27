import { BaseGenerator } from "./base/baseGenerator.js";

export class CounterGenerator extends BaseGenerator {
  constructor() {
    super();
    this.config = {
      rules: [], // Массив для хранения конфигураций счетчиков
    };

    // Привязка обработчиков событий
    this._boundAddNewRule = this.addNewRule.bind(this);
    this._boundHandleRulesContainerChange =
      this._handleRulesContainerChange.bind(this);
    this._boundHandleRulesContainerClick =
      this._handleRulesContainerClick.bind(this);
    this._boundHandleOdometerEffectChangeOnLoad =
      this._handleOdometerEffectChange.bind(this);
  }

  /**
   * @override
   */
  findElements() {
    super.findElements(); // Находим базовые элементы

    this.elements.rulesContainer = document.getElementById(
      "counter-rules-container"
    );
    this.elements.addRuleButton = document.getElementById(
      "counter-add-rule-button"
    );
    this.elements.ruleTemplate = document.getElementById(
      "counter-rule-template"
    );

    if (
      !this.elements.rulesContainer ||
      !this.elements.addRuleButton ||
      !this.elements.ruleTemplate
    ) {
      console.error(
        "CounterGenerator: Не найдены все необходимые элементы UI для управления правилами."
      );
      if (this.elements.generateButton) {
        this.elements.generateButton.disabled = true;
        this.elements.generateButton.title =
          "Ошибка: не найдены элементы интерфейса для правил.";
      }
    }
  }

  /**
   * @override
   */
  bindEvents() {
    super.bindEvents();

    if (this.elements.addRuleButton) {
      this.elements.addRuleButton.addEventListener(
        "click",
        this._boundAddNewRule
      );
    }

    if (this.elements.rulesContainer) {
      this.elements.rulesContainer.addEventListener(
        "input",
        this._boundHandleRulesContainerChange
      ); // Для text/number input
      this.elements.rulesContainer.addEventListener(
        "change",
        this._boundHandleRulesContainerChange
      ); // Для select/checkbox
      this.elements.rulesContainer.addEventListener(
        "click",
        this._boundHandleRulesContainerClick
      );
      // Дополнительно слушаем событие 'change' для чекбоксов, которые могут не вызывать 'input'
      this.elements.rulesContainer.addEventListener(
        "change",
        this._boundHandleRulesContainerChange // Используем тот же обработчик, он проверит target
      );
    }
  }

  /**
   * @override
   */
  unbindEvents() {
    super.unbindEvents();
    if (this.elements.addRuleButton) {
      this.elements.addRuleButton.removeEventListener(
        "click",
        this._boundAddNewRule
      );
    }
    if (this.elements.rulesContainer) {
      this.elements.rulesContainer.removeEventListener(
        "input",
        this._boundHandleRulesContainerChange
      );
      this.elements.rulesContainer.removeEventListener(
        "change",
        this._boundHandleRulesContainerChange
      );
      this.elements.rulesContainer.removeEventListener(
        "click",
        this._boundHandleRulesContainerClick
      );
    }
  }

  /**
   * @override
   */
  setInitialState() {
    super.setInitialState();
    if (this.config.rules.length === 0) {
      this.addNewRule(); // Добавляем одно правило по умолчанию, если их нет
    } else {
      this._renderAllRulesDOM(); // Отрисовываем существующие правила (например, при перезагрузке менеджером)
    }
  }

  /**
   * Добавляет новое правило счетчика в конфигурацию и в DOM.
   */
  addNewRule() {
    const ruleId = `rule_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    const newRule = {
      id: ruleId,
      targetClass: "",
      startValue: 0,
      endValue: 1000,
      duration: 2000,
      delay: 0,
      prefix: "",
      suffix: "",
      decimals: 0,
      useThousandsSeparator: false,
      thousandsSeparator: ",",
      playOnView: true,
      loop: false,
      odometerEffect: false,
      easing: "easeOutQuad",
    };
    this.config.rules.push(newRule);
    this._renderRuleCard(newRule);
    this._updateRuleNumbersAndControls();
  }

  /**
   * Отрисовывает все правила из this.config.rules в DOM.
   * @private
   */
  _renderAllRulesDOM() {
    if (!this.elements.rulesContainer) return;
    this.elements.rulesContainer.innerHTML = ""; // Очищаем контейнер
    this.config.rules.forEach((rule) => this._renderRuleCard(rule));
    this._updateRuleNumbersAndControls();
  }

  /**
   * Генерирует и добавляет HTML-карточку для одного правила счетчика.
   * @param {object} ruleConfig - Конфигурация правила.
   * @private
   */
  _renderRuleCard(ruleConfig) {
    if (!this.elements.ruleTemplate?.content || !this.elements.rulesContainer)
      return;

    const templateClone = this.elements.ruleTemplate.content.cloneNode(true);
    const ruleCard = templateClone.querySelector(".counter-rule-card");
    if (!ruleCard) return;

    ruleCard.dataset.ruleId = ruleConfig.id;

    // Уникализация ID и for атрибутов в шаблоне
    const fieldsToUpdate = [
      "target-class",
      "start-value",
      "end-value",
      "duration",
      "delay",
      "easing",
      "prefix",
      "suffix",
      "decimals",
      "separator-symbol",
    ];

    fieldsToUpdate.forEach((fieldNameBase) => {
      const inputElement = ruleCard.querySelector(`.counter-${fieldNameBase}`);
      if (inputElement) {
        const originalId = inputElement.id;
        if (originalId && originalId.endsWith("-template")) {
          const newId = `${originalId.replace("-template", "")}-${
            ruleConfig.id
          }`;
          inputElement.id = newId;
          const label = ruleCard.querySelector(`label[for="${originalId}"]`);
          if (label) {
            label.setAttribute("for", newId);
          }
        }
      }
    });

    // Заполнение полей значениями из ruleConfig
    this._setInputValue(ruleCard, "targetClass", ruleConfig.targetClass);
    this._setInputValue(ruleCard, "startValue", ruleConfig.startValue);
    this._setInputValue(ruleCard, "endValue", ruleConfig.endValue);
    this._setInputValue(ruleCard, "duration", ruleConfig.duration);
    this._setInputValue(ruleCard, "delay", ruleConfig.delay);
    this._setInputValue(ruleCard, "prefix", ruleConfig.prefix);
    this._setInputValue(ruleCard, "suffix", ruleConfig.suffix);
    this._setInputValue(ruleCard, "decimals", ruleConfig.decimals);
    this._setInputValue(
      ruleCard,
      "useThousandsSeparator",
      ruleConfig.useThousandsSeparator,
      "checkbox"
    );
    this._setInputValue(
      ruleCard,
      "thousandsSeparator",
      ruleConfig.thousandsSeparator,
      "select"
    );
    this._setInputValue(
      ruleCard,
      "playOnView",
      ruleConfig.playOnView,
      "checkbox"
    );
    this._setInputValue(ruleCard, "loop", ruleConfig.loop, "checkbox");
    this._setInputValue(
      ruleCard,
      "odometerEffect",
      ruleConfig.odometerEffect,
      "checkbox"
    );
    this._setInputValue(ruleCard, "easing", ruleConfig.easing, "select");

    this.elements.rulesContainer.appendChild(templateClone);
    this._toggleSeparatorSymbolField(
      ruleCard,
      ruleConfig.useThousandsSeparator
    );

    const odometerCheckbox = ruleCard.querySelector(".counter-odometer-effect");
    if (odometerCheckbox) {
      odometerCheckbox.checked = !!ruleConfig.odometerEffect;
      this._handleOdometerEffectChange(odometerCheckbox);
    } else {
      const easingGroup = ruleCard.querySelector(".counter-easing-group");
      if (easingGroup) easingGroup.style.display = "";
    }
  }

  /**
   * Вспомогательная функция для установки значения поля в карточке.
   * @param {HTMLElement} ruleCard - DOM-элемент карточки.
   * @param {string} name - Имя поля (соответствует name в ruleConfig).
   * @param {any} value - Значение для установки.
   * @param {string} type - Тип инпута ('text', 'number', 'checkbox', 'select').
   * @private
   */
  _setInputValue(ruleCard, name, value, type = "text") {
    const element = ruleCard.querySelector(
      `.counter-${name
        .toLowerCase()
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()}`
    );
    if (element) {
      if (type === "checkbox") {
        element.checked = !!value;
      } else {
        element.value = value;
      }
    }
  }

  /**
   * Обрабатывает клики внутри контейнера правил (для удаления).
   * @param {Event} event - Событие click.
   * @private
   */
  _handleRulesContainerClick(event) {
    const removeButton = event.target.closest(".remove-rule-button");
    if (removeButton) {
      const ruleCard = removeButton.closest(".counter-rule-card[data-rule-id]");
      const ruleIdToRemove = ruleCard?.dataset.ruleId;
      if (ruleIdToRemove) {
        this._handleRemoveRule(ruleIdToRemove);
      }
    }
  }

  /**
   * Обрабатывает изменения в полях ввода правил.
   * @param {Event} event - Событие input или change.
   * @private
   */
  _handleRulesContainerChange(event) {
    const target = event.target;
    const ruleCard = target.closest(".counter-rule-card[data-rule-id]");
    const ruleId = ruleCard?.dataset.ruleId;

    if (!ruleId) return;

    const rule = this.config.rules.find((r) => r.id === ruleId);
    if (!rule) return;

    const fieldName = target.name;
    let value = target.type === "checkbox" ? target.checked : target.value;

    if (target.classList.contains("counter-odometer-effect")) {
      this._handleOdometerEffectChange(target);
    }

    if (target.type === "number") {
      value = parseFloat(value);
      if (isNaN(value)) {
        if (
          fieldName === "startValue" ||
          fieldName === "endValue" ||
          fieldName === "duration" ||
          fieldName === "delay" ||
          fieldName === "decimals"
        ) {
          value = 0;
        }
      }
      if (fieldName === "decimals" && value < 0) value = 0;
      if (fieldName === "decimals" && value > 5) value = 5;
    }

    if (fieldName) {
      rule[fieldName] = value;
    }

    if (fieldName === "useThousandsSeparator") {
      this._toggleSeparatorSymbolField(ruleCard, value);
    }
  }

  /**
   * Обрабатывает изменение состояния чекбокса "Эффект Одометра"
   * и скрывает/показывает поле выбора функции плавности.
   * @param {HTMLInputElement} odometerCheckboxElement - Элемент чекбокса.
   * @private
   */
  _handleOdometerEffectChange(odometerCheckboxElement) {
    const ruleCard = odometerCheckboxElement.closest(".counter-rule-card");
    if (!ruleCard) return;
    const easingGroup = ruleCard.querySelector(".counter-easing-group");

    if (easingGroup) {
      easingGroup.style.display = odometerCheckboxElement.checked ? "none" : "";
    }
  }

  /**
   * Показывает/скрывает поле выбора символа разделителя тысяч.
   * @param {HTMLElement} ruleCard - Карточка правила.
   * @param {boolean} show - Показывать ли поле.
   * @private
   */
  _toggleSeparatorSymbolField(ruleCard, show) {
    const separatorRow = ruleCard.querySelector(
      ".counter-separator-symbol-row"
    );
    if (separatorRow) {
      separatorRow.style.display = show ? "" : "none";
    }
  }

  /**
   * Удаляет правило счетчика.
   * @param {string} ruleIdToRemove - ID правила для удаления.
   * @private
   */
  _handleRemoveRule(ruleIdToRemove) {
    this.config.rules = this.config.rules.filter(
      (rule) => rule.id !== ruleIdToRemove
    );
    const cardElement = this.elements.rulesContainer.querySelector(
      `.counter-rule-card[data-rule-id="${ruleIdToRemove}"]`
    );
    if (cardElement) {
      cardElement.remove();
    }
    this._updateRuleNumbersAndControls();
    if (this.config.rules.length === 0) {
      this.addNewRule();
    }
  }

  /**
   * Обновляет порядковые номера правил и видимость кнопок удаления.
   * @private
   */
  _updateRuleNumbersAndControls() {
    const ruleCards =
      this.elements.rulesContainer.querySelectorAll(".counter-rule-card");
    ruleCards.forEach((card, index) => {
      const numberElement = card.querySelector(".rule-number");
      if (numberElement) {
        numberElement.textContent = index + 1;
      }
      const removeButton = card.querySelector(".remove-rule-button");
      if (removeButton) {
        removeButton.style.display = ruleCards.length > 1 ? "" : "none";
      }
    });
  }

  /**
   * @override
   */
  collectData() {
    let isValid = true;
    this.config.rules.forEach((rule) => {
      const ruleCardElement = this.elements.rulesContainer.querySelector(
        `.counter-rule-card[data-rule-id="${rule.id}"]`
      );

      if (!rule.targetClass || !rule.targetClass.trim()) {
        this.showErrorModal(
          `CSS-класс целевого элемента не указан для Счетчика #${
            this.config.rules.indexOf(rule) + 1
          }.`
        );
        isValid = false;
        const field = ruleCardElement?.querySelector(".counter-target-class");
        if (field) {
          field.style.borderColor = "red";
          setTimeout(() => (field.style.borderColor = ""), 2000);
        }
        return;
      }
      if (typeof rule.endValue !== "number" || isNaN(rule.endValue)) {
        this.showErrorModal(
          `Конечное значение не является числом для Счетчика #${
            this.config.rules.indexOf(rule) + 1
          }.`
        );
        isValid = false;
        const field = ruleCardElement?.querySelector(".counter-end-value");
        if (field) {
          field.style.borderColor = "red";
          setTimeout(() => (field.style.borderColor = ""), 2000);
        }
        return;
      }
      const invalidCharRegex = /[.#\s\[\]>+~:()]/;
      if (invalidCharRegex.test(rule.targetClass.trim())) {
        this.showErrorModal(
          `CSS-класс "${rule.targetClass.trim()}" для Счетчика #${
            this.config.rules.indexOf(rule) + 1
          } содержит недопустимые символы.`
        );
        isValid = false;
        const field = ruleCardElement?.querySelector(".counter-target-class");
        if (field) {
          field.style.borderColor = "red";
          setTimeout(() => (field.style.borderColor = ""), 2000);
        }
        return;
      }
    });

    if (!isValid) return null;

    return {
      rules: JSON.parse(JSON.stringify(this.config.rules)),
    };
  }

  /**
   * @override
   */
  generateCode(settings) {
    if (!settings || !settings.rules || settings.rules.length === 0) {
      return "";
    }

    const configurationsJson = JSON.stringify(settings.rules, null, 2);
    const needsNumberFlip = settings.rules.some((rule) => rule.odometerEffect);

    const scriptParts = [];

    const numberFlipCDN = "https://cdn.jsdelivr.net/npm/number-flip@1.2.3/+esm";

    const libraryLoaderCode = `
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
        }
    `;

    if (needsNumberFlip) {
      scriptParts.push(libraryLoaderCode);
    }

    // easingFunctions (если есть ХОТЯ БЫ ОДНО правило)
    if (settings.rules.length > 0) {
      const easingFunctionsScript = `
      const easingFunctions = {
        linear: (t, b, c, d) => c * (t / d) + b,
        easeInQuad: (t, b, c, d) => { t /= d; return c * t * t + b; },
        easeOutQuad: (t, b, c, d) => { t /= d; return -c * t * (t - 2) + b; },
        easeInOutQuad: (t, b, c, d) => { t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--; return -c / 2 * (t * (t - 2) - 1) + b; },
        easeInCubic: (t, b, c, d) => { t /= d; return c * t * t * t + b; },
        easeOutCubic: (t, b, c, d) => { t /= d; t--; return c * (t * t * t + 1) + b; },
        easeInOutCubic: (t, b, c, d) => { t /= d / 2; if (t < 1) return c / 2 * t * t * t + b; t -= 2; return c / 2 * (t * t * t + 2) + b; },
        easeInQuart: (t, b, c, d) => { t /= d; return c * t * t * t * t + b; },
        easeOutQuart: (t, b, c, d) => { t /= d; t--; return -c * (t * t * t * t - 1) + b; },
        easeInOutQuart: (t, b, c, d) => { t /= d / 2; if (t < 1) return c / 2 * t * t * t * t + b; t -= 2; return -c / 2 * (t * t * t * t - 2) + b; },
        easeInQuint: (t, b, c, d) => { t /= d; return c * t * t * t * t * t + b; },
        easeOutQuint: (t, b, c, d) => { t /= d; t--; return c * (t * t * t * t * t + 1) + b; },
        easeInOutQuint: (t, b, c, d) => { t /= d / 2; if (t < 1) return c / 2 * t * t * t * t * t + b; t -= 2; return c / 2 * (t * t * t * t * t + 2) + b; },
        easeInSine: (t, b, c, d) => -c * Math.cos(t / d * (Math.PI / 2)) + c + b,
        easeOutSine: (t, b, c, d) => c * Math.sin(t / d * (Math.PI / 2)) + b,
        easeInOutSine: (t, b, c, d) => -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b,
        easeInExpo: (t, b, c, d) => c * Math.pow(2, 10 * (t / d - 1)) + b,
        easeOutExpo: (t, b, c, d) => c * (-Math.pow(2, -10 * t / d) + 1) + b,
        easeInOutExpo: (t, b, c, d) => { t /= d / 2; if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; t--; return c / 2 * (-Math.pow(2, -10 * t) + 2) + b; },
        easeInCirc: (t, b, c, d) => { t /= d; return -c * (Math.sqrt(1 - t * t) - 1) + b; },
        easeOutCirc: (t, b, c, d) => { t /= d; t--; return c * Math.sqrt(1 - t * t) + b; },
        easeInOutCirc: (t, b, c, d) => { t /= d / 2; if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; t -= 2; return c / 2 * (Math.sqrt(1 - t * t) + 1) + b; }
      };`;
      scriptParts.push(easingFunctionsScript);
    }

    if (settings.rules.length > 0) {
      const formatNumberFunction = `
        function formatNumber(number, decimals, useSeparator, separatorSymbol) {
          const num = parseFloat(number);
          if (isNaN(num)) return String(number);
          if (separatorSymbol === ' ') separatorSymbol = '\u00A0'; // непереносимый пробел

          let fixedNum = num.toFixed(decimals);
          let parts = fixedNum.split('.');
          if (useSeparator && parts[0].length > 3) {
            parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, separatorSymbol);
          }
          return parts.join('.');
        }`;
      scriptParts.push(formatNumberFunction);
    }

    // Основная логика
    const mainLogicScript = `
    const taptopCounterConfigs = ${configurationsJson};

    class TaptopCounterInstance {
      constructor(element, config) {
        this.element = element;
        this.config = config;
        this.startTime = null;
        this.animationFrameId = null;
        this.currentValue = config.startValue;
        this.observer = null;
        this.animatedOnce = false;
        this.flipInstance = null; // Для number-flip
        this.decimalDisplayElement = null; // Для отображения дробной части с одометром

        if (config.odometerEffect && typeof window.Flip === 'function') {
            this._initOdometer();
        } else if (config.odometerEffect && typeof window.Flip !== 'function') {
            console.warn(\`Taptop Counter (\${config.targetClass}): number-flip library not loaded. Falling back to simple counter.\`);
            this.config.odometerEffect = false; // Отключаем, чтобы не было ошибок
            this._initSimpleCounter();
        }
        else {
            this._initSimpleCounter();
        }
      }

      _initSimpleCounter() {
          this._updateText(this.config.startValue);
          if (this.config.playOnView) {
              this._initObserver();
          } else {
              setTimeout(() => this.startSimple(), this.config.delay || 0);
          }
      }

      _initOdometer() {
          this.element.innerHTML = '';

          /* ---------- prefix ---------- */
          if (this.config.prefix) {
            const prefixSpan = document.createElement('span');
            prefixSpan.className = 'taptop-counter-prefix';
            prefixSpan.textContent = this.config.prefix;
            this.element.appendChild(prefixSpan);
          }

          /* ---------- основной узел одометра ---------- */
          const integerPartNode = document.createElement('span');
          integerPartNode.className = 'taptop-odometer-integer-part';
          this.element.appendChild(integerPartNode);

          /* ---------- подготовка чисел ---------- */
          const [startIntStr, startDecStr = ''] = String(this.config.startValue).split('.');
          const [endIntStr] = String(this.config.endValue  ).split('.');
          const startInt = parseInt(startIntStr, 10) || 0;
          const endInt = parseInt(endIntStr,10) || 0;

          /* ---------- разделитель тысяч ---------- */
          const separatorChar = this.config.useThousandsSeparator
                ? (this.config.thousandsSeparator === ' ' ? '\u00A0' : this.config.thousandsSeparator)
                : undefined;

          try {
            this.flipInstance = new Flip({
              node:       integerPartNode,
              from:       startInt,
              to:         endInt,                      // ← добавлено
              duration:   (this.config.duration || 2000) / 1000,
              delay:      (this.config.delay    ||    0) / 1000,
              direct:     false,
              separator:  separatorChar,
              separateEvery: this.config.useThousandsSeparator ? 3 : undefined,
            });
          } catch (e) {
            console.error(\`Error initializing Flip for \${this.config.targetClass}:\`, e, this.config);
            this.config.odometerEffect = false;
            this._initSimpleCounter();
            return;
          }

          /* ---------- дробная часть ---------- */
          if (this.config.decimals > 0) {
              this.decimalDisplayElement = document.createElement('span');
              this.decimalDisplayElement.className = 'taptop-odometer-decimal-part';
              const decimalValue = startDecStr
  ? ('.' + startDecStr.padEnd(this.config.decimals, '0').slice(0, this.config.decimals))
  : ('.' + '0'.repeat(this.config.decimals));
              this.decimalDisplayElement.textContent = decimalValue;
              this.element.appendChild(this.decimalDisplayElement);
          }

          /* ---------- suffix ---------- */
          if (this.config.suffix) {
            const suffixSpan = document.createElement('span');
            suffixSpan.className = 'taptop-counter-suffix';
            suffixSpan.textContent = this.config.suffix;
            this.element.appendChild(suffixSpan);
          }

          if (this.config.playOnView) {
              this._initObserver();
          } else {
              setTimeout(() => this.startOdometer(), this.config.delay || 0);
          }
      }

      _initObserver() {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!this.animatedOnce || this.config.loop) {
                const startMethod = this.config.odometerEffect ? this.startOdometer.bind(this) : this.startSimple.bind(this);
                setTimeout(startMethod, this.config.delay || 0);
                if (!this.config.loop) {
                  this.observer.unobserve(this.element);
                }
              }
            }
          });
        }, { threshold: 0.1 });
        this.observer.observe(this.element);
      }

      startSimple() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.startTime = null;
        this.currentValue = this.config.startValue;
        this.animatedOnce = true;
        this.animationFrameId = requestAnimationFrame(this.animateSimple.bind(this));
      }

      startOdometer() {
          if (!this.flipInstance) return;
          this.animatedOnce = true;
          const [targetIntegerPartStr] = String(this.config.endValue).split('.');
          const targetIntegerEndValue = parseInt(targetIntegerPartStr, 10) || 0;

          this.flipInstance.flipTo({ to: targetIntegerEndValue });

          if (this.config.loop) {
              const loopDelay = (this.config.duration || 0) + (this.config.delay || 0) + 500;
              setTimeout(() => {
                  if (this.element.parentNode) { 
                      const [currentIntegerStart] = String(this.config.startValue).split('.');
                      this.flipInstance.flipTo({ to: parseInt(currentIntegerStart, 10) || 0, duration: 0.01 }); 
                      setTimeout(() => this.startOdometer(), 50); 
                  }
              }, loopDelay);
          }
      }

      animateSimple(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const progress = timestamp - this.startTime;
        
        let newValue;
        if (progress >= this.config.duration) {
          newValue = this.config.endValue;
        } else {
          const easingFunc = easingFunctions[this.config.easing] || easingFunctions.easeOutQuad;
          newValue = easingFunc(progress, this.config.startValue, this.config.endValue - this.config.startValue, this.config.duration);
        }
        
        this.currentValue = newValue;
        this._updateText(newValue);

        if (progress < this.config.duration) {
          this.animationFrameId = requestAnimationFrame(this.animateSimple.bind(this));
        } else {
          if (this.config.loop) {
            setTimeout(() => this.startSimple(), 500);
          }
        }
      }

      _updateText(value) {
          if (this.config.odometerEffect) {
              if (this.decimalDisplayElement && this.config.decimals > 0) {
                  const [, decimalPartStrValue] = String(value).split('.');
                  const decimalText = decimalPartStrValue ?
                      ('.' + decimalPartStrValue.padEnd(this.config.decimals, '0').slice(0, this.config.decimals)) :
                      ('.' + '0'.repeat(this.config.decimals));
                  this.decimalDisplayElement.textContent = decimalText;
              }
              return;
          }

          const formattedValue = formatNumber(value, this.config.decimals, this.config.useThousandsSeparator, this.config.thousandsSeparator);
          let output = '';
          if (this.config.prefix) output += \`<span class="taptop-counter-prefix">\${this.config.prefix}</span>\`;
          output += \`<span class="taptop-counter-number">\${formattedValue}</span>\`;
          if (this.config.suffix) output += \`<span class="taptop-counter-suffix">\${this.config.suffix}</span>\`;
          this.element.innerHTML = output;
      }
    } 

    const initializeAllCounters = () => {
      const styleId = 'taptop-counter-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = \`
          .taptop-counter-prefix,
          .taptop-counter-suffix {
            display: inline-block;
            margin: 0 0.2em;
          }
          .taptop-odometer-decimal-part {
            display: inline-block;
            margin: 0;
          }
          .taptop-odometer-integer-part { 
            display: inline-block;
            vertical-align: baseline; 
          }
          .taptop-odometer-integer-part .ctnr { 
            display: inline-block;
            font: inherit; 
            line-height: inherit; 
            overflow: hidden; 
            vertical-align: top; 
            user-select: none; 
          }
          .taptop-odometer-integer-part .digit { 
            display: block;
            font: inherit; 
            line-height: inherit; 
            text-align: center; 
            user-select: none; 
          }
          .taptop-odometer-integer-part .sprtr {
            display: inline-block;
            white-space: pre;   
          }
          .taptop-counter-number {
            display: inline-block;
            white-space: nowrap;  
          }
        \`;
        document.head.appendChild(style);
      }

      taptopCounterConfigs.forEach(config => {
        const elements = document.querySelectorAll('.' + config.targetClass);
        if (elements.length > 0) {
          elements.forEach(el => {
            if (!el.taptopCounterInstance) {
              el.taptopCounterInstance = new TaptopCounterInstance(el, config);
            } else {
              console.warn(\`TaptopCounter: Элемент с классом '\${config.targetClass}' уже был инициализирован.\`, el);
            }
          });
        } else {
          // console.error(\`TaptopCounter: Элемент с классом '\${config.targetClass}' не найден.\`);
        }
      });
    };

    // Логика вызова инициализации:
    if (${needsNumberFlip}) { 
        if (typeof loadNumberFlipLibrary === 'function') {
            loadNumberFlipLibrary(initializeAllCounters);
        } else {
            console.error('Taptop Counter: loadNumberFlipLibrary function is not defined, but was needed.');
            document.addEventListener('DOMContentLoaded', initializeAllCounters); // Попытка инициализации без number-flip
        }
    } else {
        document.addEventListener('DOMContentLoaded', initializeAllCounters);
    }
    `;
    scriptParts.push(mainLogicScript);

    return `<script>\n${scriptParts.join("\n")}\n</script>`;
  }
}
