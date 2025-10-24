import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Bug, PackageOpen } from "lucide-react";
import Loading from "../Loading";



type QuerySuspenseProps<TData, TError> = {
  query: UseQueryResult<TData, TError>
  children: (data: NonNullable<TData>) => ReactNode
}

export default function QuerySuspense<TData, TError>(props: QuerySuspenseProps<TData, TError>) {
  const { query, children: render } = props;
  
  switch (query.status) {
    case "success":
      if (!query.data) return <EmptyView />
      return render(query.data)
    case "pending":
      return <Loading />
    case "error":
      return (
        <ErrorView message={query.error?.message ?? "query error"} />
      )
    default:
      return null;
  }

}


function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Bug />
      <div>{message}</div>
    </div>
  )
}


function EmptyView() {
  return (
    <div className="flex flex-col items-center justify-center">
      <PackageOpen />
      <div>No data</div>
    </div>
  )
}