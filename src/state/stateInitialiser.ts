import { SearchStatePersistanceManager } from "../modules/Search/state/persistance";

export const initialiseState = async () => {
  SearchStatePersistanceManager.load();
};
