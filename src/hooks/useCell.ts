import type { UseQueryResult } from "@tanstack/react-query"
import useTransaction from "./useTransaction"
import type { CellAny } from "@ckb-ccc/ccc"






export default function useCell(txHash: string, index: number | string) {
  const { data: txInfo, ...rest } = useTransaction(txHash)
  return {
    data: txInfo?.transaction.getOutput(index),
    ...rest,
  } as UseQueryResult<CellAny | undefined, Error>
}