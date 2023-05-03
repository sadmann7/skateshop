import type * as React from 'react';

declare global {
  namespace JSX {
    type ElementType = keyof JSX.IntrinsicElements | ((props: unknown) => Promise<React.ReactNode> | React.ReactNode);
  }
}
