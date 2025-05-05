# Мультилендинг UTM/IP

Расширение, которое позволяет менять содержимое сайта в зависимости от IP и UTM-параметров. Позволяет реализовать персонализацию контента без необходимости создания множества отдельных страниц.

## Как работает расширение

- **Замена текста** — подстановка разных значений в шаблоны текста в зависимости от UTM-параметров
- **Управление блоками** — показ или скрытие определённых блоков на странице на основе UTM-параметров
- **Правила по IP** — персонализация контента в зависимости от страны, города или региона посетителя

## Установка на сайт

1. Воспользуйтесь генератором кода
2. Настройте необходимые правила замены текста и управления блоками
3. Нажмите кнопку "Сгенерировать код"
4. Скопируйте полученный JavaScript-код
5. Откройте настройки страницы в Taptop
6. Найдите блок "Перед тегом body" и вставьте скопированный код
7. Сохраните изменения

## Генератор кода

<div class="dcm-container">
  <div class="generator-container">
    <!-- Header section -->
    <div class="generator-header-simple">
      <div class="generator-text-simple">
        <div class="generator-title">Мультилендинг UTM/IP</div>
        <div class="generator-subtitle">Настройте правила для изменения контента вашего сайта в зависимости от UTM-параметров и географии посетителя</div>
      </div>
    </div>
    <!-- Обновленные вкладки в стиле обычных табов -->
    <div class="tab-buttons">
      <button id="text-tab-btn" class="tab-button active" data-tab="text">
        <span class="tab-label">Замена текста</span>
      </button>
      <button id="blocks-tab-btn" class="tab-button" data-tab="blocks">
        <span class="tab-label">Управление блоками</span>
      </button>
      <button id="ip-tab-btn" class="tab-button" data-tab="ip">
        <span class="tab-label">Правила по IP</span>
      </button>
    </div>
    <!-- Enhanced tabs with cleaner design -->
    <div class="tabs-container">
      <!-- Вкладка замены текста -->
      <div id="text-tab" class="tab-content active">
        <div class="tab-intro">
          <div class="intro-text">
            <h2>Замена текста</h2>
            <p>Настройте динамическую замену текста в зависимости от UTM-параметров в URL.</p>
          </div>
          <div class="tooltip-container">
            <button class="tooltip-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="tooltip-content">
              <p>Используйте шаблон <code>%%ключ%%</code> в тексте на странице. Система автоматически заменит его значением в зависимости от UTM-параметров.</p>
              <p><strong>Пример:</strong> Добавьте <code>%%phone%%</code> в текст, и система подставит нужный номер телефона в зависимости от источника трафика.</p>
            </div>
          </div>
        </div>
        <div id="text-replacements-container" class="cards-container">
          <!-- Динамически добавляемые карточки для замены текста -->
        </div>
        <button id="add-text-replacement" class="add-card-button">
          <span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Добавить замену текста
          </span>
        </button>
      </div>
      <!-- Вкладка управления блоками -->
      <div id="blocks-tab" class="tab-content">
        <div class="tab-intro">
          <div class="intro-text">
            <h2>Управление блоками</h2>
            <p>Настройка правил отображения элементов в зависимости от UTM-параметров в URL.</p>
          </div>
          <div class="tooltip-container">
            <button class="tooltip-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="tooltip-content">
              <p>Укажите классы блоков, которые нужно показать или скрыть при определенных UTM-параметрах.</p>
              <p><strong>Важно:</strong> Указывайте только название класса без точки, например: <code>header-block</code> или <code>promo</code></p>
            </div>
          </div>
        </div>
        <div class="settings-card">
          <h3 class="settings-title">Настройки по умолчанию</h3>
          <p class="helper-text">Эти блоки будут показаны/скрыты, если не сработает ни одно из правил UTM.</p>
          <div class="form-row">
            <div class="form-group">
              <label for="default-show-blocks">Показать блоки (через запятую)</label>
              <input type="text" id="default-show-blocks" class="text-input" placeholder="block1, block2">
            </div>
            <div class="form-group">
              <label for="default-hide-blocks">Скрыть блоки (через запятую)</label>
              <input type="text" id="default-hide-blocks" class="text-input" placeholder="block3, block4">
            </div>
          </div>
        </div>
        <div id="block-visibility-container" class="cards-container">
          <!-- Динамически добавляемые правила видимости блоков -->
        </div>
        <button id="add-block-rule" class="add-card-button">
          <span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Добавить правило видимости
          </span>
        </button>
      </div>
      <!-- Вкладка правил по IP -->
      <div id="ip-tab" class="tab-content">
        <div class="tab-intro">
          <div class="intro-text">
            <h2>Правила по IP</h2>
            <p>Настройка правил отображения контента в зависимости от местоположения посетителя.</p>
          </div>
          <div class="tooltip-container">
            <button class="tooltip-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="tooltip-content">
              <p>Укажите страну, город и регион посетителя для применения правил. Используйте звездочку (*) для обозначения любого значения.</p>
              <p><strong>Пример:</strong> Используйте <code>Russia</code> в поле страны и <code>*</code> в поле города, чтобы правило применялось для всех посетителей из России.</p>
            </div>
          </div>
        </div>
        <div id="ip-rules-container" class="cards-container">
          <!-- Динамически добавляемые правила для IP -->
        </div>
        <button id="add-ip-rule" class="add-card-button">
          <span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Добавить IP правило
          </span>
        </button>
      </div>
    </div>
    <!-- Кнопка генерации кода -->
    <div class="generate-button-container">
      <button id="generate-btn" class="generate-button">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        <span>Сгенерировать код</span>
      </button>
    </div>
  </div>
  <!-- Модальное окно -->
