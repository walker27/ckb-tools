import { ccc, ClientPublicTestnet } from "@ckb-ccc/ccc"

ccc.Address.fromString(
  "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqw6vjzy9kahx3lyvlgap8dp8ewd8g80pcgcexzrj",
  new ClientPublicTestnet()
).then(res => {
  console.log({ res })
})

const res2 = ccc.Address.fromScript(
  {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0xda648442dbb7347e467d1d09da13e5cd3a0ef0e1'
  },
  new ClientPublicTestnet()
)

console.log({ res2, address: res2.toString() })