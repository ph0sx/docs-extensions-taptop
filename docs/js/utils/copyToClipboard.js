/**
 * Утилита для копирования текста в буфер обмена
 * @param {string} text - Текст для копирования
 * @returns {Promise<boolean>} - Результат копирования
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Текст успешно скопирован в буфер обмена");
      return true;
    } catch (err) {
      console.error("Ошибка копирования через Clipboard API:", err);
      return fallbackCopyToClipboard(text);
    }
  } else {
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Резервный метод копирования в буфер обмена
 * @param {string} text - Текст для копирования
 * @returns {boolean} - Результат копирования
 */
function fallbackCopyToClipboard(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);

    return successful;
  } catch (err) {
    console.error("Ошибка при резервном копировании:", err);
    return false;
  }
}
