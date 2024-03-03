import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
import {
  translations,
  loadTranslations,
  localize,
} from "./ems-card-helper.js?v=4";
import {
  storeProgram,
  loadProgram,
  undoProgram,
  resetProgram,
  writeToEms,
  readFromEms,
  addSwitchtime,
  removeSwitchtime,
} from "./ems-service-helper.js?v=139";
import { renderSvg } from "./ems-svg-helper.js?v=38";

// All CSS styles
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

// Renders a Home Assistant button with text (used multiple times)
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

// Define main class for card
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
      dayNames: { type: Array },
    };
  }

  // Create card
  constructor() {
    super();
    this.program = undefined;
    this.programNew = undefined;
    this.statusMessage = "";
    this.isRunning = false;

    // Data for selecting or adding switch time
    this.isSelected = false;
    this.switchtime = {
      day: "mo",
      hour: "07",
      minute: "00",
      state: true,
      idx: -1,
    };
  }

  // Handle all config parameters
  setConfig(config) {
    // Clone config for adding some values if not present
    this.config = { ...config };
    this.config.title ??= "EMS";
  }

  // Hass method which is regularly called by HA
  set hass(hass) {
    this._hass = hass;

    // Load program if was not loaded before
    if (!this.program) {
      // Set selection fields
      const daysOfWeekFormatter = new Intl.DateTimeFormat(
        this._hass.locale.language,
        {
          weekday: "long",
        }
      );
      this.dayIds = ["mo", "tu", "we", "th", "fr", "sa", "su"];
      this.dayNames = Array.from({ length: 7 }, (_, index) =>
        daysOfWeekFormatter.format(new Date(Date.UTC(2021, 5, index)))
      );

      // Load program
      loadProgram(this);
    }

    // Load translation for selected language
    const lang = this._hass.locale.language;
    if (lang !== translations.lang) {
      loadTranslations(lang).then(() => {
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
          ${localize("ui.card.ems_program_card.editor.help_text")}
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
            localize("ui.card.ems_program_card.new"),
            () => {
              addSwitchtime(this.programNew, this.switchtime);
              storeProgram(this);
              this.requestUpdate();
            },
            this.isRunning || !this.programNew
          )}
          ${renderButton(
            localize("ui.card.ems_program_card.delete"),
            () => {
              this.isSelected = false;
              removeSwitchtime(this.programNew, this.switchtime);
              storeProgram(this);
              this.requestUpdate();
            },
            !this.isSelected
          )}
          ${renderButton(
            localize("ui.card.ems_program_card.change"),
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

        ${!this.program || !this.programNew
          ? html`<div class="row message">
              ${localize("ui.card.ems_program_card.error.no_program")}
            </div>`
          : html`<div class="row">
                ${localize("ui.card.ems_program_card.advice")}
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
                  idx: idx,
                };
              })}`}

        <div class="row">
          ${renderButton(
            localize("ui.card.ems_program_card.ems_read"),
            () => {
              this.isSelected = false;
              readFromEms(this);
              this.requestUpdate();
            },
            this.isRunning
          )}
          ${renderButton(
            localize("ui.card.ems_program_card.ems_write"),
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
            localize("ui.card.ems_program_card.undo"),
            () => {
              this.isSelected = false;
              undoProgram(this);
              this.requestUpdate();
            },
            this.isRunning
          )}
          ${renderButton(
            localize("ui.card.ems_program_card.reset"),
            () => {
              this.isSelected = false;
              resetProgram(this);
              this.requestUpdate();
            },
            this.isRunning
          )}
        </div>

        <div class="row message">
          ${this.isRunning
            ? html`<ha-circular-progress indeterminate></ha-circular-progress>`
            : html``}
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

// Register card
customElements.define("ems-program-card", EmsProgramCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "ems-program-card",
  name: "EMS Program Card",
});

// Graphical editor for configuration
class EmsProgramCardEditor extends LitElement {
  // Return CSS styles for card
  static get styles() {
    return cssStyles;
  }

  // Return class properties
  static get properties() {
    return {
      _hass: {},
      config: {},
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
      this.entityIdList = Object.keys(hass.states).filter((key) =>
        key.startsWith("text.")
      );
      console.info(this.entityIdList);
    }
  }

  // Deal with config changes
  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  // Render config card
  render() {
    return html`
      <div class="row">
        ${localize("ui.card.ems_program_card.editor.help_text")}
      </div>
      <div class="row">
        <ha-textfield
          label="${localize("ui.card.ems_program_card.editor.title")}"
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
          .includeEntities=${Object.keys(this._hass.states).filter((key) =>
            key.startsWith("text.")
          )}
          .label="${localize("ui.card.ems_program_card.editor.entity")}"
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

// Register config editor
customElements.define("ems-program-card-editor", EmsProgramCardEditor);
