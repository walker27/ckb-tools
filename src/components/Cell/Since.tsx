import type { ccc } from "@ckb-ccc/ccc";
import { parseSince } from "./tool.since";
import { Clock4 } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";




export default function CellSince({ value }: { value?: ccc.SinceLike }) {
  if (!value) return null;
  const sinceInfo = parseSince(value);
  if (!sinceInfo) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Clock4 size={16} />
      </HoverCardTrigger>
      <HoverCardContent className="w-fit grid grid-cols-[80px_auto] gap-y-2 text-sm p-2">
        <div>Since</div>
        <div></div>
        <div className="w-16 flex-none text-gray-500">relative</div>
        <div className="font-hash text-right">{sinceInfo.relative}</div>
        <div className="w-16 flex-none text-gray-500">metric</div>
        <div className="font-hash text-right">{sinceInfo.metric}</div>
        <div className="w-16 flex-none text-gray-500">value</div>
        <div className="font-hash text-right">{sinceInfo.value}</div>
      </HoverCardContent>
    </HoverCard>

  )
}