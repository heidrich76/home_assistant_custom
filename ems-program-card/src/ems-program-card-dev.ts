import {
  LitElement,
  html,
  css,
  TemplateResult,
  CSSResultGroup,
} from "lit";
import { property, state, customElement } from "lit/decorators.js";
import {
  loadTranslations,
  localize,
} from "./ems-card-helper";
import {
  storeProgram,
  loadProgram,
  undoProgram,
  resetProgram,
  writeToEms,
  readFromEms,
  addSwitchTime,
  removeSwitchTime,
} from "./ems-service-helper";
import { renderSvg } from "./ems-svg-helper";
import { SwitchTime, Program, EmsCard } from "./ems-card"
import { Hass, CustomWindow } from "./home-assistant"

const haWindow: CustomWindow = window as unknown as CustomWindow;


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
function renderButton(
  text: string,
  clickHandler: (e: Event) => void,
  disabled: boolean = false
): TemplateResult {
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
@customElement(import.meta.env.VITE_HA_CARD_ID)
export class EmsProgramCard extends LitElement implements EmsCard {
  // Load custom styles to card
  static styles: CSSResultGroup = cssStyles;

  // Return class properties
  @property({ attribute: false }) public _hass!: Hass;
  @property({ attribute: false }) public config: any;
  @state() public program?: Program;
  @state() public programNew?: Program;
  @state() public switchTime: SwitchTime = {
    day: "mo",
    hour: "07",
    minute: "00",
    state: true,
    idx: -1,
    secondsSinceMidnight: -1,
  };
  @state() public isRunning = false;
  @state() public isSelected = false;
  @state() public statusMessage = "";
  @state() public dayIds: string[] = [];
  @state() public dayNames: string[] = [];
  @state() public isDebugMode = false;

  // Create card
  constructor() {
    super();

    // Checks whether program runs in debug mode
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebugMode = urlParams.has('debug') && urlParams.get('debug') === '1';
  }

  // Handle all config parameters
  setConfig(config: any): void {
    // Clone config for adding some values if not present
    this.config = { ...config };
    this.config.title ??= "EMS";
  }

  // Hass method which is regularly called by HA
  set hass(hass: Hass) {
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
    loadTranslations(this._hass.locale.language);
  }

  // Define size of card
  getCardSize(): number {
    return 5;
  }

  // Main render method
  render(): TemplateResult {
    if (!this.config.entity_id) {
      return html`<ha-card header="${this.config.title}">
        <div class="card-content">
          ${localize("ui.card.ems_program_card.editor.help_text")}
          <pre><code>
            type: custom:ems-program-card
            title: Program Buderus
            entity_id: text.thermostat_hc1_switchTime1
          </code></pre>
        </div>
      </ha-card> `;
    }
    const timeStr = this.switchTime.hour + ":" + this.switchTime.minute;
    return html`<ha-card header="${this.config.title}">
      <div class="card-content">
        <div class="row">
          <ha-select style="width: 200px;"
            .naturalmenuwidth=${false}
            @change="${(e: Event) => {
        const value = (e?.target as HTMLSelectElement)?.value;
        if (value) {
          this.switchTime.day = value;
        }
      }}" class="in-container">
            ${Object.entries(this.dayIds).map(
        ([idx, id]) => html`<ha-list-item
                value="${String(id)}"
                role="option"
                ?selected="${this.switchTime.day == id}"
              >
                ${this.dayNames[Number(idx)]}
              </ha-list-item>`
      )}
          </ha-select>
          <ha-time-input
            .locale=${this._hass.locale}
            .value=${timeStr}
            @change="${(e: Event) => {
        const value = (e?.target as HTMLInputElement)?.value;
        if (value) {
          const [hour, minute] = value.split(":");
          let hourNum = Number(hour);
          if (!(hourNum >= 0 && hourNum <= 23)) {
            hourNum = 0;
          }
          let minuteNum = Number(minute);
          if (!(minuteNum >= 0 && minuteNum <= 59)) {
            minuteNum = 0;
          }
          minuteNum = Math.floor(minuteNum / 10) * 10;
          this.switchTime.hour = String(hourNum).padStart(2, "0");
          this.switchTime.minute = String(minuteNum).padStart(2, "0");
          this.requestUpdate();
        }
      }}"
            class="in-container"></ha-time-input>
          <ha-checkbox
            .checked=${this.switchTime.state}
            @change="${(_: Event) => {
        this.switchTime.state = !this.switchTime.state;
      }}"
            class="in-container"></ha-checkbox>
        </div>
        <div class="row">
          ${renderButton(
        localize("ui.card.ems_program_card.new"),
        () => {
          addSwitchTime(this);
          storeProgram(this);
          this.requestUpdate();
        },
        this.isRunning || !this.programNew
      )}
          ${renderButton(
        localize("ui.card.ems_program_card.delete"),
        () => {
          this.isSelected = false;
          removeSwitchTime(this);
          storeProgram(this);
          this.requestUpdate();
        },
        !this.isSelected
      )}
          ${renderButton(
        localize("ui.card.ems_program_card.change"),
        () => {
          this.isSelected = false;
          removeSwitchTime(this);
          addSwitchTime(this);
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
              ${renderSvg(this, (e: Event) => {
          const id = (e?.target as HTMLElement)?.id;
          if (id && this.programNew) {
            const [wdId, idx] = id.split("-");
            const selectedSt = this.programNew[wdId][Number(idx)];
            this.isSelected = true;
            this.switchTime = {
              day: wdId,
              hour: selectedSt.hour,
              minute: selectedSt.minute,
              state: selectedSt.state,
              idx: Number(idx),
              secondsSinceMidnight: -1,
            };
          }
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
          ${this.isDebugMode ? renderButton(
          localize("ui.card.ems_program_card.reset"),
          () => {
            this.isSelected = false;
            resetProgram(this);
            this.requestUpdate();
          },
          this.isRunning
        ) : html``}
        </div>

        <div class="row message">
          ${this.statusMessage}
        </div>
      </div>
    </ha-card>`;
  }

  // Set config editor card
  static getConfigElement(): any {
    return document.createElement(import.meta.env.VITE_HA_CARD_EDITOR_ID);
  }
}

// Add readable name to card
haWindow.customCards = haWindow.customCards || [];
haWindow.customCards.push({
  type: import.meta.env.VITE_HA_CARD_ID,
  name: "EMS Program Card",
});

// Graphical editor for configuration
@customElement(import.meta.env.VITE_HA_CARD_EDITOR_ID)
export class EmsProgramCardEditor extends LitElement {
  // Load custom styles to card
  static styles: CSSResultGroup = cssStyles;

  // Return class properties
  @property({ attribute: false }) public _hass!: Hass;
  @state() private _config: any;
  @state() private entityIdList?: string[];
  @state() private isDebugMode: boolean = false;

  // Sets the configuration
  setConfig(config: any): void {
    this._config = config;
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebugMode = urlParams.has("debug") && urlParams.get("debug") === "1";
  }

  // Hass method which is regularly called by HA
  set hass(hass: Hass) {
    this._hass = hass;
    if (!this.entityIdList) {
      this.entityIdList = Object.keys(hass.states).filter((key) =>
        key.startsWith("text.")
      );
      if (this.isDebugMode) {
        console.info(this.entityIdList);
      }
    }
  }

  // Deal with config changes
  private configChanged(newConfig: any): void {
    const event = new CustomEvent<{ config: any }>("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // Render config card
  render(): TemplateResult {
    return html`
      <div class="row">
        ${localize("ui.card.ems_program_card.editor.help_text")}
      </div>
      <div class="row">
        <ha-textfield
          label="${localize("ui.card.ems_program_card.editor.title")}"
          .value=${this._config.title}
          class="in-container"
          @click="${(e: Event) => {
        const newConfig = Object.assign({}, this._config);
        const value = (e?.target as HTMLInputElement)?.value;
        if (value) {
          newConfig.title = value;
          this.configChanged(newConfig);
        }
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
          @change="${(e: Event) => {
        const newConfig = Object.assign({}, this._config);
        const value = (e?.target as HTMLInputElement)?.value;
        if (value) {
          newConfig.entity_id = value;
          this.configChanged(newConfig);
        }
      }}" allow-custom-entity></ha-entity-picker>
      </div>
    `;
  }
}