<!-- Модальное окно -->
<div id="success-modal" class="dcm-modal modal">
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
        <li>В блоке <strong>Перед тегом body</strong> вставьте сгенерированный код</li>
        <li>Сохраните изменения на странице</li>
      </ol>
    </div>
    <button class="close-button">Понятно</button>
  </div>
</div>

<!-- Шаблоны для динамического создания элементов -->
<template id="text-replacement-template">
  <div class="dcm-card text-replacement">
    <div class="card-header">
      <div class="card-index-label">Правило <span class="rule-index">1</span></div>
      <button class="dcm-remove-button remove-text-replacement" aria-label="Удалить">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Ключ (будет использован как <code>%%ключ%%</code> в тексте)</label>
        <input type="text" class="keyword-input text-input" placeholder="phone">
      </div>
      <div class="form-group">
        <label>Текст по умолчанию</label>
        <input type="text" class="default-value-input text-input" placeholder="+7 (999) 123-45-67">
      </div>
    </div>
    <div class="section-divider">
      <span>UTM правила</span>
    </div>
    <div class="utm-rules-container">
      <!-- Динамически добавляемые UTM правила -->
    </div>
    <button class="add-rule-button add-utm-rule">
      <span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Добавить UTM правило
      </span>
    </button>
  </div>
</template>
<template id="utm-rule-template">
  <div class="dcm-rule utm-rule">
    <div class="rule-header">
      <span class="utm-index-badge">UTM <span class="utm-rule-index">1</span></span>
      <button class="dcm-remove-button remove-utm-rule" aria-label="Удалить">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Параметр URL</label>
        <div class="select-container">
          <select class="param-name-select select-input">
            <option value="utm_source">utm_source</option>
            <option value="utm_medium">utm_medium</option>
            <option value="utm_campaign">utm_campaign</option>
            <option value="utm_content">utm_content</option>
            <option value="utm_term">utm_term</option>
            <option value="custom">Своя метка</option>
          </select>
        </div>
      </div>
      <div class="form-group dcm-custom-param-container" style="display: none;">
        <label>Название своей метки</label>
        <input type="text" class="custom-param-input text-input" placeholder="my_param">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Значение параметра</label>
        <input type="text" class="param-value-input text-input" placeholder="facebook">
      </div>
      <div class="form-group">
        <label>Текст замены</label>
        <input type="text" class="replacement-value-input text-input" placeholder="+7 (999) 111-11-11">
      </div>
    </div>
  </div>
