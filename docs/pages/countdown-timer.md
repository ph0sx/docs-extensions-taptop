# Таймер обратного отсчета

Это расширение позволяет добавить на страницу таймер обратного отсчета, который по истечении заданного времени скроет одни блоки и/или покажет другие.

## Как работает расширение

Расширение позволяет настроить и добавить на страницу таймер, который умеет:

1. **Отсчитывать время до конкретной даты и времени:** С учетом выбранного часового пояса, подходит для акций с фиксированным сроком.
2. **Запускать индивидуальный ("вечнозеленый") таймер:** Отсчет начинается для каждого посетителя при его первом визите и длится заданное время (Дни:Часы:Минуты:Секунды).
3. **Отображать обратный отсчет:** Показывает оставшееся время в указанном вами элементе на странице Taptop.
4. **Скрывать блоки:** По окончании отсчета скрывает один или несколько блоков, указанных CSS-классами.
5. **Показывать блоки:** Одновременно со скрытием (или вместо него) может показывать другие блоки, которые были изначально скрыты с помощью CSS-класса, заданного через интерфейс Taptop.
6. **Скрывать сам таймер:** Опционально скрывает элемент с цифрами таймера по завершении.
7. **Отображать текст по завершении:** Вместо "00:00:00" показывает указанный вами текст (например, "Акция завершена!").
8. **Перенаправлять пользователя:** Опционально перенаправляет посетителя на другую страницу вашего сайта (по указанному пути) после окончания таймера.

## Генератор кода

