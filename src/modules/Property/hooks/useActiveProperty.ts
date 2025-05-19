import { useQuery } from "@tanstack/react-query";
import { getPropertiesQueryOptions } from "../queries/getProperties";
import { usePropertyStore } from "../state/propertyState";

export const useActiveProperty = () => {
  const { propertyGroupId, propertyId } = usePropertyStore();
  const { data, isLoading, error } = useQuery({
    ...getPropertiesQueryOptions(propertyGroupId),
    select: (data) =>
      data.propertyGroup.properties.find(
        (property) => property.id === propertyId
      ),
    enabled: !!propertyGroupId,
  });

  return { data, isLoading, error };
};
