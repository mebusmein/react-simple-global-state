import type { GlobalState } from "../globalState";

export interface PersistenceMiddleware<T extends object> {
  load: () => Partial<T> | null;
  save: (state: T) => void;
  priority?: number;
  clear?: () => void;
}

export enum PersistanceLoadStatus {
  IDLE = "IDLE",
  LOADING = "LOADING",
  VALIDATING = "VALIDATING",
  LOADED = "LOADED",
}

export type PersistanceStatus = {
  loadStatus: PersistanceLoadStatus;
};

export interface ValidationResult<T extends object> {
  success: boolean;
  data?: Partial<T>;
  errors?: string[];
}

export type AsyncValidator<
  T extends object,
  P extends Record<string, unknown> = Record<string, unknown>
> = (state: Partial<T>, params?: P) => Promise<ValidationResult<T>>;

export type SyncValidator<T extends object> = (
  state: T,
  params?: Record<string, unknown>
) => ValidationResult<T>;

export interface PersistenceManager<
  T extends object,
  P extends Record<string, unknown> = Record<string, unknown>
> {
  load: () => Partial<T> | null;
  save: (state: T) => void;
  validateAsync: (params?: P) => Promise<ValidationResult<T>>;
  reset: () => void;
  resetAndClearPersistence: () => void;
  getStore: () => GlobalState<T>;
  getPersistanceStatus: () => PersistanceStatus;
}

/**
 * Creates a persistence manager for a store that handles loading, saving,
 * validation, and resetting of the store state.
 */
export function bindPersistence<
  T extends object,
  P extends Record<string, unknown> = Record<string, unknown>
>(
  store: GlobalState<T>,
  middleware: PersistenceMiddleware<T>,
  options?: {
    syncValidator?: SyncValidator<T>;
    asyncValidator?: AsyncValidator<T, P>;
    errorStore?: GlobalState<Record<string, string[]>>;
    storeKey?: string;
  }
): PersistenceManager<T, P> {
  const storeKey = options?.storeKey || "unknown";

  const persistanceStatus: PersistanceStatus = {
    loadStatus: PersistanceLoadStatus.IDLE,
  };

  // Initial state for reference when resetting
  const initialState = { ...store.getState() };

  const manager: PersistenceManager<T, P> = {
    load: () => {
      console.log("loading state");
      persistanceStatus.loadStatus = PersistanceLoadStatus.LOADING;
      const savedState = middleware.load();

      if (savedState) {
        console.log("saved state", savedState);
        if (options?.syncValidator) {
          const validationResult = options.syncValidator({
            ...store.getState(),
            ...savedState,
          });

          if (validationResult.success && validationResult.data) {
            store.setState({ ...store.getState(), ...validationResult.data });
            persistanceStatus.loadStatus = PersistanceLoadStatus.LOADED;
            return validationResult.data;
          } else if (validationResult.errors && options.errorStore) {
            // Store validation errors
            options.errorStore.setState({
              ...options.errorStore.getState(),
              [storeKey]: validationResult.errors,
            });
          }

          persistanceStatus.loadStatus = options?.asyncValidator
            ? PersistanceLoadStatus.VALIDATING
            : PersistanceLoadStatus.LOADED;
          return validationResult.data || null;
        } else {
          store.setState({ ...store.getState(), ...savedState });
          persistanceStatus.loadStatus = PersistanceLoadStatus.LOADED;
          return savedState;
        }
      }

      persistanceStatus.loadStatus = PersistanceLoadStatus.LOADED;
      return null;
    },

    save: (state: T) => {
      console.log("saving state", state);
      middleware.save(state);
    },

    validateAsync: async (params?: P): Promise<ValidationResult<T>> => {
      if (!options?.asyncValidator) {
        return { success: true, data: store.getState() };
      }

      try {
        const result = await options.asyncValidator(store.getState(), params);

        if (result.success && result.data) {
          // Update store with validated data
          store.setState({ ...store.getState(), ...result.data });
        } else if (result.errors && options.errorStore) {
          // Store validation errors
          options.errorStore.setState({
            ...options.errorStore.getState(),
            [storeKey]: result.errors,
          });
        }

        persistanceStatus.loadStatus = PersistanceLoadStatus.LOADED;
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (options.errorStore) {
          options.errorStore.setState({
            ...options.errorStore.getState(),
            [storeKey]: [errorMessage],
          });
        }

        return {
          success: false,
          errors: [errorMessage],
        };
      }
    },

    reset: () => {
      console.log("resetting state");
      store.setState(initialState);
    },

    resetAndClearPersistence: () => {
      console.log("resetting and clearing persistence");
      store.setState(initialState);

      // Clear persisted state if middleware supports it
      if (middleware.clear) {
        middleware.clear();
      } else {
        // Try to overwrite with empty state
        try {
          middleware.save(initialState);
        } catch (e) {
          console.error("Failed to clear persisted state for", storeKey, e);
        }
      }

      // Clear errors if error store exists
      if (options?.errorStore) {
        const currentErrors = options.errorStore.getState();
        if (storeKey in currentErrors) {
          // Remove the store key from errors without creating a variable
          const newErrors = Object.entries(currentErrors)
            .filter(([key]) => key !== storeKey)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

          options.errorStore.setState(newErrors);
        }
      }
    },

    getStore: () => store,
    getPersistanceStatus: () => persistanceStatus,
  };

  // Subscribe to changes to automatically persist
  store.subscribe(() => {
    console.log("persistance status", persistanceStatus);
    if (persistanceStatus.loadStatus === PersistanceLoadStatus.LOADED) {
      console.log("saving state to persistence", store.getState());
      middleware.save(store.getState());
    }
  });

  return manager;
}
