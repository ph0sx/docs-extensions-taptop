# Показ блоков по времени

Расширение позволяет управлять отображением и скрытием блоков на сайте в зависимости от времени суток, дня недели и даты. Можно создавать несколько правил с разными параметрами для гибкого управления контентом.

## Возможности расширения

Расширение позволяет гибко управлять видимостью любых блоков на сайте в зависимости от:

- Времени суток (с точностью до секунд)
- Дней недели
- Календарных дат
- Часовых поясов посетителей

## Генератор кода

<div id="time-visibility-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка показа блоков по времени</div>
    <div class="generator-subtitle">Создайте код для управления видимостью блоков на основе времени и дня недели</div>
  </div>
  
  <!-- Контейнер для правил -->
  <div id="rules-container">
    <!-- Правила будут добавляться динамически -->
  </div>
  
  <!-- Кнопка добавления нового правила -->
  <button id="add-rule-button" class="add-rule-button">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Добавить новое правило
  </button>
  
  <div class="action-section">
    <button id="generate-btn" class="generate-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="button-text">Сгенерировать код</span>
    </button>
  </div>
  
  <template id="rule-template">
    <div class="rule-card" data-rule-id=""> <!-- data-rule-id будет заполнен JS -->
      <div class="rule-header">
        <div class="rule-title">Правило <span class="rule-badge rule-number">1</span></div>
        <button class="remove-rule-button" type="button" aria-label="Удалить правило"> <!-- Добавлен type="button" -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="rule-body">
        <div class="settings-section">
          <div class="settings-section-title">Настройка блоков</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="block-classes-template">CSS классы блоков:</label> <!-- ID изменен для уникальности шаблона -->
              <input type="text" class="text-input block-classes" id="block-classes-template" name="block-classes" placeholder="promo-banner, sale-popup">
              <div class="helper-text">Укажите классы блоков через запятую (без точки)</div>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">Время показа</div>
          <div class="settings-row">
            <div class="setting-group">
              <label for="start-time-template">Время начала показа:</label>
              <input type="time" step="1" class="text-input start-time" id="start-time-template" name="start-time" value="00:00:00">
            </div>
            <div class="setting-group">
              <label for="end-time-template">Время окончания показа:</label>
              <input type="time" step="1" class="text-input end-time" id="end-time-template" name="end-time" value="23:59:59">
            </div>
            <div class="setting-group">
              <label for="timezone-template">Часовой пояс:</label>
              <select class="select-styled timezone-select" id="timezone-template" name="timezone">
                <option value="auto"  selected>Автоматически (часовой пояс посетителя)</option>
                <optgroup label="Россия и ближнее зарубежье">
                  <option value="2">UTC+2 (Калининград)</option>
                  <option value="3">UTC+3 (Москва)</option>
                  <option value="4">UTC+4 (Самара)</option>
                  <option value="5">UTC+5 (Екатеринбург)</option>
                  <option value="6">UTC+6 (Омск)</option>
                  <option value="7">UTC+7 (Красноярск)</option>
                  <option value="8">UTC+8 (Иркутск)</option>
                  <option value="9">UTC+9 (Якутск)</option>
                  <option value="10">UTC+10 (Владивосток)</option>
                  <option value="11">UTC+11 (Магадан)</option>
                  <option value="12">UTC+12 (Камчатка)</option>
                </optgroup>
                <optgroup label="Западное полушарие">
                  <option value="-12">UTC-12 (Линия перемены даты)</option>
                  <option value="-11">UTC-11 (о. Мидуэй)</option>
                  <option value="-10">UTC-10 (Гавайи)</option>
                  <option value="-9">UTC-9 (Аляска)</option>
                  <option value="-8">UTC-8 (Тихоокеанское время)</option>
                  <option value="-7">UTC-7 (Горное время)</option>
                  <option value="-6">UTC-6 (Центральное время)</option>
                  <option value="-5">UTC-5 (Восточное время)</option>
                  <option value="-4">UTC-4 (Атлантическое время)</option>
                  <option value="-3">UTC-3 (Буэнос-Айрес)</option>
                  <option value="-2">UTC-2 (Среднеатлантическое время)</option>
                  <option value="-1">UTC-1 (Азорские о-ва)</option>
                </optgroup>
                <optgroup label="Центральный регион">
                  <option value="0">UTC+0 (Лондон)</option>
                  <option value="1">UTC+1 (Берлин, Париж)</option>
                </optgroup>
                <optgroup label="Азия и Океания">
                  <option value="4">UTC+4 (Дубай)</option>
                  <!-- Примечание: Дробные часовые пояса обрабатываются parseFloat в JS -->
                  <option value="5.5">UTC+5:30 (Индия)</option>
                  <option value="8">UTC+8 (Китай, Сингапур)</option>
                  <option value="9">UTC+9 (Япония, Корея)</option>
                  <option value="9.5">UTC+9:30 (Центр. Австралия)</option>
                  <option value="10">UTC+10 (Вост. Австралия)</option>
                  <option value="12">UTC+12 (Новая Зеландия)</option>
                  <option value="13">UTC+13 (Самоа)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">Дни недели</div>
          <div class="weekday-container">
            <!-- Понедельник -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox monday-checkbox" id="monday-rule_id" name="weekday-monday">
              <label class="weekday-label" for="monday-rule_id">Пн</label>
            </div>
            <!-- Вторник -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox tuesday-checkbox" id="tuesday-rule_id" name="weekday-tuesday">
              <label class="weekday-label" for="tuesday-rule_id">Вт</label>
            </div>
            <!-- Среда -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox wednesday-checkbox" id="wednesday-rule_id" name="weekday-wednesday">
              <label class="weekday-label" for="wednesday-rule_id">Ср</label>
            </div>
            <!-- Четверг -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox thursday-checkbox" id="thursday-rule_id" name="weekday-thursday">
              <label class="weekday-label" for="thursday-rule_id">Чт</label>
            </div>
            <!-- Пятница -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox friday-checkbox" id="friday-rule_id" name="weekday-friday">
              <label class="weekday-label" for="friday-rule_id">Пт</label>
            </div>
            <!-- Суббота -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox saturday-checkbox" id="saturday-rule_id" name="weekday-saturday">
              <label class="weekday-label" for="saturday-rule_id">Сб</label>
            </div>
            <!-- Воскресенье -->
            <div class="weekday-item">
              <input type="checkbox" class="weekday-checkbox sunday-checkbox" id="sunday-rule_id" name="weekday-sunday">
              <label class="weekday-label" for="sunday-rule_id">Вс</label>
            </div>
          </div>
          <div class="helper-text">Если не выбран ни один день, блок будет показываться ежедневно</div>
        </div>
        <div class="settings-row" style="margin-top: 20px;">
          <div class="setting-group">
            <label class="checkbox-container">
              <input type="checkbox" class="hide-after-date hide-after-date-toggle" name="hide-after-date-toggle">
              <span class="checkmark"></span>
              <span class="checkbox-option-label">Скрыть блок после определенной даты и времени <strong>(навсегда)</strong></span>
            </label>
          </div>
        </div>
        <!-- Секция скрытия по дате (видимость управляется JS) -->
        <div class="hide-date-section" style="display: none;">
          <div class="hide-date-row">
            <div class="hide-date-field">
              <label for="hide-date-template">Дата скрытия:</label>
              <input type="date" class="text-input hide-date" id="hide-date-template" name="hide-date">
              <div class="helper-text">После наступления указанной даты и времени блок будет скрыт навсегда.</div>
            </div>
            <div class="hide-date-field">
              <label for="hide-time-template">Время скрытия:</label>
              <input type="time" step="1" class="text-input hide-time" id="hide-time-template" name="hide-time" value="23:59:59">
              <div class="helper-text">Точное время скрытия блока</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </template>
  
  <!-- Скрытый элемент для хранения сгенерированного кода -->
  <div id="js-code" style="display: none;"></div>
  
  <!-- Модальное окно -->
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
          <li>Откройте настройки страницы в Taptop</li>
          <li>В блоке <strong>"Перед тегом body"</strong> вставьте сгенерированный код</li>
          <li>Сохраните изменения на странице</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

