// Универсальный миксин для минификации генерируемого кода
// Можно легко добавить в любой веб-компонент Taptop

export const MinificationMixin = {
  // Минификация генерируемого кода
  async minifyGeneratedCode(code) {
    try {
      // Парсим код на части
      const parts = this.parseGeneratedCode(code);

      // Минифицируем каждую часть
      const minifiedCSS = parts.css ? this.minifyCSS(parts.css) : "";
      const minifiedJS = parts.js ? this.minifyJS(parts.js) : "";
      const minifiedHTML = parts.html ? this.minifyHTML(parts.html) : "";

      // Собираем обратно
      let result = "";
      if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
      if (minifiedJS) result += `<script>${minifiedJS}</script>`;
      if (minifiedHTML) result += minifiedHTML;

      return result;
    } catch (error) {
      console.warn('Минификация генерируемого кода не удалась, используем оригинал:', error);
      return code;
    }
  },

  parseGeneratedCode(code) {
    const result = { css: "", js: "", html: "" };

    // Извлекаем CSS из <style> тегов
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(code)) !== null) {
      result.css += match[1];
    }

    // Извлекаем JS из <script> тегов
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(code)) !== null) {
      result.js += match[1];
    }

    // Убираем style и script теги для HTML части
    result.html = code
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .trim();

    return result;
  },

  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,>+~])\s*/g, "$1")
      .replace(/;}/g, "}")
      .replace(/\s*\(\s*/g, "(")
      .replace(/\s*\)\s*/g, ")")
      .replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, "#$1$2$3")
      .trim();
  },

  minifyHTML(html) {
    if (!html) return "";
    return html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();
  },

  minifyJS(js) {
    let minified = js;

    // Удаляем комментарии
    minified = this.removeJSComments(minified);

    // Упрощаем объявления переменных
    minified = minified
      .replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "const $1=")
      .replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "let $1=")
      .replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "var $1=");

    // Сжимаем объекты и массивы
    minified = minified
      .replace(/{\s*([^}]+)\s*}/g, (match, content) => {
        const compressed = content
          .replace(/\s*:\s*/g, ":")
          .replace(/\s*,\s*/g, ",");
        return `{${compressed}}`;
      })
      .replace(/\[\s*([^\]]+)\s*\]/g, (match, content) => {
        const compressed = content.replace(/\s*,\s*/g, ",");
        return `[${compressed}]`;
      });

    // Убираем лишние пробелы
    minified = minified
      .replace(/\s*([=+\-*/%<>&|!])\s*/g, "$1")
      .replace(/\s*([(){}[\];,])\s*/g, "$1")
      .replace(/\s+/g, " ")
      .replace(/\b(if|for|while|switch|catch|function|return|throw|new|typeof)\s+/g, "$1 ")
      .replace(/\belse\s+/g, "else ")
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\n+/g, "\n")
      .trim();

    // Сжимаем true/false и undefined (безопасно)
    minified = minified
      .replace(/\btrue\b(?=\s*[,;\}\)\]])/g, "!0")
      .replace(/\bfalse\b(?=\s*[,;\}\)\]])/g, "!1")
      .replace(/\bundefined\b(?=\s*[,;\}\)\]])/g, "void 0");

    return minified;
  },

  removeJSComments(code) {
    let result = "";
    let inString = false;
    let stringChar = "";
    let inBlockComment = false;
    let inLineComment = false;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const next = code[i + 1] || "";

      // Обработка строк
      if (!inBlockComment && !inLineComment) {
        if (!inString && (char === '"' || char === "'" || char === "`")) {
          inString = true;
          stringChar = char;
          result += char;
          continue;
        } else if (inString && char === stringChar && code[i - 1] !== "\\") {
          inString = false;
          result += char;
          continue;
        } else if (inString) {
          result += char;
          continue;
        }
      }

      // Обработка комментариев
      if (!inString) {
        if (!inBlockComment && !inLineComment && char === "/" && next === "*") {
          inBlockComment = true;
          i++;
          continue;
        } else if (inBlockComment && char === "*" && next === "/") {
          inBlockComment = false;
          i++;
          continue;
        } else if (!inBlockComment && !inLineComment && char === "/" && next === "/") {
          inLineComment = true;
          i++;
          continue;
        } else if (inLineComment && (char === "\n" || char === "\r")) {
          inLineComment = false;
          result += char;
          continue;
        }
      }

      // Добавляем символ если не в комментарии
      if (!inBlockComment && !inLineComment) {
        result += char;
      }
    }

    return result;
  }
};

// Функция для добавления минификации в класс веб-компонента
export function addMinificationToComponent(ComponentClass) {
  // Добавляем все методы минификации в прототип класса
  Object.assign(ComponentClass.prototype, MinificationMixin);
  
  return ComponentClass;
}

// Функция для модификации метода generateCode для использования минификации
export function enhanceGenerateCodeMethod(component, originalGenerateMethod) {
  return async function(...args) {
    try {
      const data = this.collectData();
      if (!data) return;

      // Генерируем исходный код
      const rawCode = originalGenerateMethod.call(this, data);
      
      // Минифицируем его
      const code = await this.minifyGeneratedCode(rawCode);

      if (this.elements.codeOutput) {
        this.elements.codeOutput.textContent = code;
      }

      await this.copyToClipboard(code);
      this.showSuccessPopup();
    } catch (error) {
      console.error("Ошибка генерации кода:", error);
    }
  };
}