import { BaseGenerator } from "./base/baseGenerator.js";

/**
 * debounce – простая защита от избыточных вызовов функции
 */
const debounce = (fn, wait = 250) => {
  let t;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
};

/**
 * CardFlipGenerator – генератор кода для эффекта <flip-card>
 * Основное отличие от предыдущей версии:
 *  – полностью удалён функционал «начальная обратная сторона»
 *  – упрощены keyframes для вертикального режима (без translateZ)
 *  – исправлены баги отражения и дрожания
 */
export class CardFlipGenerator extends BaseGenerator {
  constructor() {
    super();
    this.previewFlipCard = null;
    this.previewTriggerElement = null;
    this._boundUpdateSpeedSliderDisplay =
      this._updateSpeedSliderDisplay.bind(this); // ++
    this._boundUpdateHeightSliderDisplay =
      this._updateHeightSliderDisplay.bind(this); // ++
    this._debouncedUpdatePreview = debounce(this._updatePreview.bind(this));
  }

  /* ===== UI: поиск элементов ===== */
  findElements() {
    super.findElements();

    this.elements.containerSelectorInput = document.getElementById(
      "cf-container-selector"
    );
    this.elements.triggerRadios = document.querySelectorAll(
      'input[name="cf-trigger"]'
    );
    this.elements.directionRadios = document.querySelectorAll(
      'input[name="cf-direction"]'
    );
    this.elements.speedSlider = document.getElementById("cf-speed-slider"); // ++ Замена Select на Slider
    this.elements.speedSliderGroup =
      this.elements.speedSlider?.closest(".setting-group"); // ++ Находим родителя
    this.elements.speedValueDisplay = document.getElementById(
      "cf-speed-value-display"
    ); // ++
    this.elements.animationStyleSelect =
      document.getElementById("cf-animation-style");
    this.elements.animationStyleGroup =
      this.elements.animationStyleSelect?.closest(".setting-group"); // ++ Находим родителя
    this.elements.borderRadiusInput =
      document.getElementById("cf-border-radius"); // ++
    this.elements.flipHeightSlider = document.getElementById("cf-flip-height"); // ++
    this.elements.flipHeightGroup =
      this.elements.flipHeightSlider?.closest(".setting-group"); // ++ Находим родителя
    this.elements.flipHeightValueDisplay = document.getElementById(
      "cf-flip-height-value-display"
    ); // ++

    // preview area
    this.elements.previewArea = document.getElementById("cf-preview-area");
    this.elements.previewPlaceholder = document.getElementById(
      "cf-preview-placeholder"
    );
    this.elements.previewError = document.getElementById("cf-preview-error");

    const ok =
      this.elements.containerSelectorInput &&
      this.elements.triggerRadios.length &&
      this.elements.directionRadios.length &&
      this.elements.speedSlider &&
      this.elements.animationStyleSelect &&
      this.elements.borderRadiusInput &&
      this.elements.flipHeightSlider && // ++
      this.elements.previewArea;

    if (!ok && this.elements.generateButton) {
      this.elements.generateButton.disabled = true;
      this.elements.generateButton.title =
        "Ошибка: не найдены все элементы интерфейса генератора.";
    }
  }

  /* ===== События ===== */
  bindEvents() {
    super.bindEvents();

    // Группируем элементы, изменение которых требует обновления превью И условного UI
    const dependants = [
      this.elements.speedSlider, // ++ Добавляем Slider
      ...this.elements.triggerRadios,
      ...this.elements.directionRadios,
      this.elements.animationStyleSelect,
      this.elements.borderRadiusInput, // ++
      this.elements.flipHeightSlider, // ++
    ];

    dependants.forEach((el) => {
      if (!el) return;
      const evt =
        el.tagName === "SELECT" ||
        el.type === "radio" ||
        el.type === "range" ||
        el.type === "number"
          ? "change" // Используем change для ползунков и number для фиксации значения
          : "input"; // input для мгновенной реакции, если нужно будет
      el.addEventListener(evt, this._debouncedUpdatePreview); // Обновляем превью
    });

    // Слушатели для обновления условного UI (без debounce)
    this.elements.directionRadios.forEach((radio) =>
      radio.addEventListener("change", () => this._updateConditionalUI())
    );
    this.elements.animationStyleSelect?.addEventListener("change", () =>
      this._updateConditionalUI()
    );

    // ++ Отдельные слушатели для обновления текстовых значений слайдеров
    this.elements.speedSlider?.addEventListener(
      "input",
      this._boundUpdateSpeedSliderDisplay
    );
    this.elements.flipHeightSlider?.addEventListener(
      "input",
      this._boundUpdateHeightSliderDisplay
    );

    this._bindPreviewTrigger();
  }

