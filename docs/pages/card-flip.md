# Переворот карточки

Это расширение позволяет добавить интерактивный 3D-эффект переворота для любого блока на вашей странице Taptop, элегантно показывая его лицевую и обратную стороны при взаимодействии пользователя.

---

## Подготовка в Taptop

Перед использованием генератора кода **обязательно** подготовьте правильную структуру элементов в редакторе Taptop. Некорректная структура — самая частая причина проблем.

1.  **Создайте основной блок:** Добавьте на страницу `Div Block` (или другой контейнерный элемент). Это будет **основной блок-контейнер**, к которому применится эффект переворота.
2.  **Задайте уникальный CSS-класс контейнеру:** Выделите этот основной блок и в панели стилей присвойте ему **уникальный CSS-класс**. Например: `my-flip-card` или `service-card-flipper`.
    <div style="max-width: 600px; margin: 20px auto; text-align: center;">
    <img src="./images/card-flip/flip-container.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
     <p style="margin-top: 10px; font-style: italic; color: #666;">Запомните или скопируйте это имя класса – оно потребуется в поле "CSS-класс основного блока-контейнера" генератора ниже.</p>
    </div>

3.  **Задайте размеры контейнеру:** Убедитесь, что у **основного блока-контейнера** (с вашим уникальным классом) заданы **конкретные размеры** (ширина и высота) в панели стилей Taptop. Это необходимо для корректного отображения карточки.
4.  **Создайте ДВА Дочерних Блока:** **Внутрь** основного блока-контейнера поместите **ровно два** дочерних блока (например, еще два `Div Block`).
    <div style="max-width: 600px; margin: 20px auto; text-align: center; display: flex;">
    <div>
      <img src="./images/card-flip/flip-front.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
      <p style="margin-top: 10px; font-style: italic; color: #666;">Первый дочерний блок будет лицевой стороной.</p>
    </div>
    <div>
      <img src="./images/card-flip/flip-back.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
      <p style="margin-top: 10px; font-style: italic; color: #666;">Второй дочерний блок будет обратной стороной.</p>
    </div>
    </di>

5.  **Присвойте Классы Сторонам:**
    - Выделите **первый** дочерний блок и присвойте ему **обязательный CSS-класс:** `flip-front`.
    <div style="max-width: 600px; margin: 20px auto; text-align: center;">
    <img src="./images/card-flip/flip-front-selector.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
    </div>
    - Выделите **второй** дочерний блок и присвойте ему **обязательный CSS-класс:** `flip-back`.
    <div style="max-width: 600px; margin: 20px auto; text-align: center;">
    <img src="./images/card-flip/flip-back-selector.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
    </div>
6.  **Добавьте Контент и Стили:**
    - Весь контент (текст, изображения, кнопки и т.д.) для **лицевой** стороны разместите **внутри** блока с классом `flip-front`.
    - Весь контент для **обратной** стороны разместите **внутри** блока с классом `flip-back`.
    - **Применяйте стили** (фон, цвет текста, отступы, рамки и т.д.) **непосредственно к блокам `flip-front` и `flip-back`** с помощью стандартных инструментов Taptop. Скрипт сохранит эти стили.

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/card-flip/structure.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
 <p style="margin-top: 10px; font-style: italic; color: #666;">Пример правильной структуры</p>
</div>

!> **ВАЖНО!** Соблюдайте именно такую структуру: один контейнер с вашим классом, и внутри него **сразу** два блока с классами `flip-front` и `flip-back`. Не добавляйте другие элементы между контейнером и этими двумя блоками. Стили сторон применяйте именно к `flip-front` и `flip-back`.

---

## Генератор кода

