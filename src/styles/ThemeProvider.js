import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import BaseStyles from '../styles/BaseStyles';

export default function ThemeProvider({ children }) {
  const adjustedTheme = (ancestorTheme) => ({ ...ancestorTheme });
  return (
    <EmotionThemeProvider theme={adjustedTheme}>
      <BaseStyles />
      {children}
    </EmotionThemeProvider>
  );
}
