// Файл: js/generators/DragDropGenerator.js
import { BaseGenerator } from "./base/baseGenerator.js";
import { parseCommaList } from "../utils/parseCommaList.js"; // НОВОЕ: Импорт утилиты

const DEFAULT_DROPZONE_RULE = {
  dropzoneSelector: "",
  acceptDraggables: "",
  onDragEnterClass: "",
  canDropClass: "",
  onDropDraggableClass: "", // НОВОЕ
  onDropDownzoneClass: "",   // НОВОЕ
  snapAndLock: false, // НОВОЕ: Опция примагничивания и блокировки
  dropBehavior: "center", // НОВОЕ: center|fill|hide|custom
  fillPadding: 0, // НОВОЕ: Отступы при заполнении в пикселях
  customWidth: "", // НОВОЕ: Кастомная ширина при сбросе
  customHeight: "" // НОВОЕ: Кастомная высота при сбросе
};

export class DragDropGenerator extends BaseGenerator {
  constructor() {
    super();
    this.config = {
      draggableSelector: "",
      containmentType: "none",
      customContainmentSelector: "",
      hoverCursor: "grab",
      draggingCursor: "grabbing", // Это значение будет обновляться
      dragOpacity: 1,
      dragScale: 1,
      axis: "xy",
      inertia: false,
      dropzoneRules: [],
    };
    this._boundAddNewDropzoneRule = this._addNewDropzoneRule.bind(this);
    this._boundHandleDropzoneRulesContainerChange =
      this._handleDropzoneRulesContainerChange.bind(this);
    this._boundHandleDropzoneRulesContainerClick =
      this._handleDropzoneRulesContainerClick.bind(this);
    this._boundHandleContainmentTypeChange =
      this._handleContainmentTypeChange.bind(this);

    // Новый общий обработчик для обновления this.config
    this._boundHandleConfigInputChange =
      this._handleConfigInputChange.bind(this);
  }

  /**
   * @override
   */
  findElements() {
    super.findElements();
    this.elements.draggableSelectorInput = document.getElementById(
      "dnd-draggable-selector"
    );
    this.elements.containmentTypeSelect = document.getElementById(
      "dnd-containment-type"
    );
    this.elements.customContainmentGroup = document.getElementById(
      "dnd-custom-containment-group"
    );
    this.elements.customContainmentSelectorInput = document.getElementById(
      "dnd-custom-containment-selector"
    );
    this.elements.hoverCursorSelect =
      document.getElementById("dnd-hover-cursor");
    this.elements.hoverCursorContainer = document.getElementById(
      "dnd-hover-cursor-container"
    );
    this.elements.draggingCursorSelect = document.getElementById(
      "dnd-dragging-cursor"
    );
    this.elements.draggingCursorContainer = document.getElementById(
      "dnd-dragging-cursor-container"
    );
    // ИЗМЕНЕНО: ID для слайдеров и добавлены их display-элементы
    this.elements.dragOpacitySlider = document.getElementById(
      "dnd-drag-opacity-slider"
    );
    this.elements.dragOpacityValueDisplay = document.getElementById(
      "dnd-drag-opacity-value"
    );
    this.elements.dragScaleSlider = document.getElementById(
      "dnd-drag-scale-slider"
    );
    this.elements.dragScaleValueDisplay = document.getElementById(
      "dnd-drag-scale-value"
    );
    this.elements.axisSelect = document.getElementById("dnd-axis");
    this.elements.inertiaCheckbox = document.getElementById("dnd-inertia");
    this.elements.dropzoneRulesContainer = document.getElementById(
      "dnd-dropzone-rules-container"
    );
    this.elements.addDropzoneRuleButton = document.getElementById(
      "dnd-add-dropzone-rule-button"
    );
    this.elements.dropzoneRuleTemplate = document.getElementById(
      "dnd-dropzone-rule-template"
    );

    // Проверка наличия элементов (упрощенная)
    const allElementsPresent = Object.values(this.elements).every(
      (el) =>
        (el !== undefined && el !== null) ||
        (Array.isArray(el) && el.length > 0)
    );
    if (!allElementsPresent && this.elements.generateButton) {
      // Проверяем только основные элементы, специфичные для этого генератора,
      // так как this.elements может содержать элементы из BaseGenerator, которых нет в DOM этого генератора.
      const specificElements = [
        this.elements.draggableSelectorInput,
        this.elements.containmentTypeSelect,
        this.elements.customContainmentGroup,
        this.elements.customContainmentSelectorInput,
        this.elements.hoverCursorSelect,
        this.elements.draggingCursorSelect,
        this.elements.dragOpacitySlider, // ИЗМЕНЕНО
        this.elements.dragScaleSlider, // ИЗМЕНЕНО
        this.elements.axisSelect,
        this.elements.inertiaCheckbox,
        this.elements.dropzoneRulesContainer,
        this.elements.addDropzoneRuleButton,
        this.elements.dropzoneRuleTemplate,
      ];
      if (
        specificElements.some(
          (el) => !el && !(el instanceof NodeList && el.length === 0)
        )
      ) {
        // Условие NodeList для случая если какой-то элемент это NodeList
        console.error(
          "DragDropGenerator: Не найдены все необходимые элементы UI."
        );
        if (this.elements.generateButton) {
          this.elements.generateButton.disabled = true;
          this.elements.generateButton.title =
            "Ошибка: не найдены все элементы интерфейса генератора.";
        }
      }
    }
  }

