# Подключение cookie-баннера

Это расширение позволяет сохранить выбор пользователя о согласии на обработку cookie.

## Как работает расширение

1. **Первичный визит:**  
   При первом посещении сайта пользователю отображается всплывающее окно с запросом согласия на обработку cookie.

2. **Действие пользователя:**  
   Пользователь может согласиться или отказаться от обработки cookie.

3. **Повторные визиты:**  
   Если пользователь уже сделал выбор, всплывающее окно не появляется повторно до истечения заданного срока хранения cookie.

## Генератор кода

Для удобства работы с расширением предоставлен генератор кода.

<!-- HTML-структура генератора -->
<div id="cookie-generator">
  <div class="form-grid">
    <div class="form-group">
      <label for="expiry-days">Срок хранения выбора пользователя (дни):</label>
      <input type="number" id="expiry-days" value="7" min="1">
    </div>
    
    <div class="form-group">
      <label for="popup-class">CSS-класс всплывающего окна (popup):</label>
      <input type="text" id="popup-class" value="popup-cookie">
    </div>
    
    <div class="form-group">
      <label for="consent-btn-class">CSS-класс кнопки согласия:</label>
      <input type="text" id="consent-btn-class" value="button-cookie">
    </div>
    
    <div class="form-group">
      <label for="reject-btn-class">CSS-класс кнопки отказа:</label>
      <input type="text" id="reject-btn-class" value="button-no-cookie">
    </div>
  </div>
  
  <button id="generate-btn" class="primary-button">Сгенерировать код</button>

  <!-- Скрытый элемент для хранения сгенерированного кода -->
  <div id="js-code" style="display: none;"></div>
  
  <!-- Модальное окно -->
  <div id="success-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="modal-icon">✓</div>
      <h3>Код успешно скопирован!</h3>
      
      <div class="instruction-block">
        <h4>Инструкция по подключению:</h4>
        <ol>
          <li>Откройте настройки страницы.</li>
          <li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
          <img src="page-settings.png" width="300" height="150">
          <li>Сохраните изменения на странице.</li>
        </ol>
      </div>
      <button class="primary-button close-btn">Понятно</button>
    </div>
  </div>
</div>

<!-- CSS-стили для генератора и модального окна -->
<style>
/* Основные стили контейнера */
#cookie-generator {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

/* Сетка для формы */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

/* Стили для групп полей */
.form-group {
  margin-bottom: 10px;
}

/* Стили для лейблов */
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

/* Стили для инпутов */
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Стили для основной кнопки */
.primary-button {
  background: #4483f5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.primary-button:hover {
  background: #3a70d1;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-modal:hover {
  color: #333;
}

.modal-icon {
  background-color: #4caf50;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin: 0 auto 15px;
}

.modal-content h3 {
  text-align: center;
  margin: 0 0 10px;
  color: #333;
}

.modal-content p {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}

