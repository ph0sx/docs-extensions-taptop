# Анимированный счетчик (Counter)

Это расширение позволяет добавить на страницу анимированный счетчик чисел, который эффектно отображает статистику или важные показатели.

---

## Подготовка в Taptop

1.  **Создайте элемент для счетчика:** Добавьте на страницу Taptop текстовый блок (`Text Block`) или любой другой элемент (`Div Block`), в котором должен будет отображаться счетчик.
2.  **Присвойте CSS-класс:** Выделите этот элемент и в панели стилей присвойте ему **уникальный CSS-класс**. Например, `my-stat-counter-1`. Этот класс вы укажете в настройках генератора ниже.
    - Если вы планируете использовать несколько счетчиков с разными настройками на одной странице, каждому из них потребуется свой уникальный CSS-класс.
3.  **Начальное значение (опционально):** Вы можете вписать в текстовый блок начальное значение счетчика (например, "0") или оставить его пустым. Скрипт заменит это значение в процессе анимации.
4.  **Стилизация:** Настройте внешний вид (шрифт, размер, цвет, выравнивание) этого элемента стандартными средствами Taptop. Скрипт будет анимировать только числовое значение внутри.

---

## Генератор кода

<div id="counter-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка счетчика</div>
    <div class="generator-subtitle">Создайте анимированный счетчик для вашего сайта.</div>
  </div>

  <div id="counter-rules-container">
    </div>

  <button id="counter-add-rule-button" class="add-rule-button">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Добавить правило счетчика
  </button>

  <template id="counter-rule-template">
    <div class="rule-card counter-rule-card" data-rule-id="">
      <div class="rule-header">
        <div class="rule-title">
          Счетчик <span class="rule-badge rule-number">1</span>
        </div>
        <button class="remove-rule-button" type="button" aria-label="Удалить правило">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="rule-body">
        <div class="settings-section">
          <div class="settings-section-title">1. Целевой элемент и значения</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-target-class-template">CSS-класс целевого элемента <span class="required-indicator">*</span></label>
              <input type="text" class="text-input counter-target-class" id="counter-target-class-template" name="targetClass" placeholder="Например: my-counter" required>
              <div class="helper-text">Укажите класс элемента, где будет счетчик. Без точки.</div>
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-start-value-template">Начальное значение</label>
              <input type="number" class="number-input counter-start-value" id="counter-start-value-template" name="startValue" value="0">
            </div>
            <div class="setting-group">
              <label for="counter-end-value-template">Конечное значение <span class="required-indicator">*</span></label>
              <input type="number" class="number-input counter-end-value" id="counter-end-value-template" name="endValue" value="1000" required>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">2. Анимация</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-duration-template">Длительность анимации (мс)</label>
              <input type="number" class="number-input counter-duration" id="counter-duration-template" name="duration" value="2000" min="0" step="100">
              <div class="helper-text">Время в миллисекундах. 1000мс = 1с.</div>
            </div>
            <div class="setting-group">
              <label for="counter-delay-template">Задержка перед стартом (мс)</label>
              <input type="number" class="number-input counter-delay" id="counter-delay-template" name="delay" value="0" min="0" step="100">
            </div>
          </div>
             <div class="settings-row">
    <div class="setting-group counter-easing-group"> <label for="counter-easing-template">Функция плавности</label>
      <select class="select-styled counter-easing" id="counter-easing-template" name="easing">
        <option value="easeOutQuad" selected>Ease Out Quad (стандарт)</option>
        <option value="linear">Linear</option>
        <option value="easeInQuad">Ease In Quad</option>
        <option value="easeInOutQuad">Ease In Out Quad</option>
        <option value="easeInCubic">Ease In Cubic</option>
        <option value="easeOutCubic">Ease Out Cubic</option>
        <option value="easeInOutCubic">Ease In Out Cubic</option>
        <option value="easeInQuart">Ease In Quart</option>
        <option value="easeOutQuart">Ease Out Quart</option>
        <option value="easeInOutQuart">Ease In Out Quart</option>
        <option value="easeInQuint">Ease In Quint</option>
        <option value="easeOutQuint">Ease Out Quint</option>
        <option value="easeInOutQuint">Ease In Out Quint</option>
        <option value="easeInSine">Ease In Sine</option>
        <option value="easeOutSine">Ease Out Sine</option>
        <option value="easeInOutSine">Ease In Out Sine</option>
        <option value="easeInExpo">Ease In Expo</option>
        <option value="easeOutExpo">Ease Out Expo</option>
        <option value="easeInOutExpo">Ease In Out Expo</option>
        <option value="easeInCirc">Ease In Circ</option>
        <option value="easeOutCirc">Ease Out Circ</option>
        <option value="easeInOutCirc">Ease In Out Circ</option>
      </select>
    </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">3. Форматирование и отображение</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-prefix-template">Текстовый префикс</label>
              <input type="text" class="text-input counter-prefix" id="counter-prefix-template" name="prefix" placeholder="Например: $ или +">
            </div>
            <div class="setting-group">
              <label for="counter-suffix-template">Текстовый суффикс</label>
              <input type="text" class="text-input counter-suffix" id="counter-suffix-template" name="suffix" placeholder="Например: + или %">
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-decimals-template">Количество десятичных знаков</label>
              <input type="number" class="number-input counter-decimals" id="counter-decimals-template" name="decimals" value="0" min="0" max="5" step="1">
            </div>
             <div class="setting-group">
              <label class="checkbox-container">
                <input type="checkbox" class="counter-use-separator" name="useThousandsSeparator">
                <span class="checkmark"></span>
                <span class="checkbox-option-label">Использовать разделитель тысяч</span>
              </label>
            </div>
          </div>
          <div class="settings-row counter-separator-symbol-row" style="display: none;"> <div class="setting-group">
              <label for="counter-separator-symbol-template">Символ разделителя тысяч</label>
              <select class="select-styled counter-separator-symbol" id="counter-separator-symbol-template" name="thousandsSeparator">
                <option value="," selected>Запятая (,)</option>
                <option value="&#32;">Пробел ( )</option> <option value=".">Точка (.)</option>
              </select>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">4. Поведение</div>
          <div class="settings-row">
            <div class="setting-group">
              <label class="checkbox-container">
                <input type="checkbox" class="counter-play-on-view" name="playOnView" checked>
                <span class="checkmark"></span>
                <span class="checkbox-option-label">Запуск при появлении в области видимости</span>
              </label>
            </div>
            <div class="setting-group">
              <label class="checkbox-container">
                <input type="checkbox" class="counter-loop" name="loop">
                <span class="checkmark"></span>
                <span class="checkbox-option-label">Повторять анимацию (циклично)</span>
              </label>
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group">
                <label class="checkbox-container">
                    <input type="checkbox" class="counter-odometer-effect" name="odometerEffect" checked>
                    <span class="checkmark"></span>
                    <span class="checkbox-option-label">Эффект "Одометра" (прокрутка цифр)</span>
                </label>
                <div class="helper-text">Создает эффект перелистывания отдельных цифр. Может не сочетаться с некоторыми шрифтами, если символы сильно различаются по ширине.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <div class="action-section">
    <button id="generate-btn" class="generate-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="button-text">Сгенерировать код</span>
    </button>
  </div>

  <div id="success-modal" class="modal">
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <div class="modal-header">
        <div class="success-icon">✓</div>
        <h3>Код успешно скопирован!</h3>
      </div>
      <div class="instruction-block">
        <h4>Инструкция по подключению:</h4>
        <ol>
          <li>На странице Taptop создайте текстовый блок (или любой другой элемент), который будет служить контейнером для счетчика.</li>
          <li>Присвойте этому элементу CSS-класс(ы), указанный(ые) в настройках выше.</li>
          <li>Откройте настройки страницы в Taptop (иконка шестеренки).</li>
          <li>В блоке <strong>"Перед тегом `</body>`"</strong> (или "Custom code" -> "Body end") вставьте сгенерированный код.</li>
          <li>Опубликуйте страницу.</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