<div id="countdown-timer-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка таймера</div>
  </div>

  <div class="settings-block">
    <div class="settings-section">
      <div class="settings-section-title">1. Тип таймера</div>
      <div class="settings-row timer-type-selection">
         <label class="radio-container">
           <input type="radio" name="timerType" value="fixed" checked>
           <span class="radio-checkmark"></span>
           До конкретной даты и времени
         </label>
         <label class="radio-container">
           <input type="radio" name="timerType" value="evergreen">
           <span class="radio-checkmark"></span>
           Для каждого посетителя (Вечнозеленый)
         </label>
      </div>
      <div class="helper-text">Выберите, будет ли таймер отсчитывать до одной фиксированной даты для всех, или будет запускаться индивидуально для каждого посетителя.</div>
    </div>
    <div class="settings-section">
       <div class="settings-section-title">2. Настройки времени</div>
       <div id="fixed-date-settings" class="time-settings-group">
           <div class="helper-text" style="margin-bottom: 15px;">Таймер будет отсчитывать время до указанной даты и времени по выбранному часовому поясу.</div>
           <div class="settings-row">
             <div class="setting-group">
               <label for="timer-end-date">Дата окончания:</label>
               <input type="date" id="timer-end-date" class="text-input">
             </div>
             <div class="setting-group">
               <label for="timer-end-time">Время окончания (с секундами):</label>
               <input type="time" id="timer-end-time" class="text-input" step="1" value="00:00:00">
             </div>
           </div>
            <div class="settings-row">
             <div class="setting-group">
                 <label for="timer-timezone">Часовой пояс:</label>
                 <select class="select-styled timezone-select" id="timer-timezone" name="timezone">
                   <option value="auto" selected>Автоматически (часовой пояс посетителя)</option>
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
                     <option value="-12">UTC-12</option> <option value="-11">UTC-11</option> <option value="-10">UTC-10</option>
                     <option value="-9">UTC-9</option> <option value="-8">UTC-8</option> <option value="-7">UTC-7</option>
                     <option value="-6">UTC-6</option> <option value="-5">UTC-5</option> <option value="-4">UTC-4</option>
                     <option value="-3">UTC-3</option> <option value="-2">UTC-2</option> <option value="-1">UTC-1</option>
                   </optgroup>
                   <optgroup label="Центральный регион">
                     <option value="0">UTC+0 (Лондон)</option> <option value="1">UTC+1 (Берлин)</option>
                   </optgroup>
                   <optgroup label="Азия и Океания">
                      <option value="4">UTC+4</option> <option value="5.5">UTC+5:30</option> <option value="8">UTC+8</option>
                      <option value="9">UTC+9</option> <option value="9.5">UTC+9:30</option> <option value="10">UTC+10</option>
                      <option value="12">UTC+12</option> <option value="13">UTC+13</option>
                   </optgroup>
                 </select>
                 <div class="helper-text" style="margin-top: 10px;">Убедитесь, что дата/время установлены по выбранному часовому поясу. 'Автоматически' использует часовой пояс браузера посетителя для отсчета, но введенная дата/время всегда считаются локальными для вас при вводе.</div>
               </div>
            </div>
       </div>
       <div id="evergreen-settings" class="time-settings-group" style="display: none;">
          <div class="helper-text" style="margin-bottom: 15px;">Укажите длительность таймера. Он будет запущен индивидуально для каждого посетителя при первом заходе на страницу. Время окончания сохранится в браузере посетителя (`localStorage`).</div>
          <div class="settings-row">
             <div class="setting-group">
               <label for="timer-duration-days">Дни:</label>
               <input type="number" id="timer-duration-days" class="number-input" value="0" min="0">
             </div>
             <div class="setting-group">
               <label for="timer-duration-hours">Часы:</label>
               <input type="number" id="timer-duration-hours" class="number-input" value="1" min="0" max="23">
             </div>
             <div class="setting-group">
               <label for="timer-duration-minutes">Минуты:</label>
               <input type="number" id="timer-duration-minutes" class="number-input" value="0" min="0" max="59">
             </div>
             <div class="setting-group">
               <label for="timer-duration-seconds">Секунды:</label>
               <input type="number" id="timer-duration-seconds" class="number-input" value="0" min="0" max="59">
             </div>
           </div>
       </div>
    </div>
    <div class="settings-section">
       <div class="settings-section-title">3. Настройки классов</div>
        <div class="settings-row">
               <div class="setting-group">
           <label for="timer-display-class">CSS-класс элемента таймера <span class="required-indicator">*</span></label>
           <input type="text" id="timer-display-class" class="text-input" placeholder="Например: timer-text" required>
           <div class="helper-text">Класс элемента (например, текстового блока), где будут отображаться цифры <em>Д:Ч:М:С.</em></div>
         </div>
        <div class="setting-group">
            <label for="timer-hide-classes">CSS-классы блоков для СКРЫТИЯ</label>
            <input type="text" id="timer-hide-classes" class="text-input" placeholder="Например: offer-block, old-price">
            <div class="helper-text">Классы блоков, которые нужно скрыть по окончании таймера. Оставьте пустым, если ничего скрывать не нужно.</div>
        </div>
        </div>
        <div class="settings-row">
        <div class="setting-group">
            <label for="timer-show-classes">CSS-классы блоков для ПОКАЗА (опционально)</label>
            <input type="text" id="timer-show-classes" class="text-input" placeholder="Например: expired-message, subscribe-form">
            <div class="helper-text">Классы блоков, которые нужно показать по окончании таймера. 
            <strong>Важно!</strong> Блокам в Taptop нужно присвоить отдельный класс и через панель стилей Taptop установить <code>Авто-лейаут - Отображение: Скрыть элемент <span class="icon-eye-off"></span>"</code>. Скрипт удалит этот класс, чтобы блок появился.</div>
        </div>
        </div>
    </div>
    <div class="settings-section">
       <div class="settings-section-title">4. Дополнительные опции по завершении</div>
       <div class="settings-row">
           <div class="setting-group">
               <label class="checkbox-container">
                 <input type="checkbox" id="timer-hide-self">
                 <span class="checkmark"></span>
                 Скрыть элемент таймера
               </label>
               <div class="helper-text">Скрывает элемент, в котором отображаются цифры таймера, когда отсчет дойдет до нуля.</div>
            </div>
            <div class="setting-group">
            <label for="timer-completion-text">Текст по завершении (опционально)</label>
             <input type="text" id="timer-completion-text" class="text-input" placeholder="Например: Акция завершена!">
             <div class="helper-text">Этот текст будет показан в элементе таймера вместо "00:00:00". Если оставить пустым, останутся нули.</div>
           </div>
           <div class="setting-group">
           <label for="timer-redirect-path">Перенаправить на путь (опционально)</label>
             <input type="text" id="timer-redirect-path" class="text-input" placeholder="Например: /sale-over или /catalog">
             <div class="helper-text">Укажите путь на вашем сайте (начинается с /), куда перенаправить пользователя после окончания таймера. Оставьте пустым, чтобы не перенаправлять.</div>
           </div>
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

