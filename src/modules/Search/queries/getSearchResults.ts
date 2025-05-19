import type { ISearchState } from "../state/searchState";

export const getSearchQueryKey = (searchState: ISearchState) => {
  return ["search", ...Object.values(searchState)];
};

const getSearchResults = async (searchState: ISearchState) => {
  // fake fetch
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    results: [
      {
        id: 1,
        name: "Hotel 1",
        price: 100,
        image: "https://via.placeholder.com/150",
        rating: 4.5,
        reviews: 100,
      },
      {
        id: 2,
        name: "Hotel 2",
        price: 200,
        image: "https://via.placeholder.com/150",
        rating: 4.5,
        reviews: 100,
      },
    ],
  };
};

export const getSearchResultsQueryOptions = (searchState: ISearchState) => {
  return {
    queryKey: getSearchQueryKey(searchState),
    queryFn: () => getSearchResults(searchState),
    enabled: !!searchState.checkIn && !!searchState.checkOut,
  };
};
