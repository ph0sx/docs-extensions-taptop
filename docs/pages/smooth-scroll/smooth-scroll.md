# Плавный скролл

Расширение добавляет на сайт эффект плавного скролла страницы. Работает во всех современных браузерах и поддерживает управление с клавиатуры и сенсорных устройств.

## Использование генератора кода

1. Выберите подходящий пресет или настройте параметры вручную
2. Нажмите кнопку "Сгенерировать код"
3. Сгенерированный код будет автоматически скопирован в буфер обмена

## Генератор кода

<div class="generator-container">
  <div class="generator-header">
    <div class="generator-title">Настройте параметры плавного скролла</div>
    <div class="generator-subtitle">Выберите подходящие настройки для вашего сайта</div>
  </div>
  
  <div class="settings-block">
    <div class="preset-section">
      <label for="preset-select">Готовые пресеты:</label>
      <select id="preset-select" class="select-styled">
        <option value="universal">Универсальный</option>
        <option value="premium">Премиальный</option>
        <option value="fast">Быстрый</option>
        <option value="slow">Медленный</option>
        <option value="reading">Для чтения</option>
      </select>
      <div class="helper-text" id="preset-description">Универсальный вариант для большинства сайтов</div>
    </div>
    
    <div class="settings-tabs">
      <div class="tab-buttons">
        <button id="basic-tab-btn" class="tab-button active">Основные настройки</button>
        <button id="advanced-tab-btn" class="tab-button">Дополнительные настройки</button>
      </div>
      
      <div id="basic-tab" class="tab-content active">
        <div class="settings-row">
          <div class="setting-group">
            <label for="speed-select">Скорость прокрутки:</label>
            <div class="slider-container">
              <input type="range" id="speed-select" min="0" max="100" value="60" class="slider">
              <div class="slider-labels">
                <span>Медленно</span>
                <span>Быстро</span>
              </div>
              <div class="slider-value">
                <span id="speed-value-display">60%</span>
                <span id="speed-time-display">~580мс</span>
              </div>
            </div>
            <div class="helper-text">Определяет, как быстро будет происходить прокрутка страницы</div>
          </div>
          
          <div class="setting-group">
            <label for="smoothness-select">Плавность анимации:</label>
            <div class="slider-container">
              <input type="range" id="smoothness-select" min="0" max="100" value="70" class="slider">
              <div class="slider-labels">
                <span>Линейная</span>
                <span>Максимальная</span>
              </div>
              <div class="slider-value">
                <span id="smoothness-value-display">70%</span>
                <span id="easing-type-display">Естественная (Natural)</span>
              </div>
            </div>
            <div class="helper-text">Влияет на характер ускорения и замедления при прокрутке</div>
          </div>
        </div>
        
        <div class="device-support">
          <div class="support-option">
            <label class="checkbox-container">
              <input type="checkbox" id="keyboard-support" checked>
              <span class="checkmark"></span>
              <span class="option-label">Поддержка клавиатуры</span>
            </label>
            <div class="helper-text">Включает плавную прокрутку при использовании стрелок и клавиш навигации</div>
          </div>
          
          <div class="support-option">
            <label class="checkbox-container">
              <input type="checkbox" id="mobile-support" checked>
              <span class="checkmark"></span>
              <span class="option-label">Оптимизация для мобильных устройств</span>
            </label>
            <div class="helper-text">Добавляет плавный скролл при свайпах на сенсорных экранах</div>
          </div>
        </div>
      </div>
      
      <div id="advanced-tab" class="tab-content">
        <div class="settings-row">
          <div class="setting-group">
            <label for="duration-input">Точное время скролла (мс):</label>
            <input type="number" id="duration-input" class="number-input" value="600" min="300" max="1500" step="50">
            <div class="helper-text">Продолжительность анимации (рекомендуется 400-800 мс для комфортной скорости)</div>
          </div>
          
          <div class="setting-group">
            <label for="step-input">Размер шага при прокрутке (px):</label>
            <input type="number" id="step-input" class="number-input" value="120" min="50" max="300" step="10">
            <div class="helper-text">На сколько пикселей прокручивается страница за одно событие колеса мыши (рекомендуется 100-200px)</div>
          </div>
        </div>
        
        <div class="settings-row">
          <div class="setting-group">
            <label for="easing-select">Эффект затухания:</label>
            <select id="easing-select" class="select-styled">
              <option value="standard">Обычное</option>
              <option value="precise">Длительное</option>
              <option value="minimal">Мгновенное</option>
            </select>
            <div class="helper-text">Определяет характер замедления и остановки при прокрутке</div>
          </div>
          
          <div class="setting-group keyboard-option">
            <label for="keyboard-step">Шаг скролла при нажатии клавиш (px):</label>
            <input type="number" id="keyboard-step" class="number-input" value="200" min="50" max="400" step="10">
            <div class="helper-text">На сколько пикселей прокручивается страница при нажатии стрелок (рекомендуется 150-300px)</div>
          </div>
        </div>
        
        <div class="settings-row">
          <div class="setting-group">
            <label for="exclude-selectors">Исключить элементы (пользовательские классы):</label>
            <input type="text" id="exclude-selectors" class="text-input" placeholder="map, slider, gallery">
            <div class="helper-text">Классы элементов (через запятую, без точек)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="action-section">
    <button id="generate-button" class="generate-button">
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
          <li>Откройте настройки страницы в конструкторе</li>
          <li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
          <li>Сохраните изменения на странице</li>
        </ol>
      </div>
      
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

## Установка на сайт

1. Откройте настройки страницы в конструкторе сайта
2. Найдите блок "Внутри тега body" и вставьте скопированный код
3. Сохраните изменения