---

## Установка и использование

Следуйте этим шагам, чтобы добавить таймер на ваш сайт Taptop:

<div class="step-box">
<h3>Шаг 1: Подготовьте элементы в Taptop</h3>

<ul>
<li><strong>Элемент для Таймера:</strong> Добавьте текстовый блок (или другой), где будут цифры (например, `00:00:00`).</li>
<li><strong>Блок(и) для Скрытия (Опционально):</strong> Определите, что должно исчезнуть.</li>
<li><strong>Блок(и) для Показа (Опционально):</strong> Определите, что должно появиться вместо скрытых блоков или просто по окончании таймера.</li>
</ul>
</div>

<div class="step-box">
<h3>Шаг 2: Назначьте и Настройте CSS-классы</h3>

<p>Это самый важный шаг для связи скрипта с вашими элементами.</p>
<ol>
<li><strong>Класс для Элемента Таймера:</strong>
    <ul>
     </ul>
      <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      <img src="./images/countdown-timer/timer-css-block.png" style="max-width: 100%; height: 200px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="Пример добавления класса для элемента таймера">
      <img src="./images/countdown-timer/timer-css-selector.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="Пример добавления класса для элемента таймера">
      <p style="margin-top: 10px; font-style: italic; color: #666;">Пример добавления класса элементу для отображения таймера</p>
      </div>

</li>
<li><strong>Класс(ы) для Скрываемых Блоков:</strong>
    <ul>
    <li>Выберите блок(и), которые должны исчезнуть.</li>
    <li>Добавьте CSS-класс. Если блоков несколько, можно дать им один общий класс или разные (их нужно будет перечислить через запятую в генераторе).</li>
     </ul>
     <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      <img src="./images/countdown-timer/block-hide.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="Пример добавления класса блоку для скрытия">
       <p style="margin-top: 10px; font-style: italic; color: #666;">Пример добавления класса блоку для скрытия</p>
      </div>
</li>
<li><strong>Класс(ы) для Показываемых Блоков (Если Используются):</strong>
    <ul>
    <li>Выберите блок(и), который должен появиться.</li>
    <li>Добавьте уникальный CSS-класc (например, <code>offer-expired</code>).</li>
    <li><strong>Важно!</strong> Не закрывая панель настроек этого блока, выберите только что добавленный класс в секции "Источники стилей". Затем в настройках <code>"Авто-лейаут - Отображение" нажмите иконку "Скрыть элемент <span class="icon-eye-off"></span>"</code>. У класса в списке должна появиться такая же иконка. Это установит `display: none` для этого класса.</li>
    </ul>
     <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      <img src="./images/countdown-timer/block-show.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="Пример установки display:none для класса показываемого блока">
      <p style="margin-top: 10px; font-style: italic; color: #666;">Пример: Классу <code>offer-block-show</code>установлено <code>скрыть элемент <span class="icon-eye-off"></span></code> через интерфейс Taptop</p>
     </div>
</li>
</ol>

!> ВАЖНО: Указывайте в настройках генератора **точно те же имена классов**, которые вы задали в Taptop, **без точки** в начале.

</div>

