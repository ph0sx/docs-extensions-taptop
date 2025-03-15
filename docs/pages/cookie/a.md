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

<div id="cookie-generator">
  <div class="form-grid">
    <div class="form-group">
      <label for="expiry-days">Срок хранения выбора пользователя (дни):</label>
      <input type="number" id="expiry-days" value="7" min="1">
      <div class="helper-text">Определяет, как долго будет храниться выбор пользователя в браузере</div>
    </div>
    
    <div class="form-group">
      <label for="popup-class">CSS-класс всплывающего окна:</label>
      <input type="text" id="popup-class" value="popup-cookie">
      <div class="helper-text">Класс блока с уведомлением о cookie</div>
    </div>
  </div>

  <div class="form-grid">
    <div class="form-group">
      <label for="consent-btn-class">CSS-класс кнопки согласия:</label>
      <input type="text" id="consent-btn-class" value="button-cookie">
      <div class="helper-text">Класс кнопки "Принять" или "Согласен"</div>
    </div>
    
    <div class="form-group">
      <label for="reject-btn-class">CSS-класс кнопки отказа:</label>
      <input type="text" id="reject-btn-class" value="button-no-cookie">
      <div class="helper-text">Класс кнопки "Отклонить" или "Отказаться"</div>
    </div>
  </div>
  
  <button id="generate-btn" class="primary-button">
    <span class="button-text">Сгенерировать код</span>
  </button>

  <!-- Скрытый элемент для хранения сгенерированного кода -->
  <div id="js-code" style="display: none;"></div>
  
  <!-- Модальное окно -->
  <div id="success-modal" class="modal-overlay">
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      
      <div class="modal-icon">✓</div>
      <h3>Код успешно скопирован!</h3>
      
      <div class="instruction-block">
        <h4>Инструкция по подключению:</h4>
        <ol>
          <li>Откройте настройки страницы в конструкторе</li>
          <li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
          <li>Сохраните изменения на странице</li>
        </ol>
      </div>
      
      <button class="primary-button close-btn">Понятно</button>
    </div>
  </div>
</div>

## Пошаговая инструкция по подключению

<div class="step-box">
  <h3>Шаг 1: Назначьте CSS-классы элементам попапа</h3>
  <p>В интерфейсе конструктора <strong>Taptop</strong> задайте следующие классы:</p>
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
    <li>Откройте настройки страницы в конструкторе Taptop</li>
    <li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
    <li>Сохраните изменения на странице</li>
  </ol>
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

## Проверка сохранения Cookie

Если вы хотите проверить, что cookie действительно сохранились:

1. После нажатия на кнопку в баннере, откройте инспектор браузера (F12 или Ctrl+Shift+I)
2. Перейдите во вкладку:
   - **Chrome/Edge:** Приложение → Куки
   - **Firefox:** Хранилище → Куки
3. Найдите cookie с именем "cookieAgreement"
4. Проверьте его значение: "true" для согласия или "false" для отказа

![Пример проверки cookie в инспекторе браузера](./images/cookie/cookie-check.png ':size=600')

> [!NOTE]
> **ВАЖНО!** Убедитесь, что вы создали все необходимые элементы и правильно назначили им классы перед подключением скрипта.