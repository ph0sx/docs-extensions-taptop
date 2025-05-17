import { BaseGenerator } from "./base/baseGenerator.js";

// --- Константы Типов Фильтров (из документации API) ---
const FILTER_TYPES = {
  EQUAL: "FILTER_EQUAL",
  CONTAINS: "FILTER_CONTAINS",
  NOT_EQUAL: "FILTER_NOT_EQUAL",
  NOT_CONTAINS: "FILTER_NOT_CONTAINS",
  IS_SET: "FILTER_IS_SET",
  IS_NOT_SET: "FILTER_IS_NOT_SET",
  COLLECTION_TEXT: "FILTER_COLLECTION_TEXT",
};

// --- Константы Типов UI Элементов Фильтра ---
const UI_TYPES = {
  NONE: "none",
  INPUT: "input",
  SELECT: "select",
  RADIO: "radio",
  BUTTONS: "buttons",
  CHECKBOX_SET: "checkbox-set",
};

// --- Константы Типов Вывода Данных (Больше не используются в генераторе, но оставлены для контекста) ---
const OUTPUT_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  LINK: "link",
  DATE_DMY: "date_dmy",
  RICH_TEXT: "rich_text",
};

// --- Константы ложных строковых значений (без "0" и "") ---
const KNOWN_FALSE_STRINGS_LOWERCASE = ["false", "no", "нет"];

export class CollectionFilterGenerator extends BaseGenerator {
  constructor() {
    super();

    // --- Стандартные селекторы ---
    const defaultSelectors = {
      targetSelector: "collection", // Стандартный класс виджета Taptop
      applyButtonSelector: "filter-apply-button", // Единое имя по умолчанию
      resetButtonSelector: "filter-reset-button", // Единое имя по умолчанию
    };

    const defaultColor = "#4483f5";
    const previewPath = "assets/preset-previews/"; // Путь к превью

    // --- Обновленные пресеты ---
    this.presets = {
      custom: {
        name: "Свой набор полей",
        description: "Начните с чистого листа и добавьте нужные поля вручную.",
        collectionId: "", // widgetId будет определяться автоматически в runtime
        fields: [], // Только поля для фильтрации
        itemsPerPage: 9,
        ...defaultSelectors, // targetSelector, applyButtonSelector, resetButtonSelector
        preset: "custom",
        paginationType: "none",
        showLoader: true,
        primaryColor: defaultColor,
      },
      simpleCatalog: {
        name: "Простой Каталог (Поиск + Вывод)",
        description:
          "Каталог: Поиск по 'title'. Отображение полей настраивается в Taptop.", // Изменено описание
        collectionId: "",
        fields: [
          {
            uniqueId: "psc1",
            fieldId: "title",
            label: "Поиск по названию",
            uiType: UI_TYPES.INPUT,
            elementSelector: "catalog-search",
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: false, // Обычно поиск не мгновенный
            clearButtonSelector: "clear-search",
          },
          // Поля для вывода (изображение, цена, описание) УДАЛЕНЫ из пресета,
          // так как их вывод теперь настраивается в Taptop.
        ],
        itemsPerPage: 12,
        ...defaultSelectors, // applyButtonSelector здесь может быть нужен, если поиск не мгновенный
        preset: "simpleCatalog",
        paginationType: "load_more",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: { default: `${previewPath}Простой Каталог.png` },
      },
      categorySelect: {
        name: "Фильтр по Категориям (Список)",
        // description: "Фильтр: Список для поля 'категория', вывод 'title'.",
        description:
          "Фильтр: Список для поля 'категория'. Отображение полей настраивается в Taptop.", // Предлагаемое изменение
        collectionId: "",
        fields: [
          {
            uniqueId: "pcs1",
            fieldId: "категория",
            label: "Категория",
            uiType: UI_TYPES.SELECT,
            elementSelector: "category-select",
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: true,
            firstIsAll: true,
            clearButtonSelector: null,
          },
          // Поля для вывода (title, изображение, цена) УДАЛЕНЫ
        ],
        itemsPerPage: 9,
        ...defaultSelectors,
        preset: "categorySelect",
        paginationType: "prev_next",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: { default: `${previewPath}Фильтр по категориям.png` },
      },
      tagButtons: {
        name: "Фильтр по Тегам (Кнопки)",
        // description: "Фильтр: Кнопки для поля 'тег', вывод 'title'.",
        description:
          "Фильтр: Кнопки-теги для поля 'тег'. Отображение полей настраивается в Taptop.", // Предлагаемое изменение
        collectionId: "",
        fields: [
          {
            uniqueId: "ptb1",
            fieldId: "тег", // или 'tag'
            label: "Тег",
            uiType: UI_TYPES.BUTTONS,
            elementSelector: "tag-button", // Пользователь присваивает этот класс каждой кнопке-тегу
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: true,
            firstIsAll: true, // Первая кнопка/таб сбрасывает фильтр по тегам
            clearButtonSelector: null,
          },
          // Поля для вывода (title, изображение, бренд) УДАЛЕНЫ
        ],
        itemsPerPage: 10,
        ...defaultSelectors,
        preset: "tagButtons",
        paginationType: "numbers",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: {
          default: `${previewPath}Фильтр по тегам.png`,
          active: `${previewPath}Фильтр по тегам Активный.png`,
        },
      },
      stockCheckbox: {
        name: "Фильтр 'В Наличии' + Категории",
        description:
          "Чекбокс для поля 'наличие', список для 'категория'. Отображение настраивается в Taptop.", // Изменено
        collectionId: "",
        fields: [
          {
            uniqueId: "psc1",
            fieldId: "наличие", // Или 'stock', 'available'
            label: "В наличии",
            uiType: UI_TYPES.CHECKBOX_SET,
            elementSelector: "stock-checkbox",
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: true,
            // firstIsAll не имеет смысла для чекбокса
            clearButtonSelector: null,
          },
          {
            uniqueId: "psc_cat",
            fieldId: "категория",
            label: "Категория",
            uiType: UI_TYPES.SELECT,
            elementSelector: "stock-category-select",
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: true,
            firstIsAll: true,
            clearButtonSelector: null,
          },
          // Поля для вывода (название, цена) УДАЛЕНЫ
        ],
        itemsPerPage: 12,
        ...defaultSelectors,
        preset: "stockCheckbox",
        paginationType: "none",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: {
          default: `${previewPath}Фильтр в Наличии.png`,
          active: `${previewPath}Фильтр в Наличии активный.png`,
        },
      },
      combinedFilter: {
        name: "Комбинация: Поиск и Категория",
        description:
          "Фильтр: Поиск по 'title' + список для 'категория'. Отображение настраивается в Taptop.", // Изменено
        collectionId: "",
        fields: [
          {
            uniqueId: "pcf1",
            fieldId: "title",
            label: "Поиск по названию",
            uiType: UI_TYPES.INPUT,
            elementSelector: "combined-search",
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: false, // Требует кнопки "Применить"
            // firstIsAll не имеет смысла для input
            clearButtonSelector: null,
          },
          {
            uniqueId: "pcf2",
            fieldId: "категория",
            label: "Категория",
            uiType: UI_TYPES.SELECT,
            elementSelector: "combined-category",
            // targetSelector и outputType УДАЛЕНЫ
            instantFilter: false, // Требует кнопки "Применить"
            firstIsAll: true,
            clearButtonSelector: null,
          },
          // Поля для вывода УДАЛЕНЫ
        ],
        itemsPerPage: 9,
        ...defaultSelectors,
        applyButtonSelector: "filter-apply-button", // Кнопка Применить обязательна
        preset: "combinedFilter",
        paginationType: "prev_next",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: {
          default: `${previewPath}Комбинация Поиск и Категория.png`,
        },
      },
    };

    // --- Остальной конструктор без изменений ---
    this.config = {};
    this._boundHandlePresetChange = this._handlePresetChange.bind(this);
    this._boundHandleAddFilter = this._handleAddFilterField.bind(this);
    this._boundContainerListener = this._handleContainerEvents.bind(this);
    this._boundHandlePaginationTypeChange =
      this._handlePaginationTypeChange.bind(this);
    this._boundHandleColorChange = this._handleColorChange.bind(this);
  }

  // --- Поиск элементов интерфейса ---
  findElements() {
    super.findElements();
    this.elements = {
      ...this.elements,
      presetSelect: document.getElementById("preset-select"),
      presetDescription: document.getElementById("preset-description"),
      presetPreviewContainer: document.getElementById(
        "preset-preview-container"
      ),
      collectionIdInput: document.getElementById("collection-id"), // widgetIdInput УДАЛЕНО
      targetSelectorInput: document.getElementById("target-selector"),
      applyButtonSelectorInput: document.getElementById(
        "apply-button-selector"
      ),
      resetButtonSelectorInput: document.getElementById(
        "reset-button-selector"
      ),
      filterFieldsContainer: document.getElementById("filter-fields-container"),
      addFilterButton: document.getElementById("add-filter-field-button"),
      filterFieldTemplate: document.getElementById("filter-field-template"),
      itemsPerPageInput: document.getElementById("items-per-page"),
      paginationTypeSelect: document.getElementById("pagination-type"),
      showLoaderCheckbox: document.getElementById("show-loader"),
      primaryColorInput: document.getElementById("primary-color"),
      generateButton: document.getElementById("generate-code-button"), // Используем ID из MD
    };
  }

