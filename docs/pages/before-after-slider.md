# Слайдер До/После

Это расширение позволяет добавить на страницу интерактивный слайдер для визуального сравнения двух изображений ("до" и "после").

## Как работает расширение

1.  Вы загружаете два изображения в Taptop и копируете их URL-адреса.
2.  В генераторе ниже вы указываете эти URL, класс блока-контейнера на вашей странице и настраиваете параметры слайдера.
3.  Генератор создает `<script>`, который вы вставляете в настройки страницы Taptop.
4.  Скрипт автоматически находит ваш блок-контейнер и вставляет в него готовый слайдер с вашими изображениями.

## Генератор кода

<div id="before-after-slider-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка слайдера</div>
  </div>
<div class="settings-block">
    <div class="settings-section">
        <div class="settings-section-title">1. Изображения для сравнения</div>
        <div class="settings-row">
          <div class="setting-group">
            <label for="bas-image-url-before">URL изображения "ДО" <span class="required-indicator">*</span></label>
            <input type="url" id="bas-image-url-before" class="text-input" placeholder="https://site.taptop.site/d/before.jpg" required>
            <div class="helper-text">Вставьте прямую ссылку на первое изображение.</div>
          </div>
          <div class="setting-group">
            <label for="bas-image-url-after">URL изображения "ПОСЛЕ" <span class="required-indicator">*</span></label>
            <input type="url" id="bas-image-url-after" class="text-input" placeholder="https://site.taptop.site/d/after.png" required>
            <div class="helper-text">Вставьте прямую ссылку на второе изображение.</div>
          </div>
        </div>
    </div>
    <div class="settings-section">
        <div class="settings-section-title">2. Контейнер для слайдера</div>
         <div class="settings-row">
            <div class="setting-group">
                <label for="bas-container-selector">CSS-класс блока-контейнера <span class="required-indicator">*</span></label>
                <input type="text" id="bas-container-selector" class="text-input" placeholder="Например: before-after-wrapper" required>
                <div class="helper-text">Укажите CSS-класс пустого блока на вашей странице Taptop, куда будет вставлен слайдер. </div>
            </div>
         </div>
    </div>
    <div class="settings-section">
        <div class="settings-section-title">3. Основные настройки слайдера</div>
        <div class="settings-row">
          <div class="setting-group">
            <label for="bas-initial-position">Начальное положение (%)</label>
             <div class="slider-container">
                <input type="range" id="bas-initial-position" class="slider" min="0" max="100" value="50" step="1">
                 <div class="slider-labels">
                    <span>0%</span>
                    <span>100%</span>
                 </div>
                 <div class="slider-value">
                    <span id="bas-initial-position-value" class="slider-value-primary">50%</span>
                 </div>
             </div>
            <div class="helper-text">Какая часть изображения "ДО" видна при загрузке.</div>
          </div>
          <div class="setting-group">
             <label>Ориентация слайдера</label>
              <div class="settings-row timer-type-selection" style="margin-bottom: 0;">
                 <label class="radio-container">
                   <input type="radio" id="bas-orientation-h" name="bas-orientation" value="horizontal" checked>
                   <span class="radio-checkmark"></span>
                   Горизонтальная (← →)
                 </label>
                 <label class="radio-container">
                   <input type="radio" id="bas-orientation-v" name="bas-orientation" value="vertical">
                   <span class="radio-checkmark"></span>
                   Вертикальная (↑ ↓)
                 </label>
              </div>
          </div>
        </div>
      <hr>
         <div class="settings-row" style="margin-top: 15px;">
             <div class="setting-group">
                <label class="checkbox-container">
                  <input type="checkbox" id="bas-hover-mode">
                  <span class="checkmark"></span>
                  <span class="checkbox-option-label">Активация при наведении мыши</span>
                </label>
                <div class="helper-text">Ползунок двигается за курсором без нажатия.</div>
            </div>
             <div class="setting-group">
                 <label class="checkbox-container">
                    <input type="checkbox" id="bas-handle-only-drag">
                    <span class="checkmark"></span>
                    <span class="checkbox-option-label">Перетаскивание только за ручку</span>
                 </label>
                 <div class="helper-text">Позволяет перетаскивать слайдер, только ухватившись за центральную ручку.</div>
            </div>
         </div>
    </div>
    <div class="settings-section">
        <div class="settings-section-title">4. Стилизация (опционально)</div>
        <div class="settings-row">
             <div class="setting-group">
                <label for="bas-divider-width">Толщина линии (px)</label>
                <input type="number" id="bas-divider-width" class="number-input" value="1" min="0" max="10" step="1">
                 <div class="helper-text">Толщина разделительной линии. 0 - скрыть.</div>
            </div>
                  <div class="setting-group">
                 <label for="bas-divider-color" >Цвет линии</label>
                 <input type="color" id="bas-divider-color" value="#ffffff" style="height: 38px; padding: 4px; width: 100%; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                  <div class="helper-text">Цвет разделителя.</div>
            </div>
            <div class="setting-group">
                <label for="bas-handle-width">Ширина ручки (px)</label>
                <input type="number" id="bas-handle-width" class="number-input" value="40" min="0" max="100" step="1">
                 <div class="helper-text">Размер центральной ручки ползунка.</div>
            </div>
              <div class="setting-group">
                 <label for="bas-handle-color" >Цвет ручки</label>
                 <input type="color" id="bas-handle-color" value="#ffffff" style="height: 38px; padding: 4px; width: 100%; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                  <div class="helper-text">Цвет иконки-ручки.</div>
            </div>
              <div class="setting-group">
                 <label class="checkbox-container" style="margin-top: 28px;"> <input type="checkbox" id="bas-hide-handle">
                    <span class="checkmark"></span>
                    <span class="checkbox-option-label">Скрыть ручку</span>
                 </label>
                 <div class="helper-text">Полностью скрывает центральную ручку (но не линию).</div>
            </div>
        </div>
     </div>
     <div class="settings-section" style="margin-top: 30px;">
      <div class="settings-section-title" style="text-align: center; border: none; margin-bottom: 15px;">Предпросмотр</div>
      <div class="settings-row" style="max-width: 600px; margin: 0 auto 15px auto; align-items: flex-end; justify-content: center; gap: 20px;">
         <div class="setting-group" style="flex-grow: 0;">
             <label for="bas-preview-width">Ширина превью (px)</label>
             <input type="number" id="bas-preview-width" class="number-input" value="500" min="100" max="1000" step="10">
         </div>
          <div class="setting-group" style="flex-grow: 0;">
             <label for="bas-preview-height">Высота превью (px)</label>
             <input type="number" id="bas-preview-height" class="number-input" value="300" min="100" max="1000" step="10">
         </div>
      </div>
       <div id="bas-preview-area" style="width: 500px; /* Начальная ширина */ height: 300px; /* Начальная высота */ max-width: 100%; margin: 0 auto; background-color: #f0f0f0; border: 1px dashed #ccc; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: #777; border-radius: var(--radius-md); overflow: hidden; /* Добавим overflow */">
        <span id="bas-preview-placeholder" style="padding: 20px;">Введите URL изображений и настройте параметры, чтобы увидеть превью.</span>
        <div id="bas-preview-loader" class="cf-loader-overlay" style="border-radius: var(--radius-md); display: none;"><span class="cf-loader"></span></div>
        <div id="bas-preview-error" style="color: red; display: none; padding: 15px;"></div>
      </div>
      <div class="helper-text" style="text-align: center; margin-top: 10px;">Реальный вид может немного отличаться в зависимости от стилей вашего сайта Taptop.</div>
    </div>
    <div class="action-section">

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
          <li>Создайте на странице Taptop пустой блок (например, Div Block), куда будет помещен слайдер.</li>
          <li>Присвойте этому блоку CSS-класс (например, `before-after-wrapper`), который вы указали в генераторе.</li>
          <li>Убедитесь, что у блока достаточная ширина и высота для отображения изображений.</li>
          <li>Откройте настройки страницы в Taptop.</li>
          <li>В блоке <strong>"Перед тегом body"</strong> вставьте сгенерированный код.</li>
          <li>Опубликуйте страницу.</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
  </div>
    </div>
