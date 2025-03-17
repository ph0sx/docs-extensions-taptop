# DynamicContentManager

Расширение для Taptop, которое позволяет менять содержимое сайта в зависимости от IP и UTM-параметров.

## Использование генератора кода

1. Настройте параметры замены текста и блоков
2. Нажмите кнопку **"Сгенерировать код"**
3. Скопируйте и вставьте код в конструктор Taptop

## Генератор кода

<div class="dcm-container">
  <div class="dcm-generator-container">
    <div class="dcm-generator-header">
      <div class="dcm-generator-title">Настройте параметры DynamicContentManager</div>
      <div class="dcm-generator-subtitle">Создайте правила для изменения контента в зависимости от UTM и IP</div>
    </div>
    
    <div class="dcm-tabs">
      <button class="dcm-tab-button active" data-tab="text">Замена текста</button>
      <button class="dcm-tab-button" data-tab="blocks">Управление блоками</button>
      <button class="dcm-tab-button" data-tab="ip">Правила по IP</button>
    </div>
    
    <!-- Вкладка замены текста -->
    <div class="dcm-tab-content active" id="text-tab">
      <!-- Заголовок "Замены текста" -->
      <div class="dcm-replacements-header">
  
        <span class="dcm-replacements-header-text">Замена текста</span>
      </div>
      <p>Здесь вы можете настроить, как будет заменяться текст в зависимости от UTM-параметров в URL.</p>
      
      <div id="text-replacements-container">
        <!-- Динамически добавляемые карточки для замены текста -->
      </div>
      
      <button class="dcm-generate-button" id="add-text-replacement">
        <span>Добавить замену текста</span>
      </button>
    </div>
    
    <!-- Вкладка управления блоками -->
    <div class="dcm-tab-content" id="blocks-tab">
      <!-- Заголовок "Управление блоками" -->
      <div class="dcm-section-header">
        <span class="dcm-section-header-text">Управление блоками по UTM-параметрам</span>
      </div>
      
      <div class="dcm-card">
        <h3>Блоки по умолчанию</h3>
        <p class="dcm-hint">Эти блоки будут показаны/скрыты, если не сработает ни одно из правил UTM.</p>
        <p class="dcm-hint"><strong>Важно:</strong> указывайте только название класса без точки, например: "header-block" или "promo"</p>
        
        <div>
          <label for="default-show-blocks">Показать блоки (пользовательский класс через запятую)</label>
          <input type="text" id="default-show-blocks" placeholder="block1, block2">
        </div>
        
        <div>
          <label for="default-hide-blocks">Скрыть блоки (пользовательский класс через запятую)</label>
          <input type="text" id="default-hide-blocks" placeholder="block3, block4">
        </div>
      </div>
      
      <div id="block-visibility-container">
        <!-- Динамически добавляемые правила видимости блоков -->
      </div>
      
      <button class="dcm-generate-button" id="add-block-rule">
        <span>Добавить правило</span>
      </button>
    </div>
    
    <!-- Вкладка правил по IP -->
    <div class="dcm-tab-content" id="ip-tab">
      <p>Настройка правил отображения контента в зависимости от местоположения посетителя.</p>
      
      <div id="ip-rules-container">
        <!-- Динамически добавляемые правила для IP -->
      </div>
      
      <button class="dcm-generate-button" id="add-ip-rule">
        <span>Добавить IP правило</span>
      </button>
    </div>
    
    <div id="success-modal" class="dcm-modal">
      <div class="dcm-modal-content">
        <button class="dcm-close-modal">&times;</button>
        
        <div class="dcm-modal-header">
          <div class="dcm-success-icon">✓</div>
          <h3>Код успешно скопирован!</h3>
        </div>
        
        <div class="dcm-instruction-block">
          <h4>Инструкция по подключению:</h4>
          <ol>
            <li>Откройте настройки страницы в конструкторе Taptop</li>
            <li>В блоке <strong>"HTML/JavaScript"</strong> вставьте сгенерированный код</li>
            <li>Сохраните изменения на странице</li>
          </ol>
        </div>
        
        <button class="dcm-close-button">Понятно</button>
      </div>
    </div>
  </div>
