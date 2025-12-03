import { toBigEndian } from "@nervosnetwork/ckb-sdk-utils";
import {
  config,
  renderByTokenKey,
  svgToBase64,
  traitsParser,
  type DobDecodeResponse,
  type DobDecodeResult,
  type RenderOutput,
} from "@nervape/dob-render";
import { hexToUtf8 } from "./string";
import { hexToBase64 } from "./util";
import { memoize } from "lodash";
import type { Network } from "@/store/useNetwork";


export const setupDobConfig = (network: Network) => {
  const isMainnet = network === "mainnet";
  config.setDobDecodeServerURL(
    isMainnet
      ? "https://dob-decoder.rgbpp.io"
      : "https://dob0-decoder-dev.omiga.io",
  );

  config.setQueryBtcFsFn(async (uri: string) => {
    const url = isMainnet
      ? `https://api.omiga.io/api/v1/nfts/dob_imgs?uri=${uri}`
      : `https://test-api.omiga.io/api/v1/nfts/dob_imgs?uri=${uri}`;
    const response = await fetch(url);
    return response.json();
  });

};

setupDobConfig("testnet")


export async function dobDecode(tokenId: string): Promise<DobDecodeResponse> {
  const response = await fetch(config.dobDecodeServerURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 2,
      jsonrpc: '2.0',
      method: 'dob_decode',
      params: [tokenId],
    }),
  })
  return response.json()
}

// parse spore cluster data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
export function parseSporeClusterData(hexData: string) {
  const data = hexData.replace(/^0x/g, "");

  const nameOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2;
  const descriptionOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2;

  const name = hexToUtf8(`0x${data.slice(nameOffset + 8, descriptionOffset)}`);
  const description = hexToUtf8(`0x${data.slice(descriptionOffset + 8)}`);
  try {
    const parsed = JSON.parse(description);
    if (typeof parsed === "object") {
      const v: Record<string, string> = { name };
      Object.keys(parsed).forEach((key) => {
        if (key === "name") {
          throw new Error("name key is reserved");
        }
        v[key] = JSON.stringify(parsed[key], null, 2);
      });
      return v;
    }
  } catch {
    // ignore
  }
  return { name, description };
}

// parse spore cell data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
export function parseSporeCellData(hexData: string) {
  const data = hexData.replace(/^0x/g, "");

  const contentTypeOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2;
  const contentOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2;
  const clusterIdOffset = Number(toBigEndian(`0x${data.slice(24, 32)}`)) * 2;

  const contentType = hexToUtf8(
    `0x${data.slice(contentTypeOffset + 8, contentOffset)}`,
  );
  const content = data.slice(contentOffset + 8, clusterIdOffset);
  const clusterId = `0x${data.slice(clusterIdOffset + 8)}`;

  if (clusterId !== "0x") {
    return { contentType, content, clusterId };
  }

  return { contentType, content };
}


const base64ImgFromSporeId = memoize(async (sporeId: string) => {
  try {
    const renderRes = await renderByTokenKey(sporeId);
    const base64Img = await svgToBase64(renderRes);
    return base64Img;
  } catch (error) {
    base64ImgFromSporeId.cache.delete(sporeId)
    // console.error(error);
  }

  return "/images/image_failed.svg";
})

/*
 * data: cell data
 * id: cell.type_script.args
 */
export const getSporeImg = async ({
  data: hexData,
  id: sporeId,
}: {
  data: string;
  id: string;
}): Promise<string> => {
  const DEFAULT_URL = "/assets/spore_placeholder.svg";
  if (!hexData || hexData.length < 3) return DEFAULT_URL;
  // if (!hexData && !sporeId) {
  //   return DEFAULT_URL;
  // }

  const { contentType, content } = parseSporeCellData(hexData);
  if (contentType.startsWith("image")) {
    const base64Data = hexToBase64(content);
    return `data:${contentType};base64,${base64Data}`;
  }
  if (contentType === "application/json") {
    try {
      const raw: any = JSON.parse(hexToUtf8(`0x${content}`));
      if (raw?.resource?.type?.startsWith("image")) {
        return raw.resource?.url ?? DEFAULT_URL;
      }
    } catch {
      return DEFAULT_URL;
    }
  }
  if (contentType.startsWith("dob/")) {
    if (!sporeId) return DEFAULT_URL;
    const base64Img = await base64ImgFromSporeId(sporeId);
    return base64Img;
  }
  return DEFAULT_URL;
};

export const isDob0 = (item: {
  standard: string | null;
  cell: { data: string | null } | null;
}) => {
  if (item.standard !== "spore") return false;
  if (!item.cell?.data) return false;
  try {
    const parsed = parseSporeCellData(item.cell.data);
    return parsed.contentType === "dob/0";
  } catch {
    // ignore
  }
  return false;
};

export async function getDob0Traits(tokenId: string) {
  const dobDecodeResponse = await dobDecode(tokenId)
  const dob0Data: Omit<DobDecodeResult, "render_output"> & { render_output: RenderOutput[] } = JSON.parse(dobDecodeResponse.result);
  if (typeof dob0Data.render_output === "string") {
    dob0Data.render_output = JSON.parse(
      dob0Data.render_output as string
    );
  }
  const { traits } = traitsParser(dob0Data.render_output);
  return traits
}