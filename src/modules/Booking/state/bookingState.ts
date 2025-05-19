import { createStore, useStore } from "../../../state/globalState";
import { v4 as uuidv4 } from "uuid";

export type BookingState = {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  infants: number;
};

export type Booking = {
  id: string;
  state: BookingState;
};

export type MultiBookingState = {
  bookings: Booking[];
  activeBookingId: string | null;
};

export const MultiBookingState = createStore<MultiBookingState>({
  bookings: [],
  activeBookingId: null,
});

export const useMultiBookingState = () => {
  return useStore(MultiBookingState);
};

export const useActiveBookingState = () => {
  const { bookings, activeBookingId } = useMultiBookingState();
  return activeBookingId
    ? bookings.find((b) => b.id === activeBookingId)?.state
    : null;
};

export const createNewBooking = () => {
  const bookingId = uuidv4();
  const newBooking: Booking = {
    id: bookingId,
    state: {
      checkIn: "",
      checkOut: "",
      rooms: 0,
      adults: 0,
      children: 0,
      infants: 0,
    },
  };

  MultiBookingState.setState({
    bookings: [...MultiBookingState.getState().bookings, newBooking],
    activeBookingId: bookingId,
  });

  return bookingId;
};

export const updateBooking = (
  bookingId: string,
  updates: Partial<BookingState>
) => {
  const currentState = MultiBookingState.getState();
  MultiBookingState.setState({
    ...currentState,
    bookings: currentState.bookings.map((booking) =>
      booking.id === bookingId
        ? { ...booking, state: { ...booking.state, ...updates } }
        : booking
    ),
  });
};

export const setActiveBooking = (bookingId: string) => {
  MultiBookingState.setState({
    ...MultiBookingState.getState(),
    activeBookingId: bookingId,
  });
};

export const removeBooking = (bookingId: string) => {
  const currentState = MultiBookingState.getState();
  MultiBookingState.setState({
    bookings: currentState.bookings.filter(
      (booking) => booking.id !== bookingId
    ),
    activeBookingId:
      currentState.activeBookingId === bookingId
        ? null
        : currentState.activeBookingId,
  });
};
