import type { Network } from "@/store/useNetwork";



export type KnownScriptInfo = {
  name: string;
  description: string;
  rfc: string | undefined;
  website: string | undefined;
  sourceUrl: string | undefined;
  verified: boolean;
  /** for cell parser */
  cellTypeTag?: "udt" | "spore" | "spore-cluster" | "dao" | "ckbfs"
  /** place the latest deployment to the top */
  deployments: Record<Network, KnownScriptDepolyment[]>
}

export type KnownScriptDepolyment = {
  tag: string;
  hashType: "type" | "data" | "data1" | "data2";
  dataHash: string;
  typeHash: string;
  codeHash: string;
  deprecated?: boolean;
}


export type KnownScriptInfoWithSpecifyDeployment = KnownScriptInfo & KnownScriptDepolyment & {
  nameWithTag: string;
};