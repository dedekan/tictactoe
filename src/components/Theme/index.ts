import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    body: `Fira Sans, ${defaultTheme.fonts.body}`,
    heading: `Fira Sans, ${defaultTheme.fonts.heading}`
  }
});
