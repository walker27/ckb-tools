import BigNumber from "bignumber.js";
import { DataParseUnit, getCodeHashListFromCellType, littleEndianToBigEndian } from "./tool";
import { useNetwork } from "@/store/useNetwork";


const codeHashListMap = getCodeHashListFromCellType("dao")


export const daoDataParseUnit = new DataParseUnit(
  "dao",
  ({ typeScript }) => {
    const network = useNetwork.getState().network
    const codeHashList = codeHashListMap[network]
    if ((typeScript?.codeHash && codeHashList.includes(typeScript.codeHash))) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    const blockHex = dataStr.slice(0, 16);
    // const unknownDataHex = dataStr.slice(16);
    const blockNumber = new BigNumber(littleEndianToBigEndian(blockHex)).toFormat({ groupSeparator: "" });
    if(!blockNumber || blockNumber === '0') return {};
    return {
      blockNumber: blockNumber,
    };
  }
)