  /**
   * @override
   */
  bindEvents() {
    super.bindEvents();
    if (this.elements.containmentTypeSelect) {
      this.elements.containmentTypeSelect.addEventListener(
        "change",
        this._boundHandleContainmentTypeChange
      );
    }

    // Привязываем общий обработчик _handleConfigInputChange к нужным элементам
    const elementsToTrackForConfigUpdate = [
      this.elements.draggableSelectorInput,
      this.elements.customContainmentSelectorInput, // containmentTypeSelect обрабатывается отдельно
      this.elements.hoverCursorSelect,
      this.elements.draggingCursorSelect,
      this.elements.dragOpacitySlider, // ИЗМЕНЕНО
      this.elements.dragScaleSlider, // ИЗМЕНЕНО
      this.elements.axisSelect,
      this.elements.inertiaCheckbox,
    ];
    elementsToTrackForConfigUpdate.forEach((element) => {
      if (element) {
        // НОВОЕ: специальная обработка для слайдеров, чтобы обновить this.config и display
        if (element.type === "range") {
          element.addEventListener("input", (e) => {
            this._handleConfigInputChange(e); // Обновляем this.config
            if (e.target.id === "dnd-drag-opacity-slider") {
              this._updateSliderDisplay(
                this.elements.dragOpacitySlider,
                this.elements.dragOpacityValueDisplay
              );
            } else if (e.target.id === "dnd-drag-scale-slider") {
              this._updateSliderDisplay(
                this.elements.dragScaleSlider,
                this.elements.dragScaleValueDisplay,
                "x"
              );
            }
          });
        } else {
          const eventType =
            element.type === "checkbox" || element.tagName === "SELECT"
              ? "change"
              : "input";
          element.addEventListener(
            eventType,
            this._boundHandleConfigInputChange
          );
        }
      }
    });

    if (this.elements.addDropzoneRuleButton) {
      this.elements.addDropzoneRuleButton.addEventListener(
        "click",
        this._boundAddNewDropzoneRule
      );
    }
    if (this.elements.dropzoneRulesContainer) {
      this.elements.dropzoneRulesContainer.addEventListener(
        "input",
        this._boundHandleDropzoneRulesContainerChange
      );
      this.elements.dropzoneRulesContainer.addEventListener(
        "change",
        this._boundHandleDropzoneRulesContainerChange
      );
      this.elements.dropzoneRulesContainer.addEventListener(
        "click",
        this._boundHandleDropzoneRulesContainerClick
      );
    }
  }

  // НОВЫЙ МЕТОД
  _updateSliderDisplay(sliderElement, displayElement, suffix = "") {
    if (sliderElement && displayElement) {
      const value = parseFloat(sliderElement.value).toFixed(
        sliderElement.id === "dnd-drag-opacity-slider" ? 2 : 1
      );
      displayElement.textContent = value + suffix;
    }
  }

  /**
   * Общий обработчик для обновления this.config при изменении инпутов/селектов.
   * @param {Event} event
   */
  _handleConfigInputChange(event) {
    const target = event.target;
    let value =
      target.type === "checkbox"
        ? target.checked
        : target.type === "range"
        ? parseFloat(target.value)
        : target.value; // НОВОЕ: parseFloat для range

    // НОВОЕ: Адаптируем configKey для слайдеров, убирая '-slider'
    const elementId = target.id;
    const configKey = elementId
      .replace(/^dnd-/, "")
      .replace(/-slider$/, "") // Удаляем '-slider' с конца, если есть
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    if (this.config.hasOwnProperty(configKey)) {
      if (target.type === "number") {
        value = parseFloat(value);
        if (isNaN(value)) {
          // Если не удалось спарсить, не обновляем или ставим дефолт
          if (configKey === "dragOpacity" || configKey === "dragScale")
            value = 1;
          else return; // или другое поведение
        }
      }
      this.config[configKey] = value;
      // console.log(`Updated this.config.${configKey}:`, value);
    } else if (target === this.elements.customContainmentSelectorInput) {
      this.config.customContainmentSelector = value;
    } else if (target === this.elements.draggableSelectorInput) {
      this.config.draggableSelector = value;
    }
    // Для containmentTypeSelect отдельный обработчик _handleContainmentTypeChange
    // он также должен обновить this.config.containmentType
  }

  /**
   * @override
   */
  unbindEvents() {
    super.unbindEvents();
    if (this.elements.containmentTypeSelect) {
      this.elements.containmentTypeSelect.removeEventListener(
        "change",
        this._boundHandleContainmentTypeChange
      );
    }

    const elementsToUnbind = [
      this.elements.draggableSelectorInput,
      this.elements.customContainmentSelectorInput,
      this.elements.hoverCursorSelect,
      this.elements.draggingCursorSelect,
      this.elements.dragOpacitySlider, // ИЗМЕНЕНО
      this.elements.dragScaleSlider, // ИЗМЕНЕНО
      this.elements.axisSelect,
      this.elements.inertiaCheckbox,
    ];
    elementsToUnbind.forEach((element) => {
      if (element) {
        const eventType =
          element.type === "checkbox" || element.tagName === "SELECT"
            ? "change"
            : "input";
        element.removeEventListener(
          eventType,
          this._boundHandleConfigInputChange
        );
      }
    });

    if (this.elements.addDropzoneRuleButton) {
      this.elements.addDropzoneRuleButton.removeEventListener(
        "click",
        this._boundAddNewDropzoneRule
      );
    }
    if (this.elements.dropzoneRulesContainer) {
      this.elements.dropzoneRulesContainer.removeEventListener(
        "input",
        this._boundHandleDropzoneRulesContainerChange
      );
      this.elements.dropzoneRulesContainer.removeEventListener(
        "change",
        this._boundHandleDropzoneRulesContainerChange
      );
      this.elements.dropzoneRulesContainer.removeEventListener(
        "click",
        this._boundHandleDropzoneRulesContainerClick
      );
    }
  }

  _handleContainmentTypeChange(event) {
    // Обновленный обработчик
    const type = event.target.value;
    this.config.containmentType = type; // Обновляем this.config
    if (this.elements.customContainmentGroup) {
      this.elements.customContainmentGroup.style.display =
        type === "custom" ? "" : "none";
    }
    if (type !== "custom") {
      // Если выбрали не "custom", очищаем customContainmentSelector в конфиге
      this.config.customContainmentSelector = "";
      if (this.elements.customContainmentSelectorInput) {
        this.elements.customContainmentSelectorInput.value = "";
      }
    }
  }

