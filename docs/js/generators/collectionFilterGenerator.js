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
  IS_ON: "FILTER_IS_ON",
  IS_OFF: "FILTER_IS_OFF",
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

export class CollectionFilterGenerator extends BaseGenerator {
  constructor() {
    super();

    // --- Стандартные селекторы ---
    const defaultSelectors = {
      targetSelector: "collection", // Стандартный класс виджета Taptop
      applyButtonSelector: "filter-apply-button",
      resetButtonSelector: "filter-reset-button",
    };

    const defaultColor = "#4483f5";
    const previewPath = "assets/preset-previews/"; // Путь к превью

    //Пресеты
    this.presets = {
      custom: {
        name: "Свой набор полей",
        description: "Начните с чистого листа и добавьте нужные поля вручную.",
        collectionId: "",
        fields: [],
        itemsPerPage: 9,
        ...defaultSelectors,
        preset: "custom",
        paginationType: "none",
        showLoader: true,
        primaryColor: defaultColor,
      },
      simpleCatalog: {
        name: "Простой Каталог (Поиск + Вывод)",
        description:
          "Каталог: Поиск по 'title'. Отображение полей настраивается в Taptop.",
        collectionId: "",
        fields: [
          {
            uniqueId: "psc1",
            fieldId: "title",
            label: "Поиск по названию",
            uiType: UI_TYPES.INPUT,
            elementSelector: "catalog-search",
            instantFilter: false,
            clearButtonSelector: "clear-search",
          },
        ],
        itemsPerPage: 12,
        ...defaultSelectors,
        preset: "simpleCatalog",
        paginationType: "load_more",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: { default: `${previewPath}Простой Каталог.png` },
      },
      categorySelect: {
        name: "Фильтр по Категориям (Список)",
        description:
          "Фильтр: Список для поля 'категория'. Отображение полей настраивается в Taptop.",
        collectionId: "",
        fields: [
          {
            uniqueId: "pcs1",
            fieldId: "категория",
            label: "Категория",
            uiType: UI_TYPES.SELECT,
            elementSelector: "category-select",
            instantFilter: true,
            firstIsAll: true,
            clearButtonSelector: null,
          },
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

        description:
          "Фильтр: Кнопки-теги для поля 'тег'. Отображение полей настраивается в Taptop.",
        collectionId: "",
        fields: [
          {
            uniqueId: "ptb1",
            fieldId: "тег",
            label: "Тег",
            uiType: UI_TYPES.BUTTONS,
            elementSelector: "tag-button",
            instantFilter: true,
            firstIsAll: true,
            clearButtonSelector: null,
          },
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
          "Чекбокс для поля 'наличие', список для 'категория'. Отображение настраивается в Taptop.",
        collectionId: "",
        fields: [
          {
            uniqueId: "psc1",
            fieldId: "наличие",
            label: "В наличии",
            uiType: UI_TYPES.CHECKBOX_SET,
            elementSelector: "stock-checkbox",
            instantFilter: true,
            clearButtonSelector: null,
          },
          {
            uniqueId: "psc_cat",
            fieldId: "категория",
            label: "Категория",
            uiType: UI_TYPES.SELECT,
            elementSelector: "stock-category-select",
            instantFilter: true,
            firstIsAll: true,
            clearButtonSelector: null,
          },
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
          "Фильтр: Поиск по 'title' + список для 'категория'. Отображение настраивается в Taptop.",
        collectionId: "",
        fields: [
          {
            uniqueId: "pcf1",
            fieldId: "title",
            label: "Поиск по названию",
            uiType: UI_TYPES.INPUT,
            elementSelector: "combined-search",
            instantFilter: false,
            clearButtonSelector: null,
          },
          {
            uniqueId: "pcf2",
            fieldId: "категория",
            label: "Категория",
            uiType: UI_TYPES.SELECT,
            elementSelector: "combined-category",
            instantFilter: false,
            firstIsAll: true,
            clearButtonSelector: null,
          },
        ],
        itemsPerPage: 9,
        ...defaultSelectors,
        applyButtonSelector: "filter-apply-button",
        preset: "combinedFilter",
        paginationType: "prev_next",
        showLoader: true,
        primaryColor: defaultColor,
        previewImages: {
          default: `${previewPath}Комбинация Поиск и Категория.png`,
        },
      },
    };
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
      collectionIdInput: document.getElementById("collection-id"),
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
      generateButton: document.getElementById("generate-code-button"),
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
      this.elements.collectionIdInput,
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

  _handlePaginationTypeChange(event) {
    this.config.paginationType = event.target.value;
    this._resetPresetSelection(); // Сбрасываем пресет при изменении
  }

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
      instantFilter: true, // По умолчанию true (будет изменено на false для input в _addSingleFieldCardDOM)
      elementSelector: null,
      clearButtonSelector: null,
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
      ),
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
    }

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
              condition = FILTER_TYPES.IS_ON;
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
    }

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
          fieldIdOrName: f.fieldId,
          label: f.label || f.fieldId,
          uiType: f.uiType,
          elementSelector: f.elementSelector || null,
          clearButtonSelector: f.clearButtonSelector || null,
          firstIsAll: f.firstIsAll !== false,
          instantFilter: f.instantFilter ?? f.uiType !== UI_TYPES.INPUT,
          condition: f.condition, // condition определяется в collectData на основе uiType
        })) || [],
      apiEndpoint: "/-/x-api/v1/public/", // Убрали метод из базового URL
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
        .cf-custom-pagination-container,
        .cf-loader-overlay {
          --cf-primary-color: ${runtimeConfig.primaryColor || "#4483f5"};
        }
        .cf-loader-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          opacity: 0;
          visibility: hidden;
        }
        .cf-loader-overlay.is-active {
          opacity: 1;
          visibility: visible;
        }
        .cf-loader {
          width: 38px;
          height: 38px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-bottom-color: var(--cf-primary-color);
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: cf-rotation 1s linear infinite;
        }
        @keyframes cf-rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .cf-custom-pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 15px 0;
          gap: 5px;
          flex-wrap: wrap;
        }
        .cf-pagination__button,
        .cf-pagination__number,
        .cf-pagination__ellipsis {
          min-width: 36px;
          height: 36px;
          padding: 0 10px;
          border: 1px solid #ddd;
          background-color: #fff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          line-height: 34px;
          text-align: center;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: #333;
        }
        .cf-pagination__button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
          background-color: #f5f5f5;
        }
        .cf-pagination__button:not(:disabled):hover,
        .cf-pagination__number:not(.is-active):not(.is-disabled):hover {
          border-color: var(--cf-primary-color);
          color: var(--cf-primary-color);
          background-color: rgba(68, 131, 245, 0.05);
        }
        .cf-pagination__number.is-active {
          background-color: var(--cf-primary-color);
          color: white;
          border-color: var(--cf-primary-color);
          cursor: default;
        }
        .cf-pagination__ellipsis {
          border: none;
          background: none;
          cursor: default;
          padding: 0 5px;
        }
        .${runtimeConfig.targetSelector} .collection__list {
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s ease, visibility 0s linear 0.3s;
        }
        .${runtimeConfig.targetSelector}.cf-initialized .collection__list {
          visibility: visible;
          opacity: 1;
          transition-delay: 0s;
        }
        .${runtimeConfig.targetSelector}.cf-loading .collection__list {
          opacity: 0.4 !important;
          transition: none !important;
          pointer-events: none;
        }
        .collection__pagination.is-removed {
          display: none !important;
        }
        .collection__pagination-pages,
        .collection__pagination-load,
        .collection__pagination-page-by-page {
          display: none !important;
        } /* Скрываем стандартные элементы пагинации Taptop */
        .cf-error-message {
          color: red;
          padding: 10px;
          border: 1px solid red;
          margin: 10px 0;
          border-radius: 4px;
          background: rgba(255, 0, 0, 0.05);
        }
      </style>
      <script>
        document.addEventListener("DOMContentLoaded", async () => {
          // Делаем обработчик async
          const FILTER_TYPES = ${JSON.stringify(FILTER_TYPES)};
          const UI_TYPES = ${JSON.stringify(UI_TYPES)};

          function debounce(func, wait) {
            let timeout;
            const d = function (...a) {
              const c = this;
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                timeout = null;
                func.apply(c, a);
              }, wait);
            };
            d.cancel = () => {
              clearTimeout(timeout);
              timeout = null;
            };
            return d;
          }

          class TaptopCollectionFilter {
            constructor(configObject) {
              this.config = configObject || {};
              this.widgetId = null;
              this.itemTemplateString = "";
              this.schema = null; // Для хранения схемы (c_schema, settings)
              this.currentPage = 1;
              this.totalPages = 1;
              this.currentFilters = [];
              this.elements = {
                filterControls: {},
                clearButtons: {},
                customPagination: {},
              };
              this.isLoading = false;
              this.fetchTimeout = null;
              this.fieldIdMap = new Map();
              this.initialDataLoadPromise = null;
              this.latestTotalItemsCount = 0; // Для хранения последнего общего числа элементов
              this.applyFiltersDebounced = debounce(
                () => this.applyFilters(true),
                this.config.debounceTimeout || 300
              );
              this._boundHandleCustomPaginationClick =
                this._handleCustomPaginationClick.bind(this);
              this.isInitialLoad = true;
            }

            async _init() {
              // Делаем _init асинхронным
              this.elements.widget = document.querySelector(
                "." + this.config.targetSelector
              );
              if (!this.elements.widget) {
                console.error(
                  "[CF] Виджет не найден:",
                  this.config.targetSelector
                );
                return;
              }

              // Ищем ID в самом виджете или в его дочерних элементах
              this.widgetId = this.elements.widget.dataset.widgetId || null;
              if (!this.widgetId) {
                const firstCollectionItem = this.elements.widget.querySelector(
                  ".collection__item[id]"
                );
                if (firstCollectionItem && firstCollectionItem.id) {
                  const idParts = firstCollectionItem.id.split("_");
                  this.widgetId = idParts[0];
                  if (!this.widgetId) {
                    console.error(
                      "[CF Init Error] Не удалось извлечь widget_id из ID элемента .collection__item:",
                      firstCollectionItem.id
                    );
                    this._showErrorMessage(
                      "Ошибка инициализации: Некорректный ID у элемента .collection__item."
                    );
                    return;
                  }
                  console.log(
                    "[CF Init] Автоматически определен widget_id из .collection__item:",
                    this.widgetId
                  );
                } else {
                  console.error(
                    "[CF Init Error] Не удалось найти data-widget-id у виджета или .collection__item[id] для определения widget_id."
                  );
                  this._showErrorMessage(
                    "Ошибка инициализации: Не удалось определить ID виджета."
                  );
                  return;
                }
              } else {
                console.log(
                  "[CF Init] widget_id найден в data-widget-id:",
                  this.widgetId
                );
              }

              if (
                window.getComputedStyle(this.elements.widget).position ===
                "static"
              ) {
                this.elements.widget.style.position = "relative";
              }
              this.elements.targetContainer =
                this.elements.widget.querySelector(".collection__list");
              if (!this.elements.targetContainer) {
                console.error("[CF] Контейнер .collection__list не найден.");
                return;
              }
              this.elements.taptopPaginationContainer =
                this.elements.widget.querySelector(".collection__pagination");
              if (this.elements.taptopPaginationContainer) {
                this.elements.taptopPaginationContainer.classList.add(
                  "cf-custom-pagination-container"
                );
                this.elements.taptopPaginationContainer.style.display = ""; // Убедимся, что контейнер видим
                this.elements.taptopPaginationContainer.addEventListener(
                  "click",
                  this._boundHandleCustomPaginationClick
                );
                console.log("[CF] Контейнер пагинации Taptop найден.");
              } else {
                console.warn(
                  "[CF] Контейнер пагинации Taptop (.collection__pagination) не найден."
                );
              }
              if (this.config.showLoader) {
                this.elements.loaderOverlay = document.createElement("div");
                this.elements.loaderOverlay.className = "cf-loader-overlay";
                this.elements.loaderOverlay.innerHTML =
                  '<span class="cf-loader"></span>';
                this.elements.widget.appendChild(this.elements.loaderOverlay);
              }

              // Загрузка шаблона и схемы
              this.initialDataLoadPromise = this._fetchTemplateAndSchema();

              this.elements.notFoundElement =
                this.elements.widget.querySelector(".collection__empty");
              this._findControlsAndButtons();

              // Удаляем вызов _cacheItemTemplate(), он больше не нужен
              // if (!this._cacheItemTemplate()) return;

              try {
                await this.initialDataLoadPromise; // Дожидаемся загрузки шаблона и схемы
                this._bindEvents(); // Привязываем события к фильтрам ПОСЛЕ загрузки схемы и построения fieldIdMap
                console.log(
                  "[CF Init] Шаблон и схема загружены. Фильтр инициализирован."
                );

                // Скрываем стандартную пагинацию Taptop
                const taptopNativePaginationParts =
                  this.elements.widget.querySelectorAll(
                    ".collection__pagination-pages, .collection__pagination-load, .collection__pagination-page-by-page"
                  );
                taptopNativePaginationParts.forEach((el) =>
                  el.classList.add("is-removed")
                );

                if (this.config.showLoader) this._setLoadingState(true);
                // Первая загрузка данных ВСЕГДА без фильтров из UI
                  await this.fetchAndRenderItems([], this.currentPage, false, true);
              } catch (error) {
                console.error(
                  "[CF Init Error] Критическая ошибка во время инициализации (шаблон/схема):",
                  error
                );
                this._showErrorMessage(
                  \`Критическая ошибка инициализации: \${error.message}.\`
                );
                if (this.config.showLoader) this._setLoadingState(false);
              } finally {
                if (this.elements.notFoundElement)
                  this.elements.notFoundElement.classList.add("is-removed"); // Скрываем стандартное "не найдено" в любом случае после инициализации
              }
            }

            async _fetchTemplateAndSchema() {
              if (!this.config.collectionId)
                throw new Error(
                  "ID Коллекции не определен для загрузки шаблона/схемы."
                );
              if (!this.widgetId)
                throw new Error(
                  "ID Виджета не определен для загрузки шаблона/схемы."
                );

              console.log(
                \`[CF FetchSchema] Запрос шаблона и схемы: collectionId=\${this.config.collectionId}, widgetId=\${this.widgetId}\`
              );

              const getItemsUrl = new URL(
                this.config.apiEndpoint,
                window.location.origin
              );
              getItemsUrl.searchParams.set(
                "method",
                "mosaic/collectionGetItems"
              );
              getItemsUrl.searchParams.set(
                "param[collection_id]",
                this.config.collectionId
              );
              getItemsUrl.searchParams.set("param[widget_id]", this.widgetId);
              getItemsUrl.searchParams.set("param[page]", "1");
              getItemsUrl.searchParams.set("param[per_page]", "1"); // Запрашиваем 1 элемент для получения шаблона и, возможно, схемы

              let templateResponseData;
              try {
                const response = await fetch(getItemsUrl.toString());
                if (!response.ok)
                  throw new Error(
                    \`API collectionGetItems (\${response.status}): \${
                      response.statusText
                    }. URL: \${getItemsUrl.toString()}\`
                  );
                templateResponseData = await response.json();
                console.log(
                  "[CF FetchSchema] Ответ от collectionGetItems:",
                  JSON.parse(JSON.stringify(templateResponseData))
                ); // Логируем ответ

                if (templateResponseData.error)
                  throw new Error(
                    \`API collectionGetItems error: \${templateResponseData.error.message}\`
                  );
                if (
                  !templateResponseData.result ||
                  !templateResponseData.result.item_template
                ) {
                  throw new Error(
                    "item_template не найден в ответе collectionGetItems."
                  );
                }
                this.itemTemplateString =
                  templateResponseData.result.item_template;
                console.log(
                  "[CF FetchSchema] item_template успешно загружен. Длина:",
                  this.itemTemplateString.length
                );
                console.log(
                  "templateResponseData.result",
                  templateResponseData.result
                );

                function getFirstSlugSegment(path) {
                  const segments = path.split("/").filter(Boolean);
                  return segments[0] || "";
                }

                if (templateResponseData.result) {
                  const slug = getFirstSlugSegment(
                    templateResponseData.result.items[0].slug
                  );
                  this.collectionSlug = slug;
                  console.log(
                    "[CF Init] Collection slug for dynamic pages:",
                    this.collectionSlug
                  );
                } else {
                  this.collectionSlug = null;
                  console.error(
                    "[CF Init Critical] Collection slug (indexed_url) not found in API response. Dynamic page links will be incorrect."
                  );
                }
              } catch (error) {
                console.error(
                  "[CF FetchSchema] Ошибка при загрузке item_template:",
                  error
                );
                throw error; // Перебрасываем ошибку
              }

              // Проверяем, пришла ли схема вместе с collectionGetItems
              if (
                templateResponseData.result &&
                (templateResponseData.result.c_schema ||
                  templateResponseData.result.settings) &&
                (Array.isArray(templateResponseData.result.c_schema) ||
                  Array.isArray(templateResponseData.result.settings))
              ) {
                this.schema = {
                  c_schema: templateResponseData.result.c_schema || [],
                  settings: templateResponseData.result.settings || [],
                };
                console.log(
                  "[CF FetchSchema] Схема полей получена из ответа collectionGetItems."
                );
              } else {
                // Если схема не пришла, делаем отдельный запрос к collectionSearch
                console.log(
                  "[CF FetchSchema] Схема полей не найдена в collectionGetItems, делаем отдельный запрос к collectionSearch..."
                );
                await this._fetchSchemaViaCollectionSearch(); // Выносим в отдельный метод для чистоты
              }
              this._buildFieldIdMap(); // Строим fieldIdMap на основе this.schema
            }

            async _fetchSchemaViaCollectionSearch() {
              if (!this.config.collectionId) {
                console.warn(
                  "[CF Schema] ID Коллекции не указан для collectionSearch."
                );
                return;
              }
              const schemaUrl = new URL(
                this.config.apiEndpoint,
                window.location.origin
              );
              schemaUrl.searchParams.set("method", "mosaic/collectionSearch"); // Указываем метод
              schemaUrl.searchParams.set(
                "param[collection_id]",
                this.config.collectionId
              );
              schemaUrl.searchParams.set("param[per_page]", "0"); // Запрашиваем 0 элементов, чтобы получить только схему

              try {
                const response = await fetch(schemaUrl);
                if (!response.ok)
                  throw new Error(
                    \`API collectionSearch (\${response.status}): \${
                      response.statusText
                    }. URL: \${schemaUrl.toString()}\`
                  );
                const data = await response.json();
                if (data.error)
                  throw new Error(
                    \`API collectionSearch error: \${data.error.message}\`
                  );
                if (
                  !data.result ||
                  (!data.result.c_schema && !data.result.settings) ||
                  (!Array.isArray(data.result.c_schema) &&
                    !Array.isArray(data.result.settings))
                ) {
                  console.error(
                    "[CF FetchSchema] Ответ collectionSearch (схема):",
                    data
                  );
                  throw new Error(
                    "Схема полей (c_schema/settings) не найдена или некорректна в ответе collectionSearch."
                  );
                }
                this.schema = {
                  c_schema: data.result.c_schema || [],
                  settings: data.result.settings || [],
                };
                console.log(
                  "[CF FetchSchema] Схема полей успешно загружена из collectionSearch."
                );
              } catch (error) {
                console.error(
                  "[CF FetchSchema] Ошибка при загрузке схемы полей из collectionSearch:",
                  error
                );
                throw error; // Перебрасываем, чтобы обработать в _init
              }
            }

            _buildFieldIdMap() {
              this.fieldIdMap.clear();
              if (!this.schema) {
                console.warn(
                  "[CF Map] Схема для построения fieldIdMap отсутствует."
                );
                return;
              }
              // --- Логика из старого _loadSchemaAndMapIds ---
              const schemaFields = [
                ...(this.schema.c_schema || []),
                ...(this.schema.settings || []),
              ];
              if (schemaFields.length === 0) {
                console.warn("[CF Map] Схема найдена, но пуста.");
                return;
              }

              const nameToIdMap = new Map();
              // Заполняем карту: имя_поля -> ID, id_поля -> ID
              schemaFields.forEach((field) => {
                const fId = String(field.id).trim();
                let fName = (field.field_name || "").trim().toLowerCase();
                if (!fName) {
                  // Добавляем стандартные имена для title/slug, если имя не задано
                  if (field.type === "title" || fId === "title")
                    fName = "title";
                  else if (field.type === "slug" || fId === "slug")
                    fName = "slug";
                }
                if (fId) {
                  nameToIdMap.set(fId.toLowerCase(), fId); // ID -> ID (для случаев, когда пользователь вводит ID)
                  if (fName) nameToIdMap.set(fName, fId); // Имя -> ID
                }
              });

              // Маппим fieldIdOrName из конфига на реальные ID
              if (Array.isArray(this.config.fields)) {
                this.config.fields.forEach((confField) => {
                  const fIdOrName = String(
                    confField.fieldIdOrName || ""
                  ).trim();
                  const fIdOrNameLower = fIdOrName.toLowerCase();
                  let foundId = nameToIdMap.get(fIdOrNameLower); // Прямое совпадение имени или ID

                  // Поиск по синонимам
                  if (!foundId) {
                    const synGroups = [
                      this.config.imageFieldSynonyms,
                      this.config.priceFieldSynonyms,
                      this.config.categoryFieldSynonyms,
                      this.config.tagFieldSynonyms,
                      this.config.stockFieldSynonyms,
                      this.config.descriptionFieldSynonyms,
                    ];
                    for (const group of synGroups) {
                      if (group && group.includes(fIdOrNameLower)) {
                        for (const syn of group) {
                          foundId = nameToIdMap.get(syn);
                          if (foundId) {
                            console.log(
                              \`[CF Map] Найден синоним для '\${fIdOrNameLower}': ID '\${foundId}'\`
                            );
                            break;
                          }
                        }
                      }
                      if (foundId) break;
                    }
                  }

                  // Поиск по частичному совпадению имени
                  if (!foundId && !/^[a-f0-9]{6,}$/i.test(fIdOrName)) {
                    // Ищем только если это не похоже на ID
                    let partialMatchId = null,
                      bestMatchName = "";
                    for (const [name, id] of nameToIdMap.entries()) {
                      if (
                        !/^[a-f0-9]{6,}$/i.test(name) &&
                        name !== "title" &&
                        name !== "slug" &&
                        name.includes(fIdOrNameLower)
                      ) {
                        partialMatchId = id;
                        bestMatchName = name;
                        break; // Берем первое частичное совпадение
                      }
                    }
                    if (partialMatchId) {
                      foundId = partialMatchId;
                      console.log(
                        \`[CF Map] Частичное совпадение для '\${fIdOrName}': найдено '\${bestMatchName}' (ID '\${foundId}').\`
                      );
                    }
                  }

                  // Сохраняем найденный ID или используем введенное значение, если оно похоже на ID
                  if (foundId) {
                    this.fieldIdMap.set(confField.fieldIdOrName, foundId);
                  } else {
                    if (
                      /^[a-f0-9]{6,}$/i.test(fIdOrName) ||
                      fIdOrName === "title" ||
                      fIdOrName === "slug"
                    ) {
                      this.fieldIdMap.set(confField.fieldIdOrName, fIdOrName); // Используем как есть
                      console.log(
                        \`[CF Map] Используется '\${fIdOrName}' как ID (не найдено в схеме).\`
                      );
                    } else {
                      console.warn(
                        \`[CF Map] Поле '\${confField.fieldIdOrName}' (Метка: '\${confField.label}') не найдено в схеме коллекции. Фильтрация по нему не будет работать.\`
                      );
                    }
                  }
                });
              }
              // --- Конец логики из старого _loadSchemaAndMapIds ---
              console.log(
                "[CF Map] fieldIdMap для фильтров построен:",
                Object.fromEntries(this.fieldIdMap)
              );
            }

            _getRealFieldId(fieldIdOrName) {
              return (
                this.fieldIdMap.get(String(fieldIdOrName)) ||
                String(fieldIdOrName)
              );
            }

            _findControlsAndButtons() {
              if (this.config.applyButtonSelector)
                this.elements.applyButton = document.querySelector(
                  "." + this.config.applyButtonSelector
                );
              if (this.config.resetButtonSelector)
                this.elements.resetButton = document.querySelector(
                  "." + this.config.resetButtonSelector
                );
              this.elements.filterControls = {};
              this.elements.clearButtons = {};
              if (!Array.isArray(this.config.fields)) return;
              this.config.fields.forEach((field) => {
                if (field.elementSelector && field.condition) {
                  // Ищем контролы только для полей с фильтрацией
                  const controls = document.querySelectorAll(
                    "." + field.elementSelector
                  );
                  if (controls.length > 0)
                    this.elements.filterControls[field.fieldIdOrName] =
                      controls;
                  else
                    console.warn(
                      "[CF] Элемент управления фильтром не найден:",
                      field.elementSelector,
                      "для поля",
                      field.fieldIdOrName
                    );
                }
                if (field.clearButtonSelector) {
                  const btn = document.querySelector(
                    "." + field.clearButtonSelector
                  );
                  if (btn)
                    this.elements.clearButtons[field.fieldIdOrName] = btn;
                  else
                    console.warn(
                      "[CF] Кнопка сброса поля не найдена:",
                      field.clearButtonSelector,
                      "для поля",
                      field.fieldIdOrName
                    );
                }
              });
              // Проверяем необходимость кнопки "Применить"
              const needsApply = this.config.fields.some(
                (f) => f.condition && f.instantFilter === false
              );
              if (needsApply && !this.elements.applyButton)
                console.error(
                  '[CF] Кнопка "Применить" (' +
                    this.config.applyButtonSelector +
                    ") не найдена, но требуется для некоторых фильтров."
                );
            }

            _bindEvents() {
              this.elements.applyButton?.addEventListener("click", () =>
                this.applyFilters(false)
              );
              this.elements.resetButton?.addEventListener("click", () =>
                this.resetFilters()
              );
              Object.entries(this.elements.clearButtons).forEach(([fId, btn]) =>
                btn.addEventListener("click", (e) =>
                  this._handleClearFieldClick(e, fId)
                )
              );

              if (!Array.isArray(this.config.fields)) return;
              this.config.fields.forEach((field) => {
                if (!field.elementSelector || !field.condition) return; // Привязываем только к фильтрам
                const controls =
                  this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;

                const isInstant = field.instantFilter;
                const handler = isInstant
                  ? this.applyFiltersDebounced
                  : () => {}; // Пустой обработчик для не-мгновенных

                switch (field.uiType) {
                  case UI_TYPES.INPUT:
                    const input = controls[0];
                    if (!input) break;
                    // Всегда добавляем listener для Enter keydown, чтобы предотвратить отправку формы
                    input.addEventListener("keydown", (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Предотвращаем стандартную отправку формы
                        // Если фильтр не мгновенный, то вызываем applyFilters
                        if (!isInstant) {
                          if (this.applyFiltersDebounced.cancel)
                            this.applyFiltersDebounced.cancel();
                          this.applyFilters(false);
                        }
                      }
                    });
                    // Listener на 'input' добавляем только если фильтр мгновенный
                    if (isInstant) {
                      input.addEventListener("input", handler);
                    }
                    break;
                  case UI_TYPES.SELECT:
                  case UI_TYPES.CHECKBOX_SET:
                    // Ищем input/select внутри контрола или сам контрол
                    controls.forEach((c) =>
                      (c.matches("input,select")
                        ? c
                        : c.querySelector("input,select")
                      )?.addEventListener("change", handler)
                    );
                    break;
                  case UI_TYPES.RADIO:
                    // Ищем все радио внутри контейнера(ов)
                    controls.forEach((c) => {
                      const radios = c.matches('input[type="radio"]')
                        ? [c]
                        : Array.from(c.querySelectorAll('input[type="radio"]'));
                      radios.forEach((r) =>
                        r.addEventListener("change", handler)
                      );
                    });
                    break;
                  case UI_TYPES.BUTTONS:
                    const isTaptopTabs =
                      controls[0].classList.contains("tabs__item");
                    controls.forEach((buttonOrTab) =>
                      buttonOrTab.addEventListener("click", (e) => {
                        if (this.isLoading) return;
                        if (!isTaptopTabs) {
                          // Управляем активным классом только для обычных кнопок
                          e.preventDefault();
                          controls.forEach((btn) =>
                            btn.classList.remove("tp-filter-button-active")
                          );
                          e.currentTarget.classList.add(
                            "tp-filter-button-active"
                          );
                        }
                        // Всегда вызываем обработчик (для табов Taptop он сработает после их собственного JS)
                        if (isInstant) handler();
                        else {
                          // Если не мгновенный, просто обновляем состояние (для кнопки Применить)
                          console.log(
                            "[CF Buttons] Non-instant button clicked. State updated."
                          );
                        }
                      })
                    );
                    break;
                }
              });
            }

            applyFilters(isDebounced = false) {
              if (this.isLoading && isDebounced) {
                console.warn(
                  "[CF Apply] Пропуск отложенного применения (уже идет загрузка)"
                );
                return;
              }
              if (this.isLoading && !isDebounced) {
                console.warn(
                  "[CF Apply] Пропуск прямого применения (уже идет загрузка)"
                );
                return;
              }
              console.log(
                \`[CF] Применение фильтров... (Отложено: \${isDebounced})\`
              );
              this.currentPage = 1; // Всегда сбрасываем на первую страницу при применении
              this.currentFilters = this._collectFilterValues();
              this.fetchAndRenderItems(this.currentFilters, this.currentPage);
            }

            resetFilters() {
              if (this.isLoading) return;
              console.log("[CF] Сброс фильтров...");
              if (!Array.isArray(this.config.fields)) return;
              this.config.fields.forEach((field) => {
                if (!field.elementSelector) return; // Сбрасываем только поля с контролами
                const controls =
                  this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;

                switch (field.uiType) {
                  case UI_TYPES.INPUT:
                    controls[0].value = "";
                    break;
                  case UI_TYPES.SELECT:
                    controls[0].selectedIndex = 0;
                    break;
                  case UI_TYPES.RADIO:
                    let firstRadio = true;
                    controls.forEach((c) => {
                      const radios = c.matches('input[type="radio"]')
                        ? [c]
                        : Array.from(c.querySelectorAll('input[type="radio"]'));
                      radios.forEach((r) => {
                        r.checked = firstRadio && field.firstIsAll;
                        firstRadio = false;
                      });
                    });
                    break;
                  case UI_TYPES.BUTTONS:
                    const isTaptopTabs =
                      controls[0].classList.contains("tabs__item");
                    if (isTaptopTabs) {
                      controls.forEach((tab, i) => {
                        const isActive = i === 0 && field.firstIsAll;
                        tab.classList.toggle("is-opened", isActive);
                        // tab.classList.toggle('tp-filter-button-active', isActive); // Taptop сам управляет is-opened
                      });
                      // Визуальный сброс табов может потребовать клика на первый таб
                      if (
                        field.firstIsAll &&
                        controls[0] &&
                        typeof controls[0].click === "function"
                      ) {
                        // controls[0].click(); // Раскомментировать, если нужно имитировать клик (Taptop должен сделать это сам)
                        console.log(
                          "[CF Reset] Taptop tab reset triggered (visual only, click might be needed)."
                        );
                      }
                    } else {
                      controls.forEach((btn, i) =>
                        btn.classList.toggle(
                          "tp-filter-button-active",
                          i === 0 && field.firstIsAll
                        )
                      );
                    }
                    break;
                  case UI_TYPES.CHECKBOX_SET:
                    const cb =
                      controls[0]?.querySelector('input[type="checkbox"]') ||
                      (controls[0]?.matches('input[type="checkbox"]')
                        ? controls[0]
                        : null);
                    if (cb) cb.checked = false;
                    break;
                  default:
                    if ("value" in controls[0]) controls[0].value = "";
                    break;
                }
              });
              this.currentPage = 1;
              this.currentFilters = [];
              this.fetchAndRenderItems([], this.currentPage, false, true); // Загружаем данные после сброса
            }

            _handleClearFieldClick(event, fieldIdOrNameToClear) {
              event.preventDefault();
              if (this.isLoading || !fieldIdOrNameToClear) return;
              console.log(\`[CF] Сброс поля: \${fieldIdOrNameToClear}\`);
              const fieldConfig = this.config.fields.find(
                (f) => f.fieldIdOrName === fieldIdOrNameToClear
              );
              if (!fieldConfig || !fieldConfig.elementSelector) return;
              const controls =
                this.elements.filterControls[fieldIdOrNameToClear];
              if (!controls || controls.length === 0) return;

              // Логика сброса значения контрола (аналогично resetFilters)
              switch (fieldConfig.uiType) {
                case UI_TYPES.INPUT:
                  controls[0].value = "";
                  break;
                case UI_TYPES.SELECT:
                  controls[0].selectedIndex = 0;
                  break;
                case UI_TYPES.RADIO:
                  const firstRadio =
                    controls[0]?.querySelector('input[type="radio"]') ||
                    (controls[0]?.matches('input[type="radio"]')
                      ? controls[0]
                      : null);
                  if (firstRadio && fieldConfig.firstIsAll)
                    firstRadio.checked = true;
                  else
                    controls.forEach(
                      (c) =>
                        ((
                          c.querySelector('input[type="radio"]') || c
                        ).checked = false)
                    );
                  break;
                case UI_TYPES.BUTTONS:
                  const isTaptopTabs =
                    controls[0].classList.contains("tabs__item");
                  if (isTaptopTabs) {
                    controls.forEach((tab, i) => {
                      const shouldBeActive = i === 0 && fieldConfig.firstIsAll;
                      tab.classList.toggle("is-opened", shouldBeActive);
                      // tab.classList.toggle('tp-filter-button-active', shouldBeActive);
                    });
                    if (fieldConfig.firstIsAll && controls[0]) {
                      // controls[0].click(); // Клик для табов может вызвать applyFilters, если он instant
                      console.log(
                        "[CF Clear] Taptop tab reset triggered (visual only, click might be needed)."
                      );
                    }
                  } else {
                    controls.forEach((btn, i) =>
                      btn.classList.toggle(
                        "tp-filter-button-active",
                        i === 0 && fieldConfig.firstIsAll
                      )
                    );
                  }
                  break;
                case UI_TYPES.CHECKBOX_SET:
                  const checkbox =
                    controls[0]?.querySelector('input[type="checkbox"]') ||
                    (controls[0]?.matches('input[type="checkbox"]')
                      ? controls[0]
                      : null);
                  if (checkbox) checkbox.checked = false;
                  break;
                default:
                  if ("value" in controls[0]) controls[0].value = "";
                  break;
              }
              // Применяем фильтры после сброса поля
              if (fieldConfig?.instantFilter) this.applyFiltersDebounced();
              else if (this.elements.applyButton)
                console.log('[CF Clear] Требуется нажатие "Применить".');
              else this.applyFiltersDebounced(); // Применяем, если кнопки "Применить" нет
            }

            _collectFilterValues() {
              const apiFilters = [];
              if (!Array.isArray(this.config.fields)) return apiFilters;
              this.config.fields.forEach((field) => {
                if (!field.elementSelector || !field.condition) return;
                const realFieldId = this._getRealFieldId(field.fieldIdOrName);
                if (!realFieldId) {
                  // console.warn(\`[CF Collect] Пропуск поля '\${field.fieldIdOrName}', так как реальный ID не найден.\`);
                  return; // Не добавляем фильтр, если ID не найден
                }
                const controls =
                  this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;

                let value = null,
                  skipFilter = false;
                switch (field.uiType) {
                  case UI_TYPES.INPUT:
                    value = controls[0].value?.trim();
                    break;
                  case UI_TYPES.SELECT:
                    value = controls[0].value?.trim();
                    skipFilter =
                      controls[0].selectedIndex === 0 && field.firstIsAll;
                    break;
                  case UI_TYPES.RADIO:
                    let firstRadio = null,
                      checkedRadio = null;
                    for (const c of controls) {
                      const radios = c.matches('input[type="radio"]')
                        ? [c]
                        : Array.from(c.querySelectorAll('input[type="radio"]'));
                      if (!firstRadio && radios.length > 0)
                        firstRadio = radios[0];
                      const checked = radios.find((i) => i.checked);
                      if (checked) {
                        checkedRadio = checked;
                        break;
                      }
                    }
                    value = checkedRadio ? checkedRadio.value?.trim() : null;
                    skipFilter =
                      checkedRadio === firstRadio && field.firstIsAll;
                    break;
                  case UI_TYPES.BUTTONS:
                    const isTaptopTabs =
                      controls[0].classList.contains("tabs__item");
                    let firstBtnOrTab = controls[0],
                      activeBtnOrTab = null;
                    if (isTaptopTabs) {
                      activeBtnOrTab = Array.from(controls).find((el) =>
                        el.classList.contains("is-opened")
                      );
                      if (activeBtnOrTab) {
                        const titleEl =
                          activeBtnOrTab.querySelector(".tabs__item-title");
                        value = titleEl
                          ? titleEl.textContent?.trim()
                          : activeBtnOrTab.textContent?.trim();
                      } else value = null;
                    } else {
                      activeBtnOrTab = Array.from(controls).find((el) =>
                        el.classList.contains("tp-filter-button-active")
                      );
                      if (activeBtnOrTab) {
                        value =
                          activeBtnOrTab.dataset.value?.trim() ||
                          activeBtnOrTab.textContent?.trim();
                      } else value = null;
                    }
                    skipFilter =
                      activeBtnOrTab === firstBtnOrTab && field.firstIsAll;
                    break;
                  case UI_TYPES.CHECKBOX_SET:
                    let checkbox = null;
                    if (controls[0]?.matches('input[type="checkbox"]'))
                      checkbox = controls[0];
                    else if (controls[0])
                      checkbox = controls[0].querySelector(
                        'input[type="checkbox"]'
                      );
                    value = checkbox ? checkbox.checked : null;
                    break;
                  default:
                    if ("value" in controls[0])
                      value = controls[0].value?.trim();
                    else if ("checked" in controls[0])
                      value = controls[0].checked;
                }

                if (!skipFilter) {
                  if (field.uiType === UI_TYPES.CHECKBOX_SET) {
                    if (value === true) { // Если чекбокс отмечен, фильтруем по true
                      apiFilters.push({
                        field_id: realFieldId,
                        type: FILTER_TYPES.IS_ON, 
                      });
                    } 
                  } else {
                    const hasVal =
                      value !== null && value !== "" && value !== false;
                    if (hasVal) {
                      apiFilters.push({
                        field_id: realFieldId,
                        type: field.condition,
                        value: String(value),
                      });
                    }
                  }
                }
              });
              return apiFilters;
            }

            async fetchAndRenderItems(filters = [], page = 1, append = false, usePassedFiltersDirectly = false) {
              // Убираем ожидание schemaLoadPromise, так как оно заменено на initialDataLoadPromise в _init
              // if (this.schemaLoadPromise) { await this.schemaLoadPromise; this.schemaLoadPromise = null; }

              // Проверяем, завершилась ли начальная загрузка (шаблона и схемы)
              if (this.initialDataLoadPromise) {
                console.log(
                  "[CF Fetch] Ожидание завершения initialDataLoadPromise..."
                );
                try {
                  await this.initialDataLoadPromise;
                  this.initialDataLoadPromise = null; // Сбрасываем после успешного завершения
                  console.log("[CF Fetch] initialDataLoadPromise завершен.");
                } catch (error) {
                  console.error(
                    "[CF Fetch] Ошибка при ожидании initialDataLoadPromise:",
                    error
                  );
                  this._showErrorMessage(
                    \`Ошибка инициализации перед загрузкой данных: \${error.message}\`
                  );
                  this.isLoading = false;
                  this._setLoadingState(false);
                  return; // Прерываем выполнение, если инициализация не удалась
                }
              }

              if (!append && this.isLoading) {
                if (this.applyFiltersDebounced.cancel)
                  this.applyFiltersDebounced.cancel();
                if (this.fetchTimeout) clearTimeout(this.fetchTimeout);
                console.warn("[CF Fetch] Запрос пропущен (идет загрузка).");
                return;
              }
              if (append && this.isLoading) {
                console.warn(
                  '[CF Fetch] Запрос "Загрузить еще" пропущен (идет загрузка).'
                );
                return;
              }

              this.isLoading = true;
              this._setLoadingState(true);
              if (!append) this.currentPage = page;
              // this.currentFilters = filters; // currentFilters обновляется в applyFilters или resetFilters, здесь используем актуальные
              if (this.fetchTimeout) clearTimeout(this.fetchTimeout);

              const apiUrl = new URL(
                this.config.apiEndpoint,
                window.location.origin
              );
              apiUrl.searchParams.set("method", "mosaic/collectionSearch"); // Используем collectionSearch для получения данных
              apiUrl.searchParams.set(
                "param[collection_id]",
                this.config.collectionId
              );
          // Если usePassedFiltersDirectly === true, используем переданные фильтры,
          // иначе собираем актуальные из UI.
          const actualFilters = usePassedFiltersDirectly ? filters : this._collectFilterValues();
              if (actualFilters.length > 0)
                apiUrl.searchParams.set(
                  "param[filters]",
                  JSON.stringify(actualFilters)
                );
              apiUrl.searchParams.set("param[page]", this.currentPage);
              apiUrl.searchParams.set(
                "param[per_page]",
                this.config.itemsPerPage
              );

              console.log("[CF Fetch] Запрос данных:", apiUrl.toString());

              const controller = new AbortController();
              this.fetchTimeout = setTimeout(() => {
                controller.abort();
                console.warn("[CF Fetch] Таймаут запроса.");
              }, 15000);

              // Сохранение текущего HTML больше не нужно, так как Taptop сам обновит контент
              // let currentHtml = (!append && this.elements.targetContainer && !this.isInitialLoad) ? this.elements.targetContainer.innerHTML : undefined;

              try {
                const response = await fetch(apiUrl, {
                  signal: controller.signal,
                });
                clearTimeout(this.fetchTimeout);
                this.fetchTimeout = null;
                if (!response.ok)
                  throw new Error(
                    \`Ошибка API collectionSearch: \${response.status}\`
                  );
                const data = await response.json();
                console.log(
                  "[CF Fetch] Ответ от collectionSearch:",
                  JSON.parse(JSON.stringify(data))
                ); // Лог ответа
                if (data.error)
                  throw new Error(
                    \`Ошибка API collectionSearch: \${data.error.message}\`
                  );

                const totalItems = data.result?.page?.all_items_count ?? 0;
                const itemsReceived = data.result?.page?.items || []; // Получаем данные

                this.latestTotalItemsCount = totalItems; // Сохраняем общее количество

                this._renderResults(itemsReceived, append); // Рендерим элементы сами
                this._renderPaginationControls(this.latestTotalItemsCount); // Обновляем пагинацию
              } catch (error) {
                clearTimeout(this.fetchTimeout);
                this.fetchTimeout = null;
                console.error("[CF] Ошибка при загрузке данных:", error);
                if (error.name !== "AbortError") {
                  this._showErrorMessage(
                    \`Ошибка загрузки данных: \${error.message}\`
                  );
                } else {
                  this._showErrorMessage(
                    "Превышено время ожидания ответа от сервера."
                  );
                }
                if (!append) this._renderPaginationControls(0); // Сбрасываем пагинацию при ошибке (если не дозагрузка)
              } finally {
                this.isLoading = false;
                this._setLoadingState(false);
                if (this.isInitialLoad) {
                  if (this.elements.widget)
                    this.elements.widget.classList.add("cf-initialized");
                  this.isInitialLoad = false;
                }
              }
            }

            _setLoadingState(isLoading) {
              this.elements.widget?.classList.toggle("cf-loading", isLoading);
              Object.values(this.elements.filterControls).forEach((controls) =>
                controls?.forEach((c) => {
                  const i = c.matches("input,select,button")
                    ? c
                    : c.querySelector("input,select,button");
                  if (i) i.disabled = isLoading;
                })
              );
              Object.values(this.elements.clearButtons).forEach(
                (btn) => (btn.disabled = isLoading)
              );
              if (this.elements.applyButton)
                this.elements.applyButton.disabled = isLoading;
              if (this.elements.resetButton)
                this.elements.resetButton.disabled = isLoading;
              if (this.elements.customPagination.prevButton)
                this.elements.customPagination.prevButton.disabled =
                  isLoading || this.currentPage <= 1;
              if (this.elements.customPagination.nextButton)
                this.elements.customPagination.nextButton.disabled =
                  isLoading || this.currentPage >= this.totalPages;
              if (this.elements.customPagination.loadMoreButton)
                this.elements.customPagination.loadMoreButton.disabled =
                  isLoading || this.currentPage >= this.totalPages;
              // Блокируем/разблокируем числовые кнопки пагинации
              this.elements.taptopPaginationContainer
                ?.querySelectorAll(".cf-pagination__number[data-page]")
                .forEach(
                  (el) => (el.style.pointerEvents = isLoading ? "none" : "")
                );

              if (this.config.showLoader && this.elements.loaderOverlay) {
                this.elements.loaderOverlay.classList.toggle(
                  "is-active",
                  isLoading
                );
              }
              if (isLoading)
                this.elements.widget
                  ?.querySelector(".cf-error-message")
                  ?.remove();
            }

            _formatDate(dateValue) {
              if (
                !dateValue ||
                (typeof dateValue !== "string" && typeof dateValue !== "number")
              )
                return "";
              try {
                let date;
                // Проверяем, является ли значение timestamp (секунды или миллисекунды)
                if (
                  typeof dateValue === "number" ||
                  /^d{10,}$/.test(String(dateValue))
                ) {
                  const numValue = Number(dateValue);
                  // Если число похоже на секунды (10 цифр), умножаем на 1000
                  date = new Date(
                    numValue < 10000000000 ? numValue * 1000 : numValue
                  );
                } else if (typeof dateValue === "string") {
                  // Пытаемся распознать форматы ДД.ММ.ГГГГ, ГГГГ-ММ-ДД, или стандартный ISO
                  const partsDMY = dateValue.match(
                    /^(d{1,2})[./-](d{1,2})[./-](d{4})$/
                  );
                  const partsYMD = dateValue.match(
                    /^(d{4})[./-](d{1,2})[./-](d{1,2})$/
                  );
                  if (partsDMY) {
                    // Внимание: new Date(year, monthIndex, day) использует локальное время.
                    // Для консистентности лучше использовать UTC или парсить как строку ISO
                    const day = parseInt(partsDMY[1], 10);
                    const month = parseInt(partsDMY[2], 10) - 1; // Месяцы в JS 0-11
                    const year = parseInt(partsDMY[3], 10);
                    date = new Date(Date.UTC(year, month, day));
                    // Проверка на валидность даты после парсинга
                    if (
                      isNaN(date.getTime()) ||
                      date.getUTCFullYear() !== year ||
                      date.getUTCMonth() !== month ||
                      date.getUTCDate() !== day
                    ) {
                      date = new Date(NaN); // Невалидная дата
                    }
                  } else if (partsYMD) {
                    const year = parseInt(partsYMD[1], 10);
                    const month = parseInt(partsYMD[2], 10) - 1;
                    const day = parseInt(partsYMD[3], 10);
                    date = new Date(Date.UTC(year, month, day));
                    if (
                      isNaN(date.getTime()) ||
                      date.getUTCFullYear() !== year ||
                      date.getUTCMonth() !== month ||
                      date.getUTCDate() !== day
                    ) {
                      date = new Date(NaN);
                    }
                  } else {
                    // Пробуем стандартный парсер JS (может быть неконсистентным)
                    date = new Date(dateValue);
                  }
                } else {
                  date = new Date(NaN); // Не строка и не число
                }

                if (isNaN(date.getTime())) {
                  // Проверка на Invalid Date
                  console.warn(
                    "[CF FormatDate] Неверный формат даты:",
                    dateValue
                  );
                  return String(dateValue); // Возвращаем исходное значение
                }

                // Форматируем в ДД.ММ.ГГГГ
                const dayF = String(date.getUTCDate()).padStart(2, "0");
                const monthF = String(date.getUTCMonth() + 1).padStart(2, "0"); // +1 для месяца
                const yearF = date.getUTCFullYear();
                return \`\${dayF}.\${monthF}.\${yearF}\`;
              } catch (e) {
                console.error(
                  "[CF FormatDate] Ошибка форматирования даты:",
                  dateValue,
                  e
                );
                return String(dateValue); // Возвращаем исходное значение при ошибке
              }
            }

            _renderResults(items = [], append = false) {
              if (!this.elements.targetContainer) {
                console.error("[CF RenderResults] targetContainer не найден!");
                this._showErrorMessage(
                  "Ошибка отображения: не найден контейнер для элементов."
                );
                return;
              }
              console.log(
                "[CF RenderResults] Вызов _renderResults. items.length:",
                items.length,
                "append:",
                append
              ); // Лог вызова
              this.elements.widget
                ?.querySelector(".cf-error-message")
                ?.remove();

              if (!append) {
                this.elements.targetContainer.innerHTML = ""; // Очищаем только если не дозагрузка
                console.log(
                  "[CF RenderResults] Контейнер очищен (append=false)."
                );
              }

              if (items.length === 0 && !append) {
                if (this.elements.notFoundElement) {
                  this.elements.notFoundElement.classList.remove("is-removed");
                  console.log(
                    '[CF RenderResults] Показан блок "Ничего не найдено" (Taptop).'
                  );
                } else {
                  this.elements.targetContainer.innerHTML =
                    '<p style="text-align:center;padding:20px;color:#555;">Ничего не найдено.</p>';
                  console.log(
                    '[CF RenderResults] Выведено сообщение "Ничего не найдено" (стандартное).'
                  );
                }
                // Пагинация обновляется в fetchAndRenderItems
                return;
              } else if (items.length > 0) {
                if (this.elements.notFoundElement)
                  this.elements.notFoundElement.classList.add("is-removed");
                console.log(
                  '[CF RenderResults] Блок "Ничего не найдено" скрыт (items.length > 0).'
                );
              }

              if (!this.itemTemplateString) {
                console.error(
                  "[CF RenderResults] ОШИБКА: Шаблон элемента (itemTemplateString) пуст или не загружен."
                );
                this._showErrorMessage(
                  "Ошибка отображения: отсутствует шаблон элемента."
                );
                return;
              }

              const fragment = document.createDocumentFragment();
              let renderedCount = 0; // Счетчик успешно отрендеренных элементов
              items.forEach((item) => {
                const el = this._renderSingleItem(item);
                if (el) {
                  console.log("элемент:" + el);
                  fragment.appendChild(el);
                  renderedCount++;
                } else {
                  console.warn(
                    "[CF RenderResults] _renderSingleItem вернул null для элемента:",
                    JSON.stringify(item).substring(0, 200) + "..."
                  );
                }
              });

              if (renderedCount > 0) {
                this.elements.targetContainer.appendChild(fragment);
                console.log(
                  \`[CF RenderResults] Добавлено \${renderedCount} элементов в DOM.\`
                );
              } else if (items.length > 0) {
                // Этот блок выполнится, если API вернуло элементы, но ни один из них не смог быть отрендерен
                console.warn(
                  "[CF RenderResults] Были получены элементы от API, но ни один не был отрендерен. Проверьте _renderSingleItem и itemTemplateString, а также структуру данных элемента."
                );
                this._showErrorMessage(
                  "Проблема с отображением элементов. Возможно, шаблон или данные несовместимы."
                );
                if (this.elements.notFoundElement && !append) {
                  // Показываем "не найдено" только если это не дозагрузка
                  this.elements.notFoundElement.classList.remove("is-removed");
                }
              }
              // Пагинация обновляется в fetchAndRenderItems после вызова _renderResults
            }

            // --- Обновлённый рендеринг одного элемента ---
            _renderSingleItem(apiItemData) {
              if (!this.itemTemplateString) {
                // console.warn('[CF Render] Шаблон элемента (itemTemplateString) отсутствует.'); // Уже логируется в _renderResults
                return null;
              }

              // Проверяем наличие данных (включая системные поля title/slug)
              if (
                !apiItemData ||
                typeof apiItemData !== "object" ||
                (!apiItemData.fields &&
                  apiItemData.title === undefined &&
                  apiItemData.slug === undefined)
              ) {
                console.warn(
                  "[CF Render] Отсутствуют или некорректные данные для элемента (apiItemData).",
                  apiItemData
                );
                return null;
              }

              let itemHtml = this.itemTemplateString
                .replace(/&amp;#123;|&#123;|&lbrace;/g, "{")
                .replace(/&amp;#125;|&#125;|&rbrace;/g, "}");

              /* ------------------------------------------------------------------
       1. Строим карту itemValues:  field_id → объект поля
          Для системных title/slug кладём объект вида
          { value: '...', _isSystem: true }
    ------------------------------------------------------------------ */
              const itemValues = {};

              // Пользовательские поля
              if (Array.isArray(apiItemData.fields)) {
                apiItemData.fields.forEach((field) => {
                  if (field && field.field_id) {
                    itemValues[field.field_id] = field;
                  } else {
                    console.warn(
                      "[CF Render] Пропущено поле без field_id в элементе:",
                      field,
                      apiItemData
                    );
                  }
                });
              }

              // Системные поля
              if (apiItemData.hasOwnProperty("title")) {
                itemValues.title = {
                  value: apiItemData.title,
                  _isSystem: true,
                };
              }
              if (apiItemData.hasOwnProperty("slug")) {
                itemValues.slug = { field_id: "slug", url: apiItemData.slug };
              }

              const phs = itemHtml.match(/\\{\\$item\\.([\\w.]+)\\}/g);

              /* ------------------------------------------------------------------
       2. Логирование данных перед шаблонизацией
    ------------------------------------------------------------------ */
              console.log(
                "[CF RenderItem] itemValues:",
                JSON.parse(JSON.stringify(itemValues))
              );
              console.log(
                "[CF RenderItem] this.schema:",
                JSON.parse(JSON.stringify(this.schema))
              );
              try {
                itemHtml = itemHtml.replace(
                  /\\{\\$item\\.([\\w.]+)\\}/g,
                  (match, fullPath) => {
                    const pathParts = fullPath.split(".");
                    const fieldKey = pathParts[0]; // Например, "title", "f32946", "slug"
                    const dataNode = itemValues[fieldKey]; // Объект поля

                    console.log("Data NODE: ", dataNode);

                    let valueForFormatting = undefined; // Используем undefined, чтобы отличить от пустой строки или null

                    if (dataNode !== undefined) {
                      if (pathParts.length === 1) {
                        // Простой путь, например {$item.title} или {$item.customTextField}
                        if (
                          fieldKey === "title" &&
                          dataNode.hasOwnProperty("title") &&
                          typeof dataNode.title === "string"
                        ) {
                          valueForFormatting = dataNode.title; // Для системного поля title
                        } else if (
                          fieldKey === "slug" &&
                          dataNode.hasOwnProperty("url") &&
                          typeof dataNode.url === "string"
                        ) {
                          valueForFormatting = dataNode.url; // Для системного поля slug - здесь будет 'nike-airmax'
                        } else if (dataNode.hasOwnProperty("text")) {
                          valueForFormatting = dataNode.text;
                        } else if (dataNode.hasOwnProperty("number")) {
                          valueForFormatting = dataNode.number;
                        } else if (dataNode.hasOwnProperty("value")) {
                          // Для switcher, boolean и т.д.
                          valueForFormatting = dataNode.value;
                        } else if (dataNode.hasOwnProperty("date_time")) {
                          valueForFormatting = dataNode.date_time; // Будет отформатировано позже
                        } else if (dataNode.hasOwnProperty("rich_text")) {
                          valueForFormatting = dataNode.rich_text;
                        } else if (dataNode.hasOwnProperty("link")) {
                          // Если это объект ссылки, обычно значением является URL
                          valueForFormatting = dataNode.link;
                        } else if (
                          dataNode.image &&
                          dataNode.image.hasOwnProperty("src")
                        ) {
                          // Значение по умолчанию для {$item.imageFieldId} - это его src
                          valueForFormatting = dataNode.image.src;
                        }
                      } else {
                        let currentContext = dataNode;
                        for (let i = 1; i < pathParts.length; i++) {
                          const subKey = pathParts[i];
                          if (
                            i === 1 &&
                            currentContext.hasOwnProperty("image") &&
                            typeof currentContext.image === "object" &&
                            currentContext.image !== null &&
                            currentContext.image.hasOwnProperty(subKey)
                          ) {
                            currentContext = currentContext.image[subKey];
                          } else if (
                            currentContext &&
                            typeof currentContext === "object" &&
                            currentContext.hasOwnProperty(subKey)
                          ) {
                            currentContext = currentContext[subKey];
                          } else {
                            currentContext = undefined; // Путь нарушен
                            break;
                          }
                        }
                        valueForFormatting = currentContext;
                      }
                    }

                    let replacementValue = "";
                    if (
                      valueForFormatting !== undefined &&
                      valueForFormatting !== null
                    ) {
                      const fieldSchemaInfo = this.schema
                        ? [
                            ...(this.schema.c_schema || []),
                            ...(this.schema.settings || []),
                          ].find((f) => f.id === fieldKey)
                        : null;

                      // Специальная обработка для плейсхолдера slug, если он используется в href атрибуте
                      // и this.collectionSlug (слаг коллекции) доступен.
                      const isSystemSlugPlaceholder =
                        fieldKey === "slug" && match === "{$item.slug}"; // Убедимся, что это именно плейсхолдер {$item.slug}

                      if (
                        isSystemSlugPlaceholder &&
                        this.collectionSlug &&
                        typeof valueForFormatting === "string"
                      ) {
                        const elementSlugClean = valueForFormatting.replace(
                          /^\\/+|\\/+$/g,
                          ""
                        ); // Очищаем слаг элемента от лишних слешей

                        console.log(this.collectionSlug);
                        if (elementSlugClean) {
                          // Только если слаг элемента не пустой
                          replacementValue = \`/\${this.collectionSlug}/\${elementSlugClean}\`;
                        } else {
                          replacementValue = ""; // Если слаг элемента пуст, ссылка будет невалидной, оставляем пустой
                          console.warn(
                            \`[CF Render] Пустой slug элемента для fieldKey 'slug', коллекция: \${this.collectionSlug}. Ссылка не будет сформирована.\`
                          );
                        }
                      }
                      // Стандартное форматирование для остальных случаев
                      else if (
                        fieldSchemaInfo &&
                        fieldSchemaInfo.type === "date" &&
                        (typeof valueForFormatting === "number" ||
                          typeof valueForFormatting === "string")
                      ) {
                        replacementValue = this._formatDate(valueForFormatting);
                      } else if (
                        fieldSchemaInfo &&
                        fieldSchemaInfo.type === "switcher"
                      ) {
                        replacementValue = String(
                          valueForFormatting === true ||
                            String(valueForFormatting).toLowerCase() ===
                              "true" ||
                            String(valueForFormatting) === "1"
                        );
                      } else if (
                        typeof valueForFormatting === "object" &&
                        !(
                          fieldSchemaInfo &&
                          fieldSchemaInfo.type === "rich_text"
                        )
                      ) {
                        replacementValue = ""; // Не выводим объекты напрямую, кроме rich_text
                      } else {
                        replacementValue = String(valueForFormatting);
                      }
                    }
                    // Отладочный лог, можно закомментировать после проверки
                    // console.log(\`[CF RenderItem Replace Debug] Match: "\${match}", Path: "\${fullPath}", fieldKey: "\${fieldKey}", Value: \${JSON.stringify(valueForFormatting)}, Replaced: '\${replacementValue}'\`);
                    return replacementValue;
                  }
                );
              } catch (e) {
                console.error(
                  "[CF Render] Ошибка во время замены плейсхолдеров:",
                  e,
                  "HTML:",
                  itemHtml,
                  "Data:",
                  apiItemData
                );
                return null;
              }

              /* ------------------------------------------------------------------
       4. Преобразуем итоговый HTML в DOM-узел
    ------------------------------------------------------------------ */
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = itemHtml.trim();

              if (
                tempDiv.firstChild &&
                tempDiv.firstChild.nodeType === Node.ELEMENT_NODE
              ) {
                return tempDiv.firstChild; // один корневой элемент
              }

              if (tempDiv.childNodes.length > 0) {
                console.warn(
                  "[CF Render] Шаблон элемента не имеет одного корневого DOM-узла. Оборачиваем содержимое в <div>.",
                  itemHtml,
                  tempDiv.childNodes
                );
                const wrapperDiv = document.createElement("div");
                while (tempDiv.firstChild)
                  wrapperDiv.appendChild(tempDiv.firstChild);
                return wrapperDiv;
              }

              console.warn(
                "[CF Render] Рендеринг элемента не дал результата (пустой шаблон или плейсхолдеры не заменились?).",
                itemHtml
              );
              return null;
            }

            _renderPaginationControls(totalItems) {
              const container = this.elements.taptopPaginationContainer;
              if (!container) return;
              // Очищаем только наши кастомные элементы пагинации
              container
                .querySelectorAll(
                  ".cf-pagination__button, .cf-pagination__info, .cf-pagination__numbers, .cf-pagination__number, .cf-pagination__ellipsis"
                )
                .forEach((el) => el.remove());
              this.elements.customPagination = {}; // Сбрасываем ссылки на кнопки

              this.totalPages = Math.ceil(
                totalItems / this.config.itemsPerPage
              );
              const showPagination =
                this.totalPages > 1 && this.config.paginationType !== "none";

              container.classList.toggle("is-removed", !showPagination); // Скрываем/показываем весь контейнер
              console.log(
                \`[CF Paging] totalItems: \${totalItems}, totalPages: \${this.totalPages}, currentPage: \${this.currentPage}, type: \${this.config.paginationType}, show: \${showPagination}\`
              );

              if (!showPagination) return;

              const isFirst = this.currentPage <= 1;
              const isLast = this.currentPage >= this.totalPages;
              const createButton = (text, direction, disabled, cssClass) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = \`cf-pagination__button \${cssClass}\`;
                btn.textContent = text;
                btn.disabled = disabled || this.isLoading;
                btn.dataset.direction = direction;
                return btn;
              };
              const createPageNumber = (page) => {
                const el = document.createElement(
                  page === this.currentPage ? "span" : "a"
                );
                el.className = "cf-pagination__number";
                el.textContent = page;
                if (page === this.currentPage) el.classList.add("is-active");
                else {
                  el.href = "#";
                  el.dataset.page = page;
                }
                el.setAttribute("aria-label", \`Страница \${page}\`);
                if (page === this.currentPage)
                  el.setAttribute("aria-current", "page");
                return el;
              };
              const createEllipsis = () => {
                const el = document.createElement("span");
                el.className = "cf-pagination__ellipsis";
                el.textContent = "...";
                return el;
              };

              if (this.config.paginationType === "prev_next") {
                const prev = createButton(
                  "Назад",
                  "-1",
                  isFirst,
                  "cf-pagination__prev"
                );
                const next = createButton(
                  "Вперед",
                  "1",
                  isLast,
                  "cf-pagination__next"
                );
                const info = document.createElement("span");
                info.className = "cf-pagination__info";
                info.textContent = \`\${this.currentPage} / \${this.totalPages}\`;
                container.appendChild(prev);
                container.appendChild(info);
                container.appendChild(next);
                this.elements.customPagination = {
                  prevButton: prev,
                  nextButton: next,
                };
              } else if (this.config.paginationType === "load_more") {
                if (!isLast) {
                  const loadMore = createButton(
                    "Загрузить еще",
                    "+1",
                    this.isLoading,
                    "cf-pagination__load-more"
                  );
                  loadMore.dataset.action = "load_more";
                  container.appendChild(loadMore);
                  this.elements.customPagination.loadMoreButton = loadMore;
                } else {
                  console.log(
                    '[CF Paging] Кнопка "Загрузить еще" не отображается (последняя страница).'
                  );
                }
              } else if (this.config.paginationType === "numbers") {
                const prev = createButton(
                  "‹",
                  "-1",
                  isFirst,
                  "cf-pagination__prev"
                );
                const next = createButton(
                  "›",
                  "1",
                  isLast,
                  "cf-pagination__next"
                );
                container.appendChild(prev);
                const numbersContainer = document.createElement("span");
                numbersContainer.className = "cf-pagination__numbers";

                const maxVisible = 5; // Макс. видимых номеров страниц (включая текущую, первую, последнюю)
                const sideCount = Math.floor((maxVisible - 3) / 2); // Кол-во номеров с каждой стороны от текущей (не считая 1 и last)
                const showEllipsisThreshold = maxVisible - 1; // Порог для показа многоточия

                if (this.totalPages <= showEllipsisThreshold + 2) {
                  // Если страниц мало, показываем все
                  for (let i = 1; i <= this.totalPages; i++) {
                    numbersContainer.appendChild(createPageNumber(i));
                  }
                } else {
                  // Логика с многоточиями
                  numbersContainer.appendChild(createPageNumber(1)); // Всегда показываем 1
                  if (this.currentPage > sideCount + 2) {
                    // Многоточие после 1
                    numbersContainer.appendChild(createEllipsis());
                  }
                  // Определяем диапазон средних номеров
                  const start = Math.max(2, this.currentPage - sideCount);
                  const end = Math.min(
                    this.totalPages - 1,
                    this.currentPage + sideCount
                  );
                  for (let i = start; i <= end; i++) {
                    numbersContainer.appendChild(createPageNumber(i));
                  }

                  if (this.currentPage < this.totalPages - sideCount - 1) {
                    // Многоточие перед последней
                    numbersContainer.appendChild(createEllipsis());
                  }
                  numbersContainer.appendChild(
                    createPageNumber(this.totalPages)
                  ); // Всегда показываем последнюю
                }
                container.appendChild(numbersContainer);
                container.appendChild(next);
                this.elements.customPagination = {
                  prevButton: prev,
                  nextButton: next,
                };
              }
            }

            _handleCustomPaginationClick(event) {
              const button = event.target.closest(".cf-pagination__button");
              const pageLink = event.target.closest(
                ".cf-pagination__number[data-page]"
              );
              if ((!button && !pageLink) || this.isLoading) return;

              event.preventDefault();
              let newPage = this.currentPage;
              let appendResults = false;

              if (button) {
                const action = button.dataset.action;
                const direction = parseInt(button.dataset.direction, 10);
                if (action === "load_more") {
                  newPage = this.currentPage + 1;
                  appendResults = true;
                } else if (!isNaN(direction)) {
                  newPage = this.currentPage + direction;
                } else {
                  return;
                }
              } else if (pageLink) {
                newPage = parseInt(pageLink.dataset.page, 10);
                if (isNaN(newPage)) return;
              } else {
                return;
              }

              newPage = Math.max(1, Math.min(newPage, this.totalPages)); // Ограничиваем диапазон

              if (newPage !== this.currentPage || appendResults) {
                console.log(
                  \`[CF Paging Click] Переход на страницу: \${newPage}, append: \${appendResults}\`
                );
                if (this.elements.widget && !appendResults) {
                  // Плавный скролл к началу виджета
                  const widgetTop =
                    this.elements.widget.getBoundingClientRect().top +
                    window.pageYOffset;
                  window.scrollTo({ top: widgetTop - 80, behavior: "smooth" }); // 80px - отступ сверху
                }
                if (appendResults) {
                  this.currentPage = newPage; // Обновляем страницу ДО запроса для load_more
                  this.fetchAndRenderItems(this.currentFilters, newPage, true);
                } else {
                  // Для обычной пагинации fetchAndRenderItems сам обновит this.currentPage
                  this.fetchAndRenderItems(this.currentFilters, newPage, false);
                }
              } else {
                console.log(
                  "[CF Paging Click] Клик проигнорирован (та же страница или невалидный переход)."
                );
              }
            }

            _showErrorMessage(message) {
              const cssClass = "cf-error-message";
              let div = this.elements.widget?.querySelector("." + cssClass);
              if (!div && this.elements.widget) {
                div = document.createElement("div");
                div.className = cssClass;
                // Вставляем перед контейнером списка или первым элементом виджета
                const beforeEl =
                  this.elements.targetContainer ||
                  this.elements.widget.firstChild;
                this.elements.widget.insertBefore(div, beforeEl);
              }
              if (div) div.textContent = message;
            }
          } // Конец класса TaptopCollectionFilter

          // Инициализация фильтра
          try {
            const filterInstance = new TaptopCollectionFilter(
              ${runtimeConfigJSON}
            );
            await filterInstance._init(); // Вызываем async _init после создания экземпляра
          } catch (e) {
            console.error("[CF] Критическая ошибка инициализации фильтра:", e);
            const widget = document.querySelector(
              ".${settings.targetSelector || "collection"}"
            );
            if (widget) {
              const errorDiv = document.createElement("div");
              errorDiv.className = "cf-error-message";
              errorDiv.textContent = \`Ошибка инициализации скрипта фильтра: \${e.message}. Проверьте настройки генератора и консоль браузера (F12).\`;
              const beforeEl =
                widget.querySelector(".collection__list") || widget.firstChild;
              widget.insertBefore(errorDiv, beforeEl);
            }
          }
        }); // Конец DOMContentLoaded
      </script>
    `;

    return scriptCode;
  }
}
