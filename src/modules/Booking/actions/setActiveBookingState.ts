import { bookingStateManager } from "../state/bookingState";

export function setActiveBookingState(bookingStateId: string) {
  const prevBookingManagerState = bookingStateManager.getState();
  bookingStateManager.setState({
    activeBookingStateId: bookingStateId,
    bookingStates: prevBookingManagerState.bookingStates,
  });
}
