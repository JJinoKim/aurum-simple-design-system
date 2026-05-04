/**
 * Web platform import for `styled`. Any cross-platform Aurum component should
 * reach for this path; the bundler resolves `.web.ts` for web targets and
 * `.native.ts` for RN — same import line, different runtime.
 *
 *     import styled from '@aurum/platform/styled';
 */

export { default } from 'styled-components';
export * from 'styled-components';