## Установка на сайт

<div class="step-box">
<h3>Шаг 1: Подготовьте блоки на странице</h3>
<ul>
<li>В редакторе Taptop выберите блок, который хотите отображать по расписанию.</li>
<li>Присвойте ему уникальный CSS-класс (например, <code>promo-banner</code> или <code>sale-popup</code>).</li>
</ul>

<div class="img-block">
<img src="./images/time-visibility/add-class.png" >
<p class="img-block-text">Пример добавления класса к блоку</p>
</div>
</div>
<div class="step-box">
<h3>Шаг 2: Настройте правила показа блоков</h3>
<p>В генераторе кода создайте необходимые правила:</p>
<ol>
<li>Для каждого правила укажите CSS-классы блоков, к которым оно будет применяться</li>
<div class="img-block">
<img src="./images/time-visibility/add-classes.png" >
</div>
<li>Настройте время начала и окончания показа с точностью до секунд</li>
<div class="img-block">
<img src="./images/time-visibility/time.png" >
</div>
<li>Выберите подходящий часовой пояс из расширенного списка</li>
<div class="img-block">
<img src="./images/time-visibility/timezone.png" >
</div>
<li>Отметьте дни недели, в которые нужно показывать блоки</li>
<div class="img-block">
<img src="./images/time-visibility/weekdays.png" >
</div>
<li>При необходимости включите автоматическое скрытие после определенной даты и времени</li>
<div class="img-block">
<img src="./images/time-visibility/hideblock.png" >
</div>
<li>Если нужно создать дополнительное правило с другими настройками — нажмите "Добавить новое правило"</li>
<div class="img-block">
<img src="./images/time-visibility/add-rule.png" >
</div>
</ol>

