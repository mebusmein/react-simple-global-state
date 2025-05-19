import { _SearchState } from "./searchState";
import { createUrlPersistence } from "../../../state/persistance/UrlPersistence";
import type { ISearchState } from "./searchState";
import { bindPersistence } from "../../../state/persistance/Persistance";
import { validateSearchState } from "./validateSearchState";
import { createLayeredPersistence } from "../../../state/persistance/LayeredPersistence";
import { createLocalStoragePersistence } from "../../../state/persistance/LocalStoragePersistence";

const urlPersistance = createUrlPersistence<ISearchState>({
  // mapping: {
  //   checkIn: "ci",
  //   checkOut: "co",
  //   rooms: "r",
  //   adults: "a",
  //   children: "c",
  //   infants: "i",
  // },
  mapping: {
    encode: (state) => {
      return {
        d: `${state.checkIn?.toLocaleDateString()},${state.checkOut?.toLocaleDateString()}`,
        r: state.rooms,
      };
    },
    decode: (state) => {
      const [checkIn, checkOut] = (state?.d as string)?.split(",") || [];

      return {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
      };
    },
  },
  priority: 1,
});

const localStoragePersistance = createLocalStoragePersistence<ISearchState>({
  key: "search",
  expiryMs: 1000 * 60 * 60 * 24 * 30, // 30 days
});

export const SearchStatePersistanceManager = bindPersistence(
  _SearchState,
  createLayeredPersistence<ISearchState>(
    [urlPersistance, localStoragePersistance],
    {
      strategy: "merge",
    }
  ),
  {
    storeKey: "search",
    syncValidator: validateSearchState,
  }
);
