import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ISearchState } from "../state/searchState";
import { useSearchState } from "../state/searchState";
import { SearchStateSchema } from "../state/validateSearchState";
import { updateSearch } from "../actions/updateSearch";
import { toFormDefaultValues } from "../../../state/utils/form";
/**
 * @description this hook is used to create a form for the search state, it handles the form state and validation
 */
export function useSearchForm() {
  const searchState = useSearchState();
  const { register, handleSubmit, formState } = useForm<ISearchState>({
    defaultValues: toFormDefaultValues(searchState),
    resolver: zodResolver(SearchStateSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log("onSubmit", data);
    updateSearch(data);
  });

  return {
    register,
    onSubmit,
    formState,
  };
}
