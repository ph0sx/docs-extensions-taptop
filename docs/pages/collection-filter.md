# Динамическая фильтрация коллекций

Это расширение позволяет добавить динамическую фильтрацию для коллекций в Taptop.

---

## Как это работает?

1.  **Подготовка в Taptop:** Вы добавляете нужные CSS-классы к элементам на вашей странице.
2.  **Настройка в Генераторе:** Вы визуально настраиваете правила фильтрации и вывода данных здесь, на этой странице документации.
3.  **Установка на сайт:** Вы копируете сгенерированный `<script>` и вставляете его в настройки страницы Taptop.

Расширение позволяет:

1. **Фильтровать элементы Коллекции по значениям полей:**

   - **Поиск по тексту (🔍input, textarea ):** Искать элементы, у которых определенное поле содержит введенный текст (например, поиск товаров по названию или описанию).
   - **Точное совпадение (🔽 select, ⚪ radio, 🗂️ tags):** Отображать только те элементы, у которых значение поля точно совпадает с выбранным в фильтре (например, показать товары только категории "Кроссовки" или статьи только с тегом "Дизайн"). Подходит для выпадающих списков, радио-кнопок, кнопок-тегов и табов Taptop.
   - **Фильтр по наличию (☑️ checkbox):** Показывать элементы, у которых определенное поле заполнено (не пустое и не содержит "false", "no", "нет"). Идеально для фильтра "В наличии".

2. **Настраивать логику применения фильтров:**

   - **Мгновенная фильтрация:** Результаты обновляются сразу после изменения значения в фильтре (например, при выборе категории).
   - **Фильтрация по кнопке "Применить":** Результаты обновляются только после нажатия специальной кнопки (удобно, когда фильтров несколько).

3. **Сбрасывать фильтры:**

   - Возможность добавить кнопку для сброса **всех** активных фильтров.
   - Возможность добавить кнопки для сброса **каждого фильтра по отдельности**.

4. **Управлять пагинацией:**

   - Настроить отображение кнопок "Вперед/Назад", кнопки "Загрузить еще" или полноценной нумерации страниц для отфильтрованных результатов.

5. **Кастомизировать внешний вид:**

   - Настроить основной **цвет** для элементов пагинации.
   - Включить/выключить **индикатор загрузки** (лоадер), который показывается во время получения данных.

6. **Отображать данные из Коллекции:** Вставлять значения любых полей (текст, картинки, ссылки, даты, rich text) из отфильтрованных элементов в соответствующие блоки внутри карточки товара/статьи.

---

## Этап 1: Подготовка в Taptop

!>**ВНИМАНИЕ!** Ниже указаны обязательные условия для корректной работы расширения

### Подготовка коллекции

Перед использованием генератора, убедитесь, что на вашей странице в редакторе Taptop выполнены следующие условия:

