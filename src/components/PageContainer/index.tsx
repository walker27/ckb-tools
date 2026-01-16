import type { PropsWithChildren, ReactNode } from "react"


type PageContainerProps = PropsWithChildren<{
  title?: ReactNode
  extra?: ReactNode
}>

export default function PageContainer(props: PageContainerProps) {
  const { children, title, extra } = props
  return (
    <div className="flex-1 p-5 flex flex-col gap-3">
      <div className="flex-none flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {extra}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}