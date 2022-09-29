import { css } from '@emotion/react';

export default function getGlobalStyles() {
  return css`
    html,
    body {
      padding: 0;
      margin: 0;
      min-height: 100%;
      overflow-x: hidden;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    img {
      width: 100%;
      max-width: 100%;
      height: auto;
    }
    a {
      font-weight: normal;
    }
    a,
    button {
      outline: none;
      cursor: pointer;
    }
    .page-wrapper {
      background: url('/themes/main/bg-body.svg') no-repeat left bottom / cover;
      min-height: 100vh;
    }
    main {
      padding: 15px;
    }
  `;
}
