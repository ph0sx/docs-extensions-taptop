import { BaseGenerator } from "./base/baseGenerator.js";
import { parseCommaList } from "../utils/parseCommaList.js"; // Импортируем утилиту

/**
 * Генератор для расширения "Таймер обратного отсчета / Скрытие блока".
 * Позволяет настроить таймер (фиксированный или вечнозеленый)
 * и указать классы блоков для скрытия по его завершении.
 *
 * @extends BaseGenerator
 */
export class CountdownTimerGenerator extends BaseGenerator {
  constructor() {
    super(); // Вызываем конструктор базового класса

    // Здесь можно определить конфигурацию по умолчанию, если необходимо,
    // но основная конфигурация будет собираться из UI в collectData.
    this.configDefaults = {
      timerType: "fixed", // 'fixed' или 'evergreen'
      endDate: "", // YYYY-MM-DD
      endTime: "00:00:00", // HH:MM:SS
      timezone: "auto",
      durationDays: 0,
      durationHours: 1,
      durationMinutes: 0,
      durationSeconds: 0,
      displayClass: "",
      hideClasses: "",
      // Ключ для localStorage (можно генерировать динамически или сделать настраиваемым)
      storageKey: "taptopTimerEnd_",
    };

    // Можно добавить привязку обработчиков, специфичных для этого генератора,
    // например, для переключения видимости настроек таймера.
    this._boundHandleTimerTypeChange = this._handleTimerTypeChange.bind(this);
  }

  /**
   * @override
   * Находит DOM-элементы, специфичные для этого генератора.
   */
  findElements() {
    super.findElements(); // Находим общие элементы (кнопка генерации, модалка)

    // Находим элементы управления генератора
    this.elements.timerTypeRadios = document.querySelectorAll(
      'input[name="timerType"]'
    );
    this.elements.fixedDateSettings = document.getElementById(
      "fixed-date-settings"
    );
    this.elements.evergreenSettings =
      document.getElementById("evergreen-settings");

    // Поля для фиксированной даты
    this.elements.endDateInput = document.getElementById("timer-end-date");
    this.elements.endTimeInput = document.getElementById("timer-end-time");
    this.elements.timezoneSelect = document.getElementById("timer-timezone");

    // Поля для вечнозеленого таймера
    this.elements.durationDaysInput = document.getElementById(
      "timer-duration-days"
    );
    this.elements.durationHoursInput = document.getElementById(
      "timer-duration-hours"
    );
    this.elements.durationMinutesInput = document.getElementById(
      "timer-duration-minutes"
    );
    this.elements.durationSecondsInput = document.getElementById(
      "timer-duration-seconds"
    );

    // Поля для целей
    this.elements.displayClassInput = document.getElementById(
      "timer-display-class"
    );
    this.elements.hideClassesInput =
      document.getElementById("timer-hide-classes");

    this.elements.showClassesInput =
      document.getElementById("timer-show-classes");
    this.elements.hideSelfCheckbox = document.getElementById("timer-hide-self");
    this.elements.completionTextInput = document.getElementById(
      "timer-completion-text"
    );
    this.elements.redirectPathInput = document.getElementById(
      "timer-redirect-path"
    );

    // Проверка наличия ключевых элементов
    if (
      !this.elements.timerTypeRadios.length ||
      !this.elements.fixedDateSettings ||
      !this.elements.evergreenSettings ||
      !this.elements.displayClassInput ||
      !this.elements.hideClassesInput ||
      !this.elements.showClassesInput ||
      !this.elements.hideSelfCheckbox ||
      !this.elements.completionTextInput ||
      !this.elements.redirectPathInput
    ) {
      console.error(
        "CountdownTimerGenerator: Не найдены все необходимые элементы UI."
      );
    }
  }

  /**
   * @override
   * Привязывает обработчики событий, специфичные для этого генератора.
   */
  bindEvents() {
    super.bindEvents(); // Привязываем базовые события (кнопка генерации, модалка)

    // Добавляем слушатель на изменение типа таймера
    this.elements.timerTypeRadios.forEach((radio) => {
      radio.addEventListener("change", this._boundHandleTimerTypeChange);
    });
  }

  /**
   * @override
   * Удаляет обработчики событий.
   */
  unbindEvents() {
    super.unbindEvents(); // Отвязываем базовые события

    // Удаляем слушатель с radio buttons
    this.elements.timerTypeRadios?.forEach((radio) => {
      radio.removeEventListener("change", this._boundHandleTimerTypeChange);
    });
  }

