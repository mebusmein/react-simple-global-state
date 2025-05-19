import {
  createStore,
  useStore,
  type ReadOnlyStore,
} from "../../../state/globalState";

export interface ISearchState {
  checkIn: Date;
  checkOut: Date;
  rooms: number;
  adults: number;
  children: number;
  infants: number;
}

export const _SearchState = createStore<ISearchState>({
  checkIn: new Date(),
  checkOut: new Date(),
  rooms: 1,
  adults: 2,
  children: 0,
  infants: 0,
});

export const SearchState: ReadOnlyStore<ISearchState> = _SearchState;

export const useSearchState = () => {
  return useStore(SearchState);
};
