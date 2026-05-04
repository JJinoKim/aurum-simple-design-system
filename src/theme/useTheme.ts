/**
 * Re-export styled-components' useTheme with Aurum's Theme type baked in. Lets
 * components read tokens outside of a styled() block:
 *
 *     const theme = useTheme();
 *     <Pressable hitSlop={theme.space[3]} />
 */

import { useTheme as useScTheme } from 'styled-components';
import type { Theme } from '../../tokens/themes';

export const useTheme = (): Theme => useScTheme() as Theme;
