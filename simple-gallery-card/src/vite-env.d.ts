export {};

declare global {
  interface ImportMetaEnv {
    VITE_HA_CARD_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
