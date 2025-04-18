import { svg, css, LitElement, html } from 'https://unpkg.com/lit-element@3.3.3/lit-element.js?module';

// Hack from https://github.com/thomasloven/lovelace-card-tools/blob/master/src/yaml.js
// Partially allows for loading ha custom elements, such as checkbox
async function loadCustomElements$1() {
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
await loadCustomElements$1();

// Load language for localization of card
let translations$1 = { lang: "en", data: undefined };
async function loadTranslations$1(lang = "en") {
  const path = `/local/ems-program/translations/${lang}.json?v=9}`;
  let data = undefined;
  try {
    const response = await fetch(path);
    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    console.info(error);
  }
  translations$1.data = data;
}
await loadTranslations$1();

// Localizes an id to supported languages
function localize$1(label) {
  let value = undefined;
  try {
    value = label.split(".").reduce((obj, key) => obj[key], translations$1.data);
  } catch (error) {}
  if (value && typeof value === "string") {
    return value;
  } else {
    return label;
  }
}

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
let translations = { lang: "en", data: undefined };
async function loadTranslations(lang = "en") {
  const path = `/local/ems-program/translations/${lang}.json?v=9}`;
  let data = undefined;
  try {
    const response = await fetch(path);
    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    console.info(error);
  }
  translations.data = data;
}
await loadTranslations();

// Localizes an id to supported languages
function localize(label) {
  let value = undefined;
  try {
    value = label.split(".").reduce((obj, key) => obj[key], translations.data);
  } catch (error) {}
  if (value && typeof value === "string") {
    return value;
  } else {
    return label;
  }
}

// Access the EMS bus: writing bus input und collecting bus responses
async function accessEms(card, busInput, stopResponse = undefined) {
  // Set maximum seconds for bus response
  const maxMs = 20000;
  const globalStartTime = Date.now();
  card.statusMessage = "";
  card.requestUpdate();

  // Collect responses from bus
  const busResponses = [];
  let busResponse = "";
  for (const [idx, value] of Object.entries(busInput)) {
    // Set value of bus
    await card._hass.callService("text", "set_value", {
      entity_id: card.config.entity_id,
      value: value,
    });
    // If a value is set, then wait for 250ms and the query wether set
    // was successful
    if (value.length > 2) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      await card._hass.callService("text", "set_value", {
        entity_id: card.config.entity_id,
        value: value.substring(0, 2),
      });
    }

    // Wait for response (detected by change of value)
    const startTime = Date.now();
    let now = startTime;
    while (now - startTime <= maxMs && !busResponse.startsWith(value)) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      // Gets value from bus
      busResponse = card._hass.states[card.config.entity_id].state;
      now = Date.now();
    }
    if (busResponse.startsWith(value)) {
      if (stopResponse && busResponse.endsWith(stopResponse)) {
        break;
      } else {
        busResponses.push(busResponse);
        card.statusMessage = ` ${Math.round(
          ((Number(idx) + 1) / busInput.length) * 100
        )} %`;
        card.requestUpdate();
      }
    } else {
      return {
        message: "ui.card.ems_program_card.error.ems_no_response",
      };
    }
  }

  // Create output:
  return {
    status: "synchronized",
    id: card.config.entity_id,
    bus: busResponses,
    duration: Date.now() - globalStartTime,
    message: "ui.card.ems_program_card.ems_success",
  };
}

// Print EMS program to string array
function printEmsProgram(program, daysOfWeekIds) {
  let printedProgram = [];
  let idx = 0;
  if (!program) {
    return printedProgram;
  }
  for (const wd of daysOfWeekIds) {
    if (!program[wd]) {
      continue;
    }
    for (let st of program[wd]) {
      let timeStr = st.hour + ":" + st.minute;
      let stateStr = st.state ? "on" : "off";
      printedProgram.push(
        `${idx.toString().padStart(2, "0")} ${wd} ${timeStr} ${stateStr}`
      );
      idx++;
    }
  }
  return printedProgram;
}

