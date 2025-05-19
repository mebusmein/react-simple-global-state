import type { PersistenceMiddleware } from "./Persistance";

export interface UrlPersistenceOptions<T extends object> {
  /**
   * Mapping of store keys to shorter URL-friendly keys
   * Either an simple key mapping or a encode/decode pair
   */
  mapping:
    | Partial<Record<keyof T, string>>
    | {
        encode: (state: T) => Record<string, unknown>;
        decode: (state: Record<string, unknown>) => Partial<T>;
      };
  priority?: number;
}

/**
 * Creates a persistence middleware that stores state in the URL query parameters
 */
export function createUrlPersistence<T extends object>(
  options: UrlPersistenceOptions<T>
): PersistenceMiddleware<T> {
  return {
    load: () => {
      console.log("loading url state");
      try {
        if (typeof window === "undefined") return null;

        const state = getUrlState();
        if (Object.keys(state).length === 0) return null;

        // Convert URL parameters to state object
        if ("encode" in options.mapping) {
          return options.mapping.decode(state);
        } else {
          const result = {} as Partial<T>;

          // Map short keys back to original keys
          Object.entries(state).forEach(([shortKey, value]) => {
            const originalKeyEntry = Object.entries(options.mapping).find(
              ([, v]) => v === shortKey
            );

            if (originalKeyEntry) {
              const originalKey = originalKeyEntry[0] as keyof T;
              result[originalKey] = value as T[keyof T];
            }
          });

          return result;
        }
      } catch (e) {
        console.error("Failed to load state from URL", e);
        return null;
      }
    },

    save: (state: T) => {
      console.log("saving url state");
      try {
        if (typeof window === "undefined") return;

        let stateToSave: Record<string, unknown>;

        if ("encode" in options.mapping) {
          stateToSave = options.mapping.encode(state);
        } else {
          stateToSave = {};
          const mapping = options.mapping as Partial<Record<keyof T, string>>;

          // Map state keys to their shorter versions
          Object.entries(state).forEach(([key, value]) => {
            const shortKey = mapping[key as keyof T];
            if (shortKey) {
              stateToSave[shortKey] = value;
            }
          });
        }

        setUrlState(stateToSave);
      } catch (e) {
        console.error("Failed to save state to URL", e);
      }
    },

    clear: () => {
      clearUrlState();
    },

    priority: options.priority || 10,
  };
}

// these are helper functions that would be abstracted away in the real project by the hostmanager.

/**
 * Updates the URL with the given state values
 */
export function setUrlState(state: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  // Clear existing search params
  url.search = "";

  // Add new params
  Object.entries(state).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, serializeValue(value));
    }
  });

  // Update URL without reload
  window.history.replaceState({}, "", url.toString());
}

export function getUrlState(): Record<string, unknown> {
  if (typeof window === "undefined") return {};

  const url = new URL(window.location.href);
  const state: Record<string, unknown> = {};

  url.searchParams.forEach((value, key) => {
    state[key] = deserializeValue(value);
  });

  return state;
}

/**
 * Clears all search parameters from the URL
 */
export function clearUrlState() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url.toString());
}

/**
 * Serializes a value to a URL-safe string
 */
function serializeValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

/**
 * Deserializes a URL string value back to its original type
 */
function deserializeValue(value: string): unknown {
  // Try parsing as number first
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  // Try parsing as date
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try parsing as boolean
  if (value === "1" || value === "0") {
    return value === "1";
  }

  // Return as string if no other type matches
  return value;
}
