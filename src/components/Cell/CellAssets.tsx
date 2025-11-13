import type { CellAny } from "@ckb-ccc/ccc";
import parseData from "./dataDecoder";
import type { DataParseUnit } from "./dataDecoder/tool";
import type { typeIdDataParseUnit } from "./dataDecoder/dpu.typeId";
import HashText from "../HashText";


type ParsedData<T> = T extends DataParseUnit ? ReturnType<T["parse"]> : never


export default function CellAssets({ cellInfo }: { cellInfo: CellAny }) {
  const parsedData = parseData({ typeScript: cellInfo.cellOutput.type }, cellInfo.outputData)

  if(!parsedData) return null;

  switch(parsedData.type) {
    case "typeId":
      return <DeployScriptInfo data={parsedData.content} />;
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