</div>

<!-- Шаблоны для динамического создания элементов -->
<template id="text-replacement-template">
  <div class="dcm-card text-replacement">
    <!-- Новая кнопка удаления в правом верхнем углу -->
    <button class="dcm-remove-button remove-text-replacement" aria-label="Удалить">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <div>
      <label>Ключ (будет использован как %%ключ%% в тексте)</label>
      <input type="text" class="keyword-input" placeholder="phone">
    </div>
    
    <div>
      <label>Текст по умолчанию</label>
      <input type="text" class="default-value-input" placeholder="+7 (999) 123-45-67">
    </div>
    
    <div class="dcm-utm-header utm-rules-header">
      <span class="dcm-utm-header-text">UTM правила</span>
    </div>
    
    <div class="utm-rules-container">
      <!-- Динамически добавляемые UTM правила -->
    </div>
    
    <button class="dcm-btn dcm-btn-primary add-utm-rule">+ Добавить UTM правило</button>
  </div>
</template>

<template id="utm-rule-template">
  <div class="dcm-rule dcm-utm-rule utm-rule">
    <!-- Новая кнопка удаления в правом верхнем углу -->
    <button class="dcm-remove-button remove-utm-rule" aria-label="Удалить">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <div class="dcm-row">
      <div class="dcm-col">
        <label>Параметр URL</label>
        <select class="param-name-select">
          <option value="utm_source">utm_source</option>
          <option value="utm_medium">utm_medium</option>
          <option value="utm_campaign">utm_campaign</option>
          <option value="utm_content">utm_content</option>
          <option value="utm_term">utm_term</option>
          <option value="custom">Своя метка</option>
        </select>
      </div>
      <div class="dcm-col dcm-custom-param-container" style="display: none;">
        <label>Название своей метки</label>
        <input type="text" class="custom-param-input" placeholder="my_param">
      </div>
      
      <div class="dcm-col">
        <label>Значение параметра</label>
        <input type="text" class="param-value-input" placeholder="facebook">
      </div>
      
      <div class="dcm-col">
        <label>Текст замены</label>
        <input type="text" class="replacement-value-input" placeholder="+7 (999) 111-11-11">
      </div>
    </div>
  </div>
</template>

<template id="block-rule-template">
  <div class="dcm-card block-rule">
    <!-- Новая кнопка удаления в правом верхнем углу -->
    <button class="dcm-remove-button remove-block-rule" aria-label="Удалить">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <div class="dcm-row">
      <div class="dcm-col">
        <label>Параметр URL</label>
        <select class="param-name-select">
          <option value="utm_source">utm_source</option>
          <option value="utm_medium">utm_medium</option>
          <option value="utm_campaign">utm_campaign</option>
          <option value="utm_content">utm_content</option>
          <option value="utm_term">utm_term</option>
          <option value="custom">Своя метка</option>
        </select>
      </div>
      <div class="dcm-col dcm-custom-param-container" style="display: none;">
        <label>Название своей метки</label>
        <input type="text" class="custom-param-input" placeholder="my_param">
      </div>
      
      <div class="dcm-col">
        <label>Значение параметра</label>
        <input type="text" class="param-value-input" placeholder="spring_sale">
      </div>
    </div>
    
    <div>
      <label>Показать блоки (пользовательский класс через запятую)</label>
      <input type="text" class="show-blocks-input" placeholder="block1, block2">
    </div>
    
    <div>
      <label>Скрыть блоки (пользовательский класс через запятую)</label>
      <input type="text" class="hide-blocks-input" placeholder="block3, block4">
    </div>
  </div>
</template>

