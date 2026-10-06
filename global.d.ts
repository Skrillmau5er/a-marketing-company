type PendoMetadataValue = string | number | boolean | string[] | null | undefined;

interface PendoMetadata {
  id: string;
  [key: string]: PendoMetadataValue;
}

interface PendoOptions {
  visitor: PendoMetadata;
  account?: PendoMetadata;
}

/** Subset of the Pendo agent API: the install lifecycle (initialize, identify, clearSession) and track. */
interface Pendo {
  initialize(options: PendoOptions): void;
  identify(options: PendoOptions): void;
  track(name: string, properties?: Record<string, PendoMetadataValue>): void;
  clearSession(): void;
}

declare global {
  /** Defined by the install snippet in app/layout.tsx. Call it as `window.pendo?.` in case that script was blocked. */
  var pendo: Pendo | undefined;
}

export {};
