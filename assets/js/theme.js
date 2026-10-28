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
      if (icon) {
        icon.innerHTML = theme === "dark"
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
          : '☾';
      }
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
