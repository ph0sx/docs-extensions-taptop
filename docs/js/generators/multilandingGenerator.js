import { BaseGenerator } from "./baseGenerator.js";
import { ModalUtils } from "../utils/modal.js";

export class DynamicContentGenerator extends BaseGenerator {
  constructor() {
    super();

    // Конфигурация по умолчанию
    this.config = {
      textReplacements: [
        {
          keyword: "service",
          defaultValue: "наши услуги",
          utmRules: [
            {
              paramName: "utm_content",
              paramValue: "design",
              replacementValue: "услуги дизайна",
            },
          ],
        },
      ],
      blockVisibility: [
        {
          paramName: "utm_campaign",
          paramValue: "sale",
          showBlocks: ["block1"],
          hideBlocks: ["block2"],
        },
      ],
      defaultBlockVisibility: {
        showBlocks: [],
        hideBlocks: [],
      },
      ipRules: [
        {
          country: "Russia",
          city: "*",
          region: "*",
          textReplacements: [
            {
              keyword: "region",
              defaultValue: "в вашем регионе",
              replacementValue: "в России",
            },
          ],
          showBlocks: [],
          hideBlocks: [],
        },
      ],
    };

    this.tabs = [
      { id: "text", label: "Замена текста" },
      { id: "blocks", label: "Управление блоками" },
      { id: "ip", label: "Правила по IP" },
    ];

    this.activeTab = "text";
    this.templates = {};

    // Вспомогательные утилиты
    this.utils = {
      parseCommaList: (str) =>
        !str
          ? []
          : str
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),

      findElementsWithKeyword: (keyword) => {
        const elements = [];
        const pattern = new RegExp(`%%${keyword}%%`);
        const searchNode = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            if (pattern.test(node.textContent)) {
              const parent = node.parentElement;
              if (parent && !elements.includes(parent)) {
                elements.push(parent);
              }
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (pattern.test(node.innerHTML)) {
              if (!elements.includes(node)) {
                elements.push(node);
              }
            }
            node.childNodes.forEach(searchNode);
          }
        };
        searchNode(document.body);
        return elements;
      },
    };

    // Привязка обработчика закрытия модального окна для стран
    this.handleCountriesModalEscape =
      this.handleCountriesModalEscape.bind(this);
  }

  findElements() {
    super.findElements();

    // Находим контейнеры для всех типов правил
    this.elements = {
      ...this.elements,
      textReplacementsContainer: document.getElementById(
        "text-replacements-container"
      ),
      blockVisibilityContainer: document.getElementById(
        "block-visibility-container"
      ),
      ipRulesContainer: document.getElementById("ip-rules-container"),
      defaultShowBlocks: document.getElementById("default-show-blocks"),
      defaultHideBlocks: document.getElementById("default-hide-blocks"),
      // Обновлены селекторы для соответствия новой структуре HTML
      tabButtons: document.querySelectorAll(".tab-button"),
      tabContents: document.querySelectorAll(".tab-content"),
      addTextReplacementBtn: document.getElementById("add-text-replacement"),
      addBlockRuleBtn: document.getElementById("add-block-rule"),
      addIpRuleBtn: document.getElementById("add-ip-rule"),
      generateButton: document.getElementById("generate-btn"),
    };

    // Находим шаблоны для динамического создания элементов
    this.findTemplates();
  }

  findTemplates() {
    // Получаем все шаблоны
    this.templates = {
      textReplacement: document.getElementById("text-replacement-template"),
      utmRule: document.getElementById("utm-rule-template"),
      blockRule: document.getElementById("block-rule-template"),
      ipRule: document.getElementById("ip-rule-template"),
      ipTextReplacement: document.getElementById(
        "ip-text-replacement-template"
      ),
    };

    // Проверяем, что все шаблоны найдены
    let allTemplatesFound = true;
    Object.entries(this.templates).forEach(([key, template]) => {
      if (!template) {
        console.error(`Шаблон ${key} не найден!`);
        allTemplatesFound = false;
      }
    });

    return allTemplatesFound;
  }

  bindEvents() {
    super.bindEvents();

    // Обработчики вкладок
    this.elements.tabButtons?.forEach((button) => {
      button.addEventListener("click", () => {
        this.switchTab(button.getAttribute("data-tab"));
      });
    });

    // Добавление новых правил
    if (this.elements.addTextReplacementBtn) {
      this.elements.addTextReplacementBtn.addEventListener("click", () => {
        this.addTextReplacement();
      });
    }

    if (this.elements.addBlockRuleBtn) {
      this.elements.addBlockRuleBtn.addEventListener("click", () => {
        this.addBlockRule();
      });
    }

    if (this.elements.addIpRuleBtn) {
      this.elements.addIpRuleBtn.addEventListener("click", () => {
        this.addIpRule();
      });
    }

    // Настройки блоков по умолчанию
    if (this.elements.defaultShowBlocks) {
      this.elements.defaultShowBlocks.addEventListener("change", (e) => {
        this.config.defaultBlockVisibility.showBlocks =
          this.utils.parseCommaList(e.target.value);
      });
    }

    if (this.elements.defaultHideBlocks) {
      this.elements.defaultHideBlocks.addEventListener("change", (e) => {
        this.config.defaultBlockVisibility.hideBlocks =
          this.utils.parseCommaList(e.target.value);
      });
    }

    // Кнопка генерации кода - используем generateAndCopyCode
    if (this.elements.generateButton) {
      this.elements.generateButton.addEventListener("click", () =>
        this.generateAndCopyCode()
      );
    }

    // Обработчики для модального окна
    this.elements.closeModal?.forEach((btn) =>
      btn.addEventListener("click", () => this.closeModal())
    );
    this.elements.modal?.addEventListener("click", (event) => {
      if (event.target === this.elements.modal) this.closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        this.elements.modal?.style.display !== "none"
      ) {
        this.closeModal();
      }
    });
  }

  setInitialState() {
    // Устанавливаем значения полей блоков по умолчанию
    if (this.elements.defaultShowBlocks) {
      this.elements.defaultShowBlocks.value =
        this.config.defaultBlockVisibility.showBlocks.join(", ");
    }

    if (this.elements.defaultHideBlocks) {
      this.elements.defaultHideBlocks.value =
        this.config.defaultBlockVisibility.hideBlocks.join(", ");
    }

    // Отрисовываем все данные
    this.renderTextReplacements();
    this.renderBlockVisibility();
    this.renderIpRules();

    // Переключаемся на первую вкладку
    this.switchTab(this.activeTab);
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Деактивируем все вкладки
    this.elements.tabContents?.forEach((tab) => tab.classList.remove("active"));
    this.elements.tabButtons?.forEach((btn) => btn.classList.remove("active"));

    // Активируем нужную вкладку
    const tabContent = document.getElementById(`${tabId}-tab`);
    const tabButton = document.querySelector(
      `.tab-button[data-tab="${tabId}"]`
    );

    if (tabContent) tabContent.classList.add("active");
    if (tabButton) tabButton.classList.add("active");
  }

  // Функция для управления видимостью заголовка UTM правил
  updateUtmRulesHeaders() {
    // Находим все контейнеры с заменами текста
    document.querySelectorAll(".text-replacement").forEach((container) => {
      // Получаем контейнер с UTM правилами
      const utmContainer = container.querySelector(".utm-rules-container");
      const utmHeader = container.querySelector(".section-divider");

      // Проверяем количество правил в контейнере
      if (utmContainer && utmHeader) {
        const utmRules = utmContainer.querySelectorAll(".utm-rule");
        if (utmRules.length === 0) {
          utmHeader.style.display = "none";
        } else {
          utmHeader.style.display = "flex";
        }
      }
    });
  }

  // МЕТОДЫ УПРАВЛЕНИЯ СОСТОЯНИЕМ

  addTextReplacement() {
    this.config.textReplacements.push({
      keyword: "",
      defaultValue: "",
      utmRules: [],
    });
    this.renderTextReplacements();
  }

  addBlockRule() {
    this.config.blockVisibility.push({
      paramName: "utm_content",
      paramValue: "",
      showBlocks: [],
      hideBlocks: [],
    });
    this.renderBlockVisibility();
  }

  addIpRule() {
    this.config.ipRules.push({
      country: "",
      city: "*",
      region: "*",
      textReplacements: [],
      showBlocks: [],
      hideBlocks: [],
    });
    this.renderIpRules();
  }

  // МЕТОДЫ ДЛЯ ОТРИСОВКИ UI ЭЛЕМЕНТОВ

  renderTextReplacements() {
    const container = this.elements.textReplacementsContainer;
    if (!container) return;

    container.innerHTML = "";

    this.config.textReplacements.forEach((replacement, index) => {
      if (!this.templates.textReplacement) return;

      const clone = document.importNode(
        this.templates.textReplacement.content,
        true
      );

      // Обновляем индекс правила
      const ruleIndex = clone.querySelector(".rule-index");
      if (ruleIndex) {
        ruleIndex.textContent = index + 1;
      }

      // Настраиваем кнопку удаления в правом верхнем углу
      const removeBtn = clone.querySelector(
        ".dcm-remove-button.remove-text-replacement"
      );
      if (removeBtn) {
        removeBtn.dataset.index = index;
        removeBtn.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.textReplacements.splice(idx, 1);
          this.renderTextReplacements();
        });
      }

      // Находим и изменяем заголовок UTM правил - скрываем если правил нет
      const utmRulesHeader = clone.querySelector(".section-divider");
      if (utmRulesHeader) {
        if (!replacement.utmRules || replacement.utmRules.length === 0) {
          utmRulesHeader.style.display = "none";
        }
      }

      const keywordInput = clone.querySelector(".keyword-input");
      if (keywordInput) {
        keywordInput.value = replacement.keyword;
        keywordInput.dataset.index = index;
        keywordInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.textReplacements[idx].keyword = e.currentTarget.value;
        });
      }

      const defaultValueInput = clone.querySelector(".default-value-input");
      if (defaultValueInput) {
        defaultValueInput.value = replacement.defaultValue;
        defaultValueInput.dataset.index = index;
        defaultValueInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.textReplacements[idx].defaultValue =
            e.currentTarget.value;
        });
      }

      const utmContainer = clone.querySelector(".utm-rules-container");
      if (utmContainer && replacement.utmRules) {
        replacement.utmRules.forEach((rule, ruleIndex) => {
          this.addUtmRuleToContainer(utmContainer, rule, index, ruleIndex);
        });
      }

      const addUtmButton = clone.querySelector(".add-utm-rule");
      if (addUtmButton) {
        addUtmButton.dataset.index = index;
        addUtmButton.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.textReplacements[idx].utmRules.push({
            paramName: "utm_content",
            paramValue: "",
            replacementValue: "",
          });
          const ruleIndex =
            this.config.textReplacements[idx].utmRules.length - 1;
          const rule = this.config.textReplacements[idx].utmRules[ruleIndex];
          const utmContainerEl = e.currentTarget.previousElementSibling;
          if (utmContainerEl) {
            this.addUtmRuleToContainer(utmContainerEl, rule, idx, ruleIndex);
          }
          // Показываем заголовок UTM правил
          const utmHeader = e.currentTarget
            .closest(".text-replacement")
            .querySelector(".section-divider");
          if (utmHeader) {
            utmHeader.style.display = "flex";
          }
        });
      }

      container.appendChild(clone);
    });

    // Обновляем заголовки UTM правил после рендеринга
    this.updateUtmRulesHeaders();
  }

  addUtmRuleToContainer(container, rule, replacementIndex, ruleIndex) {
    if (!container) return;
    if (!this.templates.utmRule) return;

    const clone = document.importNode(this.templates.utmRule.content, true);

    // Обновляем индекс UTM правила
    const utmRuleIndex = clone.querySelector(".utm-rule-index");
    if (utmRuleIndex) {
      utmRuleIndex.textContent = ruleIndex + 1;
    }

    // Настраиваем кнопку удаления в правом верхнем углу
    const removeBtn = clone.querySelector(".dcm-remove-button.remove-utm-rule");
    if (removeBtn) {
      removeBtn.dataset.replacementIndex = replacementIndex;
      removeBtn.dataset.ruleIndex = ruleIndex;
      removeBtn.addEventListener("click", (e) => {
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        const rIdx = parseInt(e.currentTarget.dataset.ruleIndex);
        this.config.textReplacements[repIdx].utmRules.splice(rIdx, 1);
        this.renderTextReplacements();
      });
    }

    const paramNameSelect = clone.querySelector(".param-name-select");
    if (paramNameSelect) {
      paramNameSelect.value = rule.paramName;
      paramNameSelect.dataset.replacementIndex = replacementIndex;
      paramNameSelect.dataset.ruleIndex = ruleIndex;
      paramNameSelect.addEventListener("change", (e) => {
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        const rIdx = parseInt(e.currentTarget.dataset.ruleIndex);
        const customContainer = e.currentTarget
          .closest(".dcm-rule.utm-rule")
          .querySelector(".dcm-custom-param-container");

        if (e.currentTarget.value === "custom") {
          customContainer.style.display = "block";
          const customInput = customContainer.querySelector(
            ".custom-param-input"
          );
          this.config.textReplacements[repIdx].utmRules[rIdx].paramName =
            customInput.value || "my_param";
          customInput.addEventListener("change", (ev) => {
            this.config.textReplacements[repIdx].utmRules[rIdx].paramName =
              ev.currentTarget.value;
          });
        } else {
          customContainer.style.display = "none";
          this.config.textReplacements[repIdx].utmRules[rIdx].paramName =
            e.currentTarget.value;
        }
      });

      // Устанавливаем правильное начальное состояние для пользовательских параметров
      if (
        ![
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
        ].includes(rule.paramName)
      ) {
        paramNameSelect.value = "custom";
        const customContainer = clone.querySelector(
          ".dcm-custom-param-container"
        );
        if (customContainer) {
          customContainer.style.display = "block";
          const customInput = customContainer.querySelector(
            ".custom-param-input"
          );
          if (customInput) {
            customInput.value = rule.paramName;
          }
        }
      }
    }

    const paramValueInput = clone.querySelector(".param-value-input");
    if (paramValueInput) {
      paramValueInput.value = rule.paramValue;
      paramValueInput.dataset.replacementIndex = replacementIndex;
      paramValueInput.dataset.ruleIndex = ruleIndex;
      paramValueInput.addEventListener("change", (e) => {
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        const rIdx = parseInt(e.currentTarget.dataset.ruleIndex);
        this.config.textReplacements[repIdx].utmRules[rIdx].paramValue =
          e.currentTarget.value;
      });
    }

    const replacementValueInput = clone.querySelector(
      ".replacement-value-input"
    );
    if (replacementValueInput) {
      replacementValueInput.value = rule.replacementValue;
      replacementValueInput.dataset.replacementIndex = replacementIndex;
      replacementValueInput.dataset.ruleIndex = ruleIndex;
      replacementValueInput.addEventListener("change", (e) => {
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        const rIdx = parseInt(e.currentTarget.dataset.ruleIndex);
        this.config.textReplacements[repIdx].utmRules[rIdx].replacementValue =
          e.currentTarget.value;
      });
    }

    const customContainer = clone.querySelector(".dcm-custom-param-container");
    if (customContainer) {
      const hint = document.createElement("p");
      hint.className = "helper-text";
      hint.textContent = "Система автоматически отследит ваш параметр в URL";
      customContainer.appendChild(hint);
    }

    container.appendChild(clone);
  }

  renderBlockVisibility() {
    const container = this.elements.blockVisibilityContainer;
    if (!container) return;

    container.innerHTML = "";

    // Настройки по умолчанию (должны быть уже установлены в setInitialState)

    this.config.blockVisibility.forEach((rule, index) => {
      if (!this.templates.blockRule) return;

      const clone = document.importNode(this.templates.blockRule.content, true);

      // Обновляем индекс правила блока
      const ruleIndex = clone.querySelector(".rule-index");
      if (ruleIndex) {
        ruleIndex.textContent = index + 1;
      }

      // Настраиваем кнопку удаления в правом верхнем углу
      const removeBtn = clone.querySelector(
        ".dcm-remove-button.remove-block-rule"
      );
      if (removeBtn) {
        removeBtn.dataset.index = index;
        removeBtn.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.blockVisibility.splice(idx, 1);
          this.renderBlockVisibility();
        });
      }

      const paramNameSelect = clone.querySelector(".param-name-select");
      if (paramNameSelect) {
        paramNameSelect.value = rule.paramName;
        paramNameSelect.dataset.index = index;
        paramNameSelect.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          const customContainer = e.currentTarget
            .closest(".dcm-card.block-rule")
            .querySelector(".dcm-custom-param-container");

          if (e.currentTarget.value === "custom") {
            customContainer.style.display = "block";
            const customInput = customContainer.querySelector(
              ".custom-param-input"
            );
            this.config.blockVisibility[idx].paramName =
              customInput.value || "my_param";
            customInput.addEventListener("change", (ev) => {
              this.config.blockVisibility[idx].paramName =
                ev.currentTarget.value;
            });
          } else {
            customContainer.style.display = "none";
            this.config.blockVisibility[idx].paramName = e.currentTarget.value;
          }
        });

        // Устанавливаем правильное начальное состояние для пользовательских параметров
        if (
          ![
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_content",
            "utm_term",
          ].includes(rule.paramName)
        ) {
          paramNameSelect.value = "custom";
          const customContainer = clone.querySelector(
            ".dcm-custom-param-container"
          );
          if (customContainer) {
            customContainer.style.display = "block";
            const customInput = customContainer.querySelector(
              ".custom-param-input"
            );
            if (customInput) {
              customInput.value = rule.paramName;
              customInput.addEventListener("change", (ev) => {
                const idx = parseInt(paramNameSelect.dataset.index);
                this.config.blockVisibility[idx].paramName =
                  ev.currentTarget.value;
              });
            }
          }
        }
      }

      const paramValueInput = clone.querySelector(".param-value-input");
      if (paramValueInput) {
        paramValueInput.value = rule.paramValue;
        paramValueInput.dataset.index = index;
        paramValueInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.blockVisibility[idx].paramValue = e.currentTarget.value;
        });
      }

      const showBlocksInput = clone.querySelector(".show-blocks-input");
      if (showBlocksInput) {
        showBlocksInput.value = rule.showBlocks.join(", ");
        showBlocksInput.dataset.index = index;
        showBlocksInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.blockVisibility[idx].showBlocks =
            this.utils.parseCommaList(e.currentTarget.value);
        });
      }

      const hideBlocksInput = clone.querySelector(".hide-blocks-input");
      if (hideBlocksInput) {
        hideBlocksInput.value = rule.hideBlocks.join(", ");
        hideBlocksInput.dataset.index = index;
        hideBlocksInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.blockVisibility[idx].hideBlocks =
            this.utils.parseCommaList(e.currentTarget.value);
        });
      }

      const customContainer = clone.querySelector(
        ".dcm-custom-param-container"
      );
      if (customContainer) {
        const hint = document.createElement("p");
        hint.className = "helper-text";
        hint.textContent = "Система автоматически отследит ваш параметр в URL";
        customContainer.appendChild(hint);
      }

      container.appendChild(clone);
    });
  }

  renderIpRules() {
    const container = this.elements.ipRulesContainer;
    if (!container) return;

    container.innerHTML = "";

    this.config.ipRules.forEach((rule, index) => {
      if (!this.templates.ipRule) return;

      const clone = document.importNode(this.templates.ipRule.content, true);

      // Обновляем индекс правила IP
      const ruleIndex = clone.querySelector(".rule-index");
      if (ruleIndex) {
        ruleIndex.textContent = index + 1;
      }

      // Настраиваем кнопку удаления в правом верхнем углу
      const removeBtn = clone.querySelector(
        ".dcm-remove-button.remove-ip-rule"
      );
      if (removeBtn) {
        removeBtn.dataset.index = index;
        removeBtn.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.ipRules.splice(idx, 1);
          this.renderIpRules();
        });
      }

      const countryInput = clone.querySelector(".country-input");
      if (countryInput) {
        countryInput.value = rule.country;
        countryInput.dataset.index = index;
        countryInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.ipRules[idx].country = e.currentTarget.value;
        });
      }

      const cityInput = clone.querySelector(".city-input");
      if (cityInput) {
        cityInput.value = rule.city;
        cityInput.dataset.index = index;
        cityInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.ipRules[idx].city = e.currentTarget.value;
        });
      }

      const regionInput = clone.querySelector(".region-input");
      if (regionInput) {
        regionInput.value = rule.region;
        regionInput.dataset.index = index;
        regionInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.ipRules[idx].region = e.currentTarget.value;
        });
      }

      const textContainer = clone.querySelector(
        ".ip-text-replacements-container"
      );
      if (textContainer && rule.textReplacements) {
        rule.textReplacements.forEach((rep, repIndex) => {
          this.addIpTextReplacementToContainer(
            textContainer,
            rep,
            index,
            repIndex
          );
        });
      }

      const addTextBtn = clone.querySelector(".add-ip-text-replacement");
      if (addTextBtn) {
        addTextBtn.dataset.index = index;
        addTextBtn.addEventListener("click", (e) => {
          this.addNewIpTextReplacement(e.currentTarget);
        });
      }

      const showBlocksInput = clone.querySelector(".show-blocks-input");
      if (showBlocksInput) {
        showBlocksInput.value = rule.showBlocks
          ? rule.showBlocks.join(", ")
          : "";
        showBlocksInput.dataset.index = index;
        showBlocksInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.ipRules[idx].showBlocks = this.utils.parseCommaList(
            e.currentTarget.value
          );
        });
      }

      const hideBlocksInput = clone.querySelector(".hide-blocks-input");
      if (hideBlocksInput) {
        hideBlocksInput.value = rule.hideBlocks
          ? rule.hideBlocks.join(", ")
          : "";
        hideBlocksInput.dataset.index = index;
        hideBlocksInput.addEventListener("change", (e) => {
          const idx = parseInt(e.currentTarget.dataset.index);
          this.config.ipRules[idx].hideBlocks = this.utils.parseCommaList(
            e.currentTarget.value
          );
        });
      }

      // Настраиваем обработчики для кнопки показа списка стран
      const showCountriesButtons = clone.querySelectorAll(
        ".show-countries-list"
      );
      showCountriesButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.showCountriesList();
        });
      });

      container.appendChild(clone);
    });
  }

  addIpTextReplacementToContainer(
    container,
    replacement,
    ipRuleIndex,
    replacementIndex
  ) {
    if (!container) return;
    if (!this.templates.ipTextReplacement) return;

    const clone = document.importNode(
      this.templates.ipTextReplacement.content,
      true
    );

    // Обновляем индекс замены IP
    const replacementIndexEl = clone.querySelector(".ip-replacement-index");
    if (replacementIndexEl) {
      replacementIndexEl.textContent = replacementIndex + 1;
    }

    // Настраиваем кнопку удаления в правом верхнем углу
    const removeBtn = clone.querySelector(
      ".dcm-remove-button.remove-ip-text-replacement"
    );
    if (removeBtn) {
      removeBtn.dataset.ipRuleIndex = ipRuleIndex;
      removeBtn.dataset.replacementIndex = replacementIndex;
      removeBtn.addEventListener("click", (e) => {
        const ipIdx = parseInt(e.currentTarget.dataset.ipRuleIndex);
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        this.config.ipRules[ipIdx].textReplacements.splice(repIdx, 1);
        this.renderIpRules();
      });
    }

    const keywordInput = clone.querySelector(".keyword-input");
    if (keywordInput) {
      keywordInput.value = replacement.keyword;
      keywordInput.dataset.ipRuleIndex = ipRuleIndex;
      keywordInput.dataset.replacementIndex = replacementIndex;
      keywordInput.addEventListener("change", (e) => {
        const ipIdx = parseInt(e.currentTarget.dataset.ipRuleIndex);
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        this.config.ipRules[ipIdx].textReplacements[repIdx].keyword =
          e.currentTarget.value;
      });
    }

    const defaultValueInput = clone.querySelector(".default-value-input");
    if (defaultValueInput) {
      defaultValueInput.value = replacement.defaultValue || "";
      defaultValueInput.dataset.ipRuleIndex = ipRuleIndex;
      defaultValueInput.dataset.replacementIndex = replacementIndex;
      defaultValueInput.addEventListener("change", (e) => {
        const ipIdx = parseInt(e.currentTarget.dataset.ipRuleIndex);
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        this.config.ipRules[ipIdx].textReplacements[repIdx].defaultValue =
          e.currentTarget.value;
      });
    }

    const replacementValueInput = clone.querySelector(
      ".replacement-value-input"
    );
    if (replacementValueInput) {
      replacementValueInput.value = replacement.replacementValue || "";
      replacementValueInput.dataset.ipRuleIndex = ipRuleIndex;
      replacementValueInput.dataset.replacementIndex = replacementIndex;
      replacementValueInput.addEventListener("change", (e) => {
        const ipIdx = parseInt(e.currentTarget.dataset.ipRuleIndex);
        const repIdx = parseInt(e.currentTarget.dataset.replacementIndex);
        this.config.ipRules[ipIdx].textReplacements[repIdx].replacementValue =
          e.currentTarget.value;
      });
    }

    container.appendChild(clone);
  }

  addNewIpTextReplacement(buttonElement) {
    if (!buttonElement) return;

    const idx = parseInt(buttonElement.dataset.index);
    if (!this.config.ipRules[idx].textReplacements) {
      this.config.ipRules[idx].textReplacements = [];
    }

    this.config.ipRules[idx].textReplacements.push({
      keyword: "",
      defaultValue: "",
      replacementValue: "",
    });

    const repIndex = this.config.ipRules[idx].textReplacements.length - 1;
    const replacement = this.config.ipRules[idx].textReplacements[repIndex];
    const textContainer = buttonElement.previousElementSibling;

    if (textContainer) {
      this.addIpTextReplacementToContainer(
        textContainer,
        replacement,
        idx,
        repIndex
      );
    }
  }

  // Функция показа модального окна со списком стран
  showCountriesList() {
    // Создаем модальное окно
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "flex";
    modal.id = "countries-modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.style.maxWidth = "700px";
    modalContent.style.maxHeight = "80vh";
    modalContent.style.overflow = "auto";

    const closeButton = document.createElement("button");
    closeButton.className = "close-modal";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => this.closeCountriesModal());

    const header = document.createElement("h3");
    header.textContent = "Список стран для GeoJS API";

    const description = document.createElement("p");
    description.textContent =
      "Используйте полное название страны на английском языке. Ниже приведены примеры наиболее распространенных стран:";

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "15px";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const thCountry = document.createElement("th");
    thCountry.textContent = "Полное название (использовать)";
    thCountry.style.padding = "8px";
    thCountry.style.textAlign = "left";
    thCountry.style.borderBottom = "2px solid #ddd";

    const thCode = document.createElement("th");
    thCode.textContent = "Код ISO (НЕ использовать)";
    thCode.style.padding = "8px";
    thCode.style.textAlign = "left";
    thCode.style.borderBottom = "2px solid #ddd";

    headerRow.appendChild(thCountry);
    headerRow.appendChild(thCode);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const countries = [
      { name: "Russia", code: "RU" },
      { name: "Belarus", code: "BY" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Ukraine", code: "UA" },
      { name: "Armenia", code: "AM" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Moldova", code: "MD" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Georgia", code: "GE" },
      { name: "Estonia", code: "EE" },
      { name: "Latvia", code: "LV" },
      { name: "Lithuania", code: "LT" },
      { name: "United States", code: "US" },
      { name: "Germany", code: "DE" },
      { name: "France", code: "FR" },
      { name: "United Kingdom", code: "GB" },
      { name: "China", code: "CN" },
      { name: "Japan", code: "JP" },
      { name: "Canada", code: "CA" },
      { name: "Australia", code: "AU" },
      { name: "Brazil", code: "BR" },
      { name: "India", code: "IN" },
      { name: "Spain", code: "ES" },
      { name: "Italy", code: "IT" },
      { name: "Mexico", code: "MX" },
      { name: "South Korea", code: "KR" },
    ];

    countries.forEach((country, index) => {
      const row = document.createElement("tr");
      row.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "white";

      const tdCountry = document.createElement("td");
      tdCountry.textContent = country.name;
      tdCountry.style.padding = "8px";
      tdCountry.style.borderBottom = "1px solid #ddd";
      tdCountry.style.cursor = "pointer";
      tdCountry.title = "Нажмите, чтобы использовать это название";

      tdCountry.addEventListener("click", () => {
        const activeInput = Array.from(
          document.querySelectorAll(".country-input")
        ).find((input) => document.activeElement === input);
        if (activeInput) {
          activeInput.value = country.name;
          activeInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
        this.closeCountriesModal();
      });

      const tdCode = document.createElement("td");
      tdCode.textContent = country.code;
      tdCode.style.padding = "8px";
      tdCode.style.borderBottom = "1px solid #ddd";

      row.appendChild(tdCountry);
      row.appendChild(tdCode);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    const note = document.createElement("p");
    note.textContent =
      'Примечание: Для обозначения любой страны используйте символ "*". Нажмите на название страны, чтобы использовать его.';
    note.style.marginTop = "15px";
    note.style.fontStyle = "italic";

    const closeBtnBottom = document.createElement("button");
    closeBtnBottom.className = "btn btn-primary";
    closeBtnBottom.textContent = "Закрыть";
    closeBtnBottom.style.marginTop = "15px";
    closeBtnBottom.style.display = "block";
    closeBtnBottom.style.margin = "15px auto 0";
    closeBtnBottom.addEventListener("click", () => this.closeCountriesModal());

    modalContent.append(
      closeButton,
      header,
      description,
      table,
      note,
      closeBtnBottom
    );
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) this.closeCountriesModal();
    });

    document.addEventListener("keydown", this.handleCountriesModalEscape);
  }

  closeCountriesModal() {
    const modal = document.getElementById("countries-modal");
    if (modal) {
      document.body.removeChild(modal);
      document.removeEventListener("keydown", this.handleCountriesModalEscape);
    }
  }

  handleCountriesModalEscape(event) {
    if (event.key === "Escape") {
      this.closeCountriesModal();
    }
  }

  // Собираем пользовательские параметры из конфигурации
  collectCustomParameters() {
    const customParams = new Set();

    this.config.textReplacements.forEach((replacement) => {
      replacement.utmRules?.forEach((rule) => {
        if (rule.paramName && !rule.paramName.startsWith("utm_")) {
          customParams.add(rule.paramName);
        }
      });
    });

    this.config.blockVisibility.forEach((rule) => {
      if (rule.paramName && !rule.paramName.startsWith("utm_")) {
        customParams.add(rule.paramName);
      }
    });

    return Array.from(customParams);
  }

  // Генерация и копирование кода
  generateAndCopyCode() {
    const code = this.generateCode();
    this.copyAndNotify(code);
  }

  // Генерация итогового кода
  generateCode() {
    console.log("Начинаем генерацию кода...");

    // Делаем копию конфига, чтобы не мутировать исходный
    const cleanConfig = JSON.parse(JSON.stringify(this.config));

    // Очистка и нормализация данных
    cleanConfig.textReplacements.forEach((replacement) => {
      replacement.utmRules?.forEach((rule) => {
        if (!rule.paramName) rule.paramName = "my_param";
      });
    });
    cleanConfig.blockVisibility.forEach((rule) => {
      if (!rule.paramName) rule.paramName = "my_param";
    });

    // Собираем дополнительные параметры (те, что не начинаются с utm_)
    cleanConfig.additionalParams = this.collectCustomParameters();

    // Превращаем конфиг в JSON-строку (с отступами для красоты)
    const configJson = JSON.stringify(cleanConfig, null, 2);

    // Ниже итоговый скрипт с ключевыми изменениями в init():
    const code = `<!-- UTM/IP расширение -->
  <script>
  // Скрываем страницу до полного применения дефолтных замен (чтобы не светить %%ключи%%)
  document.documentElement.style.visibility = 'hidden';

  class TaptopContentChanger {
    constructor(config) {
      try {
        this.config = config || { textReplacements: [], blockVisibility: [], ipRules: [] };
        this.utmParams = this.getUTMParams();
        this.ipInfo = null;
  
        // Если есть IP-правила, пытаемся определить локацию
        if (this.config.ipRules && this.config.ipRules.length > 0) {
          this.detectLocation();
        }
      } catch (error) {
        console.error('Ошибка при инициализации расширения UTM/IP:', error);
      }
    }
  
    getUTMParams() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const utm = {};
  
        // Проверяем наличие стандартных UTM в URL
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
          if (urlParams.has(param)) {
            utm[param] = urlParams.get(param);
          }
        });
  
        // Проверка дополнительных (кастомных) параметров
        if (this.config.additionalParams && this.config.additionalParams.length > 0) {
          this.config.additionalParams.forEach(param => {
            if (urlParams.has(param)) {
              utm[param] = urlParams.get(param);
            }
          });
        }
  
        if (Object.keys(utm).length === 0) {
          console.log('UTM-параметры не найдены в URL');
        }
  
        return utm;
      } catch (error) {
        console.error('Ошибка при получении UTM параметров:', error);
        return {};
      }
    }
  
    async detectLocation() {
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await response.json();
        if (!data || !data.country) {
          console.error('Ошибка определения геолокации: некорректный ответ');
          return;
        }
        this.ipInfo = {
          country_name: data.country,
          country_code: data.country_code,
          country_code3: data.country_code3,
          region: data.region,
          city: data.city
        };

        // Применяем IP-правила (асинхронно, когда данные уже получены)
        this.applyIPRules();
      } catch (error) {
        console.error('Ошибка при определении геолокации:', error);
      }
    }
  
    // Обрабатываем значения по умолчанию сразу, чтобы не светились %%ключ%%
    applyDefaultIPTextReplacements() {
      try {
        if (!this.config.ipRules || !this.config.ipRules.length) return;

        const defaults = {};
        this.config.ipRules.forEach(rule => {
          if (rule.textReplacements) {
            rule.textReplacements.forEach(rep => {
              if (rep.keyword && rep.defaultValue) {
                // Сохраняем дефолтное значение для этого ключа
                defaults[rep.keyword] = rep.defaultValue;
              }
            });
          }
        });
  
        // Заменяем все %%ключ%% на эти дефолтные значения
        for (const [keyword, defValue] of Object.entries(defaults)) {
          const elements = this.findElementsWithText(keyword);
          elements.forEach(element => {
            const original = element.innerHTML;
            const pattern = new RegExp(\`%%\${keyword}%%\`, 'g');
            const newContent = original.replace(pattern, defValue);
            if (original !== newContent) {
              element.innerHTML = newContent;
            }
          });
        }
      } catch (error) {
        console.error('Ошибка при применении значений текста по умолчанию из IP-правил:', error);
      }
    }
  
    replaceText() {
      try {
        if (!this.config.textReplacements || !this.config.textReplacements.length) {
          return;
        }
  
        this.config.textReplacements.forEach((rule, index) => {
          const elements = this.findElementsWithText(rule.keyword);
  
          let replacementValue = rule.defaultValue;
  
          if (rule.utmRules && rule.utmRules.length) {
            const matchedRule = rule.utmRules.find(utmRule => {
              const hasParam = this.utmParams[utmRule.paramName];
              const matchesValue = this.utmParams[utmRule.paramName] === utmRule.paramValue || utmRule.paramValue === '*';
              return hasParam && matchesValue;
            });
            if (matchedRule) {
              replacementValue = matchedRule.replacementValue;
            }
          }
  
          elements.forEach(element => {
            const original = element.innerHTML;
            const pattern = new RegExp(\`%%\${rule.keyword}%%\`, 'g');
            const newContent = original.replace(pattern, replacementValue);
            if (original !== newContent) {
              element.innerHTML = newContent;
            } else {
            }
          });
        });
      } catch (error) {
        console.error('Ошибка при замене текста:', error);
      }
    }
  
    toggleBlocksVisibility() {
      try {
        if (!this.config.blockVisibility || !this.config.blockVisibility.length) {
          return;
        }
  
        let matchedRule = null;
        for (const rule of this.config.blockVisibility) {
          const hasParam = this.utmParams[rule.paramName];
          const matchesValue = this.utmParams[rule.paramName] === rule.paramValue || rule.paramValue === '*';
  
          if (hasParam && matchesValue) {
            matchedRule = rule;
            break;
          }
        }
  
        if (matchedRule) {
          this.applyVisibilityRules(matchedRule.showBlocks, matchedRule.hideBlocks);
        } else if (this.config.defaultBlockVisibility) {
          this.applyVisibilityRules(
            this.config.defaultBlockVisibility.showBlocks,
            this.config.defaultBlockVisibility.hideBlocks
          );
        }
      } catch (error) {
        console.error('Ошибка при управлении видимостью блоков:', error);
      }
    }
  
    applyIPRules() {
      try {
        if (!this.ipInfo || !this.config.ipRules || !this.config.ipRules.length) {
          return;
        }
        // Сейчас "дефолтные" IP-замены уже были применены при инициализации.
        // Здесь мы ищем конкретное правило (страна/город/регион) и при совпадении снова заменяем текст.
  
        // Готовим нормализованные названия
        const normalized = {
          country: this.ipInfo.country_name?.toLowerCase().trim(),
          country_code: this.ipInfo.country_code?.toLowerCase().trim(),
          country_code3: this.ipInfo.country_code3?.toLowerCase().trim(),
          city: this.ipInfo.city?.toLowerCase().trim(),
          region: this.ipInfo.region?.toLowerCase().trim()
        };
  
        let matchedRule = null;
        for (const rule of this.config.ipRules) {
          const ruleCountry = rule.country?.toLowerCase().trim();
          const ruleCity = rule.city?.toLowerCase().trim();
          const ruleRegion = rule.region?.toLowerCase().trim();
  
          const countryMatch = ruleCountry === '*' || ruleCountry === normalized.country
            || ruleCountry === normalized.country_code || ruleCountry === normalized.country_code3;
          const cityMatch = ruleCity === '*' || ruleCity === normalized.city;
          const regionMatch = ruleRegion === '*' || ruleRegion === normalized.region;
  

          if (countryMatch && cityMatch && regionMatch) {
            matchedRule = rule;
            break;
          }
        }
  
        if (matchedRule) {
          if (matchedRule.textReplacements && matchedRule.textReplacements.length) {
            matchedRule.textReplacements.forEach(replacement => {
              const elements = this.findElementsWithText(replacement.keyword);
              elements.forEach(element => {
                const original = element.innerHTML;
                const pattern = new RegExp(\`%%\${replacement.keyword}%%\`, 'g');
                const newContent = original.replace(pattern, replacement.replacementValue);
                if (original !== newContent) {
                  element.innerHTML = newContent;
                }
              });
            });
          }
          this.applyVisibilityRules(matchedRule.showBlocks, matchedRule.hideBlocks);
        } 
      } catch (error) {
        console.error('DynamicContentManager: Ошибка при применении IP-правил:', error);
      }
    }
  
    applyVisibilityRules(showBlocks, hideBlocks) {
      try {
        if (hideBlocks && hideBlocks.length) {
          hideBlocks.forEach((id) => {
            const selector = \`#\${id}, .\${id}, [data-block-id="\${id}"]\`;
            const elements = Array.from(document.querySelectorAll(selector));
            elements.forEach((el) => {
              el.style.display = 'none';
            });
          });
        }
        if (showBlocks && showBlocks.length) {
          showBlocks.forEach((id) => {
            const selector = \`#\${id}, .\${id}, [data-block-id="\${id}"]\`;
            const elements = Array.from(document.querySelectorAll(selector));
            elements.forEach((el) => {
              el.style.display = '';
            });
          });
        }
      } catch (error) {
        console.error('Ошибка при применении правил видимости:', error);
      }
    }
  
    findElementsWithText(keyword) {
      try {
        const elements = [];
        const pattern = new RegExp(\`%%\${keyword}%%\`);
  
        const search = (node) => {
          if (!node) return;
          if (node.nodeType === Node.TEXT_NODE) {
            if (pattern.test(node.textContent)) {
              const parent = node.parentElement;
              if (parent && !elements.includes(parent)) elements.push(parent);
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (pattern.test(node.innerHTML)) {
              if (!elements.includes(node)) elements.push(node);
            }
            Array.from(node.childNodes).forEach(search);
          }
        };
        search(document.body);
        return elements;
      } catch (error) {
        return [];
      }
    }
  
    init() {
      try {

        // 1) Сразу подставляем дефолтные тексты для IP-ключей (чтобы не увидеть %%ключ%%)
        this.applyDefaultIPTextReplacements();
  
        // 2) Подставляем UTM-замены
        this.replaceText();
  
        // 3) Логика скрытия/показа блоков по UTM (и дефолту)
        this.toggleBlocksVisibility();
  
        // 4) Показываем страницу
        document.documentElement.style.visibility = '';
  
        // Добавляем скрытый блок для отладки
        const debugInfo = document.createElement('div');
        debugInfo.style.display = 'none';
        debugInfo.id = 'dcm-debug-info';
        debugInfo.setAttribute('data-loaded', 'true');
        debugInfo.setAttribute('data-utms', JSON.stringify(this.utmParams));
        document.body.appendChild(debugInfo);
  
      } catch (error) {
        console.error('Ошибка при инициализации расширения UTM/IP:', error);
      }
    }
  }
  
  // Запускаем скрипт после полной загрузки DOM
  document.addEventListener('DOMContentLoaded', function() {
    try {
      // Маркер, что наш скрипт подгрузился
      const debugMarker = document.createElement('div');
      debugMarker.id = 'dcm-script-loaded';
      debugMarker.style.display = 'none';
      document.body.appendChild(debugMarker);
  
      const contentChanger = new TaptopContentChanger(${configJson});
      contentChanger.init();
    } catch (error) {
      console.error('Критическая ошибка при запуске скрипта:', error);
    }
  });
  </script>`;

    // Возвращаем готовый JS-код (скрипт) одной строкой
    return code;
  }
}
// Инициализация генератора
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".dcm-container")) {
    const dynamicContentGenerator = new DynamicContentGenerator();
    dynamicContentGenerator.init();
  }
});

// Экспортируем функцию инициализации для Docsify
window.initDynamicContentGenerator = function () {
  if (document.querySelector(".dcm-container")) {
    const dynamicContentGenerator = new DynamicContentGenerator();
    dynamicContentGenerator.init();
  }
};
