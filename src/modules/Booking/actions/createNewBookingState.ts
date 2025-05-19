import { bookingStateManager, createBookingState } from "../state/bookingState";

interface CreateNewBookingStateProps {
  setActive?: boolean;
}

export function createNewBookingState({
  setActive = true,
}: CreateNewBookingStateProps) {
  const bookingState = createBookingState();
  const bookingStateId = bookingState.getState().bookingId;
  const prevBookingManagerState = bookingStateManager.getState();
  bookingStateManager.setState({
    activeBookingStateId: setActive
      ? bookingStateId
      : prevBookingManagerState.activeBookingStateId,
    bookingStates: {
      ...prevBookingManagerState.bookingStates,
      [bookingStateId]: bookingState,
    },
  });
}
