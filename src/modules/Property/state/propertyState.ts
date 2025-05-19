import { createStore, useStore } from "../../../state/globalState";

export interface PropertyState {
  propertyId: string;
  propertyGroupId: string;
}

export const PropertyState = createStore<PropertyState>({
  propertyId: "",
  propertyGroupId: "",
});

export const usePropertyStore = () => {
  return useStore(PropertyState);
};
