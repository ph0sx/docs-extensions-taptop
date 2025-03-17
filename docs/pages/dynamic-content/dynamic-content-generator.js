/**
 * DynamicContentManager для Taptop
 * Генератор кода для изменения контента на сайте по IP и UTM-параметрам
 */
(function () {
  "use strict";

  // Конфигурация по умолчанию
  const defaultConfig = {
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
    // additionalParams будут собраны автоматически
  };

  // Утилиты
  const Utils = {
    parseCommaList: (str) =>
      !str
        ? []
        : str
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

    // Копирование текста БЕЗ fallback-пrompt. Если копирование недоступно — просто логируем ошибку.
    copyToClipboard: async (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          console.log("Текст успешно скопирован в буфер обмена");
        } catch (err) {
          console.error("Ошибка копирования через Clipboard API:", err);
        }
      } else {
        console.warn(
          "Clipboard API недоступен или не в безопасном контексте (HTTPS). Копирование не выполнено."
        );
      }
    },

    // Рекурсивный поиск элементов, содержащих ключ в формате %%keyword%%
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

  // Класс для управления UI и привязкой событий
  class DynamicContentManagerUI {
    constructor(config) {
      this.config = config;
      this.requiredElements = [
        "text-replacements-container",
        "block-visibility-container",
        "ip-rules-container",
        "default-show-blocks",
        "default-hide-blocks",
      ];
    }

    init() {
      console.log("Инициализация DynamicContentManager...");
      if (!this.checkRequiredElements()) {
        console.warn(
          "Отсутствуют необходимые элементы. Инициализация прервана."
        );
        return;
      }
      this.initTabs();
      this.renderUI();
      this.initEventListeners();
      // Добавляем вызов функции для строки "Важно:"
      this.modifyImportantText();
      // Добавляем обновление заголовков секций
      this.updateSectionHeaders();
      console.log("DynamicContentManager успешно инициализирован!");
    }

    checkRequiredElements() {
      const missing = this.requiredElements.filter(
        (id) => !document.getElementById(id)
      );
      if (missing.length > 0) {
        console.warn(
          "DynamicContentManager: отсутствуют необходимые элементы:",
          missing
        );
        console.warn(
          "Возможно, вы находитесь не на странице DynamicContentManager"
        );
        return false;
      }
      return true;
    }

    // Обновляем заголовки секций на вкладках
    updateSectionHeaders() {
      // Заголовок для вкладки "Замена текста"
      const textTab = document.getElementById("text-tab");
      if (textTab) {
        const existingHeader = textTab.querySelector("h2");
        if (existingHeader) {
          // Создаем новый заголовок в едином стиле, если его еще нет
          if (!textTab.querySelector(".dcm-replacements-header")) {
            const newHeader = document.createElement("div");
            newHeader.className = "dcm-replacements-header";
            newHeader.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4483f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span class="dcm-replacements-header-text">Замена текста</span>
            `;
            
            // Заменяем старый заголовок
            existingHeader.parentNode.replaceChild(newHeader, existingHeader);
          }
        }
      }
      
      // Обновляем заголовок для вкладки "Управление блоками"
      const blocksTab = document.getElementById("blocks-tab");
      if (blocksTab) {
        const existingHeader = blocksTab.querySelector("h2");
        if (existingHeader) {
          // Создаем новый заголовок в едином стиле, если его еще нет
          if (!blocksTab.querySelector(".dcm-section-header")) {
            const newHeader = document.createElement("div");
            newHeader.className = "dcm-section-header";
            newHeader.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4483f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span class="dcm-section-header-text">Управление блоками по UTM-параметрам</span>
            `;
            
            // Заменяем старый заголовок
            existingHeader.parentNode.replaceChild(newHeader, existingHeader);
          }
        }
      }
      
      // Обновляем заголовок для вкладки "Правила по IP"
      const ipTab = document.getElementById("ip-tab");
      if (ipTab) {
        const existingHeader = ipTab.querySelector("h2");
        if (existingHeader) {
          // Создаем новый заголовок в едином стиле, если его еще нет
          if (!ipTab.querySelector(".dcm-region-rule-header")) {
            const newHeader = document.createElement("div");
            newHeader.className = "dcm-region-rule-header";
            newHeader.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4483f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path>
              </svg>
              <span class="dcm-region-rule-header-text">Правила по геолокации (IP)</span>
            `;
            
            // Заменяем старый заголовок
            existingHeader.parentNode.replaceChild(newHeader, existingHeader);
          }
        }
      }
    }

    initTabs() {
      const tabButtons = document.querySelectorAll(".dcm-tab-button");
      
      // Полностью удаляем вкладки "settings" и "generate"
      ["settings", "generate"].forEach((tabName) => {
        const tabEl = document.querySelector(`.dcm-tab-button[data-tab='${tabName}']`);
        if (tabEl) tabEl.remove(); // Удаляем элемент полностью, а не скрываем
        const tabContent = document.getElementById(`${tabName}-tab`);
        if (tabContent) tabContent.remove(); // Удаляем контент вкладки
      });
      
      // Обработчики для оставшихся вкладок
      document.querySelectorAll(".dcm-tab-button").forEach((button) => {
        button.addEventListener("click", () => {
          document
            .querySelectorAll(".dcm-tab-content")
            .forEach((tab) => tab.classList.remove("active"));
          document.querySelectorAll(".dcm-tab-button")
            .forEach((btn) => btn.classList.remove("active"));
          const tabName = button.getAttribute("data-tab");
          const tabContent = document.getElementById(`${tabName}-tab`);
          if (tabContent) {
            tabContent.classList.add("active");
            button.classList.add("active");
          }
          // Проверяем строку "Важно:" после переключения вкладки
          setTimeout(() => {
            this.modifyImportantText();
            this.updateSectionHeaders();
          }, 50);
        });
      });
      
      // Активируем первую вкладку, если ни одна не активна
      if (!document.querySelector(".dcm-tab-button.active")) {
        const firstButton = document.querySelector(".dcm-tab-button");
        if (firstButton) {
          const tabName = firstButton.getAttribute("data-tab");
          const tabContent = document.getElementById(`${tabName}-tab`);
          if (tabContent) {
            tabContent.classList.add("active");
            firstButton.classList.add("active");
          }
        }
      }
      
      // Добавляем плавающие кнопки "Сгенерировать код" на нужные вкладки
      ["text-tab", "blocks-tab", "ip-tab"].forEach((tabId) => {
        const tab = document.getElementById(tabId);
        if (tab && !tab.querySelector(".dcm-generate-code-container")) {
          const container = document.createElement("div");
          container.className = "dcm-generate-code-container";
          container.style.marginTop = "25px";
          container.style.textAlign = "center";

          const btn = document.createElement("button");
          btn.className = "dcm-generate-button floating-generate-btn";
          btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 18L22 12L16 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6L2 12L8 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Сгенерировать код</span>
          `;

          container.appendChild(btn);
          tab.appendChild(container);
          btn.addEventListener("click", () => {
            console.log("Запуск генерации кода...");
            generateCode();
          });
        }
      });
    }

    renderUI() {
      try {
        this.renderTextReplacements();
        this.renderBlockVisibility();
        this.renderIpRules();
      } catch (error) {
        console.error("Ошибка при рендеринге UI:", error);
      }
    }

    // Функция для строки "Важно:" - сдвигаем на строку ниже
    modifyImportantText() {
      // Находим нужный элемент с текстом
      const hints = document.querySelectorAll('.dcm-hint');
      
      hints.forEach(hint => {
        if (hint.textContent.includes('Важно:')) {
          // Получаем текущий текст
          const text = hint.innerHTML;
          
          // Если текст содержит "Важно:", но не содержит <br>, добавляем перенос
          if (text.includes('Важно:') && !text.includes('<br>')) {
            // Разделяем текст перед "Важно:"
            const parts = text.split(/Важно:/);
            if (parts.length === 2) {
              // Создаем новую структуру
              hint.innerHTML = parts[0] + '<br><strong>Важно:</strong>' + parts[1];
            }
          }
        }
      });
    }

    // Функция для управления видимостью заголовка UTM правил
    updateUtmRulesHeaders() {
      // Находим все контейнеры с заменами текста
      document.querySelectorAll('.text-replacement').forEach(container => {
        // Получаем контейнер с UTM правилами
        const utmContainer = container.querySelector('.utm-rules-container');
        const utmHeader = container.querySelector('.utm-rules-header');
        
        // Проверяем количество правил в контейнере
        if (utmContainer && utmHeader) {
          const utmRules = utmContainer.querySelectorAll('.utm-rule');
          if (utmRules.length === 0) {
            utmHeader.style.display = 'none';
          } else {
            utmHeader.style.display = 'flex';
          }
        }
      });
    }

    initEventListeners() {
      try {
        // Добавление нового правила замены текста
        const addTextBtn = document.getElementById("add-text-replacement");
        if (addTextBtn) {
          addTextBtn.addEventListener("click", () => {
            this.config.textReplacements.push({
              keyword: "",
              defaultValue: "",
              utmRules: [],
            });
            this.renderTextReplacements();
          });
        }
        // Добавление нового правила видимости блоков
        const addBlockBtn = document.getElementById("add-block-rule");
        if (addBlockBtn) {
          addBlockBtn.addEventListener("click", () => {
            this.config.blockVisibility.push({
              paramName: "utm_content",
              paramValue: "",
              showBlocks: [],
              hideBlocks: [],
            });
            this.renderBlockVisibility();
          });
        }
        // Добавление нового IP правила
        const addIpBtn = document.getElementById("add-ip-rule");
        if (addIpBtn) {
          addIpBtn.addEventListener("click", () => {
            this.config.ipRules.push({
              country: "",
              city: "*",
              region: "*",
              textReplacements: [],
              showBlocks: [],
              hideBlocks: [],
            });
            this.renderIpRules();
          });
        }
        // Обработчики для настроек блоков по умолчанию
        const defaultShow = document.getElementById("default-show-blocks");
        if (defaultShow) {
          defaultShow.addEventListener("change", (e) => {
            this.config.defaultBlockVisibility.showBlocks =
              Utils.parseCommaList(e.currentTarget.value);
          });
        }
        const defaultHide = document.getElementById("default-hide-blocks");
        if (defaultHide) {
          defaultHide.addEventListener("change", (e) => {
            this.config.defaultBlockVisibility.hideBlocks =
              Utils.parseCommaList(e.currentTarget.value);
          });
        }
        // Генерация кода стандартной кнопкой
        const generateBtn = document.getElementById("generate-code-btn");
        if (generateBtn) {
          generateBtn.addEventListener("click", () => {
            console.log("Запуск генерации кода...");
            generateCode();
          });
        }
        // Обработчики для плавающих кнопок
        document.querySelectorAll(".floating-generate-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            console.log("Запуск генерации кода с плавающей кнопки...");
            generateCode();
          });
        });
        this.initModalEvents();
      } catch (error) {
        console.error("Ошибка при инициализации обработчиков событий:", error);
      }
    }

    initModalEvents() {
      const modal = document.getElementById("success-modal");
      if (modal) {
        modal
          .querySelectorAll(".dcm-close-modal, .dcm-close-button")
          .forEach((el) =>
            el.addEventListener("click", () => (modal.style.display = "none"))
          );
        window.addEventListener("click", (event) => {
          if (event.target === modal) modal.style.display = "none";
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && modal.style.display === "flex")
            modal.style.display = "none";
        });
      }
    }

    renderTextReplacements() {
      const container = document.getElementById("text-replacements-container");
      if (!container)
        return console.error("Не найден контейнер text-replacements-container");
      
      container.innerHTML = "";
      
      this.config.textReplacements.forEach((replacement, index) => {
        const template = document.getElementById("text-replacement-template");
        if (!template)
          return console.error("Не найден шаблон text-replacement-template");
        
        const clone = document.importNode(template.content, true);
        
        // Настраиваем кнопку удаления в правом верхнем углу
        const removeBtn = clone.querySelector(".dcm-remove-button.remove-text-replacement");
        if (removeBtn) {
          removeBtn.dataset.index = index;
          removeBtn.addEventListener("click", (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            this.config.textReplacements.splice(idx, 1);
            this.renderTextReplacements();
          });
        }
        
        // Находим и изменяем заголовок UTM правил - скрываем если правил нет
        const utmRulesHeader = clone.querySelector(".utm-rules-header");
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
            const utmHeader = e.currentTarget.closest('.text-replacement').querySelector('.utm-rules-header');
            if (utmHeader) {
              utmHeader.style.display = 'flex';
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
      const template = document.getElementById("utm-rule-template");
      if (!template) return;
      const clone = document.importNode(template.content, true);

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
        hint.className = "dcm-hint";
        hint.textContent = "Система автоматически отследит ваш параметр в URL";
        customContainer.appendChild(hint);
      }
      container.appendChild(clone);
    }

    renderBlockVisibility() {
      const container = document.getElementById("block-visibility-container");
      if (!container) {
        console.error("Не найден контейнер block-visibility-container");
        return;
      }
      container.innerHTML = "";

      // Настройки по умолчанию
      const defaultShow = document.getElementById("default-show-blocks");
      const defaultHide = document.getElementById("default-hide-blocks");
      if (defaultShow) {
        defaultShow.value =
          this.config.defaultBlockVisibility.showBlocks.join(", ");
      }
      if (defaultHide) {
        defaultHide.value =
          this.config.defaultBlockVisibility.hideBlocks.join(", ");
      }

      this.config.blockVisibility.forEach((rule, index) => {
        const template = document.getElementById("block-rule-template");
        if (!template) {
          console.error("Не найден шаблон block-rule-template");
          return;
        }
        const clone = document.importNode(template.content, true);

        // Настраиваем кнопку удаления в правом верхнем углу
        const removeBtn = clone.querySelector(".dcm-remove-button.remove-block-rule");
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
              const customInput = customContainer.querySelector(".custom-param-input");
              this.config.blockVisibility[idx].paramName = customInput.value || "my_param";
              customInput.addEventListener("change", (ev) => {
                this.config.blockVisibility[idx].paramName = ev.currentTarget.value;
              });
            } else {
              customContainer.style.display = "none";
              this.config.blockVisibility[idx].paramName = e.currentTarget.value;
            }
          });
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
            this.config.blockVisibility[idx].showBlocks = Utils.parseCommaList(
              e.currentTarget.value
            );
          });
        }
        const hideBlocksInput = clone.querySelector(".hide-blocks-input");
        if (hideBlocksInput) {
          hideBlocksInput.value = rule.hideBlocks.join(", ");
          hideBlocksInput.dataset.index = index;
          hideBlocksInput.addEventListener("change", (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            this.config.blockVisibility[idx].hideBlocks = Utils.parseCommaList(
              e.currentTarget.value
            );
          });
        }
        
        const customContainer = clone.querySelector(".dcm-custom-param-container");
        if (customContainer) {
          const hint = document.createElement("p");
          hint.className = "dcm-hint";
          hint.textContent =
            "Система автоматически отследит ваш параметр в URL";
          customContainer.appendChild(hint);
        }
        container.appendChild(clone);
      });
      
      // Проверяем строку "Важно:" после рендеринга
      setTimeout(() => this.modifyImportantText(), 50);
    }

    renderIpRules() {
      const container = document.getElementById("ip-rules-container");
      if (!container) {
        console.error("Не найден контейнер ip-rules-container");
        return;
      }
      container.innerHTML = "";

      this.config.ipRules.forEach((rule, index) => {
        const template = document.getElementById("ip-rule-template");
        if (!template) {
          console.error("Не найден шаблон ip-rule-template");
          return;
        }
        const clone = document.importNode(template.content, true);

        // Настраиваем кнопку удаления в правом верхнем углу
        const removeBtn = clone.querySelector(".dcm-remove-button.remove-ip-rule");
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
            this.config.ipRules[idx].showBlocks = Utils.parseCommaList(
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
            this.config.ipRules[idx].hideBlocks = Utils.parseCommaList(
              e.currentTarget.value
            );
          });
        }
        
        const countryHint = clone.querySelector(".dcm-country-hint");
        if (countryHint) {
          countryHint.innerHTML =
            "Введите полное название страны на английском (например, Russia, Belarus). <a href='#' class='show-countries-list'>Показать список стран</a>";
        }
        container.appendChild(clone);
      });

      document.querySelectorAll(".show-countries-list").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showCountriesList();
        });
      });
    }

    addIpTextReplacementToContainer(
      container,
      replacement,
      ipRuleIndex,
      replacementIndex
    ) {
      if (!container) return;
      const template = document.getElementById("ip-text-replacement-template");
      if (!template) return;
      const clone = document.importNode(template.content, true);

      // Настраиваем кнопку удаления в правом верхнем углу
      const removeBtn = clone.querySelector(".dcm-remove-button.remove-ip-text-replacement");
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
  }

  // Функция показа модального окна со списком стран
  function showCountriesList() {
    const modal = document.createElement("div");
    modal.className = "dcm-modal";
    modal.style.display = "flex";
    modal.id = "countries-modal";

    const modalContent = document.createElement("div");
    modalContent.className = "dcm-modal-content";
    modalContent.style.maxWidth = "700px";
    modalContent.style.maxHeight = "80vh";
    modalContent.style.overflow = "auto";

    const closeButton = document.createElement("button");
    closeButton.className = "dcm-close-modal";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", closeCountriesModal);

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
        closeCountriesModal();
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
    closeBtnBottom.className = "dcm-btn dcm-btn-primary";
    closeBtnBottom.textContent = "Закрыть";
    closeBtnBottom.style.marginTop = "15px";
    closeBtnBottom.style.display = "block";
    closeBtnBottom.style.margin = "15px auto 0";
    closeBtnBottom.addEventListener("click", closeCountriesModal);

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
      if (event.target === modal) closeCountriesModal();
    });
    document.addEventListener("keydown", closeCountriesModalOnEscape);
  }

  function closeCountriesModal() {
    const modal = document.getElementById("countries-modal");
    if (modal) {
      document.body.removeChild(modal);
      document.removeEventListener("keydown", closeCountriesModalOnEscape);
    }
  }

  function closeCountriesModalOnEscape(event) {
    if (event.key === "Escape") {
      closeCountriesModal();
    }
  }

  // Собираем пользовательские параметры из конфигурации
  function collectCustomParameters() {
    const customParams = new Set();
    defaultConfig.textReplacements.forEach((replacement) => {
      replacement.utmRules?.forEach((rule) => {
        if (rule.paramName && !rule.paramName.startsWith("utm_")) {
          customParams.add(rule.paramName);
        }
      });
    });
    defaultConfig.blockVisibility.forEach((rule) => {
      if (rule.paramName && !rule.paramName.startsWith("utm_")) {
        customParams.add(rule.paramName);
      }
    });
    return Array.from(customParams);
  }

  // Генерация итогового кода
  function generateCode() {
    console.log("Начинаем генерацию кода...");

    const cleanConfig = JSON.parse(JSON.stringify(defaultConfig));
    cleanConfig.textReplacements.forEach((replacement) => {
      replacement.utmRules?.forEach((rule) => {
        if (!rule.paramName) rule.paramName = "my_param";
      });
    });
    cleanConfig.blockVisibility.forEach((rule) => {
      if (!rule.paramName) rule.paramName = "my_param";
    });
    cleanConfig.additionalParams = collectCustomParameters();

    const configJson = JSON.stringify(cleanConfig, null, 2);
    const code = `<!-- DynamicContentManager для Taptop - Script -->
<script>
/**
 * DynamicContentManager для Taptop
 * 
 * Скрипт для изменения контента на сайте по IP и UTM-параметрам
 * Сгенерировано: ${new Date().toLocaleString()}
 */

class TaptopContentChanger {
  constructor(config) {
    this.config = config || { textReplacements: [], blockVisibility: [], ipRules: [] };
    this.utmParams = this.getUTMParams();
    this.ipInfo = null;
    if (this.config.ipRules.length > 0) {
      this.detectLocation();
    }
  }
  
  getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      if (urlParams.has(param)) {
        utm[param] = urlParams.get(param);
        console.log(\`Найден UTM-параметр: \${param}=\${utm[param]}\`);
      }
    });
    if (this.config.additionalParams) {
      this.config.additionalParams.forEach(param => {
        if (urlParams.has(param)) {
          utm[param] = urlParams.get(param);
          console.log(\`Найден дополнительный параметр: \${param}=\${utm[param]}\`);
        }
      });
    }
    return utm;
  }
  
  async detectLocation() {
    try {
      console.log('Запрос геолокации через GeoJS...');
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await response.json();
      if (!data || !data.country) {
        console.error('Ошибка определения геолокации: некорректный ответ', data);
        return;
      }
      this.ipInfo = {
        country_name: data.country,
        country_code: data.country_code,
        country_code3: data.country_code3,
        region: data.region,
        city: data.city
      };
      console.log('Получены данные геолокации:', this.ipInfo);
      console.log(\`Определена локация: \${data.city || '*'}, \${data.region || '*'}, \${data.country} (\${data.country_code})\`);
      this.applyIPRules();
    } catch (error) {
      console.error('Ошибка при определении геолокации:', error);
    }
  }
  
  replaceText() {
    if (!this.config.textReplacements?.length) return;
    this.config.textReplacements.forEach(rule => {
      const elements = this.findElementsWithText(rule.keyword);
      let replacementValue = rule.defaultValue;
      if (rule.utmRules?.length) {
        const matchedRule = rule.utmRules.find(utmRule => {
          return this.utmParams[utmRule.paramName] && 
                 (this.utmParams[utmRule.paramName] === utmRule.paramValue || utmRule.paramValue === '*');
        });
        if (matchedRule) {
          replacementValue = matchedRule.replacementValue;
        }
      }
      elements.forEach(element => {
        const original = element.innerHTML;
        element.innerHTML = original.replace(new RegExp(\`%%\${rule.keyword}%%\`, 'g'), replacementValue);
      });
    });
  }
  
  toggleBlocksVisibility() {
    if (!this.config.blockVisibility?.length) return;
    let matchedRule = null;
    for (const rule of this.config.blockVisibility) {
      if (this.utmParams[rule.paramName] && 
          (this.utmParams[rule.paramName] === rule.paramValue || rule.paramValue === '*')) {
        matchedRule = rule;
        break;
      }
    }
    if (matchedRule) {
      this.applyVisibilityRules(matchedRule.showBlocks, matchedRule.hideBlocks);
    } else if (this.config.defaultBlockVisibility) {
      this.applyVisibilityRules(this.config.defaultBlockVisibility.showBlocks, this.config.defaultBlockVisibility.hideBlocks);
    }
  }
  
  applyIPRules() {
    if (!this.ipInfo || !this.config.ipRules?.length) return;
    console.log('Применение IP-правил. Данные локации:', this.ipInfo);
    this.applyDefaultIPTextReplacements();
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
      const countryMatch = ruleCountry === '*' || ruleCountry === normalized.country || ruleCountry === normalized.country_code || ruleCountry === normalized.country_code3;
      const cityMatch = ruleCity === '*' || ruleCity === normalized.city;
      const regionMatch = ruleRegion === '*' || ruleRegion === normalized.region;
      if (countryMatch && cityMatch && regionMatch) {
        matchedRule = rule;
        break;
      }
    }
    if (matchedRule) {
      if (matchedRule.textReplacements?.length) {
        matchedRule.textReplacements.forEach(replacement => {
          const elements = this.findElementsWithText(replacement.keyword);
          elements.forEach(element => {
            const original = element.innerHTML;
            element.innerHTML = original.replace(new RegExp(\`%%\${replacement.keyword}%%\`, 'g'), replacement.replacementValue);
          });
        });
      }
      this.applyVisibilityRules(matchedRule.showBlocks, matchedRule.hideBlocks);
    } else {
      console.log('Не найдено подходящих правил IP');
    }
  }
  
  applyDefaultIPTextReplacements() {
    if (!this.config.ipRules?.length) return;
    const defaults = {};
    this.config.ipRules.forEach(rule => {
      rule.textReplacements?.forEach(replacement => {
        if (replacement.keyword && replacement.defaultValue) {
          defaults[replacement.keyword] = replacement.defaultValue;
        }
      });
    });
    for (const [keyword, defValue] of Object.entries(defaults)) {
      const elements = this.findElementsWithText(keyword);
      elements.forEach(element => {
        const original = element.innerHTML;
        element.innerHTML = original.replace(new RegExp(\`%%\${keyword}%%\`, 'g'), defValue);
      });
    }
  }
  
  applyVisibilityRules(showBlocks, hideBlocks) {
    if (hideBlocks?.length) {
      hideBlocks.forEach((id) => {
        const elements = Array.from(document.querySelectorAll(\`#\${id}, .\${id}, [data-block-id="\${id}"]\`));
        elements.forEach((el) => el.style.display = 'none');
      });
    }
    if (showBlocks?.length) {
      showBlocks.forEach((id) => {
        const elements = Array.from(document.querySelectorAll(\`#\${id}, .\${id}, [data-block-id="\${id}"]\`));
        elements.forEach((el) => el.style.display = '');
      });
    }
  }
  
  findElementsWithText(keyword) {
    const elements = [];
    const pattern = new RegExp(\`%%\${keyword}%%\`);
    function search(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (pattern.test(node.textContent)) {
          const parent = node.parentElement;
          if (parent && !elements.includes(parent)) elements.push(parent);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (pattern.test(node.innerHTML)) {
          if (!elements.includes(node)) elements.push(node);
        }
        node.childNodes.forEach(search);
      }
    }
    search(document.body);
    return elements;
  }
  
  init() {
    this.replaceText();
    this.toggleBlocksVisibility();
    console.log('DynamicContentManager инициализирован');
    console.log('UTM параметры:', this.utmParams);
    console.log('Настройки по умолчанию:', this.config.defaultBlockVisibility);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const contentChanger = new TaptopContentChanger(${configJson});
  contentChanger.init();
});
<\/script>`;

    // Копируем код в буфер обмена (без всплывающего prompt)
    Utils.copyToClipboard(code);

    // Отображаем модальное окно "Код успешно скопирован!"
    const successModal = document.getElementById("success-modal");
    if (successModal) {
      successModal.style.display = "flex";
      console.log("Модальное окно успешно открыто");
    } else {
      console.error("Модальное окно не найдено!");
      alert("Код успешно сгенерирован и скопирован в буфер обмена!");
    }
  }

  // Запускаем инициализацию UI
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      dynamicUI.init();
    }, 500);
  });

  // Интеграция с docsify (если нужно)
  if (typeof window !== "undefined" && window.$docsify) {
    window.$docsify.plugins = window.$docsify.plugins || [];
    window.$docsify.plugins.push((hook) => {
      hook.doneEach(() => {
        console.log(
          "Docsify перерисовал страницу, запускаем инициализацию DynamicContentManager..."
        );
        setTimeout(() => {
          dynamicUI.init();
        }, 500);
      });
    });
  }

  // Глобальный экземпляр UI-менеджера
  const dynamicUI = new DynamicContentManagerUI(defaultConfig);
})();