import { createContext } from 'react';

const SettingsContext = createContext({});

export const SettingsProvider = SettingsContext.Provider;

export default SettingsContext;