  /**
   * @override
   * Удаляет обработчики событий.
   */
  unbindEvents() {
    // ++ Удаляем слушатели для текстовых значений слайдеров
    this.elements.speedSlider?.removeEventListener(
      "input",
      this._boundUpdateSpeedSliderDisplay
    );
    this.elements.flipHeightSlider?.removeEventListener(
      "input",
      this._boundUpdateHeightSliderDisplay
    );
    // ++ Удаляем слушатели для условного UI
    this.elements.directionRadios.forEach((radio) =>
      radio.removeEventListener("change", () => this._updateConditionalUI())
    );
    this.elements.animationStyleSelect?.removeEventListener("change", () =>
      this._updateConditionalUI()
    );

    // ... остальные removeEventListener из предыдущей версии ...
    super.unbindEvents();
  }

  /* ===== Стартовые настройки ===== */
  setInitialState() {
    super.setInitialState();
    if (this.elements.speedSlider) this.elements.speedSlider.value = 750; // ++ Ставим значение по умолчанию для слайдера
    document.querySelector(
      'input[name="cf-trigger"][value="click"]'
    ).checked = true;
    document.querySelector(
      'input[name="cf-direction"][value="horizontal"]'
    ).checked = true;
    if (this.elements.animationStyleSelect)
      this.elements.animationStyleSelect.value = "default";
    if (this.elements.borderRadiusInput)
      this.elements.borderRadiusInput.value = 8;
    if (this.elements.flipHeightSlider)
      this.elements.flipHeightSlider.value = 50; // ++
    this._updateSpeedSliderDisplay(); // ++ Обновляем отображение
    this._updateHeightSliderDisplay(); // ++ Обновляем отображение
    this._updateConditionalUI(); // ++ Применяем условное отображение
    this._updatePreview();
  }

  /**
   * Обновляет видимость настроек "Стиль анимации" и "Высота подъема"
   * в зависимости от выбранного направления и стиля.
   * @private
   */
  _updateConditionalUI() {
    const direction = document.querySelector(
      'input[name="cf-direction"]:checked'
    )?.value;
    const style = this.elements.animationStyleSelect?.value;

    const showStyle = direction === "horizontal";
    const showHeight = direction === "horizontal" && style === "default"; // Показываем высоту только для 3D

    if (this.elements.animationStyleGroup) {
      this.elements.animationStyleGroup.style.display = showStyle ? "" : "none";
    }
    if (this.elements.flipHeightGroup) {
      this.elements.flipHeightGroup.style.display = showHeight ? "" : "none";
    }

    // Обновляем превью, если видимость изменилась, т.к. это может повлиять
    // на применяемую анимацию (если стиль скрыт, он не будет 'flat')
    // this._debouncedUpdatePreview(); // Не нужно, т.к. вызывается из слушателей, которые и так обновляют превью
    this._updatePreview();
  }