.instruction-block {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.instruction-block h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.instruction-block ol, .instruction-block ul {
  margin: 0;
  padding-left: 20px;
}

.instruction-block li {
  margin-bottom: 8px;
}

.instruction-block code {
  background-color: #eee;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: monospace;
}

.element-class {
  display: flex;
}

.element-class .class-name {
  font-weight: bold;
  color: #4483f5;
}

.close-btn {
  display: block;
  margin: 0 auto;
}

.step-box {
  background-color: #f0f7ff;
  border-left: 3px solid #4483f5;
  padding: 5px 15px;
  margin-bottom: 15px;
  border-radius: 0 5px 5px 0;
}

.important-note {
  background-color: #fff8e6;
  border-left: 3px solid #ffcc00;
  padding: 12px 15px;
  margin: 15px 0;
  border-radius: 0 5px 5px 0;
}

h3 {
  margin-top: 20px !important;
}
</style>

<!-- JavaScript для работы генератора -->
<script>
/**
 * Самовызывающаяся функция для изоляции кода
 */
(function() {
  /**
   * Инициализация генератора
   * Находит элементы и привязывает обработчики событий
   */
  function initGenerator() {
    // Находим необходимые DOM-элементы
    const elements = {
      generateBtn: document.getElementById('generate-btn'),
      jsCode: document.getElementById('js-code'),
      modal: document.getElementById('success-modal'),
      closeModal: document.querySelectorAll('.close-modal, .close-btn'),
      inputs: {
        expiryDays: document.getElementById('expiry-days'),
        popupClass: document.getElementById('popup-class'),
        consentBtnClass: document.getElementById('consent-btn-class'),
        rejectBtnClass: document.getElementById('reject-btn-class')
      }
    };
    
    // Если элементы не найдены, пробуем позже
    if (!elements.generateBtn) {
      setTimeout(initGenerator, 500);
      return;
    }
    
    /**
     * Функция для генерации кода, копирования в буфер обмена и показа модального окна
     */
    function generateAndCopyCode() {
      // Получаем значения из формы с проверкой на значения по умолчанию
      const settings = {
        cookieName: 'cookieAgreement', // Фиксированное значение
        expiryDays: elements.inputs.expiryDays.value || 7,
        popupClass: elements.inputs.popupClass.value || 'popup-cookie',
        consentBtnClass: elements.inputs.consentBtnClass.value || 'button-cookie',
        rejectBtnClass: elements.inputs.rejectBtnClass.value || 'button-no-cookie'
      };
      
      // Фиксированные классы
      const closeBtnClass = 'pop-up__inside-close-button';
      const overlayClass = 'pop-up__overlay';
      
      // Генерируем JavaScript код
      const generatedCode = 
`<script>
document.addEventListener("DOMContentLoaded", () => {
  // Вспомогательные функции для работы с cookie
  const cookies = {
    get: (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : undefined;
    },
    set: (name, value, options = {}) => {
      options = {
        path: '/',
        ...options
      };
      
      if (options.expires) {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        options.expires = date.toUTCString();
      }
      
      let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      
      for (const [key, val] of Object.entries(options)) {
        updatedCookie += '; ' + key;
        if (val !== true) {
          updatedCookie += '=' + val;
        }
      }
      
      document.cookie = updatedCookie;
    }
  };
  
  const ui = {
    banner: document.querySelector(".${settings.popupClass}"),
    consentBtn: document.querySelector(".${settings.consentBtnClass}"),
    rejectBtn: document.querySelector(".${settings.rejectBtnClass}"),
    closeBtn: document.querySelector(".${closeBtnClass}"),
    overlay: document.querySelector(".${overlayClass}")
  };
  
  const hideBanner = () => ui.banner && (ui.banner.style.display = "none");
  
  // Проверяем и показываем баннер если нужно
  if (cookies.get("${settings.cookieName}") === undefined && ui.banner) {
    ui.banner.style.display = "flex";
    
    // Добавляем обработчики для закрытия
    ui.closeBtn?.addEventListener("click", hideBanner, { once: true });
    ui.overlay?.addEventListener("click", hideBanner, { once: true });
    
    // Обработчики кнопок
    ui.consentBtn?.addEventListener("click", () => {
      cookies.set("${settings.cookieName}", "true", { expires: ${settings.expiryDays} });
      hideBanner();
    });
    
    ui.rejectBtn?.addEventListener("click", () => {
      cookies.set("${settings.cookieName}", "false", { expires: ${settings.expiryDays} });
      hideBanner();
    });
  }
});
<\/script>`;
      
      // Сохраняем код в скрытый элемент (для отладки)
      elements.jsCode.textContent = generatedCode;
      
      // Копируем код в буфер обмена
      copyToClipboard(generatedCode);
      
      // Показываем модальное окно с подтверждением
      elements.modal.style.display = 'flex';
    }
    
    /**
     * Функция для копирования текста в буфер обмена
     */
    function copyToClipboard(text) {
      // Создаем временный элемент для копирования
      const tempElement = document.createElement('textarea');
      tempElement.value = text;
      tempElement.setAttribute('readonly', '');
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      document.body.appendChild(tempElement);
      
      // Выделяем и копируем текст
      tempElement.select();
      tempElement.setSelectionRange(0, 99999);
      document.execCommand('copy');
      
      // Удаляем временный элемент
      document.body.removeChild(tempElement);
    }
    
    /**
     * Функция для закрытия модального окна
     */
    function closeModalWindow() {
      elements.modal.style.display = 'none';
    }
    
    // Привязываем обработчики событий
    elements.generateBtn.addEventListener('click', generateAndCopyCode);
    
    // Добавляем обработчики для закрытия модального окна
    elements.closeModal.forEach(btn => {
      btn.addEventListener('click', closeModalWindow);
    });
    
    // Закрытие модального окна при клике на оверлей
    elements.modal.addEventListener('click', function(event) {
      if (event.target === this) {
        closeModalWindow();
      }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && elements.modal.style.display !== 'none') {
        closeModalWindow();
      }
    });
  }
  
  // Запускаем инициализацию
  initGenerator();
  
  // Для Docsify также добавляем обработчик на изменение страницы
  if (typeof window.$docsify !== 'undefined') {
    window.$docsify.plugins = window.$docsify.plugins || [];
    window.$docsify.plugins.push(function(hook) {
      hook.doneEach(function() {
        initGenerator();
      });
    });
  }
})();
</script>

