// Import language files to JS
import en from './translations/en.json';
import de from './translations/de.json';

// Hack from https://github.com/thomasloven/lovelace-card-tools/blob/master/src/yaml.js
// Partially allows for loading ha custom elements, such as checkbox
async function loadCustomElements() {
  // Includes ha-checkbox and ha-progress-spinner
  if (!customElements.get("ha-panel-config")) {
    await customElements.whenDefined("partial-panel-resolver");
    const ppr = document.createElement("partial-panel-resolver");
    ppr.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config",
        },
      ],
    };
    ppr._updateRoutes();
    await ppr.routerOptions.routes.tmp.load();
    await customElements.whenDefined("ha-panel-config");
    const dtr = document.createElement("ha-panel-config");
    await dtr.routerOptions.routes.automation.load();
  }
  if (!window.cardHelpers) {
    window.cardHelpers = await window.loadCardHelpers();
  }
  // Includes ha-time-input
  if (!customElements.get("ha-time-input")) {
    window.cardHelpers.createRowElement({ type: "time-entity" });
  }
}
await loadCustomElements();

// Load language for localization of card
export let translations = { lang: "en", data: en };
export async function loadTranslations(lang = "en") {
  const availableTranslations = { en, de };
  translations.data = availableTranslations[lang] || availableTranslations["en"];
}
await loadTranslations();

// Localizes an id to supported languages
export function localize(label) {
  let value = undefined;
  try {
    value = label.split(".").reduce((obj, key) => obj[key], translations.data);
  } catch (error) { }
  if (value && typeof value === "string") {
    return value;
  } else {
    return label;
  }
}
