import type { CellAny, Script } from "@ckb-ccc/ccc";
import parseData from "./dataDecoder";
import type { DataParseUnit } from "./dataDecoder/tool";
import type { typeIdDataParseUnit } from "./dataDecoder/dpu.typeId";
import HashText from "../HashText";
import type { sporeClusterDataParseUnit } from "./dataDecoder/dpu.sporeCluster";
import type { PropsWithChildren, ReactNode } from "react";
import ScriptTag from "../ScriptTag";
import type { udtDataParseUnit } from "./dataDecoder/dpu.udt";
import clientDB from "@/database";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import type { daoDataParseUnit } from "./dataDecoder/dpu.dao";
import type { sporeDataParseUnit } from "./dataDecoder/dpu.spore";
import useDOBRender from "@/hooks/useDOBRender";
import type { ckbfsDataParseUnit } from "./dataDecoder/dpu.ckbfs";
import { useNetwork } from "@/store/useNetwork";
import { Download, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "antd";
import download from "@/utils/download";


type ParsedData<T> = T extends DataParseUnit ? ReturnType<T["parse"]> : never


export default function CellAssets({ cellInfo }: { cellInfo: CellAny }) {
  const parsedData = parseData({ typeScript: cellInfo.cellOutput.type }, cellInfo.outputData)

  if (!parsedData) return null;

  switch (parsedData.type) {
    case "typeId":
      return <CellDeployment data={parsedData.content} />;
    case "spore-cluster":
      return <CellSporeCluster type={cellInfo.cellOutput.type!} data={parsedData.content} />;
    case "udt":
      return <CellUDT type={cellInfo.cellOutput.type!} data={parsedData.content} />;
    case "dao":
      return <CellDAO type={cellInfo.cellOutput.type!} data={parsedData.content} />
    case "spore":
      return <CellSpore type={cellInfo.cellOutput.type!} data={parsedData.content} />
    case "ckbfs":
      return <CellCKBFs type={cellInfo.cellOutput.type!} data={parsedData.content} />;
    default:
      return (
        <div className="overflow-auto">
          {JSON.stringify(parsedData)}
        </div>
      );
  }
}


function CellDeployment({ data }: { data: ParsedData<typeof typeIdDataParseUnit> }) {
  return (
    <div className="border border-[#ccc] p-2">
      <div className="flex flex-row items-center gap-2">
        <span>Deployment</span>
        <ScriptTag category="type" script={{ codeHash: data.dataHash }} />
        <ScriptTag category="type" script={{ codeHash: data.typeHash }} />
      </div>
      {data.name && (
        <div className="pl-2">
          <div>name</div>
          <div>{data.name}</div>
        </div>
      )}
      {data.typeHash && (
        <div className="pl-2">
          <div>typeHash</div>
          <HashText className="pl-2" copyable>{data.typeHash}</HashText>
        </div>
      )}
      <div className="pl-2">
        <div>dataHash</div>
        <HashText className="pl-2" copyable>{data.dataHash}</HashText>
      </div>
    </div>
  )
}

function CellSporeCluster({ type, data }: { type: Script, data: ParsedData<typeof sporeClusterDataParseUnit> }) {
  const clusterId = type.args;
  return (
    <div className="overflow-auto">
      <ScriptTag category="type" script={type} />
      <div className="pl-4">
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
              {/* <Field label="Description">
                {typeof data.description === "string" && data.description}
                {typeof data.description !== "string" && (
                  <div>
                    {data.description.description}
                  </div>
                  // <pre>
                  //   {JSON.stringify(data.description, null, 2)}
                  // </pre>
                )}
              </Field> */}
            </>
          )
        }
      </div>

    </div>
  )
}

