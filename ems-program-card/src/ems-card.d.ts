import { Hass } from "./home-assistant"

export interface SwitchTime {
  hour: string;
  minute: string;
  secondsSinceMidnight: number;
  state: boolean;
  day: string;
  idx: number;
}

export interface Program {
  [key: string]: SwitchTime[];
}

export interface EmsCard {
  _hass: Hass;
  config: { entity_id: string };
  dayIds: string[];
  dayNames: string[];
  program?: Program;
  programNew?: Program;
  switchTime: SwitchTime
  isDebugMode: boolean;
  isRunning: boolean;
  statusMessage: string;
  requestUpdate: () => void;
}