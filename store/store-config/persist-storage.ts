import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { createNoopStorage } from "@utils";

export const persistStorage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default persistStorage;
