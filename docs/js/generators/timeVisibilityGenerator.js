import { BaseGenerator } from "./base/baseGenerator.js";

// --- Константы ---
const HIDING_CLASS = "js-time-hidden"; // CSS класс для скрытия элементов
// Порядок важен: 0 = Воскресенье, ..., 6 = Суббота (совпадает с Date.getDay())
const WEEKDAYS_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
// Значения по умолчанию для нового правила
const DEFAULT_RULE_STATE = {
  blockClasses: "",
  startTime: "00:00:00",
  endTime: "23:59:59",
  timezone: "auto",
  weekdays: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
  hideAfterDate: false,
  hideDate: "", // Храним как YYYY-MM-DD
  hideTime: "23:59:59",
};
// Уникальный ID для тега <style>, добавляемого скриптом
const STYLE_TAG_ID = "taptop-time-visibility-styles";

/**
 * Генерирует уникальный ID для правила.
 * @returns {string} Уникальный ID.
 * @private
 */
function generateRuleId() {
  return `rule_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .substring(2, 7)}`;
}

/**
 * Генератор для управления видимостью блоков на основе времени и дней недели.
 * Позволяет настраивать показ блоков:
 * - В определенное время суток
 * - В определенные дни недели
 * - До или после определенной даты
 * Автоматически добавляет необходимые CSS-стили для скрытия.
 *
 * @extends BaseGenerator
 */
export class TimeVisibilityGenerator extends BaseGenerator {
  constructor() {
    super();

    // Конфигурация по умолчанию с одним правилом
    this.config = {
      rules: [this._createDefaultRule()],
    };

    // Сохраняем ссылки на привязанные обработчики для корректного удаления
    this._boundEventHandlers = {
      addRule: this.addNewRule.bind(this),
      handleRuleChange: this._handleRuleChange.bind(this),
      handleRuleRemove: this._handleRuleRemoveClick.bind(this),
    };
  }

  /**
   * Создает новый объект правила со значениями по умолчанию.
   * @returns {object} Объект правила по умолчанию.
   * @private
   */
  _createDefaultRule() {
    const defaultStateCopy = structuredClone(DEFAULT_RULE_STATE);
    return {
      id: generateRuleId(),
      ...defaultStateCopy,
    };
  }

  /**
   * @override
   * Находит все необходимые DOM-элементы.
   */
  findElements() {
    super.findElements(); // Находит общие элементы

    this.elements.rulesContainer = document.getElementById("rules-container");
    this.elements.addRuleButton = document.getElementById("add-rule-button");
    this.elements.ruleTemplate = document.getElementById("rule-template");

    if (
      !this.elements.rulesContainer ||
      !this.elements.addRuleButton ||
      !this.elements.ruleTemplate?.content
    ) {
      console.error(
        "TimeVisibilityGenerator: Не найдены ключевые элементы UI (контейнер, кнопка добавления или шаблон)."
      );
      if (this.elements.generateBtn) {
        this.elements.generateBtn.disabled = true;
        this.elements.generateBtn.title =
          "Ошибка: не найдены элементы интерфейса генератора.";
      }
    }
  }

  /**
   * @override
   * Привязывает обработчики событий к интерактивным элементам.
   * Использует делегирование событий для управления правилами.
   */
  bindEvents() {
    super.bindEvents(); // Привязывает общие события

    const { addRuleButton, rulesContainer } = this.elements;

    if (addRuleButton) {
      addRuleButton.addEventListener("click", this._boundEventHandlers.addRule);
    }

    if (rulesContainer) {
      rulesContainer.addEventListener(
        "input",
        this._boundEventHandlers.handleRuleChange
      );
      rulesContainer.addEventListener(
        "change",
        this._boundEventHandlers.handleRuleChange
      );
      rulesContainer.addEventListener(
        "click",
        this._boundEventHandlers.handleRuleRemove
      );
    }
  }

