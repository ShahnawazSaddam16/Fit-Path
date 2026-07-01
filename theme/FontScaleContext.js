import { createContext, useContext, useState } from "react";

const FontScaleContext = createContext({
  largeFontEnabled: false,
  setLargeFontEnabled: () => {},
});

export function FontScaleProvider({ children }) {
  const [largeFontEnabled, setLargeFontEnabled] = useState(false);

  return (
    <FontScaleContext.Provider value={{ largeFontEnabled, setLargeFontEnabled }}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale() {
  return useContext(FontScaleContext);
}

export function scaleFontSize(size, largeFontEnabled) {
  return largeFontEnabled ? Math.round(size * 1.25) : size;
}
