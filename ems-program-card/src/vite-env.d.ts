export {};

declare global {
  interface ImportMetaEnv {
    VITE_HA_CARD_ID: string;
    VITE_HA_CARD_EDITOR_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
