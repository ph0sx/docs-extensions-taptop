# Индикатор загрузки (Loader)

Это расширение добавляет на страницу индикатор загрузки (лоадер), который отображается, пока загружается основное содержимое сайта. Kоадер помогает улучшить UX, особенно на страницах с большим количеством контента или при медленном интернет-соединении, давая понять, что страница находится в процессе загрузки.

---

## Подготовка в Taptop

Специальной подготовки элементов в Taptop для работы этого расширения **не требуется**. Лоадер будет автоматически добавлен на всю страницу как оверлей (слой поверх всего контента).

---

## Генератор кода

<div id="loader-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка индикатора загрузки</div>
    <div class="generator-subtitle">Выберите внешний вид и тайминги лоадера.</div>
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
            <option value="custom">Custom CSS (с css-loaders.com или аналогичных)</option>
          </select>
        </div>
      </div>
       <div class="settings-row">
        <div class="setting-group">
          <label for="loader-bg-color">Цвет фона оверлея:</label>
          <input type="color" id="loader-bg-color" value="#ffffff">
          <div class="helper-text">Цвет фона, перекрывающего страницу</div>
        </div>
        <div class="setting-group" id="loader-animation-color-group">
          <label for="loader-animation-color">Цвет анимации:</label>
          <input type="color" id="loader-animation-color" value="#4483f5">
           <div class="helper-text" id="loader-animation-color-helper">Основной цвет анимированных элементов. Не применяется для "Custom CSS".</div>
        </div>
      </div>
      <div class="settings-row" id="loader-custom-css-group" style="display: none;">
        <div class="setting-group">
          <label for="loader-custom-css">CSS-код загрузчика:</label>
          <textarea id="loader-custom-css" class="text-input" rows="10" placeholder="/* HTML: <div class=&quot;loader&quot;></div> */\n.loader {\n  /* ... стили вашего лоадера ... */\n}"></textarea>
          <div class="helper-text">Вставьте CSS, скопированный с сайта <a href="https://css-loaders.com/" target="_blank" rel="noopener noreferrer">css-loaders.com</a> или <a href="https://cssloaders.github.io/" target="_blank" rel="noopener noreferrer">cssloaders.github.io</a> (или аналогичного, использующего класс <code>.loader</code> для основного элемента). Мы автоматически адаптируем класс <code>.loader</code>. Если ваш CSS использует другой основной класс, пожалуйста, замените его на <code>.loader</code> перед вставкой.</div>
        </div>
      </div>
    </div>
    <div class="settings-section">
       <div class="settings-section-title">2. Тайминги</div>
       <div class="settings-row">
         <div class="setting-group">
           <label for="loader-min-display-time">Мин. длительность показа (мс):</label>
           <input type="number" id="loader-min-display-time" class="number-input" value="500" min="0" step="100">
           <div class="helper-text">Лоадер будет виден как минимум это время, даже если сайт загрузился мгновенно. Помогает избежать "мигания" анимации. 0 = отключить.</div>
         </div>
         <div class="setting-group">
           <label for="loader-hide-delay">Пауза перед скрытием (мс):</label>
           <input type="number" id="loader-hide-delay" class="number-input" value="100" min="0" step="50">
            <div class="helper-text">Дополнительная пауза после полной загрузки контента и после истечения "Минимальной длительности показа". Дает время на отрисовку всех элементов (шрифты, изображения), чтобы избежать "прыжка" макета. 0 = отключить.</div>
         </div>
          <div class="setting-group">
           <label for="loader-hide-duration">Плавность исчезновения (мс):</label>
           <input type="number" id="loader-hide-duration" class="number-input" value="300" min="0" step="50">
           <div class="helper-text">Время, за которое лоадер плавно исчезнет (анимация fade-out). Влияет на визуальную "мягкость" ухода лоадера.</div>
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

## Использование типа "Custom CSS"

Если вы выбрали тип анимации "Custom CSS", вы можете использовать CSS-код для загрузчиков с таких сайтов, как:

- [css-loaders.com](https://css-loaders.com/)
- [cssloaders.github.io](https://cssloaders.github.io/)

**Как это работает:**

1.  Перейдите на один из указанных сайтов и выберите понравившийся лоадер.

      <div class="img-block">
        <img src="./images/loader/css-loaders.png">
        <p class="img-block-text">Пример выбора лоадера на <a href="https://css-loaders.com/" target="_blank" rel="noopener noreferrer">css-loaders.com</a></p>
      </div>

2.  Скопируйте CSS-код для этого лоадера. Обычно на этих сайтах предоставляется кнопка "Copy CSS" или иконка копирования.

    <div class="img-block">
        <img src="./images/loader/css-loaders-copy.png">
        <p class="img-block-text">Нажимаем на "copy the css" (пример для: <a href="https://css-loaders.com/" target="_blank" rel="noopener noreferrer">css-loaders.com</a> )</p>
    </div>

3.  Вставьте скопированный CSS в поле "CSS-код загрузчика" в генераторе выше.

  <div class="img-block">
      <img src="./images/loader/loader-generator-example.png" style="cursor: zoom-in; transition: transform .3s ease;"
onclick="this.requestFullscreen?.()">
      <p class="img-block-text">Вставляем код</p>
  </div>

4.  Наш генератор ожидает, что основной стилизуемый элемент в вашем CSS будет иметь класс `.loader`. Например:
    ```css
    .loader {
      width: 50px;
      aspect-ratio: 1;
      border-radius: 50%;
      /* ... и т.д. */
    }
    .loader::before {
      /* ... стили для псевдоэлемента ... */
    }
    ```
5.  Цвет анимации для типа "Custom CSS" полностью определяется вашим CSS-кодом.

После вставки CSS вы увидите его в действии в окне "Предпросмотр".
