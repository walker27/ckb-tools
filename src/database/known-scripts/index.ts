import { useNetwork } from "@/store/useNetwork";
import originKnownScriptInfoList from "./scriptList";
import type { KnownScriptInfo, KnownScriptInfoWithSpecifyDeployment } from "./tool";



const knownScriptInfoList = originKnownScriptInfoList;
// .filter(item => {
//   return item.deployments.length > 0;
// });

// export function get(): Promise<KnownScriptInfo[]>
export function get(codeHash: string): Promise<KnownScriptInfoWithSpecifyDeployment> | Promise<undefined>
export function get(codeHash: string) {
  // if (!codeHash) {
  //   return Promise.resolve(knownScriptInfoList);
  // }
  const network = useNetwork.getState().network;
  for (const scriptInfo of knownScriptInfoList) {
    for (const deployment of scriptInfo.deployments[network]) {
      if (deployment.codeHash.toLowerCase() === codeHash.toLowerCase()) {
        const extName = [deployment.tag, deployment.deprecated ? "deprecated" : ""].filter(s => s).join(" - ");
        return Promise.resolve({
          ...scriptInfo,
          ...deployment,
          nameWithTag: `${scriptInfo.name}${extName ? ` (${extName})` : ""}`
        } as KnownScriptInfoWithSpecifyDeployment);
      }
    }
  }
  return Promise.resolve(undefined);
  // return knownScriptInfoList.find((scriptInfo) => scriptInfo.codeHash === codeHash);
}

export function byCellType(cellType: NonNullable<KnownScriptInfo['cellTypeTag']>) {
  return knownScriptInfoList.filter((scriptInfo) => scriptInfo.cellTypeTag === cellType);
}