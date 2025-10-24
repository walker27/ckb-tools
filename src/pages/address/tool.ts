import { ccc, ClientPublicTestnet, ClientPublicMainnet, type ScriptLike, Address } from "@ckb-ccc/ccc"


type QueryTypeA = { address: string }

const MAINNET_PREFIX = "ckb"
const TESTNET_PREFIX = "ckt"
const ErrorReturn = {
  message: "Invalid address query params",
}

const mainnetClient = new ClientPublicMainnet()
const testnetClient = new ClientPublicTestnet()

export async function parseAddress(opt: { address: string } | ScriptLike) {
  let coreScript: ccc.Script | undefined
  if ((opt as QueryTypeA).address) {
    const addressStr = (opt as QueryTypeA).address
    let client: ClientPublicTestnet | ClientPublicMainnet | undefined
    if (addressStr.startsWith(MAINNET_PREFIX)) {
      client = mainnetClient
    } else if (addressStr.startsWith(TESTNET_PREFIX)) {
      client = testnetClient
    }
    if (!client) return ErrorReturn;
    try {
      const tempAddress = await ccc.Address.fromString(addressStr, client);
      coreScript = tempAddress.script;
    } catch (error) {
      console.log(error);
      return { message: error?.message || ErrorReturn.message };
    }
  }

  if ((opt as ScriptLike).codeHash) {
    try {
      const tempAddress = ccc.Address.fromScript(opt as ScriptLike, testnetClient)
      coreScript = tempAddress.script;
    } catch (error) {
      console.log(error);
      return { message: error?.message || ErrorReturn.message };
    }
  }

  if (!coreScript) return ErrorReturn;
  const mainnetAddr = ccc.Address.fromScript(coreScript, mainnetClient);
  const testnetAddr = ccc.Address.fromScript(coreScript, testnetClient);
  return {
    script: coreScript,
    addressHash: coreScript.hash(),
    mainnet: {
      address: mainnetAddr.toString(),
    },
    testnet: {
      address: testnetAddr.toString(),
    },
  }
}