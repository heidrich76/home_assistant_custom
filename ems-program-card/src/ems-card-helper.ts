import en from './translations/en.json';
import de from './translations/de.json';
import { CustomWindow } from "./home-assistant";

// Define custom window including interface to HA-specific functions
const haWindow: CustomWindow = window as unknown as CustomWindow;

// Hack from https://github.com/thomasloven/lovelace-card-tools/blob/master/src/yaml.js
// Partially allows for loading ha custom elements
export async function loadCustomElements(): Promise<void> {
  if (!haWindow.cardHelpers) {
    haWindow.cardHelpers = await haWindow.loadCardHelpers();
  }
  if (haWindow.cardHelpers) {
    if (!customElements.get("ha-time-input")) {
      haWindow.cardHelpers.createRowElement({ type: "time-entity" });
    }
    if (!customElements.get("ha-select")) {
      haWindow.cardHelpers.createRowElement({ type: "select-entity" });
    }
  }
}
loadCustomElements().then(() => {
  console.log("Custom elements loaded");
});


// Load language for localization of card
const translations: Record<string, any> = { en, de };
let langDict: any = en;
export function loadTranslations(lang: string = "en"): void {
  langDict = translations[lang] || translations["en"];
}

// Localizes an id to supported languages
export function localize(label: string): string {
  let value = undefined;
  try {
    value = label.split(".").reduce((obj, key) => obj[key], langDict);
  } catch (error) { }
  if (value && typeof value === "string") {
    return value;
  } else {
    return label;
  }
}