  setInitialState() {
    super.setInitialState();
    // Используем this.config для установки начальных значений
    this.elements.draggableSelectorInput.value =
      this.config.draggableSelector || "";
    this.elements.containmentTypeSelect.value =
      this.config.containmentType || "none";
    this.elements.customContainmentSelectorInput.value =
      this.config.customContainmentSelector || "";
    this.elements.hoverCursorSelect.value = this.config.hoverCursor || "grab";
    this.elements.draggingCursorSelect.value =
      this.config.draggingCursor || "grabbing";
    // ИЗМЕНЕНО: Установка значений для слайдеров и их дисплеев
    this.elements.dragOpacitySlider.value =
      this.config.dragOpacity === undefined ? 1 : this.config.dragOpacity;
    this._updateSliderDisplay(
      this.elements.dragOpacitySlider,
      this.elements.dragOpacityValueDisplay
    );

    this.elements.dragScaleSlider.value =
      this.config.dragScale === undefined ? 1 : this.config.dragScale;
    this._updateSliderDisplay(
      this.elements.dragScaleSlider,
      this.elements.dragScaleValueDisplay,
      "x"
    );
    this.elements.axisSelect.value = this.config.axis || "xy";
    this.elements.inertiaCheckbox.checked = this.config.inertia || false;

    this._handleContainmentTypeChange({
      target: this.elements.containmentTypeSelect,
    }); // Обновляем UI и config на основе текущего значения селекта
    this._renderAllDropzoneRulesDOM();
  }