  // --- Привязка обработчиков событий ---
  bindEvents() {
    super.bindEvents();

    this.elements.presetSelect?.addEventListener(
      "change",
      this._boundHandlePresetChange
    );
    this.elements.addFilterButton?.addEventListener(
      "click",
      this._boundHandleAddFilter
    );
    this.elements.paginationTypeSelect?.addEventListener(
      "change",
      this._boundHandlePaginationTypeChange
    );
    this.elements.primaryColorInput?.addEventListener(
      "input",
      this._boundHandleColorChange
    ); //  Листенер для цвета

    // --- Единый слушатель контейнера для делегирования событий ---
    this.elements.filterFieldsContainer?.addEventListener(
      "click",
      this._boundContainerListener
    );
    this.elements.filterFieldsContainer?.addEventListener(
      "change",
      this._boundContainerListener
    );
    this.elements.filterFieldsContainer?.addEventListener(
      "input",
      this._boundContainerListener
    );
    this.elements.filterFieldsContainer?.addEventListener(
      "blur",
      this._boundContainerListener,
      true
    );
    this.elements.filterFieldsContainer?.addEventListener(
      "keydown",
      this._boundContainerListener,
      true
    );

    // --- Сброс пресета при изменении базовых полей ---
    const elementsToResetPreset = [
      this.elements.collectionIdInput, // widgetIdInput УДАЛЕНО
      this.elements.targetSelectorInput,
      this.elements.applyButtonSelectorInput,
      this.elements.resetButtonSelectorInput,
      this.elements.itemsPerPageInput,
      this.elements.paginationTypeSelect,
      this.elements.showLoaderCheckbox,
      this.elements.primaryColorInput,
    ];

    elementsToResetPreset.forEach((el) =>
      el?.addEventListener("change", () => this._resetPresetSelection())
    );
  }

  // --- Отвязка обработчиков событий ---
  unbindEvents() {
    super.unbindEvents();

    this.elements.presetSelect?.removeEventListener(
      "change",
      this._boundHandlePresetChange
    );
    this.elements.addFilterButton?.removeEventListener(
      "click",
      this._boundHandleAddFilter
    );
    this.elements.paginationTypeSelect?.removeEventListener(
      "change",
      this._boundHandlePaginationTypeChange
    );
    this.elements.primaryColorInput?.removeEventListener(
      "input",
      this._boundHandleColorChange
    );

    // --- Снятие единого слушателя ---
    this.elements.filterFieldsContainer?.removeEventListener(
      "click",
      this._boundContainerListener
    );
    this.elements.filterFieldsContainer?.removeEventListener(
      "change",
      this._boundContainerListener
    );
    this.elements.filterFieldsContainer?.removeEventListener(
      "input",
      this._boundContainerListener
    );
    this.elements.filterFieldsContainer?.removeEventListener(
      "blur",
      this._boundContainerListener,
      true
    );
    this.elements.filterFieldsContainer?.removeEventListener(
      "keydown",
      this._boundContainerListener,
      true
    );

    // --- Отвязка сброса пресета ---
    const elementsToResetPreset = [
      this.elements.collectionIdInput,
      // this.elements.widgetIdInput, // Этого поля больше нет
      this.elements.targetSelectorInput,
      this.elements.applyButtonSelectorInput,
      this.elements.resetButtonSelectorInput,
      this.elements.itemsPerPageInput,
      this.elements.paginationTypeSelect,
      this.elements.showLoaderCheckbox,
      this.elements.primaryColorInput,
    ];

    elementsToResetPreset.forEach((el) =>
      el?.removeEventListener("change", () => {})
    );
  }

  // + Новый обработчик для select пагинации +
  _handlePaginationTypeChange(event) {
    this.config.paginationType = event.target.value;
    this._resetPresetSelection(); // Сбрасываем пресет при изменении
  }

  //  Новый обработчик для изменения цвета
  _handleColorChange(event) {
    this.config.primaryColor = event.target.value;
    this._resetPresetSelection();
  }

  // --- Единый обработчик событий контейнера (делегирование) ---
  _handleContainerEvents(event) {
    const target = event.target;
    const fieldCard = target.closest(".field-card");
    if (!fieldCard) return;

    const uniqueId = fieldCard.dataset.fieldUniqueId;
    if (!uniqueId) return;

    const fieldConf = this.config.fields?.find((f) => f.uniqueId === uniqueId);
    if (!fieldConf) {
      console.warn(
        `[CF Generator Event] Конфигурация для поля ${uniqueId} не найдена.`
      );
      return;
    }

    // --- 1. Обработка кликов ---
    if (event.type === "click") {
      if (target.closest(".remove-field-button")) {
        this._handleRemoveFilterField(uniqueId);
      } else if (target.closest(".configure-output-btn")) {
        // Кнопка удалена, но оставим на всякий случай
        // this._toggleOutputSection(fieldCard);
      }
      return; // Выходим после обработки клика
    }

    // --- 2. Обработка изменений (change, input) ---
    if (event.type === "change" || event.type === "input") {
      const configName = target.dataset.configName;
      if (configName) {
        const value =
          target.type === "checkbox" ? target.checked : target.value;

        // Обновляем config (пустые селекторы сохраняем как null)
        fieldConf[configName] =
          value === "" && // УДАЛЕНО "targetSelector" из списка
          ["elementSelector", "clearButtonSelector"].includes(configName)
            ? null
            : value;

        // Обновляем UI при изменении типа
        if (configName === "uiType") {
          // По умолчанию instantFilter = true для всех, кроме input
          fieldConf.instantFilter = value !== UI_TYPES.INPUT;
          this._updateFieldCardUIVisibility(fieldCard);
        }
        // Удалена логика для outputType, так как его больше нет
        // if (configName === "outputType") {
        //   this._updateOutputTypeVisibility(fieldCard);
        // }

        //  Live update label
        if (configName === "fieldId") {
          this._updateFieldLabel(fieldCard, fieldConf, value);
        }

        this._resetPresetSelection();
      }
      return; // Выходим после обработки изменения
    }

    // Обработка Enter для поля ID/Имени (для сохранения label)
    if (
      event.type === "keydown" &&
      target.classList.contains("filter-field-id") &&
      event.key === "Enter"
    ) {
      event.preventDefault();
      target.blur(); // Убираем фокус, чтобы сработало сохранение
      this._updateFieldLabel(fieldCard, fieldConf, target.value); // Доп. обновление на Enter
    }
  }

  _updateFieldLabel(fieldCard, fieldConf, newFieldId) {
    if (!fieldCard || !fieldConf) return;
    const labelTextElement = fieldCard.querySelector(".field-label-text");
    const newLabel = newFieldId
      ? this._capitalizeFirstLetter(newFieldId)
      : "Новое поле";
    if (labelTextElement) labelTextElement.textContent = newLabel;
    fieldConf.label = newLabel; // Обновляем и в конфиге
  }

  setInitialState() {
    this._populatePresetSelect();
    const initialPresetId = this.elements.presetSelect?.value || "custom";
    this._applyPreset(initialPresetId, false); // Применяем пресет для установки config
    this._renderAllFieldCardsDOM(); // Рендерим карточки на основе config
    this._updatePresetPreview(initialPresetId); //  Вызов обновления превью
  }

  _handlePresetChange(event) {
    const presetId = event.target.value;
    this._applyPreset(presetId, true); // Сбрасываем ID коллекции
    this._renderAllFieldCardsDOM(); // Перерисовываем карточки
    this._updatePresetPreview(presetId); //  Вызов обновления превью
  }

  _applyPreset(presetId, resetCollectionId = true) {
    const preset = this.presets[presetId];
    if (!preset) return;

    const currentCollectionId = resetCollectionId
      ? ""
      : this.elements.collectionIdInput?.value ||
        this.config.collectionId ||
        "";

    // Глубокое клонирование, чтобы не менять исходный пресет
    this.config = structuredClone(preset);
    this.config.preset = presetId;
    this.config.collectionId = currentCollectionId; // Сохраняем ID коллекции

    // Гарантируем наличие uniqueId для полей
    if (Array.isArray(this.config.fields)) {
      this.config.fields.forEach((field, index) => {
        field.uniqueId =
          field.uniqueId || `preset_${presetId}_f${index + 1}_${Date.now()}`;
        //  Установка instantFilter по умолчанию для input при применении пресета
        if (!("instantFilter" in field)) {
          // Если в пресете не указано явно
          field.instantFilter = field.uiType !== UI_TYPES.INPUT; // false для input, true для остальных
        }
      });
    }

    //  Добавляем paginationType из пресета, если его нет в config
    this.config.paginationType =
      this.config.paginationType || preset.paginationType || "none";

    //  Добавляем showLoader из пресета
    this.config.showLoader =
      this.config.showLoader ?? preset.showLoader ?? true;

    // Добавляем primaryColor из пресета
    this.config.primaryColor =
      this.config.primaryColor || preset.primaryColor || "#4483f5";

    this._updateBaseUIFromConfig(); // Обновляем базовые поля UI
  }

  //  Новый метод для обновления превью
  _updatePresetPreview(presetId) {
    const container = this.elements.presetPreviewContainer;
    if (!container) return;
    container.innerHTML = ""; // Очищаем
    container.classList.remove("has-multiple-previews"); // Убираем класс для сетки
    container.style.display = "none"; // Скрываем по умолчанию

    const presetData = this.presets[presetId];
    const previews = presetData?.previewImages;

    if (previews && previews.default) {
      container.style.display = "block"; // Показываем контейнер

      if (previews.active) {
        // Если есть две картинки
        container.classList.add("has-multiple-previews");

        const figureDefault = document.createElement("figure");
        const imgDefault = document.createElement("img");
        imgDefault.src = previews.default;
        imgDefault.alt = `Превью: ${presetData.name} (стандартное)`;
        imgDefault.loading = "lazy";
        const captionDefault = document.createElement("figcaption");
        captionDefault.textContent = "Стандартный вид";
        figureDefault.appendChild(imgDefault);
        figureDefault.appendChild(captionDefault);
        container.appendChild(figureDefault);

        const figureActive = document.createElement("figure");
        const imgActive = document.createElement("img");
        imgActive.src = previews.active;
        imgActive.alt = `Превью: ${presetData.name} (активное)`;
        imgActive.loading = "lazy";
        const captionActive = document.createElement("figcaption");
        captionActive.textContent = "Активный фильтр";
        figureActive.appendChild(imgActive);
        figureActive.appendChild(captionActive);
        container.appendChild(figureActive);
      } else {
        // Если только одна картинка
        const img = document.createElement("img");
        img.src = previews.default;
        img.alt = `Превью: ${presetData.name}`;
        img.loading = "lazy";
        container.appendChild(img);
      }
    }
  }

