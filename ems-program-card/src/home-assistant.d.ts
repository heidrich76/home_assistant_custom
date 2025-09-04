export interface CardHelpers {
  createRowElement: (config: any) => HTMLElement;
  createCardElement?: (config: any) => HTMLElement;
  importMoreInfoControl?: (control: string) => Promise<void>;
}

export interface CustomWindow extends Window {
  cardHelpers?: CardHelpers;
  customCards: Array<any>;
  loadCardHelpers: () => Promise<CardHelpers>;
}

export interface HassEntityState {
  state: string;
  attributes: Record<string, any>;
}

export interface Hass {
  states: Record<string, HassEntityState>;
  locale: {
    language: string;
  };
  callWS: <T = any>(msg: any) => Promise<T>;
  callService: (domain: string, service: string, data: Record<string, any>) => Promise<void>;
  callApi: <T = any>(method: string, path: string, data: Record<string, any>) => Promise<T>;
}
