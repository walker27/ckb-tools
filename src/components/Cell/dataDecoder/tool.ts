import clientDB from "@/database";
import type { KnownScriptInfo } from "@/database/known-scripts/tool";
import type { ccc } from "@ckb-ccc/core";



export function getCodeHashListFromCellType(cellType: NonNullable<KnownScriptInfo['cellTypeTag']>) {
  const codeHashListWithNetwork: Record<"testnet" | "mainnet", string[]> = {
    testnet: [],
    mainnet: [],
  }
  return clientDB.knownScript.byCellType(cellType)
    .reduce((hash, script) => {

      script.deployments.testnet.map(deployment => {
        hash.testnet.push(deployment.codeHash)
      })

      script.deployments.mainnet.map(deployment => {
        hash.mainnet.push(deployment.codeHash)
      })

      return hash;
    }, codeHashListWithNetwork);
}

export const littleEndianToBigEndian = (v: string, keepHexPrefix = true) => {
  let source = v;
  if(source.startsWith("0x")) {
    source = source.slice(2);
  }
  const bytes = v.match(/\w{2}/g);
  if (!bytes) return "";
  const be = bytes.reverse().join("");
  if (Number.isNaN(+`0x${be}`)) {
    throw new Error("Invalid little-endian");
  }
  return keepHexPrefix ? `0x${be}` : be;
};


export type DPUMatchParams = {
  typeScript?: ccc.Script
  typeHash?: string
}

export class DataParseUnit<DPUType extends string = string, ParsedContent extends Record<string, any> = Record<string, any>> {
  public type: DPUType
  public match: (params: DPUMatchParams) => boolean
  public parse: (v: string, params: DPUMatchParams) => ParsedContent
  constructor(
    type: DPUType,
    match: (params: DPUMatchParams) => boolean,
    parse: (v: string, params: DPUMatchParams) => ParsedContent
  ) {
    this.type = type;
    this.match = match;
    this.parse = parse;
  }
}