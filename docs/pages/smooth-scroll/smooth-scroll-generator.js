(function () {
  class SmoothScrollGenerator {
    constructor() {
      this.elements = {
        basicTabBtn: document.getElementById("basic-tab-btn"),
        advancedTabBtn: document.getElementById("advanced-tab-btn"),
        basicTab: document.getElementById("basic-tab"),
        advancedTab: document.getElementById("advanced-tab"),
        presetSelect: document.getElementById("preset-select"),
        presetDescription: document.getElementById("preset-description"),
        speedSelect: document.getElementById("speed-select"),
        speedValueDisplay: document.getElementById("speed-value-display"),
        speedTimeDisplay: document.getElementById("speed-time-display"),
        smoothnessSelect: document.getElementById("smoothness-select"),
        smoothnessValueDisplay: document.getElementById(
          "smoothness-value-display"
        ),
        easingTypeDisplay: document.getElementById("easing-type-display"),
        keyboardSupport: document.getElementById("keyboard-support"),
        mobileSupport: document.getElementById("mobile-support"),
        durationInput: document.getElementById("duration-input"),
        stepInput: document.getElementById("step-input"),
        easingSelect: document.getElementById("easing-select"),
        keyboardStep: document.getElementById("keyboard-step"),
        excludeSelectors: document.getElementById("exclude-selectors"),
        generateButton: document.getElementById("generate-button"),
        modal: document.getElementById("success-modal"),
        closeModalBtn: document.querySelector(".close-modal"),
        closeBtn: document.querySelector(".close-button"),
      };

      this.presets = {
        universal: {
          description: "Универсальный — средний баланс скорости и плавности",
          speedLevel: 60,
          smoothnessLevel: 70,
          step: 120,
          keyboard: true,
          keyboardStep: 200,
          mobile: true,
          excludeSelectors: "",
          easingType: "standard",
        },
        premium: {
          description: "Премиальный — медленный с эффектом инерции",
          speedLevel: 40,
          smoothnessLevel: 85,
          step: 80,
          keyboard: true,
          keyboardStep: 180,
          mobile: true,
          excludeSelectors: "",
          easingType: "precise",
        },
        fast: {
          description: "Быстрый — мгновенная реакция, минимум инерции",
          speedLevel: 80,
          smoothnessLevel: 55,
          step: 150,
          keyboard: true,
          keyboardStep: 250,
          mobile: true,
          excludeSelectors: "",
          easingType: "minimal",
        },
        slow: {
          description: "Медленный — кинематографичный с долгим движением",
          speedLevel: 30,
          smoothnessLevel: 90,
          step: 100,
          keyboard: true,
          keyboardStep: 150,
          mobile: true,
          excludeSelectors: "",
          easingType: "precise",
        },
        reading: {
          description: "Для чтения — быстрый, с мягким торможением",
          speedLevel: 70,
          smoothnessLevel: 60,
          step: 180,
          keyboard: true,
          keyboardStep: 300,
          mobile: true,
          excludeSelectors: "",
          easingType: "standard",
        },
      };
    }

    init() {
      // Если основной контейнер не найден – выходим
      if (!this.elements.presetSelect) return;
      this.bindEvents();
      this.updateSpeedUI();
      this.updateSmoothnessUI();
      this.updateKeyboardOptionsVisibility();
      this.applyPreset(this.elements.presetSelect.value);
    }

    bindEvents() {
      // Переключение вкладок
      this.elements.basicTabBtn.addEventListener("click", () =>
        this.switchTab("basic")
      );
      this.elements.advancedTabBtn.addEventListener("click", () =>
        this.switchTab("advanced")
      );

      // Изменение пресета
      this.elements.presetSelect.addEventListener("change", (e) =>
        this.applyPreset(e.target.value)
      );

      // Обновление слайдеров
      this.elements.speedSelect.addEventListener("input", () =>
        this.updateSpeedUI()
      );
      this.elements.smoothnessSelect.addEventListener("input", () =>
        this.updateSmoothnessUI()
      );

      // Отображение опций клавиатуры
      this.elements.keyboardSupport.addEventListener("change", () =>
        this.updateKeyboardOptionsVisibility()
      );

      // Генерация кода
      this.elements.generateButton.addEventListener("click", () =>
        this.generateCode()
      );

      // Обработка модального окна
      this.elements.closeModalBtn.addEventListener("click", () =>
        this.closeModal()
      );
      this.elements.closeBtn.addEventListener("click", () => this.closeModal());
      this.elements.modal.addEventListener("click", (e) => {
        if (e.target === this.elements.modal) this.closeModal();
      });
    }

    switchTab(tab) {
      if (tab === "basic") {
        this.elements.basicTab.classList.add("active");
        this.elements.advancedTab.classList.remove("active");
        this.elements.basicTabBtn.classList.add("active");
        this.elements.advancedTabBtn.classList.remove("active");
      } else {
        this.elements.basicTab.classList.remove("active");
        this.elements.advancedTab.classList.add("active");
        this.elements.basicTabBtn.classList.remove("active");
        this.elements.advancedTabBtn.classList.add("active");
      }
    }

    updateSpeedUI() {
      let val = parseInt(this.elements.speedSelect.value, 10);
      val = val < 1 ? 1 : val;
      this.elements.speedValueDisplay.textContent = `${val}%`;
      const approxMs =
        val <= 1 ? 1000 : val >= 100 ? 300 : 1000 - (val / 100) * 700;
      this.elements.speedTimeDisplay.textContent = `~${Math.round(approxMs)}мс`;
    }

    updateSmoothnessUI() {
      let val = parseInt(this.elements.smoothnessSelect.value, 10);
      val = val < 1 ? 1 : val;
      this.elements.smoothnessValueDisplay.textContent = `${val}%`;
      const easingType =
        val <= 1
          ? "Резкая"
          : val < 25
          ? "Слабая"
          : val < 50
          ? "Средняя"
          : val < 75
          ? "Плавная"
          : val < 90
          ? "Очень плавная"
          : "Максимальная";
      this.elements.easingTypeDisplay.textContent = easingType;
    }

    updateKeyboardOptionsVisibility() {
      const keyboardOption = document.querySelector(".keyboard-option");
      if (keyboardOption) {
        keyboardOption.style.display = this.elements.keyboardSupport.checked
          ? "block"
          : "none";
      }
    }

    applyPreset(presetName) {
      const preset = this.presets[presetName];
      if (!preset) return;
      this.elements.presetDescription.textContent = preset.description;
      this.elements.speedSelect.value = preset.speedLevel;
      this.elements.smoothnessSelect.value = preset.smoothnessLevel;
      this.elements.keyboardSupport.checked = preset.keyboard;
      this.elements.mobileSupport.checked = preset.mobile;
      this.elements.stepInput.value = preset.step;
      this.elements.easingSelect.value = preset.easingType;
      this.elements.keyboardStep.value = preset.keyboardStep;
      this.elements.excludeSelectors.value = preset.excludeSelectors;
      this.updateSpeedUI();
      this.updateSmoothnessUI();
      this.updateKeyboardOptionsVisibility();
    }

    generateCode() {
      const settings = {
        speedLevel: parseInt(this.elements.speedSelect.value, 10) || 60,
        smoothnessLevel:
          parseInt(this.elements.smoothnessSelect.value, 10) || 70,
        step: parseInt(this.elements.stepInput.value, 10) || 120,
        keyboard: this.elements.keyboardSupport.checked,
        keyboardStep: parseInt(this.elements.keyboardStep.value, 10) || 200,
        mobile: this.elements.mobileSupport.checked,
        excludeSelectors: (this.elements.excludeSelectors.value || "").trim(),
        easingType: this.elements.easingSelect.value || "standard",
      };

      let easeFactorBase = 0.14 - (settings.smoothnessLevel / 100) * 0.1;
      let easeFactor = easeFactorBase;
      let dampingCode = "",
        extendedGlideCode = "";

      if (settings.easingType === "minimal") {
        easeFactor = Math.min(0.4, easeFactorBase * 2.5);
      } else if (settings.easingType === "precise") {
        dampingCode = `
    let lastDiff = 0, dampingFactor = 0.9;`;
        extendedGlideCode = `
    function updateWithExtendedGlide() {
      let diff = smoothScroll.targetScroll - smoothScroll.currentScroll;
      if (Math.sign(diff) !== Math.sign(lastDiff) && lastDiff !== 0) {
        diff *= 0.3;
      }
      let adjustedFactor = smoothScroll.easeFactor;
      if (Math.abs(diff) < 100) {
        adjustedFactor *= 0.4;
      }
      let step = diff * adjustedFactor;
      smoothScroll.currentScroll += step;
      lastDiff = diff;
      if (Math.abs(diff) < 0.2) {
        smoothScroll.currentScroll = smoothScroll.targetScroll;
        smoothScroll.running = false;
        cancelAnimationFrame(smoothScroll.rAF);
      } else {
        window.scrollTo(0, Math.round(smoothScroll.currentScroll));
        smoothScroll.rAF = requestAnimationFrame(updateWithExtendedGlide);
      }
    }
    updateSmoothScroll = updateWithExtendedGlide;`;
      }

      let excludeSelectorsCode = "";
      if (settings.excludeSelectors) {
        const selectors = settings.excludeSelectors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `".${s}"`)
          .join(", ");
        if (selectors) {
          excludeSelectorsCode = `
  let excludeSelectors = [${selectors}];
  function shouldExclude(element) {
    while (element && element !== document.body) {
      if (excludeSelectors.some(selector => element.matches(selector))) return true;
      element = element.parentElement;
    }
    return false;
  }`;
        }
      }

      const keyboardCode = settings.keyboard
        ? `
  document.addEventListener('keydown', function(e) {
    if (e.target && shouldExclude(e.target)) return;
    switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        smoothScroll.targetScroll += ${settings.keyboardStep};
        startSmooth();
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        smoothScroll.targetScroll -= ${settings.keyboardStep};
        startSmooth();
        break;
      case 'Home':
        e.preventDefault();
        smoothScroll.targetScroll = 0;
        startSmooth();
        break;
      case 'End':
        e.preventDefault();
        smoothScroll.targetScroll = document.documentElement.scrollHeight - window.innerHeight;
        startSmooth();
        break;
    }
  });`
        : "";

      const mobileCode = settings.mobile
        ? `
  (function() {
    let startY = 0, isTouching = false;
    document.addEventListener('touchstart', function(e) {
      if (shouldExclude(e.target)) return;
      startY = e.touches[0].clientY;
      isTouching = true;
    }, { passive: true });
    document.addEventListener('touchmove', function(e) {
      if (!isTouching || shouldExclude(e.target)) return;
      let currentY = e.touches[0].clientY;
      let delta = startY - currentY;
      if (Math.abs(delta) > 5) {
        e.preventDefault();
        smoothScroll.targetScroll += delta * 0.5;
        startSmooth();
        startY = currentY;
      }
    }, { passive: false });
    document.addEventListener('touchend', () => isTouching = false, { passive: true });
  })();`
        : "";

      const finalCode = `<script>
/**
 * SuperSmoothScroll v1.2
 * Настройки: шаг ${settings.step}px, плавность ${Math.round(
        settings.smoothnessLevel
      )}%, эффект ${settings.easingType}
 */
(function() {
  if (window.superSmoothScrollInitialized) return;
  window.superSmoothScrollInitialized = true;
  const smoothScroll = {
    currentScroll: window.pageYOffset,
    targetScroll: window.pageYOffset,
    easeFactor: ${easeFactor.toFixed(3)},
    running: false,
    rAF: null
  };${dampingCode}
  ${excludeSelectorsCode}
  function startSmooth() {
    if (!smoothScroll.running) {
      smoothScroll.running = true;
      smoothScroll.rAF = requestAnimationFrame(updateSmoothScroll);
    }
  }
  function updateSmoothScroll() {
    let diff = smoothScroll.targetScroll - smoothScroll.currentScroll;
    let step = diff * smoothScroll.easeFactor;
    smoothScroll.currentScroll += step;
    if (Math.abs(diff) < 0.5) {
      smoothScroll.currentScroll = smoothScroll.targetScroll;
      smoothScroll.running = false;
      cancelAnimationFrame(smoothScroll.rAF);
    } else {
      window.scrollTo(0, Math.round(smoothScroll.currentScroll));
      smoothScroll.rAF = requestAnimationFrame(updateSmoothScroll);
    }
  }
  ${extendedGlideCode}
  function onWheel(e) {
    ${excludeSelectorsCode ? `if (shouldExclude(e.target)) return;` : ""}
    e.preventDefault();
    let delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    let direction = delta > 0 ? 1 : -1;
    smoothScroll.targetScroll += direction * ${settings.step};
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    smoothScroll.targetScroll = Math.max(0, Math.min(smoothScroll.targetScroll, maxScroll));
    startSmooth();
  }
  const wheelEvent = 'onwheel' in document ? 'wheel' :
                     'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  document.addEventListener(wheelEvent, onWheel, { passive: false });
  ${keyboardCode}
  ${mobileCode}
})();
<\/script>`;

      const minifiedCode = minifyCode(finalCode);
      this.copyToClipboard(minifiedCode);
      this.elements.modal.style.display = "flex";
    }

    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .catch(() => this.fallbackCopy(text));
      } else {
        this.fallbackCopy(text);
      }
    }

    fallbackCopy(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Ошибка копирования", err);
      }
      document.body.removeChild(textarea);
    }

    closeModal() {
      this.elements.modal.style.display = "none";
    }
  }

  function initSmoothScrollGenerator() {
    new SmoothScrollGenerator().init();
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(initSmoothScrollGenerator, 100);
  } else {
    document.addEventListener("DOMContentLoaded", () =>
      setTimeout(initSmoothScrollGenerator, 100)
    );
  }

  window.initSmoothScrollGenerator = initSmoothScrollGenerator;

  if (window.$docsify) {
    window.$docsify.plugins = window.$docsify.plugins || [];
    window.$docsify.plugins.push((hook) => {
      hook.doneEach(() => setTimeout(initSmoothScrollGenerator, 300));
    });
  }
})();
