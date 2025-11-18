import useCell from "@/hooks/useCell";
import { useNetwork } from "@/store/useNetwork";
import { useEffect, useState } from "react";
import CKBAddress from "../CKBAddress";
import { Button } from "antd";
import { rootQueryClient } from "@/lib/queryClient";
import { shannonToCkb } from "@/lib/tool";
import HashText from "../HashText";
import { ccc, type CellAny } from "@ckb-ccc/ccc";
import QuerySuspense from "../QuerySuspense";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import ScriptTag from "../ScriptTag";
import { RefreshCw } from "lucide-react";
import CellSince from "./Since";
import CellAssets from "./CellAssets";


type CellProps = {
  txHash: string
  index: number | string
  since?: ccc.SinceLike;
  showTransacion?: boolean;
}


export default function Cell(props: CellProps) {
  const { txHash, index, showTransacion = true, since } = props;
  const { network } = useNetwork();
  const [haveTxCache, setHaveTxCache] = useState(false);

  useEffect(() => {
    if (haveTxCache) return;
    const queryCache = rootQueryClient.getQueryCache();

    const val = queryCache.find({ queryKey: ["transaction", network, txHash] })
    if (val) {
      setHaveTxCache(true)
      return;
    }

    let unsub: (() => void) | undefined = undefined;
    unsub = queryCache.subscribe(({ query }) => {
      if (query.queryHash === JSON.stringify(["transaction", network, txHash])) {
        setHaveTxCache(true)
        unsub?.();
      }
      // if (query.queryKey[1] === network && query.queryKey[2] === transaction) {
      //   setHaveTxCache(true)
      //   unsub()
      // }
    })

    return () => {
      unsub?.();
    }

  }, [txHash, network, haveTxCache])

  if (txHash === "0x0000000000000000000000000000000000000000000000000000000000000000") return null;
  return (
    <div className="flex flex-col border w-100 rounded-md">
      <div className="flex flex-row border-b p-2 justify-between items-center">
        <span className="font-hash">{
          showTransacion
            ? <><Link to={`/transaction/${txHash}`}><HashText className="hover:text-primary" ellipsis="transaction">{txHash}</HashText></Link>:{index}</>
            : `#${index}`
        } </span>
        <CellSince value={since} />
      </div>

      <div className="flex-1 flex flex-col gap-2 p-2">
        {
          haveTxCache
            ? <CellDetail {...props} />
            : (
              <Button size="small" onClick={() => setHaveTxCache(true)}>Check</Button>
            )
        }
      </div>
    </div>
  )
}





function CellDetail(props: CellProps) {
  const { txHash, index } = props;
  const cellQuery = useCell(txHash, index);
  const [pannel, setPannel] = useState<"assets" | "source">("assets")

  return (
    <QuerySuspense query={cellQuery}>
      {(cellInfo) => (
        <>
          <div className="flex flex-row justify-between">
            <CKBAddress address={cellInfo.cellOutput.lock} />
            <RefreshCw className="cursor-pointer" size={16} onClick={() => setPannel(prev => prev === "assets" ? "source" : "assets")} />
          </div>
          {
            pannel === "assets" && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <span>CKB</span>
                  <span className="font-hash">{shannonToCkb(cellInfo.cellOutput.capacity.toString())}</span>
                </div>
                <CellAssets cellInfo={cellInfo} />
              </div>
            )
          }
          {
            pannel === "source" && (
              <>
                <CellContent cellInfo={cellInfo} />
                <div className="flex flex-row items-center justify-end"><CellCapacity cellInfo={cellInfo} /></div>
              </>
            )
          }
        </>
      )}
    </QuerySuspense>

  )
}


function CellCapacity({ cellInfo }: { cellInfo: CellAny }) {

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="font-hash cursor-pointer hover:underline">{shannonToCkb(cellInfo.cellOutput.capacity.toString())} CKB</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit grid grid-cols-[80px_auto] gap-y-2 text-sm p-2">
        <div className="w-16 flex-none text-gray-500">occupied</div>
        <div className="font-hash text-right">{cellInfo.occupiedSize} CKB</div>
        <div className="w-16 flex-none text-gray-500">free</div>
        <div className="font-hash text-right">{shannonToCkb(cellInfo.capacityFree.toString())} CKB</div>
      </HoverCardContent>
    </HoverCard>
  )
}


function CellContent({ cellInfo }: { cellInfo: CellAny }) {
  const [showTypeHash, setShowTypeHash] = useState(false);
  const typeScript = cellInfo.cellOutput.type;
  return (
    <div className="flex-1 bg-gray-500/5 font-hash p-2 rounded-sm">
      <div className="flex felx-row items-center gap-1">
        <div
          className={cn("text-[#999] w-fit", !!typeScript ? "cursor-pointer hover:text-primary" : "")}
          onClick={() => {
            if (!typeScript) return
            setShowTypeHash(flag => !flag)
          }}
        >type{showTypeHash ? " hash" : ""}
        </div>
        {typeScript && <ScriptTag category="type" script={typeScript} />}
      </div>

      {/* <div className="pl-4">{JSON.stringify(cellInfo.cellOutput.type || null)}</div> */}
      <div className="pl-4">
        {
          !!typeScript ?
            showTypeHash
              ? <><HashText copyable>{typeScript.hash()}</HashText></>
              : (
                <>
                  <div className="flex flex-row items-start">
                    <div className="flex-none basis-[90px]">code hash:</div>
                    <div className="flex-1 font-hash">
                      <HashText ellipsis={{ head: 6, tail: -6 }} copyable>{typeScript.codeHash}</HashText>
                    </div>
                  </div>
                  <div className="flex flex-row items-start">
                    <div className="flex-none basis-[90px]">hash type:</div>
                    <div className="flex-1 font-hash">
                      <HashText copyable>{typeScript.hashType}</HashText>
                    </div>
                  </div>
                  <div className="flex flex-row items-start">
                    <div className="flex-none basis-[90px]">args: </div>
                    <div className="flex-1 font-hash">
                      <HashText copyable>{typeScript.args}</HashText>
                    </div>
                  </div>
                </>
              ) : "null"
        }
      </div>

      <div className="text-[#999]">data</div>
      <div className="pl-4">{cellInfo.outputData}</div>
    </div>
  )
}
