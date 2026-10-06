/** Properties sent with a Pendo Track Event; keep the serialized object under 512 bytes. */
type TrackProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    /** The Pendo agent, present once its install snippet has run. */
    pendo?: { track: (event: string, properties?: TrackProperties) => void };
  }
}

/** Safe `pendo.track()`: a no-op until the Pendo agent has loaded, and it never throws into the UI. */
export const pendo = {
  track(event: string, properties?: TrackProperties) {
    try {
      window.pendo?.track(event, properties);
    } catch {
      // Analytics must never break the page.
    }
  },
};
