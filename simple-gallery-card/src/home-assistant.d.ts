export interface Hass {
  callWS: <T = any>(msg: any) => Promise<T>;
  callService: (domain: string, service: string, data: Record<string, any>) => Promise<void>;
}