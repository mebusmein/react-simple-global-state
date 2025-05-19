import React from "react";
import { useSearchForm } from "../hooks/useSearchForm";

const formStyles = {
  container: {
    width: "22rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  inputFocus: {
    borderColor: "#6366F1",
    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
  },
  error: {
    color: "#EF4444",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
};

export const SearchForm: React.FC = () => {
  const {
    register,
    onSubmit,
    formState: { errors, isValid },
  } = useSearchForm();

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>Search Accommodation</h2>
      <form style={formStyles.form} onSubmit={onSubmit}>
        <div style={formStyles.fieldContainer}>
          <label style={formStyles.label}>Check-in Date</label>
          <input
            type="date"
            {...register("checkIn")}
            style={formStyles.input}
          />
          {errors.checkIn && (
            <span style={formStyles.error}>{errors.checkIn.message}</span>
          )}
        </div>

        <div style={formStyles.fieldContainer}>
          <label style={formStyles.label}>Check-out Date</label>
          <input
            type="date"
            {...register("checkOut")}
            style={formStyles.input}
          />
          {errors.checkOut && (
            <span style={formStyles.error}>{errors.checkOut.message}</span>
          )}
        </div>

        <div style={formStyles.fieldContainer}>
          <label style={formStyles.label}>Rooms</label>
          <input
            type="number"
            min="0"
            {...register("rooms", { valueAsNumber: true })}
            style={formStyles.input}
          />
          {errors.rooms && (
            <span style={formStyles.error}>{errors.rooms.message}</span>
          )}
        </div>

        <div style={formStyles.fieldContainer}>
          <label style={formStyles.label}>Adults</label>
          <input
            type="number"
            min="0"
            {...register("adults", { valueAsNumber: true })}
            style={formStyles.input}
          />
          {errors.adults && (
            <span style={formStyles.error}>{errors.adults.message}</span>
          )}
        </div>

        <div style={formStyles.fieldContainer}>
          <label style={formStyles.label}>Children</label>
          <input
            type="number"
            min="0"
            {...register("children", { valueAsNumber: true })}
            style={formStyles.input}
          />
          {errors.children && (
            <span style={formStyles.error}>{errors.children.message}</span>
          )}
        </div>

        <div style={formStyles.fieldContainer}>
          <label style={formStyles.label}>Infants</label>
          <input
            type="number"
            min="0"
            {...register("infants", { valueAsNumber: true })}
            style={formStyles.input}
          />
          {errors.infants && (
            <span style={formStyles.error}>{errors.infants.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          style={{
            ...formStyles.input,
            backgroundColor: isValid ? "#6366F1" : "#D1D5DB",
            color: "white",
            fontWeight: "500",
            cursor: "pointer",
            border: "none",
            marginTop: "1rem",
          }}
        >
          Search
        </button>
      </form>
    </div>
  );
};