<div id="card-flip-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка эффекта "Card Flip"</div>
    <div class="generator-subtitle">Выберите параметры анимации переворота для вашего блока.</div>
  </div>
  <div class="settings-block">
    <div class="settings-section">
        <div class="settings-section-title">1. Целевой блок</div>
         <div class="settings-row">
            <div class="setting-group">
                <label for="cf-container-selector">CSS-класс основного блока-контейнера <span class="required-indicator">*</span></label>
                <input type="text" id="cf-container-selector" class="text-input" placeholder="Например: my-flip-card" required>
                <div class="helper-text">Класс, который вы присвоили основному блоку в Taptop (см. инструкцию выше). Без точки в начале.</div>
            </div>
         </div>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">2. Настройки анимации</div>
       <div class="settings-row">
         <div class="setting-group">
             <label>Триггер переворота</label>
              <div class="radio-group-row">
                 <label class="radio-container">
                   <input type="radio" name="cf-trigger" value="click" checked>
                   <span class="radio-checkmark"></span> Клик (Рекомендуется)
                 </label>
                 <label class="radio-container">
                   <input type="radio" name="cf-trigger" value="hover">
                   <span class="radio-checkmark"></span> Наведение мыши
                 </label>
              </div>
              <div class="helper-text">Как пользователь будет активировать переворот. "Клик" работает на всех устройствах.</div>
          </div>
           <div class="setting-group">
             <label>Направление переворота</label>
              <div class="radio-group-row">
                 <label class="radio-container">
                   <input type="radio" name="cf-direction" value="horizontal" checked>
                   <span class="radio-checkmark"></span> Горизонтально (↔)
                 </label>
                 <label class="radio-container">
                   <input type="radio" name="cf-direction" value="vertical">
                   <span class="radio-checkmark"></span> Вертикально (↕)
                 </label>
              </div>
               <div class="helper-text">Вокруг какой оси будет вращаться карточка.</div>
          </div>
      </div>
       <div class="settings-row">
          <div class="setting-group">
            <label for="cf-speed-slider">Скорость анимации</label>
            <div class="slider-container">
                <input type="range" id="cf-speed-slider" class="slider" min="200" max="2500" value="750" step="50">
                 <div class="slider-labels">
                    <span>Быстро</span>
                    <span>Медленно</span>
                 </div>
                 <div class="slider-value">
                    <span id="cf-speed-value-display" class="slider-value-primary">750мс</span>
                 </div>
             </div>
            <div class="helper-text">Длительность анимации переворота (в миллисекундах).</div>
          </div>
           <div class="setting-group" id="cf-animation-style-group"> 
             <label for="cf-animation-style">Стиль анимации (Горизонтальный)</label>
             <select id="cf-animation-style" class="select-styled">
                 <option value="default" selected>Объемный 3D (с подъемом)</option>
                 <option value="flat">Плоский 2D (без подъема)</option>
             </select>
             <div class="helper-text">"Плоский" может помочь, если карта выходит за рамки.</div>
          </div>
       </div>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">3. 3D Эффекты и Стиль</div>
       <div class="settings-row">
           <div class="setting-group">
            <label for="cf-border-radius">Скругление углов (px)</label>
            <input type="number" id="cf-border-radius" class="number-input" value="8" min="0" max="100" step="1">
            <div class="helper-text">Радиус скругления углов карточки. Указывайте такой же, как и в редакторе Taptop</div>
           </div>
           <div class="setting-group" id="cf-flip-height-group"> 
            <label for="cf-flip-height">Высота подъема (0-100)</label>
             <div class="slider-container">
                <input type="range" id="cf-flip-height" class="slider" min="0" max="100" value="50" step="1">
                 <div class="slider-labels">
                    <span>Нет</span>
                    <span>Макс.</span>
                 </div>
                 <div class="slider-value">
                    <span id="cf-flip-height-value-display" class="slider-value-primary">50%</span>
                 </div>
             </div>
            <div class="helper-text">Интенсивность 3D "подъема" при объемной анимации (видна только для стиля "Объемный 3D").</div>
           </div>
        </div>
    </div>
  </div>
  <div class="settings-section preview-section">
        <div class="settings-section-title preview-title">Предпросмотр</div>
        <div id="cf-preview-area" class="preview-area" aria-live="polite">
          <span id="cf-preview-placeholder" class="preview-placeholder">Настройте параметры выше, чтобы увидеть предпросмотр.</span>
          <div id="cf-preview-error" class="preview-error" style="display: none;"></div>
        </div>
        <div class="helper-text preview-helper">Кликните или наведите курсор (в зависимости от настроек триггера) на область выше, чтобы увидеть анимацию. Внешний вид (фон, текст) будет зависеть от ваших стилей в Taptop.</div>
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
          <li>Убедитесь, что вы подготовили структуру блоков в Taptop согласно инструкции в начале этой страницы.</li>
          <li>Откройте настройки страницы в Taptop (иконка шестеренки).</li>
          <li>В блоке <strong>"Перед тегом body"</strong> вставьте сгенерированный код.</li>
          <li>Опубликуйте страницу.</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>
</div>

---

## Решение возможных проблем

!> **Карточка не переворачивается / Расширение не работает:**

- **Проверьте CSS-класс Контейнера:** Убедитесь, что класс, введенный в генераторе, **в точности совпадает** с классом основного блока-контейнера в Taptop (без точки, регистр важен).
- **Проверьте классы Сторон:** Убедитесь, что **прямые** дочерние элементы внутри контейнера имеют классы `flip-front` и `flip-back`. Проверьте на опечатки.
- **Проверьте Структуру:** Убедитесь, что структура в Taptop соответствует описанной выше (Контейнер > `flip-front` + `flip-back`). Между контейнером и сторонами не должно быть других элементов.
- **Код вставлен?** Проверьте, что сгенерированный `<script>` вставлен в настройки страницы Taptop в блок **"Перед тегом `</body>`"**.
- **Страница опубликована?** Изменения вступают в силу только после публикации.
- **Ошибки в консоли:** Откройте консоль браузера (F12 -> Console) на опубликованной странице. Нет ли там ошибок, связанных с `FlipCard` или скриптом расширения?

!> **Стили (фон, отступы и т.д.) не применяются к сторонам карточки:**

- Убедитесь, что вы применяете стили **непосредственно к блокам с классами `flip-front` и `flip-back`** в редакторе Taptop, а не к их родительскому контейнеру.

!> **Карточка выходит за границы при горизонтальном перевороте:**

- В генераторе выберите **Стиль анимации (Горизонтальный): "Плоский 2D (без подъема)"**. Это отключит 3D-эффект "подъема", который может вызывать эту проблему.

!> **Несколько карточек на странице:**

- **Один и тот же класс:** Если вы используете **один и тот же** CSS-класс для нескольких контейнеров карточек, достаточно сгенерировать и вставить скрипт **один раз**. Он автоматически применится ко всем элементам с этим классом.
- **Разные классы:** Если вы используете **разные** CSS-классы для разных карточек (например, для разных настроек анимации), вам нужно будет сгенерировать код для **каждого** класса отдельно и вставить **все** сгенерированные скрипты на страницу.

!> **Странный 3D-эффект при наличии нескольких карточек рядом:**

- Для наилучшего визуального результата с несколькими 3D-карточками рекомендуется создать для них **общий родительский контейнер** в Taptop. Этому общему контейнеру через пользовательские свойства Taptop задайте `perspective: 1000px;` (или другое значение). А **каждому** из ваших контейнеров карточек (`.my-flip-card` и т.п.) добавьте `perspective: none;`. Это создаст единую точку обзора.