// Parses an EMB bus program
function parseProgram(program, daysOfWeekIds) {
  if (!program) {
    return undefined;
  }

  const programParsed = {};
  for (const wd of daysOfWeekIds) {
    programParsed[wd] = [];
  }
  for (const entry of program) {
    const parts = entry.split(" ");
    if (parts.length !== 4) continue;
    const [_, weekday, timeStr, stateStr] = parts;
    const state = stateStr === "on" ? true : false;
    const [hour, minute] = timeStr.split(":").map((str) => parseInt(str));
    const secondsSinceMidnight = hour * 3600 + minute * 60;
    programParsed[weekday].push({
      hour: String(hour).padStart(2, "0"),
      minute: String(minute).padStart(2, "0"),
      secondsSinceMidnight: secondsSinceMidnight,
      state: state,
    });
  }
  return programParsed;
}

// Clones the orgininal program
function cloneProgram(daysOfWeekIds, program) {
  // Do a deep copy
  let programCloned = {};
  if (!program) {
    return programCloned;
  }
  for (const wd of daysOfWeekIds) {
    if (!program[wd]) {
      continue;
    }
    programCloned[wd] = [];
    for (const st of program[wd]) {
      programCloned[wd].push({ ...st });
    }
  }
  return programCloned;
}

// Sets an attribute called "program" at the entity (does not survive restart)
function setStateAttribute(card, data) {
  // Store program to entity as attributes
  const entityId = card.config.entity_id;
  const stateObj = card._hass.states[entityId];
  let attrObj = stateObj.attributes;
  if (!data && attrObj["program"]) {
    delete attrObj["program"];
  } else {
    attrObj["program"] = data;
  }
  card._hass
    .callApi("post", "states/" + entityId, {
      state: stateObj.state,
      attributes: attrObj,
    })
    .then((res) => {
      console.info(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Stores the program to the entity
function storeProgram(card) {
  const data = {
    old: printEmsProgram(card.program, card.dayIds),
    new: printEmsProgram(card.programNew, card.dayIds),
  };

  setStateAttribute(card, data);
}

// Loads the program from the entity if available
function loadProgram(card) {
  const entityId = card.config.entity_id;
  const stateObj = card._hass.states[entityId];
  if (!stateObj) {
    return;
  }
  const out = stateObj.attributes["program"];
  if (out) {
    console.log(out);
    card.program = parseProgram(out.old, card.dayIds);
    card.programNew = parseProgram(out.new, card.dayIds);
  }
}

// Undos program changes
function undoProgram(card) {
  if (!card.program) {
    return;
  }
  card.programNew = cloneProgram(card.dayIds, card.program);
  storeProgram(card);
}

// Resets stored program
function resetProgram(card) {
  card.program = undefined;
  card.programNew = undefined;
  card.statusMessage = "";
  card.isRunning = false;
  setStateAttribute(card, undefined);
}

// Reads the program from the EMS bus
function readFromEms(card) {
  // Store current program and make clear that we are accessing EMS bus
  card.isRunning = true;

  // Create sequence of inputs for querying bus
  const busInput = Array.from({ length: 42 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const stopResponse = "not_set";
  accessEms(card, busInput, stopResponse).then((out) => {
    card.statusMessage = localize(out.message);
    console.info(out);
    if (out.bus) {
      card.program = parseProgram(out.bus, card.dayIds);
      card.programNew = cloneProgram(card.dayIds, card.program);
      storeProgram(card);
    }
    card.isRunning = false;
  });
}

// Writes program to EMS bus
function writeToEms(card) {
  card.isRunning = true;

  // Convert programs (old and new) to EMS bus format
  const printedProgram = printEmsProgram(card.program, card.dayIds);
  const printedProgramNew = printEmsProgram(card.programNew, card.dayIds);
  console.info(printedProgram);
  console.info(printedProgramNew);

  // Calculate difference of programs
  let delta = printedProgramNew.filter((x) => !printedProgram.includes(x));

  // Add "not_set" to programs for resetting switchtimes if new program is
  // shorter than old one
  if (printedProgramNew.length < printedProgram.length) {
    delta = delta.concat(
      Array.from(
        { length: printedProgram.length - printedProgramNew.length },
        (_, i) =>
          `${(printedProgramNew.length + i)
            .toString()
            .padStart(2, "0")} not_set`
      )
    );
  }
  console.info(delta);

  // Write delta to EMS bus
  accessEms(card, delta).then((out) => {
    card.statusMessage = localize(out.message);
    console.info(out);
    if (out.bus) {
      card.program = cloneProgram(card.dayIds, card.programNew);
      storeProgram(card);
    }
    card.isRunning = false;
  });
}

// Add a switch time to program via service call
function addSwitchtime(program, switchtime) {
  if (!program) {
    return;
  }

  const secondsSinceMidnight =
    parseInt(switchtime.hour) * 3600 + parseInt(switchtime.minute) * 60;
  const stNew = {
    hour: switchtime.hour,
    minute: switchtime.minute,
    secondsSinceMidnight: secondsSinceMidnight,
    state: switchtime.state,
  };

  // Entry is replaced with new one, if it has the same time
  // Function assumes that list is sorted
  let stList = program[switchtime.day];
  if (stList.length > 0) {
    let stLast = stList[stList.length - 1];
    if (stLast.secondsSinceMidnight < secondsSinceMidnight) {
      // Add to end of list if latest element
      stList.push(stNew);
    } else {
      for (const [idx, st] of Object.entries(stList)) {
        if (st.secondsSinceMidnight == secondsSinceMidnight) {
          // Replace entry with same time
          stList[idx] = stNew;
          break;
        } else if (st.secondsSinceMidnight > secondsSinceMidnight) {
          // Insert new entry before as soon as one entry is later
          stList.splice(idx, 0, stNew);
          break;
        }
      }
    }
  }

  console.info(program);
}

// Removes an entry from the list of entries for a certain day
function removeSwitchtime(program, switchtime) {
  if (!program) {
    return;
  }

  let stList = program[switchtime.day];
  stList.splice(switchtime.idx, 1);

  console.info(program);
}

// Constants for SVG
const offY = 30;
const onY = 0;
const secondsToPx = 240 / 86400;

// Returns whether the last state value of a programm is low or high
function getLastState(dayIds, program) {
  const lastState = dayIds.reverse().some((wdId) => {
    const stList = program[wdId];
    return stList.length > 0 ? stList[stList.length - 1].state : false;
  });
  return lastState ? onY : offY;
}

// Renders the SVG contents
function renderSvg(card, dotClickHandler) {
  // Calculate last program point for old and new
  let lastState = { value: getLastState(card.dayIds, card.program) };
  let lastStateNew = { value: getLastState(card.dayIds, card.programNew) };

  return svg`
  <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
    width="100%" height="100%" version="1.1"
    viewBox="0 0 260 360">
    <defs>
        <g id="weekday_grid">
            <pattern id="grid" patternUnits="userSpaceOnUse"
                width="20" height="30" >
                <rect x="10" y="0" width="10" height="100%"
                    stroke="none" fill="gray" opacity="0.2" />
            </pattern>
            <rect width="240" height="30" fill="url(#grid)" />
            <rect width="240" height="30" fill="none"
                stroke="gray" opacity="0.2" />
            <g transform="translate(2, 15) rotate(-90)"
                font-size="7px" font-family="sans-serif" fill="grey"
                dominant-baseline="start" text-anchor="middle">
                ${Array.from({ length: 12 }, (_, i) =>
                  renderSvgTimes(i, card._hass.locale.language)
                )}
            </g>
        </g>
    </defs>

    <g transform="translate(130, 13)"
        font-size="10px" font-family="sans-serif" fill="gray"
        dominant-baseline="start" text-anchor="middle">
        ${Object.entries(card.dayNames).map(
          ([idx, wdName]) => svg`
          <text y="${idx * 50}">${wdName}</text>
        `
        )}
    </g>

    <g transform="translate(10, 20)">
      ${Object.entries(card.dayIds).map(
        ([idx, wdId]) => svg`
        <use xlink:href="#weekday_grid" y="${idx * 50}" />
      `
      )}
    </g>

    ${Object.entries(card.dayIds).map(([idx, wdId]) =>
      renderSvgLines(card.program, idx, wdId, "rgb(71,108,149)", lastState)
    )}
    ${Object.entries(card.dayIds).map(([idx, wdId]) =>
      renderSvgLines(
        card.programNew,
        idx,
        wdId,
        "rgb(149,108,71)",
        lastStateNew
      )
    )}
    ${Object.entries(card.dayIds).map(
      ([idx, wdId]) => svg`
      <g transform="translate(10, ${20 + idx * 50})" fill="red">
        ${Object.entries(card.programNew[wdId]).map(([idxDot, st]) =>
          renderSvgDots(wdId, idxDot, st, dotClickHandler)
        )}
      </g>
    `
    )}
  </svg>`;
}

// Renders the SVG times
function renderSvgTimes(i, locale) {
  const timeObj = new Date(0, 0, 0, 1 + i * 2, 0);
  const formattedTime = timeObj.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return svg`<text y="${10 + i * 20}">${formattedTime}</text>`;
}

// Creates an SVG line drawing switchtimes for a weekday
function renderSvgLines(program, idx, wdId, color, lastState) {
  let lastY = lastState.value;
  let points = `0,${lastY}`;
  for (const st of program[wdId]) {
    const stX = Math.floor(st.secondsSinceMidnight * secondsToPx);
    let stY = offY;
    if (st.state) {
      stY = onY;
    }
    if (lastY !== stY) {
      points += ` ${stX},${lastY}`;
    }
    points += ` ${stX},${stY}`;
    lastY = stY;
  }
  points += ` 240,${lastY}`;
  lastState.value = lastY;
  return svg`
    <g transform="translate(10, ${20 + idx * 50})">
      <polyline points="${points}"
          fill="none" stroke="${color}" stroke-width="3"
          stroke-opacity="0.6" />
    </g>`;
}

// Renders clickable dot for new program
function renderSvgDots(wdId, idxDot, st, dotClickHandler) {
  const stX = Math.floor(st.secondsSinceMidnight * secondsToPx);
  let stY = offY;
  if (st.state) {
    stY = onY;
  }
  return svg`
      <circle id="${wdId}-${idxDot}" cx="${stX}" cy="${stY}" r="5"
        @click="${dotClickHandler}" />
    `;
}

const cssStyles = css`
  .row {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .in-container {
    margin: 2px;
  }
  .message {
    font-style: italic;
  }
`;
function renderButton(text, clickHandler, disabled = false) {
  return html`
    <mwc-button
      class="in-container"
      outlined
      @click="${clickHandler}"
      ?disabled=${disabled}
    >
      ${text}
    </mwc-button>
  `;
}
class EmsProgramCard extends LitElement {
  // Return CSS styles for card
  static get styles() {
    return cssStyles;
  }
  // Return class properties
  static get properties() {
    return {
      _hass: {},
      config: {},
      program: { type: Object },
      programNew: { type: Object },
      switchtime: { type: Object },
      isRunning: { type: Boolean },
      isSelected: { type: Boolean },
      statusMessage: { type: String },
      dayIds: { type: Array },
      dayNames: { type: Array }
    };
  }
  // Create card
  constructor() {
    super();
    this.program = void 0;
    this.programNew = void 0;
    this.statusMessage = "";
    this.isRunning = false;
    this.isSelected = false;
    this.switchtime = {
      day: "mo",
      hour: "07",
      minute: "00",
      state: true,
      idx: -1
    };
  }
  // Handle all config parameters
  setConfig(config) {
    this.config = { ...config };
    this.config.title ??= "EMS";
  }
  // Hass method which is regularly called by HA
  set hass(hass) {
    this._hass = hass;
    if (!this.program) {
      const daysOfWeekFormatter = new Intl.DateTimeFormat(
        this._hass.locale.language,
        {
          weekday: "long"
        }
      );
      this.dayIds = ["mo", "tu", "we", "th", "fr", "sa", "su"];
      this.dayNames = Array.from(
        { length: 7 },
        (_, index) => daysOfWeekFormatter.format(new Date(Date.UTC(2021, 5, index)))
      );
      loadProgram(this);
    }
    const lang = this._hass.locale.language;
    if (lang !== translations$1.lang) {
      loadTranslations$1(lang).then(() => {
        this.requestUpdate();
      });
    }
  }
  // Returns the height of the card
  getCardSize() {
    return 5;
  }
  // Main render method
  render() {
    if (!this.config.entity_id) {
      return html`<ha-card header="${this.config.title}">
        <div class="card-content">
          ${localize$1("ui.card.ems_program_card.editor.help_text")}
          <pre><code>
            type: custom:ems-program-card
            title: Program Buderus
            entity_id: text.thermostat_hc1_switchtime1
          </code></pre>
        </div>
      </ha-card> `;
    }
    const timeStr = this.switchtime.hour + ":" + this.switchtime.minute;
    return html`<ha-card header="${this.config.title}">
      <div class="card-content">
        <div class="row">
          <ha-select
            naturalmenuwidth
            @change="${(e) => {
      this.switchtime.day = e.target.value;
    }}"
            class="in-container"
          >
            ${Object.entries(this.dayIds).map(
      ([idx, id]) => html`<ha-list-item
                value="${String(id)}"
                role="option"
                ?selected="${this.switchtime.day == id}"
              >
                ${this.dayNames[idx]}
              </ha-list-item>`
    )}
          </ha-select>
          <ha-time-input
            .locale=${this._hass.locale}
            .value=${timeStr}
            @change="${(e) => {
      const [hour, minute] = e.target.value.split(":");
      let hourNum = Number(hour);
      if (!(hourNum >= 0 && hourNum <= 23)) {
        hourNum = 0;
      }
      let minuteNum = Number(minute);
      if (!(minuteNum >= 0 && minuteNum <= 59)) {
        minuteNum = 0;
      }
      minuteNum = Math.floor(minuteNum / 10) * 10;
      this.switchtime.hour = String(hourNum).padStart(2, "0");
      this.switchtime.minute = String(minuteNum).padStart(2, "0");
      this.requestUpdate();
    }}"
            class="in-container"
          ></ha-time-input>
          <ha-checkbox
            .checked=${this.switchtime.state}
            @change="${(e) => {
      this.switchtime.state = !this.switchtime.state;
    }}"
            class="in-container"
          ></ha-checkbox>
        </div>
        <div class="row">
          ${renderButton(
      localize$1("ui.card.ems_program_card.new"),
      () => {
        addSwitchtime(this.programNew, this.switchtime);
        storeProgram(this);
        this.requestUpdate();
      },
      this.isRunning || !this.programNew
    )}
          ${renderButton(
      localize$1("ui.card.ems_program_card.delete"),
      () => {
        this.isSelected = false;
        removeSwitchtime(this.programNew, this.switchtime);
        storeProgram(this);
        this.requestUpdate();
      },
      !this.isSelected
    )}
          ${renderButton(
      localize$1("ui.card.ems_program_card.change"),
      () => {
        this.isSelected = false;
        removeSwitchtime(this.programNew, this.switchtime);
        addSwitchtime(this.programNew, this.switchtime);
        storeProgram(this);
        this.requestUpdate();
      },
      !this.isSelected
    )}
        </div>

        ${!this.program || !this.programNew ? html`<div class="row message">
              ${localize$1("ui.card.ems_program_card.error.no_program")}
            </div>` : html`<div class="row">
                ${localize$1("ui.card.ems_program_card.advice")}
              </div>
              ${renderSvg(this, (e) => {
      const [wdId, idx] = e.target.id.split("-");
      const selectedSt = this.programNew[wdId][idx];
      this.isSelected = true;
      this.switchtime = {
        day: wdId,
        hour: selectedSt.hour,
        minute: selectedSt.minute,
        state: selectedSt.state,
        idx
      };
    })}`}

        <div class="row">
          ${renderButton(
      localize$1("ui.card.ems_program_card.ems_read"),
      () => {
        this.isSelected = false;
        readFromEms(this);
        this.requestUpdate();
      },
      this.isRunning
    )}
          ${renderButton(
      localize$1("ui.card.ems_program_card.ems_write"),
      () => {
        this.isSelected = false;
        writeToEms(this);
        this.requestUpdate();
      },
      this.isRunning
    )}
        </div>
        <div class="row">
          ${renderButton(
      localize$1("ui.card.ems_program_card.undo"),
      () => {
        this.isSelected = false;
        undoProgram(this);
        this.requestUpdate();
      },
      this.isRunning
    )}
          ${renderButton(
      localize$1("ui.card.ems_program_card.reset"),
      () => {
        this.isSelected = false;
        resetProgram(this);
        this.requestUpdate();
      },
      this.isRunning
    )}
        </div>

        <div class="row message">
          ${this.isRunning ? html`<ha-circular-progress indeterminate></ha-circular-progress>` : html``}
          ${this.statusMessage}
        </div>
      </div>
    </ha-card>`;
  }
  // Set config editor card
  static getConfigElement() {
    return document.createElement("ems-program-card-editor");
  }
}
customElements.define("ems-program-card", EmsProgramCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "ems-program-card",
  name: "EMS Program Card"
});
class EmsProgramCardEditor extends LitElement {
  // Return CSS styles for card
  static get styles() {
    return cssStyles;
  }
  // Return class properties
  static get properties() {
    return {
      _hass: {},
      config: {}
    };
  }
  // Sets the configuration
  setConfig(config) {
    this._config = config;
  }
  // Hass method which is regularly called by HA
  set hass(hass) {
    this._hass = hass;
    if (!this.entityIdList) {
      this.entityIdList = Object.keys(hass.states).filter(
        (key) => key.startsWith("text.")
      );
      console.info(this.entityIdList);
    }
  }
  // Deal with config changes
  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }
  // Render config card
  render() {
    return html`
      <div class="row">
        ${localize$1("ui.card.ems_program_card.editor.help_text")}
      </div>
      <div class="row">
        <ha-textfield
          label="${localize$1("ui.card.ems_program_card.editor.title")}"
          .value=${this._config.title}
          class="in-container"
          @click="${(e) => {
      const newConfig = Object.assign({}, this._config);
      newConfig.title = e.target.value;
      this.configChanged(newConfig);
    }}"
        ></ha-textfield>
        <ha-entity-picker
          .hass=${this._hass}
          .value=${this._config.entity_id}
          .includeEntities=${Object.keys(this._hass.states).filter(
      (key) => key.startsWith("text.")
    )}
          .label="${localize$1("ui.card.ems_program_card.editor.entity")}"
          class="in-container"
          @change="${(e) => {
      const newConfig = Object.assign({}, this._config);
      newConfig.entity_id = e.target.value;
      this.configChanged(newConfig);
    }}"
          allow-custom-entity
        ></ha-entity-picker>
      </div>
    `;
  }
}
customElements.define("ems-program-card-editor", EmsProgramCardEditor);
