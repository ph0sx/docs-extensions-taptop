# Анимированный счетчик

Это расширение позволяет добавить на страницу анимированный счетчик чисел, который эффектно отображает статистику, важные показатели или просто создает динамический эффект увеличения/уменьшения числовых значений. Расширение поддерживает два режима анимации: **классический плавный счет** и **эффект "Одометра"** с перелистыванием отдельных цифр.

**1. Классический счётчик**

  <div class="img-block">
      <video autoplay muted loop playsinline>
        <source src="./assets/videos/counter/counter-usual.mov" type="video/mp4">
        Ваш браузер не поддерживает видео.
      </video>  
  </div>

**2. Счётчик с эффектом "одометра"**

  <div class="img-block">
      <video autoplay muted loop playsinline>
        <source src="./assets/videos/counter/counter-odometer.mov" type="video/mp4">
        Ваш браузер не поддерживает видео.
      </video>  
  </div>

---

## Подготовка в Taptop

1. **Создайте элемент для счетчика:** Добавьте на страницу Taptop текстовый блок (`Text Block`) или любой другой элемент (`Div Block`), в котором должен будет отображаться счетчик. Вы можете вписать в текстовый блок начальное значение счетчика (например, "0") или оставить его пустым. Скрипт заменит это значение в процессе анимации.
2. **Присвойте CSS-класс:** Выделите этот элемент и в панели стилей присвойте ему **уникальный CSS-класс**. Например, `profit-counter`. Этот класс вы укажете в настройках генератора ниже.
   - Если вы планируете использовать несколько счетчиков с разными настройками на одной странице, каждому из них потребуется свой уникальный CSS-класс.
3. **Стилизация:** Настройте внешний вид (шрифт, размер, цвет, выравнивание) этого элемента стандартными средствами Taptop. Скрипт будет анимировать только числовое значение внутри.

---

## Генератор кода

