import type { PersistenceMiddleware } from "./Persistance";

/**
 * Creates a layered persistence middleware that combines multiple persistence strategies
 * with priority-based loading.
 *
 * @param middlewares - Array of persistence middlewares in order of priority (lower priority number = higher priority)
 */
export function createLayeredPersistence<T extends object>(
  middlewares: PersistenceMiddleware<T>[],
  options: {
    strategy?: "highest-priority" | "merge";
  } = {}
): PersistenceMiddleware<T> {
  const { strategy = "highest-priority" } = options;

  // Sort middlewares by priority (lower number = higher priority)
  const sortedMiddlewares = [...middlewares].sort(
    (a, b) => (a.priority || 100) - (b.priority || 100)
  );

  return {
    load: () => {
      // Try loading from each middleware in priority order
      if (strategy === "highest-priority") {
        for (const middleware of sortedMiddlewares) {
          const state = middleware.load();
          if (state) {
            return state;
          }
        }
      } else if (strategy === "merge") {
        const invertedSortedMiddlewares = [...sortedMiddlewares].reverse();
        return invertedSortedMiddlewares.reduce((acc, state) => {
          const loadedState = state.load();
          if (loadedState) {
            return { ...acc, ...loadedState };
          }
          return acc;
        }, {} as Partial<T>);
      }
      return null;
    },

    save: (state: T) => {
      // Save to all middlewares
      sortedMiddlewares.forEach((middleware) => {
        middleware.save(state);
      });
    },

    clear: () => {
      // Clear all middlewares
      sortedMiddlewares.forEach((middleware) => {
        if (middleware.clear) {
          middleware.clear();
        }
      });
    },

    // Layered persistence has highest priority
    priority: 0,
  };
}
