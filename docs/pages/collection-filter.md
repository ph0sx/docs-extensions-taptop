# Динамическая фильтрация коллекций

Это расширение позволяет добавить динамическую фильтрацию для коллекций в Taptop.

Представьте, что у вас есть большой каталог товаров, портфолио работ или блог на вашем сайте. Как помочь посетителям быстро найти то, что им нужно? Это расширение решает такую задачу.

Оно позволяет добавить на страницу с вашей коллекцией (например, списком товаров):

- **Фильтры:** чтобы пользователи могли отбирать элементы по нужным критериям (например, по категории, цвету, наличию).
- **Сортировку:** чтобы упорядочивать элементы по цене, названию, дате и т.д.

---

## Как это работает?

1.  **Подготовка в Taptop:** Вы добавляете нужные CSS-классы к элементам на вашей странице (для фильтров и/или сортировки).
2.  **Настройка в Генераторе:** Вы визуально настраиваете правила фильтрации и/или сортировки здесь, на этой странице документации.
3.  **Установка на сайт:** Вы копируете сгенерированный `<script>` и вставляете его в настройки страницы Taptop.

Расширение позволяет:

1.  **Фильтровать элементы Коллекции по значениям полей:**
    - Поиск по тексту (🔍input, textarea).
    - Точное совпадение (🔽 select, ⚪ radio, 🗂️ tags/tabs).
    - Фильтр по наличию (☑️ checkbox).
2.  **Сортировать отфильтрованные (или все) элементы коллекции:**
    - По значениям одного выбранного поля.
    - В порядке возрастания или убывания.
3.  **Настраивать логику применения фильтров и сортировки:**
    - Мгновенное применение.
    - Применение по общей кнопке "Применить".
4.  **Сбрасывать фильтры и сортировку.**
5.  **Управлять пагинацией.**
6.  **Кастомизировать внешний вид** пагинации и лоадера.
    - Настроить основной **цвет** для элементов пагинации.
    - Включить/выключить **индикатор загрузки** (лоадер), который показывается во время получения данных.

---

## Этап 1: Подготовка в Taptop

!>**ВНИМАНИЕ!** Ниже указаны обязательные условия для корректной работы расширения

### Подготовка коллекции

Перед использованием генератора, убедитесь, что на вашей странице в редакторе Taptop выполнены следующие условия:

- **Есть Коллекция:** У вас создана и наполнена данными Коллекция Taptop, которую вы собираетесь фильтровать ([Подробнее о Коллекциях Taptop](https://help.taptop.pro/ru/notes/kollekcii-cms)).

<div class="img-block">
  <img src="./images/collection-filter/collections.png" >
  <p class="img-block-text">Наполните необходимую вам коллекцию</p>
</div>

- **Есть Виджет Коллекции:** На страницу добавлен стандартный виджет Taptop **"Collection"**, и он привязан к вашей коллекции.

<div class="img-block">
  <img src="./images/collection-filter/widget-collection.png" >
  <p class="img-block-text">Элементы ---> Виджеты ---> Collection</p>
</div>

<details class="step-box">
    <summary><h3 style="display: inline;">Обязательно: Как найти ID Коллекции? </h3>(Нажмите, чтобы развернуть)</summary>
    <p>Для работы фильтра нужен уникальный номер (ID) вашей Коллекции. Найти его можно так:</p>
    <ol>
        <li><strong>Откройте Инструменты разработчика в редакторе вашего проекта в Taptop:</strong> Нажмите <strong>F12</strong> (или ПКМ -> Просмотреть код/Инспектировать). Перейдите на вкладку <strong>"Сеть" (Network)</strong>.</li>
        <div class="img-block">
          <img src="./images/collection-filter/inspector.png" >
        </div>
        <li><strong>Откройте Коллекцию в Taptop:</strong> В левой панели редактора нажмите иконку "Коллекции" и кликните на нужную коллекцию в списке.</li>
        <div class="img-block">
  <img src="./images/collection-filter/collection-btn.png" >
  <p class="img-block-text">Выбираем нужную коллекцию</p>
</div>
        <li>Введите во вкладке <strong>"Сеть" (Network)</strong> в поле поиска <code>collection/get</code> (поле поиска может отличаться от браузера к браузеру, но +- одинаковое) </li>
        <div class="img-block">
  <img src="./images/collection-filter/search-inspector.png" >
  <p class="img-block-text">Фильтруем запросы</p>
</div>
        <li>Вы обнаружите несколько запросов. <strong>Нажмите на самый нижний запрос</strong></li>
        <div class="img-block">
          <img src="./images/collection-filter/network.png" >
  <p class="img-block-text">Жмем на крайний запрос</p>
</div>
        <li><strong>Найдите ID в Ответе:</strong> Справа в деталях запроса (появляется после нажатия на запрос) перейдите на вкладку <strong>"Ответ" (Response)</strong> или <strong>"Предпросмотр" (Preview)</strong>. Ищите строку вида <code>"id": 432156,</code> (обычно внутри <code>"result": {...}</code>). Это число – ваш ID.</li>
        <div class="img-block">
  <img src="./images/collection-filter/find-id.png" >
  <p class="img-block-text">Набор символов и есть ваш ID Коллекции</p>
    <img src="./images/collection-filter/find-id-alternative.png" >
  <p class="img-block-text">Альтернативный вариант</p>
</div>
    </ol>
     <p>➡️ Скопируйте <strong>только цифры</strong> ID и вставьте их в поле "ID Коллекции" в генераторе ниже.</p>

</details>

### Добавление CSS-классов

Это ключевой этап для связи расширения с элементами на вашей странице Taptop. Вам нужно будет создать на странице элементы, которые будут служить фильтрами или опциями сортировки, и присвоить им уникальные CSS-классы. Эти классы затем указываются в генераторе кода.

!> **Важное замечание по элементам форм:** Стандартные элементы HTML-форм, такие как текстовые поля (`input`), выпадающие списки (`select`), радио-кнопки (`radio`) и чекбоксы (`checkbox`), в Taptop **могут быть созданы только внутри виджета "Форма" (`Form`)**. Поэтому для создания большинства элементов управления фильтрами и сортировкой вам сначала потребуется добавить на страницу виджет `Form`.

> **_Какие элементы Taptop можно использовать для фильтров и сортировки?_**
>
> - **Для фильтров:**
>   - **Текстовое поле:** Элемент `Input`
>   - **Выпадающий список:** Элемент `Select`
>   - **Радио-кнопки:** Элемент `Radio`.
>   - **Кнопки-теги/Табы:** Можно использовать стандартные элементы `Button`, `Link Block`, `Text Link` или виджет `Tabs`. Каждой кнопке/вкладке, представляющей вариант фильтра, присваивается один и тот же CSS-класс (указанный в генераторе для этого поля фильтрации). _Эти элементы не требуют виджета `Form`_.
>   - **Чекбокс (Есть/Нет):** Элемент `Checkbox`.
> - **Для сортировки:**
>   - **Выпадающий список:** Элемент `Select`.
>   - **Отдельные кнопки/ссылки:** Элементы `Button`, `Link Block`, `Text Link`. Каждая такая кнопка/ссылка будет соответствовать одному правилу сортировки. _Эти элементы не требуют виджета `Form`_.

После создания этих элементов, вы присваиваете им CSS-классы, которые затем указываете в настройках генератора.

- **Класс для виджета Коллекции:**
  - **_ОБЫЧНЫЙ СЦЕНАРИЙ!_** Если на странице **только один** виджет "Collection", можно ничего не менять, скрипт найдет его по стандартному классу `collection`.
  - Если виджетов **несколько**, обязательно присвойте **уникальный класс** тому виджету, который нужно фильтровать (например, `collection__products`). Этот класс вы потом укажете в генераторе.

<div class="img-block">
  <img src="./images/collection-filter/default-selector-collection.png" >
  <p class="img-block-text">Коллекция одна - оставляем поле "Класс виджета Коллекции" как есть (в    <a href="#/pages/collection-filter?id=Этап-2-Настройка-Генератора">генераторе кода</a> ниже)</p>

  <img src="./images/collection-filter/another-selector-collection.png" >
  <p class="img-block-text">Коллекций несколько - назначаем уникальный класс в Taptop и пишем сюда</p>
</div>

- **Классы для элементов фильтров и сортировки:** Придумайте и добавьте классы для полей ввода, списков, кнопок, которые будут служить фильтрами или элементами управления сортировкой (например, `search-input`, `category-select`, `sort-price-button`, `product-sorter-select`).

> **_Куда добавлять класс в Taptop?_**
>
> - `🔍 Текстовое поле`: Добавьте класс **к самому полю ввода Input**.
> - `🔽 Выпадающий список`: Добавьте класс **к самому элементу Select**.
> - `⚪ Радио-кнопки`: Добавьте **один общий класс** к **контейнеру** (Radio List)
> - `🗂️ Кнопки-теги`:
> - _Обычные кнопки/ссылки:_ Добавьте **один и тот же класс** к **каждой кнопке `<button>` или ссылке `<a>`**, представляющей вариант выбора.
> - _Виджет "Tabs" Taptop:_ Добавьте **один и тот же класс** к **каждому элементу `tabs__item`** внутри виджета "Tabs". Скрипт автоматически поймет, что это табы.
> - `☑️ Чекбокс (Есть/Нет)`: Добавьте класс **к самому чекбоксу (Checkbox Item)**.

<div class="img-block">
  <img src="./images/collection-filter/input.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <img src="./images/collection-filter/selector-input.png" >
  <p class="img-block-text">Класс элемента фильтра</p>
</div>

- **Классы для кнопок управления (опционально):** Если вам нужны кнопки "Применить фильтры" или "Сбросить все", создайте их и добавьте им классы (например, `filter-apply-button`, `filter-reset-button`).

<div class="img-block">
  <img src="./images/collection-filter/apply-btn.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <img src="./images/collection-filter/selector-apply.png" >
  <img src="./images/collection-filter/clear-btn.png" style="max-width: 50%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
  <img src="./images/collection-filter/selector-clear.png" >
  <p class="img-block-text">Классы кнопки применения/сброса группы фильтров</p>
</div>

---

## Этап 2: Настройка Генератора

Теперь настройте параметры фильтрации в интерфейсе ниже.

<div id="collection-filter-generator" class="generator-container">
  <div class="settings-block">
    <div class="settings-section-title">Готовые пресеты (или настройте вручную)</div>
    <div class="settings-row">
      <div class="setting-group">
        <label for="preset-select">Готовая конфигурация:</label>
        <select id="preset-select" class="select-styled">
          </select>
        <div id="preset-preview-container" style="margin-top: 15px; text-align: center;">
    </div>
        <div class="helper-text" id="preset-description" style="margin-top: 8px;">
          </div>
      </div>
    </div>
    <div class="settings-section-title">Основные настройки</div>
    <div class="settings-row">
      <div class="setting-group">
        <label for="collection-id">ID Коллекции<span class="required-indicator">*</span></label>
        <input type="text" id="collection-id" class="text-input" placeholder="Например: 123456" required>
        <div class="helper-text">Как узнать? см. инструкцию выше</div>
      </div>
      <div class="setting-group">
        <label for="target-selector">Класс виджета Коллекции<span class="required-indicator">*</span></label>
        <input type="text" id="target-selector" class="text-input" value="collection" placeholder="collection или my-products" required>
        <div class="helper-text">Укажите CSS-класс основного блока вашего виджета "Collection" Taptop. Если на странице только один виджет, обычно можно оставить `collection`.</div>
      </div>
    </div>
    <div class="settings-row">
      <div class="setting-group">
        <label for="apply-button-selector">Класс кнопки "Применить" ✅</label>
        <input type="text" id="apply-button-selector" class="text-input" placeholder="имя-класса-без-точки">
        <div class="helper-text">Нужен, если хотя бы один фильтр НЕ мгновенный.</div>
      </div>
      <div class="setting-group">
        <label for="reset-button-selector">Класс кнопки "Сбросить" (опционально) 🗑️ </label>
        <input type="text" id="reset-button-selector" class="text-input" placeholder="имя-класса-без-точки">
        <div class="helper-text">Класс кнопки для сброса всех фильтров.</div>
      </div>
    </div>
    </div>
    <details class="settings-block">
  <summary class="settings-section-title">Настройка полей для фильтрации</summary>
      <p> Добавьте поля из вашей коллекции, по которым вы хотите производить <strong>фильтрацию</strong>. <br></p>
      <p> Укажите <strong>Имя поля</strong> (как в вашей коллекции в Taptop, напр. <code>Цена</code>, <code>Категория</code>), затем настройте параметры фильтра. </p>
<details class="important-note">
<summary><strong>Подсказка: Как настроить фильтр?</strong> (Нажмите, чтобы развернуть)</summary>
<p>После нажатия кнопки "+ Добавить поле фильтрации" появляется карточка для настройки фильтрации по конкретному полю из вашей Коллекции Taptop. Вот что означает каждая настройка:</p>

#### Тип UI Фильтра

<p>Определяет, какой HTML-элемент на вашей странице Taptop будет использоваться для управления этим фильтром.</p>

**Варианты:**

- `🔍 Текстовое поле (поиск)`: Создает поле для ввода текста. Ищет элементы, у которых значение поля _содержит_ введенный текст.
- `🔽 Выпадающий список`: Стандартный `<select>`. Показывает элементы, у которых значение поля _точно совпадает_ с выбранным вариантом.
- `⚪ Радио-кнопки`: Группа переключателей радио-кнопок, где можно выбрать только один вариант. Работает на _точное совпадение_.
- `🗂️ Кнопки-теги`: Набор кнопок `<button>` или ссылок `<a>`. Посетитель выбирает одну кнопку. Работает на _точное совпадение_. **Подходит для виджета "Tabs" в Taptop.**
- `☑️ Чекбокс (Есть/Нет)`: Одиночный `<input type="checkbox">`. Позволяет отфильтровать элементы, у которых поле "Истина/Ложь" (например, "В наличии") находится в активном положении. **_Не поддерживается применение нескольких чекбоксов сразу для одного поля!_**
- `🔳 Группа чекбоксов (мультивыбор)`: Несколько `<input type="checkbox">` для одного поля. Позволяет выбрать несколько значений одновременно. Элементы, у которых поле _содержит_ хотя бы одно из выбранных значений, будут показаны (логика ИЛИ).

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
  - `🔳 Группа чекбоксов`: Добавьте **один и тот же класс** к **каждому чекбоксу (Checkbox Item)** в группе. Все чекбоксы для одного поля должны иметь одинаковый класс.

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

</details>
<div class="field-cards-container" id="filter-fields-container">
</div>
<button id="add-filter-field-button" class="add-field-button">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span>Добавить поле фильтрации</span>
</button>
</details>

  <details class="settings-block" style="margin-top: 25px;">
    <summary class="settings-section-title">Настройка полей для сортировки (Опционально)</summary>
    <p>Здесь вы можете определить, по каким полям коллекции пользователи смогут сортировать результаты на сайте. Для каждой опции сортировки (например, "По цене", "По дате") создайте отдельное правило. Затем, на своем сайте в Taptop, создайте элементы управления (например, выпадающий список <code>&lt;select&gt;</code> или набор кнопок/ссылок), через которые пользователи будут выбирать эти опции.</p>
    <div class="important-note">
      <p><strong>Как работает связь с элементами на сайте:</strong></p>
      <ul>
        <li>Вы создаете на странице в Taptop элемент управления сортировкой (например, выпадающий список <code>&lt;select&gt;</code> или отдельные кнопки/ссылки).</li>
        <li><strong>Ключевой момент:</strong> Текст, который вы укажете в поле "Метка на сайте (текст опции/кнопки)" для каждого правила, должен <strong>АБСОЛЮТНО ТОЧНО СОВПАДАТЬ</strong> с текстовым содержимым соответствующего <code>&lt;option&gt;</code> в вашем <code>&lt;select&gt;</code> (если используете список) или с видимым текстом на кнопке/ссылке в Taptop. Например, если в генераторе для правила сортировки по названию вы указали метку 'По имени (А-Я)', то и в Taptop, создавая <code>&lt;option&gt;</code> для выпадающего списка, вы должны указать точно такой же текст: 'По имени (А-Я)'.</li>
      </ul>
      <p><strong>Ограничение:</strong> В данный момент можно сортировать только по <strong>одному критерию</strong> (поле + направление) за раз. Выбор новой опции сортировки отменит предыдущую.</p>
    </div>
     <div class="settings-section-title">Общие настройки для элементов сортировки на сайте</div>
    <div class="settings-row">
      <div class="setting-group">
        <label for="common-sort-select-selector">CSS-класс общего элемента <code>&lt;select&gt;</code> для сортировки:</label>
        <input type="text" id="common-sort-select-selector" class="text-input" placeholder="Например: product-sorter">
        <div class="helper-text">Если все опции сортировки находятся в одном выпадающем списке, укажите его CSS-класс здесь.</div>
      </div>
    </div>
    <div class="settings-row">
      <div class="setting-group">
        <label style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Применять сортировку:</label>
        <div class="radio-group-row" style="margin-top: 15px; display: flex; flex-direction: column; align-items: flex-start;" >
            <label class="radio-container">
              <input type="radio" name="apply-sort-timing" id="apply-sort-instantly" value="instant" checked>
              <span class="radio-checkmark"></span>
              Мгновенно при выборе
            </label>
            <label class="radio-container">
              <input type="radio" name="apply-sort-timing" id="apply-sort-on-button" value="button">
              <span class="radio-checkmark"></span>
              По кнопке "Применить фильтры" (если она настроена для фильтров)
            </label>
        </div>
      </div>
    </div>
    <div class="settings-row">
      <div class="setting-group">
        <label for="default-sort-label">Текст опции "Без сортировки" (если есть в <code>&lt;select&gt;</code>):</label>
        <input type="text" id="default-sort-label" class="text-input" placeholder="Например: По умолчанию">
        <div class="helper-text">Если в вашем <code>&lt;select&gt;</code> есть опция сброса сортировки, укажите ее точный текст здесь.</div>
      </div>
    </div>
    <div class="field-cards-container" id="sort-rules-container">
    </div>
    <button id="add-sort-rule-button" class="add-field-button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Добавить правило сортировки</span>
    </button>

</details>

  <details class="settings-block">
      <summary class="settings-section-title">Настройки пагинации (опционально)</summary>
      <div class="settings-row">
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
        <div class="setting-group">
          <label for="items-per-page">Количество элементов на странице<span class="required-indicator">*</span></label>
          <input type="number" id="items-per-page" class="number-input" value="9" min="1" max="100" required>
          <div class="helper-text">(макс. 100).</div>
        </div>
      </div>
          <div class="settings-row">
      <div class="setting-group">
         <label for="primary-color" >Акцентный цвет для кнопок пагинации и лоадера</label>
         <input type="color" id="primary-color" value="#4483f5" style="height: 38px; padding: 4px; width: 50%;"> <div class="helper-text">Какой основной цвет будет у элементов пагинации.</div>
      </div>
      <div class="setting-group">
          <label class="checkbox-container"> <input type="checkbox" id="show-loader" checked>
              <span class="checkmark"></span>
              <span class="checkbox-option-label">Показывать индикатор загрузки</span>
          </label>
           <div class="helper-text">Показывать анимацию во время загрузки данных.</div>
      </div>
      </div>
    </details>

  <template id="sort-rule-template">
    <div class="field-card sort-rule-card" data-sort-rule-unique-id="">
      <div class="field-header">
        <h4 class="field-title">Правило сортировки <span class="field-index-display">#</span></h4>
        <button class="remove-sort-rule-button remove-field-button" type="button" aria-label="Удалить правило сортировки">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="field-body">
        <div class="settings-row">
          <div class="setting-group">
            <label for="sort-field-id-placeholder">Имя поля / ID поля из коллекции<span class="required-indicator">*</span></label>
            <input type="text" id="sort-field-id-placeholder" class="text-input sort-field-id" placeholder="Например: Цена или f1d2c3" required>
            <div class="helper-text">Укажите имя поля из вашей коллекции (например, <code>Цена</code>) или его ID. Чувствительно к регистру.</div>
          </div>
          <div class="setting-group">
            <label>Направление сортировки<span class="required-indicator">*</span></label>
            <div class="radio-group-row" style="margin-top: 7px;">
              <label class="radio-container">
                <input type="radio" name="sort-direction-placeholder" class="sort-direction-asc" value="asc" data-direction-group="true" checked>
                <span class="radio-checkmark"></span>
                По возрастанию
              </label>
              <label class="radio-container">
                <input type="radio" name="sort-direction-placeholder" class="sort-direction-desc" value="desc" data-direction-group="true">
                <span class="radio-checkmark"></span>
                По убыванию
              </label>
            </div>
          </div>
        </div>
        <div class="settings-row">
          <div class="setting-group">
            <label for="sort-label-placeholder">Метка на сайте (текст опции/кнопки)<span class="required-indicator">*</span></label>
            <input type="text" id="sort-label-placeholder" class="text-input sort-label" placeholder="Например: По цене (сначала дешевые)" required>
            <div class="helper-text">Текст, который дизайнер должен будет указать в <code>&lt;option&gt;</code> или на кнопке/ссылке. <strong>Должно быть точное совпадение.</strong></div>
          </div>
          <div class="setting-group">
            <label for="sort-element-selector-placeholder">CSS-класс отдельного элемента для этой опции:</label>
            <input type="text" id="sort-element-selector-placeholder" class="text-input sort-element-selector" placeholder="Например: sort-by-price-asc">
            <div class="helper-text">Если эта опция сортировки управляется отдельной кнопкой/ссылкой, укажите ее уникальный CSS-класс. Если используется общий <code>&lt;select&gt;</code> из "Общих настроек", оставьте это поле пустым.</div>
          </div>
        </div>
      </div>
    </div>

  </template>

  <div class="action-section">
    <button id="generate-code-button" class="generate-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="button-text">Сгенерировать код</span>
    </button>
  </div>
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
      </div>
    </div>

  </template>

  <div id="js-code" style="display:none"></div>
  
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

!> 3. ПРОБЛЕМЫ С ПАГИНАЦИЕЙ:

- Убедитесь, что в вашем виджете "Collection" в Taptop **_ОТКЛЮЧЕНА СТАНДАРТНАЯ ПАГИНАЦИЯ_**
- Проверьте правильность настроек **"Тип Пагинации"** и **"Сколько элементов коллекции отображать на странице"** в генераторе.

!> 4. НЕ РАБОТАЮТ КНОПКИ "СБРОСИТЬ":

- Проверьте **точное совпадение** CSS-класса кнопки (общей или для конкретного поля) между генератором и элементом на странице Taptop.

!> **ВАЖНО**

- CSS-классы **чувствительны к регистру** (`MyClass` и `myclass` - разные).
- Используйте ТОЧНЫЕ имена полей из Taptop.
- При использовании виджета "Tabs" как фильтра, класс нужно вешать на каждый `.tabs__item`.
- Внешний вид фильтров и карточек настраивается в Taptop, скрипт отвечает только за логику.
