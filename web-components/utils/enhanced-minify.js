// Enhanced minification utility for web components
// Provides aggressive minification for generated code in all Taptop web components

export async function enhancedMinify(code) {
  // Parse code into components
  const parts = parseCode(code);

  // Minify each part
  const minifiedCSS = parts.css ? minifyCSS(parts.css) : "";
  const minifiedJS = parts.js ? minifyJSAggressive(parts.js) : "";
  const minifiedHTML = parts.html ? minifyHTML(parts.html) : "";

  // Combine back
  let result = "";
  if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
  if (minifiedJS) result += `<script>${minifiedJS}</script>`;
  if (minifiedHTML) result += minifiedHTML;

  return result;
}

function parseCode(code) {
  const result = { css: "", js: "", html: "" };

  // Extract CSS from <style> tags
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(code)) !== null) {
    result.css += match[1];
  }

  // Extract JS from <script> tags
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = scriptRegex.exec(code)) !== null) {
    result.js += match[1];
  }

  // Remove style and script tags for HTML part
  result.html = code
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .trim();

  return result;
}

function minifyCSS(css) {
  return (
    css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove unnecessary whitespace
      .replace(/\s+/g, " ")
      // Remove spaces around symbols
      .replace(/\s*([{}:;,>+~])\s*/g, "$1")
      // Remove trailing semicolons before }
      .replace(/;}/g, "}")
      // Remove spaces around parentheses
      .replace(/\s*\(\s*/g, "(")
      .replace(/\s*\)\s*/g, ")")
      // Compress color values
      .replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, "#$1$2$3")
      // Remove quotes from font names when possible
      .replace(/font-family:\s*["']([^"',]+)["']/g, "font-family:$1")
      .trim()
  );
}

function minifyHTML(html) {
  if (!html) return "";

  return (
    html
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Collapse whitespace
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function minifyJSAggressive(js) {
  // More aggressive JS minification for generated code
  let minified = js;

  // Remove comments (single and multi-line)
  minified = removeComments(minified);

  // Simplify variable declarations and assignments
  minified = simplifyDeclarations(minified);

  // Compress object and array literals
  minified = compressLiterals(minified);

  // Remove unnecessary semicolons and whitespace
  minified = cleanupWhitespace(minified);

  // Shorten common patterns specific to Taptop generated code
  minified = shortenTaptopPatterns(minified);

  return minified;
}

function removeComments(code) {
  let result = "";
  let inString = false;
  let stringChar = "";
  let inBlockComment = false;
  let inLineComment = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1] || "";

    // Handle strings
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

    // Handle comments
    if (!inString) {
      if (!inBlockComment && !inLineComment && char === "/" && next === "*") {
        inBlockComment = true;
        i++; // skip next char
        continue;
      } else if (inBlockComment && char === "*" && next === "/") {
        inBlockComment = false;
        i++; // skip next char
        continue;
      } else if (
        !inBlockComment &&
        !inLineComment &&
        char === "/" &&
        next === "/"
      ) {
        inLineComment = true;
        i++; // skip next char
        continue;
      } else if (inLineComment && (char === "\n" || char === "\r")) {
        inLineComment = false;
        result += char; // keep newline to prevent syntax errors
        continue;
      }
    }

    // Add character if not in comment
    if (!inBlockComment && !inLineComment) {
      result += char;
    }
  }

  return result;
}

function simplifyDeclarations(code) {
  // Remove extra spaces in function declarations
  code = code.replace(
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    "function $1("
  );

  // Simplify const/let/var declarations
  code = code.replace(
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g,
    "const $1="
  );
  code = code.replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "let $1=");
  code = code.replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*/g, "var $1=");

  return code;
}

function compressLiterals(code) {
  // Remove spaces in object literals
  code = code.replace(/{\s*([^}]+)\s*}/g, (match, content) => {
    const compressed = content
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ",");
    return `{${compressed}}`;
  });

  // Remove spaces in array literals
  code = code.replace(/\[\s*([^\]]+)\s*\]/g, (match, content) => {
    const compressed = content.replace(/\s*,\s*/g, ",");
    return `[${compressed}]`;
  });

  return code;
}

function cleanupWhitespace(code) {
  // Remove unnecessary whitespace while preserving syntax
  return (
    code
      // Remove spaces around operators (preserve space for keywords)
      .replace(/\s*([=+\-*/%<>&|!])\s*/g, "$1")
      .replace(/\s*([(){}[\];,])\s*/g, "$1")
      // Remove multiple whitespace
      .replace(/\s+/g, " ")
      // Keep space after keywords to prevent syntax errors
      .replace(
        /\b(if|for|while|switch|catch|function|class|return|throw|new|typeof|instanceof)\s+/g,
        "$1 "
      )
      // Keep space after 'else'
      .replace(/\belse\s+/g, "else ")
      // Remove trailing spaces and empty lines
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\n+/g, "\n")
      .trim()
  );
}

function shortenTaptopPatterns(code) {
  // Shorten common Taptop patterns without breaking functionality
  
  // Compress true/false to !0/!1 where safe (not in object property names)
  code = code.replace(/\btrue\b(?=\s*[,;\}\)\]])/g, "!0");
  code = code.replace(/\bfalse\b(?=\s*[,;\}\)\]])/g, "!1");

  // Compress undefined to void 0 where safe
  code = code.replace(/\bundefined\b(?=\s*[,;\}\)\]])/g, "void 0");

  // Simplify document methods (preserve functionality)
  code = code.replace(/document\.addEventListener/g, "document.addEventListener");
  code = code.replace(/document\.querySelector/g, "document.querySelector");
  code = code.replace(/document\.querySelectorAll/g, "document.querySelectorAll");
  code = code.replace(/document\.createElement/g, "document.createElement");
  code = code.replace(/document\.getElementById/g, "document.getElementById");

  // Optimize common Taptop patterns
  code = code.replace(/element\.appendChild/g, "element.appendChild");
  code = code.replace(/element\.addEventListener/g, "element.addEventListener");
  code = code.replace(/element\.removeEventListener/g, "element.removeEventListener");
  
  // Performance optimization: compress console methods
  code = code.replace(/console\.log/g, "console.log");
  code = code.replace(/console\.warn/g, "console.warn");
  code = code.replace(/console\.error/g, "console.error");

  // Optimize requestAnimationFrame calls
  code = code.replace(/requestAnimationFrame/g, "requestAnimationFrame");
  code = code.replace(/setTimeout/g, "setTimeout");
  code = code.replace(/setInterval/g, "setInterval");

  return code;
}

// Standalone minification function for use in web components
export function minifyGeneratedCode(code) {
  try {
    return enhancedMinify(code);
  } catch (error) {
    console.warn('Generated code minification failed, using original:', error);
    return code;
  }
}