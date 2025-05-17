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

    // --- Стандартные настройки сортировки ---
    const defaultSortConfig = {
      commonSelectSelector: "",
      applyInstantly: "instant", // 'instant' or 'button'
      defaultSortLabel: "",
    };

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
        sortRules: [],
        sortConfig: { ...defaultSortConfig },
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
        sortRules: [],
        sortConfig: { ...defaultSortConfig },
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
        sortRules: [],
        sortConfig: { ...defaultSortConfig },
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
        sortRules: [],
        sortConfig: { ...defaultSortConfig },
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
        sortRules: [],
        sortConfig: { ...defaultSortConfig },
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
        sortRules: [],
        sortConfig: { ...defaultSortConfig },
      },
    };
    this.config = {
      sortRules: [], // Инициализируем массив для правил сортировки
      sortConfig: { ...defaultSortConfig }, // Инициализируем объект для общей конфигурации сортировки
    };
    this._boundHandlePresetChange = this._handlePresetChange.bind(this);
    this._boundHandleAddFilter = this._handleAddFilterField.bind(this);
    this._boundContainerListener = this._handleContainerEvents.bind(this);
    this._boundHandlePaginationTypeChange =
      this._handlePaginationTypeChange.bind(this);
    this._boundHandleColorChange = this._handleColorChange.bind(this);

    // --- Новые биндинги для сортировки ---
    this._boundHandleAddSortRule = this._handleAddSortRule.bind(this);
    this._boundHandleSortRuleContainerEvents =
      this._handleSortRuleContainerEvents.bind(this);
    this._boundHandleSortConfigChange = this._handleSortConfigChange.bind(this);
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

      // --- Новые элементы для сортировки ---
      sortRulesContainer: document.getElementById("sort-rules-container"),
      sortRuleTemplate: document.getElementById("sort-rule-template"),
      addSortRuleButton: document.getElementById("add-sort-rule-button"),
      commonSortSelectSelectorInput: document.getElementById(
        "common-sort-select-selector"
      ),
      applySortTimingRadios: document.querySelectorAll(
        'input[name="apply-sort-timing"]'
      ),
      defaultSortLabelInput: document.getElementById("default-sort-label"),
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
    );

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

    // --- Новые обработчики для сортировки ---
    this.elements.addSortRuleButton?.addEventListener(
      "click",
      this._boundHandleAddSortRule
    );
    this.elements.commonSortSelectSelectorInput?.addEventListener(
      "input",
      this._boundHandleSortConfigChange
    );
    this.elements.applySortTimingRadios?.forEach((radio) =>
      radio.addEventListener("change", this._boundHandleSortConfigChange)
    );
    this.elements.defaultSortLabelInput?.addEventListener(
      "input",
      this._boundHandleSortConfigChange
    );

    const elementsToResetPreset = [
      this.elements.collectionIdInput,
      this.elements.targetSelectorInput,
      this.elements.applyButtonSelectorInput,
      this.elements.resetButtonSelectorInput,
      this.elements.itemsPerPageInput,
      this.elements.paginationTypeSelect,
      this.elements.showLoaderCheckbox,
      this.elements.primaryColorInput,
      // --- Добавляем элементы сортировки в список для сброса пресета ---
      this.elements.commonSortSelectSelectorInput,
      this.elements.defaultSortLabelInput,
      // Радио-кнопки applySortTimingRadios обрабатываются через _boundHandleSortConfigChange, который вызывает _resetPresetSelection
    ];

    elementsToResetPreset.forEach(
      (el) => el?.addEventListener("input", () => this._resetPresetSelection()) // Используем 'input' для мгновенного сброса
    );
    this.elements.paginationTypeSelect?.addEventListener("change", () =>
      this._resetPresetSelection()
    );
    this.elements.showLoaderCheckbox?.addEventListener("change", () =>
      this._resetPresetSelection()
    );
    this.elements.applySortTimingRadios?.forEach((radio) => {
      radio.addEventListener("change", () => this._resetPresetSelection());
    });
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

    // --- Отвязка обработчиков для сортировки ---
    this.elements.addSortRuleButton?.removeEventListener(
      "click",
      this._boundHandleAddSortRule
    );
    this.elements.commonSortSelectSelectorInput?.removeEventListener(
      "input",
      this._boundHandleSortConfigChange
    );
    this.elements.applySortTimingRadios?.forEach((radio) =>
      radio.removeEventListener("change", this._boundHandleSortConfigChange)
    );
    this.elements.defaultSortLabelInput?.removeEventListener(
      "input",
      this._boundHandleSortConfigChange
    );

    // Отвязка единого слушателя для контейнера правил сортировки
    if (this.elements.sortRulesContainer?.dataset.eventsBoundSort) {
      this.elements.sortRulesContainer.removeEventListener(
        "click",
        this._boundHandleSortRuleContainerEvents
      );
      this.elements.sortRulesContainer.removeEventListener(
        "input",
        this._boundHandleSortRuleContainerEvents
      );
      this.elements.sortRulesContainer.removeEventListener(
        "change",
        this._boundHandleSortRuleContainerEvents
      );
      delete this.elements.sortRulesContainer.dataset.eventsBoundSort;
    }

    const elementsToResetPreset = [
      this.elements.collectionIdInput,
      this.elements.targetSelectorInput,
      this.elements.applyButtonSelectorInput,
      this.elements.resetButtonSelectorInput,
      this.elements.itemsPerPageInput,
      this.elements.paginationTypeSelect,
      this.elements.showLoaderCheckbox,
      this.elements.primaryColorInput,
      this.elements.commonSortSelectSelectorInput,
      this.elements.defaultSortLabelInput,
    ];
    elementsToResetPreset.forEach((el) =>
      el?.removeEventListener("input", () => {})
    ); // Пустая функция, т.к. колбэк был анонимным
    this.elements.paginationTypeSelect?.removeEventListener("change", () => {});
    this.elements.showLoaderCheckbox?.removeEventListener("change", () => {});
    this.elements.applySortTimingRadios?.forEach((radio) =>
      radio.removeEventListener("change", () => {})
    );
  }

  _handlePaginationTypeChange(event) {
    this.config.paginationType = event.target.value;
    this._resetPresetSelection();
  }

  _handleColorChange(event) {
    this.config.primaryColor = event.target.value;
    this._resetPresetSelection();
  }

  _handleSortConfigChange(event) {
    const target = event.target;
    const name = target.name || target.id; // 'apply-sort-timing' или ID инпута
    let value;

    if (name === "apply-sort-timing") {
      value = target.value; // 'instant' or 'button'
      this.config.sortConfig.applyInstantly = value;
    } else if (name === "common-sort-select-selector") {
      value = target.value.trim();
      this.config.sortConfig.commonSelectSelector = value === "" ? null : value;
    } else if (name === "default-sort-label") {
      value = target.value.trim();
      this.config.sortConfig.defaultSortLabel = value === "" ? null : value;
    }
    this._resetPresetSelection();
  }

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

    if (event.type === "click") {
      if (target.closest(".remove-field-button")) {
        this._handleRemoveFilterField(uniqueId);
      }
      return;
    }

    if (event.type === "change" || event.type === "input") {
      const configName = target.dataset.configName;
      if (configName) {
        const value =
          target.type === "checkbox" ? target.checked : target.value;
        fieldConf[configName] =
          value === "" &&
          ["elementSelector", "clearButtonSelector"].includes(configName)
            ? null
            : value;

        if (configName === "uiType") {
          fieldConf.instantFilter = value !== UI_TYPES.INPUT;
          this._updateFieldCardUIVisibility(fieldCard);
        }

        if (configName === "fieldId") {
          this._updateFieldLabel(fieldCard, fieldConf, value);
        }
        this._resetPresetSelection();
      }
      return;
    }

    if (
      event.type === "keydown" &&
      target.classList.contains("filter-field-id") &&
      event.key === "Enter"
    ) {
      event.preventDefault();
      target.blur();
      this._updateFieldLabel(fieldCard, fieldConf, target.value);
    }
  }

  _updateFieldLabel(fieldCard, fieldConf, newFieldId) {
    if (!fieldCard || !fieldConf) return;
    const labelTextElement = fieldCard.querySelector(".field-label-text");
    const newLabel = newFieldId
      ? this._capitalizeFirstLetter(newFieldId)
      : "Новое поле";
    if (labelTextElement) labelTextElement.textContent = newLabel;
    fieldConf.label = newLabel;
  }

  setInitialState() {
    this._populatePresetSelect();
    const initialPresetId = this.elements.presetSelect?.value || "custom";
    this._applyPreset(initialPresetId, false); // Применяем пресет для установки config, не сбрасывая ID коллекции
    this._renderAllFieldCardsDOM(); // Рендерим карточки фильтров на основе config
    // --- Новое для сортировки ---
    this._renderSortRulesDOM(); // Рендерим карточки правил сортировки
    // Устанавливаем значения для общих настроек сортировки
    if (this.elements.commonSortSelectSelectorInput && this.config.sortConfig) {
      this.elements.commonSortSelectSelectorInput.value =
        this.config.sortConfig.commonSelectSelector || "";
    }
    if (this.elements.applySortTimingRadios && this.config.sortConfig) {
      this.elements.applySortTimingRadios.forEach((radio) => {
        radio.checked =
          radio.value === (this.config.sortConfig.applyInstantly || "instant");
      });
    }
    if (this.elements.defaultSortLabelInput && this.config.sortConfig) {
      this.elements.defaultSortLabelInput.value =
        this.config.sortConfig.defaultSortLabel || "";
    }
    this._updatePresetPreview(initialPresetId); //  Вызов обновления превью
  }

  _handlePresetChange(event) {
    const presetId = event.target.value;
    this._applyPreset(presetId, true);
    this._renderAllFieldCardsDOM();
    // this._renderSortRulesDOM(); // Вызывается внутри _applyPreset через _updateBaseUIFromConfig
    this._updatePresetPreview(presetId);
  }

  _applyPreset(presetId, resetCollectionId = true) {
    const preset = this.presets[presetId];
    if (!preset) return;

    const currentCollectionId = resetCollectionId
      ? ""
      : this.elements.collectionIdInput?.value ||
        this.config.collectionId ||
        "";

    this.config = structuredClone(preset);
    this.config.preset = presetId;
    this.config.collectionId = currentCollectionId;

    if (Array.isArray(this.config.fields)) {
      this.config.fields.forEach((field, index) => {
        field.uniqueId =
          field.uniqueId || `preset_${presetId}_f${index + 1}_${Date.now()}`;
        if (!("instantFilter" in field)) {
          field.instantFilter = field.uiType !== UI_TYPES.INPUT;
        }
      });
    }

    this.config.paginationType =
      this.config.paginationType || preset.paginationType || "none";
    this.config.showLoader =
      this.config.showLoader ?? preset.showLoader ?? true;
    this.config.primaryColor =
      this.config.primaryColor || preset.primaryColor || "#4483f5";

    // --- Применение настроек сортировки из пресета (если они там есть) ---
    this.config.sortRules = structuredClone(preset.sortRules || []);
    this.config.sortRules.forEach((rule, index) => {
      // Гарантируем uniqueId для правил сортировки
      rule.uniqueId =
        rule.uniqueId || `preset_sort_${presetId}_r${index + 1}_${Date.now()}`;
    });

    const defaultSortConfigForPreset = {
      commonSelectSelector: "",
      applyInstantly: "instant",
      defaultSortLabel: "",
    };
    const presetSortConfig = preset.sortConfig || {};
    this.config.sortConfig = {
      commonSelectSelector:
        presetSortConfig.commonSelectSelector !== undefined
          ? presetSortConfig.commonSelectSelector
          : this.config.sortConfig?.commonSelectSelector ||
            defaultSortConfigForPreset.commonSelectSelector,
      applyInstantly:
        presetSortConfig.applyInstantly !== undefined
          ? presetSortConfig.applyInstantly
          : this.config.sortConfig?.applyInstantly ||
            defaultSortConfigForPreset.applyInstantly,
      defaultSortLabel:
        presetSortConfig.defaultSortLabel !== undefined
          ? presetSortConfig.defaultSortLabel
          : this.config.sortConfig?.defaultSortLabel ||
            defaultSortConfigForPreset.defaultSortLabel,
    };

    this._updateBaseUIFromConfig();
  }

  _updatePresetPreview(presetId) {
    const container = this.elements.presetPreviewContainer;
    if (!container) return;
    container.innerHTML = "";
    container.classList.remove("has-multiple-previews");
    container.style.display = "none";

    const presetData = this.presets[presetId];
    const previews = presetData?.previewImages;

    if (previews && previews.default) {
      container.style.display = "block";

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
    select.value = this.config.preset || "custom";
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

    // --- Обновление UI для общих настроек сортировки ---
    if (this.elements.commonSortSelectSelectorInput && this.config.sortConfig) {
      this.elements.commonSortSelectSelectorInput.value =
        this.config.sortConfig.commonSelectSelector || "";
    }
    if (this.elements.applySortTimingRadios && this.config.sortConfig) {
      this.elements.applySortTimingRadios.forEach(
        (radio) =>
          (radio.checked =
            radio.value ===
            (this.config.sortConfig.applyInstantly || "instant"))
      );
    }
    if (this.elements.defaultSortLabelInput && this.config.sortConfig) {
      this.elements.defaultSortLabelInput.value =
        this.config.sortConfig.defaultSortLabel || "";
    }
    this._renderSortRulesDOM(); // И перерисовываем правила сортировки
  }

  _renderAllFieldCardsDOM() {
    if (!this.elements.filterFieldsContainer) return;
    const container = this.elements.filterFieldsContainer;
    container.innerHTML = "";
    if (Array.isArray(this.config.fields)) {
      this.config.fields.forEach((fieldData, index) => {
        this._addSingleFieldCardDOM(fieldData, index);
      });
    }
  }

  _handleAddFilterField() {
    const uniqueId = `field-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;
    const newFieldData = {
      fieldId: "",
      uniqueId: uniqueId,
      label: "Новое поле",
      uiType: UI_TYPES.INPUT,
      firstIsAll: true,
      instantFilter: true,
      elementSelector: null,
      clearButtonSelector: null,
      condition: null,
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
      this._updatePresetPreview("custom"); // Обновляем превью на "Свой набор"
    }
  }

  _capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _updateFieldCardUIVisibility(fieldCard) {
    if (!fieldCard) return;

    const uiTypeSelect = fieldCard.querySelector(".filter-ui-type");
    const selectedUiType = uiTypeSelect?.value;

    const controlsRow = fieldCard.querySelector(".filter-controls-row");
    const filterSelectorGroup = fieldCard.querySelector(
      ".filter-selector-group"
    );
    const firstIsAllContainer = fieldCard.querySelector(
      ".filter-first-is-all-container"
    );
    const instantFilterContainer = fieldCard.querySelector(
      ".filter-instant-container"
    );
    const clearButtonGroup = fieldCard
      .querySelector(".filter-clear-button-selector")
      ?.closest(".field-group");
    const filterSelectorInput = fieldCard.querySelector(
      ".filter-element-selector"
    );
    const requiredIndicator = filterSelectorGroup?.querySelector(
      ".filter-selector-required"
    );
    const instantFilterCheckbox = fieldCard.querySelector(
      ".filter-instant-filter"
    );

    if (controlsRow) controlsRow.style.display = "none";
    if (filterSelectorGroup) filterSelectorGroup.style.display = "none";
    if (firstIsAllContainer) firstIsAllContainer.style.display = "none";
    if (instantFilterContainer) instantFilterContainer.style.display = "none";
    if (clearButtonGroup) clearButtonGroup.style.display = "none";
    if (filterSelectorInput) filterSelectorInput.required = false;
    if (requiredIndicator) requiredIndicator.style.display = "none";

    const isFilterType = selectedUiType;
    if (isFilterType) {
      if (controlsRow) controlsRow.style.display = "grid";
      if (filterSelectorGroup) filterSelectorGroup.style.display = "block";
      if (filterSelectorInput) filterSelectorInput.required = true;
      if (requiredIndicator) requiredIndicator.style.display = "inline";
      if (clearButtonGroup) clearButtonGroup.style.display = "block";

      const showFirstIsAll = [
        UI_TYPES.SELECT,
        UI_TYPES.RADIO,
        UI_TYPES.BUTTONS,
      ].includes(selectedUiType);
      if (firstIsAllContainer)
        firstIsAllContainer.style.display = showFirstIsAll ? "block" : "none";
      if (instantFilterContainer)
        instantFilterContainer.style.display =
          selectedUiType === UI_TYPES.INPUT ? "none" : "block";

      if (instantFilterCheckbox) {
        const uniqueId = fieldCard.dataset.fieldUniqueId;
        const fieldConf = this.config.fields?.find(
          (f) => f.uniqueId === uniqueId
        );
        if (fieldConf) {
          if (selectedUiType === UI_TYPES.INPUT) {
            fieldConf.instantFilter = false; // Принудительно для INPUT
            instantFilterCheckbox.checked = false; // И в UI тоже
          } else {
            instantFilterCheckbox.checked = fieldConf.instantFilter ?? true;
          }
        }
      }
    }
    this._updateUiTypeHelper(fieldCard, selectedUiType);
  }

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

    const elements = {
      labelTextElement: fieldCard.querySelector(".field-label-text"),
      indexDisplay: fieldCard.querySelector(".field-index-display"),
      fieldIdInput: fieldCard.querySelector(".filter-field-id"),
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
      elements.uiTypeSelect.value = data.uiType;
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
    if (elements.instantFilterCheckbox) {
      let defaultInstant = data.instantFilter ?? data.uiType !== UI_TYPES.INPUT;
      const instantFilterContainer = elements.instantFilterCheckbox.closest(
        ".filter-instant-container"
      );

      if (data.uiType === UI_TYPES.INPUT) {
        defaultInstant = false;
        if (instantFilterContainer)
          instantFilterContainer.style.display = "none"; // Скрываем весь блок
      } else {
        if (instantFilterContainer)
          instantFilterContainer.style.display = "block"; // Показываем блок
      }
      elements.instantFilterCheckbox.checked = defaultInstant;
      elements.instantFilterCheckbox.dataset.configName = "instantFilter";
    }
    container.appendChild(clone);
    this._updateFieldCardUIVisibility(fieldCard);
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

  // --- Новые методы для управления правилами сортировки ---
  _handleAddSortRule() {
    const uniqueId = `sort-rule-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`;
    const newSortRule = {
      uniqueId: uniqueId,
      fieldIdOrName: "",
      direction: "asc", // По умолчанию
      label: "",
      elementSelector: "",
    };

    if (!Array.isArray(this.config.sortRules)) {
      this.config.sortRules = [];
    }
    this.config.sortRules.push(newSortRule);
    this._addSingleSortRuleDOM(newSortRule, this.config.sortRules.length - 1);
    this._updateSortRuleCardIndices(); // Обновляем индексы после добавления DOM элемента
    this._resetPresetSelection(); // Сбрасываем пресет при ручном добавлении

    const newCardElement = this.elements.sortRulesContainer?.querySelector(
      `.sort-rule-card[data-sort-rule-unique-id="${uniqueId}"]`
    );
    newCardElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  _handleRemoveSortRule(uniqueIdToRemove) {
    if (!uniqueIdToRemove || !Array.isArray(this.config.sortRules)) return;
    const indexToRemove = this.config.sortRules.findIndex(
      (r) => r.uniqueId === uniqueIdToRemove
    );

    if (indexToRemove !== -1) {
      this.config.sortRules.splice(indexToRemove, 1);
      const cardToRemove = this.elements.sortRulesContainer?.querySelector(
        `.sort-rule-card[data-sort-rule-unique-id="${uniqueIdToRemove}"]`
      );
      cardToRemove?.remove();
      this._updateSortRuleCardIndices();
      this._resetPresetSelection();
    }
  }

  _renderSortRulesDOM() {
    if (!this.elements.sortRulesContainer) return;
    this.elements.sortRulesContainer.innerHTML = ""; // Очищаем
    if (Array.isArray(this.config.sortRules)) {
      this.config.sortRules.forEach((ruleData, index) => {
        this._addSingleSortRuleDOM(ruleData, index);
      });
    }
    this._updateSortRuleCardIndices(); // Убедимся, что индексы обновлены после полного рендера

    // Привязываем общий обработчик к контейнеру правил сортировки, если еще не привязан
    if (
      this.elements.sortRulesContainer &&
      !this.elements.sortRulesContainer.dataset.eventsBoundSort
    ) {
      this.elements.sortRulesContainer.addEventListener(
        "click",
        this._boundHandleSortRuleContainerEvents
      );
      this.elements.sortRulesContainer.addEventListener(
        "input",
        this._boundHandleSortRuleContainerEvents
      );
      this.elements.sortRulesContainer.addEventListener(
        "change",
        this._boundHandleSortRuleContainerEvents
      ); // Для радио
      this.elements.sortRulesContainer.dataset.eventsBoundSort = "true";
    }
  }

  _addSingleSortRuleDOM(data = {}, index) {
    if (!this.elements.sortRuleTemplate || !this.elements.sortRulesContainer) {
      console.error("Шаблон правила сортировки или контейнер не найдены");
      return;
    }
    const tpl = this.elements.sortRuleTemplate;
    const container = this.elements.sortRulesContainer;
    const clone = tpl.content.cloneNode(true);
    const ruleCard = clone.querySelector(".sort-rule-card");
    if (!ruleCard) return;

    const uniqueId =
      data.uniqueId ||
      `sort-rule-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    data.uniqueId = uniqueId; // Обновляем или устанавливаем uniqueId в данных
    ruleCard.dataset.sortRuleUniqueId = uniqueId;

    // --- Заполнение элементов ---
    const indexDisplay = ruleCard.querySelector(".field-index-display");
    if (indexDisplay) indexDisplay.textContent = `#${index + 1}`; // Индексы начинаются с 1 для пользователя

    const fieldIdInput = ruleCard.querySelector(".sort-field-id");
    if (fieldIdInput) {
      fieldIdInput.value = data.fieldIdOrName || "";
      console.log(uniqueId);
      fieldIdInput.id = `sort-field-id-${uniqueId}`;
      fieldIdInput.dataset.configName = "fieldIdOrName";
      const labelForFieldId = ruleCard.querySelector(
        `label[for="sort-field-id-placeholder"]`
      ); // Ищем по placeholder ID
      if (labelForFieldId) labelForFieldId.setAttribute("for", fieldIdInput.id);
      else
        console.warn(
          "Label for sort-field-id not found in template for ID: " +
            uniqueId +
            ". Expected placeholder ID: sort-field-id-placeholder"
        );
    }

    const directionRadios = ruleCard.querySelectorAll(
      `input[type="radio"][name^="sort-direction-placeholder"]`
    ); // Ищем по placeholder name
    if (directionRadios.length) {
      directionRadios.forEach((radio) => {
        radio.name = `sort-direction-${uniqueId}`;
        radio.id = `${radio.value}-direction-${uniqueId}`; // Уникальный ID для каждого радио
        radio.checked = radio.value === (data.direction || "asc");
        radio.dataset.configName = "direction";
        const labelForRadio = ruleCard.querySelector(
          `label[for="${radio.value}-direction-placeholder"]`
        ); // Ищем лейбл по placeholder ID радио
        if (labelForRadio) labelForRadio.setAttribute("for", radio.id);
        else
          console.warn(
            `Label for radio ${radio.value} not found for sort rule ${uniqueId}`
          );
      });
    } else {
      console.warn(
        "Direction radios not found in sort rule template for ID: " +
          uniqueId +
          ". Expected placeholder name: sort-direction-placeholder"
      );
    }

    const labelInput = ruleCard.querySelector(".sort-label");
    if (labelInput) {
      labelInput.value = data.label || "";
      labelInput.id = `sort-label-${uniqueId}`;
      labelInput.dataset.configName = "label";
      const labelForLabel = ruleCard.querySelector(
        `label[for="sort-label-placeholder"]`
      ); // Ищем по placeholder ID
      if (labelForLabel) labelForLabel.setAttribute("for", labelInput.id);
      else
        console.warn(
          "Label for sort-label not found in template for ID: " +
            uniqueId +
            ". Expected placeholder ID: sort-label-placeholder"
        );
    }

    const elementSelectorInput = ruleCard.querySelector(
      ".sort-element-selector"
    );
    if (elementSelectorInput) {
      elementSelectorInput.value = data.elementSelector || "";
      elementSelectorInput.id = `sort-element-selector-${uniqueId}`;
      elementSelectorInput.dataset.configName = "elementSelector";
      const labelForSelector = ruleCard.querySelector(
        `label[for="sort-element-selector-placeholder"]`
      ); // Ищем по placeholder ID
      if (labelForSelector)
        labelForSelector.setAttribute("for", elementSelectorInput.id);
      else
        console.warn(
          "Label for sort-element-selector not found in template for ID: " +
            uniqueId +
            ". Expected placeholder ID: sort-element-selector-placeholder"
        );
    }

    container.appendChild(clone);
  }

  _updateSortRuleCardIndices() {
    const cards =
      this.elements.sortRulesContainer?.querySelectorAll(".sort-rule-card");
    cards?.forEach((card, index) => {
      const indexDisplay = card.querySelector(".field-index-display");
      if (indexDisplay) indexDisplay.textContent = `#${index + 1}`; // Индексы начинаются с 1 для пользователя
    });
  }

  _handleSortRuleContainerEvents(event) {
    const target = event.target;
    const ruleCard = target.closest(".sort-rule-card");
    if (!ruleCard) return;

    const uniqueId = ruleCard.dataset.sortRuleUniqueId;
    if (!uniqueId) return;

    const ruleConf = this.config.sortRules?.find(
      (r) => r.uniqueId === uniqueId
    );
    if (!ruleConf) {
      console.warn(
        `[CF Sort Generator Event] Конфигурация для правила сортировки ${uniqueId} не найдена.`
      );
      return;
    }

    if (event.type === "click" && target.closest(".remove-sort-rule-button")) {
      this._handleRemoveSortRule(uniqueId);
      return;
    }

    if (
      event.type === "input" ||
      (event.type === "change" && target.type === "radio")
    ) {
      const configName = target.dataset.configName;
      if (configName) {
        const valueToSet =
          target.type === "radio" ? target.value : target.value.trim();
        ruleConf[configName] = valueToSet;

        if (target.type === "radio" && configName === "direction") {
          const ruleIndex = this.config.sortRules.findIndex(
            (r) => r.uniqueId === uniqueId
          );
          if (ruleIndex !== -1) {
            this.config.sortRules[ruleIndex].direction = valueToSet;
          }
        }
        this._resetPresetSelection();
      }
    }
  }

  collectData() {
    const baseSettings = {
      collectionId: this.elements.collectionIdInput?.value.trim() || null,
      targetSelector:
        this.elements.targetSelectorInput?.value.trim() || "collection",
      applyButtonSelector:
        this.elements.applyButtonSelectorInput?.value.trim() || null,
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
        if (fieldConf.uiType) {
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
        const instantFilter =
          typeof fieldConf.instantFilter === "boolean"
            ? fieldConf.instantFilter
            : fieldConf.uiType !== UI_TYPES.INPUT;
        // Исключаем уникальный ID из данных, передаваемых в runtime
        const { uniqueId, ...restOfFieldConf } = fieldConf;
        return { ...restOfFieldConf, condition, instantFilter };
      })
      .filter((f) => f.fieldId && f.uiType);

    // --- Сбор данных для сортировки ---
    const sortConfigData = {
      // Переименовано, чтобы не конфликтовать с this.config.sortConfig
      rules: (this.config.sortRules || []).map(({ uniqueId, ...rest }) => rest), // Исключаем uniqueId
      commonSelectSelector:
        this.elements.commonSortSelectSelectorInput?.value.trim() || null,
      applyInstantly: this.elements.applySortTimingRadios
        ? document.querySelector('input[name="apply-sort-timing"]:checked')
            ?.value === "instant"
        : true,
      defaultSortLabel:
        this.elements.defaultSortLabelInput?.value.trim() || null,
    };
    return {
      ...baseSettings,
      fields: collectedFields,
      sortConfig: sortConfigData,
    };
  }

  _validateSettings(settings) {
    if (!settings.collectionId) {
      this.showErrorModal("Укажите ID Коллекции.");
      return false;
    }
    if (!settings.targetSelector) {
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

    if (!Array.isArray(settings.fields)) settings.fields = [];
    let requiresApplyButton = false;
    const elementSelectorsUsed = new Map();
    const clearButtonSelectorsUsed = new Map();

    for (const [index, field] of settings.fields.entries()) {
      const fieldLabelPrefix = `Поле #${index + 1} (${
        field.label || field.fieldId || "???"
      })`;
      if (!field.fieldId) {
        this.showErrorModal(`Поле #${index + 1}: не указано Имя или ID Поля.`);
        return false;
      }
      const isFilterType = field.uiType;

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
        if (!field.instantFilter) requiresApplyButton = true;
      }
    }

    if (requiresApplyButton && !settings.applyButtonSelector) {
      this.showErrorModal(
        'Хотя бы один из настроенных фильтров не является "Мгновенным". Укажите CSS-класс для кнопки "Применить все фильтры" в Основных настройках или сделайте все фильтры мгновенными.'
      );
      return false;
    }

    // --- Валидация настроек сортировки ---
    if (settings.sortConfig) {
      const { rules, commonSelectSelector } = settings.sortConfig; // defaultSortLabel не требует спец. валидации кроме trim
      if (
        commonSelectSelector &&
        isInvalidClassName(
          commonSelectSelector,
          "CSS-класс общего элемента <select> для сортировки"
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
            this.showErrorModal(
              `${sortRuleLabelPrefix}: не указано Имя или ID Поля для сортировки.`
            );
            return false;
          }
          if (!rule.label) {
            this.showErrorModal(
              `${sortRuleLabelPrefix}: не указана "Метка на сайте" для опции сортировки.`
            );
            return false;
          }

          if (commonSelectSelector) {
            if (sortLabelsUsed.has(rule.label)) {
              this.showErrorModal(
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
                `${sortRuleLabelPrefix}: CSS-класс отдельной кнопки/ссылки`
              )
            )
              return false;
            if (sortElementSelectorsUsed.has(rule.elementSelector)) {
              this.showErrorModal(
                `${sortRuleLabelPrefix}: CSS-класс "${rule.elementSelector}" для отдельного элемента сортировки уже используется другим правилом.`
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

  generateAndCopyCode() {
    const settings = this.collectData();
    if (!this._validateSettings(settings)) return;
    const code = this.generateCode(settings);
    if (this.elements.jsCode) this.elements.jsCode.textContent = code;
    this.copyAndNotify(code);
  }

  generateCode(settings = {}) {
    const runtimeConfig = {
      collectionId: settings.collectionId,
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
      // --- Конфигурация сортировки ---
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
          }, // Обеспечиваем наличие sortConfig
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
        .collection__pagination.is-removed { display: none !important; }
        .collection__pagination-pages, .collection__pagination-load, .collection__pagination-page-by-page { display: none !important; }
        .cf-error-message { color: red; padding: 10px; border: 1px solid red; margin: 10px 0; border-radius: 4px; background: rgba(255, 0, 0, 0.05); }
        /* --- Стили для активной опции сортировки (если используются отдельные кнопки/ссылки) --- */
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
              this.currentFilters = [];
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
              // Также строим карту для полей сортировки
                if (this.sortConfig && Array.isArray(this.sortConfig.rules)) {
                    this.sortConfig.rules.forEach(sortRule => {
                        const fIdOrName = String(sortRule.fieldIdOrName || "").trim();
                        if (!fIdOrName) return; // Пропускаем правила без fieldIdOrName
                        const fIdOrNameLower = fIdOrName.toLowerCase();
                        let foundId = nameToIdMap.get(fIdOrNameLower);
                        // (логика поиска по синонимам и частичному совпадению для сортировки, если нужна, может быть добавлена здесь)
                        // (для простоты, сейчас предполагаем, что для сортировки используется либо ID, либо точное имя)
                        if (foundId) {
                            this.fieldIdMap.set(sortRule.fieldIdOrName, foundId); // Обновляем/добавляем в общую карту
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
            
            // --- Новый метод: Инициализация элементов управления сортировкой ---
            _initSortControls() {
              const { rules, commonSelectSelector } = this.sortConfig; // defaultSortLabel здесь не нужен для инициализации
              if (!rules || rules.length === 0) {
                  // console.log("[CF Sort] Правила сортировки не настроены."); // Можно раскомментировать для отладки
                  return;
              }

            if (commonSelectSelector) {
                const selectElement = document.querySelector('.' + commonSelectSelector);
                if (selectElement && selectElement.tagName === 'SELECT') {
                    this.elements.sortControlElements.commonSelect = selectElement;
                    selectElement.addEventListener('change', this._boundHandleSortChange);
                    this.elements.sortControlElements.allActiveElements.push(selectElement);
                    console.log(\`[CF Sort] Общий <select> (\${commonSelectSelector}) для сортировки найден.\`);
                } else {
                    console.warn(\`[CF Sort] Общий <select> "\${commonSelectSelector}" не найден или не <select>.\`);
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
                // console.log(\`[CF Sort] Элемент(ы) для "\${rule.label}" (.\${rule.elementSelector}) найдены.\`);
            } else {
                // console.warn(\`[CF Sort] Элемент для "\${rule.label}" (.\${rule.elementSelector}) не найден.\`);
            }
        }
    });
    }



            _handleSortChange(event, specificRule = null) {
    if (this.isLoading) return;
    if (event.type === 'click') event.preventDefault();

    let newSortParams = null;
    let newActiveRuleLabel = null; // Метка правила, которое становится активным

    if (specificRule) { // Клик по отдельной кнопке/ссылке
        newSortParams = { fieldIdOrName: specificRule.fieldIdOrName, direction: specificRule.direction };
        newActiveRuleLabel = specificRule.label;
    } else if (event.target && event.target.tagName === 'SELECT') { // Изменение в общем <select>
        const selectElement = event.target;
        const selectedOptionText = selectElement.options[selectElement.selectedIndex]?.text?.trim();

        if (this.sortConfig.defaultSortLabel !== null && selectedOptionText === this.sortConfig.defaultSortLabel) {
            newSortParams = null; // Сброс
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

        // Обновление UI: снять активность со всех, потом поставить на нужный
        // Общий <select>
        if (this.elements.sortControlElements.commonSelect) {
            const selectEl = this.elements.sortControlElements.commonSelect;
            let targetOptionFound = false;
            if (this.currentSortParams) { // Если есть активная сортировка
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
            if (!targetOptionFound) { // Если не нашли конкретную опцию или это сброс
                 if (this.sortConfig.defaultSortLabel !== null) {
                    const optIndex = Array.from(selectEl.options).findIndex(opt => opt.text.trim() === this.sortConfig.defaultSortLabel);
                    selectEl.selectedIndex = (optIndex !== -1) ? optIndex : 0;
                 } else {
                     selectEl.selectedIndex = 0; // Или -1 если нет "пустой" опции
                 }
            }
        }

        // Отдельные кнопки/ссылки
        this.elements.sortControlElements.specificButtons?.forEach(item => {
            item.element.classList.remove('active-sort-option');
            if (this.currentSortParams && item.rule.label === newActiveRuleLabel) { // Сравниваем с newActiveRuleLabel
                item.element.classList.add('active-sort-option');
            }
        });
        
        if (this.sortConfig.applyInstantly || !this.elements.applyButton) {
            this.currentPage = 1; 
            this.fetchAndRenderItems(this.currentFilters, this.currentPage);
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
              this.fetchAndRenderItems(this.currentFilters, this.currentPage, false, false); 
            }

            resetFilters() {
              if (this.isLoading) return;
              // console.log("[CF] Сброс фильтров...");
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
                  default: if ("value" in controls[0]) controls[0].value = ""; break;
                }
              });
              
              this.currentSortParams = null;
                 if (this.elements.sortControlElements.commonSelect) {
        let defaultOptionIndex = 0;
        if (this.sortConfig.defaultSortLabel !== null) { // Явный поиск метки сброса
            const optIndex = Array.from(this.elements.sortControlElements.commonSelect.options).findIndex(opt => opt.text.trim() === this.sortConfig.defaultSortLabel);
            defaultOptionIndex = (optIndex !== -1) ? optIndex : 0; // Если не нашли, то первая
        } else if (this.elements.sortControlElements.commonSelect.options.length > 0) {
            // Если нет defaultSortLabel, но есть опции, проверяем, не является ли первая опция уже специфической сортировкой
            const firstOptionText = this.elements.sortControlElements.commonSelect.options[0].text.trim();
            const firstOptionIsSpecificRule = this.sortConfig.rules.some(rule => rule.label === firstOptionText);
            if (!firstOptionIsSpecificRule) { // Выбираем первую, только если она не правило сортировки
                 defaultOptionIndex = 0;
            } else {
                // Если первая опция - это правило, и нет опции сброса, то непонятно, что выбирать.
                // Можно оставить как есть или добавить <option value="">Выберите</option> и выбирать ее.
                // Пока оставим как есть, т.е. активной останется какая-то сортировка.
                // Чтобы избежать этого, пользователь должен настроить defaultSortLabel.
            }
        }
        this.elements.sortControlElements.commonSelect.selectedIndex = defaultOptionIndex;
    }
    // Визуальный сброс для отдельных кнопок/ссылок
    this.elements.sortControlElements.specificButtons?.forEach(item => {
        item.element.classList.remove('active-sort-option');
    });
    console.log('[CF] Сортировка сброшена визуально и в состоянии.');
    
    this.currentPage = 1;
    this.currentFilters = [];
    this.fetchAndRenderItems([], this.currentPage, false, true); // usePassedFiltersDirectly = true
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
              if (!Array.isArray(this.config.fields)) return apiFilters;
              this.config.fields.forEach((field) => {
                if (!field.elementSelector || !field.condition) return;
                const realFieldId = this._getRealFieldId(field.fieldIdOrName);
                if (!realFieldId) return;
                const controls = this.elements.filterControls[field.fieldIdOrName];
                if (!controls || controls.length === 0) return;
                let value = null, skipFilter = false;
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
              return apiFilters;
            }

            async fetchAndRenderItems(filters = [], page = 1, append = false, usePassedFiltersDirectly = false) {
              if (this.initialDataLoadPromise) {
                try { await this.initialDataLoadPromise; this.initialDataLoadPromise = null; } 
                catch (error) { console.error("[CF Fetch] Ошибка при ожидании initialDataLoadPromise:", error); this._showErrorMessage(\`Ошибка инициализации перед загрузкой данных: \${error.message}\`); this.isLoading = false; this._setLoadingState(false); return; }
              }
              if (!append && this.isLoading) { if (this.applyFiltersDebounced.cancel) this.applyFiltersDebounced.cancel(); if (this.fetchTimeout) clearTimeout(this.fetchTimeout); return; }
              if (append && this.isLoading) { return; }

              // --- НАЧАЛО: Сохранение состояния фокуса для инпутов фильтрации ---
              let activeFilterInputSelector = null;
              let activeFilterInputValue = '';
              let activeFilterInputSelectionStart = 0;
              let activeFilterInputSelectionEnd = 0;

              const focusedElement = document.activeElement;
              if (focusedElement && focusedElement.tagName === 'INPUT') {
                  // Проверяем, является ли активный элемент одним из наших инпутов фильтрации
                  const fieldConfig = this.config.fields.find(field => {
                      if (field.uiType === UI_TYPES.INPUT && field.elementSelector) {
                          const controls = this.elements.filterControls[field.fieldIdOrName];
                          return controls && controls[0] === focusedElement;
                      }
                      return false;
                  });

                  if (fieldConfig) {
                      activeFilterInputSelector = '.' + fieldConfig.elementSelector; // Сохраняем класс
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

              const actualFilters = usePassedFiltersDirectly ? filters : this._collectFilterValues();
              const apiUrl = new URL(this.config.apiEndpoint, window.location.origin);
              apiUrl.searchParams.set('method', 'mosaic/collectionSearch');
              apiUrl.searchParams.set('param[collection_id]', this.config.collectionId);
              if (actualFilters.length > 0) apiUrl.searchParams.set('param[filters]', JSON.stringify(actualFilters));
              apiUrl.searchParams.set('param[page]', this.currentPage);
              apiUrl.searchParams.set('param[per_page]', this.config.itemsPerPage);


              if (this.currentSortParams && this.currentSortParams.fieldIdOrName) {
                  const sortField = this._getRealFieldId(this.currentSortParams.fieldIdOrName);
                  if (sortField) {
                      const sortParamValue = this.currentSortParams.direction === 'desc' ? \`^\${sortField}\` : sortField;
                      apiUrl.searchParams.set('param[sort]', JSON.stringify([sortParamValue]));
                      // console.log(\`[CF Fetch] Применена сортировка: \${sortParamValue}\`);
                  } else {
                      console.warn(\`[CF Fetch] Не удалось определить реальный ID для поля сортировки "\${this.currentSortParams.fieldIdOrName}". Сортировка не применена.\`);
                      apiUrl.searchParams.set('param[sort]', JSON.stringify([]));
                  }
              } else {
                  apiUrl.searchParams.set('param[sort]', JSON.stringify([])); 
                  // console.log('[CF Fetch] Сортировка не применена или сброшена.');
              }

              
              // console.log("[CF Fetch] Запрос данных:", apiUrl.toString());
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
                this.latestTotalItemsCount = totalItems;
                this._renderResults(itemsReceived, append);
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
                    // Даем Taptop время на перерисовку DOM, если он это делает асинхронно
                    // Это может потребовать небольшой задержки или использования MutationObserver для более надежного решения,
                    // но requestAnimationFrame часто бывает достаточно.
                    requestAnimationFrame(() => {
                        const inputElementToRestore = document.querySelector(activeFilterInputSelector);
                        if (inputElementToRestore) {
                            // Проверяем, что это все еще тот же тип элемента, на всякий случай
                            if (inputElementToRestore.tagName === 'INPUT') {
  
                                inputElementToRestore.value = activeFilterInputValue; // Восстанавливаем значение
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
              
              // Блокировка/разблокировка элементов сортировки
              if (this.elements.sortControlElements.commonSelect) {
                  this.elements.sortControlElements.commonSelect.disabled = isLoading;
              }
              this.elements.sortControlElements.specificButtons?.forEach(item => {
                  item.element.style.pointerEvents = isLoading ? 'none' : '';
                  // Можно добавить класс disabled для стилизации, если нужно
                  // item.element.classList.toggle('disabled-sort-option', isLoading); 
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
                //if (this.elements.widget && !appendResults) { const widgetTop = this.elements.widget.getBoundingClientRect().top + window.pageYOffset; window.scrollTo({ top: widgetTop - 80, behavior: "smooth" }); }
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
}
