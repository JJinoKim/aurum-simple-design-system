/**
 * styled-components type augmentation — makes `theme.color.text` (etc.) typed
 * inside every styled() template.
 *
 * Importing this file once anywhere in the app is enough; TypeScript picks it
 * up via module augmentation.
 */

import 'styled-components';
import type { Theme } from '../../tokens/themes';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