- **Есть Коллекция:** У вас создана и наполнена данными Коллекция Taptop, которую вы собираетесь фильтровать ([Подробнее о Коллекциях Taptop](https://help.taptop.pro/ru/notes/kollekcii-cms)).

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
  <img src="./images/collection-filter/collections.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Наполните необходимую вам коллекцию</p>
</div>

- **Есть Виджет Коллекции:** На страницу добавлен стандартный виджет Taptop **"Collection"**, и он привязан к вашей коллекции.

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
  <img src="./images/collection-filter/widget-collection.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Элементы ---> Виджеты ---> Collection</p>
</div>

### Добавление CSS-классов

Это важный шаг. Вам нужно присвоить уникальные CSS-классы (имена) разным элементам на странице. Классы нужны, чтобы наш скрипт понял, с какими элементами ему работать.

- **Класс для виджета Коллекции:**
  - **_ОБЫЧНЫЙ СЦЕНАРИЙ!_** Если на странице **только один** виджет "Collection", можно ничего не менять, скрипт найдет его по стандартному классу `collection`.
  - Если виджетов **несколько**, обязательно присвойте **уникальный класс** тому виджету, который нужно фильтровать (например, `collection__products`). Этот класс вы потом укажете в генераторе.

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
  <img src="./images/collection-filter/default-selector-collection.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Коллекция одна - оставляем поле "Класс виджета Коллекции" как есть (в   <a href="#/pages/collection-filter?id=Этап-2-Настройка-Генератора">генераторе кода</a> ниже)</p>

  <img src="./images/collection-filter/another-selector-collection.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Коллекций несколько - назначаем уникальный класс в Taptop и пишем сюда</p>
</div>

- **Классы для элементов фильтров:** Придумайте и добавьте классы для полей ввода, списков, кнопок, которые будут служить фильтрами (например, `search-input`, `category-select`).
- **Классы для элементов вывода данных:** Придумайте и добавьте классы элементам **внутри** карточки товара/статьи (`.collection__item`), куда будут подставляться данные из полей коллекции (например, `item__title`, `item__price`, `item__image`).
- **Классы для кнопок управления (опционально):** Если вам нужны кнопки "Применить фильтры" или "Сбросить все", создайте их и добавьте им классы (например, `filter-apply-btn`, `filter-reset-btn`).

**_Ниже примеры:_**

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="./images/collection-filter/input.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/selector-input.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Класс элемента фильтра</p>
<img src="./images/collection-filter/title.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/selector-title.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/img-element.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/selector-image.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Классы элементов, которые будут выводиться внутри карточек коллекции (Collection Item)</p>
<img src="./images/collection-filter/apply-btn.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/selector-apply.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/clear-btn.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<img src="./images/collection-filter/selector-clear.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Классы кнопки применения/сброса группы фильтров</p>
  </div>

<div class="step-box">
    <h3>Обязательно: Как найти ID Коллекции?</h3>
    <p>Для работы фильтра нужен уникальный номер (ID) вашей Коллекции. Найти его можно так:</p>
    <ol>
        <li><strong>Откройте Инструменты разработчика в редакторе вашего проекта в Taptop:</strong> Нажмите <strong>F12</strong> (или ПКМ -> Просмотреть код/Инспектировать). Перейдите на вкладку <strong>"Сеть" (Network)</strong>.</li>
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
          <img src="./images/collection-filter/inspector.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
        </div>
        <li><strong>Откройте Коллекцию в Taptop:</strong> В левой панели редактора нажмите иконку "Коллекции" и кликните на нужную коллекцию в списке.</li>
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
  <img src="./images/collection-filter/collection-btn.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Выбираем нужную коллекцию</p>
</div>
        <li>Введите во вкладке <strong>"Сеть" (Network)</strong> в поле поиска <code>collection/get</code> (поле поиска может отличаться от браузера к браузеру, но +- одинаковое) </li>
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
  <img src="./images/collection-filter/search-inspector.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Фильтруем запросы</p>
</div>
        <li>Вы обнаружите несколько запросов. <strong>Нажмите на самый нижний запрос</strong></li>
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
          <img src="./images/collection-filter/network.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Жмем на крайний запрос</p>
</div>
        <li><strong>Найдите ID в Ответе:</strong> Справа в деталях запроса (появляется после нажатия на запрос) перейдите на вкладку <strong>"Ответ" (Response)</strong> или <strong>"Предпросмотр" (Preview)</strong>. Ищите строку вида <code>"id": 432156,</code> (обычно внутри <code>"result": {...}</code>). Это число – ваш ID.</li>
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
  <img src="./images/collection-filter/find-id.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Набор символов и есть ваш ID Коллекции</p>
    <img src="./images/collection-filter/find-id-alternative.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <p style="margin-top: 10px; font-style: italic; color: #666;">Альтернативный вариант</p>
</div>
    </ol>
     <p>➡️ Скопируйте <strong>только цифры</strong> ID и вставьте их в поле "ID Коллекции" в генераторе ниже.</p>

</div>

---

## Этап 2: Настройка Генератора

Теперь настройте параметры фильтрации в интерфейсе ниже.

<div id="collection-filter-generator" class="generator-container">
 <div class="generator-header">
    <div class="generator-title">Настройка динамической фильтрации коллекций</div>
  </div>
  <div class="settings-block">
    <h3 class="settings-title">Шаг 1: Готовые пресеты (или настройте вручную)</h3>
    <div class="settings-row">
      <div class="setting-group">
        <label for="preset-select">Готовая конфигурация:</label>
        <select id="preset-select" class="select-styled">
          <!-- Пресеты будут заполнены JavaScript -->
        </select>
        <div id="preset-preview-container" style="margin-top: 15px; text-align: center;">
    </div>
        <div class="helper-text" id="preset-description" style="margin-top: 8px;">
          <!-- Описание пресета будет заполнено JavaScript -->
        </div>
      </div>
    </div>
    <h3 class="settings-title">Шаг 2: Основные настройки</h3>
    <div class="settings-row">
      <div class="setting-group">
        <label for="collection-id">ID Коллекции<span class="required-indicator">*</span></label>
        <input type="text" id="collection-id" class="text-input" placeholder="Например: 123456" required>
        <div class="helper-text">Как узнать? см. инструкцию выше</div>
      </div>
      <div class="setting-group">
        <label for="target-selector">Класс виджета Коллекции<span class="required-indicator">*</span></label>
        <input type="text" id="target-selector" class="text-input" value="collection" placeholder="collection или collection--u-xxxx" required>
        <div class="helper-text">Оставьте `collection`, если на странице ОДИН виджет коллекции. Если их несколько, укажите здесь уникальный класс нужного виджета (например, `my-products`).</div>
      </div>
    </div>
    <div class="settings-row">
      <div class="setting-group">
        <label for="apply-button-selector">Класс кнопки "Применить"</label>
        <input type="text" id="apply-button-selector" class="text-input" placeholder="имя-класса-без-точки">
        <div class="helper-text">Нужен, если хотя бы один фильтр НЕ мгновенный.</div>
      </div>
      <div class="setting-group">
        <label for="reset-button-selector">Класс кнопки "Сбросить" (опционально)</label>
        <input type="text" id="reset-button-selector" class="text-input" placeholder="имя-класса-без-точки">
        <div class="helper-text">Класс кнопки для сброса всех фильтров.</div>
      </div>
    </div>
    <div class="settings-row">
       <div class="setting-group">
        <label for="items-per-page">Сколько элементов коллекции отображать на странице<span class="required-indicator">*</span></label>
        <input type="number" id="items-per-page" class="number-input" value="9" min="1" max="100" required>
        <div class="helper-text">(макс. 100).</div>
      </div>
      <div class="setting-group">
        <label for="pagination-type">Тип Пагинации:</label>
        <select id="pagination-type" class="select-styled">
          <option value="none" selected>Без пагинации</option>
          <option value="prev_next">Кнопки Вперед/Назад</option>
          <option value="load_more">Кнопка "Загрузить еще"</option>
          <option value="numbers">Номера страниц</option>
        </select>
        <div class="helper-text">Как отображать навигацию по отфильтрованным результатам.</div>
      </div>
      </div>
     <div class="settings-row">
       <div class="setting-group">
         <label for="primary-color" >Акцентный цвет для кнопок пагинации и лоадера</label>
         <input type="color" id="primary-color" value="#4483f5" style="height: 38px; padding: 4px; width: 50%;"> <div class="helper-text">Какой основной цвет будет у элементов пагинации.</div>
       </div>
       <div class="setting-group">
           <label class="checkbox-container" style="margin-top: 28px;"> <input type="checkbox" id="show-loader" checked>
               <span class="checkmark"></span>
               <span class="checkbox-option-label">Показывать индикатор загрузки</span>
           </label>
            <div class="helper-text">Показывать анимацию во время загрузки данных.</div>
       </div>
       </div>
    <h3 class="settings-title">Шаг 3: Настройка полей фильтрации и вывода</h3>

<div class="important-note">
    Добавьте поля из вашей коллекции. Укажите <strong>Имя поля</strong> (как в Taptop, напр. <code>Цена</code>, <code>Категория</code>).  Затем настройте фильтр и/или вывод данных.
    <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      <img src="./images/collection-filter/field-names.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
      <p style="margin-top: 10px; font-style: italic; color: #666;">Имя поля = название каждого поля из коллекции</p>
    </div>
</div>

<details class="important-note">
<summary><strong>Подсказка: Как настроить Карточку Поля?</strong> (Нажмите, чтобы развернуть)</summary>

После нажатия кнопки "+ Добавить поле" появляется карточка для настройки конкретного поля из вашей Коллекции Taptop. Вот что означает каждая настройка внутри этой карточки:

---

#### Тип UI Фильтра

То, как посетитель сайта будет взаимодействовать с этим полем для фильтрации.

**Варианты:**

- `Не используется`: Выберите, если это поле нужно только для вывода данных в карточку товара/статьи, а фильтровать по нему не нужно.
- `🔍 Текстовое поле (поиск)`: Создает поле для ввода текста. Ищет элементы, у которых значение поля _содержит_ введенный текст.
- `🔽 Выпадающий список`: Стандартный `<select>`. Показывает элементы, у которых значение поля _точно совпадает_ с выбранным вариантом.
- `⚪ Радио-кнопки`: Группа переключателей радио-кнопок, где можно выбрать только один вариант. Работает на _точное совпадение_.
- `🗂️ Кнопки-теги`: Набор кнопок `<button>` или ссылок `<a>`. Посетитель выбирает одну кнопку. Работает на _точное совпадение_. **Подходит для виджета "Tabs" в Taptop.**
- `☑️ Чекбокс (Есть/Нет)`: Одиночный `<input type="checkbox">`. Позволяет отфильтровать элементы, у которых поле _заполнено_ (например, "В наличии"). Считает поле "заполненным", если оно не пустое и не содержит слов "false", "no", "нет". **_Не поддерживается применение нескольких чекбоксов сразу для одного поля!_**

---

#### Настройки Фильтра

!> Внешний вид фильтров и карточек настраивается в Taptop, скрипт отвечает только за логику фильтрации.

- **Класс элемента(ов) фильтра**

  CSS-класс, который вы **заранее присвоили** соответствующему элементу управления фильтром на вашей странице в Taptop.

  Куда добавлять класс в Taptop?

  - `🔍 Текстовое поле`: Добавьте класс **к самому полю ввода Input**.
  - `🔽 Выпадающий список`: Добавьте класс **к самому элементу Select**.
  - `⚪ Радио-кнопки`: Добавьте **один общий класс** к **контейнеру** (Radio List)
  - `🗂️ Кнопки-теги`:
    - _Обычные кнопки/ссылки:_ Добавьте **один и тот же класс** к **каждой кнопке `<button>` или ссылке `<a>`**, представляющей вариант выбора.
    - _Виджет "Tabs" Taptop:_ Добавьте **один и тот же класс** к **каждому элементу `tabs__item`** внутри виджета "Tabs". Скрипт автоматически поймет, что это табы.
  - `☑️ Чекбокс (Есть/Нет)`: Добавьте класс **к самому чекбоксу (Checkbox Item)**.

---

- **Класс кнопки 'Сбросить это поле'**

  CSS-класс для **отдельной** кнопки (если вы ее создали), которая будет сбрасывать **только этот конкретный фильтр**. Необязательно.

---

- **Первый пункт = "Все"** (Для Списков, Радио, Кнопок)

  Если галочка стоит, то выбор первого элемента в вашем списке `<select>` или нажатие на первую радио-кнопку/кнопку-тег будет означать "Показать все" (то есть сбросит фильтр по этому полю).

---

- **Мгновенный фильтр**

  - ☑️ **Включено:** Результаты на сайте будут обновляться автоматически сразу после того, как пользователь изменит значение в этом фильтре (например, выберет другую категорию). Есть небольшая задержка для текстового поиска, чтобы не обновлять при каждой букве.
  - ☐ **Выключено:** Результаты обновятся только тогда, когда пользователь нажмет общую кнопку "Применить" (класс для нее указывается в Основных настройках).

---

#### Настройка вывода данных

Эта секция нужна, **только если вы хотите отображать значение этого поля Коллекции внутри карточек** отфильтрованных элементов (например, вывести название товара, его цену, картинку). Если поле используется _только_ для фильтрации, эту секцию настраивать не нужно.

- **Класс элемента для вывода**

  CSS-класс, который вы **заранее присвоили** элементу (текстовому блоку, картинке, ссылке) **внутри вашей карточки товара/статьи** (`.collection__item`) в редакторе Taptop.

  - **Зачем?** Скрипт не знает структуру вашей карточки. Этот класс говорит ему: "Значение из поля Коллекции '[Имя поля]' нужно вставить вот сюда, в элемент с классом `[указанный вами класс]`". Например, для поля "Цена" вы указываете класс `item-price`, который присвоили текстовому блоку с ценой в Taptop.
  - **Важно:** Оставьте пустым, если выводить данные из этого поля не нужно.

---

- **Тип Вывода**

  Как именно скрипт должен вставить данные в указанный элемент.

</div>
    <div class="field-cards-container" id="filter-fields-container">
      <!-- Карточки полей будут добавлены через JavaScript -->
    </div>
    <button id="add-filter-field-button" class="add-field-button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Добавить поле</span>
    </button>
  </div>

  <div class="action-section">
    <button id="generate-code-button" class="generate-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="button-text">Сгенерировать код</span>
    </button>
  </div>
  <template id="filter-field-template">
    <div class="field-card" data-field-index="">
      <div class="field-header">
        <h4 class="field-title">
            <span class="field-label-text">Поле</span>
            <span class="field-index-display">#1</span>
        </h4>
        <button class="remove-field-button" type="button" aria-label="Удалить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="field-body">
        <div class="field-row">
          <div class="field-group">
             <label>Имя<span class="required-indicator">*</span></label>
            <input type="text" class="text-input filter-field-id" placeholder="Например: title, Цена, a1b2c3" required>
            <div class="helper-text">Введите имя поля из коллекции в Taptop (напр. `Цена`)</div>
          </div>
          <div class="field-group">
            <label>Тип UI Фильтра</label>
            <select class="select-styled filter-ui-type">
              <option value="none" selected>Не используется (Только вывод)</option>
              <option value="input">🔍 Текстовое поле (поиск)  </option>
              <option value="select">🔽 Выпадающий список (один выбор) </option>
              <option value="radio">⚪ Радио-кнопки (один выбор) </option>
              <option value="buttons">🗂️ Кнопки-теги (один выбор) </option>
              <option value="checkbox-set">☑️ Чекбокс (Есть/Нет) </option>
            </select>
            <div class="helper-text">Как пользователь будет фильтровать.</div>
          </div>
        </div>
        <div class="field-row filter-controls-row" style="display:none;">
            <div class="field-group filter-selector-group">
                <label>Класс элемента(ов) фильтра<span class="filter-selector-required required-indicator" style="display:none">*</span></label>
                <input type="text" class="text-input filter-element-selector" placeholder="имя-класса-без-точки">
                <div class="helper-text filter-element-helper">Класс элемента управления (input, select, кнопки).</div>
            </div>
             <div class="field-group">
                <label>Класс кнопки 'Сбросить это поле'</label>
                <input type="text" class="text-input filter-clear-button-selector" placeholder="опционально">
                <div class="helper-text">Класс кнопки для сброса только этого фильтра.</div>
            </div>
             <div class="field-group filter-first-is-all-container" style="display:none;">
                 <label class="checkbox-container"><input type="checkbox" class="filter-first-is-all" checked> <span class="checkmark"></span> <span class="checkbox-option-label">Первый пункт = "Все"</span></label>
                 <div class="helper-text">Для списков/кнопок: выбор первого сбросит фильтр.</div>
             </div>
             <div class="field-group filter-instant-container" style="display:none;">
                  <label class="checkbox-container"><input type="checkbox" class="filter-instant-filter" checked> <span class="checkmark"></span> <span class="checkbox-option-label">Мгновенный фильтр</span></label>
                  <div class="helper-text">Применять сразу при изменении.</div>
             </div>
        </div>
<div class="field-row">
  <div class="field-group">
    <button type="button" class="configure-output-btn" aria-expanded="false">
      Настроить вывод данных
    </button>
  </div>
</div>
<div class="field-output-config" style="display: none;">
  <h4 class="settings-subtitle">Настройка Вывода Данных</h4>
  <div class="field-row">
    <div class="field-group">
      <label>Класс элемента для вывода</label>
      <input type="text" class="text-input filter-target-selector" placeholder="item-title">
      <div class="helper-text">Класс элемента ВНУТРИ карточки для вывода. Пусто = не выводить.</div>
    </div>
    <div class="field-group">
      <label>Тип Вывода</label>
      <select class="select-styled filter-output-type">
        <option value="text" selected>📝 Текст </option>
        <option value="image">🖼️ Изображение </option>
        <option value="link">🔗 Ссылка</option>
        <option value="date_dmy">📅 Дата </option>
        <option value="rich_text">🖋️ Форматированный текст</option>
      </select>
      <div class="helper-text">Как вставить данные.</div>
    </div>
  </div>
</div>
      </div>
    </div>
  </template>

  <!-- Скрытый элемент для JS кода -->
  <div id="js-code" style="display:none"></div>
  
  <!-- Модальное окно успеха -->
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
          <li>Добавьте на страницу элементы с указанными CSS-селекторами</li>
          <li>Сохраните изменения</li>
        </ol>
      </div>
      <button class="close-button">Понятно</button>
    </div>
  </div>
</div>

---

## Решение возможных проблем

Если фильтр не работает или работает не так, как ожидалось, проверьте следующие пункты:

!> 1. Фильтр не работает **ВООБЩЕ**:

- **ID Коллекции:**
  - Убедитесь, что ID введен в генератор **правильно**.
  - Проверьте, что вы скопировали ID именно из ответа на запрос `mosaic/collection/get` во вкладке "Сеть" (Network -> Response/Preview), как описано выше.
- **Класс виджета Коллекции:**
  - Проверьте, что класс **точно совпадает** с классом виджета "Collection" в Taptop.
  - Если на странице **несколько** виджетов "Collection", убедитесь, что указан **уникальный класс** нужного виджета. Если виджет **один**, значение `collection` обычно подходит.
- **Установка скрипта:**
  - Убедитесь, что сгенерированный `<script>` вставлен в настройки страницы Taptop в блок **"Перед тегом body"**.
- **Публикация страницы:** Изменения (классы, скрипт) вступают в силу **только после публикации** страницы в Taptop.

!> **2. НЕ РАБОТАЕТ КОНКРЕТНЫЙ ФИЛЬТР** (например, по категории или цене):

- **Класс элемента фильтра:**
  - Проверьте **точное совпадение** CSS-класса между генератором и элементом на странице Taptop.
  - Убедитесь, что класс добавлен к **правильному HTML элементу** в Taptop:
    - `input` / `select` / `checkbox`: класс на сам элемент.
    - `radio`: класс на **контейнер** группы радио-кнопок.
    - `buttons` (обычные): класс на **каждую** кнопку/ссылку.
    - `tabs` Taptop: класс на **каждый** `.tabs__item`.
- **Имя поля / ID:**
  - Убедитесь, что имя поля в генераторе **точно совпадает** с именем поля в Коллекции Taptop.
  - **Тип UI Фильтра:** Соответствует ли выбранный тип (Select, Radio, Buttons и т.д.) реальному элементу на странице?
  - **Кнопка "Применить":** Если фильтр **не** "Мгновенный", убедитесь, что кнопка "Применить" существует на странице и ее класс правильно указан в "Основных настройках".

!> 3. **ДАННЫЕ НЕ ВЫВОДЯТСЯ** в карточки товаров/статей:

- **Класс элемента для вывода:**
  - Убедитесь, что этот класс **точно совпадает** с классом элемента **внутри** вашей карточки коллекции в Taptop.
  - Проверьте, что такой элемент **существует** внутри карточки.
- **Тип Вывода:**
  - Соответствует ли тип вывода (Текст, Изображение, Ссылка и т.д.) типу данных поля и типу HTML-элемента, куда вы хотите их вывести? (Например, нельзя вывести картинку в простой текстовый блок).

!> 4. ПРОБЛЕМЫ С ПАГИНАЦИЕЙ:

- Убедитесь, что в вашем виджете "Collection" в Taptop **_ОТКЛЮЧЕНА СТАНДАРТНАЯ ПАГИНАЦИЯ_**
- Проверьте правильность настроек **"Тип Пагинации"** и **"Сколько элементов коллекции отображать на странице"** в генераторе.

!> 5. НЕ РАБОТАЮТ КНОПКИ "СБРОСИТЬ":

- Проверьте **точное совпадение** CSS-класса кнопки (общей или для конкретного поля) между генератором и элементом на странице Taptop.

!> **ВАЖНО**

- CSS-классы **чувствительны к регистру** (`MyClass` и `myclass` - разные).
- Используйте ТОЧНЫЕ имена полей из Taptop.
- При использовании виджета "Tabs" как фильтра, класс нужно вешать на каждый `.tabs__item`.
- Внешний вид фильтров и карточек настраивается в Taptop, скрипт отвечает только за логику.
