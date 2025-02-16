# Как это работает?

В данном варианте исполнения, popup автоматически появляется в случае, когда пользователь еще не согласился на обработку cookie (например, при первом визите на сайт).

После того, как пользователь согласился на обработку cookie, popup исчезает и все последующие визиты сайта будут сохранять согласие пользователя.

# Последовательность шагов для подключения согласия на обработку cookie

> **1. Подключить библиотеку [cookie-js](https://github.com/js-cookie/js-cookie)**

Что бы подключить библиотеку нам необходимо вставить пользовательский код.

Для этого необходимо перейти в настройки страницы:

<img src="image-1.png" alt="alt text" width="600" height="300">

В блок **"Внутри тега head"** вставить следующий код:

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.5/js.cookie.min.js"
  integrity="sha512-nlp9/l96/EpjYBx7EP7pGASVXNe80hGhYAUrjeXnu/fyF5Py0/RXav4BBNs7n5Hx1WFhOEOWSAVjGeC3oKxDVQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
```

> **2. Вставить код для работы с cookie**

В блок **"Внутри тега body"** вставить следующий код:

```html
<script type="module">
  document.addEventListener("DOMContentLoaded", () => {
    const consentBanner = document.querySelector(".popup-cookie");
    const consentButton = document.querySelector(".button-cookie");
    const noConsentButton = document.querySelector(".button-no-cookie");

    // Функция для скрытия баннера
    const hideBanner = () => {
      if (consentBanner) {
        consentBanner.style.display = "none";
      }
    };

    // Если cookie "cookieAgreement" не установлено, показываем баннер
    if (Cookies.get("cookieAgreement") === undefined && consentBanner) {
      consentBanner.style.display = "flex";
      // Устанавливаем display для всех дочерних элементов
      Array.from(consentBanner.children).forEach((child) => {
        child.style.display = "flex";
      });

      // Обработчики для закрытия баннера
      const closeBtn = consentBanner.querySelector(
        ".pop-up__inside-close-button"
      );
      if (closeBtn) {
        closeBtn.addEventListener("click", hideBanner, { once: true });
      }

      const overlay = consentBanner.querySelector(".pop-up__overlay");
      if (overlay) {
        overlay.addEventListener("click", hideBanner, { once: true });
      }
    }

    // Обработчик кнопки согласия
    if (consentButton) {
      consentButton.addEventListener("click", () => {
        Cookies.set("cookieAgreement", "true", { expires: 7, path: "/" });
        hideBanner();
      });
    }

    // Обработчик кнопки отказа
    if (noConsentButton) {
      noConsentButton.addEventListener("click", () => {
        Cookies.set("cookieAgreement", "false", { expires: 7, path: "/" });
        hideBanner();
      });
    }
  });
</script>
```

По умолчанию согласие/отказ пользователя сохраняются на 7 суток. В случае
необходимости этот срок можно изменить изменив значение свойства **expires** внутри блока кода выше.

По умолчанию:

```javascript
Cookies.set("cookieAgreement", "true", { expires: 7, path: "/" });
```

Ставим на 30 дней:

```javascript
Cookies.set("cookieAgreement", "true", { expires: 30, path: "/" }); //изменили expires: 30
```

> **3. Присвоить элементам пользовательские классы**

Для того, что бы код корректно отработал, для элемента **popup** и **кнопок согласия/отказа** на обработку cookie, необходимо прописать пользовательские классы через интерфейс **Taptop**.

![alt text](image-4.png)
![alt text](image-5.png)

- Для элемента **popup**: `popup-cookie`
- Для кнопки **согласия на обработку**: `button-cookie`
- Для кнопки **отказа на обработку**: `button-no-cookie`

### Как проверить, всё ли отрабатывает?

В случае, если всё настроено верно, при нажатии пользователем кнопки на согласие или отказ, свойство `cookieAgreement` сохраняется в cookie.
Для того, что бы проверить, всё ли отрабатывает, необходимо переходить открыть консоль разработчика в браузере (нажать на `F12` или `Ctrl+Shift+I` и выбрать вкладку **Console**) и ввести следующий код (и нажать **Enter**):

```javascript
console.log(Cookies.get("cookieAgreement"));
```

Если вы видите значение **true** или **false**, значит все работает.

<img src="image-7.png" alt="alt text" width="400" height="150">
