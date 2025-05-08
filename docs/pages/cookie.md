# Cookie

Это расширение позволяет сохранить выбор пользователя о согласии на обработку cookie.

## Как работает расширение

1. **Первичный визит:**  
   При первом посещении сайта пользователю отображается всплывающее окно с запросом согласия на обработку cookie.

2. **Действие пользователя:**  
   Пользователь может согласиться или отказаться от обработки cookie.

3. **Повторные визиты:**  
   Если пользователь уже сделал выбор, всплывающее окно не появляется повторно до истечения заданного срока хранения cookie.

## Установка на сайт

<div class="step-box">

<h3>Шаг 1: Создайте Pop-up в Taptop</h3>

<ol>
  <li>Добавьте на страницу виджет <code>Pop-up</code>  из стандартных элементов Taptop.</li>

  <div class="img-block">
    <img src="./images/cookie/popup-element.png">
    <p class="img-block-text">Виджеты ---> Pop-up</p>
  </div>
  <li>Разместите внутри него необходимый контент: текст уведомления, кнопку согласия, кнопку отказа. Также можно настроить кнопку закрытия и оверлей (фон затемнения).</li>

  <div class="img-block">
    <img src="./images/cookie/popup-structure.png">
    <p class="img-block-text">Пример структуры Pop-up</p>
  </div>

  <li>Стилизуйте <code>Pop-up</code>  и его элементы (кнопки, текст) по своему усмотрению с помощью стандартных инструментов Taptop.</li>

  <div class="img-block">
    <img src="./images/cookie/popup-example.png">
    <p class="img-block-text">Пример того, как может выглядить ваш Pop-up</p>
  </div>
</ol>

<div class="important-note">
  <strong>ВАЖНЫЙ НЮАНС РАБОТЫ С ОВЕРЛЕЕМ:</strong> По умолчанию виджет <code>Pop-up</code> в Taptop растягивает оверлей на весь экран (все значения <code>Top, Bottom, Left, Right</code> установлены в 0). Это может мешать взаимодействию с элементами на странице под оверлеем (например, анимациям при наведении).
  <br>

  <div class="img-block">
    <img src="./images/cookie/position-null.png">
    <p class="img-block-text">Значения по умолчанию</p>
  </div>

<strong>РЕШЕНИЕ:</strong> Выберите элемент <code>Overlay</code> внутри вашего виджета <code>Pop-up</code> в Taptop. В панели стилей справа найдите секцию "Позиционирование". Каждой из сторон задайте значение <code>"auto"</code>. Это позволит оверлею занимать пространство корректно, не перекрывая другие интерактивные элементы.

  <div class="img-block">
    <img src="./images/cookie/position-auto.png">
    <p class="img-block-text">Поменяли значения сторон на "auto"</p>
  </div>
</div>

</div>

<div class="step-box">
<h3>Шаг 2: Назначьте CSS-классы элементам Pop-up</h3>

<p>Теперь, когда Pop-up создан, присвойте CSS-классы соответствующим элементам в интерфейсе <strong>Taptop</strong>. Эти классы свяжут вашу верстку с генерируемым скриптом:</p>

<ul>
<li><strong>Всплывающее окно (сам виджет Pop-up):</strong> <code>popup-cookie</code></li>
<li><strong>Кнопка согласия ("Принять", "ОК"):</strong> <code>button-cookie</code></li>
<li><strong>Кнопка отказа ("Отклонить"):</strong> <code>button-no-cookie</code></li>
</ul>

<p><em>Вы можете использовать другие названия классов для баннера и кнопок согласия/отказа, но тогда не забудьте указать их в полях генератора на следующем шаге.</em></p>

</div>

<div class="step-box">
<h3>Шаг 3: Настройте параметры и сгенерируйте код</h3>

<p>Теперь настройте параметры для вашего cookie-уведомления в генераторе ниже. Укажите срок хранения согласия и CSS-классы, которые вы задали на предыдущем шаге (если они отличаются от стандартных).</p>

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

  <div id="js-code" style="display: none;"></div>

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

<p>Нажмите кнопку <strong>"Сгенерировать код"</strong> выше. Код будет автоматически скопирован в буфер обмена, и вы увидите уведомление.</p>
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

<div class="img-block">
  <img src="./images/cookie/cookie-check.png">
  <p class="img-block-text">Пример проверки cookie в инспекторе браузера</p>
</div>

!>**ВАЖНО!** Убедитесь, что вы создали все необходимые элементы и правильно назначили им классы.