</template>
<template id="block-rule-template">
  <div class="dcm-card block-rule">
    <div class="card-header">
      <div class="card-index-label">Блок <span class="rule-index">1</span></div>
      <button class="dcm-remove-button remove-block-rule" aria-label="Удалить">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Параметр URL</label>
        <div class="select-container">
          <select class="param-name-select select-input">
            <option value="utm_source">utm_source</option>
            <option value="utm_medium">utm_medium</option>
            <option value="utm_campaign">utm_campaign</option>
            <option value="utm_content">utm_content</option>
            <option value="utm_term">utm_term</option>
            <option value="custom">Своя метка</option>
          </select>
        </div>
      </div>
      <div class="form-group dcm-custom-param-container" style="display: none;">
        <label>Название своей метки</label>
        <input type="text" class="custom-param-input text-input" placeholder="my_param">
      </div>
      <div class="form-group">
        <label>Значение параметра</label>
        <input type="text" class="param-value-input text-input" placeholder="spring_sale">
      </div>
    </div>
    <div class="section-divider">
      <span>Настройка видимости</span>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Показать блоки (через запятую)</label>
        <input type="text" class="show-blocks-input text-input" placeholder="block1, block2">
      </div>
      <div class="form-group">
        <label>Скрыть блоки (через запятую)</label>
        <input type="text" class="hide-blocks-input text-input" placeholder="block3, block4">
      </div>
    </div>
  </div>
</template>
<template id="ip-rule-template">
  <div class="dcm-card ip-rule">
    <div class="card-header">
      <div class="card-index-label">Регион <span class="rule-index">1</span></div>
      <button class="dcm-remove-button remove-ip-rule" aria-label="Удалить">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Страна</label>
        <div class="input-with-icon">
          <input type="text" class="country-input text-input" placeholder="Russia или * для любой">
          <button class="input-icon-button show-countries-list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <p class="helper-text">Название страны на английском (Russia, Belarus)</p>
      </div>
      <div class="form-group">
        <label>Город</label>
        <input type="text" class="city-input text-input" placeholder="Moscow или * для любого" value="*">
        <p class="helper-text">Название города на английском или * для любого</p>
      </div>
      <div class="form-group">
        <label>Регион</label>
        <input type="text" class="region-input text-input" placeholder="* для любого" value="*">
        <p class="helper-text">Название региона на английском или * для любого</p>
      </div>
    </div>
    <div class="section-divider">
      <span>Замены текста</span>
    </div>
    <div class="ip-text-replacements-container">
      <!-- Динамически добавляемые замены текста для IP правила -->
    </div>
    <button class="add-rule-button add-ip-text-replacement">
      <span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Добавить замену текста
      </span>
    </button>
    <div class="section-divider">
      <span>Настройка видимости</span>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Показать блоки (через запятую)</label>
        <input type="text" class="show-blocks-input text-input" placeholder="block_ru">
      </div>
      <div class="form-group">
        <label>Скрыть блоки (через запятую)</label>
        <input type="text" class="hide-blocks-input text-input" placeholder="block_en">
      </div>
    </div>
  </div>
</template>
<template id="ip-text-replacement-template">
  <div class="dcm-rule ip-text-replacement">
    <div class="rule-header">
      <span class="utm-index-badge">Замена <span class="ip-replacement-index">1</span></span>
      <button class="dcm-remove-button remove-ip-text-replacement" aria-label="Удалить">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Ключ</label>
        <input type="text" class="keyword-input text-input" placeholder="region">
      </div>
      <div class="form-group">
        <label>Текст по умолчанию</label>
        <input type="text" class="default-value-input text-input" placeholder="в вашем регионе">
      </div>
      <div class="form-group">
        <label>Текст замены для IP-правила</label>
        <input type="text" class="replacement-value-input text-input" placeholder="в России">
      </div>
    </div>
  </div>
