import en from './translations/en.json';
import de from './translations/de.json';
import { CustomWindow } from "./home-assistant";

const haWindow: CustomWindow = window as unknown as CustomWindow;

// Hack from https://github.com/thomasloven/lovelace-card-tools/blob/master/src/yaml.js
// Partially allows for loading ha custom elements, such as checkbox
export async function loadCustomElements(): Promise<void> {
  // Includes ha-checkbox and ha-progress-spinner
  if (!customElements.get("ha-panel-config")) {
    await customElements.whenDefined("partial-panel-resolver");
    const ppr = document.createElement("partial-panel-resolver") as any;
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
    const dtr = document.createElement("ha-panel-config") as any;
    await dtr.routerOptions.routes.automation.load();
  }
  if (!haWindow.cardHelpers) {
    haWindow.cardHelpers = await haWindow.loadCardHelpers();
  }
  // Includes ha-time-input
  if (!customElements.get("ha-time-input") && haWindow.cardHelpers) {
    haWindow.cardHelpers.createRowElement({ type: "time-entity" });
  }
}
await loadCustomElements();


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