  /* ===== Сбор данных из формы ===== */
  collectData() {
    const containerSelector = this.elements.containerSelectorInput?.value
      .trim()
      .replace(/^\./, "");
    const trigger =
      document.querySelector('input[name="cf-trigger"]:checked')?.value ||
      "click";
    const direction =
      document.querySelector('input[name="cf-direction"]:checked')?.value ||
      "horizontal";

    const duration = parseInt(this.elements.speedSlider?.value, 10) || 750; // ++ Читаем слайдер скорости
    const animationStyle =
      direction === "horizontal"
        ? this.elements.animationStyleSelect?.value || "default"
        : "default"; // ++ Читаем стиль, только если Горизонтально
    const borderRadius = parseInt(this.elements.borderRadiusInput?.value, 10); // ++
    const flipHeightPercent =
      parseInt(this.elements.flipHeightSlider?.value, 10) || 50; // ++

    const rx = /^[a-zA-Z0-9_-]+$/;
    if (!containerSelector) {
      this.showErrorModal("Укажите CSS‑класс основного блока‑контейнера.");
      return null;
    }
    if (!rx.test(containerSelector)) {
      this.showErrorModal(
        `Класс \"${containerSelector}\" содержит недопустимые символы.`
      );
      return null;
    }

    // Валидация числовых значений
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
      borderRadius: validateNumber(borderRadius, 0, 1000, 8), // Макс. радиус 1000px
      flipHeightPercent: validateNumber(flipHeightPercent, 0, 100, 50), // Высота 0-100%
    };
  }

  /* ===== Обновление превью ===== */
  _updatePreview() {
    const { previewArea, previewPlaceholder, previewError } = this.elements;
    if (!previewArea) return;

    // ждём регистрации web‑компонента один раз
    if (!window.customElements.get("flip-card")) {
      if (previewPlaceholder)
        previewPlaceholder.textContent = "Загрузка компонента...";
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
      return;
    }

    if (previewPlaceholder) previewPlaceholder.style.display = "none";
    if (previewError) previewError.style.display = "none";

    const trigger =
      document.querySelector('input[name="cf-trigger"]:checked')?.value ||
      "click";
    const direction =
      document.querySelector('input[name="cf-direction"]:checked')?.value ||
      "horizontal";

    const duration = parseInt(this.elements.speedSlider?.value, 10) || 750; // ++
    const animationStyle =
      this.elements.animationStyleSelect?.value || "default";
    const borderRadius = parseInt(this.elements.borderRadiusInput?.value, 10); // ++
    const flipHeightPercent =
      parseInt(this.elements.flipHeightSlider?.value, 10) || 50; // ++

    // Конвертируем % высоты в em (0-100% -> 0-40em)
    const flipHeightEm = (flipHeightPercent / 100) * 40;

    // пересоздаём flip‑card
    if (this.previewFlipCard && previewArea.contains(this.previewFlipCard)) {
      this._removePreviewTrigger();
      this.previewFlipCard.remove();
    }

    this.previewFlipCard = document.createElement("flip-card");
    const front = document.createElement("section");
    front.slot = "front";
    const back = document.createElement("section");
    back.slot = "back";
    this.previewFlipCard.append(front, back);
    // ++ Применяем новые стили к превью
    this.previewFlipCard.style.setProperty("--flip-duration", `${duration}ms`);
    // Устанавливаем радиус ПРЯМО на flip-card в превью
    this.previewFlipCard.style.borderRadius = `${
      isNaN(borderRadius) ? 8 : borderRadius
    }px`;
    this.previewFlipCard.style.setProperty(
      "--flip-height",
      `${flipHeightEm}em`
    );
    // Толщину больше не ставим this.previewFlipCard.style.setProperty("--card-depth", ...);
    this.previewFlipCard.style.setProperty("--corner-granularity", "8"); // Ставим значение по умолчанию
    previewArea.appendChild(this.previewFlipCard);
    this.previewTriggerElement = this.previewFlipCard; // Триггер на самой карточке в превью

    // кастомная вертикальная анимация
    if (direction === "vertical") {
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
      // ++ Плоская горизонтальная
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
      // Сброс на дефолтную анимацию библиотеки (если был применен кастомный)
      // Библиотека не предоставляет явного метода сброса,
      // но при пересоздании элемента <flip-card> (что мы и делаем выше),
      // она будет использовать свою дефолтную анимацию.
      // Дополнительных действий здесь не нужно.
    }

    this._bindPreviewTrigger(trigger);

    // Установим фокус на карточку для проверки клавиатуры в превью
    this.previewFlipCard.setAttribute("tabindex", "0");
  }

  /**
   * Обновляет текстовое отображение для слайдера скорости.
   * @private
   */
  _updateSpeedSliderDisplay() {
    if (this.elements.speedSlider && this.elements.speedValueDisplay) {
      const value = this.elements.speedSlider.value;
      this.elements.speedValueDisplay.textContent = `${value}мс`;
    }
  }

  /**
   * Обновляет текстовое отображение для слайдера высоты подъема.
   * @private
   */
  _updateHeightSliderDisplay() {
    if (
      this.elements.flipHeightSlider &&
      this.elements.flipHeightValueDisplay
    ) {
      const value = this.elements.flipHeightSlider.value;
      this.elements.flipHeightValueDisplay.textContent = `${value}%`;
    }
  }

  /* ===== Preview trigger helpers ===== */
  _bindPreviewTrigger(triggerType) {
    if (!this.previewTriggerElement || !this.previewFlipCard) return;
    this._removePreviewTrigger();

    const card = this.previewFlipCard;
    let isBusy = false;

    const flip = () => {
      if (isBusy) return;
      isBusy = true;
      card.flip();
      setTimeout(
        () => (isBusy = false),
        parseFloat(
          getComputedStyle(card).getPropertyValue("--flip-duration")
        ) || 750
      );
    };

    if (triggerType === "hover") {
      this._previewHoverEnter = () => !card.facedown && flip();
      this._previewHoverLeave = () => card.facedown && flip();
      this.previewTriggerElement.addEventListener(
        "mouseenter",
        this._previewHoverEnter
      );
      this.previewTriggerElement.addEventListener(
        "mouseleave",
        this._previewHoverLeave
      );
    } else {
      this._previewFlipAction = flip;
      this.previewTriggerElement.addEventListener(
        "click",
        this._previewFlipAction
      );
      this.previewTriggerElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          // Не даем прокручиваться странице при пробеле, если фокус на карточке превью
          e.preventDefault();
          flip();
        }
      });
    }
  }

  /**
   * @override
   * Переопределяем для проверки валидации *до* генерации/копирования.
   */
  generateAndCopyCode() {
    console.log("[CardFlipGenerator] Попытка генерации кода...");
    const settings = this.collectData(); // Вызываем наш метод сбора данных и валидации

    // Если collectData вернул null (из-за ошибки валидации), прерываем выполнение
    if (settings === null) {
      console.warn(
        "[CardFlipGenerator] Генерация кода прервана из-за ошибки валидации."
      );
      return; // Прерываем выполнение
    }

    // Если данные собраны успешно, продолжаем как в базовом классе
    console.log("[CardFlipGenerator] Данные собраны, генерируем код...");
    const code = this.generateCode(settings);

    if (this.elements.jsCode) {
      this.elements.jsCode.textContent = code;
    }
    this.copyAndNotify(code); // Вызываем копирование и показ модалки успеха
  }

  /**
   * @override
   * Генерирует JavaScript-код и CSS для инициализации Card Flip.
   * @param {object} settings - Настройки, собранные из collectData.
   * @returns {string} Строка с HTML-кодом (<style> и <script>).
   */
  generateCode(settings) {
    if (!settings) {
      console.error(
        "CardFlipGenerator: Ошибка - нет настроек для генерации кода."
      );
      return "";
    }

    const configJson = JSON.stringify(settings, null, 2);
    // Убедимся, что animationStyle передается
    console.log("Generating code with settings:", settings);
    const flipCardCDN = "https://unpkg.com/@auroratide/flip-card/lib/define.js";
    const containerClass = settings.containerSelector; // Класс основного контейнера

    // --- Генерируем CSS для предотвращения FOUC ---
    let styleRules = []; // Собираем правила в массив
    if (settings.showBackInitially) {
      // Если изначально показываем заднюю сторону, скрываем переднюю
      styleRules.push(`
.${containerClass} > .flip-front { display: none !important; }
.${containerClass} > .flip-back { display: block !important; } /* На всякий случай */
      `);
    } else {
      // Иначе (по умолчанию) скрываем заднюю сторону
      styleRules.push(`
.${containerClass} > .flip-back { display: none !important; }
.${containerClass} > .flip-front { display: block !important; } /* На всякий случай */
      `);
    }

    // Добавляем стили для контейнера на время инициализации, чтобы избежать дергания высоты
    styleRules.push(`
.${containerClass}:not([data-taptop-flip-card-initialized="true"]) {
    /* Можно добавить временный min-height, если известна примерная высота,
       но лучше положиться на размеры, заданные в Taptop.
       Главное - скрыть одну из сторон */
    overflow: hidden; /* Скроем возможное вылезание контента до инициализации */
}
    `);

    // --- НОВОЕ CSS правило для компенсации при вертикальном перевороте ---
    styleRules.push(`
.${containerClass}.cf-vertical flip-card > section[slot="back"] {
    transform: scale(-1); /* зеркалим back-слот ВСЕГДА, как советует автор lib */
}
    `);
    // --- Конец нового CSS ---

    const styleBlock = `<style>\n${styleRules.join("\n").trim()}\n</style>`;
    // --- Конец генерации CSS ---

    const scriptContent = `
/**
 * Taptop Card Flip Extension
 * Generated on: ${new Date().toISOString()}
 * Configuration:
 * Container: .${settings.containerSelector}
 * Trigger: ${settings.trigger}
 * Direction: ${settings.direction}
 * Style: ${settings.animationStyle}
 */
/**
 * Динамически загружает скрипт библиотеки @auroratide/flip-card, если он еще не загружен.
 * Гарантирует, что пользовательский элемент 'flip-card' будет зарегистрирован перед вызовом callback.
 * @param {string} cdnUrl - URL CDN библиотеки.
 * @param {Function} callback - Функция, которая будет вызвана после загрузки и регистрации компонента.
 */
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

/**
 * Находит основной контейнер и внутренние элементы .flip-front, .flip-back.
 * @param {string} selector - CSS-селектор основного контейнера.
 * @param {number} index - Индекс контейнера (для логов).
 * @param {string} instanceId - Уникальный ID экземпляра (для логов).
 * @returns {object|null} Объект с элементами или null при ошибке.
 */
function _findFlipElements(selector, index, instanceId) {
    const container = document.querySelector(\`\${selector}:nth-of-type(\${index + 1})\`); // Более точный поиск по индексу не сработает с querySelectorAll, используем общий селектор
     // Нужен альтернативный способ идентификации, если классы одинаковые. Пока ищем просто по селектору.
     // Используем index только для логов. Лучше, если пользователь будет давать уникальные классы или ID.
     // Но по ТЗ - только классы. Будем инициализировать все найденные.
     // Вернемся к поиску одного элемента, т.к. forEach ниже перебирает containers
     // const container = containers[index]; // Это не сработает, т.к. функция вызывается не из цикла

     // --- Возвращаем логику поиска ---
     const currentContainer = document.querySelectorAll('.' + selector)[index];
     if (!currentContainer) {
        console.error(\`[FlipCard Init] \${instanceId}: Не удалось найти контейнер по индексу \${index}.\`);
        return null;
     }

     if (currentContainer.dataset.taptopFlipCardInitialized === 'true') {
        console.warn(\`[FlipCard Init] \${instanceId}: Контейнер уже инициализирован.\`);
        return null;
     }
     const frontEl = currentContainer.querySelector('.flip-front');
     const backEl = currentContainer.querySelector('.flip-back');

     if (!frontEl) {
        console.error(\`[FlipCard Init] \${instanceId}: Не найден элемент '.flip-front'.\`);
        return null;
     }
     if (!backEl) {
        console.error(\`[FlipCard Init] \${instanceId}: Не найден элемент '.flip-back'.\`);
        return null;
     }
      console.log(\`[FlipCard Init] \${instanceId}: Найдены .flip-front и .flip-back.\`);
      return { container: currentContainer, frontEl, backEl };
}

/**
 * Создает и настраивает базовый элемент <flip-card>.
 * @param {object} config - Конфигурация.
 * @returns {HTMLElement} Созданный элемент <flip-card>.
 */
function _createFlipCardElement(config) {
    const flipCardElement = document.createElement('flip-card');
    flipCardElement.style.setProperty('--flip-duration', \`\${config.duration || 750}ms\`);
    if (config.showBackInitially) {
        flipCardElement.setAttribute('facedown', '');
    }
    // ++ Устанавливаем стили из настроек генератора
    if (config.borderRadius != null) flipCardElement.style.borderRadius = config.borderRadius + 'px';
    return flipCardElement;
}

/**
 * Назначает атрибуты slot существующим элементам frontEl и backEl
 * и перемещает их внутрь flipCardElement.
 * @param {HTMLElement} frontEl - Оригинальный элемент .flip-front.
 * @param {HTMLElement} backEl - Оригинальный элемент .flip-back.
 * @param {HTMLElement} flipCardElement - Целевой элемент <flip-card>.
 */
function _assignSlotsAndAppend(frontEl, backEl, flipCardElement) {
    if (frontEl) {
        frontEl.setAttribute('slot', 'front'); // Назначаем слот существующему элементу
        // Отсоединяем от старого родителя (на всякий случай, если appendChild не делает этого автоматически)
        // const parent = frontEl.parentNode;
        // if (parent) parent.removeChild(frontEl); // Это может быть излишним, appendChild обычно перемещает
        flipCardElement.appendChild(frontEl); // Добавляем существующий элемент в flip-card
         console.log('[FlipCard Slot] Назначен slot="front" существующему .flip-front и добавлен в flip-card.');
    } else {
        console.error('[FlipCard Slot] Оригинальный элемент .flip-front не найден!');
    }

    if (backEl) {
        backEl.setAttribute('slot', 'back'); // Назначаем слот существующему элементу
        // const parent = backEl.parentNode;
        // if (parent) parent.removeChild(backEl); // См. комментарий выше
        flipCardElement.appendChild(backEl); // Добавляем существующий элемент в flip-card
        console.log('[FlipCard Slot] Назначен slot="back" существующему .flip-back и добавлен в flip-card.');
    } else {
        console.error('[FlipCard Slot] Оригинальный элемент .flip-back не найден!');
    }
    // Не нужно удалять frontEl/backEl, так как они теперь внутри flipCardElement
}

/**
 * Инициализирует одну карточку Taptop Card Flip.
 * @param {object} config - Объект конфигурации для этой карточки.
 */
function initFlipCards(config) { // Переименовываем функцию
    // Находим ВСЕ контейнеры с указанным классом
    // Используем try...catch на случай невалидного селектора
    try {
       const containers = document.querySelectorAll('.' + config.containerSelector);

       if (containers.length === 0) {
           console.warn(\`[FlipCard Init] Не найдено ни одного контейнера с классом '\${config.containerSelector}'. Убедитесь, что класс указан верно и элементы существуют на странице.\`);
           return;
       }
       console.log(\`[FlipCard Init] Найдено контейнеров для инициализации: \${containers.length}\`);

    containers.forEach((container, index) => {
        const instanceId = \`\${config.containerSelector}-\${index}\`; // Уникальный ID для логов
        // Переносим логику поиска внутрь цикла и используем текущий 'container'
        if (container.dataset.taptopFlipCardInitialized === 'true') {
            console.warn(\`[FlipCard Init] \${instanceId}: Контейнер уже инициализирован. Пропускаем.\`);
            return; // Используем continue для forEach
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

        const flipCardElement = _createFlipCardElement(config); // Создаем <flip-card>
        _assignSlotsAndAppend(frontEl, backEl, flipCardElement); // Перемещаем ОРИГИНАЛЬНЫЕ .flip-front/.flip-back ВНУТРЬ <flip-card>
        container.appendChild(flipCardElement);
        // ++ Устанавливаем border-radius на flip-card ЭЛЕМЕНТ после добавления в DOM
        if (config.borderRadius != null && config.borderRadius >= 0) {
           flipCardElement.style.borderRadius = config.borderRadius + 'px';
        }
        console.log(\`[FlipCard Init] \${instanceId}: <flip-card> создан и добавлен.\`);

        const flipAction = () => {
            // Убедимся, что flipCardElement все еще в DOM
            const currentFlipCard = container.querySelector('flip-card');
            if (currentFlipCard && currentFlipCard.flip) {
                currentFlipCard.flip();
                // Обновляем aria-pressed принудительно, если есть слушатели,
                // так как атрибут facedown может обновиться не мгновенно
                const isFlippingToBack = !currentFlipCard.hasAttribute('facedown');
                container.setAttribute('aria-pressed', isFlippingToBack ? 'true' : 'false');
                // Состояние берем от реального элемента flip-card
                const isPressed = currentFlipCard.hasAttribute('facedown');
                container.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
                // Добавляем/удаляем класс для вертикальной компенсации
                if (config.direction === 'vertical') {
                    container.classList.toggle('cf-vertical-flipped', isPressed);
                } else {
                     container.classList.remove('cf-vertical-flipped'); // Убираем на всякий случай для горизонтального
                }
                console.log(\`[FlipCard Action] \${instanceId}: Карточка перевернута. facedown:\`, isPressed);
            } else {
                console.warn(\`[FlipCard Action] \${instanceId}: Экземпляр flip-card не найден или не имеет метода flip.\`);
            }
        };

        // Удаляем старые обработчики перед добавлением новых (более надежный способ)
        const storedListeners = container.__taptopFlipListeners || {};
        if (storedListeners.click) container.removeEventListener('click', storedListeners.click);
        if (storedListeners.keydown) container.removeEventListener('keydown', storedListeners.keydown);
        if (storedListeners.mouseenter) container.removeEventListener('mouseenter', storedListeners.mouseenter);
        if (storedListeners.mouseleave) container.removeEventListener('mouseleave', storedListeners.mouseleave);
        if (storedListeners.focus) container.removeEventListener('focus', storedListeners.focus);
        if (storedListeners.blur) container.removeEventListener('blur', storedListeners.blur);

        container.__taptopFlipListeners = {}; // Сбрасываем

        if (config.trigger === 'click') {
            console.log(\`[FlipCard Trigger] \${instanceId}: Click + Keydown\`);
            let isFlipping = false;
            const clickHandler = () => {
                if (isFlipping) return;
                isFlipping = true;
                flipAction();
                setTimeout(() => isFlipping = false, config.duration);
            };
            const keydownHandler = (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    flipAction();
                }
            };
            container.addEventListener('click', clickHandler);
            container.addEventListener('keydown', keydownHandler);
            container.__taptopFlipListeners = { click: clickHandler, keydown: keydownHandler };

        } else if (config.trigger === 'hover') {
            console.log(\`[FlipCard Trigger] \${instanceId}: Hover + Keydown (Focus)\`);
            let isFlipping = false;
            let flipTimeout;

            const mouseEnterHandler = () => {
               if (!isFlipping && flipCardElement && !flipCardElement.hasAttribute('facedown')) {
                  clearTimeout(flipTimeout); isFlipping = true;
                  console.log('[FlipCard Hover] Mouse enter -> flip to back');
                  flipAction();
                  flipTimeout = setTimeout(() => { isFlipping = false; }, config.duration);
               }
            };
            const mouseLeaveHandler = () => {
                if (!isFlipping && flipCardElement && flipCardElement.hasAttribute('facedown')) {
                  clearTimeout(flipTimeout); isFlipping = true;
                  console.log('[FlipCard Hover] Mouse leave -> flip to front');
                  flipAction();
                  flipTimeout = setTimeout(() => { isFlipping = false; }, config.duration);
               }
            };
            const focusHandler = () => container.classList.add('hover-active');
            const blurHandler = () => container.classList.remove('hover-active');
            const keydownHandler = (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    flipAction();
                }
            };

            container.addEventListener('mouseenter', mouseEnterHandler);
            container.addEventListener('mouseleave', mouseLeaveHandler);
            container.addEventListener('focus', focusHandler);
            container.addEventListener('blur', blurHandler);
            container.addEventListener('keydown', keydownHandler);
            container.__taptopFlipListeners = {
                mouseenter: mouseEnterHandler, mouseleave: mouseLeaveHandler,
                focus: focusHandler, blur: blurHandler, keydown: keydownHandler
            };
        }

        // Применяем кастомную анимацию, если нужно
        if (config.direction === 'vertical' && flipCardElement.setFlipToFrontAnimation) {
             _applyVerticalAnimation(flipCardElement);
             console.log(\`[FlipCard Init] \${instanceId}: Установлена вертикальная анимация.\`);
        } else if (config.direction === 'horizontal' && config.animationStyle === 'flat' && flipCardElement.setFlipToFrontAnimation) {
             // ++ Применяем плоскую горизонтальную анимацию
             const kfFront = [ { transform: "rotateY(180deg)" }, { transform: "rotateY(270deg)" }, { transform: "rotateY(360deg)" } ];
             const kfBack = [ { transform: "rotateY(0deg)" }, { transform: "rotateY(90deg)" }, { transform: "rotateY(180deg)" } ];
             const opts = { easing: "ease-in-out" };
             flipCardElement.setFlipToFrontAnimation(kfFront, opts);
             flipCardElement.setFlipToBackAnimation(kfBack, opts);
             console.log(\`[FlipCard Init] \${instanceId}: Установлена плоская горизонтальная анимация.\`);
        } else {
             // Для 'horizontal' + 'default' ничего не делаем, используется анимация библиотеки
             _resetToHorizontalAnimation(flipCardElement); // Убираем стили, если были
             console.log(\`[FlipCard Init] \${instanceId}: Используется стандартная горизонтальная анимация.\`);
        }

        if (config.borderRadius != null && config.borderRadius >= 0) {
           flipCardElement.style.borderRadius = config.borderRadius + 'px';
        }
        // -- Удаляем установку --card-depth flipCardElement.style.setProperty('--card-depth', ...);
        const flipHeightEm = ((config.flipHeightPercent != null ? config.flipHeightPercent : 50) / 100) * 40; // 0-100% -> 0-40em
        flipCardElement.style.setProperty('--flip-height', \`\${flipHeightEm}em\`);
        flipCardElement.style.setProperty('--corner-granularity', '8'); // Ставим разумное значение по умолчанию

        // Устанавливаем атрибуты доступности в самом конце,
        // чтобы быть уверенными, что они не будут перезаписаны DOM-манипуляциями
        container.setAttribute('tabindex', '0');
        container.style.cursor = 'pointer'; // Можно оставить для визуальной подсказки
        container.setAttribute('role', 'button');
        // aria-pressed обновляется в flipAction, здесь устанавливаем начальное/конечное
        container.setAttribute('aria-pressed', flipCardElement.hasAttribute('facedown') ? 'true' : 'false');
        container.setAttribute('aria-label', 'Перевернуть карточку');
        // <<< КОНЕЦ ПЕРЕМЕЩЕННОГО БЛОКА >>>

        container.dataset.taptopFlipCardInitialized = 'true'; // Помечаем контейнер как инициализированный
        console.log(\`[FlipCard Init] \${instanceId}: Инициализация завершена.\`);
    }); // Конец forEach
   } catch (e) {
        console.error(\`[FlipCard Init] Ошибка при поиске или инициализации контейнеров ('\${config.containerSelector}'):\`, e);
   }
}

/**
 * Применяет кастомную вертикальную анимацию к элементу flip-card.
 * @param {HTMLElement} flipCardElement - Элемент <flip-card>.
 */
function _applyVerticalAnimation(flipCardElement) {
     if (!flipCardElement?.setFlipToFrontAnimation) return;
     const vKF = [{ transform: "rotateX(180deg)" },{ transform: "rotateX(270deg)" },{ transform: "rotateX(360deg)" }];
     const vKB = [{ transform: "rotateX(0deg)" },{ transform: "rotateX(90deg)" },{ transform: "rotateX(180deg)" }];
     const opts = { easing: "ease-in-out" };
     flipCardElement.setFlipToFrontAnimation(vKF, opts);
     flipCardElement.setFlipToBackAnimation(vKB, opts);
}

/**
 * Сбрасывает кастомную анимацию к стандартной горизонтальной библиотеки.
 * @param {HTMLElement} flipCardElement - Элемент <flip-card>.
 */
function _resetToHorizontalAnimation(flipCardElement) {
    // Здесь должен быть код для сброса анимации, если библиотека предоставляет такой метод
    // Но на данный момент библиотека не предоставляет такой функциональности
    // При пересоздании элемента flip-card он получает стандартную анимацию
}

// Инициализация после загрузки библиотеки и DOM
document.addEventListener('DOMContentLoaded', () => {
     // Передаем URL CDN и функцию инициализации
     loadFlipCardLibrary('${flipCardCDN}', () => {
        const currentConfig = ${configJson}; // Используем актуальные настройки
        initFlipCards(currentConfig); // Вызываем новую функцию инициализации
    });
});
    `;

    // Возвращаем объединенный CSS и JS
    return `${styleBlock}\n<script type="module">\n${scriptContent}\n</script>\n`;
  }

  /**
   * Удаляет слушатели событий с элемента превью.
   * @private
   */
  _removePreviewTrigger() {
    if (!this.previewTriggerElement) return;
    // Удаляем все возможные слушатели
    if (this._previewFlipAction) {
      this.previewTriggerElement.removeEventListener(
        "click",
        this._previewFlipAction
      );
      this.previewTriggerElement.removeEventListener(
        "keydown",
        this._handlePreviewKeydown
      );
    }
    if (this._previewHoverEnter)
      this.previewTriggerElement.removeEventListener(
        "mouseenter",
        this._previewHoverEnter
      );
    if (this._previewHoverLeave)
      this.previewTriggerElement.removeEventListener(
        "mouseleave",
        this._previewHoverLeave
      );
    // Обнуляем сохраненные функции
    this._previewFlipAction = null;
    this._previewHoverEnter = null;
    this._previewHoverLeave = null;
  }
} // Конец класса CardFlipGenerator
