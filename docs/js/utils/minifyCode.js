function minifyCode(code) {
  // Удаляем однострочные комментарии
  code = code.replace(/\/\/.*$/gm, "");
  // Удаляем многострочные комментарии
  code = code.replace(/\/\*[\s\S]*?\*\//g, "");
  // Удаляем переносы строк и заменяем несколько пробелов на один
  code = code.replace(/\n/g, " ").replace(/\s+/g, " ");
  return code.trim();
}
