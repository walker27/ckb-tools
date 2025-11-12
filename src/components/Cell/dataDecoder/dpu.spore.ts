import { useNetwork } from "@/store/useNetwork";
import { DataParseUnit, getCodeHashListFromCellType } from "./tool";
// import { parseSporeCellData } from "@/utils/spore";
import { toBigEndian } from "@nervosnetwork/ckb-sdk-utils";
import { hexToUtf8 } from "@/utils/string";


const codeHashListMap = getCodeHashListFromCellType("spore")



export const sporeDataParseUnit = new DataParseUnit(
  "spore",
  ({ typeScript }) => {
    const network = useNetwork.getState().network
    const codeHashList = codeHashListMap[network]
    if (typeScript?.codeHash && codeHashList.includes(typeScript.codeHash)) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    return parseSporeCellData(dataStr);
  }
)


// parse spore cell data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
function parseSporeCellData(hexData: string) {
  const data = hexData.replace(/^0x/g, "");

  const contentTypeOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2;
  const contentOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2;
  const clusterIdOffset = Number(toBigEndian(`0x${data.slice(24, 32)}`)) * 2;

  const contentType = hexToUtf8(
    `0x${data.slice(contentTypeOffset + 8, contentOffset)}`,
  );
  const content = data.slice(contentOffset + 8, clusterIdOffset);
  const clusterId = `0x${data.slice(clusterIdOffset + 8)}`;

  if (clusterId !== "0x") {
    return { contentType, content, clusterId };
  }

  return { contentType, content };
}