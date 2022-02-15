import { css, Global } from '@emotion/react';

const globalCss = css`
  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    min-height: 100%;
  }
`;

export const GlobalStyle: React.FC = () => <Global styles={globalCss} />;
