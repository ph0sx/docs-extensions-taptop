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

export class CardFlipGenerator extends BaseGenerator {
  constructor() {
    super();
    this.previewFlipCard = null;
    this.previewTriggerElement = null;
    this._boundUpdateSpeedSliderDisplay =
      this._updateSpeedSliderDisplay.bind(this); //
    this._boundUpdateHeightSliderDisplay =
      this._updateHeightSliderDisplay.bind(this); //
    this._debouncedUpdatePreview = debounce(this._updatePreview.bind(this));
    this._boundUpdateConditionalUI = this._updateConditionalUI.bind(this);
    this._previewUpdateControls = []; // Инициализация свойства для зависимых контролов
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
    this.elements.speedSlider = document.getElementById("cf-speed-slider"); //  Замена Select на Slider
    this.elements.speedSliderGroup =
      this.elements.speedSlider?.closest(".setting-group"); //  Находим родителя
    this.elements.speedValueDisplay = document.getElementById(
      "cf-speed-value-display"
    ); //
    this.elements.animationStyleSelect =
      document.getElementById("cf-animation-style");
    this.elements.animationStyleGroup =
      this.elements.animationStyleSelect?.closest(".setting-group"); //  Находим родителя
    this.elements.borderRadiusInput =
      document.getElementById("cf-border-radius"); //
    this.elements.flipHeightSlider = document.getElementById("cf-flip-height"); //
    this.elements.flipHeightGroup =
      this.elements.flipHeightSlider?.closest(".setting-group"); //  Находим родителя
    this.elements.flipHeightValueDisplay = document.getElementById(
      "cf-flip-height-value-display"
    ); //

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
      this.elements.flipHeightSlider && //
      this.elements.previewArea;

    if (!ok && this.elements.generateButton) {
      this.elements.generateButton.disabled = true;
      this.elements.generateButton.title =
        "Ошибка: не найдены все элементы интерфейса генератора.";
    }

    // Заполняем массив _previewUpdateControls после того, как все элементы найдены
    this._previewUpdateControls = [
      this.elements.speedSlider,
      ...(this.elements.triggerRadios || []), // NodeList не будет null, но для единообразия примера
      ...(this.elements.directionRadios || []),
      this.elements.animationStyleSelect,
      this.elements.borderRadiusInput,
      this.elements.flipHeightSlider,
    ].filter((el) => el); // Фильтруем null/undefined элементы, если они могли бы быть
  }

