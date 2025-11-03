import { ccc, mol } from "@ckb-ccc/core";




const metricValCodec = mol.struct({
  L: mol.uintNumber(2, false),
  I: mol.uintNumber(2, false),
  E: mol.uintNumber(3, false),
})

type ParseSinceReturnType = null
  | { relative: ccc.Since['relative'], metric: "blockNumber", value: string }
  | { relative: ccc.Since['relative'], metric: "epoch", value: string }
  | { relative: ccc.Since['relative'], metric: "timestamp", value: string }
export function parseSince (value: ccc.SinceLike): ParseSinceReturnType {
  try {
    const sinceObj = ccc.Since.from(value);
    if(sinceObj.metric === "blockNumber") {
      return {
        relative: sinceObj.relative,
        metric: sinceObj.metric,
        value: sinceObj.value.toString(),
      }
    }
    if(sinceObj.metric === "epoch") {
      const { E, I, L } = metricValCodec.decode(sinceObj.value.toString(16));
      console.log({
        E, I, L,
        value: L ? `${(E + (I + 1) / L).toFixed(2)}` : `${E}`,
        originVal: sinceObj.value,
        hex: sinceObj.value.toString(16),
      })
      return {
        relative: sinceObj.relative,
        metric: sinceObj.metric,
        value: L ? `${(E + (I + 1) / L).toFixed(2)}` : `${E}`,
      };
    }
    if(sinceObj.metric === "timestamp") {
      return {
        relative: sinceObj.relative,
        metric: sinceObj.metric,
        value: sinceObj.value.toString(),
      };
    }
    return null;
  } catch (e) {
    console.error("parse since error:", e);
    return null;
  }
}