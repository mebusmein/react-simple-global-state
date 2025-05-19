import type { BookingState } from "../state/bookingState";

export const getRoomRatesQueryKey = (propertyId: string) => {
  return ["roomRates", propertyId];
};

const getRoomRates = async (propertyId: string) => {
  // fake fetch
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    rates: [
      {
        id: 1,
        name: "Standard Rate",
        price: 150,
        currency: "EUR",
        cancellationPolicy: "Free cancellation until 24h before check-in",
        boardBasis: "Room Only",
        refundable: true,
        breakfast: false,
      },
      {
        id: 2,
        name: "Breakfast Included",
        price: 180,
        currency: "EUR",
        cancellationPolicy: "Free cancellation until 24h before check-in",
        boardBasis: "Bed & Breakfast",
        refundable: true,
        breakfast: true,
      },
      {
        id: 3,
        name: "Non-Refundable",
        price: 130,
        currency: "EUR",
        cancellationPolicy: "Non-refundable",
        boardBasis: "Room Only",
        refundable: false,
        breakfast: false,
      },
    ],
  };
};

export const getRoomRatesQueryOptions = (bookingState: BookingState) => {
  return {
    queryKey: getRoomRatesQueryKey(bookingState),
    queryFn: () => getRoomRates(bookingState),
    enabled:
      !!bookingState.checkIn &&
      !!bookingState.checkOut &&
      bookingState.rooms > 0,
  };
};
