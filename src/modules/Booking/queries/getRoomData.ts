import type { BookingState } from "../state/bookingState";

export const getRoomDataQueryKey = (propertyId: string) => {
  return ["roomData", propertyId];
};

const getRoomData = async (propertyId: string) => {
  // fake fetch
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    room: {
      id: 1,
      name: "Deluxe Room",
      description: "Spacious room with city view",
      size: 35,
      maxOccupancy: 4,
      amenities: [
        "Free WiFi",
        "Air Conditioning",
        "Mini Bar",
        "Safe",
        "TV",
        "Coffee Maker",
      ],
      images: [
        "https://via.placeholder.com/800x600",
        "https://via.placeholder.com/800x600",
        "https://via.placeholder.com/800x600",
      ],
      bedTypes: [
        { type: "King", count: 1 },
        { type: "Sofa Bed", count: 1 },
      ],
    },
  };
};

export const getRoomDataQueryOptions = (bookingState: BookingState) => {
  return {
    queryKey: getRoomDataQueryKey(bookingState),
    queryFn: () => getRoomData(bookingState),
    enabled: !!bookingState.rooms && bookingState.rooms > 0,
  };
};
