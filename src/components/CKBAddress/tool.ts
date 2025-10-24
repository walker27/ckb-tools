import type { Network } from "@/store/useNetwork";
import { ClientPublicMainnet, ClientPublicTestnet, type ScriptLike } from "@ckb-ccc/ccc";
import { ccc } from "@ckb-ccc/core";


const MAINNET_PREFIX = "ckb"
const TESTNET_PREFIX = "ckt"

const mainnetClient = new ClientPublicMainnet()
const testnetClient = new ClientPublicTestnet()

export async function getAddressScript(address: string | ScriptLike) {
  if (typeof address === 'string') {
    let client: ClientPublicTestnet | ClientPublicMainnet | undefined
    if (address.startsWith(MAINNET_PREFIX)) {
      client = mainnetClient
    } else if (address.startsWith(TESTNET_PREFIX)) {
      client = testnetClient
    }
    if (!client) return undefined;
    try {
      const tempAddress = await ccc.Address.fromString(address, client);
      return tempAddress.script;

    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  return ccc.Script.from(address);
}

export function addressFromScript(script: ScriptLike, network: Network) {
  return ccc.Address.fromScript(script, network === 'mainnet' ? mainnetClient : testnetClient);
}