  _populatePresetSelect() {
    const select = this.elements.presetSelect;
    if (!select) return;
    select.innerHTML = "";
    Object.entries(this.presets).forEach(([id, presetData]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = presetData.name;
      select.appendChild(option);
    });
    select.value = this.config.preset || "custom"; // Устанавливаем выбранное значение
  }

  _updateBaseUIFromConfig() {
    if (!this.elements) return;
    if (this.elements.collectionIdInput)
      this.elements.collectionIdInput.value = this.config.collectionId || "";
    // widgetIdInput УДАЛЕНО
    if (this.elements.targetSelectorInput)
      this.elements.targetSelectorInput.value =
        this.config.targetSelector || "collection";
    if (this.elements.applyButtonSelectorInput)
      this.elements.applyButtonSelectorInput.value =
        this.config.applyButtonSelector || "";
    if (this.elements.resetButtonSelectorInput)
      this.elements.resetButtonSelectorInput.value =
        this.config.resetButtonSelector || "";
    if (this.elements.itemsPerPageInput)
      this.elements.itemsPerPageInput.value = this.config.itemsPerPage || 9;
    if (this.elements.paginationTypeSelect)
      this.elements.paginationTypeSelect.value =
        this.config.paginationType || "none";
    if (this.elements.showLoaderCheckbox)
      this.elements.showLoaderCheckbox.checked =
        this.config.showLoader !== false;
    if (this.elements.primaryColorInput)
      this.elements.primaryColorInput.value =
        this.config.primaryColor || "#4483f5";
    if (this.elements.presetSelect)
      this.elements.presetSelect.value = this.config.preset || "custom";
    if (this.elements.presetDescription)
      this.elements.presetDescription.textContent =
        this.presets[this.config.preset || "custom"]?.description || "";
  }

  _renderAllFieldCardsDOM() {
    if (!this.elements.filterFieldsContainer) return;
    const container = this.elements.filterFieldsContainer;
    container.innerHTML = ""; // Очищаем перед рендерингом
    if (Array.isArray(this.config.fields)) {
      this.config.fields.forEach((fieldData, index) => {
        this._addSingleFieldCardDOM(fieldData, index);
      });
    }
  }

  _toggleOutputSection(fieldCard) {
    // Эта функция больше не используется, так как секция вывода удалена
    if (!fieldCard) return;
    const outputSection = fieldCard.querySelector(".field-output-config");
    const button = fieldCard.querySelector(".configure-output-btn");
    if (!outputSection || !button) return;
    const isVisible = outputSection.style.display !== "none";
    outputSection.style.display = isVisible ? "none" : "block";
    button.textContent = isVisible
      ? "Настроить вывод данных"
      : "Скрыть настройки вывода";
    button.setAttribute("aria-expanded", isVisible ? "false" : "true");
  }