<div id="counter-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка счетчика</div>
    <div class="generator-subtitle">Более подробное описание каждого параметра - под генератором</div>
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
              <div class="label-with-tooltip">
                <label for="counter-target-class-template">CSS-класс целевого элемента <span class="required-indicator">*</span></label>
                <span class="tooltip-icon" data-tooltip="Укажите CSS-класс элемента на вашей странице Taptop, в котором должен отображаться этот счетчик. Вводите только имя класса, без точки (.). Например: profit-counter.">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
                </span>
              </div>
              <input type="text" class="text-input counter-target-class" id="counter-target-class-template" name="targetClass" placeholder="Например: my-counter" required>
              <div class="helper-text">Класс элемента, где будет счетчик.</div>
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-start-value-template">Начальное значение</label>
              <input type="number" class="number-input counter-start-value" id="counter-start-value-template" name="startValue" value="0">
              <div class="helper-text">Число, с которого начнется анимация.</div>
            </div>
            <div class="setting-group">
              <label for="counter-end-value-template">Конечное значение <span class="required-indicator">*</span></label>
              <input type="number" class="number-input counter-end-value" id="counter-end-value-template" name="endValue" value="1000" required>
              <div class="helper-text">Число, на котором анимация остановится.</div>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">2. Анимация</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-duration-template">Длительность анимации (мс)</label>
              <input type="number" class="number-input counter-duration" id="counter-duration-template" name="duration" value="2000" min="0" step="100">
              <div class="helper-text">Время в миллисекундах. 1000мс = 1 секунда.</div>
            </div>
            <div class="setting-group">
              <label for="counter-delay-template">Задержка перед стартом (мс)</label>
              <input type="number" class="number-input counter-delay" id="counter-delay-template" name="delay" value="0" min="0" step="100">
              <div class="helper-text">Пауза перед началом анимации в миллисекундах.</div>
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group counter-easing-group">
                 <div class="label-with-tooltip">
                    <label for="counter-easing-template">Функция плавности</label>
                    <span class="tooltip-icon" data-tooltip="Определяет характер ускорения/замедления анимации. Недоступно при включенном 'Эффекте Одометра'.">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
                    </span>
                </div>
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
               <div class="helper-text">Шпаргалка по функциям плавности: <a target="_blank" href="https://easings.net/ru">https://easings.net/ru</a></div>
            </div>
            <div class="setting-group"> </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">3. Форматирование и отображение</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="counter-prefix-template">Текстовый префикс</label>
              <input type="text" class="text-input counter-prefix" id="counter-prefix-template" name="prefix" placeholder="Например: $ или +">
              <div class="helper-text">Текст, отображаемый перед числом.</div>
            </div>
            <div class="setting-group">
              <label for="counter-suffix-template">Текстовый суффикс</label>
              <input type="text" class="text-input counter-suffix" id="counter-suffix-template" name="suffix" placeholder="Например: + или %">
              <div class="helper-text">Текст, отображаемый после числа.</div>
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group">
              <div class="label-with-tooltip">
                <label for="counter-decimals-template">Количество десятичных знаков</label>
                <span class="tooltip-icon" data-tooltip="От 0 до 5. При 'Эффекте Одометра' анимируется только целая часть числа, дробная часть отображается статически.">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
                </span>
              </div>
              <input type="number" class="number-input counter-decimals" id="counter-decimals-template" name="decimals" value="0" min="0" max="5" step="1">
              <div class="helper-text">Сколько знаков показывать после точки.</div>
            </div>
            <div class="setting-group">
              <label class="checkbox-container" style="margin-top: 28px;"> <input type="checkbox" class="counter-use-separator" name="useThousandsSeparator">
                <span class="checkmark"></span>
                <span class="checkbox-option-label">Использовать разделитель тысяч</span>
              </label>
              <div class="helper-text" style="margin-left: 35px;">Разделяет группы разрядов для лучшей читаемости.</div>
            </div>
          </div>
          <div class="settings-row counter-separator-symbol-row" style="display: none;">
            <div class="setting-group">
              <label for="counter-separator-symbol-template">Символ разделителя тысяч</label>
              <select class="select-styled counter-separator-symbol" id="counter-separator-symbol-template" name="thousandsSeparator">
                <option value="," selected>Запятая (,)</option>
                <option value="&#32;">Пробел ( )</option>
                <option value=".">Точка (.)</option>
              </select>
              <div class="helper-text">Выберите символ для разделения.</div>
            </div>
            <div class="setting-group"> </div>
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
              <div class="helper-text" style="margin-left: 35px;">Анимация начнется, когда счетчик станет виден на экране.</div>
            </div>
            <div class="setting-group">
              <label class="checkbox-container">
                <input type="checkbox" class="counter-loop" name="loop">
                <span class="checkmark"></span>
                <span class="checkbox-option-label">Повторять анимацию (циклично)</span>
              </label>
              <div class="helper-text" style="margin-left: 35px;">Анимация будет бесконечно повторяться.</div>
            </div>
          </div>
          <div class="settings-row">
            <div class="setting-group">
                <div class="label-with-tooltip">
                    <label class="checkbox-container">
                        <input type="checkbox" class="counter-odometer-effect" name="odometerEffect">
                        <span class="checkmark"></span>
                        <span class="checkbox-option-label">Эффект "Одометра" (прокрутка цифр)</span>
                    </label>
                    <span class="tooltip-icon" data-tooltip="Опция 'Функция плавности' при этом отключается.">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
                    </span>
                </div>
                <div class="helper-text" style="margin-left: 35px;">Создает эффект перелистывания отдельных цифр. Может не сочетаться с некоторыми шрифтами, если символы сильно различаются по ширине.</div>
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
            <li>Откройте настройки страницы в Taptop (иконка шестеренки).</li>
            <li>В блоке <strong>"Перед тегом body"</strong> вставьте сгенерированный код.</li>
            <div class="img-block">
              <img src="./images/cookie/page-settings.png" >
            </div>
                    <li>Сохраните настройки и опубликуйте страницу.</li>
          </ol>
        </div>
        <button class="close-button">Понятно</button>
      </div>
    </div>
</div>

---

## Описание настроек генератора

Каждое "правило" в генераторе позволяет вам гибко настроить поведение и внешний вид одного или нескольких счетчиков на вашей странице. Под каждый счётчик - своё правило.

### 1. Целевой элемент и значения

Эта секция определяет, к какому HTML-элементу на вашей странице Taptop будет применен счетчик, и числовые рамки анимации.

- **CSS-класс целевого элемента:**
  Это CSS-класс (или несколько классов, перечисленных через запятую), который вы должны предварительно присвоить нужному элементу в редакторе Taptop. Скрипт найдет этот элемент по указанному классу и превратит его в анимированный счетчик. Введите имя класса точно так, как оно указано в Taptop.

- **Начальное значение:**
  Это число, с которого начнется анимация счетчика при его запуске. Обычно устанавливается в `0` для анимации "с нуля". Но вы можете задать любое число, если хотите, чтобы счетчик стартовал, например, с уже существующего значения.

- **Конечное значение:**
  Число, на котором анимация счетчика остановится (если не включен циклический режим).

### 2. Анимация

Здесь настраивается динамика и характер движения цифр.

