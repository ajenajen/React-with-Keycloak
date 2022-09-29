/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

import normalize from './_normalize';
import reset from './_reset';
import clearFix from './_clearFix';
import getGlobalStyles from '../themes/main/globalStyles';

const getBaseStyles = () => css`
  ${normalize}
  ${reset}
  ${clearFix}
  ${getGlobalStyles()}
`;

export default function BaseStyles() {
  return <Global styles={getBaseStyles()} />;
}
