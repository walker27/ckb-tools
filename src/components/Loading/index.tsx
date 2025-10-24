
import type { ComponentProps } from 'react';
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

type LoadingProps = ComponentProps<'div'> & {
  show?: boolean;
}
export default function Loading(props: LoadingProps) {
  const { show = true, ...divProps } = props;

  if (!show) return null;
  return (
    <div {...divProps}>
      <div className="p-2">
        <Bouncy
          size="32"
          speed="1.75"
          color={"var(--primary)"}
        />
      </div>
    </div>
  )
}