---

## Примеры использования

### Пример 1: Простая статистика

- **Задача:** Показать количество выполненных проектов - "1250+".
- **Подготовка в Taptop:** Создайте текстовый блок, задайте ему класс `completed-projects`.
- **Настройки генератора (для одного правила):**
  - CSS-класс: `completed-projects`
  - Начальное значение: `0`
  - Конечное значение: `1250`
  - Длительность: `2500` мс
  - Суффикс: `+`
  - Остальные настройки по умолчанию.

### Пример 2: Денежный счетчик

- **Задача:** Отобразить сумму сэкономленных средств "$ 27,530.50".
- **Подготовка в Taptop:** Текстовый блок с классом `savings-counter`.
- **Настройки генератора (для одного правила):**
  - CSS-класс: `savings-counter`
  - Начальное значение: `0`
  - Конечное значение: `27530.50`
  - Длительность: `3000` мс
  - Префикс: `$` (с пробелом после, если нужно: `$ `)
  - Количество десятичных знаков: `2`
  - Использовать разделитель тысяч: `✓` (включено)
  - Символ разделителя: `Запятая (, )`

### Пример 3: Несколько счетчиков на странице

- **Задача:** Показать "Проектов: 500", "Клиентов: 85", "Наград: 12".
- **Подготовка в Taptop:**
  - Текстовый блок с классом `stat-projects`.
  - Текстовый блок с классом `stat-clients`.
  - Текстовый блок с классом `stat-awards`.
