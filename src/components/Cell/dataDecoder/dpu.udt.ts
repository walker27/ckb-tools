import BigNumber from "bignumber.js";
import { DataParseUnit, getCodeHashListFromCellType, littleEndianToBigEndian } from "./tool";
import { useNetwork } from "@/store/useNetwork";



const codeHashListMap = getCodeHashListFromCellType("udt")

export const udtDataParseUnit = new DataParseUnit(
  "udt",
  ({ typeScript }) => {
    const network = useNetwork.getState().network
    const codeHashList = codeHashListMap[network]
    if (typeScript?.codeHash && codeHashList.includes(typeScript.codeHash)) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    const amountHex = dataStr.slice(0, 32);
    const unknownDataHex = dataStr.slice(32);
    const parsedData = {
      amount: new BigNumber(littleEndianToBigEndian(amountHex)).toFormat({ groupSeparator: "" }),
      ...(!!unknownDataHex && { unknownData: unknownDataHex })
    };
    // if(unknownDataHex) {
    //   parsedData.unknownData = unknownDataHex;
    // }
    return parsedData;
  }
)