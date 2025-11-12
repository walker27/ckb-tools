import { hexToBytes } from "@nervosnetwork/ckb-sdk-utils";

export const hexToUtf8 = (value: string = "") => {
  try {
    return new TextDecoder().decode(hexToBytes(value));
  } catch (error) {
    return value;
  }
};