<div class="step-box">
<h3>Шаг 3: Настройте Генератор Кода</h3>
<p>Вернитесь к генератору кода выше на этой странице и заполните поля:</p>
<ol>
<li><strong>Выберите Тип таймера</strong> (Фиксированный / Вечнозеленый).</li>
<li><strong>Настройте время</strong> (дату/время/пояс или длительность).</li>
<li><strong>Укажите CSS-классы</strong> (элемента таймера, скрытых и показываемых блоков).
</li>
<li><strong>(Опционально) Установите Дополнительные опции</strong> : Отметьте "Скрыть элемент таймера", если цифры больше не нужны после завершения или настройте редирект после завершения отсчёта таймера.</li>
</ol>
</div>

<div class="step-box">
<h3>Шаг 4: Вставка кода на сайт.</h3>
<ol>
<li>Нажмите кнопку <strong>"Сгенерировать код"</strong>.</li>
<li>Код будет автоматически скопирован.</li>
<li>Перейдите в редактор Taptop -> Настройки страницы -> Перед тегом <code>&lt;body&gt;</code></li>
<li>Вставьте скопированный код.</li>
</ol>
<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/cookie/page-settings.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
 <p style="margin-top: 10px; font-style: italic; color: #666;">Вставка кода в настройки страницы</p>
</div>
<ol start="5">
<li>Закройте настройки страницы.</li>
<li>Опубликуйте страницу.</li>
</ol>
</div>

---

## Примеры использования

Ниже приведены несколько сценариев, показывающих, как можно использовать таймер.

<div class="important-note">
<h3>Пример 1: Акция "Успей купить!"</h3>
<p><strong>Задача:</strong> Показать блок с акционным товаром до пятницы, 18:00. После этого скрыть блок акции, показать сообщение "Предложение закончилось" и убрать сам таймер.</p>
<ul>
<li><strong>Подготовка в Taptop:</strong>
    <ul>
    <li>Создаем текстовый блок для таймера, даем ему класс <code>flash-sale-timer</code>.</li>
    <li>Создаем блок с акционным предложением, даем ему класс <code>flash-sale-offer</code>.</li>
    <li>Создаем текстовый блок "Увы, предложение закончилось!", даем ему класс <code>flash-sale-over</code>. Этому классу (<code>flash-sale-over</code>) через панель стилей Taptop устанавливаем <code>Отображение: Скрыть <span class="icon-eye-off"></span></code>.</li>
    </ul>
</li>
<li><strong>Настройки генератора:</strong>
    <ul>
    <li>Тип таймера: <code>До конкретной даты и времени</code></li>
    <li>Дата/Время/Пояс: <code>(Установить ближайшую пятницу, 18:00:00, ваш часовой пояс)</code></li>
    <li>Класс элемента таймера: <code>flash-sale-timer</code></li>
    <li>Классы блоков для СКРЫТИЯ: <code>flash-sale-offer</code></li>
    <li>Классы блоков для ПОКАЗА: <code>flash-sale-over</code></li>
    <li>Скрыть элемент таймера: <code>✔️ (отмечено)</code></li>
    <li>Текст по завершении: <code>(пусто)</code></li>
    <li>Перенаправить на путь: <code>(пусто)</code></li>
    </ul>
</li>
<li><strong>Результат:</strong> Таймер отсчитывает время до вечера пятницы. В 18:00 блок акции (<code>flash-sale-offer</code>) и сам таймер (<code>flash-sale-timer</code>) исчезнут, а появится сообщение (<code>flash-sale-over</code>).</li>
</ul>
</div>

<div class="important-note">
<h3>Пример 2: Персональная скидка 3 часа</h3>
<p><strong>Задача:</strong> Показать новому посетителю персональную скидку на 3 часа. По истечении времени скрыть блок скидки, показать в таймере текст "Ваше время вышло" и перенаправить на страницу каталога.</p>
<ul>
<li><strong>Подготовка в Taptop:</strong>
    <ul>
    <li>Текстовый блок для таймера, класс <code>personal-timer-3hr</code>.</li>
    <li>Блок со скидкой, класс <code>personal-discount-3hr</code>.</li>
    </ul>