function CellUDT({ type, data }: { type: Script, data: ParsedData<typeof udtDataParseUnit> }) {
  const typeHash = type.hash();
  const { data: udtInfo } = useQuery({
    queryKey: ["udt-info", typeHash],
    queryFn: async () => {
      const udt = await clientDB.udt.get(typeHash)
      return udt;
    },
  });
  return (
    <div className="flex flex-row items-center justify-end gap-2">
      <span>{!!udtInfo?.decimalPlaces ? new BigNumber(data.amount).div(10 ** udtInfo.decimalPlaces).toString() : data.amount}</span>
      <div>
        {udtInfo?.symbol || `UDT (#${typeHash.slice(-4)})`}
      </div>
    </div>
  )
}

function CellDAO({ type, data }: { type: Script, data: ParsedData<typeof daoDataParseUnit> }) {

  return (
    <div>
      <ScriptTag category="type" script={type} />
      {data.blockNumber ? "DAO Withdraw" : "DAO Deposit"}
      {
        data.blockNumber && (
          <div className="pl-2 flex flex-row items-center gap-2">
            <span>Block Height: </span>
            <span>{(+data.blockNumber).toLocaleString()}</span>
          </div>
        )
      }
    </div>
  )
}


function CellSpore({ type, data }: { type: Script, data: ParsedData<typeof sporeDataParseUnit> }) {
  const tokenId = type.args;
  const { data: imgSourceData } = useDOBRender({ type: "dob", data: data.content, id: tokenId });
  return (
    <>
      <ScriptTag category="type" script={type} />
      <div className="flex flex-row items-center gap-2">
        <div className="size-12 rounded-sm bg-[#eee]">
          {imgSourceData ? <img className="w-full h-full object-scale-down rounded-sm" src={imgSourceData} alt="" /> : null}
        </div>
        <div>
          <div>{data.clusterId ? `Cluster (${data.clusterId.slice(-8)})` : "Unit Item"}</div>
          <div>ID: <HashText ellipsis={{ head: 6, tail: -8 }}>{tokenId}</HashText></div>
        </div>
      </div>
    </>
  )
}


type CKBFSAPIReturnType = {
  success: false,
  error: {
    code: string,
    message: string;
  }
} | {
  success: true,
  data: {
    filename: string,
    // mime type
    contentType: string;
    content: string;
  }
}

function CellCKBFs({ type, data }: { type: Script, data: ParsedData<typeof ckbfsDataParseUnit> }) {
  const { network } = useNetwork();
  const apiUrl = network === "mainnet"
    ? "https://ckbfs.nvap.app/api/v1/ckbfs?uri="
    : "https://test-ckbfs.nvap.app/api/v1/ckbfs?uri=";
  const fileTypeId = type.args;
  const { data: file } = useQuery({
    queryKey: ["ckbfs-file", apiUrl, fileTypeId],
    queryFn: async () => {
      const res: CKBFSAPIReturnType = await fetch(`${apiUrl}${fileTypeId}`).then(res => res.json());
      if (res?.success) {
        const fileInfo = res.data;
        return fileInfo;
      }
      return null;
    },
  })

  const donwloadFile = async () => {
    // const file = await fetch(`https://ckbfs.nvap.app/api/v1/ckbfs?uri=ckbfs://d5f601669b560496a9b737d8023c00f25957cbe9e0803f1804fa5a27d023d5a5`)
    //   .then(res => res.json())
    //   .then((resData: CKBFSAPIReturnType & { success: true }) => resData.data)
    if (!file) return;
    const { filename, contentType, content } = file;
    download(filename, content, contentType);
  }

  return (
    <div className="flex flex-row items-center gap-2 border self-start p-2">
      <div className="flex rounded-sm items-center justify-center">
        <File />
      </div>
      <div>{data?.filename}</div>
      <Tooltip title={!file?.content ? "file not found" : ""}>
        <div
          onClick={donwloadFile}
          className={cn(file?.content ? "cursor-pointer" : "cursor-not-allowed")}
        >
          <Download />
        </div>
      </Tooltip>

    </div>
  )
}

function Field({ label, children, show = true }: PropsWithChildren<{ show?: boolean, label: ReactNode }>) {
  if (!show) return null;
  return (
    <div>
      <div>{label}</div>
      <div className="pl-2">{children}</div>
    </div>
  )
}