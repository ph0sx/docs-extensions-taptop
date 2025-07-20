// terser.config.js - Конфигурация для минификации веб-компонентов
module.exports = {
  compress: {
    // Максимальное сжатие
    arguments: true,
    arrows: true,
    booleans: true,
    booleans_as_integers: false,
    collapse_vars: true,
    comparisons: true,
    computed_props: true,
    conditionals: true,
    dead_code: true,
    defaults: true,
    directives: true,
    drop_console: false, // Оставляем console.log для отладки
    drop_debugger: true,
    ecma: 2020, // Используем современный ECMAScript
    evaluate: true,
    expression: false,
    global_defs: {},
    hoist_funs: true,
    hoist_props: true,
    hoist_vars: false,
    if_return: true,
    inline: true,
    join_vars: true,
    keep_fargs: false,
    keep_fnames: false,
    keep_infinity: false,
    loops: true,
    module: false,
    negate_iife: true,
    passes: 3, // Увеличиваем количество проходов
    properties: true,
    pure_funcs: null,
    pure_getters: true,
    reduce_funcs: true,
    reduce_vars: true,
    sequences: true,
    side_effects: true,
    switches: true,
    toplevel: false,
    top_retain: null,
    typeofs: true,
    unsafe: false, // Безопасная оптимизация
    unsafe_arrows: false,
    unsafe_comps: false,
    unsafe_Function: false,
    unsafe_math: false,
    unsafe_symbols: false,
    unsafe_methods: false,
    unsafe_proto: false,
    unsafe_regexp: false,
    unsafe_undefined: false,
    unused: true,
    warnings: false
  },
  
  mangle: {
    // Минификация имен переменных и функций
    toplevel: true, // Включаем минификацию топ-level переменных
    eval: false,
    keep_fnames: false, // Не сохраняем имена функций
    keep_classnames: true, // Сохраняем имена классов веб-компонентов
    reserved: [
      // Зарезервированные имена, которые нельзя минифицировать
      'customElements',
      'define',
      'HTMLElement',
      'connectedCallback',
      'disconnectedCallback',
      'attributeChangedCallback',
      'adoptedCallback',
      'observedAttributes',
      'shadowRoot',
      'attachShadow',
      // Имена веб-компонентов (критично!)
      'CounterGenerator',
      'CookieGenerator', 
      'LoaderGenerator',
      'CountdownTimerGenerator',
      'SmoothScrollGenerator',
      'TimeVisibilityGenerator',
      'CardFlipGenerator',
      'BeforeAfterSliderGenerator',
      // Глобальные DOM API
      'window',
      'document',
      'navigator',
      'console',
      'alert',
      'performance',
      'requestAnimationFrame',
      'setTimeout',
      'setInterval',
      'clearTimeout',
      'clearInterval',
      // Внешние библиотеки
      'Flip',
      'Interact',
      'IntersectionObserver',
      'MutationObserver'
    ]
  },
  
  format: {
    // Настройки форматирования
    comments: false, // Удаляем комментарии
    beautify: false,
    semicolons: true,
    keep_quoted_props: false,
    preserve_annotations: false
  },
  
  sourceMap: false, // Не генерируем source maps для production
  
  toplevel: false, // Не минифицируем топ-level переменные
  
  ie8: false, // Не поддерживаем IE8
  
  keep_fnames: false, // Не сохраняем имена функций
  
  safari10: false // Не поддерживаем старый Safari
};