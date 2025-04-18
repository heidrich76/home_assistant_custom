import en from './translations/en.json';
import de from './translations/de.json';


// Load language for localization of card
const translations = { en, de };
let langDict = en;
export function loadTranslations(lang = "en") {
  langDict = translations[lang] || translations["en"];
}

// Localizes an id to supported languages
export function localize(label) {
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