</template>

## Подробная инструкция по использованию

<div class="step-box "> <h3>Опция 1. Замена текста</h3>

<p>Позволяет заменять шаблоны в тексте на различные значения в зависимости от UTM-параметров.</p>

<h4>Как использовать:</h4>
<ol>
  <li>На вкладке "Замена текста" нажмите кнопку "Добавить замену текста"</li>
  <li>Заполните следующие поля:
    <ul>
      <li><strong>Ключ</strong> — идентификатор замены (будет использоваться в шаблоне <code>%%ключ%%</code> на странице)</li>
      <li><strong>Текст по умолчанию</strong> — значение, которое будет подставлено, если не сработает ни одно UTM-правило</li>
    </ul>
  </li>
  <li>При необходимости добавьте UTM-правила:
    <ul>
      <li>Нажмите "Добавить UTM правило"</li>
      <li>Выберите параметр URL (utm_source, utm_medium и т.д. или "Своя метка")</li>
      <li>Укажите ожидаемое значение параметра</li>
      <li>Укажите текст, который будет подставлен при совпадении</li>
    </ul>

  </li>
</ol>
<em>Своя метка - кастомный параметр, в котором вы можете указать любое значение </em>

<h4>Пример:</h4>
<ul>
  <li>Создаем замену с ключом <code>phone</code></li>
  <li>Текст по умолчанию: <code>+7 (800) 555-35-35</code></li>
  <li>Добавляем UTM-правило:
    <ul>
      <li>Параметр: <code>utm_source</code></li>
      <li>Значение: <code>telegram</code></li>
      <li>Текст замены: <code>+7 (999) 111-11-11</code></li>
    </ul>
  </li>
</ul>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/image-1.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Пример настройки параметров</p>
</div>
<p>На странице используем шаблон: <code>Позвоните нам: %%phone%%</code></p>
<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/key.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Запись в редакторе</p>
</div>

<p>Если посетитель зайдет с <strong>Telegram</strong> (utm_source=telegram), он увидит: "Позвоните нам: +7 (999) 111-11-11"</p>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/utm.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Utm-метка в адресной строке</p>

<img src="./images/multilanding/4.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Текст изменился в соответствии с нашим условитем</p>
</div>

<p>Если посетитель зайдет с другого источника, он увидит: "Позвоните нам: +7 (800) 555-35-35"</p>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/image-2.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Текст по умолчанию</p>
</div>

</div>

<div class="step-box">
<h3>Опция 2. Управление блоками</h3>

<p>Позволяет показывать или скрывать блоки на странице в зависимости от UTM-параметров.</p>

<ol>
  <li>На вкладке "Управление блоками" заполните настройки по умолчанию (блоки, которые будут показаны/скрыты, если не сработает ни одно правило)</li>
  <li>Нажмите "Добавить правило видимости" и заполните:
    <ul>
      <li><strong>Параметр URL</strong>— UTM-параметр или своя метка</li>
      <li><strong>Значение параметра</strong> — ожидаемое значение параметра</li>
      <li><strong>Показать блоки</strong> — список CSS-классов, которые нужно показать</li>
      <li><strong>Скрыть блоки</strong> — список CSS-классов, которые нужно скрыть</li>
    </ul>
  </li>
</ol>

<p><strong>Пример:</strong></p>

<ul>
  <li>Добавляем правило:
    <ul>
      <li>Параметр: <code>utm_campaign</code></li>
      <li>Значение: <code>sale</code></li>
      <li>Показать блоки: <code>discount-block, timer</code></li>
      <li>Скрыть блоки: <code>regular-price</code></li>
    </ul>
  </li>
</ul>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/block.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Пример настройки параметров</p>
</div>

<p>Если посетитель зайдет с параметром <code>utm_campaign=sale</code>, будут показаны блоки с классами <code>discount-block</code> и <code>timer</code>, а блок с классом <code>regular-price</code> будет скрыт.</p></div>

