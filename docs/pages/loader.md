# Индикатор загрузки (Loader/Preloader)

Это расширение добавляет на страницу индикатор загрузки (прелоадер), который отображается, пока загружается основное содержимое сайта.

---

## Как работает расширение

1.  **Настройка:** В генераторе ниже вы выбираете внешний вид и параметры времени для лоадера.
2.  **Генерация Кода:** Нажимаете кнопку "Сгенерировать код".
3.  **Установка:** Копируете сгенерированный код (он будет включать стили и скрипт) и вставляете его в настройки страницы Taptop.
4.  **Результат:** При загрузке страницы пользователь увидит настроенный вами лоадер, который автоматически скроется после полной загрузки контента.

---

## Настройка в Taptop

Специальной подготовки элементов в Taptop **не требуется**. Лоадер будет автоматически добавлен на всю страницу. Вам нужно только вставить сгенерированный код.

1.  Откройте настройки страницы в Taptop (иконка шестеренки).
2.  Найдите блок **"Перед тегом `</body>`"**.
3.  Вставьте туда сгенерированный код.
4.  Опубликуйте страницу.

<div class="img-block">
<img src="./images/cookie/page-settings.png" >
 <p class="img-block-text">Вставка кода в настройки страницы перед тегом body</p>
</div>

---

## Генератор кода

<div id="loader-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка индикатора загрузки</div>
    <div class="generator-subtitle">Выберите внешний вид и тайминги прелоадера.</div>
  </div>

  <div class="settings-block">
    <div class="settings-section">
      <div class="settings-section-title">1. Внешний вид</div>
      <div class="settings-row">
        <div class="setting-group">
          <label for="loader-animation-type">Тип анимации:</label>
          <select id="loader-animation-type" class="select-styled">
            <option value="spinner" selected>Spinner (Круг)</option>
            <option value="dots">Dots (Точки)</option>
            <option value="bars">Bars (Полосы)</option>
          </select>
          <div class="helper-text">Выберите стиль анимации лоадера.</div>
        </div>
      </div>
       <div class="settings-row">
        <div class="setting-group">
          <label for="loader-bg-color">Цвет фона оверлея:</label>
          <input type="color" id="loader-bg-color" value="#ffffff">
          <div class="helper-text">Цвет фона, перекрывающего страницу. Рекомендуется непрозрачный.</div>
        </div>
        <div class="setting-group">
          <label for="loader-animation-color">Цвет анимации:</label>
          <input type="color" id="loader-animation-color" value="#4483f5">
           <div class="helper-text">Основной цвет анимированных элементов.</div>
        </div>
      </div>
    </div>
    <div class="settings-section">
       <div class="settings-section-title">2. Тайминги</div>
       <div class="settings-row">
         <div class="setting-group">
           <label for="loader-min-display-time">Мин. время показа (мс):</label>
           <input type="number" id="loader-min-display-time" class="number-input" value="500" min="0" step="100">
           <div class="helper-text">Лоадер будет виден минимум это время, даже если страница загрузится быстрее. 0 - отключить.</div>
         </div>
         <div class="setting-group">
           <label for="loader-hide-delay">Задержка перед скрытием (мс):</label>
           <input type="number" id="loader-hide-delay" class="number-input" value="100" min="0" step="50">
            <div class="helper-text">Пауза после загрузки страницы перед началом скрытия лоадера. 0 - отключить.</div>
         </div>
          <div class="setting-group">
           <label for="loader-hide-duration">Длительность скрытия (мс):</label>
           <input type="number" id="loader-hide-duration" class="number-input" value="300" min="0" step="50">
           <div class="helper-text">Время анимации исчезновения (fade-out).</div>
         </div>
       </div>
    </div>
     <div class="settings-section preview-section">
        <div class="settings-section-title preview-title">Предпросмотр</div>
        <div id="loader-preview-area" class="loader-preview-area">
          <div class="loader-preview__animation">
             </div>
        </div>
     </div>

  </div>

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
          <li>Найдите блок **"Перед тегом `</body>`"**.</li>
          <li>Вставьте сгенерированный код в это поле.</li>
          <li>Опубликуйте страницу.</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

---

## Возможные проблемы

- **Лоадер не исчезает:** Возможно, на странице есть скрипт, который блокирует событие `window.onload`. Проверьте консоль браузера (F12) на наличие ошибок.
- **Лоадер мигает и сразу исчезает:** Увеличьте значение "Мин. время показа".
- **Контент "прыгает" после исчезновения лоадера:** Это может быть связано с загрузкой шрифтов или стилей после `window.onload`. Попробуйте увеличить "Задержку перед скрытием".