<template id="ip-rule-template">
  <div class="dcm-card ip-rule">
    <!-- Новая кнопка удаления в правом верхнем углу -->
    <button class="dcm-remove-button remove-ip-rule" aria-label="Удалить">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <!-- Обновленный заголовок "Правило для региона" -->
    <div class="dcm-region-rule-header">
      <span class="dcm-region-rule-header-text">Правило для региона</span>
    </div>
    
    <div class="dcm-row">
      <div class="dcm-col">
        <label>Страна</label>
        <input type="text" class="country-input" placeholder="Russia или * для любой">
        <p class="dcm-hint dcm-country-hint">Введите полное название страны на английском (например, Russia, Belarus). <a href="#" class="show-countries-list">Показать список стран</a></p>
      </div>
      
      <div class="dcm-col">
        <label>Город</label>
        <input type="text" class="city-input" placeholder="Moscow или * для любого" value="*">
        <p class="dcm-hint">Введите полное название города на английском или * для любого</p>
      </div>
      
      <div class="dcm-col">
        <label>Регион</label>
        <input type="text" class="region-input" placeholder="* для любого" value="*">
        <p class="dcm-hint">Введите название региона на английском или * для любого</p>
      </div>
    </div>
    
    <div class="dcm-replacements-header">
      <span class="dcm-replacements-header-text">Замены текста</span>
    </div>
    
    <div class="ip-text-replacements-container">
      <!-- Динамически добавляемые замены текста для IP правила -->
    </div>
    
    <button class="dcm-btn dcm-btn-primary add-ip-text-replacement">+ Добавить замену текста</button>
    
    <div style="margin-top: 15px;">
      <label>Показать блоки (пользовательский класс через запятую)</label>
      <input type="text" class="show-blocks-input" placeholder="block_ru">
    </div>
    
    <div>
      <label>Скрыть блоки (пользовательский класс через запятую)</label>
      <input type="text" class="hide-blocks-input" placeholder="block_en">
    </div>
  </div>
</template>

<template id="ip-text-replacement-template">
  <div class="dcm-rule ip-text-replacement">
    <!-- Новая кнопка удаления в правом верхнем углу -->
    <button class="dcm-remove-button remove-ip-text-replacement" aria-label="Удалить">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    
    <div class="dcm-row">
      <div class="dcm-col">
        <label>Ключ</label>
        <input type="text" class="keyword-input" placeholder="region">
      </div>
      
      <div class="dcm-col">
        <label>Текст по умолчанию</label>
        <input type="text" class="default-value-input" placeholder="в вашем регионе">
      </div>
      
      <div class="dcm-col">
        <label>Текст замены для IP-правила</label>
        <input type="text" class="replacement-value-input" placeholder="в России">
      </div>
    </div>
  </div>
</template>

## Установка на сайт

1. Настройте правила для UTM и IP с помощью генератора.
2. Сгенерируйте JavaScript-код.
3. Вставьте код в блок HTML/JavaScript на странице Taptop.
4. Добавьте ключи (например, `%%phone%%`) в тексты на сайте для их динамической замены.
5. Используйте ID блоков для настройки их отображения.

## Пример использования

**Сценарий:** У вас есть лендинг с разными предложениями для клиентов из разных рекламных каналов

- Посетители из Facebook видят телефон отдела продаж Facebook.
- Посетители из Instagram видят телефон отдела продаж Instagram.
- Посетители из Москвы видят московский адрес и телефон.
- Посетители из Санкт-Петербурга видят питерский адрес и телефон.

## Поддерживаемые функции

- **Замена текста** — подменяйте тексты в зависимости от UTM-меток или города/страны посетителя
- **Управление блоками** — показывайте или скрывайте любые блоки по условиям UTM или IP
- **Геотаргетинг** — настраивайте контент в зависимости от страны, города или региона посетителя
- **Пользовательские URL-параметры** — используйте не только UTM-метки, но и любые другие параметры
