import { _SearchState, type ISearchState } from "../state/searchState";

export const updateSearch = (searchState: ISearchState) => {
  // we could do some extra validation here. In case any other system is updating the search state.
  _SearchState.setState(searchState);
};
