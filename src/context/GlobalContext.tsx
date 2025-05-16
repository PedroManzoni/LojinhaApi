import React, { createContext, useState } from "react";
import { IProducts } from "../types/product";
import productsJson from "../../assets/products.json";

type GlobalContextType = {
  list: IProducts[];
  setList: React.Dispatch<React.SetStateAction<IProducts[]>>;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [list, setList] = useState<IProducts[]>(productsJson);

  return (
    <GlobalContext.Provider value={{ list, setList }}>
      {children}
    </GlobalContext.Provider>
  );
}
