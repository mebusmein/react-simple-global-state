import React from "react";
import { useSearchState } from "../state/searchState";

const styles = {
  container: {
    width: "22rem",
    padding: "1rem",
    backgroundColor: "#F9FAFB",
    borderRadius: "0.375rem",
    marginTop: "1rem",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
  },
  dataGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#6B7280",
  },
  value: {
    fontSize: "0.875rem",
    color: "#111827",
  },
  emptyValue: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
};

export const SearchData: React.FC = () => {
  const searchState = useSearchState();

  const formatDate = (date: Date) => {
    if (!date) return "Not set";
    return date.toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Current Search Parameters</h3>
      <div style={styles.dataGrid}>
        <span style={styles.label}>Check-in:</span>
        <span style={searchState.checkIn ? styles.value : styles.emptyValue}>
          {formatDate(searchState.checkIn)}
        </span>

        <span style={styles.label}>Check-out:</span>
        <span style={searchState.checkOut ? styles.value : styles.emptyValue}>
          {formatDate(searchState.checkOut)}
        </span>

        <span style={styles.label}>Rooms:</span>
        <span style={styles.value}>{searchState.rooms || 0}</span>

        <span style={styles.label}>Adults:</span>
        <span style={styles.value}>{searchState.adults || 0}</span>

        <span style={styles.label}>Children:</span>
        <span style={styles.value}>{searchState.children || 0}</span>

        <span style={styles.label}>Infants:</span>
        <span style={styles.value}>{searchState.infants || 0}</span>
      </div>
    </div>
  );
};
