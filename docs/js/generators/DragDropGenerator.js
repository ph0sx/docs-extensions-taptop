// Файл: js/generators/DragDropGenerator.js
import { BaseGenerator } from "./base/baseGenerator.js";
import { parseCommaList } from "../utils/parseCommaList.js";

const DEFAULT_DROPZONE_RULE = {
  dropzoneSelector: "",
  acceptDraggables: "",
  onDragEnterClass: "",
  canDropClass: "",
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
    this.elements.hoverCursorContainer =
      document.getElementById("dnd-hover-cursor-container");
    this.elements.draggingCursorSelect = document.getElementById(
      "dnd-dragging-cursor"
    );
    this.elements.draggingCursorContainer = document.getElementById(
      "dnd-dragging-cursor-container"
    );
    // ИЗМЕНЕНО: ID для слайдеров и добавлены их display-элементы
    this.elements.dragOpacitySlider =
      document.getElementById("dnd-drag-opacity-slider");
    this.elements.dragOpacityValueDisplay =
      document.getElementById("dnd-drag-opacity-value");
    this.elements.dragScaleSlider = document.getElementById("dnd-drag-scale-slider");
    this.elements.dragScaleValueDisplay = document.getElementById("dnd-drag-scale-value");
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
        this.elements.dragScaleSlider,   // ИЗМЕНЕНО
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
      this.elements.dragScaleSlider,   // ИЗМЕНЕНО
      this.elements.axisSelect,
      this.elements.inertiaCheckbox,
    ];
    elementsToTrackForConfigUpdate.forEach((element) => {
      if (element) {
        // НОВОЕ: специальная обработка для слайдеров, чтобы обновить this.config и display
        if (element.type === 'range') {
          element.addEventListener('input', (e) => {
            this._handleConfigInputChange(e); // Обновляем this.config
            if (e.target.id === 'dnd-drag-opacity-slider') {
              this._updateSliderDisplay(this.elements.dragOpacitySlider, this.elements.dragOpacityValueDisplay);
            } else if (e.target.id === 'dnd-drag-scale-slider') {
              this._updateSliderDisplay(this.elements.dragScaleSlider, this.elements.dragScaleValueDisplay, 'x');
            }
          });
        } else {
          const eventType =
            element.type === "checkbox" || element.tagName === "SELECT"
              ? "change"
              : "input";
          element.addEventListener(eventType, this._boundHandleConfigInputChange);
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
        "click",
        this._boundHandleDropzoneRulesContainerClick
      );
    }
  }

  // НОВЫЙ МЕТОД
  _updateSliderDisplay(sliderElement, displayElement, suffix = '') {
    if (sliderElement && displayElement) {
      const value = parseFloat(sliderElement.value).toFixed(sliderElement.id === 'dnd-drag-opacity-slider' ? 2 : 1);
      displayElement.textContent = value + suffix;
    }
  }

  /**
   * Общий обработчик для обновления this.config при изменении инпутов/селектов.
   * @param {Event} event
   */
  _handleConfigInputChange(event) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : (target.type === "range" ? parseFloat(target.value) : target.value) ; // НОВОЕ: parseFloat для range

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
      this.elements.dragScaleSlider,   // ИЗМЕНЕНО
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
    this.elements.draggingCursorSelect.value = this.config.draggingCursor || "grabbing";
    // ИЗМЕНЕНО: Установка значений для слайдеров и их дисплеев
    this.elements.dragOpacitySlider.value =
      this.config.dragOpacity === undefined ? 1 : this.config.dragOpacity;
    this._updateSliderDisplay(this.elements.dragOpacitySlider, this.elements.dragOpacityValueDisplay);

    this.elements.dragScaleSlider.value =
      this.config.dragScale === undefined ? 1 : this.config.dragScale;
    this._updateSliderDisplay(this.elements.dragScaleSlider, this.elements.dragScaleValueDisplay, 'x');
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
          inputElement.value = ruleConfig[fieldInfo.propName] || "";
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
    });
  }

  _handleDropzoneRulesContainerChange(event) {
    const target = event.target;
    if (
      target.tagName !== "INPUT" ||
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
      rule[fieldName] = target.value; // Тримим при сборе в collectData
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
      this.showErrorModal("Укажите CSS-класс для перетаскиваемых элементов.");
      return null;
    }
    const draggableSelector = "." + draggableSelectorRaw.replace(/^\./, "");

    const containmentType = this.config.containmentType || "none";
    let finalContainmentSelector = null;
    if (containmentType === "parent") {
      finalContainmentSelector = "parent";
    } else if (containmentType === "viewport") { // НОВОЕ условие
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
    const draggingCursorValue = (this.config.draggingCursor || "grabbing").trim();
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
      this._updateSliderDisplay(this.elements.dragOpacitySlider, this.elements.dragOpacityValueDisplay);
      this.config.dragOpacity = 1;
      return null;
    }
    const dragScale = parseFloat(this.config.dragScale);
    if (isNaN(dragScale) || dragScale < 0.5 || dragScale > 2) {
      this.showErrorModal(
        "Масштаб при перетаскивании должен быть числом от 0.5 до 2.0."
      );
      this.elements.dragScaleSlider.value = 1;
      this._updateSliderDisplay(this.elements.dragScaleSlider, this.elements.dragScaleValueDisplay, 'x');
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
      const acceptDraggablesArray = parseCommaList(acceptDraggablesRaw);
      const normalizedAcceptDraggables = acceptDraggablesArray
        .map((cls) => "." + cls.replace(/^\./, ""))
        .join(", ");

      const onDragEnterClassRaw = (ruleConfig.onDragEnterClass || "").trim();
      const onDragEnterClass = onDragEnterClassRaw
        ? onDragEnterClassRaw.replace(/^\./, "")
        : null;

      const canDropClassRaw = (ruleConfig.canDropClass || "").trim();
      const canDropClass = canDropClassRaw
        ? canDropClassRaw.replace(/^\./, "")
        : null;

      settings.dropzones.push({
        dropzoneSelector: dropzoneSelector,
        acceptDraggables: normalizedAcceptDraggables,
        onDragEnterClass: onDragEnterClass,
        canDropClass: canDropClass,
      });
    });

    if (dropzoneValidationFailed) return null;

    // console.log("[DragDropGenerator] collectData final settings:", settings);
    return settings;
  }

  generateCode(settings) {
    if (!settings) return "/* Ошибка: настройки не предоставлены. */";
    
    const interactCdn = "https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js";
    
    const inertiaOptions = settings.inertia
      ? JSON.stringify({ resistance: 20, minSpeed: 200, endSpeed: 50, allowResume: true, smoothEndDuration: 500 })
      : "false";

    // CSS для hoverCursor больше не генерируем здесь, будем делать через JS
    
    const configJson = JSON.stringify(settings, null, 2);
    
    return `
<script>
${
  // НОВОЕ: Определяем функцию getViewportRect глобально, если выбран viewport
  settings.containmentSelector === "viewport" ? `
function getViewportRect() {
  return {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight
  };
}
` : ""
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
  target.classList.add('is-dragging');
  
  // Сохраняем исходные стили
  target.taptopSavedElementCursor = target.style.cursor || '';
  target.taptopSavedOpacity = target.style.opacity || '';
  document.body.taptopSavedBodyCursor = document.body.style.cursor || '';

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

  // Восстанавливаем курсор и прозрачность элемента
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
  const finalX = parseFloat(target.getAttribute('data-x')) || 0;
  const finalY = parseFloat(target.getAttribute('data-y')) || 0;
  target.style.transform = \`translate(\${finalX}px, \${finalY}px)\`;

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
      if (this.classList.contains('is-dragging')) return;
      this.taptopPreHoverCursor = this.style.cursor || '';
      this.style.cursor = config.hoverCursor;
    });

    el.addEventListener('mouseleave', function() {
      if (this.classList.contains('is-dragging')) return;
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
    // ... (логика dropzone остается без изменений) ...
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
        ondrop(event) { /* NOP */ },
        ondropdeactivate(event) {
          if (zoneConfig.onDragEnterClass) event.target.classList.remove(zoneConfig.onDragEnterClass);
        }
      });
    });
  }
}
</script>
`;
  }
}