</div>

## Установка и использование

<div class="step-box">
<h3>Шаг 1: Подготовьте изображения и контейнер в Taptop</h3>
<ul>
    <li><strong>Изображения:</strong> Загрузите два изображения ("до" и "после") в ресурсы Taptop. Убедитесь, что они имеют <strong>одинаковые размеры</strong> (ширину и высоту в пикселях) для наилучшего результата. Скопируйте их <strong>полные (абсолютные) URL-адреса</strong>, начинающиеся с <em>https://....</em></li>
    <div style="max-width: 600px; margin: 15px auto; text-align: center;">
        <img src="./images/before-after-slider/resources.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="">
        <p style="margin-top: 10px; font-style: italic; color: #666;">Для добавления изображений жмём на синюю кнопку</p>
        <img src="./images/before-after-slider/recources-with-images.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="">
        <p style="margin-top: 10px; font-style: italic; color: #666;">Добавляем изображения</p>
        <img src="./images/before-after-slider/resources-links.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="">
        <p style="margin-top: 10px; font-style: italic; color: #666;">Копируем абсолютную ссылку</p>
        </div>
    <li><strong>Контейнер:</strong> На странице Taptop, где должен быть слайдер, добавьте <strong>пустой блок (Div Block)</strong></li>
    <li><strong>CSS-класс контейнера:</strong> Выделите этот блок и назначьте ему <strong>уникальный CSS-класс</strong>.
    <div style="max-width: 600px; margin: 15px auto; text-align: center;">
        <img src="./images/before-after-slider/add-slider-selector.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="">
        <p style="margin-top: 10px; font-style: italic; color: #666;">Назначаем класс</p>
        </div>
    </li>
    <li><strong>Размеры контейнера:</strong> Задайте этому блоку нужные размеры (ширину и/или высоту) с помощью стандартных настроек Taptop (на панели стилей). Слайдер займет <strong>100% ширины</strong>  этого блока, а его <strong>высота автоматически подстроится</strong> под пропорции ваших изображений.
    </li>
    <strong>Важно</strong>: Если вы зададите контейнеру высоту, которая не соответствует пропорциям ваших изображений, слайдер все равно сохранит пропорции картинок и может не заполнить всю высоту контейнера. Чтобы слайдер точно соответствовал заданным размерам, готовьте изображения с нужным соотношением сторон заранее.