  _addNewDropzoneRule() {
    const ruleId = `dz_rule_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    const newRule = { id: ruleId, ...structuredClone(DEFAULT_DROPZONE_RULE) };
    this.config.dropzoneRules.push(newRule);
    this._addDropzoneRuleDOM(newRule);
    this._updateDropzoneRuleNumbersAndControls();
  }

  _removeDropzoneRule(ruleIdToRemove) {
    this.config.dropzoneRules = this.config.dropzoneRules.filter(
      (rule) => rule.id !== ruleIdToRemove
    );
    const cardElement = this.elements.dropzoneRulesContainer.querySelector(
      `.dnd-dropzone-rule-card[data-rule-id="${ruleIdToRemove}"]`
    );
    if (cardElement) cardElement.remove();
    this._updateDropzoneRuleNumbersAndControls();
  }

  _renderAllDropzoneRulesDOM() {
    if (!this.elements.dropzoneRulesContainer) return;
    this.elements.dropzoneRulesContainer.innerHTML = "";
    this.config.dropzoneRules.forEach((rule) => this._addDropzoneRuleDOM(rule));
    this._updateDropzoneRuleNumbersAndControls();
  }

  _addDropzoneRuleDOM(ruleConfig) {
    if (
      !this.elements.dropzoneRuleTemplate?.content ||
      !this.elements.dropzoneRulesContainer
    )
      return;
    const templateClone =
      this.elements.dropzoneRuleTemplate.content.cloneNode(true);
    const ruleCard = templateClone.querySelector(".dnd-dropzone-rule-card");
    if (!ruleCard) return;
    ruleCard.dataset.ruleId = ruleConfig.id;

    const fieldsToUpdate = [
      {
        baseName: "dropzone-selector",
        propName: "dropzoneSelector",
        inputName: "dropzoneSelector",
      },
      {
        baseName: "accept-draggables",
        propName: "acceptDraggables",
        inputName: "acceptDraggables",
      },
      {
        baseName: "ondragenter-class",
        propName: "onDragEnterClass",
        inputName: "onDragEnterClass",
      },
      {
        baseName: "candrop-class",
        propName: "canDropClass",
        inputName: "canDropClass",
      },
      // НОВОЕ: Добавляем новые поля
      {
        baseName: "ondrop-draggable-class",
        propName: "onDropDraggableClass", 
        inputName: "onDropDraggableClass",
      },
      {
        baseName: "ondrop-dropzone-class",
        propName: "onDropDownzoneClass",
        inputName: "onDropDownzoneClass",
      },
      {
        baseName: "snap-and-lock",
        propName: "snapAndLock",
        inputName: "snapAndLock",
        type: "checkbox"
      },
      {
        baseName: "drop-behavior",
        propName: "dropBehavior",
        inputName: "dropBehavior",
        type: "select"
      },
      {
        baseName: "fill-padding",
        propName: "fillPadding",
        inputName: "fillPadding",
        type: "number"
      },
      {
        baseName: "custom-width",
        propName: "customWidth",
        inputName: "customWidth"
      },
      {
        baseName: "custom-height",
        propName: "customHeight",
        inputName: "customHeight"
      },
    ];

    fieldsToUpdate.forEach((fieldInfo) => {
      const inputElement = ruleCard.querySelector(`.dnd-${fieldInfo.baseName}`);
      if (inputElement) {
        inputElement.name = fieldInfo.inputName; // Устанавливаем атрибут name
        const originalId = inputElement.id;
        if (originalId && originalId.endsWith("-template")) {
          const newId = `${originalId.replace("-template", "")}-${
            ruleConfig.id
          }`;
          inputElement.id = newId;
          // Устанавливаем значение
          if (fieldInfo.type === "checkbox") {
            inputElement.checked = !!ruleConfig[fieldInfo.propName];
          } else {
            inputElement.value = ruleConfig[fieldInfo.propName] || "";
          }
          const label = ruleCard.querySelector(`label[for="${originalId}"]`);
          if (label) label.setAttribute("for", newId);
        }
      }
    });
    this.elements.dropzoneRulesContainer.appendChild(templateClone);
  }

  _updateDropzoneRuleNumbersAndControls() {
    const ruleCards = this.elements.dropzoneRulesContainer.querySelectorAll(
      ".dnd-dropzone-rule-card"
    );
    ruleCards.forEach((card, index) => {
      const numberElement = card.querySelector(".rule-number");
      if (numberElement) numberElement.textContent = index + 1;
      const removeButton = card.querySelector(".remove-rule-button");
      if (removeButton) removeButton.style.display = "";
      
      // НОВОЕ: Обновляем видимость секций в зависимости от dropBehavior
      const dropBehaviorSelect = card.querySelector('.dnd-drop-behavior');
      if (dropBehaviorSelect) {
        this._toggleDropBehaviorSections(card, dropBehaviorSelect.value);
      }
    });
  }

  _handleDropzoneRulesContainerChange(event) {
    const target = event.target;
    if (
      (target.tagName !== "INPUT" && target.tagName !== "SELECT") || // Добавил SELECT на всякий случай
      !target.closest(".dnd-dropzone-rule-card")
    )
      return;
    const ruleCard = target.closest(".dnd-dropzone-rule-card[data-rule-id]");
    const ruleId = ruleCard?.dataset.ruleId;
    if (!ruleId) return;
    const rule = this.config.dropzoneRules.find((r) => r.id === ruleId);
    if (!rule) return;
    const fieldName = target.name;
    if (fieldName && rule.hasOwnProperty(fieldName)) {
      rule[fieldName] = target.type === "checkbox" ? target.checked : target.value; // Обработка чекбоксов
      
      // НОВОЕ: Обработка изменения dropBehavior для управления видимостью секций
      if (fieldName === 'dropBehavior') {
        this._toggleDropBehaviorSections(ruleCard, target.value);
      }
    }
  }

  _handleDropzoneRulesContainerClick(event) {
    const removeButton = event.target.closest(".remove-rule-button");
    if (removeButton) {
      const ruleCard = removeButton.closest(
        ".dnd-dropzone-rule-card[data-rule-id]"
      );
      const ruleIdToRemove = ruleCard?.dataset.ruleId;
      if (ruleIdToRemove) this._removeDropzoneRule(ruleIdToRemove);
    }
  }
  
  // НОВОЕ: Метод для управления видимостью секций на основе dropBehavior
  _toggleDropBehaviorSections(ruleCard, behaviorValue) {
    const fillOptions = ruleCard.querySelector('.dnd-fill-options');
    const customOptions = ruleCard.querySelector('.dnd-custom-options');
    
    if (fillOptions) {
      fillOptions.style.display = behaviorValue === 'fill' ? '' : 'none';
    }
    
    if (customOptions) {
      customOptions.style.display = behaviorValue === 'custom' ? '' : 'none';
    }
  }

  /**
   * @override
   */
  collectData() {
    // Используем значения, которые уже были обновлены в this.config через _handleConfigInputChange
    // и _handleContainmentTypeChange. Но для полей dropzoneRules, значения могут быть не синхронизированы
    // если пользователь вводил их и не было события input/change (маловероятно, но для надежности)
    // Поэтому для dropzoneRules мы можем пересобрать их из DOM или убедиться, что _handleDropzoneRulesContainerChange
    // всегда обновляет this.config.dropzoneRules. Текущий _handleDropzoneRulesContainerChange обновляет this.config.

    const draggableSelectorRaw = (this.config.draggableSelector || "").trim();
    if (!draggableSelectorRaw) {
      this.showErrorModal("Укажите CSS-класс (или классы через запятую) для перетаскиваемых элементов.");
      return null;
    }

    // НОВОЕ: Обработка нескольких классов для draggableSelector
    const draggableClassesArray = parseCommaList(draggableSelectorRaw); // Используем parseCommaList
    if (draggableClassesArray.length === 0) {
      this.showErrorModal("Укажите хотя бы один CSS-класс для перетаскиваемых элементов.");
      return null;
    }
    // Валидируем каждый класс и добавляем точку
    const validatedDraggableSelectors = draggableClassesArray.map(cls => {
      if (!/^[a-zA-Z0-9_-]+$/.test(cls)) { // Простая валидация имени класса
        this.showErrorModal(`Недопустимое имя класса: "${cls}". Используйте только буквы, цифры, дефис и подчеркивание.`);
        return null; // Помечаем как невалидный
      }
      return "." + cls.replace(/^\./, ""); // Удаляем точку, если есть, и добавляем свою
    });

    if (validatedDraggableSelectors.some(s => s === null)) {
      return null; // Если хоть один класс невалиден, прерываем
    }
    const draggableSelector = validatedDraggableSelectors.join(","); // Формируем мультиселектор

    const containmentType = this.config.containmentType || "none";
    let finalContainmentSelector = null;
    if (containmentType === "parent") {
      finalContainmentSelector = "parent";
    } else if (containmentType === "viewport") {
      // НОВОЕ условие
      finalContainmentSelector = "viewport"; // Используем специальное строковое значение
    } else if (containmentType === "custom") {
      const customSelectorRaw = (
        this.config.customContainmentSelector || ""
      ).trim();
      if (!customSelectorRaw) {
        this.showErrorModal(
          "Укажите CSS-класс для пользовательского контейнера-ограничителя."
        );
        return null;
      }
      finalContainmentSelector = "." + customSelectorRaw.replace(/^\./, "");
    }

    const hoverCursor = (this.config.hoverCursor || "grab").trim();
    const draggingCursorValue = (
      this.config.draggingCursor || "grabbing"
    ).trim();
    // специальное значение "[отсутствует]" заменяем на "no-change" для передачи в конфиг
    const draggingCursor =
      draggingCursorValue === "[отсутствует]"
        ? "no-change"
        : draggingCursorValue;

    const dragOpacity = parseFloat(this.config.dragOpacity);
    if (isNaN(dragOpacity) || dragOpacity < 0 || dragOpacity > 1) {
      this.showErrorModal(
        "Прозрачность при перетаскивании должна быть числом от 0.0 до 1.0."
      );
      // Восстанавливаем дефолтное значение в UI и конфиге
      this.elements.dragOpacitySlider.value = 1;
      this._updateSliderDisplay(
        this.elements.dragOpacitySlider,
        this.elements.dragOpacityValueDisplay
      );
      this.config.dragOpacity = 1;
      return null;
    }
    const dragScale = parseFloat(this.config.dragScale);
    if (isNaN(dragScale) || dragScale < 0.5 || dragScale > 2) {
      this.showErrorModal(
        "Масштаб при перетаскивании должен быть числом от 0.5 до 2.0."
      );
      this.elements.dragScaleSlider.value = 1;
      this._updateSliderDisplay(
        this.elements.dragScaleSlider,
        this.elements.dragScaleValueDisplay,
        "x"
      );
      this.config.dragScale = 1;
      return null;
    }

    const settings = {
      draggableSelector: draggableSelector,
      containmentSelector: finalContainmentSelector,
      hoverCursor: hoverCursor,
      draggingCursor: draggingCursor, // Используем обработанное значение
      dragOpacity: dragOpacity,
      dragScale: dragScale,
      axis: this.config.axis || "xy",
      inertia: this.config.inertia || false,
      dropzones: [],
    };

    let dropzoneValidationFailed = false;
    this.config.dropzoneRules.forEach((ruleConfig, index) => {
      if (dropzoneValidationFailed) return;
      const dropzoneSelectorRaw = (ruleConfig.dropzoneSelector || "").trim();
      if (!dropzoneSelectorRaw) {
        this.showErrorModal(
          `Для Зоны сброса #${index + 1} не указан CSS-класс.`
        );
        dropzoneValidationFailed = true;
        return;
      }
      const dropzoneSelector = "." + dropzoneSelectorRaw.replace(/^\./, "");

      const acceptDraggablesRaw = (ruleConfig.acceptDraggables || "").trim();
      if (!acceptDraggablesRaw) {
        this.showErrorModal(
          `Для Зоны сброса "${dropzoneSelectorRaw}" (№${
            index + 1
          }) не указаны CSS-классы принимаемых элементов.`
        );
        dropzoneValidationFailed = true;
        return;
      }
      const normalizedAcceptDraggables =
        "." + acceptDraggablesRaw.replace(/^\./, "");

      const onDragEnterClassRaw = (ruleConfig.onDragEnterClass || "").trim();
      const onDragEnterClass = onDragEnterClassRaw
        ? onDragEnterClassRaw.replace(/^\./, "")
        : null;

      const canDropClassRaw = (ruleConfig.canDropClass || "").trim();
      const canDropClass = canDropClassRaw
        ? canDropClassRaw.replace(/^\./, "")
        : null;

      // НОВОЕ: Валидация и обработка новых полей
      const onDropDraggableClassRaw = (ruleConfig.onDropDraggableClass || "").trim();
      if (onDropDraggableClassRaw && !/^[a-zA-Z0-9_-]+$/.test(onDropDraggableClassRaw)) {
        this.showErrorModal(`Неверный формат CSS-класса для элемента после сброса в правиле #${index + 1}. Используйте только буквы, цифры, дефисы и подчеркивания.`);
        dropzoneValidationFailed = true;
        return;
      }
      const onDropDraggableClass = onDropDraggableClassRaw
        ? onDropDraggableClassRaw.replace(/^\./, "")
        : null;

      const onDropDownzoneClassRaw = (ruleConfig.onDropDownzoneClass || "").trim();
      if (onDropDownzoneClassRaw && !/^[a-zA-Z0-9_-]+$/.test(onDropDownzoneClassRaw)) {
        this.showErrorModal(`Неверный формат CSS-класса для зоны после сброса в правиле #${index + 1}. Используйте только буквы, цифры, дефисы и подчеркивания.`);
        dropzoneValidationFailed = true;
        return;
      }
      const onDropDownzoneClass = onDropDownzoneClassRaw
        ? onDropDownzoneClassRaw.replace(/^\./, "")
        : null;
      
      const snapAndLock = !!ruleConfig.snapAndLock; // НОВОЕ: Сбор опции snapAndLock
      
      // НОВОЕ: Валидация и сбор новых опций поведения при сбросе
      const dropBehavior = (ruleConfig.dropBehavior || "center").trim();
      const fillPadding = parseInt(ruleConfig.fillPadding) || 0;
      
      let customWidth = null;
      let customHeight = null;
      
      if (dropBehavior === "custom") {
        const customWidthRaw = (ruleConfig.customWidth || "").trim();
        const customHeightRaw = (ruleConfig.customHeight || "").trim();
        
        if (customWidthRaw) {
          const widthMatch = customWidthRaw.match(/^(\d+)(px|%|em|rem|vw|vh)?$/);
          if (!widthMatch) {
            this.showErrorModal(`Неверный формат ширины в правиле #${index + 1}. Используйте формат: 100, 100px, 50%, 10em и т.д.`);
            dropzoneValidationFailed = true;
            return;
          }
          customWidth = widthMatch[2] ? customWidthRaw : customWidthRaw + "px";
        }
        
        if (customHeightRaw) {
          const heightMatch = customHeightRaw.match(/^(\d+)(px|%|em|rem|vw|vh)?$/);
          if (!heightMatch) {
            this.showErrorModal(`Неверный формат высоты в правиле #${index + 1}. Используйте формат: 100, 100px, 50%, 10em и т.д.`);
            dropzoneValidationFailed = true;
            return;
          }
          customHeight = heightMatch[2] ? customHeightRaw : customHeightRaw + "px";
        }
        
        if (!customWidth && !customHeight) {
          this.showErrorModal(`Для режима "Кастомные размеры" в правиле #${index + 1} необходимо указать хотя бы ширину или высоту.`);
          dropzoneValidationFailed = true;
          return;
        }
      }
      
      if (fillPadding < 0 || fillPadding > 100) {
        this.showErrorModal(`Отступы заполнения в правиле #${index + 1} должны быть от 0 до 100 пикселей.`);
        dropzoneValidationFailed = true;
        return;
      }

      settings.dropzones.push({
        dropzoneSelector: dropzoneSelector,
        acceptDraggables: normalizedAcceptDraggables,
        onDragEnterClass: onDragEnterClass,
        canDropClass: canDropClass,
        onDropDraggableClass: onDropDraggableClass,
        onDropDownzoneClass: onDropDownzoneClass,
        snapAndLock: snapAndLock, // НОВОЕ
        dropBehavior: dropBehavior, // НОВОЕ
        fillPadding: fillPadding, // НОВОЕ
        customWidth: customWidth, // НОВОЕ
        customHeight: customHeight // НОВОЕ
      });
    });

    if (dropzoneValidationFailed) return null;

    // console.log("[DragDropGenerator] collectData final settings:", settings);
    return settings;
  }

  generateCode(settings) {
    if (!settings) return "/* Ошибка: настройки не предоставлены. */";

    const interactCdn =
      "https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js";

    const inertiaOptions = settings.inertia
      ? JSON.stringify({
          resistance: 20,
          minSpeed: 200,
          endSpeed: 50,
          allowResume: true,
          smoothEndDuration: 500,
        })
      : "false";

    // CSS для hoverCursor больше не генерируем здесь, будем делать через JS

    const configJson = JSON.stringify(settings, null, 2);

    return `
<script>
${
  // НОВОЕ: Определяем функцию getViewportRect глобально, если выбран viewport
  settings.containmentSelector === "viewport"
    ? `
function getViewportRect() {
  return {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight
  };
}
`
    : ""
}
document.addEventListener('DOMContentLoaded', function() {
  const dragDropConfig = ${configJson};

  function loadInteractLibrary(src, callback) {
    // ... (код загрузки Interact.js остается без изменений) ...
    if (typeof interact === 'function') { callback(); return; }
    let scriptTag = document.querySelector(\`script[src="\${src}"]\`);
    if (scriptTag) {
      const existingOnload = scriptTag.onload;
      scriptTag.onload = function() {
        if (existingOnload) existingOnload();
        if (typeof interact === 'function') callback();
        else console.error('[Taptop DnD] Error: Interact.js script was on page, but "interact" function not defined.');
      };
      if (scriptTag.readyState === 'complete' || scriptTag.readyState === 'loaded') {
          if (typeof interact !== 'function') {
             setTimeout(() => {
                if (typeof interact === 'function') callback();
                else console.error('[Taptop DnD] Error (retry): Interact.js script was on page, but "interact" function not defined.');
             }, 200);
          } else { callback(); }
      }
      return;
    }
    scriptTag = document.createElement('script');
    scriptTag.src = src;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      if (typeof interact === 'function') callback();
      else console.error('[Taptop DnD] Error: Interact.js loaded from CDN, but "interact" function not defined.');
    };
    scriptTag.onerror = () => console.error('[Taptop DnD] Error loading Interact.js from CDN: ' + src);
    document.head.appendChild(scriptTag);
  }

  function initializePluginWhenReady() {
    if (typeof interact === 'function') initTaptopDragDrop(dragDropConfig);
    else console.error('[Taptop DnD] Critical Error: Interact.js not available for plugin initialization.');
  }

  loadInteractLibrary('${interactCdn}', initializePluginWhenReady);
});

function initTaptopDragDrop(config) {
  if (!config || !config.draggableSelector) {
    console.warn('[Taptop DnD] Config incomplete or missing draggableSelector.');
    return;
  }
  const draggableCssSelector = config.draggableSelector; 

  function dragMoveListener(event) {
    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    let transformString = \`translate(\${x}px, \${y}px)\`;
    if (target.isScalingDuringDrag && config.dragScale !== 1) {
        transformString += \` scale(\${config.dragScale})\`;
    }
    target.style.transform = transformString;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  const draggableOptions = {
    listeners: {
      move: dragMoveListener,
      start(event) {
        const target = event.target;

        if (target.getAttribute('data-taptop-draggable-locked') === 'true') {
          event.interaction.stop(); 
          return; 
        }
        
        target.classList.add('is-dragging');
        
        // Сохраняем исходные стили
        target.taptopSavedZIndex = target.style.zIndex || '';
        target.taptopSavedPosition = target.style.position || '';
        target.taptopSavedElementCursor = target.style.cursor || '';
        target.taptopSavedOpacity = target.style.opacity || '';
        document.body.taptopSavedBodyCursor = document.body.style.cursor || '';

        target.style.zIndex = '9999'; // Высокое значение для отображения поверх
        if (window.getComputedStyle(target).position === 'static') {
          target.style.position = 'relative';
        }

        // ОЧИСТКА КЛАССОВ ОТ ПРЕДЫДУЩИХ СБРОСОВ
        // Если у элемента есть класс, который был добавлен после сброса в какую-либо дропзону,
        // удаляем его, так как элемент снова взят в перетаскивание.
        // Также очищаем класс у предыдущей дропзоны, если элемент из неё убирают.
        if (target.dataset.taptopActiveDropzoneSelector && target.dataset.taptopActiveDropzoneClass) {
          const formerDropzoneSelector = target.dataset.taptopActiveDropzoneSelector;
          const classToRemoveFromZone = target.dataset.taptopActiveDropzoneClass;
          document.querySelectorAll(formerDropzoneSelector).forEach(zone => {
            if (zone.classList.contains(classToRemoveFromZone)) {
              zone.classList.remove(classToRemoveFromZone);
            }
          });
          delete target.dataset.taptopActiveDropzoneSelector;
          delete target.dataset.taptopActiveDropzoneClass;
        }

        if (config.dropzones && config.dropzones.length > 0) {
          config.dropzones.forEach(zoneCfg => {
            if (zoneCfg.onDropDraggableClass && target.classList.contains(zoneCfg.onDropDraggableClass)) {
              target.classList.remove(zoneCfg.onDropDraggableClass);
            }
          });
        }
        
        // ИСПРАВЛЕНИЕ #3: Восстанавливаем оригинальные стили при новом перетаскивании
        if (target.dataset.taptopOriginalWidth !== undefined) {
          target.style.width = target.dataset.taptopOriginalWidth;
          target.style.height = target.dataset.taptopOriginalHeight;
          target.style.display = target.dataset.taptopOriginalDisplay;
          target.style.boxSizing = target.dataset.taptopOriginalBoxSizing;
          
          // Очищаем скопированные стили border
          target.style.borderRadius = '';
          target.style.borderTopLeftRadius = '';
          target.style.borderTopRightRadius = '';
          target.style.borderBottomLeftRadius = '';
          target.style.borderBottomRightRadius = '';
          target.style.borderWidth = '';
          target.style.borderStyle = '';
          target.style.borderColor = '';
          
          // Удаляем сохраненные данные
          delete target.dataset.taptopOriginalWidth;
          delete target.dataset.taptopOriginalHeight;
          delete target.dataset.taptopOriginalDisplay;
          delete target.dataset.taptopOriginalBoxSizing;
        }

  // Устанавливаем курсор при перетаскивании
  if (config.draggingCursor && config.draggingCursor !== "[отсутствует]") {
    target.style.cursor = config.draggingCursor;
    document.body.style.cursor = config.draggingCursor;
  } else if (config.draggingCursor === "[отсутствует]") {
    document.body.style.cursor = target.style.cursor || 'auto';
  } else {
    target.style.cursor = 'grabbing';
    document.body.style.cursor = 'grabbing';
  }

  // Прозрачность и масштаб
  if (config.dragOpacity !== 1) {
    target.style.opacity = config.dragOpacity;
  }
  if (config.dragScale !== 1) {
    target.isScalingDuringDrag = true;
    const currentX = parseFloat(target.getAttribute('data-x')) || 0;
    const currentY = parseFloat(target.getAttribute('data-y')) || 0;
    target.style.transform = \`translate(\${currentX}px, $\{currentY}px) scale(\${config.dragScale})\`;
  } else {
    target.isScalingDuringDrag = false;
  }
},
      end(event) {
        const target = event.target;
        target.classList.remove('is-dragging');

        // Восстанавливаем исходные стили
        if (target.hasOwnProperty('taptopSavedZIndex')) {
          target.style.zIndex = target.taptopSavedZIndex;
          delete target.taptopSavedZIndex;
        }
        if (target.hasOwnProperty('taptopSavedPosition')) {
          target.style.position = target.taptopSavedPosition;
          delete target.taptopSavedPosition;
        }
        if (target.hasOwnProperty('taptopSavedElementCursor')) {
          target.style.cursor = target.taptopSavedElementCursor;
          delete target.taptopSavedElementCursor;
        }
        if (target.hasOwnProperty('taptopSavedOpacity')) {
          target.style.opacity = target.taptopSavedOpacity;
         delete target.taptopSavedOpacity;
        }

  // Восстанавливаем курсор body
  if (document.body.hasOwnProperty('taptopSavedBodyCursor')) {
    document.body.style.cursor = document.body.taptopSavedBodyCursor;
    delete document.body.taptopSavedBodyCursor;
  } else {
    document.body.style.cursor = 'auto';
  }

  // Финальный перенос
  // Если элемент не был заблокирован (т.е. snapAndLock не сработал или не был включен для этой зоны),
  // то применяем его финальный transform на основе data-x/data-y.
  // Если snapAndLock сработал, transform уже был установлен в ondrop.
  if (target.getAttribute('data-taptop-draggable-locked') !== 'true') {
      const finalX = parseFloat(target.getAttribute('data-x')) || 0;
      const finalY = parseFloat(target.getAttribute('data-y')) || 0;
      let finalTransform = \`translate(\${finalX}px, \${finalY}px)\`;
      target.style.transform = finalTransform;
  }

  if (target.hasOwnProperty('isScalingDuringDrag')) {
    delete target.isScalingDuringDrag;
  }

  // При необходимости восстановить hover-курсоры
  const hovered = document.querySelectorAll(draggableCssSelector + ":hover");
  let isHovered = Array.from(hovered).includes(target);
  if (isHovered && config.hoverCursor && !target.classList.contains('is-dragging')) {
    // target.style.cursor = config.hoverCursor;
  }
}
    },
    inertia: ${inertiaOptions},
    modifiers: []
  };

  if (config.containmentSelector) {
    // ИЗМЕНЕНО: Явное указание restriction для viewport
    if (config.containmentSelector === "viewport") {
      // Передаем имя функции, которая будет вычислять границы вьюпорта
      // Сама функция getViewportRect была добавлена в тело скрипта выше
      draggableOptions.modifiers.push(interact.modifiers.restrictRect({ restriction: getViewportRect, endOnly: false }));
    } else {
      draggableOptions.modifiers.push(interact.modifiers.restrictRect({ restriction: config.containmentSelector, endOnly: false }));
    }
  }
  
  if (config.axis === 'x') {
    draggableOptions.lockAxis = 'x'; 
  } else if (config.axis === 'y') {
    draggableOptions.lockAxis = 'y';
  }

  const elementsToDrag = document.querySelectorAll(draggableCssSelector);
  if (elementsToDrag.length === 0) {
      // console.warn('[Taptop DnD] No elements found for selector:', draggableCssSelector);
  }

    // Создаем Interactable для всех элементов, подходящих под селектор
  const draggableInteractable = interact(draggableCssSelector);

  // <<<--- ВОТ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Отключаем стандартные курсоры Interact.js
  draggableInteractable.styleCursor(false);

  // Применяем hover-курсор через JS к каждому элементу
if (config.hoverCursor) {
  elementsToDrag.forEach(el => {
    el.taptopInitialInlineCursor = el.style.cursor || '';

    el.addEventListener('mouseenter', function() {
      if (this.classList.contains('is-dragging') || this.getAttribute('data-taptop-draggable-locked') === 'true') return; // Не меняем курсор для заблокированных
      this.taptopPreHoverCursor = this.style.cursor || '';
      this.style.cursor = config.hoverCursor;
    });

    el.addEventListener('mouseleave', function() {
      if (this.classList.contains('is-dragging') || this.getAttribute('data-taptop-draggable-locked') === 'true') return; // Не меняем курсор для заблокированных
      if (this.hasOwnProperty('taptopPreHoverCursor')) {
        this.style.cursor = this.taptopPreHoverCursor;
        delete this.taptopPreHoverCursor;
      } else {
        this.style.cursor = this.taptopInitialInlineCursor || '';
      }
    });
  });
}

  interact(draggableCssSelector).draggable(draggableOptions);

  if (config.dropzones && config.dropzones.length > 0) {
    config.dropzones.forEach(zoneConfig => {
      if (!zoneConfig.dropzoneSelector || !zoneConfig.acceptDraggables) return;
      interact(zoneConfig.dropzoneSelector).dropzone({
        accept: zoneConfig.acceptDraggables,
        overlap: 'pointer',
        ondropactivate(event) { /* NOP */ },
        ondragenter(event) {
          const dropzoneElement = event.target;
          const draggableElement = event.relatedTarget;
          if (zoneConfig.onDragEnterClass) dropzoneElement.classList.add(zoneConfig.onDragEnterClass);
          if (zoneConfig.canDropClass) draggableElement.classList.add(zoneConfig.canDropClass);
        },
        ondragleave(event) {
          const dropzoneElement = event.target;
          const draggableElement = event.relatedTarget;
          if (zoneConfig.onDragEnterClass) dropzoneElement.classList.remove(zoneConfig.onDragEnterClass);
          if (zoneConfig.canDropClass) draggableElement.classList.remove(zoneConfig.canDropClass);
        },
        ondrop(event) {
          const droppedElement = event.relatedTarget; // Перетаскиваемый элемент
          const dropzoneElement = event.target;    // Дропзона

          // ИСПРАВЛЕНИЕ #2: Убираем canDropClass сразу после сброса
          if (zoneConfig.canDropClass) {
            droppedElement.classList.remove(zoneConfig.canDropClass);
          }

          if (zoneConfig.onDropDraggableClass) {
            droppedElement.classList.add(zoneConfig.onDropDraggableClass);
          }
          if (zoneConfig.onDropDownzoneClass) {
            dropzoneElement.classList.add(zoneConfig.onDropDownzoneClass);
            // Сохраняем на элементе информацию о том, в какую зону и с каким классом он попал
            // Это понадобится, чтобы при следующем перетаскивании этого элемента убрать класс с этой дропзоны
            // Важно: это свяжет элемент только с последней дропзоной, в которую он был успешно сброшен и которая имеет onDropDownzoneClass
            droppedElement.dataset.taptopActiveDropzoneSelector = zoneConfig.dropzoneSelector;
            droppedElement.dataset.taptopActiveDropzoneClass = zoneConfig.onDropDownzoneClass;
          }

          // НОВОЕ: Расширенная система позиционирования и изменения размеров
          if (zoneConfig.snapAndLock || zoneConfig.dropBehavior !== 'center') {
            const dzRect = dropzoneElement.getBoundingClientRect();
            const drRect = droppedElement.getBoundingClientRect();

            // Текущие значения data-x/data-y (смещения от исходной позиции)
            const currentDraggableDataX = parseFloat(droppedElement.getAttribute('data-x')) || 0;
            const currentDraggableDataY = parseFloat(droppedElement.getAttribute('data-y')) || 0;
            
            // Абсолютные координаты верхнего левого угла элемента на странице до применения нового transform
            const draggableCurrentPageX = drRect.left + window.pageXOffset - currentDraggableDataX;
            const draggableCurrentPageY = drRect.top + window.pageYOffset - currentDraggableDataY;

            // Сохраняем исходные размеры и стили для возможного восстановления
            if (!droppedElement.dataset.taptopOriginalWidth) {
              droppedElement.dataset.taptopOriginalWidth = droppedElement.style.width || '';
              droppedElement.dataset.taptopOriginalHeight = droppedElement.style.height || '';
              droppedElement.dataset.taptopOriginalDisplay = droppedElement.style.display || '';
              droppedElement.dataset.taptopOriginalBoxSizing = droppedElement.style.boxSizing || '';
            }

            let targetPageX, targetPageY, newDataX, newDataY;
            let newTransform = '';

            switch (zoneConfig.dropBehavior) {
              case 'fill':
                // Заполняем всю дропзону с учетом отступов и центрируем
                const padding = zoneConfig.fillPadding || 0;
                const newWidth = dzRect.width - padding * 2;
                const newHeight = dzRect.height - padding * 2;
                
                // Устанавливаем размеры
                droppedElement.style.width = newWidth + 'px';
                droppedElement.style.height = newHeight + 'px';
                droppedElement.style.boxSizing = 'border-box';
                
                // ИСПРАВЛЕНИЕ #3: Копируем важные стили из дропзоны
                const dropzoneStyles = window.getComputedStyle(dropzoneElement);
                const stylesToCopy = [
                  'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 
                  'borderBottomLeftRadius', 'borderBottomRightRadius',
                  'borderWidth', 'borderStyle', 'borderColor'
                ];
                
                stylesToCopy.forEach(styleProp => {
                  const value = dropzoneStyles.getPropertyValue(styleProp.replace(/([A-Z])/g, '-$1').toLowerCase());
                  if (value && value !== 'initial' && value !== 'inherit' && value !== 'unset') {
                    droppedElement.style[styleProp] = value;
                  }
                });
                
                // Центрируем элемент с новыми размерами
                targetPageX = dzRect.left + window.pageXOffset + padding;
                targetPageY = dzRect.top + window.pageYOffset + padding;
                
                newDataX = targetPageX - draggableCurrentPageX;
                newDataY = targetPageY - draggableCurrentPageY;
                break;

              case 'hide':
                // Скрываем элемент
                droppedElement.style.display = 'none';
                // Позиционирование не требуется, но data-x/y обнуляем
                newDataX = 0;
                newDataY = 0;
                break;

              case 'custom':
                // Применяем кастомные размеры и центрируем
                if (zoneConfig.customWidth) {
                  droppedElement.style.width = zoneConfig.customWidth;
                }
                if (zoneConfig.customHeight) {
                  droppedElement.style.height = zoneConfig.customHeight;
                }
                
                // Получаем новые размеры элемента после изменения
                const newRect = droppedElement.getBoundingClientRect();
                targetPageX = dzRect.left + window.pageXOffset + (dzRect.width / 2) - (newRect.width / 2);
                targetPageY = dzRect.top + window.pageYOffset + (dzRect.height / 2) - (newRect.height / 2);
                
                newDataX = targetPageX - draggableCurrentPageX;
                newDataY = targetPageY - draggableCurrentPageY;
                break;

              default: // 'center' или snapAndLock
                // Стандартное центрирование
                targetPageX = dzRect.left + window.pageXOffset + (dzRect.width / 2) - (drRect.width / 2);
                targetPageY = dzRect.top + window.pageYOffset + (dzRect.height / 2) - (drRect.height / 2);
                
                newDataX = targetPageX - draggableCurrentPageX;
                newDataY = targetPageY - draggableCurrentPageY;
                break;
            }

            // Применяем позиционирование (кроме случая скрытия)
            if (zoneConfig.dropBehavior !== 'hide') {
              droppedElement.setAttribute('data-x', newDataX);
              droppedElement.setAttribute('data-y', newDataY);
              newTransform = \`translate(\${newDataX}px, \${newDataY}px)\`;
              droppedElement.style.transform = newTransform;
            }

            // Блокировка только при snapAndLock (ИСПРАВЛЕНИЕ #4: Отделяем логику блокировки)
            if (zoneConfig.snapAndLock) {
              droppedElement.setAttribute('data-taptop-draggable-locked', 'true');
              droppedElement.style.cursor = 'none';
            }
          }
        },
        ondropdeactivate(event) {
          const dropzoneElement = event.target;
          const draggableElement = event.relatedTarget;
          
          if (zoneConfig.onDragEnterClass) dropzoneElement.classList.remove(zoneConfig.onDragEnterClass);
          // ИСПРАВЛЕНИЕ #2: Убираем canDropClass и здесь на всякий случай
          if (zoneConfig.canDropClass && draggableElement) {
            draggableElement.classList.remove(zoneConfig.canDropClass);
          }
        }
      });
    });
  }
}
</script>
`;
  }
}
