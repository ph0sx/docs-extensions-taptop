<div id="drag-drop-generator" class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройка Перетаскивания Элементов (Drag & Drop)</div>
    <div class="generator-subtitle">Определите, какие элементы можно перетаскивать, как они будут себя вести, и куда их можно сбрасывать.</div>
  </div>

  <div class="settings-block">
    <div class="settings-section">
      <div class="settings-section-title">1. Настройки перетаскиваемых элементов и их ограничений</div>
      <div class="settings-row">
        <div class="setting-group">
          <div class="label-with-tooltip">
            <label for="dnd-draggable-selector">CSS-класс элементов для перетаскивания <span class="required-indicator">*</span></label>
            <span class="tooltip-icon" data-tooltip="Укажите CSS-класс (без точки), который назначен элементам, которые должны стать перетаскиваемыми. Можно указать несколько классов через запятую. Например: draggable-item, card">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
          <input type="text" id="dnd-draggable-selector" class="text-input" placeholder="Например: draggable-item, card, widget">
          <div class="helper-text">Укажите CSS-класс (или несколько классов через запятую, без точек), который назначен элементам, которые должны стать перетаскиваемыми.</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="setting-group">
          <div class="label-with-tooltip">
            <label for="dnd-containment-type">Ограничить перемещение:</label>
            <span class="tooltip-icon" data-tooltip="Определяет область, в которой элемент может перемещаться. 'Нет ограничений' - элемент может выходить за пределы экрана. 'Родительским элементом' - элемент не выйдет за границы своего прямого родителя. 'Вьюпортом' - элемент останется в видимой части окна. 'Пользовательским селектором' - укажите класс контейнера.">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
          <select id="dnd-containment-type" class="select-styled">
            <option value="none" selected>Нет ограничений (может выходить за пределы экрана)</option>
            <option value="parent">Родительским элементом</option>
            <option value="viewport">Вьюпортом (экраном)</option>
            <option value="custom">Пользовательским селектором</option>
          </select>
          <div class="helper-text">Выберите, как будет ограничено движение элемента.</div>
