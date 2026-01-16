import { networkMap, networkOptions, useNetwork, type Network } from "@/store/useNetwork"
import { Select } from "antd"
import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

const networkTypes = Object.keys(networkMap) as Network[];
export default function NetworkSwitch() {
  const { network, setNetwork } = useNetwork();
  const { network: propsNetwork } = useParams();
  useEffect(() => {
    if (propsNetwork && networkTypes.some(item => item === propsNetwork)) {
      setNetwork(propsNetwork as Network);
    }
  }, [propsNetwork])

  useEffect(() => {
    if (!propsNetwork) return;
    if (!networkTypes.some(item => item === propsNetwork)) {
      // amend url
      const pathpairs = window.location.pathname.split("/");
      pathpairs[1] = 'testnet';
      const nextPath = pathpairs.join("/");
      window.history.replaceState(null, "", nextPath);
      return;
    }
    if (network !== propsNetwork) {
      setNetwork(propsNetwork as Network);
    }
  }, [network, propsNetwork])

  const onChange = (value: Network) => {
    // setNetwork(value);
    if (propsNetwork) {
      // amend url
      const pathpairs = window.location.pathname.split("/");
      pathpairs[1] = value;
      const nextPath = pathpairs.join("/");
      window.history.replaceState(null, "", nextPath);
      window.location.reload();
      // setNetwork(value);
    } else {
      setNetwork(value);
    }
  }

  return (
    <Select
      value={network}
      options={networkOptions}
      onChange={onChange}
    />
  )
}