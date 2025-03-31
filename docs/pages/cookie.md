# Cookie

Это расширение позволяет сохранить выбор пользователя о согласии на обработку cookie.

## Как работает расширение

1. **Первичный визит:**  
   При первом посещении сайта пользователю отображается всплывающее окно с запросом согласия на обработку cookie.

2. **Действие пользователя:**  
   Пользователь может согласиться или отказаться от обработки cookie.

3. **Повторные визиты:**  
   Если пользователь уже сделал выбор, всплывающее окно не появляется повторно до истечения заданного срока хранения cookie.

## Генератор кода

<div id="cookie-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройте параметры согласия на cookie</div>
    <div class="generator-subtitle">Создайте код для информирования пользователей о cookie на вашем сайте</div>
  </div>
  
  <div class="cookie-form-grid">
    <div class="cookie-settings-row settings-row">
      <div class="cookie-setting-group setting-group">
        <label for="expiry-days">Срок хранения выбора пользователя (дни):</label>
        <input type="number" id="expiry-days" class="text-input" value="30" min="1">
        <div class="helper-text">Определяет, как долго будет храниться выбор пользователя в браузере</div>
      </div>
      <div class="setting-group">
        <label for="popup-class">CSS-класс всплывающего окна:</label>
        <input type="text" id="popup-class" class="text-input" value="popup-cookie">
        <div class="helper-text">Класс блока с уведомлением о cookie</div>
      </div>
    </div>
    <div class="cookie-settings-row settings-row">
      <div class="cookie-setting-group setting-group">
        <label for="consent-btn-class">CSS-класс кнопки согласия:</label>
        <input type="text" id="consent-btn-class" class="text-input" value="button-cookie">
        <div class="helper-text">Класс кнопки "Принять" или "Согласен"</div>
      </div>
      <div class="setting-group">
        <label for="reject-btn-class">CSS-класс кнопки отказа:</label>
        <input type="text" id="reject-btn-class" class="text-input" value="button-no-cookie">
        <div class="helper-text">Класс кнопки "Отклонить" или "Отказаться"</div>
      </div>
    </div>

  </div>
  
  <div class="action-section">
    <button id="generate-btn" class="generate-button">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      <span class="button-text">Сгенерировать код</span>
    </button>
  </div>

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
          <li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
          <li>Сохраните изменения на странице</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

## Установка на сайт

<div class="step-box">
<h3>Шаг 1: Назначьте CSS-классы элементам попапа</h3>

<p>В интерфейсе <strong>Taptop</strong> задайте следующие классы:</p>

<ul>
<li><strong>Всплывающее окно:</strong> <code>popup-cookie</code></li>
<li><strong>Кнопка согласия:</strong> <code>button-cookie</code></li>
<li><strong>Кнопка отказа:</strong> <code>button-no-cookie</code></li>
</ul>

<p><em>Вы можете использовать другие названия классов, но тогда не забудьте указать их в генераторе кода.</em></p>
</div>

<div class="step-box">
<h3>Шаг 2: Настройте параметры в генераторе кода</h3>

<p>Укажите в полях генератора нужные вам параметры:</p>

<ul>
<li><strong>Срок хранения:</strong> количество дней хранения согласия пользователя</li>
<li><strong>CSS-классы:</strong> ваши пользовательские классы для элементов интерфейса</li>
</ul>
</div>

<div class="step-box">
<h3>Шаг 3: Сгенерируйте и скопируйте код</h3>

<p>Нажмите кнопку <strong>"Сгенерировать код"</strong>. Код автоматически скопируется в буфер обмена.</p>
</div>

<div class="step-box">
<h3>Шаг 4: Вставьте код на сайт</h3>

<ol>
<li>Откройте настройки страницы в Taptop</li>
<li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
</ol>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/cookie/page-settings.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
</div>

<p>Сохраните изменения на странице.</p>
</div>

## Проверка работоспособности

<div class="important-note">
<strong>Как убедиться, что баннер работает правильно:</strong>
<ol>
<li>Откройте свой сайт в режиме инкогнито (Ctrl+Shift+N)</li>
<li>Убедитесь, что баннер появился на экране</li>
<li>Нажмите на кнопку согласия или отказа</li>
<li>Перезагрузите страницу - баннер больше не должен появиться</li>
</ol>
</div>

Если вы хотите проверить, что cookie действительно сохранились:

1. После нажатия на кнопку в баннере, откройте инспектор браузера (F12 или Ctrl+Shift+I)
2. Перейдите во вкладку:
   - **Chrome/Edge:** Приложение → Куки
   - **Firefox:** Хранилище → Куки
3. Найдите cookie с именем "cookieAgreement"
4. Проверьте его значение: "true" для согласия или "false" для отказа

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/cookie/cookie-check.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Пример проверки cookie в инспекторе браузера</p>
</div>

!>**ВАЖНО!** Убедитесь, что вы создали все необходимые элементы и правильно назначили им классы.