<p><em>Примечание: Для каждого правила можно указать несколько CSS-классов через запятую. Если не выбран ни один день недели, блок будет показываться ежедневно.</em></p>
</div>

<div class="step-box">
<h3>Шаг 3: Сгенерируйте и скопируйте код</h3>

<p>Нажмите кнопку <strong>"Сгенерировать код"</strong>. Код автоматически скопируется в буфер обмена.</p>
</div>

<div class="step-box">
<h3>Шаг 4: Вставьте код на сайт</h3>

<ol>
<li>Откройте настройки страницы в Taptop</li>
<li>В блоке <strong>"Перед тегом body"</strong> вставьте сгенерированный код</li>
</ol>

<div class="img-block">
<img src="./images/cookie/page-settings.png" >
</div>

<p>Сохраните изменения на странице.</p>
</div>

## Примеры использования

<div class="important-note t-vs">
<h3>Пример 1: Утренняя и вечерняя акции</h3>
<p>Вы хотите показывать разные баннеры утром и вечером в будние дни.</p>

<p><strong>Правило 1:</strong></p>
<ul >
<li ><strong>CSS-классы блоков:</strong> <code>morning-offer</code></li>
<li ><strong>Время показа:</strong> с 07:00:00 до 12:00:00</li>
<li ><strong>Дни недели:</strong> Понедельник, Вторник, Среда, Четверг, Пятница</li>
</ul>

<p><strong>Правило 2:</strong></p>
<ul>
<li ><strong>CSS-классы блоков:</strong> <code>evening-offer</code></li>
<li ><strong>Время показа:</strong> с 18:00:00 до 23:00:00</li>
<li ><strong>Дни недели:</strong> Понедельник, Вторник, Среда, Четверг, Пятница</li>
</ul>

<p>Таким образом, утренний баннер будет показываться с 7:00 до 12:00, а вечерний — с 18:00 до 23:00 только по будням.</p>
</div>

<div class="important-note t-vs">
<h3>Пример 2: Новогодняя акция с обратным отсчетом</h3>
<p>Вы хотите показывать новогоднюю акцию до определенного момента, а затем скрыть ее.</p>

<ul>
<li><strong>CSS-классы блоков:</strong> <code>new-year-promo, countdown-timer</code></li>
<li><strong>Скрытие по дате:</strong> Включено</li>
<li><strong>Дата скрытия:</strong> 01-01-2026</li>
<li><strong>Время скрытия:</strong> 00:00:00</li>
</ul>

<p>С наступлением Нового года акция и таймер обратного отсчета автоматически исчезнут.</p>
</div>

<div class="important-note t-vs">
<h3>Пример 3: Международный сайт с разными часовыми поясами</h3>
<p>У вас сайт с международной аудиторией, и вы хотите показывать предложения в рабочее время для разных регионов.</p>

<p><strong>Правило 1 (для Европы):</strong></p>
<ul>
<li><strong>CSS-классы блоков:</strong> <code>europe-offer</code></li>
<li><strong>Время показа:</strong> с 09:00:00 до 18:00:00</li>
<li><strong>Часовой пояс:</strong> UTC+1 (Берлин, Париж)</li>
<li><strong>Дни недели:</strong> Понедельник - Пятница</li>
</ul>

<p><strong>Правило 2 (для США):</strong></p>
<ul>
<li><strong>CSS-классы блоков:</strong> <code>usa-offer</code></li>
<li><strong>Время показа:</strong> с 09:00:00 до 18:00:00</li>
<li><strong>Часовой пояс:</strong> UTC-5 (Восточное время)</li>
<li><strong>Дни недели:</strong> Понедельник - Пятница</li>
</ul>

<p>Каждый посетитель увидит релевантное предложение в рабочее время своего региона.</p>
</div>

!>**ВАЖНО!** Точное время на странице определяется браузером посетителя, поэтому убедитесь, что используете правильный часовой пояс для вашей целевой аудитории.