## Пошаговая инструкция по подключению

<div class="step-box">
<h3>Шаг 1: Назначьте CSS-классы элементам попапа</h3>

<p>В интерфейсе конструктора <strong>Taptop</strong> задайте следующие классы:</p>

<ul>
<li><strong>Всплывающее окно:</strong> <code>popup-cookie</code></li>
<li><strong>Кнопка согласия:</strong> <code>button-cookie</code></li>
<li><strong>Кнопка отказа:</strong> <code>button-no-cookie</code></li>
</ul>

<p><em>Вы можете использовать другие названия классов, но тогда не забудьте указать их в генераторе кода.</em></p>
</div>

<div class="step-box">
<h3>Шаг 2: Настройте параметры в генераторе кода</h3>

<p>Укажите в полях генератора нужные вам параметры:</p>

<ul>
<li><strong>Срок хранения:</strong> количество дней хранения согласия пользователя</li>
<li><strong>CSS-классы:</strong> ваши пользовательские классы для элементов интерфейса</li>
</ul>
</div>

<div class="step-box">
<h3>Шаг 3: Сгенерируйте и скопируйте код</h3>

<p>Нажмите кнопку <strong>"Сгенерировать код"</strong>. Код автоматически скопируется в буфер обмена.</p>
</div>

<div class="step-box">
<h3>Шаг 4: Вставьте код на сайт</h3>

<ol>
<li>Откройте настройки страницы в конструкторе Taptop</li>
<li>В блоке <strong>"Внутри тега body"</strong> вставьте сгенерированный код</li>
</ol>

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="page-settings.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
</div>

<p>Сохраните изменения на странице.</p>
</div>

## Проверка работоспособности

<div class="important-note">
<strong>Как убедиться, что баннер работает правильно:</strong>
<ol>
<li>Откройте свой сайт в режиме инкогнито (Ctrl+Shift+N)</li>
<li>Убедитесь, что баннер появился на экране</li>
<li>Нажмите на кнопку согласия или отказа</li>
<li>Перезагрузите страницу - баннер больше не должен появиться</li>
</ol>
</div>

Если вы хотите проверить, что cookie действительно сохранились:

1. После нажатия на кнопку в баннере, откройте инспектор браузера (F12 или Ctrl+Shift+I)
2. Перейдите во вкладку:
   - **Chrome/Edge:** Приложение → Куки
   - **Firefox:** Хранилище → Куки
3. Найдите cookie с именем "cookieAgreement"
4. Проверьте его значение: "true" для согласия или "false" для отказа

<div style="max-width: 600px; margin: 20px auto; text-align: center;">
<img src="cookie-check.png" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
<p style="margin-top: 10px; font-style: italic; color: #666;">Пример проверки cookie в инспекторе браузера</p>
</div>

<div class="important-note">
<strong>Важно!</strong> Убедитесь, что вы создали все необходимые элементы и правильно назначили им классы. 
</div>
