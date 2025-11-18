import type { CellAny } from "@ckb-ccc/ccc";
import parseData from "./dataDecoder";
import type { DataParseUnit } from "./dataDecoder/tool";
import type { typeIdDataParseUnit } from "./dataDecoder/dpu.typeId";
import HashText from "../HashText";
import type { sporeClusterDataParseUnit } from "./dataDecoder/dpu.sporeCluster";
import type { PropsWithChildren, ReactNode } from "react";


type ParsedData<T> = T extends DataParseUnit ? ReturnType<T["parse"]> : never


export default function CellAssets({ cellInfo }: { cellInfo: CellAny }) {
  const parsedData = parseData({ typeScript: cellInfo.cellOutput.type }, cellInfo.outputData)

  if (!parsedData) return null;

  switch (parsedData.type) {
    case "typeId":
      return <DeployScriptInfo data={parsedData.content} />;
    case "spore-cluster":
      return <DepolySporeCluster clusterId={cellInfo.cellOutput.type?.args} data={parsedData.content} />;
    default:
      return (
        <div>
          {JSON.stringify(parsedData)}
        </div>
      );
  }
}


function DeployScriptInfo({ data }: { data: ParsedData<typeof typeIdDataParseUnit> }) {
  return (
    <div className="border border-[#ccc] p-2">
      <div>Deploy Script</div>
      {data.name && (
        <div>
          <div>name</div>
          <div>{data.name}</div>
        </div>
      )}
      {data.typeHash && (
        <div>
          <div>typeHash</div>
          <HashText copyable>{data.typeHash}</HashText>
        </div>
      )}
      <div>
        <div>dataHash</div>
        <HashText copyable>{data.dataHash}</HashText>
      </div>
    </div>
  )
}

function DepolySporeCluster({ clusterId, data }: { clusterId?: string, data: ParsedData<typeof sporeClusterDataParseUnit> }) {
  return (
    <div className="border border-[#ccc] p-2">
      <div>Deploy Spore Cluster</div>
      <Field label="Cluster ID">
        <HashText copyable>{clusterId}</HashText>
      </Field>
      {"code" in data ?
        <>
          {JSON.stringify(data)}
        </>
        : (
          <>
            <Field label="Name">
              {data.name}
            </Field>
            <Field label="Mutant ID" show={!!data.mutantId}>
              <HashText copyable>{data.mutantId}</HashText>
            </Field>
            <Field label="Description">
              {typeof data.description === "string" && data.description}
              {typeof data.description !== "string" && (
                <pre>
                  {JSON.stringify(data.description, null, 2)}
                </pre>
              )}
            </Field>
          </>
        )
      }
    </div>
  )
}

function Field({ label, children, show = true }: PropsWithChildren<{ show?: boolean, label: ReactNode }>) {
  if(!show) return null;
  return (
    <div>
      <div>{label}</div>
      <div className="pl-2">{children}</div>
    </div>
  )
}