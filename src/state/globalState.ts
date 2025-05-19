import { useSyncExternalStore } from "react";

export type GlobalState<T extends object> = {
  getState: () => T;
  setState: (newState: T) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createStore<T extends object>(initialState: T): GlobalState<T> {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (newState: T) => {
      state = newState;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T extends object>(
  globalState: GlobalState<T> | ReadOnlyStore<T>
) {
  return useSyncExternalStore(globalState.subscribe, globalState.getState);
}

export type ReadOnlyStore<T> = {
  getState: () => T;
  subscribe: (listener: () => void) => () => void;
};
