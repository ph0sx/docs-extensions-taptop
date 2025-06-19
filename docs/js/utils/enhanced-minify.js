// Enhanced minification utility for collection filter
// Provides aggressive minification similar to Terser online minifier

export async function enhancedMinify(code) {
  // Separate style, script and other content
  const parts = parseCode(code);

  // Minify each part
  const minifiedCSS = parts.css ? minifyCSS(parts.css) : "";
  const minifiedJS = parts.js ? await minifyJS(parts.js) : "";
  const minifiedHTML = parts.html ? minifyHTML(parts.html) : "";

  // Combine back
  let result = "";
  if (minifiedCSS) result += `<style>${minifiedCSS}</style>`;
  if (minifiedJS) result += `<script>${minifiedJS}</script>`;
  if (minifiedHTML) result += minifiedHTML;

  return result;
}

async function minifyJS(jsCode) {
  if (!jsCode) return "";
  
  try {
    // Load Terser from CDN if not already loaded
    if (typeof Terser === 'undefined') {
      await loadTerser();
    }
    
    const result = await Terser.minify(jsCode, {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: [],
        passes: 2
      },
      mangle: {
        toplevel: true
      },
      format: {
        comments: false
      }
    });
    
    return result.code || jsCode;
  } catch (error) {
    console.warn('Terser minification failed, using fallback:', error);
    return minifyJSAggressive(jsCode);
  }
}

function loadTerser() {
  return new Promise((resolve, reject) => {
    if (typeof Terser !== 'undefined') {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/terser@5.43.0/dist/bundle.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Terser'));
    document.head.appendChild(script);
  });
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
  // More aggressive JS minification
  let minified = js;

  // Remove comments (single and multi-line)
  minified = removeComments(minified);

  // Simplify variable declarations and assignments
  minified = simplifyDeclarations(minified);

  // Compress object and array literals
  minified = compressLiterals(minified);

  // Remove unnecessary semicolons and whitespace
  minified = cleanupWhitespace(minified);

  // Shorten common patterns
  minified = shortenPatterns(minified);

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
  // Convert function declarations to expressions where possible
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
      // Remove spaces around operators
      .replace(/\s*([=+\-*/%<>&|!])\s*/g, "$1")
      .replace(/\s*([(){}[\];,])\s*/g, "$1")
      // Remove multiple whitespace
      .replace(/\s+/g, " ")
      // Remove spaces after keywords
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

function shortenPatterns(code) {
  // Shorten common patterns
  code = code.replace(
    /document\.addEventListener/g,
    "document.addEventListener"
  );
  code = code.replace(/console\.log/g, "console.log");
  code = code.replace(/document\.querySelector/g, "document.querySelector");
  code = code.replace(
    /document\.querySelectorAll/g,
    "document.querySelectorAll"
  );

  // Compress true/false to !0/!1 where safe
  code = code.replace(/\btrue\b/g, "!0");
  code = code.replace(/\bfalse\b/g, "!1");

  // Compress undefined to void 0
  code = code.replace(/\bundefined\b/g, "void 0");

  return code;
}
