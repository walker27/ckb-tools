import { networkOptions, useNetwork } from "@/store/useNetwork"
import { Select } from "antd"


export default function NetworkSwtich() {
  const { network, setNetwork } = useNetwork();
  return (
    <Select
      value={network}
      options={networkOptions}
      onChange={setNetwork}
    />
  )
}