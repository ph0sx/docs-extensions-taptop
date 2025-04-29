import { BaseGenerator } from "./base/baseGenerator.js";

/**
 * Генератор для расширения "Слайдер До/После".
 * @extends BaseGenerator
 */
export class BeforeAfterSliderGenerator extends BaseGenerator {
  constructor() {
    super();
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
      previewWidth: 500,
      previewHeight: 300,
    };
    // Сохраняем ссылки на обработчики
    this._boundUpdateSliderDisplay = this._updateSliderValueDisplay.bind(this);
    this._boundUpdatePreview = this._updatePreview.bind(this);
  }

  /**
   * @override
   * Находит DOM-элементы, специфичные для генератора.
   */
  findElements() {
    super.findElements();

    // Основные настройки
    this.elements.imageUrlBeforeInput = document.getElementById(
      "bas-image-url-before"
    );
    this.elements.imageUrlAfterInput = document.getElementById(
      "bas-image-url-after"
    );
    this.elements.containerSelectorInput = document.getElementById(
      "bas-container-selector"
    );
    this.elements.initialPositionSlider = document.getElementById(
      "bas-initial-position"
    );
    this.elements.initialPositionValueSpan = document.getElementById(
      "bas-initial-position-value"
    );
    this.elements.orientationRadios = document.querySelectorAll(
      'input[name="bas-orientation"]'
    );
    this.elements.hoverModeCheckbox = document.getElementById("bas-hover-mode");
    this.elements.handleOnlyDragCheckbox = document.getElementById(
      "bas-handle-only-drag"
    );

    // Настройки стилизации
    this.elements.dividerWidthInput =
      document.getElementById("bas-divider-width");
    this.elements.dividerColorInput =
      document.getElementById("bas-divider-color");
    this.elements.handleWidthInput =
      document.getElementById("bas-handle-width");
    this.elements.handleColorInput =
      document.getElementById("bas-handle-color");
    this.elements.hideHandleCheckbox =
      document.getElementById("bas-hide-handle");

    // Элементы для превью
    this.elements.previewArea = document.getElementById("bas-preview-area");
    this.elements.previewPlaceholder = document.getElementById(
      "bas-preview-placeholder"
    );
    this.elements.previewError = document.getElementById("bas-preview-error");

    // Новые элементы для размеров превью
    this.elements.previewWidthInput =
      document.getElementById("bas-preview-width");
    this.elements.previewHeightInput =
      document.getElementById("bas-preview-height");

    // Создаем карту элементов для быстрого доступа
    this.elementsMap = {};

    // Собираем все ID в массив для проверки
    const requiredElementIds = [
      "bas-image-url-before",
      "bas-image-url-after",
      "bas-container-selector",
      "bas-initial-position",
      "bas-initial-position-value",
      "bas-hover-mode",
      "bas-handle-only-drag",
      "bas-divider-width",
      "bas-divider-color",
      "bas-handle-width",
      "bas-handle-color",
      "bas-hide-handle",
      "bas-preview-area",
      "bas-preview-placeholder",
      "bas-preview-error",
      "bas-preview-width",
      "bas-preview-height",
    ];

    let allFound = true;
    requiredElementIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) {
        console.error(`[BeforeAfterSliderGenerator] Элемент НЕ НАЙДЕН: #${id}`);
        allFound = false;
      }
      this.elementsMap[id] = element;
    });

    if (
      !this.elements.orientationRadios ||
      this.elements.orientationRadios.length === 0
    ) {
      console.error(
        "[BeforeAfterSliderGenerator] Радио-кнопки ориентации НЕ НАЙДЕНЫ!"
      );
      allFound = false;
    } else {
      this.elementsMap["orientationRadios"] = this.elements.orientationRadios;
    }

    // Добавляем основные элементы, найденные в BaseGenerator
    this.elementsMap["generateButton"] = this.elements.generateButton;

    if (!allFound) {
      console.error(
        "BeforeAfterSliderGenerator: Не найдены все необходимые элементы UI для генератора и превью!"
      );
      if (this.elements.generateButton) {
        this.elements.generateButton.disabled = true;
        this.elements.generateButton.title =
          "Ошибка: не найдены все элементы интерфейса генератора/превью.";
      }
    } else {
      console.log(
        "[BeforeAfterSliderGenerator] Все элементы UI для генератора и превью найдены."
      );
    }
  }

  /**
   * @override
   * Привязывает обработчики событий.
   */
  bindEvents() {
    super.bindEvents();

    // Привязываем _updatePreview ко ВСЕМ изменяемым элементам
    const controlsToWatch = [
      "bas-image-url-before",
      "bas-image-url-after",
      "bas-initial-position",
      "bas-hover-mode",
      "bas-handle-only-drag",
      "bas-divider-width",
      "bas-divider-color",
      "bas-handle-width",
      "bas-handle-color",
      "bas-hide-handle",
      "bas-preview-width",
      "bas-preview-height",
    ];

    controlsToWatch.forEach((id) => {
      const el = this.elementsMap[id];
      if (el) {
        const eventType =
          el.type === "checkbox" ||
          el.type === "radio" ||
          el.tagName === "SELECT" ||
          el.type === "color"
            ? "change"
            : "input";
        el.addEventListener(eventType, this._boundUpdatePreview);
      }
    });

    // Отдельно для радио-кнопок ориентации
    this.elementsMap["orientationRadios"]?.forEach((radio) => {
      radio.addEventListener("change", this._boundUpdatePreview);
    });

    // Слушатель для обновления % остается отдельным
    this.elementsMap["bas-initial-position"]?.addEventListener(
      "input",
      this._boundUpdateSliderDisplay
    );
  }

  /**
   * @override
   * Удаляет обработчики событий.
   */
  unbindEvents() {
    // Отвязываем _updatePreview от ВСЕХ элементов
    const controlsToUnwatch = [
      "bas-image-url-before",
      "bas-image-url-after",
      "bas-initial-position",
      "bas-hover-mode",
      "bas-handle-only-drag",
      "bas-divider-width",
      "bas-divider-color",
      "bas-handle-width",
      "bas-handle-color",
      "bas-hide-handle",
      "bas-preview-width",
      "bas-preview-height",
    ];

    controlsToUnwatch.forEach((id) => {
      const el = this.elementsMap[id];
      if (el) {
        const eventType =
          el.type === "checkbox" ||
          el.type === "radio" ||
          el.tagName === "SELECT" ||
          el.type === "color"
            ? "change"
            : "input";
        el.removeEventListener(eventType, this._boundUpdatePreview);
      }
    });

    this.elementsMap["orientationRadios"]?.forEach((radio) => {
      radio.removeEventListener("change", this._boundUpdatePreview);
    });

    // Отвязываем слушатель для обновления %
    this.elementsMap["bas-initial-position"]?.removeEventListener(
      "input",
      this._boundUpdateSliderDisplay
    );

    super.unbindEvents(); // Отвязываем базовые события
  }

  /**
   * @override
   * Устанавливает начальное состояние UI и инициализирует превью.
   */
  setInitialState() {
    if (!this.elementsMap["bas-image-url-before"]) {
      console.error(
        "Элементы UI не найдены, не могу установить начальное состояние."
      );
      return;
    }

    // Устанавливаем значения по умолчанию
    this.elementsMap["bas-image-url-before"].value =
      this.configDefaults.imageUrlBefore;
    this.elementsMap["bas-image-url-after"].value =
      this.configDefaults.imageUrlAfter;
    this.elementsMap["bas-container-selector"].value =
      this.configDefaults.containerSelector;
    this.elementsMap["bas-initial-position"].value =
      this.configDefaults.initialPosition;
    this.elementsMap["bas-hover-mode"].checked = this.configDefaults.hoverMode;
    this.elementsMap["bas-handle-only-drag"].checked =
      this.configDefaults.handleOnlyDrag;
    this.elementsMap["orientationRadios"].forEach((radio) => {
      radio.checked = radio.value === this.configDefaults.orientation;
    });

    // Стилизация
    this.elementsMap["bas-divider-width"].value =
      this.configDefaults.dividerWidth;
    this.elementsMap["bas-divider-color"].value =
      this.configDefaults.dividerColor;
    this.elementsMap["bas-handle-width"].value =
      this.configDefaults.handleWidth;
    this.elementsMap["bas-handle-color"].value =
      this.configDefaults.handleColor;
    this.elementsMap["bas-hide-handle"].checked =
      this.configDefaults.hideHandle;

    // Размеры превью
    this.elementsMap["bas-preview-width"].value =
      this.configDefaults.previewWidth;
    this.elementsMap["bas-preview-height"].value =
      this.configDefaults.previewHeight;

    this._updateSliderValueDisplay(); // Обновляем отображение % слайдера
    this._updatePreview(); // Инициализируем превью с начальными значениями
    console.log(
      "[BeforeAfterSliderGenerator] Начальное состояние UI и превью установлены."
    );
  }

  /**
   * Обновляет текстовое представление значения слайдера.
   * @private
   */
  _updateSliderValueDisplay() {
    if (
      this.elementsMap["bas-initial-position"] &&
      this.elementsMap["bas-initial-position-value"]
    ) {
      this.elementsMap["bas-initial-position-value"].textContent =
        this.elementsMap["bas-initial-position"].value + "%";
    }
  }

  /**
   * @override
   * Собирает и валидирует данные из формы.
   */
  collectData() {
    if (!this.elementsMap["bas-image-url-before"]) {
      this.showErrorModal("Интерфейс не инициализирован.");
      return null;
    }

    const imageUrlBefore =
      this.elementsMap["bas-image-url-before"].value.trim();
    const imageUrlAfter = this.elementsMap["bas-image-url-after"].value.trim();
    const containerSelector = this.elementsMap["bas-container-selector"].value
      .trim()
      .replace(/^\./, "");

    if (!imageUrlBefore || !imageUrlAfter) {
      this.showErrorModal("Укажите URL для обоих изображений.");
      return null;
    }

    if (!containerSelector) {
      this.showErrorModal("Укажите CSS-класс блока-контейнера.");
      return null;
    }

    const validClassRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validClassRegex.test(containerSelector)) {
      this.showErrorModal(
        `Класс контейнера "${containerSelector}" содержит недопустимые символы.`
      );
      return null;
    }

    if (!imageUrlBefore.startsWith("http") && !imageUrlBefore.startsWith("/")) {
      console.warn("URL 'ДО' может быть некорректным.");
    }

    if (!imageUrlAfter.startsWith("http") && !imageUrlAfter.startsWith("/")) {
      console.warn("URL 'ПОСЛЕ' может быть некорректным.");
    }

    let orientationValue = "horizontal";
    this.elementsMap["orientationRadios"]?.forEach((radio) => {
      if (radio.checked) {
        orientationValue = radio.value;
      }
    });

    const settings = {
      imageUrlBefore,
      imageUrlAfter,
      containerSelector,
      initialPosition:
        parseInt(this.elementsMap["bas-initial-position"]?.value, 10) || 50,
      orientation: orientationValue,
      hoverMode: this.elementsMap["bas-hover-mode"]?.checked ?? false,
      handleOnlyDrag:
        this.elementsMap["bas-handle-only-drag"]?.checked ?? false,
      dividerWidth: parseInt(this.elementsMap["bas-divider-width"]?.value, 10),
      dividerColor: this.elementsMap["bas-divider-color"]?.value ?? "#ffffff",
      handleWidth: parseInt(this.elementsMap["bas-handle-width"]?.value, 10),
      handleColor: this.elementsMap["bas-handle-color"]?.value ?? "#ffffff",
      hideHandle: this.elementsMap["bas-hide-handle"]?.checked ?? false,
    };

    if (isNaN(settings.dividerWidth) || settings.dividerWidth < 0) {
      settings.dividerWidth = 1;
    }

    if (isNaN(settings.handleWidth) || settings.handleWidth < 0) {
      settings.handleWidth = 40;
    }

    console.log(
      "[BeforeAfterSliderGenerator] Собранные данные для генерации:",
      settings
    );
    return settings;
  }

  /**
   * @override
   * Переопределяем для проверки валидации *до* генерации/копирования.
   */
  generateAndCopyCode() {
    console.log("[BeforeAfterSliderGenerator] Попытка генерации кода...");
    const settings = this.collectData();
    if (settings === null) {
      console.warn(
        "[BeforeAfterSliderGenerator] Генерация прервана валидацией."
      );
      return;
    }
    console.log(
      "[BeforeAfterSliderGenerator] Данные собраны, генерируем код..."
    );
    const code = this.generateCode(settings);
    this.copyAndNotify(code);
  }

  /**
   * Обновляет превью на основе текущих настроек.
   * @private
   */
  _updatePreview() {
    const previewContainer = this.elementsMap["bas-preview-area"];
    if (!previewContainer) return;

    // Собираем текущие значения из формы
    const settings = {
      imageUrlBefore:
        this.elementsMap["bas-image-url-before"]?.value.trim() || "",
      imageUrlAfter:
        this.elementsMap["bas-image-url-after"]?.value.trim() || "",
      initialPosition:
        parseInt(this.elementsMap["bas-initial-position"]?.value, 10) || 50,
      orientation:
        document.querySelector('input[name="bas-orientation"]:checked')
          ?.value || "horizontal",
      hoverMode: this.elementsMap["bas-hover-mode"]?.checked ?? false,
      handleOnlyDrag:
        this.elementsMap["bas-handle-only-drag"]?.checked ?? false,
      dividerWidth: parseInt(this.elementsMap["bas-divider-width"]?.value, 10),
      dividerColor: this.elementsMap["bas-divider-color"]?.value ?? "#ffffff",
      handleWidth: parseInt(this.elementsMap["bas-handle-width"]?.value, 10),
      handleColor: this.elementsMap["bas-handle-color"]?.value ?? "#ffffff",
      hideHandle: this.elementsMap["bas-hide-handle"]?.checked ?? false,
      // Размеры превью
      previewWidth: parseInt(this.elementsMap["bas-preview-width"]?.value, 10),
      previewHeight: parseInt(
        this.elementsMap["bas-preview-height"]?.value,
        10
      ),
    };

    if (isNaN(settings.dividerWidth) || settings.dividerWidth < 0)
      settings.dividerWidth = 1;
    if (isNaN(settings.handleWidth) || settings.handleWidth < 0)
      settings.handleWidth = 40;
    if (isNaN(settings.previewWidth) || settings.previewWidth < 100)
      settings.previewWidth = 500;
    if (isNaN(settings.previewHeight) || settings.previewHeight < 100)
      settings.previewHeight = 300;

    const placeholder = this.elementsMap["bas-preview-placeholder"];
    const errorEl = this.elementsMap["bas-preview-error"];

    // Применяем размеры к контейнеру превью
    previewContainer.style.width = `${settings.previewWidth}px`;
    previewContainer.style.height = `${settings.previewHeight}px`;

    // Скрываем ошибки и плейсхолдер по умолчанию
    if (placeholder) placeholder.style.display = "none";
    if (errorEl) errorEl.style.display = "none";

    // Проверяем URL
    if (!settings.imageUrlBefore || !settings.imageUrlAfter) {
      if (placeholder) placeholder.style.display = "block";
      // Удаляем старый слайдер, если он был
      const existingSlider = previewContainer.querySelector(
        "img-comparison-slider"
      );
      if (existingSlider) existingSlider.remove();
      return; // Выходим, если нет URL
    }

    // Проверка URL для превью (упрощенная)
    let urlError = false;
    const checkPreviewUrl = (url) => {
      if (!url) return true; // Пустой URL не ошибка для превью, просто не покажем
      if (
        url.startsWith("http:") ||
        url.startsWith("https:") ||
        url.startsWith("/") ||
        url.startsWith("data:")
      )
        return false;
      return true; // Считаем ошибкой, если не соответствует
    };

    if (
      checkPreviewUrl(settings.imageUrlBefore) ||
      checkPreviewUrl(settings.imageUrlAfter)
    ) {
      urlError = true;
      console.warn("Preview URL error detected.");
    }

    if (urlError && (settings.imageUrlBefore || settings.imageUrlAfter)) {
      if (errorEl) {
        errorEl.textContent =
          "Ошибка: URL должен начинаться с http://, https:// или /";
        errorEl.style.display = "block";
      }
      const existingSlider = previewContainer.querySelector(
        "img-comparison-slider"
      );
      if (existingSlider) existingSlider.remove();
      return;
    }

    // Ищем или создаем слайдер в превью
    let slider = previewContainer.querySelector("img-comparison-slider");
    if (!slider) {
      slider = document.createElement("img-comparison-slider");
      slider.style.width = "100%";
      slider.style.height = "100%";
      slider.setAttribute("tabindex", "-1");

      const imgBefore = document.createElement("img");
      imgBefore.setAttribute("slot", "first");
      imgBefore.style.width = "100%";
      imgBefore.style.height = "auto";
      imgBefore.style.display = "block";
      imgBefore.onerror = () => {
        if (errorEl) {
          errorEl.textContent = 'Не удалось загрузить изображение "ДО"';
          errorEl.style.display = "block";
          slider.style.display = "none";
        }
      };
      imgBefore.onload = () => {
        slider.style.display = "";
        if (errorEl) errorEl.style.display = "none";
      };

      const imgAfter = document.createElement("img");
      imgAfter.setAttribute("slot", "second");
      imgAfter.style.width = "100%";
      imgAfter.style.height = "auto";
      imgAfter.style.display = "block";
      imgAfter.onerror = () => {
        if (errorEl) {
          errorEl.textContent = 'Не удалось загрузить изображение "ПОСЛЕ"';
          errorEl.style.display = "block";
          slider.style.display = "none";
        }
      };
      imgAfter.onload = () => {
        slider.style.display = "";
        if (errorEl) errorEl.style.display = "none";
      };

      slider.appendChild(imgBefore);
      slider.appendChild(imgAfter);
      previewContainer.appendChild(slider);
    } else {
      slider.style.display = "";
    }

    // Обновляем атрибуты и стили
    slider.setAttribute("value", settings.initialPosition);
    slider.setAttribute("direction", settings.orientation);
    if (settings.hoverMode) slider.setAttribute("hover", "true");
    else slider.removeAttribute("hover");
    if (settings.handleOnlyDrag) slider.setAttribute("handle", "true");
    else slider.removeAttribute("handle");

    slider.style.setProperty("--divider-width", `${settings.dividerWidth}px`);
    slider.style.setProperty("--divider-color", settings.dividerColor);
    slider.style.setProperty(
      "--default-handle-width",
      `${settings.handleWidth}px`
    );
    slider.style.setProperty("--default-handle-color", settings.handleColor);
    slider.style.setProperty(
      "--default-handle-opacity",
      settings.hideHandle ? "0" : "1"
    );

    // Обновляем src изображений
    const imgBeforeEl = slider.querySelector('img[slot="first"]');
    const imgAfterEl = slider.querySelector('img[slot="second"]');
    if (imgBeforeEl && imgBeforeEl.src !== settings.imageUrlBefore) {
      imgBeforeEl.src = settings.imageUrlBefore;
      imgBeforeEl.alt = "Превью До";
    }
    if (imgAfterEl && imgAfterEl.src !== settings.imageUrlAfter) {
      imgAfterEl.src = settings.imageUrlAfter;
      imgAfterEl.alt = "Превью После";
    }
  }

  /**
   * @override
   * Генерирует JavaScript-код для инициализации слайдера.
   * @param {object} settings - Настройки, собранные из collectData.
   * @returns {string} Строка с JavaScript-кодом (<script>...</script>).
   */
  generateCode(settings) {
    // Исключаем параметры превью перед генерацией JSON
    const { previewWidth, previewHeight, ...settingsForCode } = settings;
    const settingsJson = JSON.stringify(settingsForCode, null, 2);

    const script = `
<script>
/* Generated by BeforeAfterSliderGenerator */
/* Settings: ${JSON.stringify(settingsForCode)} */
document.addEventListener('DOMContentLoaded', () => {
  const config = ${settingsJson};
  const sliderLibraryUrl = 'https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/index.js';
  const sliderStylesUrl = 'https://cdn.jsdelivr.net/npm/img-comparison-slider@8/dist/styles.css';
  let scriptLoaded = false;
  let stylesLoaded = false;

  const initSlider = () => {
    if (!scriptLoaded || !stylesLoaded) { console.log('[BeforeAfterSlider] Ожидание ресурсов...'); return; }
    if (!config.containerSelector) { console.error('[BeforeAfterSlider] Ошибка: Класс контейнера не указан.'); return; }
    const container = document.querySelector('.' + config.containerSelector);
    if (!container) { console.error('[BeforeAfterSlider] Ошибка: Контейнер "' + config.containerSelector + '" не найден.'); return; }
    if (container.querySelector('img-comparison-slider')) { console.warn('[BeforeAfterSlider] Слайдер в "' + config.containerSelector + '" уже есть.'); return; }

    const slider = document.createElement('img-comparison-slider');
    slider.setAttribute('value', config.initialPosition != null ? config.initialPosition : 50);
    slider.setAttribute('direction', config.orientation || 'horizontal');
    if (config.hoverMode) { slider.setAttribute('hover', 'true'); }
    if (config.handleOnlyDrag) { slider.setAttribute('handle', 'true'); }
    slider.setAttribute('tabindex', '0');

    // Применение стилей через CSS переменные
    if (config.dividerWidth != null && config.dividerWidth >= 0) slider.style.setProperty('--divider-width', \`\${config.dividerWidth}px\`);
    if (config.dividerColor) slider.style.setProperty('--divider-color', config.dividerColor);
    if (config.handleWidth != null && config.handleWidth >= 0) slider.style.setProperty('--default-handle-width', \`\${config.handleWidth}px\`);
    if (config.handleColor) slider.style.setProperty('--default-handle-color', config.handleColor);
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

  const loadScript = (url, callback) => { if (document.querySelector(\`script[src="\${url}"]\`)) { if (window.customElements && window.customElements.get('img-comparison-slider')) { console.log('[BeforeAfterSlider] Скрипт библиотеки уже загружен.'); scriptLoaded = true; callback(); } else { console.log('[BeforeAfterSlider] Ожидание регистрации компонента...'); const checkInterval = setInterval(() => { if (window.customElements && window.customElements.get('img-comparison-slider')) { clearInterval(checkInterval); console.log('[BeforeAfterSlider] Компонент зарегистрирован.'); scriptLoaded = true; callback(); } }, 100); setTimeout(() => { if (!scriptLoaded) { clearInterval(checkInterval); console.error('[BeforeAfterSlider] Компонент не зарегистрирован.'); scriptLoaded = true; callback(); } }, 5000); } return; } const scriptTag = document.createElement('script'); scriptTag.src = url; scriptTag.defer = true; scriptTag.onload = () => { if (window.customElements && typeof window.customElements.whenDefined === 'function') { window.customElements.whenDefined('img-comparison-slider').then(() => { console.log('[BeforeAfterSlider] Скрипт загружен, компонент зарегистрирован.'); scriptLoaded = true; callback(); }).catch(err => { console.error('[BeforeAfterSlider] Ошибка ожидания регистрации:', err); scriptLoaded = true; callback(); }); } else { console.warn('[BeforeAfterSlider] customElements.whenDefined не поддерживается.'); setTimeout(() => { console.log('[BeforeAfterSlider] Скрипт загружен (с задержкой).'); scriptLoaded = true; callback(); }, 200); } }; scriptTag.onerror = () => { console.error('[BeforeAfterSlider] Ошибка загрузки скрипта:', url); scriptLoaded = true; callback(); }; document.head.appendChild(scriptTag); };
  const loadStyles = (url, callback) => { if (document.querySelector(\`link[href="\${url}"]\`)) { console.log('[BeforeAfterSlider] Стили уже загружены.'); stylesLoaded = true; callback(); return; } const linkTag = document.createElement('link'); linkTag.rel = 'stylesheet'; linkTag.href = url; let stylesTimer = null; linkTag.onload = () => { clearTimeout(stylesTimer); console.log('[BeforeAfterSlider] Стили загружены (onload).'); stylesLoaded = true; callback(); }; linkTag.onerror = () => { clearTimeout(stylesTimer); console.error('[BeforeAfterSlider] Ошибка загрузки стилей:', url); stylesLoaded = true; callback(); }; document.head.appendChild(linkTag); stylesTimer = setTimeout(() => { if (!stylesLoaded) { console.warn('[BeforeAfterSlider] Стили не загрузились (таймаут).'); stylesLoaded = true; callback(); } }, 1500); };

  loadStyles(sliderStylesUrl, () => { loadScript(sliderLibraryUrl, () => { initSlider(); }); });
});
</script>
`;
    return script;
  }
}
