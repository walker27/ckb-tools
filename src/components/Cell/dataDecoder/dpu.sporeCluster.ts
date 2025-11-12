import { useNetwork } from "@/store/useNetwork";
import { DataParseUnit, getCodeHashListFromCellType } from "./tool";
import { toBigEndian } from "@nervosnetwork/ckb-sdk-utils";
import { hexToUtf8 } from "@/utils/string";
// import { parseSporeClusterData } from "@/utils/spore";

const codeHashListMap = getCodeHashListFromCellType("spore-cluster")



export const sporeClusterDataParseUnit = new DataParseUnit(
  "spore-cluster",
  ({ typeScript }) => {
    const network = useNetwork.getState().network
    const codeHashList = codeHashListMap[network]
    if (typeScript?.codeHash && codeHashList.includes(typeScript.codeHash)
    ) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    return parseSporeClusterData(dataStr);
  }
)


// parse spore cluster data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
function parseSporeClusterData(hexData: string) {
  const data = hexData.replace(/^0x/g, "");

  const nameOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2;
  const descriptionOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2;

  const name = hexToUtf8(`0x${data.slice(nameOffset + 8, descriptionOffset)}`);
  const description = hexToUtf8(`0x${data.slice(descriptionOffset + 8)}`);
  try {
    const parsed = JSON.parse(description);
    if (typeof parsed === "object") {
      const v: Record<string, string> = { name };
      Object.keys(parsed).forEach((key) => {
        if (key === "name") {
          throw new Error("name key is reserved");
        }
        v[key] = JSON.stringify(parsed[key], null, 2);
      });
      return v;
    }
  } catch {
    // ignore
  }
  return { name, description };
}