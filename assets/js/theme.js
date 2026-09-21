(function () {
  "use strict";

  const storageKey = "color-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    document.querySelectorAll(".theme-toggle").forEach((button) => {
      const nextTheme = theme === "dark" ? "light" : "dark";
      button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
      button.setAttribute("title", `Switch to ${nextTheme} mode`);
      button.setAttribute("aria-pressed", String(theme === "dark"));

      const icon = button.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = theme === "dark" ? "☀" : "☾";
    });
  }

  setTheme(savedTheme() || (systemTheme.matches ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", () => {
    setTheme(document.documentElement.dataset.theme);

    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        try {
          window.localStorage.setItem(storageKey, nextTheme);
        } catch (error) {
          // The current page can still change theme when storage is unavailable.
        }
        setTheme(nextTheme);
      });
    });
  });

  const handleSystemThemeChange = (event) => {
    if (!savedTheme()) setTheme(event.matches ? "dark" : "light");
  };

  if (systemTheme.addEventListener) {
    systemTheme.addEventListener("change", handleSystemThemeChange);
  } else {
    systemTheme.addListener(handleSystemThemeChange);
  }

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) {
      setTheme(savedTheme() || (systemTheme.matches ? "dark" : "light"));
    }
  });
})();
