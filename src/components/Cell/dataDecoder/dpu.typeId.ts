
import { HasherCkb } from "@ckb-ccc/ccc"
import { DataParseUnit } from "./tool";




export const typeIdDataParseUnit = new DataParseUnit(
  "typeId",
  ({ typeScript }) => {
    if ((typeScript?.codeHash === "0x00000000000000000000000000000000000000000000000000545950455f4944")) {
      return true;
    }
    return false;
  },
  (dataStr, { typeScript }) => {
    const hasher = new HasherCkb();
    hasher.update(dataStr)
    const hash = hasher.digest();
    return {
      name: undefined,
      typeHash: typeScript?.hash(),
      dataHash: hash
    }
  }
)