<div class="step-box">
<h3>Опция 3. Правила по IP</h3>
    <p>Позволяет настроить отображение контента в зависимости от местоположения посетителя.</p>
    <h4>Как использовать:</h4>
    <ol>
        <li>На вкладке "Правила по IP" нажмите "Добавить IP правило"</li>
        <li>Заполните данные о локации:
            <ul>
                <li><strong>Страна</strong> — название страны на английском (например, Russia, Belarus) или <code>*</code> для любой страны <em>(используйте полные названия стран на английском. Для просмотра списка стран используйте кнопку со значком лупы.)</em></li>
                <li><strong>Город</strong> — название города на английском или <code>*</code> для любого города</li>
                <li><strong>Регион</strong> — название региона на английском или <code>*</code> для любого региона</li>
            </ul>
        </li>
        <li>Настройте замены текста специально для этой локации:
            <ul>
                <li>Нажмите "Добавить замену текста"</li>
                <li>Укажите ключ, текст по умолчанию и текст замены для данного IP-правила</li>
            </ul>
        </li>
        <li>Настройте видимость блоков для этой локации:
            <ul>
                <li>Укажите, какие блоки показать/скрыть для посетителей из данной локации</li>
            </ul>
        </li>
    </ol>
    <h4>Пример:</h4>
    <ul>
        <li>Создаем IP-правило:
            <ul>
                <li>Страна: <code>Russia</code> </li>
                <li>Город: <code>*</code> (любой)</li>
                <li>Регион: <code>*</code> (любой)</li>
            </ul>
        </li>
        <li>Добавляем замену текста:
            <ul>
                <li>Ключ: <code>region</code></li>
                <li>Текст по умолчанию: <code>в вашем регионе</code></li>
                <li>Текст замены для IP-правила: <code>в России</code></li>
            </ul>
        </li>
        <li>Настраиваем видимость:
            <ul>
                <li>Показать блоки: <code>russian-content</code></li>
                <li>Скрыть блоки: <code>international-content</code></li>
            </ul>
        </li>
    </ul>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/ip.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Пример настройки параметров</p>
</div>
    <p>На странице используем: <code>Доставка %%region%% бесплатная!</code></p>
    <div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/multilanding/free.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Запись в редакторе</p></div>
    <ul>
        <li>Посетители из России увидят: "Доставка в России бесплатная!"</li>
        <li>Остальные посетители увидят: "Доставка в вашем регионе бесплатная!"</li>
    </ul>
</div>

<div class="important-note">
   <h3>Пример комплексного использования</h3>
    <p>Представим, что у вас есть страница с акцией, которая отличается в зависимости от источника трафика и региона посетителя:</p>
    <ol>
        <li>
            <strong>Замена текста для UTM:</strong>
            <ul>
                <li>Ключ: <code>discount</code></li>
                <li>По умолчанию: <code>10%</code></li>
                <li>UTM-правило для Facebook: если utm_source=facebook, то <code>15%</code></li>
                <li>UTM-правило для Instagram: если utm_source=instagram, то <code>20%</code></li>
            </ul>
        </li>
        <li>
            <strong>Управление блоками для UTM:</strong>
            <ul>
                <li>По умолчанию показываем блок <code>standard-offer</code></li>
                <li>Если utm_campaign=blackfriday, показываем блок <code>black-friday-offer</code> и скрываем <code>standard-offer</code></li>
            </ul>
        </li>
        <li>
            <strong>Правило по IP:</strong>
            <ul>
                <li>Для России показываем информацию о доставке по России, ключ <code>delivery_info</code></li>
                <li>Для других стран показываем информацию о международной доставке</li>
            </ul>
        </li>
    </ol>
    <p>Таким образом, посетитель из России, пришедший с Instagram во время акции "Черная пятница", увидит скидку 20%, информацию о доставке по России и специальное предложение "Черная пятница".</p></div>
