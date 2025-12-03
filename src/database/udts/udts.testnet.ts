import { registerUDT } from "./tool";

const testnetUDTList = [
  registerUDT({
    name: 'USDI',
    icon: '/assets/udt/USDI.svg',
    symbol: 'USDI',
    decimalPlaces: 6,
    type: {
      codeHash: "0xcc9dc33ef234e14bc788c43a4848556a5fb16401a04662fc55db9bb201987037",
      hashType: "type",
      args: "0x71fd1985b2971a9903e4d8ed0d59e6710166985217ca0681437883837b86162f"
    },
    manager: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvt29ul8eew7c2kycc3r8hcyxlaed8me9gfnzdaf",
    tags: ["rgb++", "layer-2-asset", "supply-unlimited"],
  }),
  registerUDT({
    name: "RUSD",
    icon: "https://raw.githubusercontent.com/stablepp/media-kit/refs/heads/main/stablecoin-RUSD.svg",
    symbol: "RUSD",
    decimalPlaces: 8,
    type: {
      codeHash: "0x1142755a044bf2ee358cba9f2da187ce928c91cd4dc8692ded0337efa677d21a",
      hashType: "type",
      args: "0x878fcc6f1f08d48e87bb1c3b3d5083f23f8a39c5d5c764f253b55b998526439b"
    },
    manager: "ckt1qrfrwcdnvssswdwpn3s9v8fp87emat306ctjwsm3nmlkjg8qyza2cqgqq9tn3v8fgf8fegvm3n8y7elvpjza4kd7mcd7aek4",
    tags: ["rgb++","layer-2-asset", "supply-unlimited"], // "rgbpp-compatible", 
  }),
  registerUDT({
    name: "Test Btc",
    icon: "/assets/udt/tBtc.png",
    symbol: "tBtc",
    decimalPlaces: 8,
    type: {
      codeHash: "0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb",
      hashType: "type",
      args: "0xe338fcbe878c4c656ac91b296882df9edc8b56cf00ae16acb4f0f49c09bccd02"
    },
    manager: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2sjx5pg6ewz9rqvl4pg8kevvgsf6xp20cwqd4rl",
    tags: ["rgb++", "layer-2-asset", "supply-unlimited"]
  }),
  registerUDT({
    name: "Stable++",
    icon: "/assets/udt/default.png",
    symbol: "BTCPP",
    decimalPlaces: 8,
    type: {
      codeHash: "0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb",
      hashType: "type",
      args: "0x6d0cc2e3a8059f36dbee473e14b2b05d19a4d69f5bfd2a7abdc71fd32eece546"
    },
    manager: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg47radhdj592lsf77x0x95m328yf40thslxr4tj",
    tags: ["rgb++", "layer-2-asset", "supply-unlimited"]
  }),
]
export default testnetUDTList;
