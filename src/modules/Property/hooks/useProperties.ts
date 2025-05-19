import { useQuery } from "@tanstack/react-query";
import { getPropertiesQueryOptions } from "../queries/getProperties";
import { usePropertyStore } from "../state/propertyState";

export const useProperties = () => {
  const { propertyGroupId } = usePropertyStore();
  const { data, isLoading, error } = useQuery({
    ...getPropertiesQueryOptions(propertyGroupId),
    enabled: !!propertyGroupId,
    select: (data) => data.propertyGroup.properties,
  });

  return { properties: data, isLoading, error };
};
