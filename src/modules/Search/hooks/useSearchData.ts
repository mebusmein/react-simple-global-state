import { useQuery } from "@tanstack/react-query";
import { getSearchResultsQueryOptions } from "../queries/getSearchResults";
import { useSearchState } from "../state/searchState";

export const useSearchData = () => {
  const searchState = useSearchState();

  const { data, isLoading, error } = useQuery(
    getSearchResultsQueryOptions(searchState)
  );

  return {
    searchState,
    searchData: data?.results,
    isLoading,
    error,
  };
};
