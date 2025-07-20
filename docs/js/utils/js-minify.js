// docs/js/utils/js-minify.js
// Упрощённый, но безопасный минификатор без внешних зависимостей.
export function jsMinify(code) {
  let inString = false; // хранит кавычку строки (' " `) или false
  let inComment = false; // false | 'block' | 'line'
  let out = "";

  for (let i = 0; i < code.length; i++) {
    const a = code[i];
    const b = code[i + 1] ?? "";

    /* ===== 1. внутри блока/строки/комментария ===== */

    // 1-а.  Блочный комментарий  /* ... */
    if (inComment === "block") {
      if (a === "*" && b === "/") {
        // конец /* */
        inComment = false;
        i++; // пропускаем '/'
      }
      continue; // ничего не выводим
    }

    // 1-б.  Однострочный комментарий  // ...
    if (inComment === "line") {
      if (a === "\n" || a === "\r") {
        // конец строки
        inComment = false;
        out += a; // перенос строки вернём, чтобы
      } // не склеивать инструкции
      continue;
    }

    // 1-в.  Внутри строки
    if (inString) {
      out += a;
      if (a === "\\") {
        // экранированный символ
        out += b;
        i++;
      } else if (a === inString) {
        // закрывающая кавычка
        inString = false;
      }
      continue;
    }

    /* ===== 2. начало комментария или строки ===== */

    if (a === "/" && b === "*") {
      // /* ... */
      inComment = "block";
      i++;
      continue;
    }
    if (a === "/" && b === "/") {
      // // ...
      inComment = "line";
      i++;
      continue;
    }
    if (a === "'" || a === '"' || a === "`") {
      inString = a;
      out += a;
      continue;
    }

    /* ===== 3. удаляем лишние пробелы ===== */

    if (/\s/.test(a)) {
      const prev = out.at(-1) ?? "";
      const next = b;

      // сохраняем 1 пробел, если без него сольются идентификаторы
      if (/[a-zA-Z0-9_$]/.test(prev) && /[a-zA-Z0-9_$]/.test(next)) {
        out += " ";
      }
      // или если это ++ --  (+ +  /  - -)
      else if ((prev === "+" || prev === "-") && prev === next) {
        out += " ";
      }
      continue;
    }

    /* ===== 4. обычный символ ===== */

    out += a;
  }

  return out;
}