</div>
<div class="setting-group" id="dnd-custom-containment-group" style="display: none;">
          <div class="label-with-tooltip">
            <label for="dnd-custom-containment-selector">CSS-селектор контейнера-ограничителя:</label>
            <span class="tooltip-icon" data-tooltip="Если выбрано ограничение 'Пользовательским селектором', укажите здесь CSS-класс этого контейнера (без точки). Например: drag-area">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
  <input type="text" id="dnd-custom-containment-selector" class="text-input" placeholder="Например: drag-area">
  <div class="helper-text">Укажите CSS-класс (например, <code>my-container</code>) или ID (например, <code>#myContainer</code>).</div>
</div>
        <div class="setting-group">
          <div class="label-with-tooltip">
            <label for="dnd-axis">Разрешенные оси перемещения:</label>
            <span class="tooltip-icon" data-tooltip="Определяет, можно ли перемещать элемент по горизонтали (X), по вертикали (Y) или в любом направлении (XY).">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
          <select id="dnd-axis" class="select-styled">
            <option value="xy" selected>Горизонтально и вертикально (xy)</option>
            <option value="x">Только горизонтально (x)</option>
            <option value="y">Только вертикально (y)</option>
          </select>
          <div class="helper-text">Определяет, в каком направлении можно перемещать элемент.</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="setting-group">
          <div class="label-with-tooltip">
            <label class="checkbox-container">
              <input type="checkbox" id="dnd-inertia">
              <span class="checkmark"></span>
              <span class="checkbox-option-label">Включить эффект инерции</span>
            </label>
            <span class="tooltip-icon" data-tooltip="Придает движению элемента плавное затухание после отпускания, имитируя физическую инерцию.">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
          <div class="helper-text" style="margin-left: 35px;">Придает движению элемента плавное затухание после отпускания.</div>
        </div>
      </div>
    </div>
    </div>
<div class="settings-block">      
<div class="settings-section">
        <div class="settings-section-title">2. Внешний вид и поведение при перетаскивании</div>
        <div class="settings-row">
          <div class="setting-group">
            <div class="label-with-tooltip">
              <label for="dnd-hover-cursor">Курсор при наведении на элемент:</label>
              <span class="tooltip-icon" data-tooltip="Выберите стиль курсора, который будет отображаться при наведении мыши на перетаскиваемый элемент (до его захвата).">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
              </span>
            </div>
            <select id="dnd-hover-cursor" class="select-styled">
              <option value="grab" selected>🖐️ Схватить (grab) - По умолч.</option>
              <option value="pointer">👉 Указатель (pointer)</option>
              <option value="move">✥ Перемещение (move)</option>
              <option value="auto">Стиль браузера</option>
            </select>
            <div class="helper-text">Стиль курсора при наведении (до захвата).</div>
          </div>
          <div class="setting-group">
            <div class="label-with-tooltip">
              <label for="dnd-dragging-cursor">Курсор во время перетаскивания:</label>
              <span class="tooltip-icon" data-tooltip="Выберите стиль курсора, который будет отображаться непосредственно в процессе перетаскивания элемента.">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
              </span>
            </div>
            <select id="dnd-dragging-cursor" class="select-styled">
              <option value="grabbing" selected>✊ Захвачено (grabbing) - По умолч.</option>
              <option value="move">✥ Перемещение (move)</option>
              <option value="no-change">Без изменений от hover</option>
              <option value="none">🚫 Скрыть курсор (none)</option>
              <option value="auto">Стиль браузера</option>
            </select>
            <div class="helper-text">Стиль курсора в процессе перетаскивания.</div>
          </div>
        </div>
        <div class="settings-row">
            <div class="setting-group">
                <div class="label-with-tooltip">
                  <label for="dnd-drag-opacity-slider">Прозрачность элемента:</label>
                  <span class="tooltip-icon" data-tooltip="От 0.0 (полностью прозрачный) до 1.0 (непрозрачный). Определяет видимость элемента во время перетаскивания.">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
                  </span>
                </div>
                <div class="slider-container">
                  <input type="range" id="dnd-drag-opacity-slider" class="slider" min="0" max="1" value="1" step="0.05">
                  <div class="slider-value">
                    <span id="dnd-drag-opacity-value" class="slider-value-primary">1.0</span>
                  </div>
                </div>
                <div class="helper-text">Значение от 0.0 (невидимый) до 1.0 (непрозрачный).</div>
            </div>
            <div class="setting-group">
                <div class="label-with-tooltip">
                  <label for="dnd-drag-scale-slider">Масштаб элемента:</label>
                  <span class="tooltip-icon" data-tooltip="От 0.5 (уменьшение в 2 раза) до 2.0 (увеличение в 2 раза). Значение 1.0 - без изменений.">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
                  </span>
                </div>
                <div class="slider-container">
                  <input type="range" id="dnd-drag-scale-slider" class="slider" min="0.5" max="2" value="1" step="0.05">
                  <div class="slider-value">
                    <span id="dnd-drag-scale-value" class="slider-value-primary">1.0x</span>
                  </div>
                </div>
                <div class="helper-text">1.0x - нормальный размер.</div>
            </div>
        </div>
        <div class="helper-text">Эти стили будут применены к элементу в дополнение к классу <code>.is-dragging</code>. Класс <code>.is-dragging</code> вы можете стилизовать самостоятельно в Taptop для других эффектов (например, тени).</div>
  </div>
    </div>

  <div class="settings-block">
    <div class="settings-section">
      <div class="settings-section-title">3. Настройка зон сброса (Dropzones)</div>
      <div id="dnd-dropzone-rules-container">
        </div>
      <button id="dnd-add-dropzone-rule-button" class="add-rule-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Добавить зону сброса
      </button>
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
          <li>Убедитесь, что на странице есть элементы с указанными CSS-классами.</li>
          <li>Сохраните настройки и опубликуйте страницу.</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

<template id="dnd-dropzone-rule-template">
  <div class="rule-card dnd-dropzone-rule-card" data-rule-id="">
    <div class="rule-header">
      <div class="rule-title">Зона сброса <span class="rule-badge rule-number">1</span></div>
      <button class="remove-rule-button" type="button" aria-label="Удалить зону сброса">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="rule-body">
      <div class="settings-row">
        <div class="setting-group">
          <label for="dnd-dropzone-selector-template">CSS-класс зоны сброса <span class="required-indicator">*</span></label>
          <input type="text" class="text-input dnd-dropzone-selector" id="dnd-dropzone-selector-template" name="dropzoneSelector" placeholder="Например: drop-target-area">
          <div class="helper-text">Укажите CSS-класс элемента, который будет служить зоной для сброса.</div>
        </div>
        <div class="setting-group">
          <label for="dnd-accept-draggables-template">CSS-класс принимаемых элементов <span class="required-indicator">*</span></label>
          <input type="text" class="text-input dnd-accept-draggables" id="dnd-accept-draggables-template" name="acceptDraggables" placeholder="Например: draggable-item">
          <div class="helper-text">Укажите CSS-класс перетаскиваемых элементов, которые можно сбросить в эту зону.</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="setting-group">
          <label for="dnd-ondragenter-class-template">CSS-класс для зоны при перетаскивании над ней (опционально)</label>
          <input type="text" class="text-input dnd-ondragenter-class" id="dnd-ondragenter-class-template" name="onDragEnterClass" placeholder="Например: drop-active">
          <div class="helper-text">Этот класс будет добавлен зоне, когда совместимый элемент перетаскивается над ней.</div>
        </div>
        <div class="setting-group">
          <label for="dnd-candrop-class-template">CSS-класс для перетаскиваемого элемента над зоной (опционально)</label>
          <input type="text" class="text-input dnd-candrop-class" id="dnd-candrop-class-template" name="canDropClass" placeholder="Например: can-be-dropped">
          <div class="helper-text">Этот класс будет добавлен перетаскиваемому элементу, когда он находится над этой зоной и может быть сброшен.</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="setting-group">
          <label for="dnd-ondrop-draggable-class-template">CSS-класс для ЭЛЕМЕНТА после сброса (опционально)</label>
          <input type="text" class="text-input dnd-ondrop-draggable-class" id="dnd-ondrop-draggable-class-template" name="onDropDraggableClass" placeholder="Например: item-placed">
          <div class="helper-text">Если указан, этот класс будет добавлен к перетаскиваемому элементу после сброса в эту зону.</div>
        </div>
        <div class="setting-group">
          <label for="dnd-ondrop-dropzone-class-template">CSS-класс для ЗОНЫ после сброса (опционально)</label>
          <input type="text" class="text-input dnd-ondrop-dropzone-class" id="dnd-ondrop-dropzone-class-template" name="onDropDownzoneClass" placeholder="Например: zone-filled">
          <div class="helper-text">Если указан, этот класс будет добавлен к зоне сброса после сброса в нее элемента.</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="setting-group">
          <div class="label-with-tooltip">
            <label for="dnd-drop-behavior-template">Поведение элемента после сброса:</label>
            <span class="tooltip-icon" data-tooltip="Определяет, что произойдет с элементом после сброса в эту зону. 'Ничего не делать' - элемент остается там, где его сбросили. 'По центру' - элемент автоматически перемещается в центр зоны. 'Скрыть элемент' - элемент становится невидимым.">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
          <select class="select-styled dnd-drop-behavior" id="dnd-drop-behavior-template" name="dropBehavior">
            <option value="none">⚫ Ничего не делать (оставить где сбросили)</option>
            <option value="center" selected>📍 По центру зоны</option>
            <option value="hide">👻 Скрыть элемент</option>
          </select>
          <div class="helper-text">Выберите, что произойдет с элементом после сброса.</div>
        </div>
      </div>
      
      <div class="settings-row">
        <div class="setting-group">
          <div class="label-with-tooltip">
            <label class="checkbox-container">
              <input type="checkbox" class="dnd-snap-and-lock" id="dnd-snap-and-lock-template" name="snapAndLock">
              <span class="checkmark"></span>
              <span class="checkbox-option-label">Запретить дальнейшее перетаскивание после сброса</span>
            </label>
            <span class="tooltip-icon" data-tooltip="При включении элемент будет заблокирован от дальнейшего перетаскивания после сброса в эту зону, и курсор над ним будет скрыт.">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></svg>
            </span>
          </div>
          <div class="helper-text" style="margin-left: 35px;">Элемент будет заблокирован от дальнейшего перетаскивания и курсор над ним будет скрыт.</div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
