/**
 * Менеджер всех генераторов кода в проекте
 * Отвечает за регистрацию, инициализацию и управление генераторами
 */

export class GeneratorsManager {
  constructor() {
    this.generators = new Map();
    this.instances = [];
    this.initialized = false;
  }

  /**
   * Регистрирует генератор в менеджере
   * @param {string} name - Имя генератора
   * @param {Class} GeneratorClass - Класс генератора
   * @param {string} selector - CSS-селектор для проверки наличия на странице
   */
  register(name, GeneratorClass, selector) {
    this.generators.set(name, { GeneratorClass, selector, instance: null });
    return this;
  }

  /**
   * Инициализирует все зарегистрированные генераторы,
   * которые присутствуют на текущей странице
   */
  initAll() {
    // Сначала уничтожаем все существующие экземпляры
    this.destroyAll();

    console.log("GeneratorsManager: Инициализация всех генераторов");

    this.generators.forEach((generator, name) => {
      const element = document.querySelector(generator.selector);
      if (element) {
        console.log(`GeneratorsManager: Инициализация генератора ${name}`);
        generator.instance = new generator.GeneratorClass();
        generator.instance.init();
        this.instances.push(generator.instance);
      } else {
        console.log(
          `GeneratorsManager: Селектор для генератора ${name} не найден на странице`
        );
      }
    });

    this.initialized = true;
    console.log("GeneratorsManager: Все генераторы инициализированы");

    return this;
  }

  /**
   * Инициализирует конкретный генератор по имени
   * @param {string} name - Имя генератора для инициализации
   */
  initGenerator(name) {
    const generator = this.generators.get(name);
    if (!generator) {
      console.warn(`GeneratorsManager: Генератор "${name}" не найден`);
      return false;
    }

    const element = document.querySelector(generator.selector);
    if (element) {
      // Если экземпляр уже существует, уничтожаем его
      if (generator.instance) {
        this.destroyGenerator(name);
      }

      // Создаем новый экземпляр
      generator.instance = new generator.GeneratorClass();
      generator.instance.init();
      this.instances.push(generator.instance);

      console.log(`GeneratorsManager: Генератор "${name}" инициализирован`);
      return true;
    } else {
      console.log(
        `GeneratorsManager: Селектор для генератора "${name}" не найден на странице`
      );
      return false;
    }
  }

  /**
   * Уничтожает конкретный генератор по имени
   * @param {string} name - Имя генератора для уничтожения
   */
  destroyGenerator(name) {
    const generator = this.generators.get(name);
    if (!generator || !generator.instance) return;

    if (typeof generator.instance.destroy === "function") {
      generator.instance.destroy();
    }

    // Удаляем из списка экземпляров
    const index = this.instances.indexOf(generator.instance);
    if (index !== -1) {
      this.instances.splice(index, 1);
    }

    generator.instance = null;
    console.log(`GeneratorsManager: Генератор "${name}" уничтожен`);
  }

  /**
   * Уничтожает все существующие экземпляры генераторов
   */
  destroyAll() {
    console.log("GeneratorsManager: Уничтожение всех генераторов");

    // Уничтожаем все экземпляры
    this.instances.forEach((instance) => {
      if (typeof instance.destroy === "function") {
        instance.destroy();
      }
    });

    // Очищаем список экземпляров
    this.instances = [];

    // Удаляем ссылки на экземпляры в зарегистрированных генераторах
    this.generators.forEach((generator) => {
      generator.instance = null;
    });

    this.initialized = false;
  }

  /**
   * Сбрасывает состояние всех генераторов для повторной инициализации
   */
  reset() {
    this.destroyAll();
    console.log("GeneratorsManager: Состояние менеджера сброшено");
  }
}

// Создаем глобальный экземпляр менеджера
const generatorsManager = new GeneratorsManager();

// Функция для инициализации всех генераторов при загрузке страницы
export function initAllGenerators() {
  // Импортируем все классы генераторов
  import("./cookieGenerator.js").then((module) => {
    const { CookieGenerator } = module;

    import("./smoothScrollGenerator.js").then((module) => {
      const { SmoothScrollGenerator } = module;

      import("./dynamicContentGenerator.js").then((module) => {
        const { DynamicContentGenerator } = module;

        // Регистрируем все доступные генераторы
        generatorsManager
          .register("cookie", CookieGenerator, "#cookie-generator")
          .register(
            "smoothScroll",
            SmoothScrollGenerator,
            "#smooth-scroll-generator"
          )
          .register(
            "dynamicContent",
            DynamicContentGenerator,
            ".dcm-container"
          );

        // Инициализируем все
        generatorsManager.initAll();
      });
    });
  });
}

// Добавляем функцию инициализации в window для Docsify
window.initGenerators = function () {
  // Сбрасываем состояние менеджера перед инициализацией
  generatorsManager.reset();

  // Инициализируем генераторы напрямую через их функции init
  if (window.initCookieGenerator) window.initCookieGenerator();
  if (window.initSmoothScrollGenerator) window.initSmoothScrollGenerator();
  if (window.initDynamicContentGenerator) window.initDynamicContentGenerator();
};

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.initGenerators === "function") {
    window.initGenerators();
  }
});

export default generatorsManager;
