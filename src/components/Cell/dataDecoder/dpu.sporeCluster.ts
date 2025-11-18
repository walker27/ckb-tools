import { useNetwork } from "@/store/useNetwork";
import { DataParseUnit, getCodeHashListFromCellType } from "./tool";
import { hexToUtf8 } from "@/utils/string";
import { mol } from "@ckb-ccc/core";
// import { parseSporeClusterData } from "@/utils/spore";

const codeHashListMap = getCodeHashListFromCellType("spore-cluster")

// pattern arr type: [ "name", "type", "offset", "len", "pattern", "args" ]

// parse spore cluster data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
const sporeClusterParser = mol.table({
  name: mol.Bytes,
  description: mol.Bytes,
  mutantId: mol.BytesOpt
})

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
    try {
      const parsed = sporeClusterParser.decode(dataStr)
      const obj = {
        name: hexToUtf8(parsed.name),
        mutantId: parsed.mutantId,
        description: JSON.parse(hexToUtf8(parsed.description)) as string | Record<string, any>,
      }
      return obj;
    } catch (e) {
      console.error(e);
      return {
        code: "parse error",
        message: (e?.message ?? "unknown error") as string,
      }
    }
  }
)