- **Длительность анимации (мс):**
  Общее время, за которое счетчик пройдет путь от начального до конечного значения. Указывается в миллисекундах (1000мс = 1 секунда). Подберите значение, которое выглядит естественно для вашей задачи. Слишком быстрая анимация может быть незаметной, слишком медленная – утомительной.

- **Задержка перед стартом (мс):**
  Пауза в миллисекундах перед тем, как анимация фактически начнется после выполнения условия запуска (например, появления в области видимости). Полезна, если нужно синхронизировать старт нескольких анимаций или дать пользователю время сфокусироваться на элементе.

- **Функция плавности:**
  Определяет математическую модель ускорения и замедления анимации. Разные функции создают разные "ощущения" от движения цифр (например, плавное начало и конец, резкое ускорение и т.д.). Выберите из выпадающего списка. `Ease Out Quad` (стандартная) обычно дает приятный эффект замедления к концу. Эта опция **недоступна и не применяется**, если включен "Эффект Одометра".

Шпаргалка по функциям плавности: <a target="_blank" href="https://easings.net/ru">https://easings.net/ru</a>

  <div class="img-block">
      <img src="./images/counter/animations.png" >
      <p class="img-block-text">Примеры функций плавности</p>
    </div>

### 3. Форматирование и отображение

Эти настройки отвечают за внешний вид самого числа и дополнительных символов.

- **Текстовый префикс:**
  Символы или текст, которые будут отображаться непосредственно _перед_ анимированным числом.
  Полезно для указания валюты, знаков "плюс" или "минус", или других обозначений.

  - _Пример:_ `$`, `+`, `около`

     <div class="img-block">
      <img src="./images/counter/prefix.png">
      <p class="img-block-text">Префикс (слева)</p>
     </div>

- **Текстовый суффикс:**
  Символы или текст, которые будут отображаться непосредственно _после_ анимированного числа. Часто используется для знака процента, единиц измерения, символа "+".

  - _Пример:_ `%`, `клиентов`, `+`

     <div class="img-block">
      <img src="./images/counter/suffix.png" >
        <p class="img-block-text">Суффикс (справа) с указанием валюты</p>
    </div>

- **Количество десятичных знаков:**
  Определяет, сколько цифр будет отображаться после десятичной точки. Доступны значения от 0 (целое число) до 5. Установите `0` для целых чисел. Для денежных сумм часто используют `2`. В режиме одометра анимируется только целая часть числа. Дробная часть будет отображена статически (не перелистываясь).

 <div class="img-block">
          <img src="./images/counter/decimal.png" >
          <p class="img-block-text">Десятичные знаки разделяются точкой.</p>
        </div>

- **Использовать разделитель тысяч:**
  Позволяет автоматически разделять группы разрядов в больших числах (например, "1 000 000" вместо "1000000") для улучшения читаемости.

- **Символ разделителя тысяч:**
  Поле появляется, если включена опция "Использовать разделитель тысяч". Позволяет выбрать, какой символ будет использоваться для разделения групп разрядов.
  - _Варианты:_
    - Запятая (`,`) -> `1,000,000`
    - Пробел (` `) -> `1 000 000`
    - Точка (`.`) -> `1.000.000`

 <div class="img-block">
              <img src="./images/counter/separator.png" >
              <p class="img-block-text">Разделитель - запятая</p>
            </div>

### 4. Поведение

Здесь настраиваются условия запуска и повторения анимации.

- **Запуск при появлении в области видимости:**
  Если опция включена, анимация счетчика начнется только тогда, когда сам элемент счетчика станет видимым на экране пользователя (например, при прокрутке страницы до него). Рекомендуется оставлять включенной для большинства случаев, чтобы анимация не проигрывалась "вхолостую" за пределами видимой области. Если опцию отключить, анимация начнется сразу после загрузки страницы (и истечения "Задержки перед стартом", если она указана).

- **Повторять анимацию (циклично):**
  Если опция включена, после того как счетчик достигнет "Конечного значения", он автоматически сбросится на "Начальное значение", и анимация начнется заново. Это будет происходить бесконечно с небольшой паузой между циклами. Полезно для демонстрационных целей или если нужно постоянно привлекать внимание к какому-то показателю. В большинстве случаев для отображения статистики эту опцию оставляют выключенной.

- **Эффект "Одометра" (прокрутка цифр):**
Включает продвинутый режим анимации, имитирующий механический одометр, где каждая цифра визуально "перелистывается" до своего нового значения.

  <div class="img-block">
     <video autoplay muted loop playsinline>
       <source src="./assets/videos/counter/counter-odometer.mov" type="video/mp4">
       Ваш браузер не поддерживает видео.
     </video>  
     <p class="img-block-text">Эффект Одометра</p>
 </div>