  _handleAddFilterField() {
    const uniqueId = `field-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;
    const newFieldData = {
      fieldId: "",
      uniqueId: uniqueId,
      label: "Новое поле",
      uiType: UI_TYPES.NONE,
      firstIsAll: true, // По умолчанию true для select/radio/buttons
      // instantFilter по умолчанию true, кроме INPUT (устанавливается в _addSingleFieldCardDOM)
      instantFilter: true, // По умолчанию true (будет изменено на false для input в _addSingleFieldCardDOM)
      elementSelector: null,
      clearButtonSelector: null,
      // targetSelector и outputType УДАЛЕНЫ
      condition: null, // Определяется при сборе данных
    };

    if (!Array.isArray(this.config.fields)) {
      this.config.fields = [];
    }
    this.config.fields.push(newFieldData);
    this._addSingleFieldCardDOM(newFieldData, this.config.fields.length - 1);
    this._resetPresetSelection();
  }

  _handleRemoveFilterField(uniqueIdToRemove) {
    if (!uniqueIdToRemove || !Array.isArray(this.config.fields)) return;
    const indexToRemove = this.config.fields.findIndex(
      (f) => f.uniqueId === uniqueIdToRemove
    );
    if (indexToRemove !== -1) {
      this.config.fields.splice(indexToRemove, 1);
      const cardToRemove = this.elements.filterFieldsContainer?.querySelector(
        `.field-card[data-field-unique-id="${uniqueIdToRemove}"]`
      );
      cardToRemove?.remove();
      this._updateCardIndices();
      this._resetPresetSelection();
    }
  }

  _updateCardIndices() {
    const cards =
      this.elements.filterFieldsContainer?.querySelectorAll(".field-card");
    cards?.forEach((card, index) => {
      card.dataset.fieldIndex = index;
      const indexDisplay = card.querySelector(".field-index-display");
      if (indexDisplay) indexDisplay.textContent = `#${index + 1}`;
    });
  }

  _resetPresetSelection() {
    if (this.config.preset !== "custom") {
      this.config.preset = "custom";
      if (this.elements.presetSelect)
        this.elements.presetSelect.value = "custom";
      if (this.elements.presetDescription)
        this.elements.presetDescription.textContent =
          this.presets.custom.description;
    }
  }

  _capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // --- Обновление видимости элементов в карточке ---
  _updateFieldCardUIVisibility(fieldCard) {
    if (!fieldCard) return;

    const uiTypeSelect = fieldCard.querySelector(".filter-ui-type");
    const selectedUiType = uiTypeSelect?.value || UI_TYPES.NONE;

    // Скрытие/показ строк и групп в зависимости от uiType
    const controlsRow = fieldCard.querySelector(".filter-controls-row"); // Это основная строка для настроек фильтра
    const filterSelectorGroup = fieldCard.querySelector(
      ".filter-selector-group"
    ); // Группа для "Класс элемента(ов) фильтра"
    const firstIsAllContainer = fieldCard.querySelector(
      ".filter-first-is-all-container"
    );
    const instantFilterContainer = fieldCard.querySelector(
      ".filter-instant-container"
    );
    const clearButtonGroup = fieldCard
      .querySelector(".filter-clear-button-selector") // Инпут для класса кнопки сброса
      ?.closest(".field-group");
    const filterSelectorInput = fieldCard.querySelector(
      ".filter-element-selector"
    );
    const requiredIndicator = filterSelectorGroup?.querySelector(
      // Ищем индикатор внутри группы
      ".filter-selector-required"
    );
    const instantFilterCheckbox = fieldCard.querySelector(
      ".filter-instant-filter"
    ); //  Получаем чекбокс

    // Скрытие/показ
    if (controlsRow) controlsRow.style.display = "none";
    if (filterSelectorGroup) filterSelectorGroup.style.display = "none";
    if (firstIsAllContainer) firstIsAllContainer.style.display = "none";
    if (instantFilterContainer) instantFilterContainer.style.display = "none";
    if (clearButtonGroup) clearButtonGroup.style.display = "none";
    if (filterSelectorInput) filterSelectorInput.required = false;
    if (requiredIndicator) requiredIndicator.style.display = "none";

    const isFilterType = selectedUiType !== UI_TYPES.NONE;
    if (isFilterType) {
      if (controlsRow) controlsRow.style.display = "grid"; // Или "flex", в зависимости от CSS
      if (filterSelectorGroup) filterSelectorGroup.style.display = "block";
      if (filterSelectorInput) filterSelectorInput.required = true;
      if (requiredIndicator) requiredIndicator.style.display = "inline";
      if (clearButtonGroup) clearButtonGroup.style.display = "block";

      const showFirstIsAll = [
        UI_TYPES.SELECT,
        UI_TYPES.RADIO,
        UI_TYPES.BUTTONS,
      ].includes(selectedUiType);
      if (firstIsAllContainer) {
        firstIsAllContainer.style.display = showFirstIsAll ? "block" : "none";
      }

      //  Показываем "Мгновенная фильтрация" для ВСЕХ типов, включая INPUT
      if (instantFilterContainer)
        instantFilterContainer.style.display = "block";

      //  Устанавливаем состояние чекбокса "Мгновенная" при смене типа UI
      if (instantFilterCheckbox) {
        const uniqueId = fieldCard.dataset.fieldUniqueId;
        const fieldConf = this.config.fields?.find(
          (f) => f.uniqueId === uniqueId
        );
        if (fieldConf) {
          // По умолчанию true для всех, кроме INPUT
          instantFilterCheckbox.checked =
            fieldConf.instantFilter ?? selectedUiType !== UI_TYPES.INPUT;
        }
      }
    }

    this._updateUiTypeHelper(fieldCard, selectedUiType); // Обновляем подсказку
    // this._updateOutputTypeVisibility(fieldCard); // УДАЛЕНО, так как секции вывода нет
  }

  // --- Добавление ОДНОЙ карточки поля в DOM ---
  _addSingleFieldCardDOM(data = {}, index) {
    if (
      !this.elements.filterFieldTemplate ||
      !this.elements.filterFieldsContainer
    )
      return;
    const tpl = this.elements.filterFieldTemplate;
    const container = this.elements.filterFieldsContainer;
    const clone = tpl.content.cloneNode(true);
    const fieldCard = clone.querySelector(".field-card");
    if (!fieldCard) return;

    data.uniqueId =
      data.uniqueId ||
      `field-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    fieldCard.dataset.fieldIndex = index;
    fieldCard.dataset.fieldUniqueId = data.uniqueId;

    // --- Заполнение элементов ---
    const elements = {
      labelTextElement: fieldCard.querySelector(".field-label-text"),
      indexDisplay: fieldCard.querySelector(".field-index-display"),
      fieldIdInput: fieldCard.querySelector(".filter-field-id"),
      fieldIdHelperText: fieldCard.querySelector(
        ".filter-field-id + .helper-text"
      ),
      uiTypeSelect: fieldCard.querySelector(".filter-ui-type"),
      firstIsAllCheckbox: fieldCard.querySelector(".filter-first-is-all"),
      instantFilterCheckbox: fieldCard.querySelector(".filter-instant-filter"),
      filterSelectorInput: fieldCard.querySelector(".filter-element-selector"),
      clearButtonSelectorInput: fieldCard.querySelector(
        ".filter-clear-button-selector"
      ), // Удалены элементы, связанные с выводом:
      // configureOutputBtn: fieldCard.querySelector(".configure-output-btn"),
      // outputConfigContainer: fieldCard.querySelector(".field-output-config"),
      // targetSelectorInput: fieldCard.querySelector(".filter-target-selector"),
      // outputTypeSelect: fieldCard.querySelector(".filter-output-type"),
    };

    const displayLabel =
      data.label ||
      (data.fieldId ? this._capitalizeFirstLetter(data.fieldId) : `Новое поле`);
    if (elements.labelTextElement)
      elements.labelTextElement.textContent = displayLabel;
    if (elements.indexDisplay)
      elements.indexDisplay.textContent = `#${index + 1}`;
    if (elements.fieldIdInput) {
      elements.fieldIdInput.value = data.fieldId || "";
      elements.fieldIdInput.dataset.configName = "fieldId";
    }
    if (elements.uiTypeSelect) {
      elements.uiTypeSelect.value = data.uiType || UI_TYPES.NONE;
      elements.uiTypeSelect.dataset.configName = "uiType";
    }
    if (elements.firstIsAllCheckbox) {
      elements.firstIsAllCheckbox.checked = data.firstIsAll !== false;
      elements.firstIsAllCheckbox.dataset.configName = "firstIsAll";
    }
    if (elements.filterSelectorInput) {
      elements.filterSelectorInput.value = data.elementSelector || "";
      elements.filterSelectorInput.dataset.configName = "elementSelector";
    }
    if (elements.clearButtonSelectorInput) {
      elements.clearButtonSelectorInput.value = data.clearButtonSelector || "";
      elements.clearButtonSelectorInput.dataset.configName =
        "clearButtonSelector";
    } // Удалена логика для targetSelectorInput и outputTypeSelect

    // Логика для configureOutputBtn и outputConfigContainer УДАЛЕНА

    //  Устанавливаем instantFilter с учетом типа по умолчанию
    if (elements.instantFilterCheckbox) {
      const defaultInstant =
        data.instantFilter ?? data.uiType !== UI_TYPES.INPUT;
      elements.instantFilterCheckbox.checked = defaultInstant;
      elements.instantFilterCheckbox.dataset.configName = "instantFilter";
      // Важно: Обновляем и объект data, если instantFilter не был задан явно
      if (!("instantFilter" in data)) {
        data.instantFilter = defaultInstant;
      }
    }

    container.appendChild(clone);
    this._updateFieldCardUIVisibility(fieldCard); // Обновляем видимость контролов
  }

  _updateUiTypeHelper(fieldCard, uiType) {
    const helper = fieldCard.querySelector(".ui-type-helper");
    const description = fieldCard.querySelector(".ui-type-description");
    if (!helper || !description) return;
    let helperText = "";
    let showHelper = true;
    switch (uiType) {
      case "input":
        helperText =
          "Поиск по тексту: используйте для полнотекстового поиска или фильтрации по части слова";
        break;
      case "select":
        helperText =
          "Выпадающий список: подходит для фильтрации по категориям, где возможен выбор только одного значения";
        break;
      case "radio":
        helperText =
          "Радио-кнопки: используйте для выбора одного значения из нескольких вариантов";
        break;
      case "buttons":
        helperText =
          "Кнопки-теги: визуальные кнопки для выбора одного варианта, хорошо работают с табами Taptop";
        break;
      case "checkbox-set":
        helperText =
          'Чекбокс: позволяет фильтровать по наличию/отсутствию значения (например, "В наличии")';
        break;
      default:
        showHelper = false;
    }
    if (showHelper) {
      description.textContent = helperText;
      helper.style.display = "flex";
    } else {
      helper.style.display = "none";
    }
  }

  // Метод _updateOutputTypeVisibility(fieldCard) УДАЛЕН, так как больше не нужен.
  // _updateOutputTypeVisibility(fieldCard) {
  //   const attributeContainer = fieldCard?.querySelector(
  //     ".target-attribute-container"
  //   );
  //   if (attributeContainer) attributeContainer.style.display = "none";
  // }

  collectData() {
    const baseSettings = {
      collectionId: this.elements.collectionIdInput?.value.trim() || null,
      targetSelector:
        this.elements.targetSelectorInput?.value.trim() || "collection",
      applyButtonSelector:
        this.elements.applyButtonSelectorInput?.value.trim() || null, // widgetId УДАЛЕНО из сбора
      resetButtonSelector:
        this.elements.resetButtonSelectorInput?.value.trim() || null,
      itemsPerPage: parseInt(this.elements.itemsPerPageInput?.value, 10) || 9,
      paginationType: this.elements.paginationTypeSelect?.value || "none",
      showLoader: this.elements.showLoaderCheckbox?.checked ?? true,
      primaryColor: this.elements.primaryColorInput?.value || "#4483f5",
      preset: this.config.preset,
    };

    const collectedFields = (this.config.fields || [])
      .map((fieldConf) => {
        let condition = null;
        if (fieldConf.uiType !== UI_TYPES.NONE) {
          switch (fieldConf.uiType) {
            case UI_TYPES.INPUT:
              condition = FILTER_TYPES.CONTAINS;
              break;
            case UI_TYPES.SELECT:
            case UI_TYPES.RADIO:
            case UI_TYPES.BUTTONS:
              condition = FILTER_TYPES.EQUAL;
              break;
            case UI_TYPES.CHECKBOX_SET:
              condition = FILTER_TYPES.IS_SET;
              break;
          }
        }
        // Убедимся, что instantFilter имеет булево значение
        const instantFilter =
          typeof fieldConf.instantFilter === "boolean"
            ? fieldConf.instantFilter
            : fieldConf.uiType !== UI_TYPES.INPUT;
        return { ...fieldConf, condition, instantFilter };
      }) // Убрана фильтрация по f.targetSelector, так как его больше нет
      .filter((f) => f.fieldId && f.uiType !== UI_TYPES.NONE); // Не включаем поля, не используемые для фильтрации
    return { ...baseSettings, fields: collectedFields };
  }

  _validateSettings(settings) {
    if (!settings.collectionId) {
      this.showErrorModal("Укажите ID Коллекции.");
      return false;
    }
    if (!settings.targetSelector) {
      // targetSelector все еще нужен для определения основного контейнера коллекции
      // но widgetId теперь определяется автоматически
      this.showErrorModal("Укажите Класс виджета Коллекции.");
      return false;
    }
    const itemsPerPage = settings.itemsPerPage;
    if (
      itemsPerPage === undefined ||
      !Number.isInteger(itemsPerPage) ||
      itemsPerPage < 1 ||
      itemsPerPage > 100
    ) {
      this.showErrorModal(
        "Укажите корректное число элементов на странице API (от 1 до 100)."
      );
      return false;
    }

    const isInvalidClassName = (value, label) => {
      if (!value) return false;
      if (/[.#\s\[\]>+~:()]/.test(value)) {
        this.showErrorModal(
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
    // Проверка на settings.fields.length === 0 теперь не так критична,
    // если пользователь хочет просто вывести всю коллекцию без фильтров.
    // Но если fields есть, они должны быть валидны.

    if (!Array.isArray(settings.fields)) settings.fields = []; // Гарантируем, что это массив
    let requiresApplyButton = false;
    const elementSelectorsUsed = new Map();
    const clearButtonSelectorsUsed = new Map();
    const targetSelectorsUsed = new Map(); // Оставляем для предупреждения, хотя вывод не настраивается здесь

    for (const [index, field] of settings.fields.entries()) {
      const fieldLabelPrefix = `Поле #${index + 1} (${
        field.label || field.fieldId || "???"
      })`;
      if (!field.fieldId) {
        this.showErrorModal(`Поле #${index + 1}: не указано Имя или ID Поля.`);
        return false;
      }
      // Проверяем только поля, которые используются для фильтрации
      const isFilterType = field.uiType !== UI_TYPES.NONE;

      if (isFilterType) {
        if (!field.elementSelector) {
          this.showErrorModal(
            `${fieldLabelPrefix}: не указан Класс элемента(ов) фильтра.`
          );
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
            this.showErrorModal(
              `Класс фильтра '${field.elementSelector}' используется для разных полей.`
            );
            return false;
          }
        } else {
          elementSelectorsUsed.set(field.elementSelector, field.fieldId);
        }
        if (field.clearButtonSelector) {
          if (clearButtonSelectorsUsed.has(field.clearButtonSelector)) {
            this.showErrorModal(
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
        if (!field.instantFilter) requiresApplyButton = true; // Требуется кнопка, если фильтр не мгновенный
      }
      // Проверки для isOutputType (targetSelector, outputType) УДАЛЕНЫ
    }

    targetSelectorsUsed.forEach((fieldIds, selector) => {
      // Эта проверка больше не актуальна для генератора, но может быть полезна для отладки
      // if (fieldIds.length > 1)
      //   console.warn(
      //     `[CF Validate] Предупреждение: Несколько полей (${fieldIds.join(
      //       ", "
      //     )}) выводятся в элемент '${selector}'.`
      //   );
    });

    if (requiresApplyButton && !settings.applyButtonSelector) {
      this.showErrorModal(
        'Хотя бы один из настроенных фильтров не является "Мгновенным". Укажите CSS-класс для кнопки "Применить все фильтры" в Основных настройках или сделайте все фильтры мгновенными.'
      );
      return false;
    }
    return true;
  }

  generateAndCopyCode() {
    const settings = this.collectData();
    if (!this._validateSettings(settings)) return;
    const code = this.generateCode(settings);
    if (this.elements.jsCode) this.elements.jsCode.textContent = code;
    this.copyAndNotify(code);
  }

  // --- Генерация кода скрипта с поддержкой табов Taptop ---
  generateCode(settings = {}) {
    const runtimeConfig = {
      collectionId: settings.collectionId, // widgetId УДАЛЕН из runtimeConfig
      targetSelector: settings.targetSelector,
      applyButtonSelector: settings.applyButtonSelector || null,
      resetButtonSelector: settings.resetButtonSelector || null,
      itemsPerPage: settings.itemsPerPage || 9,
      paginationType: settings.paginationType || "none",
      showLoader: settings.showLoader !== false,
      primaryColor: settings.primaryColor || "#4483f5",
      fields:
        settings.fields?.map((f) => ({
          // Сохраняем только данные, нужные для фильтрации
          fieldIdOrName: f.fieldId,
          label: f.label || f.fieldId,
          uiType: f.uiType,
          elementSelector: f.elementSelector || null,
          clearButtonSelector: f.clearButtonSelector || null,
          // targetSelector и outputType УДАЛЕНЫ
          firstIsAll: f.firstIsAll !== false,
          instantFilter: f.instantFilter ?? f.uiType !== UI_TYPES.INPUT,
          condition: f.condition, // condition определяется в collectData на основе uiType
        })) || [],
      apiEndpoint: "/-/x-api/v1/public/?method=mosaic/collectionSearch",
      debounceTimeout: 300,
      // Синонимы оставлены, так как они используются в runtime для маппинга имен на ID
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
    };

    const runtimeConfigJSON = JSON.stringify(runtimeConfig);

    // Шаблон скрипта runtime (остается без изменений, так как вывод данных теперь обрабатывается Taptop)
    const scriptCode = `
<style>
.cf-custom-pagination-container,.cf-loader-overlay{--cf-primary-color:${
      runtimeConfig.primaryColor || "#4483f5"
    };}.cf-loader-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.7);display:flex;justify-content:center;align-items:center;z-index:10;transition:opacity .3s ease,visibility .3s ease;opacity:0;visibility:hidden;}.cf-loader-overlay.is-active{opacity:1;visibility:visible;}.cf-loader{width:38px;height:38px;border:4px solid rgba(0,0,0,0.1);border-bottom-color:var(--cf-primary-color);border-radius:50%;display:inline-block;box-sizing:border-box;animation:cf-rotation 1s linear infinite;}@keyframes cf-rotation{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.cf-custom-pagination-container{display:flex;justify-content:center;align-items:center;padding:15px 0;gap:5px;flex-wrap:wrap;}.cf-pagination__button,.cf-pagination__number,.cf-pagination__ellipsis{min-width:36px;height:36px;padding:0 10px;border:1px solid #ddd;background-color:#fff;border-radius:6px;cursor:pointer;transition:all .2s ease;font-size:14px;line-height:34px;text-align:center;display:inline-flex;justify-content:center;align-items:center;text-decoration:none;color:#333;}.cf-pagination__button:disabled{cursor:not-allowed;opacity:.5;background-color:#f5f5f5;}.cf-pagination__button:not(:disabled):hover,.cf-pagination__number:not(.is-active):not(.is-disabled):hover{border-color:var(--cf-primary-color);color:var(--cf-primary-color);background-color:rgba(68,131,245,.05);}.cf-pagination__number.is-active{background-color:var(--cf-primary-color);color:white;border-color:var(--cf-primary-color);cursor:default;}.cf-pagination__ellipsis{border:none;background:none;cursor:default;padding:0 5px;}
.${
      runtimeConfig.targetSelector
    } .collection__list{visibility:hidden;opacity:0;transition:opacity .3s ease,visibility 0s linear .3s;}
.${
      runtimeConfig.targetSelector
    }.cf-initialized .collection__list{visibility:visible;opacity:1;transition-delay:0s;}
.${
      runtimeConfig.targetSelector
    }.cf-loading .collection__list{opacity:.4!important;transition:none!important;pointer-events:none;}
.collection__pagination.is-removed{display:none!important;}
.collection__pagination-pages,.collection__pagination-load,.collection__pagination-page-by-page{display:none!important;} /* Скрываем стандартные элементы пагинации Taptop */
.cf-error-message{color:red;padding:10px;border:1px solid red;margin:10px 0;border-radius:4px;background:rgba(255,0,0,0.05);}
</style>
<script>
document.addEventListener('DOMContentLoaded',()=>{
  const FILTER_TYPES=${JSON.stringify(FILTER_TYPES)};
  const UI_TYPES=${JSON.stringify(UI_TYPES)};
  // OUTPUT_TYPES больше не нужен в runtime
  const KNOWN_FALSE_STRINGS_LOWERCASE=${JSON.stringify(
    KNOWN_FALSE_STRINGS_LOWERCASE
  )};
  function debounce(func, wait) { let timeout; const d = function(...a){ const c=this; clearTimeout(timeout); timeout = setTimeout(() => { timeout=null; func.apply(c,a); }, wait); }; d.cancel = () => {clearTimeout(timeout);timeout=null;}; return d; }

  class TaptopCollectionFilter {
    constructor(configObject) {
        this.config = configObject || {}; this.currentPage = 1; this.totalPages = 1; this.currentFilters = [];
        this.elements = { filterControls: {}, clearButtons: {}, customPagination: {} };
        this.itemTemplateElement = null; this.isLoading = false; this.fetchTimeout = null;
        this.fieldIdMap = new Map(); this.isSchemaLoaded = false; this.schemaLoadPromise = null;
        this.applyFiltersDebounced = debounce(() => this.applyFilters(true), this.config.debounceTimeout || 300);
        this._boundHandleCustomPaginationClick = this._handleCustomPaginationClick.bind(this);
        this.isInitialLoad = true;
        this._init();
    }

    _init() {
        this.elements.widget = document.querySelector('.' + this.config.targetSelector);
        if (!this.elements.widget) { console.error('[CF] Виджет не найден:', this.config.targetSelector); return; }
        // widgetId больше не нужен, Taptop сам найдет свой ID
        if (window.getComputedStyle(this.elements.widget).position === 'static') { this.elements.widget.style.position = 'relative'; } // Для позиционирования лоадера
        this.elements.targetContainer = this.elements.widget.querySelector('.collection__list');
        if (!this.elements.targetContainer) { console.error('[CF] Контейнер .collection__list не найден.'); return; }
        this.elements.taptopPaginationContainer = this.elements.widget.querySelector('.collection__pagination');
        if (this.elements.taptopPaginationContainer) {
            this.elements.taptopPaginationContainer.classList.add('cf-custom-pagination-container');
            this.elements.taptopPaginationContainer.style.display = ''; // Убедимся, что контейнер видим
            this.elements.taptopPaginationContainer.addEventListener('click', this._boundHandleCustomPaginationClick);
            console.log('[CF] Контейнер пагинации Taptop найден.');
        } else { console.warn('[CF] Контейнер пагинации Taptop (.collection__pagination) не найден.'); }
        if (this.config.showLoader) { this.elements.loaderOverlay=document.createElement('div');this.elements.loaderOverlay.className='cf-loader-overlay';this.elements.loaderOverlay.innerHTML='<span class="cf-loader"></span>';this.elements.widget.appendChild(this.elements.loaderOverlay); }
        this.schemaLoadPromise = this._loadSchemaAndMapIds().catch(error => { console.error("[CF Init] Ошибка загрузки схемы:", error); });
        this.elements.notFoundElement = this.elements.widget.querySelector('.collection__empty');
        this._findControlsAndButtons();
        if (!this._cacheItemTemplate()) return; // Шаблон теперь не используется для рендера, но нужен для проверки наличия
        this._bindEvents();
        console.log('[CF] Фильтр инициализирован.');
        if (this.elements.notFoundElement) this.elements.notFoundElement.classList.add('is-removed'); // Скрываем стандартное "не найдено"
        this.schemaLoadPromise.finally(() => { // Запускаем первый fetch после попытки загрузки схемы
            this.isSchemaLoaded = this.fieldIdMap.size > 0;
            console.log(\`[CF] Схема \${this.isSchemaLoaded ? 'загружена' : 'не загружена'}. Запуск первичной загрузки...\`);
            if (this.config.showLoader) this._setLoadingState(true);
            this.fetchAndRenderItems([], 1);
        });
    }

    async _loadSchemaAndMapIds() {
        if(!this.config.collectionId){console.warn("[CF Schema] ID Коллекции не указан.");return;}
        const schemaUrl=new URL(this.config.apiEndpoint,window.location.origin);
        schemaUrl.searchParams.set('param[collection_id]',this.config.collectionId);
        schemaUrl.searchParams.set('param[per_page]','0'); // Запрашиваем 0 элементов, чтобы получить только схему
        try{
            const response=await fetch(schemaUrl);
            if(!response.ok)throw new Error(\`API \${response.status}\`);
            const data=await response.json();
            if(data.error)throw new Error(\`API \${data.error.message}\`);
            const schemaFields=[...(data.result?.c_schema||[]),...(data.result?.settings||[])]; // Объединяем основные поля и системные
            if(schemaFields.length===0){console.warn('[CF Schema] Схема не найдена или пуста.');return;}
            const nameToIdMap=new Map();
            // Заполняем карту: имя_поля -> ID, id_поля -> ID
            schemaFields.forEach(field=>{
                const fId=String(field.id).trim();
                let fName=(field.field_name||'').trim().toLowerCase();
                if(!fName){ // Добавляем стандартные имена для title/slug, если имя не задано
                    if(field.type==='title'||fId==='title')fName='title';
                    else if(field.type==='slug'||fId==='slug')fName='slug';
                }
                if(fId){
                    nameToIdMap.set(fId.toLowerCase(),fId); // ID -> ID (для случаев, когда пользователь вводит ID)
                    if(fName) nameToIdMap.set(fName,fId); // Имя -> ID
                }
            });

            // Маппим fieldIdOrName из конфига на реальные ID
            if(Array.isArray(this.config.fields)){
                this.config.fields.forEach(confField=>{
                    const fIdOrName=String(confField.fieldIdOrName||'').trim();
                    const fIdOrNameLower=fIdOrName.toLowerCase();
                    let foundId=nameToIdMap.get(fIdOrNameLower); // Прямое совпадение имени или ID

                    // Поиск по синонимам
                    if(!foundId){
                        const synGroups=[this.config.imageFieldSynonyms,this.config.priceFieldSynonyms,this.config.categoryFieldSynonyms,this.config.tagFieldSynonyms,this.config.stockFieldSynonyms,this.config.descriptionFieldSynonyms];
                        for(const group of synGroups){
                            if(group&&group.includes(fIdOrNameLower)){
                                for(const syn of group){ foundId=nameToIdMap.get(syn); if(foundId){console.log(\`[CF Map] Найден синоним для '\${fIdOrNameLower}': ID '\${foundId}'\`);break;} }
                            } if(foundId)break;
                        }
                    }

                    // Поиск по частичному совпадению имени
                    if(!foundId && !/^[a-f0-9]{6,}$/i.test(fIdOrName)){ // Ищем только если это не похоже на ID
                        let partialMatchId=null, bestMatchName='';
                        for(const[name,id] of nameToIdMap.entries()){
                            if(!/^[a-f0-9]{6,}$/i.test(name) && name!=='title' && name!=='slug' && name.includes(fIdOrNameLower)){
                                partialMatchId=id; bestMatchName=name; break; // Берем первое частичное совпадение
                            }
                        }
                        if(partialMatchId){ foundId=partialMatchId; console.log(\`[CF Map] Частичное совпадение для '\${fIdOrName}': найдено '\${bestMatchName}' (ID '\${foundId}').\`); }
                    }

                    // Сохраняем найденный ID или используем введенное значение, если оно похоже на ID
                    if(foundId){ this.fieldIdMap.set(confField.fieldIdOrName,foundId); }
                    else {
                        if(/^[a-f0-9]{6,}$/i.test(fIdOrName) || fIdOrName==='title' || fIdOrName==='slug'){
                            this.fieldIdMap.set(confField.fieldIdOrName,fIdOrName); // Используем как есть
                            console.log(\`[CF Map] Используется '\${fIdOrName}' как ID (не найдено в схеме).\`);
                        } else {
                            console.warn(\`[CF Map] Поле '\${confField.fieldIdOrName}' (Метка: '\${confField.label}') не найдено в схеме коллекции.\`);
                        }
                    }
                });
            }
            console.log('[CF Schema] Карта ID полей:',Object.fromEntries(this.fieldIdMap));
        } catch(error){ throw new Error(\`Загрузка схемы не удалась: \${error.message}\`); }
    }

    _getRealFieldId(fieldIdOrName){ return this.fieldIdMap.get(String(fieldIdOrName)) || String(fieldIdOrName); } // Возвращаем оригинал, если не найдено

    _findControlsAndButtons(){
        if(this.config.applyButtonSelector)this.elements.applyButton=document.querySelector('.'+this.config.applyButtonSelector);
        if(this.config.resetButtonSelector)this.elements.resetButton=document.querySelector('.'+this.config.resetButtonSelector);
        this.elements.filterControls={}; this.elements.clearButtons={};
        if(!Array.isArray(this.config.fields))return;
        this.config.fields.forEach(field=>{
            if(field.elementSelector&&field.condition){ // Ищем контролы только для полей с фильтрацией
                const controls=document.querySelectorAll('.'+field.elementSelector);
                if(controls.length>0)this.elements.filterControls[field.fieldIdOrName]=controls;
                else console.warn('[CF] Элемент управления фильтром не найден:',field.elementSelector,'для поля',field.fieldIdOrName);
            }
            if(field.clearButtonSelector){
                const btn=document.querySelector('.'+field.clearButtonSelector);
                if(btn)this.elements.clearButtons[field.fieldIdOrName]=btn;
                else console.warn('[CF] Кнопка сброса поля не найдена:',field.clearButtonSelector,'для поля',field.fieldIdOrName);
            }
        });
        // Проверяем необходимость кнопки "Применить"
        const needsApply=this.config.fields.some(f=>f.condition&&f.instantFilter===false);
        if(needsApply&&!this.elements.applyButton)console.error('[CF] Кнопка "Применить" ('+this.config.applyButtonSelector+') не найдена, но требуется для некоторых фильтров.');
    }

    _cacheItemTemplate(){
        // Кэширование шаблона больше не нужно для рендера, но можно оставить для проверки
        if(!this.elements.targetContainer)return false;
        const first=this.elements.targetContainer.querySelector('.collection__item');
        if(first){
            // this.itemTemplateElement=first.cloneNode(true); // Можно убрать
            return true;
        }else{
            // Если нет ни одного элемента, это нормально при первой загрузке
            // console.warn("[CF] Шаблон элемента .collection__item не найден (возможно, коллекция пуста).");
            return true; // Возвращаем true, чтобы инициализация продолжилась
        }
    }

    _bindEvents() {
        this.elements.applyButton?.addEventListener('click',()=>this.applyFilters(false));
        this.elements.resetButton?.addEventListener('click',()=>this.resetFilters());
        Object.entries(this.elements.clearButtons).forEach(([fId,btn])=>btn.addEventListener('click',(e)=>this._handleClearFieldClick(e,fId)));

        if(!Array.isArray(this.config.fields))return;
        this.config.fields.forEach(field=>{
            if(!field.elementSelector||!field.condition)return; // Привязываем только к фильтрам
            const controls=this.elements.filterControls[field.fieldIdOrName];
            if(!controls||controls.length===0)return;

            const isInstant=field.instantFilter;
            const handler=isInstant?this.applyFiltersDebounced:()=>{}; // Пустой обработчик для не-мгновенных

            switch(field.uiType){
                case UI_TYPES.INPUT:
                    const input=controls[0]; if(!input)break;
                    // Всегда добавляем listener для Enter keydown, чтобы предотвратить отправку формы
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Предотвращаем стандартную отправку формы
                            // Если фильтр не мгновенный, то вызываем applyFilters
                            if (!isInstant) {
                                if (this.applyFiltersDebounced.cancel) this.applyFiltersDebounced.cancel();
                                this.applyFilters(false);
                            }
                        }
                    });
                    // Listener на 'input' добавляем только если фильтр мгновенный
                    if (isInstant) {
                        input.addEventListener('input', handler);
                    }
                    break;
                case UI_TYPES.SELECT:
                case UI_TYPES.CHECKBOX_SET:
                    // Ищем input/select внутри контрола или сам контрол
                    controls.forEach(c=>(c.matches('input,select')?c:c.querySelector('input,select'))?.addEventListener('change',handler));
                    break;
                case UI_TYPES.RADIO:
                    // Ищем все радио внутри контейнера(ов)
                     controls.forEach(c => {
                         const radios = c.matches('input[type="radio"]') ? [c] : Array.from(c.querySelectorAll('input[type="radio"]'));
                         radios.forEach(r => r.addEventListener('change', handler));
                     });
                    break;
                case UI_TYPES.BUTTONS:
                    const isTaptopTabs = controls[0].classList.contains('tabs__item');
                    controls.forEach(buttonOrTab => buttonOrTab.addEventListener('click', (e) => {
                        if (this.isLoading) return;
                        if (!isTaptopTabs) { // Управляем активным классом только для обычных кнопок
                            e.preventDefault();
                            controls.forEach(btn => btn.classList.remove('tp-filter-button-active'));
                            e.currentTarget.classList.add('tp-filter-button-active');
                        }
                        // Всегда вызываем обработчик (для табов Taptop он сработает после их собственного JS)
                        if (isInstant) handler();
                    }));
                    break;
            }
        });
    }

    applyFilters(isDebounced=false){
        if(this.isLoading && isDebounced){ console.warn('[CF Apply] Пропуск отложенного применения (уже идет загрузка)'); return; }
        if(this.isLoading && !isDebounced){ console.warn('[CF Apply] Пропуск прямого применения (уже идет загрузка)'); return; }
        console.log(\`[CF] Применение фильтров... (Отложено: \${isDebounced})\`);
        this.currentPage=1; // Всегда сбрасываем на первую страницу при применении
        this.currentFilters=this._collectFilterValues();
        this.fetchAndRenderItems(this.currentFilters,this.currentPage);
    }

    resetFilters() {
        if (this.isLoading) return;
        console.log('[CF] Сброс фильтров...');
        if (!Array.isArray(this.config.fields)) return;
        this.config.fields.forEach(field => {
            if (!field.elementSelector) return; // Сбрасываем только поля с контролами
            const controls = this.elements.filterControls[field.fieldIdOrName];
            if (!controls || controls.length === 0) return;

            switch (field.uiType) {
                case UI_TYPES.INPUT: controls[0].value = ''; break;
                case UI_TYPES.SELECT: controls[0].selectedIndex = 0; break;
                case UI_TYPES.RADIO:
                    let firstRadio=true;
                    controls.forEach(c => {
                        const radios = c.matches('input[type="radio"]') ? [c] : Array.from(c.querySelectorAll('input[type="radio"]'));
                        radios.forEach(r => { r.checked = firstRadio && field.firstIsAll; firstRadio = false; });
                    });
                    break;
                case UI_TYPES.BUTTONS:
                    const isTaptopTabs = controls[0].classList.contains('tabs__item');
                    if (isTaptopTabs) {
                        controls.forEach((tab, i) => {
                            const isActive = i === 0 && field.firstIsAll;
                            tab.classList.toggle('is-opened', isActive);
                            // tab.classList.toggle('tp-filter-button-active', isActive); // Taptop сам управляет is-opened
                        });
                        // Визуальный сброс табов может потребовать клика на первый таб
                        if (field.firstIsAll && controls[0] && typeof controls[0].click === 'function') {
                             // controls[0].click(); // Раскомментировать, если нужно имитировать клик (Taptop должен сделать это сам)
                        }
                    } else {
                        controls.forEach((btn, i) => btn.classList.toggle('tp-filter-button-active', i === 0 && field.firstIsAll));
                    }
                    break;
                case UI_TYPES.CHECKBOX_SET:
                    const cb = controls[0]?.querySelector('input[type="checkbox"]') || (controls[0]?.matches('input[type="checkbox"]') ? controls[0] : null);
                    if(cb) cb.checked=false;
                    break;
                default:
                    if ('value' in controls[0]) controls[0].value = '';
                    break;
            }
        });
        this.currentPage = 1; this.currentFilters = []; this.fetchAndRenderItems([], this.currentPage); // Загружаем данные после сброса
    }

    _handleClearFieldClick(event, fieldIdOrNameToClear) {
        event.preventDefault(); if (this.isLoading || !fieldIdOrNameToClear) return;
        console.log(\`[CF] Сброс поля: \${fieldIdOrNameToClear}\`);
        const fieldConfig = this.config.fields.find(f => f.fieldIdOrName === fieldIdOrNameToClear);
        if (!fieldConfig || !fieldConfig.elementSelector) return;
        const controls = this.elements.filterControls[fieldIdOrNameToClear];
        if (!controls || controls.length === 0) return;

        // Логика сброса значения контрола (аналогично resetFilters)
        switch (fieldConfig.uiType) {
            case UI_TYPES.INPUT: controls[0].value = ''; break;
            case UI_TYPES.SELECT: controls[0].selectedIndex = 0; break;
            case UI_TYPES.RADIO:
                const firstRadio = controls[0]?.querySelector('input[type="radio"]') || (controls[0]?.matches('input[type="radio"]') ? controls[0] : null);
                if(firstRadio && fieldConfig.firstIsAll) firstRadio.checked=true;
                else controls.forEach(c => (c.querySelector('input[type="radio"]')||c).checked=false);
                break;
            case UI_TYPES.BUTTONS:
                const isTaptopTabs = controls[0].classList.contains('tabs__item');
                if (isTaptopTabs) {
                    controls.forEach((tab, i) => {
                        const shouldBeActive = i === 0 && fieldConfig.firstIsAll;
                        tab.classList.toggle('is-opened', shouldBeActive);
                        // tab.classList.toggle('tp-filter-button-active', shouldBeActive);
                    });
                     if (fieldConfig.firstIsAll && controls[0]) controls[0].click(); // Клик для табов
                } else {
                     controls.forEach((btn, i) => btn.classList.toggle('tp-filter-button-active', i === 0 && fieldConfig.firstIsAll));
                }
                break;
            case UI_TYPES.CHECKBOX_SET:
                const checkbox = controls[0]?.querySelector('input[type="checkbox"]') || (controls[0]?.matches('input[type="checkbox"]') ? controls[0] : null);
                if(checkbox) checkbox.checked=false;
                break;
            default:
                if ('value' in controls[0]) controls[0].value = '';
                break;
        }
        // Применяем фильтры после сброса поля
        if (fieldConfig?.instantFilter) this.applyFiltersDebounced();
        else if (this.elements.applyButton) console.log('[CF Clear] Требуется нажатие "Применить".');
        else this.applyFiltersDebounced(); // Применяем, если кнопки "Применить" нет
    }

    _collectFilterValues() {
        const apiFilters = []; if (!Array.isArray(this.config.fields)) return apiFilters;
        this.config.fields.forEach(field => {
            if(!field.elementSelector || !field.condition) return;
            const realFieldId = this._getRealFieldId(field.fieldIdOrName);
            if(!realFieldId) return;
            const controls = this.elements.filterControls[field.fieldIdOrName];
            if(!controls || controls.length === 0) return;

            let value = null, skipFilter = false;
            switch (field.uiType) {
                case UI_TYPES.INPUT: value = controls[0].value?.trim(); break;
                case UI_TYPES.SELECT: value = controls[0].value?.trim(); skipFilter = controls[0].selectedIndex === 0 && field.firstIsAll; break;
                case UI_TYPES.RADIO:
                    let firstRadio = null, checkedRadio = null;
                    for (const c of controls) {
                        const radios = c.matches('input[type="radio"]') ? [c] : Array.from(c.querySelectorAll('input[type="radio"]'));
                        if (!firstRadio && radios.length > 0) firstRadio = radios[0];
                        const checked = radios.find(i => i.checked);
                        if (checked) { checkedRadio = checked; break; }
                    }
                    value = checkedRadio ? checkedRadio.value?.trim() : null;
                    skipFilter = checkedRadio === firstRadio && field.firstIsAll;
                    break;
                case UI_TYPES.BUTTONS:
                    const isTaptopTabs = controls[0].classList.contains('tabs__item');
                    let firstBtnOrTab = controls[0], activeBtnOrTab = null;
                    if (isTaptopTabs) {
                        activeBtnOrTab = Array.from(controls).find(el => el.classList.contains('is-opened'));
                        if (activeBtnOrTab) { const titleEl = activeBtnOrTab.querySelector('.tabs__item-title'); value = titleEl ? titleEl.textContent?.trim() : activeBtnOrTab.textContent?.trim(); }
                        else value = null;
                    } else {
                        activeBtnOrTab = Array.from(controls).find(el => el.classList.contains('tp-filter-button-active'));
                        if (activeBtnOrTab) { value = activeBtnOrTab.dataset.value?.trim() || activeBtnOrTab.textContent?.trim(); }
                        else value = null;
                    }
                    skipFilter = activeBtnOrTab === firstBtnOrTab && field.firstIsAll;
                    break;
                case UI_TYPES.CHECKBOX_SET:
                     let checkbox = null;
                     if(controls[0]?.matches('input[type="checkbox"]')) checkbox = controls[0];
                     else if(controls[0]) checkbox = controls[0].querySelector('input[type="checkbox"]');
                     value = checkbox ? checkbox.checked : null;
                    break;
                default: if ('value' in controls[0]) value = controls[0].value?.trim(); else if ('checked' in controls[0]) value = controls[0].checked;
            }

            if (!skipFilter) {
                if (field.condition === FILTER_TYPES.IS_SET) {
                    if (value === true) { // Только если чекбокс отмечен
                        apiFilters.push({ field_id: realFieldId, type: FILTER_TYPES.IS_SET });
                        // Добавляем условия "не равно" для известных ложных значений,
                        // чтобы отфильтровать пустые, "false", "no", "нет"
                        KNOWN_FALSE_STRINGS_LOWERCASE.forEach(falseVal => { apiFilters.push({ field_id: realFieldId, type: FILTER_TYPES.NOT_EQUAL, value: falseVal }); });
                        apiFilters.push({ field_id: realFieldId, type: FILTER_TYPES.NOT_EQUAL, value: '' }); // Добавляем проверку на пустую строку
                    }
                } else {
                    const hasVal = value !== null && value !== '' && value !== false;
                    if (hasVal) { apiFilters.push({ field_id: realFieldId, type: field.condition, value: String(value) }); }
                }
            }
        });
        return apiFilters;
    }

    async fetchAndRenderItems(filters = [], page = 1, append = false) {
        if (this.schemaLoadPromise) { await this.schemaLoadPromise; this.schemaLoadPromise = null; }
        if (!append && this.isLoading) { if(this.applyFiltersDebounced.cancel) this.applyFiltersDebounced.cancel(); if(this.fetchTimeout) clearTimeout(this.fetchTimeout); console.warn('[CF Fetch] Запрос пропущен (идет загрузка).'); return; }
        if (append && this.isLoading) { console.warn('[CF Fetch] Запрос "Загрузить еще" пропущен (идет загрузка).'); return; }

        this.isLoading = true; this._setLoadingState(true);
        if (!append) this.currentPage = page; this.currentFilters = filters;
        if (this.fetchTimeout) clearTimeout(this.fetchTimeout);

        const apiUrl = new URL(this.config.apiEndpoint, window.location.origin);
        apiUrl.searchParams.set('param[collection_id]', this.config.collectionId);
        // widgetId больше не передается, Taptop определит его сам
        const actualFilters = this._collectFilterValues();
        if (actualFilters.length > 0) apiUrl.searchParams.set('param[filters]', JSON.stringify(actualFilters));
        apiUrl.searchParams.set('param[page]', this.currentPage);
        apiUrl.searchParams.set('param[per_page]', this.config.itemsPerPage);

        const controller = new AbortController();
        this.fetchTimeout = setTimeout(() => { controller.abort(); console.warn('[CF Fetch] Таймаут запроса.'); }, 15000);

        // Сохранение текущего HTML больше не нужно, так как Taptop сам обновит контент
        // let currentHtml = (!append && this.elements.targetContainer && !this.isInitialLoad) ? this.elements.targetContainer.innerHTML : undefined;

        try {
            const response = await fetch(apiUrl, { signal: controller.signal });
            clearTimeout(this.fetchTimeout); this.fetchTimeout = null;
            if (!response.ok) throw new Error(\`Ошибка API: \${response.status}\`);
            const data = await response.json();
            if (data.error) throw new Error(\`Ошибка API: \${data.error.message}\`);

            const totalItems = data.result?.page?.all_items_count ?? 0;
            const itemsReceived = data.result?.page?.items || []; // Получаем данные, но не рендерим их здесь

            // _renderResults больше не вызывается, Taptop сам обновит DOM
            // this._renderResults(itemsReceived, append);
            this._renderPaginationControls(totalItems); // Обновляем только пагинацию

            // Уведомляем Taptop о необходимости обновления
            if (this.elements.widget && window.Taptop?.widgets?.[this.elements.widget.dataset.widgetId]?.update) {
                console.log('[CF] Уведомление Taptop об обновлении...');
                window.Taptop.widgets[this.elements.widget.dataset.widgetId].update({
                    filters: actualFilters,
                    page: this.currentPage,
                    perPage: this.config.itemsPerPage
                });
            } else {
                console.warn('[CF] Не удалось найти метод update виджета Taptop.');
                // Можно добавить фоллбэк или сообщение об ошибке, если Taptop недоступен
            }


        } catch (error) {
            clearTimeout(this.fetchTimeout); this.fetchTimeout = null;
            console.error('[CF] Ошибка при загрузке данных:', error);
            if (error.name !== 'AbortError') {
                // if (this.elements.targetContainer && currentHtml !== undefined && !append) { this.elements.targetContainer.innerHTML = currentHtml; } // Восстановление HTML не нужно
                this._showErrorMessage(\`Ошибка загрузки данных: \${error.message}\`);
            } else { this._showErrorMessage('Превышено время ожидания ответа от сервера.'); }
            if (!append) this._renderPaginationControls(0);
            if (this.elements.notFoundElement) this.elements.notFoundElement.classList.add('is-removed');
        } finally {
            this.isLoading = false; this._setLoadingState(false);
            if (this.isInitialLoad) { if (this.elements.widget) this.elements.widget.classList.add('cf-initialized'); this.isInitialLoad = false; }
        }
    }

    _setLoadingState(isLoading) {
        this.elements.widget?.classList.toggle('cf-loading', isLoading);
        Object.values(this.elements.filterControls).forEach(controls => controls?.forEach(c => { const i=c.matches('input,select,button')?c:c.querySelector('input,select,button'); if(i)i.disabled=isLoading; }));
        Object.values(this.elements.clearButtons).forEach(btn => btn.disabled = isLoading);
        if (this.elements.applyButton) this.elements.applyButton.disabled = isLoading;
        if (this.elements.resetButton) this.elements.resetButton.disabled = isLoading;
        if (this.elements.customPagination.prevButton) this.elements.customPagination.prevButton.disabled = isLoading || this.currentPage <= 1;
        if (this.elements.customPagination.nextButton) this.elements.customPagination.nextButton.disabled = isLoading || this.currentPage >= this.totalPages;
        if (this.elements.customPagination.loadMoreButton) this.elements.customPagination.loadMoreButton.disabled = isLoading || this.currentPage >= this.totalPages;
        if (this.config.showLoader && this.elements.loaderOverlay) { this.elements.loaderOverlay.classList.toggle('is-active', isLoading); }
        if (isLoading) this.elements.widget?.querySelector('.cf-error-message')?.remove();
    }

    // _formatDate больше не нужен, так как рендеринг происходит в Taptop
    // _formatDate(dateValue) { ... }

    // _renderResults больше не нужен, так как рендеринг происходит в Taptop
    // _renderResults(items = [], append = false) { ... }

    // _renderSingleItem больше не нужен, так как рендеринг происходит в Taptop
    // _renderSingleItem(item) { ... }

    _renderPaginationControls(totalItems) {
        const container = this.elements.taptopPaginationContainer; if (!container) return;
        container.querySelectorAll('.cf-pagination__button, .cf-pagination__info, .cf-pagination__numbers, .cf-pagination__number, .cf-pagination__ellipsis').forEach(el => el.remove());
        this.elements.customPagination = {};
        this.totalPages = Math.ceil(totalItems / this.config.itemsPerPage);
        const showPagination = this.totalPages > 1 && this.config.paginationType !== 'none';
        container.classList.toggle('is-removed', !showPagination);
        if (!showPagination) return;
        const isFirst = this.currentPage <= 1; const isLast = this.currentPage >= this.totalPages;
        const createButton = (text, direction, disabled, cssClass) => { const btn=document.createElement('button');btn.className=\`cf-pagination__button \${cssClass}\`;btn.textContent=text;btn.disabled=disabled||this.isLoading;btn.dataset.direction=direction;return btn; };
        const createPageNumber = (page) => { const el=document.createElement(page===this.currentPage?'span':'a');el.className='cf-pagination__number';el.textContent=page;if(page===this.currentPage)el.classList.add('is-active');else el.dataset.page=page;el.setAttribute('aria-label',\`Страница \${page}\`);if(page===this.currentPage)el.setAttribute('aria-current','page');return el; };
        const createEllipsis = () => { const el=document.createElement('span');el.className='cf-pagination__ellipsis';el.textContent='...';return el; };
        if (this.config.paginationType === 'prev_next') { const prev=createButton('Назад','-1',isFirst,'cf-pagination__prev');const next=createButton('Вперед','1',isLast,'cf-pagination__next');const info=document.createElement('span');info.className='cf-pagination__info';info.textContent=\`\${this.currentPage} / \${this.totalPages}\`;container.appendChild(prev);container.appendChild(info);container.appendChild(next);this.elements.customPagination={prevButton:prev,nextButton:next}; }
        else if (this.config.paginationType === 'load_more') { if (!isLast) { const loadMore=createButton('Загрузить еще','+1',this.isLoading,'cf-pagination__load-more');loadMore.dataset.action='load_more';container.appendChild(loadMore);this.elements.customPagination.loadMoreButton=loadMore;} }
        else if (this.config.paginationType === 'numbers') { const prev=createButton('‹','-1',isFirst,'cf-pagination__prev');const next=createButton('›','1',isLast,'cf-pagination__next');container.appendChild(prev);const numbersContainer=document.createElement('span');numbersContainer.className='cf-pagination__numbers';const maxVisible=5;const sideCount=Math.floor((maxVisible-3)/2);const showEllipsisThreshold=maxVisible-1;if(this.totalPages<=showEllipsisThreshold+2){for(let i=1;i<=this.totalPages;i++){numbersContainer.appendChild(createPageNumber(i));}}else{numbersContainer.appendChild(createPageNumber(1));if(this.currentPage>sideCount+2){numbersContainer.appendChild(createEllipsis());}const start=Math.max(2,this.currentPage-sideCount);const end=Math.min(this.totalPages-1,this.currentPage+sideCount);for(let i=start;i<=end;i++){numbersContainer.appendChild(createPageNumber(i));}if(this.currentPage<this.totalPages-sideCount-1){numbersContainer.appendChild(createEllipsis());}numbersContainer.appendChild(createPageNumber(this.totalPages));}container.appendChild(numbersContainer);container.appendChild(next);this.elements.customPagination={prevButton:prev,nextButton:next}; }
    }

    _handleCustomPaginationClick(event) {
        const button = event.target.closest('.cf-pagination__button');
        const pageLink = event.target.closest('.cf-pagination__number[data-page]');
        if ((!button && !pageLink) || this.isLoading) return;
        event.preventDefault();
        let newPage = this.currentPage; let appendResults = false;
        if (button) { const action = button.dataset.action; const direction = parseInt(button.dataset.direction, 10); if (action === 'load_more') { newPage = this.currentPage + 1; appendResults = true; } else if (!isNaN(direction)) { newPage = this.currentPage + direction; } else { return; } }
        else if (pageLink) { newPage = parseInt(pageLink.dataset.page, 10); if (isNaN(newPage)) return; }
        else { return; }
        if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.currentPage || appendResults) {
            if (this.elements.widget && !appendResults) { window.scrollTo({ top: this.elements.widget.offsetTop - 80, behavior: 'smooth' }); }
            if (appendResults) { this.currentPage = newPage; } // Обновляем страницу ДО запроса для load_more
            this.fetchAndRenderItems(this.currentFilters, newPage, appendResults);
        }
    }

    _showErrorMessage(message) {
        const cssClass='cf-error-message';
        let div=this.elements.widget?.querySelector('.'+cssClass);
        if(!div && this.elements.widget){
            div=document.createElement('div'); div.className=cssClass;
            const beforeEl = this.elements.targetContainer || this.elements.widget.firstChild;
            this.elements.widget.insertBefore(div, beforeEl);
        }
        if(div) div.textContent=message;
    }

  } // Конец класса TaptopCollectionFilter

  // Инициализация фильтра
  try {
    new TaptopCollectionFilter(${runtimeConfigJSON});
  } catch (e) {
    console.error("[CF] Ошибка инициализации фильтра:", e);
    const widget = document.querySelector('.${
      settings.targetSelector || "collection"
    }');
    if (widget) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'cf-error-message';
        errorDiv.textContent = 'Ошибка инициализации скрипта фильтра. Проверьте настройки генератора и консоль браузера (F12).';
        widget.insertBefore(errorDiv, widget.firstChild);
    }
  }

}); // Конец DOMContentLoaded
</script>
    `;

    return scriptCode;
  }
}
