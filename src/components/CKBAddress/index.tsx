// import { CalendarIcon } from "lucide-react"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useNetwork } from "@/store/useNetwork"
import type { ScriptLike } from "@ckb-ccc/ccc"
import { useQuery } from "@tanstack/react-query"
import { addressFromScript, getAddressScript } from "./tool"
import HashText from "../HashText"

type CKBAddressProps = {
  address?: string | ScriptLike

}

/**
 * address | script => script => Address
 */
export default function CKBAddress(props: CKBAddressProps) {
  const { address: propsAddress } = props;
  const { network } = useNetwork();
  const { data: addressInfo, status } = useQuery({
    queryKey: ["address", network, propsAddress],
    queryFn: async () => {
      const script = await getAddressScript(propsAddress);
      if (!script) return undefined;
      const address = addressFromScript(script, network);
      return {
        script,
        scriptHash: script.hash(),
        address: address.toString()
      };
    },
    enabled: !!propsAddress,
  })
  if (!propsAddress || status === "pending") return null;
  if (!addressInfo) return <span>Invalid Address</span>;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <HashText className="cursor-pointer hover:underline" ellipsis="address">{addressInfo.address}</HashText>
      </HoverCardTrigger>
      <HoverCardContent className="w-120 text-sm">
        <div className="flex flex-col items-start mb-2">
          <div>Address</div>
          <div><HashText copyable>{addressInfo.address}</HashText></div>
        </div>
        <div className="p-2 bg-accent rounded-md">
          <div>
            <div className="text-[#aaa]">Script</div>
            <div className="pl-2">
              <div className="flex flex-row items-start">
                <div className="flex-none basis-[90px]">code hash:</div>
                <div className="flex-1 font-menlo">
                  <HashText copyable>{addressInfo.script.codeHash}</HashText>
                </div>
              </div>
              <div className="flex flex-row items-start">
                <div className="flex-none basis-[90px]">hash type:</div>
                <div className="flex-1 font-menlo">
                  <HashText copyable>{addressInfo.script.hashType}</HashText>
                </div>
              </div>
              <div className="flex flex-row items-start">
                <div className="flex-none basis-[90px]">args: </div>
                <div className="flex-1 font-menlo">
                  <HashText copyable>{addressInfo.script.args}</HashText>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#aaa]">Script Hash</div>
            <div className="font-menlo">
              <HashText copyable>{addressInfo.scriptHash}</HashText>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

