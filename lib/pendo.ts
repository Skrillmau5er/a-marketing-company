type TrackProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    pendo?: { track: (event: string, properties?: TrackProperties) => void };
  }
}

/** Pendo Track Events. A no-op until the Pendo snippet is installed, and never throws, so tracking can't break the UI. */
export const pendo = {
  track(event: string, properties?: TrackProperties) {
    try {
      window.pendo?.track(event, properties);
    } catch {
      // Tracking is best-effort.
    }
  },
};
