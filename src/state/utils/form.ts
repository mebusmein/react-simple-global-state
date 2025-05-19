function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

type Maybe<T> = T | undefined | null;

/**
 * Create a date YYYY-MM-DD date string that is typecasted as a `Date`.
 * Hack when using `defaultValues` in `react-hook-form`
 * This is because `react-hook-form` doesn't support `defaultValue` of type `Date` even if the types say so
 */
export function dateToInputDate(date: Maybe<Date>) {
  if (!date || !isValidDate(date)) {
    return undefined;
  }
  return date.toJSON().slice(0, 10) as unknown as Date;
}

export const toFormDefaultValues = <T extends object>(state: T) => {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => {
      if (value instanceof Date) {
        return [key, dateToInputDate(value)];
      }
      return [key, value];
    })
  );
};
