export const getPropertiesQueryKey = (propertyGroupId: string) => {
  return ["properties", propertyGroupId];
};

const getProperties = async (propertyGroupId: string) => {
  // fake fetch
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    propertyGroup: {
      id: propertyGroupId,
      name: "Hotel Chain Group",
      properties: [
        {
          id: "1",
          name: "Grand Hotel Downtown",
          address: "123 Main Street",
          city: "New York",
          country: "USA",
          timezone: "America/New_York",
          currency: "USD",
        },
        {
          id: "2",
          name: "Grand Hotel Beach Resort",
          address: "456 Ocean Drive",
          city: "Miami",
          country: "USA",
          timezone: "America/New_York",
          currency: "USD",
        },
        {
          id: "3",
          name: "Grand Hotel City Center",
          address: "789 Business Avenue",
          city: "Chicago",
          country: "USA",
          timezone: "America/Chicago",
          currency: "USD",
        },
      ],
    },
  };
};

export const getPropertiesQueryOptions = (propertyGroupId: string) => {
  return {
    queryKey: getPropertiesQueryKey(propertyGroupId),
    queryFn: () => getProperties(propertyGroupId),
  };
};
