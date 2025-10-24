import type { DefaultOptionType } from "antd/es/select";
import { create } from "zustand";
import { ccc } from '@ckb-ccc/core'


const networkMap = {
  // https://testnet.ckb.dev,https://testnet.ckbapp.dev
  testnet: "https://testnet.ckb.dev",
  // https://mainnet.ckb.dev,https://mainnet.ckbapp.dev
  mainnet: "https://mainnet.ckb.dev",
} as const

export type Network = keyof typeof networkMap


const networkOptions: DefaultOptionType[] = Object.entries(networkMap)
  .map(([key, value]) => ({
    label: `${key} ( ${value} )`,
    value: key,
  }))

type UseNodeServiceStore = {
  network: Network
  networkService: ccc.ClientPublicMainnet | ccc.ClientPublicTestnet
  setNetwork: (network: Network) => void
}


const useNetwork = create<UseNodeServiceStore>((set, get) => {
  return {
    network: "testnet",
    networkService: new ccc.ClientPublicTestnet({ url: networkMap.testnet }),
    setNetwork: (network: Network) => {
      const networkService = new (network === 'mainnet' ? ccc.ClientPublicMainnet : ccc.ClientPublicTestnet)({
        url: networkMap[network],
      })
      set({ network, networkService })
    },
  };
});


export { useNetwork, networkOptions };