  /* ===== События ===== */
  bindEvents() {
    super.bindEvents();

    // Группируем элементы, изменение которых требует обновления превью И условного UI
    this._previewUpdateControls.forEach((el) => {
      // if (!el) return; // Уже не нужно, если отфильтровано в findElements
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
      radio.addEventListener("change", this._boundUpdateConditionalUI)
    );
    this.elements.animationStyleSelect?.addEventListener(
      "change",
      this._boundUpdateConditionalUI
    );

    //  Отдельные слушатели для обновления текстовых значений слайдеров
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
    //  Удаляем слушатели для текстовых значений слайдеров
    this.elements.speedSlider?.removeEventListener(
      "input",
      this._boundUpdateSpeedSliderDisplay
    );
    this.elements.flipHeightSlider?.removeEventListener(
      "input",
      this._boundUpdateHeightSliderDisplay
    );
    //  Удаляем слушатели для условного UI
    this.elements.directionRadios.forEach((radio) =>
      radio.removeEventListener("change", this._boundUpdateConditionalUI)
    );
    this.elements.animationStyleSelect?.removeEventListener(
      "change",
      this._boundUpdateConditionalUI
    );

    // Удаляем обработчики для элементов, влияющих на превью
    this._previewUpdateControls.forEach((el) => {
      // if (!el) return; // Уже не нужно, если отфильтровано
      const evt =
        el.tagName === "SELECT" ||
        el.type === "radio" ||
        el.type === "range" ||
        el.type === "number"
          ? "change"
          : "input";
      el.removeEventListener(evt, this._debouncedUpdatePreview);
    });
    super.unbindEvents();
  }

  /* ===== Стартовые настройки ===== */
  setInitialState() {
    super.setInitialState();
    if (this.elements.speedSlider) this.elements.speedSlider.value = 750; //  Ставим значение по умолчанию для слайдера
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
      this.elements.flipHeightSlider.value = 25; //
    this._updateSpeedSliderDisplay(); //  Обновляем отображение
    this._updateHeightSliderDisplay(); //  Обновляем отображение
    this._updateConditionalUI(); //  Применяем условное отображение
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

    const duration = parseInt(this.elements.speedSlider?.value, 10) || 750; //  Читаем слайдер скорости
    const animationStyle =
      direction === "horizontal"
        ? this.elements.animationStyleSelect?.value || "default"
        : "default"; //  Читаем стиль, только если Горизонтально
    const borderRadius = parseInt(this.elements.borderRadiusInput?.value, 10); //
    const flipHeightPercent =
      parseInt(this.elements.flipHeightSlider?.value, 10) || 25; //

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

    const duration = parseInt(this.elements.speedSlider?.value, 10) || 750; //
    const animationStyle =
      this.elements.animationStyleSelect?.value || "default";
    const borderRadius = parseInt(this.elements.borderRadiusInput?.value, 10); //
    const flipHeightPercent =
      parseInt(this.elements.flipHeightSlider?.value, 10) || 25; //

    // Конвертируем % высоты в em (0-100% -> 0-40em)
    const flipHeightEm = (flipHeightPercent / 100) * 40;

    if (this.elements.previewArea) {
      this.elements.previewArea.style.overflow = "visible";
    }

    // Элемент задней стороны для прямого манипулирования стилем в превью
    let backSlotElementPreview = null;

    // пересоздаём flip‑card
    if (this.previewFlipCard && previewArea.contains(this.previewFlipCard)) {
      this._removePreviewTrigger();
      this.previewFlipCard.remove();
    }

    // Определяем контейнер для превью, к которому можно добавлять классы состояния
    // В данном случае, будем считать, что сам previewArea является таким контейнером
    // или что previewFlipCard сам может нести этот класс для упрощения превью CSS.
    // Для большей точности симуляции, класс cf-vertical должен быть на родительском элементе flip-card.
    // Но для простоты превью, мы можем напрямую стилизовать backSlotElementPreview ниже.
    // const previewWrapper = this.elements.previewArea; // Пример
    // previewWrapper.classList.remove('cf-vertical-preview', 'cf-horizontal-preview');

    // Удаляем старые классы направления с previewArea (если они там были)
    // this.elements.previewArea.classList.remove('cf-vertical', 'cf-horizontal');

    this.previewFlipCard = document.createElement("flip-card");
    const front = document.createElement("section");
    front.slot = "front";
    const back = document.createElement("section");
    back.slot = "back";
    this.previewFlipCard.append(front, back);
    backSlotElementPreview =
      this.previewFlipCard.querySelector('[slot="back"]');
    //  Применяем новые стили к превью
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
      // this.elements.previewArea.classList.add('cf-vertical'); // Если класс нужен на previewArea
      if (backSlotElementPreview) {
        backSlotElementPreview.style.transform = "scaleY(-1)"; // Компенсируем зеркалирование
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
      // this.elements.previewArea.classList.add('cf-horizontal'); // Если класс нужен на previewArea
      //  Плоская горизонтальная
      if (backSlotElementPreview) {
        backSlotElementPreview.style.transform = ""; // Сбрасываем трансформацию для других режимов
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
      // this.elements.previewArea.classList.add('cf-horizontal'); // Если класс нужен на previewArea
      if (backSlotElementPreview) {
        backSlotElementPreview.style.transform = ""; // Сбрасываем трансформацию для других режимов
      }
      // Сброс на дефолтную анимацию библиотеки (если был применен кастомный)
      // Библиотека не предоставляет явного метода сброса,
      // но при пересоздании элемента <flip-card> (что мы и делаем выше),
      // анимации по умолчанию будут восстановлены.
      // Если бы методы setFlipToFrontAnimation/setFlipToBackAnimation принимали null или
      // был бы метод resetAnimation, мы бы использовали его здесь.
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
    this._removePreviewTrigger(); // Удаляем все старые слушатели

    const card = this.previewFlipCard; // Это наш this.previewFlipCard
    let isClickFlippingPreview = false; // Для click-режима превью

    // Переменные состояния для hover-режима превью
    let intentToFlipToBackPreview = false;
    let isAnimatingByComponentPreview = false;

    // Слушатели событий компонента для hover-режима превью
    this._previewComponentFlippingListener = (e) => {
      isAnimatingByComponentPreview = true;
    };
    this._previewComponentFlippedListener = (e) => {
      isAnimatingByComponentPreview = false;

      if (!intentToFlipToBackPreview && card.hasAttribute("facedown")) {
        card.flip();
      }
    };

    if (triggerType === "hover") {
      card.addEventListener("flipping", this._previewComponentFlippingListener);
      card.addEventListener("flipped", this._previewComponentFlippedListener);

      this._previewHoverEnter = () => {
        intentToFlipToBackPreview = true;
        if (isAnimatingByComponentPreview) return;
        if (!card.hasAttribute("facedown")) {
          card.flip();
        }
      };
      this._previewHoverLeave = () => {
        intentToFlipToBackPreview = false;
        if (isAnimatingByComponentPreview) return;
        if (card.hasAttribute("facedown")) {
          card.flip();
        }
      };
      // Привязываем к this.previewTriggerElement, который теперь this.previewFlipCard
      this.previewTriggerElement.addEventListener(
        "mouseenter",
        this._previewHoverEnter
      );
      this.previewTriggerElement.addEventListener(
        "mouseleave",
        this._previewHoverLeave
      );
      // Для превью можно не добавлять focus/blur/keydown, если это усложняет,
      // так как основная проверка этих вещей будет на реальной странице.
      // Но если хотим полной идентичности, то keydown нужен.
      this._previewKeydownAction = (e) => {
        // Общий keydown для превью
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isAnimatingByComponentPreview && triggerType === "hover") return; // Не прерываем анимацию в hover
          card.flip();
        }
      };
      this.previewTriggerElement.addEventListener(
        "keydown",
        this._previewKeydownAction
      );
    } else {
      // triggerType === 'click' (или 'hybrid' сведенный к 'click' для превью)
      this._previewClickAction = () => {
        if (isClickFlippingPreview) return;
        isClickFlippingPreview = true;
        card.flip();
      };
      // Для click-режима превью слушатели flipping/flipped нужны только для isClickFlippingPreview
      this._previewComponentClickFlippedListener = () => {
        isClickFlippingPreview = false;
      };
      card.addEventListener(
        "flipped",
        this._previewComponentClickFlippedListener
      );

      this.previewTriggerElement.addEventListener(
        "click",
        this._previewClickAction
      );
      this._previewKeydownAction = (e) => {
        // Общий keydown для превью
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isClickFlippingPreview) return;
          isClickFlippingPreview = true;
          card.flip();
        }
      };
      this.previewTriggerElement.addEventListener(
        "keydown",
        this._previewKeydownAction
      );
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
    // console.log("Generating code with settings:", settings); // Можно оставить для отладки
    const flipCardCDN = "https://unpkg.com/@auroratide/flip-card/lib/define.js";
    const containerClass = settings.containerSelector;

    let styleRules = [];
    let containerSpecificStyles = [];

    if (settings.borderRadius != null && settings.borderRadius >= 0) {
      containerSpecificStyles.push(`border-radius: ${settings.borderRadius}px`);
      containerSpecificStyles.push(`-webkit-transform-style: preserve-3d`); // Для старых Safari
      containerSpecificStyles.push(`transform-style: preserve-3d`); // Всегда нужен для 3D дочерних элементов
    }

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

    if (containerSpecificStyles.length > 0) {
      styleRules.push(
        `.${settings.containerSelector} {\n  ${containerSpecificStyles.join(
          ";\n  "
        )};\n}`
      );
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

    styleRules.push(`
.${containerClass}.cf-vertical flip-card > [slot="back"] { 
    transform: scale(-1); /* Используем scale(-1) для правильного отображения текста */
}
    `);

    const styleBlock = `<style>\n${styleRules.join("\n").trim()}\n</style>`;
    const scriptContent = `
/**
 * Taptop Card Flip Extension
 */
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
        //  Устанавливаем border-radius на flip-card ЭЛЕМЕНТ после добавления в DOM
        if (config.borderRadius != null && config.borderRadius >= 0) {
           flipCardElement.style.borderRadius = config.borderRadius + 'px';
        }
        console.log(\`[FlipCard Init] \${instanceId}: <flip-card> создан и добавлен.\`);

        let currentTrigger = config.trigger; // Изначально берем из конфига
        const hybridBreakpoint = 992;

        // Функция для привязки/перепривязки слушателей
function attachEventListeners() {
    // Сначала удаляем все возможные старые слушатели
    const oldListeners = container.__taptopFlipListeners || {};
    if (oldListeners.click) container.removeEventListener('click', oldListeners.click);
    if (oldListeners.keydown) container.removeEventListener('keydown', oldListeners.keydown);
    if (oldListeners.mouseenter) container.removeEventListener('mouseenter', oldListeners.mouseenter);
    if (oldListeners.mouseleave) container.removeEventListener('mouseleave', oldListeners.mouseleave);
    if (oldListeners.focus) container.removeEventListener('focus', oldListeners.focus);
    if (oldListeners.blur) container.removeEventListener('blur', oldListeners.blur);
    
    const cardElement = container.querySelector('flip-card'); //  Получаем сам веб-компонент
    //  Удаляем старые слушатели компонента, если они были (важно при re-attach)
    if (cardElement && cardElement.__flippingListener) {
        cardElement.removeEventListener('flipping', cardElement.__flippingListener);
    }
    if (cardElement && cardElement.__flippedListener) {
        cardElement.removeEventListener('flipped', cardElement.__flippedListener);
    }
    container.__taptopFlipListeners = {};

    if (currentTrigger === 'click') {
        let isClickFlipping = false; // Локальный флаг для клика, чтобы избежать двойного срабатывания
        const clickHandler = () => {
            if (isClickFlipping || !cardElement || typeof cardElement.flip !== 'function') return;
            isClickFlipping = true;
            cardElement.flip();
            // setTimeout не нужен, т.к. isClickFlipping сбросится в flipped
        };
        const keydownHandler = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isClickFlipping || !cardElement || typeof cardElement.flip !== 'function') return;
                isClickFlipping = true; // Используем тот же флаг
                cardElement.flip();
            }
        };
        container.addEventListener('click', clickHandler);
        container.addEventListener('keydown', keydownHandler);
        container.__taptopFlipListeners = { click: clickHandler, keydown: keydownHandler };

        // Слушатели для сброса isClickFlipping и обновления aria-pressed для click-режима
        if (cardElement) {
            const clickFlippingListener = () => { /* isClickFlipping тут не меняем, т.к. это начало */ };
            const clickFlippedListener = (e) => {
                isClickFlipping = false;
                container.setAttribute('aria-pressed', e.detail.facedown ? 'true' : 'false');
            };
            cardElement.addEventListener('flipping', clickFlippingListener);
            cardElement.addEventListener('flipped', clickFlippedListener);
            cardElement.__flippingListener = clickFlippingListener;
            cardElement.__flippedListener = clickFlippedListener;
        }

    } else if (currentTrigger === 'hover') { // Этот блок теперь обрабатывает гибридное поведение
        console.log(\`[FlipCard Trigger] \${instanceId}: Hover Logic Active (Smart Hover/Click)\`);
        if (!cardElement || typeof cardElement.flip !== 'function') {
            console.warn(\`[FlipCard Trigger] \${instanceId}: <flip-card> element not found or .flip not a function.\`);
            return;
        }

        let intentToFlipToBack = false;
        let isAnimatingByComponent = false; // Флаг, что анимация компонента СЕЙЧАС идет

        const flippingListener = (e) => {
            isAnimatingByComponent = true;
            // Обновляем aria-pressed в начале анимации
            container.setAttribute('aria-pressed', e.detail.facedown ? 'true' : 'false');
        };
        const flippedListener = (e) => {
            isAnimatingByComponent = false;
            // Обновляем aria-pressed по завершению, на всякий случай
            container.setAttribute('aria-pressed', e.detail.facedown ? 'true' : 'false');
            // После завершения анимации, если курсор уже НЕ на карточке,
            // а карточка осталась перевернутой (facedown=true), то переворачиваем обратно.
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
            if (!cardElement.hasAttribute('facedown')) { // Если сейчас лицевая сторона
                cardElement.flip();
            }
        };

        const mouseLeaveHandler = () => {
            intentToFlipToBack = false;
            if (isAnimatingByComponent) {
                return; 
            }
            if (cardElement.hasAttribute('facedown')) { // Если сейчас обратная сторона
                cardElement.flip();
            }
        };
        
        const focusHandler = () => container.classList.add('hover-active');
        const blurHandler = () => container.classList.remove('hover-active');
        
        const keydownHandler = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isAnimatingByComponent && config.trigger === 'hover') { // В hover-режиме ждем завершения анимации
                    return;
                }
                cardElement.flip();
            }
        };

        container.addEventListener('mouseenter', mouseEnterHandler);
        container.addEventListener('mouseleave', mouseLeaveHandler);
        container.addEventListener('focus', focusHandler);
        container.addEventListener('blur', blurHandler);
        container.addEventListener('keydown', keydownHandler); // Клавиатура работает и в hover
        
        container.__taptopFlipListeners = {
            mouseenter: mouseEnterHandler, mouseleave: mouseLeaveHandler,
            focus: focusHandler, blur: blurHandler, keydown: keydownHandler,
            // Сохраняем и слушатели компонента, чтобы их можно было удалить при смене режима
            componentFlipping: flippingListener, 
            componentFlipped: flippedListener
        };
    }
} // Конец attachEventListeners

        // Функция для обновления триггера на основе размера экрана (только если изначально был hover)
        const updateTriggerBasedOnScreen = () => {
            // Эта функция теперь вызывается только если config.trigger === 'hover'
            const newTriggerBasedOnWidth = window.innerWidth < hybridBreakpoint ? 'click' : 'hover';
            if (newTriggerBasedOnWidth !== currentTrigger) { // Только если РЕЖИМ изменился
                currentTrigger = newTriggerBasedOnWidth;
                console.log(\`[FlipCard Trigger Update] \${instanceId}: Mode switched to \${currentTrigger}. Re-attaching listeners.\`);
                attachEventListeners(); // Перепривязываем слушатели для нового режима
            }
            // Если режим не изменился, слушатели уже должны быть корректно привязаны предыдущим вызовом attachEventListeners.
        };
        if (config.trigger === 'hover') {
            // Удаляем классы направления перед новой установкой, если они могли быть
            container.classList.remove('cf-horizontal', 'cf-vertical');
            // Применяем класс направления в зависимости от currentTrigger (который может стать click)
            // или лучше основываться на config.direction для установки cf-vertical/cf-horizontal
            // Устанавливаем НАЧАЛЬНЫЙ currentTrigger на основе текущей ширины экрана
            currentTrigger = window.innerWidth < hybridBreakpoint ? 'click' : 'hover';
            console.log(\`[FlipCard Init] \${instanceId}: Initial trigger mode for hover config: \${currentTrigger}.\`);
            attachEventListeners(); // Привязываем слушатели для начального режима
            // Удаляем предыдущий resize listener, если он был
            if (container.__taptopResizeListener) {
                window.removeEventListener('resize', container.__taptopResizeListener);
            }
            container.__taptopResizeListener = debounce(updateTriggerBasedOnScreen, 200);
            window.addEventListener('resize', container.__taptopResizeListener);
        } else { // Если trigger === 'click'
            // Удаляем классы направления перед новой установкой
            container.classList.remove('cf-horizontal', 'cf-vertical');
            currentTrigger = 'click';
            attachEventListeners(); // Обычная привязка
        }

        // Устанавливаем классы направления и специфичные для направления стили/анимации
        // Это должно происходить ПОСЛЕ определения currentTrigger и attachEventListeners,
        // но ДО применения анимаций.
        const backSlotInGeneratedCard = flipCardElement.querySelector('[slot="back"]'); // Используем [slot="back"]

        // Применяем кастомную анимацию, если нужно
        if (config.direction === 'vertical' && flipCardElement.setFlipToFrontAnimation) {
             container.classList.add('cf-vertical'); // Добавляем класс для CSS правила
             _applyVerticalAnimation(flipCardElement);
             console.log(\`[FlipCard Init] \${instanceId}: Установлена вертикальная анимация.\`);
        } else if (config.direction === 'horizontal' && config.animationStyle === 'flat' && flipCardElement.setFlipToFrontAnimation) {
             container.classList.add('cf-horizontal'); // Добавляем класс для консистентности
             const kfFront = [ { transform: "rotateY(180deg)" }, { transform: "rotateY(270deg)" }, { transform: "rotateY(360deg)" } ];
             const kfBack = [ { transform: "rotateY(0deg)" }, { transform: "rotateY(90deg)" }, { transform: "rotateY(180deg)" } ];
             const opts = { easing: "ease-in-out" };
             flipCardElement.setFlipToFrontAnimation(kfFront, opts);
             flipCardElement.setFlipToBackAnimation(kfBack, opts);
             console.log(\`[FlipCard Init] \${instanceId}: Установлена плоская горизонтальная анимация.\`);
        } else {
             container.classList.add('cf-horizontal'); // Режим по умолчанию - горизонтальный
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
         if (config.trigger === 'hover') {
             container.style.cursor = 'default'; 
         } else {
             container.style.cursor = 'pointer';
         }
        container.setAttribute('role', 'button');
        // aria-pressed обновляется в flipAction, здесь устанавливаем начальное/конечное
        container.setAttribute('aria-pressed', flipCardElement.hasAttribute('facedown') ? 'true' : 'false');
        container.setAttribute('aria-label', 'Перевернуть карточку');

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
    if (!this.previewTriggerElement || !this.previewFlipCard) return;
    const card = this.previewFlipCard;

    // Удаляем слушатели с this.previewTriggerElement (он же this.previewFlipCard)
    if (this._previewClickAction)
      this.previewTriggerElement.removeEventListener(
        "click",
        this._previewClickAction
      );
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
    if (this._previewKeydownAction)
      this.previewTriggerElement.removeEventListener(
        "keydown",
        this._previewKeydownAction
      );

    // Удаляем слушатели с самого компонента card (this.previewFlipCard)
    if (this._previewComponentFlippingListener)
      card.removeEventListener(
        "flipping",
        this._previewComponentFlippingListener
      );
    if (this._previewComponentFlippedListener)
      card.removeEventListener(
        "flipped",
        this._previewComponentFlippedListener
      );
    if (this._previewComponentClickFlippedListener)
      card.removeEventListener(
        "flipped",
        this._previewComponentClickFlippedListener
      );

    // Обнуляем сохраненные функции
    this._previewClickAction = null;
    this._previewHoverEnter = null;
    this._previewHoverLeave = null;
    this._previewKeydownAction = null;
    this._previewComponentFlippingListener = null;
    this._previewComponentFlippedListener = null;
    this._previewComponentClickFlippedListener = null;
  }
} // Конец класса CardFlipGenerator