- **Настройки генератора:**
  - **Правило 1:**
    - CSS-класс: `stat-projects`
    - Конечное значение: `500`
    - Суффикс: ` Проектов` (с начальным пробелом)
  - **Правило 2 (добавить через кнопку "Добавить правило"):**
    - CSS-класс: `stat-clients`
    - Конечное значение: `85`
    - Суффикс: ` Клиентов`
  - **Правило 3:**
    - CSS-класс: `stat-awards`
    - Конечное значение: `12`
    - Суффикс: ` Наград`
  - Общие настройки длительности, задержки и т.д. можно оставить по умолчанию или настроить для каждого правила индивидуально (если UI позволит это в будущем; пока они общие для всех правил из одного скрипта, если не переопределять сам скрипт). _Примечание: текущий план генерирует одну конфигурацию на один класс, так что для разных настроек анимации нужны разные правила/классы._

---

## Решение возможных проблем

- **Счетчик не появляется / не анимируется:**
  - **Проверьте CSS-класс:** Убедитесь, что класс, указанный в генераторе, **в точности совпадает** с классом, назначенным элементу в Taptop (без точки, регистр важен).
  - **Код вставлен правильно?** Проверьте, что сгенерированный `<script>` вставлен в настройки страницы Taptop в блок **"Перед тегом `</body>`"**.
  - **Ошибки в консоли:** Откройте консоль браузера (F12 -> Console) на опубликованной странице. Нет ли там ошибок, связанных со скриптом счетчика?
  - **Значения:** Убедитесь, что "Конечное значение" корректно и является числом.
- **Стилизация не применяется:**
  - Стили (шрифт, цвет, размер) настраиваются **непосредственно для элемента с вашим CSS-классом** в редакторе Taptop. Скрипт отвечает только за анимацию числа и добавление префикса/суффикса.
  - Если вы используете эффект "Одометра", очень специфичные шрифты с сильно отличающейся шириной символов могут выглядеть неидеально при "перелистывании".
- **Эффект одометра не работает / выглядит странно:**
  - Убедитесь, что опция "Эффект 'Одометра'" включена в генераторе.
  - Скрипт добавляет минимальные необходимые стили для работы одометра. Если у вас есть глобальные CSS-правила, которые могут конфликтовать (например, с `overflow` или `line-height` для `span` внутри целевого элемента), это может повлиять на отображение.
