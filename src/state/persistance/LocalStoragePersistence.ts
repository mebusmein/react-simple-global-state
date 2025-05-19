import type { PersistenceMiddleware } from "./Persistance";

export interface LocalStoragePersistenceOptions<T extends object> {
  /**
   * Key to use for storing in localStorage
   */
  key: string;

  /**
   * Expiry time in milliseconds
   * If provided, stored data will be considered expired after this duration
   */
  expiryMs?: number;

  /**
   * Optional list of keys to include in localStorage
   * If not provided, all keys are included
   */
  includeKeys?: Array<keyof T>;
}

interface StorageItem<T> {
  /**
   * The actual data being stored
   */
  data: Partial<T>;

  /**
   * Timestamp when the data expires (if applicable)
   */
  expiry?: number;

  /**
   * Timestamp when the data was stored
   */
  timestamp: number;
}

/**
 * Creates a persistence middleware that stores state in localStorage
 */
export function createLocalStoragePersistence<T extends object>(
  options: LocalStoragePersistenceOptions<T>
): PersistenceMiddleware<T> {
  return {
    load: () => {
      try {
        if (typeof window === "undefined" || !window.localStorage) return null;

        const item = localStorage.getItem(options.key);
        if (!item) return null;

        const storage = JSON.parse(item) as StorageItem<T>;

        // Check if expired
        if (options.expiryMs && storage.expiry && Date.now() > storage.expiry) {
          localStorage.removeItem(options.key);
          return null;
        }

        return storage.data;
      } catch (e) {
        console.error("Failed to load state from localStorage", e);
        return null;
      }
    },

    save: (state: T) => {
      try {
        if (typeof window === "undefined" || !window.localStorage) return;

        // Filter state to only included keys
        const filteredState: Partial<T> = {};
        const keysToInclude =
          options.includeKeys || (Object.keys(state) as Array<keyof T>);

        keysToInclude.forEach((key) => {
          if (key in state) {
            filteredState[key] = state[key];
          }
        });

        const storage: StorageItem<T> = {
          data: filteredState,
          timestamp: Date.now(),
        };

        if (options.expiryMs) {
          storage.expiry = Date.now() + options.expiryMs;
        }

        localStorage.setItem(options.key, JSON.stringify(storage));
      } catch (e) {
        console.error("Failed to save state to localStorage", e);
      }
    },

    clear: () => {
      try {
        if (typeof window === "undefined" || !window.localStorage) return;
        localStorage.removeItem(options.key);
      } catch (e) {
        console.error("Failed to clear localStorage state", e);
      }
    },

    priority: 20,
  };
}
