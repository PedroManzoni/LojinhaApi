import React from "react";
import GlobalContextProvider from "./src/context/GlobalContext";
import AppNavigator from "./src/navigation/appNavigator";

export default function App() {
  return (
    <GlobalContextProvider>
      <AppNavigator />
    </GlobalContextProvider>
  );
}
