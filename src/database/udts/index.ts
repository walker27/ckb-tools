import mainnetUDTList from "./udts.mainnet";
import testnetUDTList from "./udts.testnet";
import type { UDT } from "./tool";
import { Script, type ScriptLike } from "@ckb-ccc/core";
import { useNetwork } from "@/store/useNetwork";

export function get(): Promise<UDT[]>;
export function get(udtType: string | ScriptLike): Promise<UDT | undefined>;
export function get(udtType?: string | ScriptLike) {
  const network = useNetwork.getState().network;
  const registeredUDTList = network === "mainnet" ? mainnetUDTList : testnetUDTList
  
  if (!udtType) {
    return Promise.resolve(registeredUDTList);
  }
  if (typeof udtType === "string") {
    const result = registeredUDTList.find((udt) => udt.typeHash.toLowerCase() === udtType.toLowerCase());
    return Promise.resolve(result);
  }
  const udtTypeHash = Script.from(udtType).hash();
  const result = registeredUDTList.find((udt) => udt.typeHash === udtTypeHash);
  return Promise.resolve(result);
}

export function filterByNameOrSymbol(nameOrSymbol: string) {
  const network = useNetwork.getState().network;
  const registeredUDTList = network === "mainnet" ? mainnetUDTList : testnetUDTList
  const lowerNameOrSymbol = nameOrSymbol.toLowerCase();
  const results = registeredUDTList.filter((udt) => udt.name.toLowerCase().includes(lowerNameOrSymbol) || udt.symbol.toLowerCase().includes(lowerNameOrSymbol));
  return Promise.resolve(results);
}