</li>
<li><strong>Настройки генератора:</strong>
    <ul>
    <li>Тип таймера: <code>Для каждого посетителя (Вечнозеленый)</code></li>
    <li>Длительность: Дни: <code>0</code>, Часы: <code>3</code>, Мин: <code>0</code>, Сек: <code>0</code></li>
    <li>Класс элемента таймера: <code>personal-timer-3hr</code></li>
    <li>Классы блоков для СКРЫТИЯ: <code>personal-discount-3hr</code></li>
    <li>Классы блоков для ПОКАЗА: <code>(пусто)</code></li>
    <li>Скрыть элемент таймера: <code>(не отмечено)</code></li>
    <li>Текст по завершении: <code>Ваше время вышло</code></li>
    <li>Перенаправить на путь: <code>/catalog</code></li>
    </ul>
</li>
<li><strong>Результат:</strong> При первом заходе у посетителя запускается 3-часовой таймер. По истечении этого времени блок скидки (<code>personal-discount-3hr</code>) исчезнет, в элементе таймера появится текст "Ваше время вышло", и пользователя перенаправит на страницу <code>/catalog</code>. При повторных заходах до истечения 3 часов таймер будет продолжать отсчет.</li>
</ul>
</div>

<div class="important-note">
<h3>Пример 3: Обратный отсчет до старта вебинара</h3>
<p><strong>Задача:</strong> Показать таймер до начала вебинара. Когда время выйдет, показать кнопку "Присоединиться" и изменить текст таймера на "Вебинар начался!".</p>
<ul>
<li><strong>Подготовка в Taptop:</strong>
    <ul>
    <li>Текстовый блок для таймера, класс <code>webinar-countdown</code>.</li>
    <li>Кнопка "Присоединиться" (или целый блок с ней), класс <code>webinar-join-button</code>. Этому классу (<code>webinar-join-button</code>) через панель стилей Taptop установлено <code>Отображение: Скрыть <span class="icon-eye-off"></span></code>.</li>
    </ul>
</li>
<li><strong>Настройки генератора:</strong>
    <ul>
    <li>Тип таймера: <code>До конкретной даты и времени</code></li>
    <li>Дата/Время/Пояс: <code>(Установить дату/время начала вебинара)</code></li>
    <li>Класс элемента таймера: <code>webinar-countdown</code></li>
    <li>Классы блоков для СКРЫТИЯ: <code>(пусто)</code></li>
    <li>Классы блоков для ПОКАЗА: <code>webinar-join-button</code></li>
    <li>Скрыть элемент таймера: <code>(не отмечено)</code></li>
    <li>Текст по завершении: <code>Вебинар начался!</code></li>
    <li>Перенаправить на путь: <code>(пусто)</code></li>
    </ul>
</li>
<li><strong>Результат:</strong> Таймер отсчитывает время до вебинара. По его окончании в элементе таймера появится текст "Вебинар начался!", а у кнопки "Присоединиться" будет удален класс <code>webinar-join-button</code>, и она станет видимой.</li>
</ul>
</div>

---

## Решение возможных проблем

!> Не работает таймер или отображение/скрытие блоков

- **Проверьте Классы:** Убедитесь, что CSS-класс(ы), введенные в поле классов таймера/скрытия/показа генератора, **в точности совпадают** с классами, назначенными соответствующим блокам в Taptop (без точек, регистр важен). Проверьте на опечатки.
- **Наличие Блоков:** Убедитесь, что на странице действительно есть блоки с указанными классами. Проверьте консоль браузера (F12) на наличие предупреждений `[Countdown Timer] Блоки для скрытия (...) не найдены.`

!> Вечнозеленый таймер всегда запускается заново:

- Посетитель может использовать режим Инкогнито или очищать `localStorage`.