  /**
   * @override
   * Устанавливает начальное состояние UI генератора.
   */
  setInitialState() {
    // Устанавливаем видимость групп настроек при инициализации
    this._handleTimerTypeChange();

    // Можно установить значения по умолчанию в поля, если нужно
    // Например:
    // if (this.elements.endDateInput) {
    //   const today = new Date().toISOString().split('T')[0];
    //   this.elements.endDateInput.value = today;
    // }
  }

  /**
   * Обработчик изменения типа таймера. Скрывает/показывает нужные группы настроек.
   * @private
   */
  _handleTimerTypeChange() {
    const selectedType =
      document.querySelector('input[name="timerType"]:checked')?.value ||
      "fixed";

    if (this.elements.fixedDateSettings) {
      this.elements.fixedDateSettings.style.display =
        selectedType === "fixed" ? "" : "none";
    }
    if (this.elements.evergreenSettings) {
      this.elements.evergreenSettings.style.display =
        selectedType === "evergreen" ? "" : "none";
    }
  }

  /**
   * @override
   * Собирает данные из формы генератора.
   * @returns {object} Объект с настройками таймера.
   */
  collectData() {
    const timerType =
      document.querySelector('input[name="timerType"]:checked')?.value ||
      "fixed";
    const displayClass = this.elements.displayClassInput?.value.trim() || "";
    const hideClassesRaw = this.elements.hideClassesInput?.value || "";
    const showClassesRaw = this.elements.showClassesInput?.value || "";
    const hideTimerOnEnd = this.elements.hideSelfCheckbox?.checked || false;
    const completionText =
      this.elements.completionTextInput?.value.trim() || "";
    const redirectPath = this.elements.redirectPathInput?.value.trim() || "";

    // Валидация обязательных полей
    if (!displayClass) {
      this.showErrorModal(
        "Укажите CSS-класс элемента для отображения таймера."
      );
      return null; // Возвращаем null или выбрасываем ошибку, чтобы прервать генерацию
    }
    //if (!hideClassesRaw) {
    //  this.showErrorModal("Укажите CSS-класс(ы) для скрываемых блоков.");
    //  return null;
    //}
    // Проверка на недопустимые символы в классах
    const invalidCharRegex = /[.#\s\[\]>+~:()]/;
    if (invalidCharRegex.test(displayClass)) {
      this.showErrorModal(
        `Класс элемента таймера "${displayClass}" содержит недопустимые символы (пробелы, точки, # и т.д.).`
      );
      return null;
    }
    const hideClasses = parseCommaList(hideClassesRaw);
    if (hideClasses.some((cls) => invalidCharRegex.test(cls))) {
      this.showErrorModal(
        `Один или несколько классов для скрытия ("${hideClassesRaw}") содержат недопустимые символы (пробелы, точки, # и т.д.).`
      );
      return null;
    }

    //  Валидация классов для показа (если они введены)
    const showClasses = parseCommaList(showClassesRaw);
    if (showClasses.some((cls) => invalidCharRegex.test(cls))) {
      this.showErrorModal(
        `Один или несколько классов для показа ("${showClassesRaw}") содержат недопустимые символы (пробелы, точки, # и т.д.).`
      );
      return null;
    }

    // Валидация пути редиректа (если указан)
    if (redirectPath && !redirectPath.startsWith("/")) {
      this.showErrorModal(
        `Путь для перенаправления "${redirectPath}" должен начинаться с символа "/".`
      );
      return null;
    }

    const settings = {
      timerType: timerType,
      displayClass: displayClass,
      hideClasses: hideClasses, // Используем результат parseCommaList
      showClasses: showClasses,
      completionText: completionText,
      redirectPath: redirectPath,
      hideTimerOnEnd: hideTimerOnEnd,
      storageKey: this.configDefaults.storageKey + displayClass, // Генерируем ключ на основе класса таймера
    };

    if (timerType === "fixed") {
      settings.endDate = this.elements.endDateInput?.value || "";
      settings.endTime = this.elements.endTimeInput?.value || "00:00:00";
      settings.timezone = this.elements.timezoneSelect?.value || "auto";
      // Валидация даты
      if (!settings.endDate) {
        this.showErrorModal(
          "Укажите Дату окончания для фиксированного таймера."
        );
        return null;
      }
    } else {
      settings.durationDays =
        parseInt(this.elements.durationDaysInput?.value, 10) || 0;
      settings.durationHours =
        parseInt(this.elements.durationHoursInput?.value, 10) || 0;
      settings.durationMinutes =
        parseInt(this.elements.durationMinutesInput?.value, 10) || 0;
      settings.durationSeconds =
        parseInt(this.elements.durationSecondsInput?.value, 10) || 0;
      // Валидация длительности
      if (
        settings.durationDays === 0 &&
        settings.durationHours === 0 &&
        settings.durationMinutes === 0 &&
        settings.durationSeconds === 0
      ) {
        this.showErrorModal(
          "Укажите ненулевую длительность для вечнозеленого таймера."
        );
        return null;
      }
      if (
        settings.durationDays < 0 ||
        settings.durationHours < 0 ||
        settings.durationMinutes < 0 ||
        settings.durationSeconds < 0
      ) {
        this.showErrorModal("Длительность не может быть отрицательной.");
        return null;
      }
    }

    return settings;
  }

  /**
   * @override
   * Переопределяем базовый метод, чтобы добавить проверку валидации после сбора данных.
   */
  generateAndCopyCode() {
    const settings = this.collectData(); // Вызываем наш метод сбора данных и валидации

    // Если collectData вернул null (из-за ошибки валидации), прерываем выполнение
    if (settings === null) {
      console.warn(
        "CountdownTimerGenerator: Генерация кода прервана из-за ошибки валидации."
      );
      return;
    }

    // Если данные собраны успешно, продолжаем как в базовом классе
    const code = this.generateCode(settings);

    if (this.elements.jsCode) {
      this.elements.jsCode.textContent = code;
    }
    this.copyAndNotify(code); // Вызываем копирование и показ модалки успеха
  }

  /**
   * @override
   * Генерирует JavaScript-код для таймера на основе настроек.
   * @param {object} settings - Настройки, собранные из collectData.
   * @returns {string} Строка с JavaScript-кодом.
   */
  generateCode(settings) {
    // settings уже проверены на null в переопределенном generateAndCopyCode
    // Удаляем showDisplayType перед передачей в JSON, если он там остался
    const { showDisplayType, ...settingsForJson } = settings;
    const configJson = JSON.stringify(settingsForJson, null, 2);

    // Шаблон скрипта с логикой удаления класса
    return `<script>
document.addEventListener('DOMContentLoaded', function() {
const config = ${configJson};
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

let timerDisplayElement = null;
let elementsToHide = [];
// elementsToShow теперь нам не нужна как отдельная переменная для стилизации,
// мы будем находить их по селектору и удалять класс.
let intervalId = null;
let targetTimestamp = 0;

// ... (функции formatTimeLeft, hideTargetElements остаются такими же) ...

/**
 * Форматирует оставшееся время в строку HH:MM:SS или DD:HH:MM:SS.
 * @param {number} timeLeftMs - Оставшееся время в миллисекундах.
 * @returns {string} Форматированная строка времени.
 */
function formatTimeLeft(timeLeftMs) {
  if (timeLeftMs < 0) timeLeftMs = 0;
  const days = Math.floor(timeLeftMs / ONE_DAY);
  const hours = Math.floor((timeLeftMs % ONE_DAY) / ONE_HOUR);
  const minutes = Math.floor((timeLeftMs % ONE_HOUR) / ONE_MINUTE);
  const seconds = Math.floor((timeLeftMs % ONE_MINUTE) / ONE_SECOND);
  let output = "";
  if (days > 0) output += \`\${days.toString()}:\`;
  output += \`\${hours.toString().padStart(2, '0')}:\`;
  output += \`\${minutes.toString().padStart(2, '0')}:\`;
  output += \`\${seconds.toString().padStart(2, '0')}\`;
  return output;
}

/**
 * Скрывает целевые элементы из списка elementsToHide.
 */
function hideTargetElements() {
  elementsToHide.forEach(el => {
    if (el && el.style) {
      el.style.setProperty('display', 'none', 'important');
    } else if (el) {
         console.warn('[Countdown Timer] Не удалось применить стиль display:none к элементу для скрытия:', el);
    }
  });
  console.log('[Countdown Timer] Блоки для скрытия обработаны.');
}


/**
 * Показывает целевые элементы, удаляя классы, указанные в config.showClasses.
 */
function showTargetElements() {
    // Проверяем, есть ли вообще классы для показа/удаления
    if (!config.showClasses || config.showClasses.length === 0) return;

    // Строим селектор на основе классов, которые нужно показать
    // (эти же классы отвечают за display:none)
    const selector = config.showClasses.map(cls => '.' + cls.trim()).join(',');
    try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
           console.warn('[Countdown Timer] Блоки для показа с селектором "' + selector + '" не найдены.');
           return;
        }

        elements.forEach(el => {
          // Удаляем каждый класс из списка config.showClasses у найденного элемента
          config.showClasses.forEach(cls => {
             const className = cls.trim();
             if (el.classList.contains(className)) {
               el.classList.remove(className);
               console.log(\`[Countdown Timer] Removed hiding class '\${className}' from element:\`, el);
             }
          });
        });
        console.log('[Countdown Timer] Блоки для показа обработаны (удалением классов).');
    } catch (e) {
        console.error('[Countdown Timer] Ошибка при поиске или удалении классов для показа:', e);
    }
}

/**
 * Применяет все действия по завершении таймера.
 */
function handleTimerCompletion() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (!timerDisplayElement) return;

    timerDisplayElement.textContent = config.completionText || formatTimeLeft(0);
    hideTargetElements();
    showTargetElements(); // Теперь эта функция удаляет классы

    if (config.hideTimerOnEnd && timerDisplayElement.style) {
        timerDisplayElement.style.setProperty('display', 'none', 'important');
        console.log('[Countdown Timer] Элемент таймера скрыт.');
    }

    // Выполняем редирект, если указан путь
      if (config.redirectPath) {
          // Убедимся еще раз, что путь валиден (начинается с /)
          if (config.redirectPath.startsWith('/')) {
             const currentOrigin = window.location.origin; 
             const nextUrl = currentOrigin + config.redirectPath; // Собираем полный URL
             console.log('[Countdown Timer] Перенаправление на:', nextUrl);
             window.location.href = nextUrl; // Используем href для немедленного перехода
          } else {
               console.log('[Countdown Timer] Перенаправление на:', config.redirectPath);
              window.location.pathname = config.redirectPath;
             console.error('[Countdown Timer] Неверный формат пути для перенаправления (должен начинаться с /):', config.redirectPath);
          }
       }
}

/**
 * Обновляет отображение таймера и проверяет завершение.
 */
function updateTimerDisplay() {
  if (!timerDisplayElement) {
      if(intervalId) clearInterval(intervalId);
      return;
  }
  const now = Date.now();
  const timeLeft = targetTimestamp - now;

  if (timeLeft <= 0) {
    handleTimerCompletion();
    return;
  }
  timerDisplayElement.textContent = formatTimeLeft(timeLeft);
}


/**
 * Рассчитывает целевое время для фиксированного таймера.
 * @returns {number} Timestamp UTC или 0 при ошибке.
 */
function calculateFixedTargetTime() {
   if (!config.endDate || !config.endTime) {
      console.error('[Countdown Timer] Не указана дата или время для фиксированного таймера.');
      return 0;
    }
    const localEndTimeString = config.endDate + 'T' + config.endTime;
    const localEndDate = new Date(localEndTimeString);

    if (isNaN(localEndDate.getTime())) {
      console.error('[Countdown Timer] Неверный формат даты/времени:', localEndTimeString);
      return 0;
    }

    if (config.timezone === 'auto') {
      return localEndDate.getTime();
    } else {
      try {
        const targetOffsetMinutes = parseFloat(config.timezone) * 60;
        if (isNaN(targetOffsetMinutes)) {
            throw new Error('Неверное значение часового пояса: ' + config.timezone);
        }
        const year = localEndDate.getFullYear();
        const month = localEndDate.getMonth();
        const day = localEndDate.getDate();
        const hours = localEndDate.getHours();
        const minutes = localEndDate.getMinutes();
        const seconds = localEndDate.getSeconds();
        const assumedUtcTime = Date.UTC(year, month, day, hours, minutes, seconds);
        return assumedUtcTime - (targetOffsetMinutes * 60000);
      } catch (e) {
        console.error('[Countdown Timer] Ошибка при расчете времени для часового пояса:', e);
        return localEndDate.getTime() - (localEndDate.getTimezoneOffset() * 60000);
      }
    }
}

/**
   * Получает или рассчитывает целевое время для вечнозеленого таймера.
   * Всегда возвращает сохраненное время, если оно валидно, иначе рассчитывает новое.
   * @returns {number} Timestamp UTC или 0 при ошибке.
   */
  function calculateOrGetEvergreenTargetTime() {
      const storageKey = config.storageKey || 'taptopTimerEnd_' + config.displayClass;
      const now = Date.now();
      let targetTime = 0;

      try {
         const storedEndTime = localStorage.getItem(storageKey);
         const storedEndTimeParsed = storedEndTime ? parseInt(storedEndTime, 10) : NaN;

         if (!isNaN(storedEndTimeParsed)) {
           // Найдено валидное сохраненное время - ИСПОЛЬЗУЕМ ЕГО ВСЕГДА
           targetTime = storedEndTimeParsed;
           console.log(\`[Countdown Timer] Вечнозеленый: Найдено сохраненное время окончания: \${new Date(targetTime).toISOString()}\`);
           // Логика проверки "прошло или нет" будет в initializeTimer
         } else {
           // Валидное время не найдено (первый визит или LS очищен/поврежден) - Рассчитываем новое
           const durationMillis =
             (config.durationDays * ONE_DAY) +
             (config.durationHours * ONE_HOUR) +
             (config.durationMinutes * ONE_MINUTE) +
             (config.durationSeconds * ONE_SECOND);

           if (durationMillis <= 0) {
              console.error('[Countdown Timer] Вечнозеленый: Длительность должна быть больше нуля.');
              return 0; // Сигнал ошибки
           }

           targetTime = now + durationMillis;
           try {
              localStorage.setItem(storageKey, targetTime.toString());
              console.log(\`[Countdown Timer] Вечнозеленый: Установлено и сохранено новое время окончания: \${new Date(targetTime).toISOString()}\`);
           } catch (e) {
              console.warn('[Countdown Timer] Не удалось сохранить время в localStorage (возможно, отключено или переполнено):', e);
              // Используем рассчитанное время только для текущей сессии
           }
         }
      } catch (e) {
         console.error('[Countdown Timer] Ошибка при работе с localStorage:', e);
         // Фоллбек: если localStorage недоступен в принципе, работаем только на сессию
          const durationMillis =
             (config.durationDays * ONE_DAY) +
             (config.durationHours * ONE_HOUR) +
             (config.durationMinutes * ONE_MINUTE) +
             (config.durationSeconds * ONE_SECOND);
          if (durationMillis > 0) {
              targetTime = now + durationMillis;
              console.warn('[Countdown Timer] Вечнозеленый: localStorage недоступен, таймер работает только для текущей сессии.');
          } else {
              console.error('[Countdown Timer] Вечнозеленый: localStorage недоступен И длительность неверна.');
              return 0; // Сигнал ошибки
          }
      }
      // Возвращаем либо сохраненное (прошлое или будущее), либо только что рассчитанное
      return targetTime;
  }


/**
 * Инициализирует таймер.
 */
function initializeTimer() {
  timerDisplayElement = document.querySelector('.' + config.displayClass);
  elementsToHide = config.hideClasses.length > 0
      ? document.querySelectorAll(config.hideClasses.map(cls => '.' + cls.trim()).join(',')) // Добавил trim
      : [];
  // elementsToShow теперь не нужно искать здесь, они найдутся в showTargetElements

  if (!timerDisplayElement) {
    console.error('[Countdown Timer] Элемент для отображения таймера (' + config.displayClass + ') не найден!');
    return;
  }
   if (elementsToHide.length === 0 && config.hideClasses.length > 0) {
     console.warn('[Countdown Timer] Блоки для скрытия (' + config.hideClasses.join(', ') + ') не найдены.');
   }
   // Предупреждение о ненахождении показываемых блоков будет внутри showTargetElements

  if (config.timerType === 'fixed') {
    targetTimestamp = calculateFixedTargetTime();
  } else {
    targetTimestamp = calculateOrGetEvergreenTargetTime();
  }

  if (targetTimestamp <= 0) {
    console.error('[Countdown Timer] Не удалось рассчитать целевое время. Таймер не запущен.');
    timerDisplayElement.textContent = formatTimeLeft(0);
    return;
  }

  const now = Date.now();
  if (targetTimestamp <= now) {
    console.log('[Countdown Timer] Целевое время уже прошло, применяем конечные действия.');
    handleTimerCompletion();
  } else {
    updateTimerDisplay();
    intervalId = setInterval(updateTimerDisplay, ONE_SECOND);
    console.log('[Countdown Timer] Таймер запущен.');
  }
}

// --- Запуск инициализации ---
initializeTimer();

});
</script>
`;
  }
} // Конец класса CountdownTimerGenerator