  /**
   * @override
   * Удаляет все обработчики событий.
   */
  unbindEvents() {
    super.unbindEvents(); // Отвязывает общие события

    const { addRuleButton, rulesContainer } = this.elements;

    if (addRuleButton) {
      addRuleButton.removeEventListener(
        "click",
        this._boundEventHandlers.addRule
      );
    }
    if (rulesContainer) {
      rulesContainer.removeEventListener(
        "input",
        this._boundEventHandlers.handleRuleChange
      );
      rulesContainer.removeEventListener(
        "change",
        this._boundEventHandlers.handleRuleChange
      );
      rulesContainer.removeEventListener(
        "click",
        this._boundEventHandlers.handleRuleRemove
      );
    }
  }

  /**
   * Обрабатывает клики внутри контейнера правил, реагируя на кнопку удаления.
   * @param {Event} event - Объект события click.
   * @private
   */
  _handleRuleRemoveClick(event) {
    const removeButton = event.target.closest(".remove-rule-button");
    if (!removeButton) return;

    const ruleCard = removeButton.closest(".rule-card[data-rule-id]");
    const ruleId = ruleCard?.dataset.ruleId;

    if (ruleId) {
      event.preventDefault();
      this.removeRule(ruleId);
    }
  }

  /**
   * Обрабатывает события 'change' или 'input', делегированные от контейнера правил.
   * Обновляет конфигурацию соответствующего правила.
   * @param {Event} event - Объект события (change или input).
   * @private
   */
  _handleRuleChange(event) {
    const target = event.target;
    const ruleCard = target.closest(".rule-card[data-rule-id]");
    const ruleId = ruleCard?.dataset.ruleId;
    if (!ruleId) return;

    const rule = this.config.rules.find((r) => r.id === ruleId);
    if (!rule) return;

    const name = target.name || target.dataset.name;
    if (!name) return;

    const value = target.type === "checkbox" ? target.checked : target.value;

    switch (name) {
      case "block-classes":
        rule.blockClasses = value;
        break;
      case "start-time":
        rule.startTime = value;
        break;
      case "end-time":
        rule.endTime = value;
        break;
      case "timezone":
        rule.timezone = value;
        break;
      case "hide-after-date-toggle":
        rule.hideAfterDate = value;
        this._toggleHideDateSection(ruleCard, value);
        break;
      case "hide-date":
        rule.hideDate = value;
        break;
      case "hide-time":
        rule.hideTime = value;
        break;
      default:
        const weekdayMatch = name.match(
          /^weekday-(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/
        );
        if (weekdayMatch) {
          const dayName = weekdayMatch[1];
          if (rule.weekdays.hasOwnProperty(dayName)) {
            rule.weekdays[dayName] = value;
          }
        }
    }
  }

  /**
   * Показывает или скрывает секцию с настройками даты/времени скрытия.
   * @param {HTMLElement} ruleCardElement - DOM-элемент карточки правила.
   * @param {boolean} show - Показывать ли секцию.
   * @private
   */
  _toggleHideDateSection(ruleCardElement, show) {
    const section = ruleCardElement.querySelector(".hide-date-section");
    if (section) {
      section.style.display = show ? "" : "none";
    }
  }

  /**
   * Добавляет новое правило в конфигурацию и отображает его в интерфейсе.
   */
  addNewRule() {
    const newRule = this._createDefaultRule();
    this.config.rules.push(newRule);
    this.renderRule(newRule);
    this._updateRemoveButtonsVisibility();

    const newRuleElement = document.getElementById(`rule-${newRule.id}`);
    if (newRuleElement) {
      requestAnimationFrame(() => {
        newRuleElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  /**
   * Удаляет правило по его ID из конфигурации и DOM.
   * @param {string} ruleId - ID правила для удаления.
   */
  removeRule(ruleId) {
    this.config.rules = this.config.rules.filter((rule) => rule.id !== ruleId);

    const ruleElement = document.getElementById(`rule-${ruleId}`);
    if (ruleElement) ruleElement.remove();

    if (this.config.rules.length === 0) {
      this.addNewRule();
    } else {
      this._updateRuleNumbers();
      this._updateRemoveButtonsVisibility();
    }
  }

  /**
   * Обновляет отображаемый порядковый номер для каждой карточки правила.
   * @private
   */
  _updateRuleNumbers() {
    const ruleCards = this.elements.rulesContainer.querySelectorAll(
      ".rule-card[data-rule-id]"
    );
    ruleCards.forEach((card, index) => {
      const numberElement = card.querySelector(".rule-number");
      if (numberElement) numberElement.textContent = index + 1;
    });
  }

  /**
   * Показывает или скрывает кнопки удаления на карточках правил.
   * @private
   */
  _updateRemoveButtonsVisibility() {
    const ruleCards = this.elements.rulesContainer.querySelectorAll(
      ".rule-card[data-rule-id]"
    );
    const showRemoveButton = ruleCards.length > 1;
    ruleCards.forEach((card) => {
      const removeButton = card.querySelector(".remove-rule-button");
      if (removeButton)
        removeButton.style.display = showRemoveButton ? "" : "none";
    });
  }

  /**
   * Рендерит все правила из текущей конфигурации.
   */
  renderRules() {
    const { rulesContainer } = this.elements;
    if (!rulesContainer) return;

    rulesContainer.innerHTML = "";
    this.config.rules.forEach((rule) => this.renderRule(rule));
    this._updateRemoveButtonsVisibility();
  }

  /**
   * Рендерит одну карточку правила, используя HTML-шаблон.
   * @param {object} rule - Объект правила для рендеринга.
   */
  renderRule(rule) {
    const { rulesContainer, ruleTemplate } = this.elements;
    if (!rulesContainer || !ruleTemplate?.content) return;

    const ruleFragment = ruleTemplate.content.cloneNode(true);
    const ruleCard = ruleFragment.querySelector(".rule-card");
    if (!ruleCard) return;

    ruleCard.id = `rule-${rule.id}`;
    ruleCard.dataset.ruleId = rule.id;

    const elements = {
      // Находим элементы один раз
      ruleNumber: ruleCard.querySelector(".rule-number"),
      blockClassesInput: ruleCard.querySelector(".block-classes"),
      startTimeInput: ruleCard.querySelector(".start-time"),
      endTimeInput: ruleCard.querySelector(".end-time"),
      timezoneSelect: ruleCard.querySelector(".timezone-select"),
      weekdayContainer: ruleCard.querySelector(".weekday-container"),
      hideAfterDateCheckbox: ruleCard.querySelector(".hide-after-date-toggle"),
      hideDateInput: ruleCard.querySelector(".hide-date"),
      hideTimeInput: ruleCard.querySelector(".hide-time"),
    };

    // Заполняем элементы данными и устанавливаем атрибуты name
    if (elements.ruleNumber)
      elements.ruleNumber.textContent = this.config.rules.indexOf(rule) + 1;
    if (elements.blockClassesInput) {
      elements.blockClassesInput.value = rule.blockClasses;
      elements.blockClassesInput.name = "block-classes";
    }
    if (elements.startTimeInput) {
      elements.startTimeInput.value = rule.startTime;
      elements.startTimeInput.name = "start-time";
    }
    if (elements.endTimeInput) {
      elements.endTimeInput.value = rule.endTime;
      elements.endTimeInput.name = "end-time";
    }
    if (elements.timezoneSelect) {
      elements.timezoneSelect.value = rule.timezone;
      elements.timezoneSelect.name = "timezone";
    }

    if (elements.weekdayContainer) {
      // Дни недели
      WEEKDAYS_ORDER.forEach((day) => {
        const checkbox = elements.weekdayContainer.querySelector(
          `.${day}-checkbox`
        );
        if (checkbox) {
          const uniqueId = `${day}-${rule.id}`;
          checkbox.id = uniqueId;
          checkbox.checked = !!rule.weekdays[day];
          checkbox.name = `weekday-${day}`;
          const templateLabelId = `${day}-rule_id`; // ID из шаблона HTML
          const label = elements.weekdayContainer.querySelector(
            `label[for="${templateLabelId}"]`
          );
          if (label) label.setAttribute("for", uniqueId);
        }
      });
    }

    if (elements.hideAfterDateCheckbox) {
      elements.hideAfterDateCheckbox.checked = rule.hideAfterDate;
      elements.hideAfterDateCheckbox.name = "hide-after-date-toggle";
    }
    this._toggleHideDateSection(ruleCard, rule.hideAfterDate); // Устанавливаем видимость секции даты
    if (elements.hideDateInput) {
      elements.hideDateInput.value = rule.hideDate;
      elements.hideDateInput.name = "hide-date";
    }
    if (elements.hideTimeInput) {
      elements.hideTimeInput.value = rule.hideTime || "23:59:59";
      elements.hideTimeInput.name = "hide-time";
    }

    rulesContainer.appendChild(ruleFragment);
  }

  /**
   * @override
   * Устанавливает начальное состояние формы, рендеря все правила.
   */
  setInitialState() {
    this.renderRules();
  }

  /**
   * @override
   * Собирает данные из текущей конфигурации для генерации кода.
   * @returns {object} Объект настроек, содержащий массив правил.
   */
  collectData() {
    return {
      rules: structuredClone(this.config.rules), // Глубокая копия
    };
  }

  /**
   * @override
   * Генерирует JavaScript код для управления видимостью блоков по времени.
   * Использует оптимизированный `setTimeout` и автоматически внедряет CSS-стили.
   * @param {object} settings - Объект настроек, содержащий массив правил.
   * @returns {string} Строка сгенерированного JavaScript кода.
   */
  generateCode(settings = {}) {
    if (!settings.rules || settings.rules.length === 0) {
      return "<!-- Time Visibility: Правила не настроены. -->";
    }

    // Подготовка правил (парсеры, фильтры и валидация)
    const processedRules = settings.rules
      .map((rule) => {
        const blockClasses =
          rule.blockClasses
            ?.split(",")
            .map((cls) => cls.trim())
            .filter(Boolean) ?? [];
        if (blockClasses.length === 0) return null;

        const activeWeekdays = WEEKDAYS_ORDER.reduce((acc, dayName, index) => {
          if (rule.weekdays[dayName]) acc.push(index);
          return acc;
        }, []);
        const weekdaysArray =
          activeWeekdays.length > 0 ? activeWeekdays : [0, 1, 2, 3, 4, 5, 6];

        let validHideDate = null;
        if (
          rule.hideAfterDate &&
          rule.hideDate &&
          /^\d{4}-\d{2}-\d{2}$/.test(rule.hideDate)
        ) {
          validHideDate = rule.hideDate;
        } else if (rule.hideAfterDate && rule.hideDate) {
          // Не выводим ошибку в консоль генератора, но она может появиться в консоли сайта
          console.warn(
            `[Time Visibility] Неверный формат даты скрытия "${
              rule.hideDate
            }" для правила с классами "${blockClasses.join(
              ", "
            )}". Скрытие по дате игнорируется.`
          );
        }

        return {
          blockClasses,
          startTime: rule.startTime || "00:00:00", // Добавим значения по умолчанию на всякий случай
          endTime: rule.endTime || "23:59:59",
          timezone: rule.timezone || "auto",
          weekdays: weekdaysArray,
          hideAfterDate: !!rule.hideAfterDate,
          hideDate: validHideDate,
          hideTime: rule.hideTime || "23:59:59",
        };
      })
      .filter(Boolean); // Удаляем невалидные правила (null)

    if (processedRules.length === 0) {
      return `<!-- Time Visibility: Не найдено валидных правил (проверьте CSS классы блоков). -->`;
    }

    // Подготовка данных для вставки в скрипт
    const rulesJson = JSON.stringify(processedRules, null, 2);
    const hidingClassName = HIDING_CLASS;
    const styleTagId = STYLE_TAG_ID;

    // Генерируем итоговый скрипт
    return `<!-- Taptop Extension: Time Visibility -->
<script>
document.addEventListener('DOMContentLoaded', function() {

  // Функция для автоматического добавления CSS правила в <head>
  (function() {
    if (document.getElementById('${styleTagId}')) return; // Не добавлять, если уже есть
    const cssRule = \`.${hidingClassName} { display: none !important; }\`;
    const styleElement = document.createElement('style');
    styleElement.id = '${styleTagId}';
    styleElement.textContent = cssRule;
    try {
      document.head.appendChild(styleElement);
    } catch (e) { // Fallback для старых браузеров или edge cases
      console.error('[TimeVisibility] Не удалось добавить стили в <head>, пробую в <body>', e);
      try { document.body.appendChild(styleElement); } catch (e2) {
        console.error('[TimeVisibility] Не удалось добавить стили и в <body>', e2);
      }
    }
  })();

  // Контроллер видимости блоков
  const timeVisibilityController = {
    rules: ${rulesJson},
    hidingClass: '${hidingClassName}',
    timeoutId: null,

    /** Получает текущее время в нужном часовом поясе */
    getCurrentTimeInZone: function(tzSetting) {
        const now = new Date();
        let targetOffsetHours = -now.getTimezoneOffset() / 60;
        if (tzSetting !== 'auto') {
            const specifiedOffset = parseFloat(tzSetting);
            if (!isNaN(specifiedOffset)) targetOffsetHours = specifiedOffset;
        }
        const utcMillis = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utcMillis + (targetOffsetHours * 3600000));
    },

    /** Проверяет, должен ли блок быть видимым по правилу */
    checkRuleVisibility: function(rule, currentTime) {
        try {
            // 1. Проверка скрытия по дате
            if (rule.hideAfterDate && rule.hideDate) {
                const [hYear, hMonth, hDay] = rule.hideDate.split('-').map(Number);
                const [hHour, hMin, hSec] = rule.hideTime.split(':').map(Number);
                const hideTargetUTC = Date.UTC(hYear, hMonth - 1, hDay, hHour, hMin, hSec);
                // Сравниваем с текущим временем в UTC
                const currentUTC = currentTime.getTime() - (currentTime.getTimezoneOffset() * 60000);
                if (currentUTC >= hideTargetUTC) return false; // Скрыть навсегда
            }

            // 2. Проверка дня недели
            const currentDayOfWeek = currentTime.getDay(); // 0=Вс, 1=Пн..
            if (!rule.weekdays.includes(currentDayOfWeek)) return false;

            // 3. Проверка времени
            const [startH, startM, startS] = rule.startTime.split(':').map(Number);
            const [endH, endM, endS] = rule.endTime.split(':').map(Number);
            const startMillis = (startH * 3600 + startM * 60 + startS) * 1000;
            const endMillis = (endH * 3600 + endM * 60 + endS) * 1000;
            const currentMillis = (currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds()) * 1000;

            // Проверка интервала (включая пересечение полуночи)
            if (startMillis <= endMillis) { // Обычный интервал (09:00-18:00)
                return currentMillis >= startMillis && currentMillis <= endMillis;
            } else { // Интервал через полночь (22:00-06:00)
                return currentMillis >= startMillis || currentMillis <= endMillis;
            }
        } catch (e) {
            console.error('[TimeVisibility] Ошибка при проверке правила:', rule, e);
            return false; // Скрываем в случае ошибки
        }
    },

    /** Применяет правила ко всем блокам и планирует следующую проверку */
    applyAllRulesAndScheduleNextCheck: function() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = null;
        let nextCheckDelay = Infinity;

        this.rules.forEach(rule => {
            const selectors = rule.blockClasses.map(cls => \`.\${cls}\`).join(', ');
            if (!selectors) return;
            const blocks = document.querySelectorAll(selectors);
            if (blocks.length === 0) return;

            const currentTime = this.getCurrentTimeInZone(rule.timezone);
            const shouldShow = this.checkRuleVisibility(rule, currentTime);

            // Управляем классом видимости
            blocks.forEach(block => {
                block.classList.toggle(this.hidingClass, !shouldShow);
            });

            // Рассчитываем задержку до следующей проверки для этого правила
            const ruleDelay = this.calculateNextCheckDelayForRule(rule, currentTime);
            nextCheckDelay = Math.min(nextCheckDelay, ruleDelay);
        });

        // Устанавливаем таймер для следующей проверки
        if (nextCheckDelay === Infinity || nextCheckDelay <= 0) nextCheckDelay = 60000; // Fallback
        const maxDelay = 86400000; // Не ждем дольше суток
        const finalDelay = Math.min(nextCheckDelay, maxDelay);

        this.timeoutId = setTimeout(() => {
            this.applyAllRulesAndScheduleNextCheck();
        }, finalDelay);
    },

    /** Рассчитывает задержку до следующего важного события для правила */
    calculateNextCheckDelayForRule: function(rule, currentTime) {
         let minDelay = Infinity;
         const nowMillis = currentTime.getTime();
         try {
            const momentsToCheck = []; // Массив временных меток (мс) для проверки

            // Время начала сегодня/завтра
            const [startH, startM, startS] = rule.startTime.split(':').map(Number);
            const startTimeToday = new Date(currentTime); startTimeToday.setHours(startH, startM, startS, 0);
            momentsToCheck.push(startTimeToday.getTime()); momentsToCheck.push(startTimeToday.getTime() + 86400000);

            // Время окончания сегодня/завтра
            const [endH, endM, endS] = rule.endTime.split(':').map(Number);
            const endTimeToday = new Date(currentTime); endTimeToday.setHours(endH, endM, endS, 999);
            momentsToCheck.push(endTimeToday.getTime()); momentsToCheck.push(endTimeToday.getTime() + 86400000);

            // Время скрытия по дате (если актуально)
            if (rule.hideAfterDate && rule.hideDate) {
                 const [hYear, hMonth, hDay] = rule.hideDate.split('-').map(Number);
                 const [hHour, hMin, hSec] = rule.hideTime.split(':').map(Number);
                 const hideTargetUTC = Date.UTC(hYear, hMonth - 1, hDay, hHour, hMin, hSec);
                 const currentUTC = currentTime.getTime() - (currentTime.getTimezoneOffset() * 60000);
                 if (hideTargetUTC > currentUTC) { // Если дата еще не наступила
                    // Приближенный расчет локального времени скрытия
                    const targetOffsetHours = (rule.timezone === 'auto') ? - (new Date()).getTimezoneOffset() / 60 : parseFloat(rule.timezone);
                    const hideTargetLocalMillis = hideTargetUTC + (targetOffsetHours * 3600000);
                    if (hideTargetLocalMillis > nowMillis) { // Убедимся, что оно в будущем
                       momentsToCheck.push(hideTargetLocalMillis);
                    }
                 }
            }

            // Следующая полночь
            const nextMidnight = new Date(currentTime); nextMidnight.setHours(24, 0, 0, 0);
            momentsToCheck.push(nextMidnight.getTime());

            // Находим минимальную задержку до будущего момента
            momentsToCheck.forEach(momentMillis => {
                if (momentMillis > nowMillis) minDelay = Math.min(minDelay, momentMillis - nowMillis);
            });

        } catch(e) {
            console.error("[TimeVisibility] Ошибка при расчете задержки:", rule, e);
            return 60000; // Fallback 1 минута
        }
        // Возвращаем задержку > 1 сек
        return Math.max(1000, (minDelay === Infinity ? 60000 : minDelay) + 100); // +100ms буфер
     },

    /** Инициализация контроллера */
    init: function() {
      if (!this.rules || this.rules.length === 0) return; // Нет правил - нет работы
      this.applyAllRulesAndScheduleNextCheck(); // Запуск цикла
    }
  };

  // Запускаем контроллер
  timeVisibilityController.init();
});
</script>
<!-- End Taptop Extension: Time Visibility -->`;
  }
}
