import { type ISearchState } from "./searchState";
import { z } from "zod";
import { type ValidationResult } from "../../../state/persistance/Persistance";

/**
 * Validation functions have to return a ValidationResult<T>
 * They have two ways of handeling validation.
 * 1. Mutate the state and return the mutated state. This is great for silent validation.
 * 2. Return a ValidationResult<T> with success set to false and an array of errors. This is great for validation that needs to display errors to the user.
 *    The state can still be mutated to ensure the app will work even if the validation fails.
 */
export const validateSearchState = (
  searchState: ISearchState
): ValidationResult<ISearchState> => {
  if (searchState.checkIn || searchState.checkOut) {
    const checkInDate = new Date(searchState.checkIn);
    const checkOutDate = new Date(searchState.checkOut);

    // check if checkIn is a valid date that is in the future
    // otherwise strip dates
    if (
      isNaN(checkInDate.getTime()) ||
      checkInDate < new Date() ||
      isNaN(checkOutDate.getTime()) ||
      checkOutDate < new Date()
    ) {
      searchState.checkIn = new Date();
      searchState.checkOut = new Date();
    }
  }

  // check if rooms is a number that is greater than 0
  if (isNaN(searchState.rooms) || searchState.rooms <= 0) {
    searchState.rooms = 1;
  }

  // check if adults is a number that is greater than 0
  if (isNaN(searchState.adults) || searchState.adults <= 0) {
    searchState.adults = 1;
  }

  // check if children is a number that is greater than 0
  if (isNaN(searchState.children) || searchState.children < 0) {
    searchState.children = 0;
  }

  // check if infants is a number that is greater than 0
  if (isNaN(searchState.infants) || searchState.infants < 0) {
    searchState.infants = 0;
  }

  return {
    success: true,
    data: searchState,
  };
};

// this is the schema that will be used by react-hook-form
// it can also be used to validate the state for persistance. but in that case we would like to have more control
export const SearchStateSchema = z.object({
  checkIn: z.coerce
    .date()
    .min(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      "Check-in date can't be in the past"
    ), // after yesterdays date
  checkOut: z.coerce
    .date()
    .min(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      "Check-out date can't be in the past"
    ), // after yesterdays date
  rooms: z.number().min(1, "Rooms is required"),
  adults: z.number().min(1, "Adults is required"),
  children: z.number().min(0, "Children can't be negative"),
  infants: z.number().min(0, "Infants can't be negative"),
});
