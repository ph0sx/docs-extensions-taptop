/**
 * Минимизирует JavaScript-код, удаляя комментарии и лишние пробелы,
 * но сохраняя важные конструкции, такие как URL и шаблонные строки
 * @param {string} code - Исходный код
 * @returns {string} - Минимизированный код
 */
export function minifyCode(code) {
  if (!code || typeof code !== "string") {
    return "";
  }

  try {
    // Временно заменяем URL на маркеры, чтобы защитить их от минификации
    const urls = [];
    let urlCounter = 0;

    // Находим и сохраняем все URL
    code = code.replace(/(https?:\/\/[^\s'"]+)/g, function (match) {
      const marker = `__URL_MARKER_${urlCounter}__`;
      urls.push({ marker, url: match });
      urlCounter++;
      return marker;
    });

    // Находим и сохраняем все шаблонные строки
    const templateStrings = [];
    let templateCounter = 0;

    code = code.replace(/\`([^\`]*)\`/g, function (match, content) {
      const marker = `__TEMPLATE_MARKER_${templateCounter}__`;
      templateStrings.push({ marker, content: match });
      templateCounter++;
      return marker;
    });

    // Удаляем однострочные комментарии
    code = code.replace(/\/\/.*$/gm, "");

    // Удаляем многострочные комментарии
    code = code.replace(/\/\*[\s\S]*?\*\//g, "");

    // Удаляем переносы строк и заменяем несколько пробелов на один
    code = code.replace(/\n/g, " ").replace(/\s+/g, " ");

    // Восстанавливаем шаблонные строки
    templateStrings.forEach((item) => {
      code = code.replace(item.marker, item.content);
    });

    // Восстанавливаем URL
    urls.forEach((item) => {
      code = code.replace(item.marker, item.url);
    });

    return code.trim();
  } catch (error) {
    console.error("Ошибка при минификации кода:", error);
    // В случае ошибки возвращаем исходный код
    return code;
  }
}