</ul>
</div>

<div class="step-box">
<h3>Шаг 2: Настройте генератор кода</h3>
<p>Вернитесь к генератору кода выше на этой странице и заполните поля:</p>
<ol>
    <li><strong>URL изображения "ДО" (<span class="required-indicator">*</span>):</strong> Вставьте скопированную полную ссылку на первое изображение.</li>
    <li><strong>URL изображения "ПОСЛЕ" (<span class="required-indicator">*</span>):</strong> Вставьте ссылку на второе изображение.</li>
    <li><strong>CSS-класс блока-контейнера (<span class="required-indicator">*</span>):</strong> Введите <strong>точно то же имя класса</strong>, которое вы задали пустому блоку (Div Block) на шаге 1</li>
    <li><strong>Начальное положение (%):</strong> Установите позицию разделителя при загрузке страницы (50% = по центру).</li>
    <li><strong>Ориентация слайдера:</strong> Выберите, как будет двигаться ползунок (горизонтально или вертикально).</li>
    <li><strong>Дополнительные опции:</strong> Отметьте, если нужна активация по наведению или перетаскивание только за ручку.</li>
    <li><strong>Стилизация (опционально):</strong> Настройте внешний вид линии и ручки по своему вкусу или оставьте значения по умолчанию.</li>
    <li><strong>Предпросмотр:</strong> Оцените результат в области предпросмотра (можно менять его размеры для проверки адаптивности).</li>
</ol>
</div>

<div class="step-box">
<h3>Шаг 3: Вставка кода на сайт Taptop</h3>
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
<p>После публикации слайдер должен появиться на странице внутри вашего блока-контейнера.</p>
<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/before-after-slider/slider-example.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
 <p style="margin-top: 10px; font-style: italic; color: #666;">Вставка кода в настройки страницы</p>
</div>
</div>

---

## Решение возможных проблем

!> **Слайдер не появился на странице:**

- **Проверьте CSS-класс:** Убедитесь, что класс, указанный в генераторе, **в точности** совпадает с классом, назначенным пустому Div Block в Taptop.
- **Код вставлен?** Проверьте, что сгенерированный `<script>` действительно вставлен в настройки страницы Taptop в "Перед тегом <code>&lt;body&gt;</code>".
- **Страница опубликована?** Изменения вступают в силу только после публикации.
- **Контейнер не пустой?** Убедитесь, что Div Block, которому вы назначили класс, действительно пустой и в нем нет других элементов.

!> **Изображения не загружаются:**

- **Проверьте URL:** Убедитесь, что URL изображений, вставленные в генератор, корректны и ведут непосредственно к файлам картинок (`.jpg`, `.png`, `.webp` и т.д.). Попробуйте открыть URL прямо в браузере. Используйте **абсолютные** URL (начинающиеся с `https://`).
- **Изображения не загружаются после смены доменного имени сайта:** Обновите ссылки на изображения.

!> **Слайдер выглядит не так, как в превью / Неправильные размеры:**

- **Размеры контейнера:** Проверьте размеры (ширину и высоту), заданные блоку-контейнеру в Taptop. Слайдер адаптируется по ширине, но его высота зависит от пропорций картинок.
- **Пропорции изображений:** Для предсказуемого результата используйте изображения "До" и "После" с **одинаковыми** пропорциями и размерами.
- **Стили сайта:** Возможно, общие стили вашего сайта Taptop влияют на отображение слайдера. Проверьте стили родительских элементов контейнера.
