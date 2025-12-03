import { registerUDT, UDT } from "./tool";

const mainnetUDTList: UDT[] = [
  registerUDT({
    name: 'BANK',
    icon: '/assets/udt/default.png',
    symbol: 'BANK',
    decimalPlaces: 8,
    type: {
      codeHash: "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      hashType: "data1",
      args: "0x3046219b8dd69e0513691568ea438ac6a2a356c0f2695f98a8aed3cc03a1061a"
    },
    manager: "ckb1qzpfq3n62yh9hxnts9jxnv8d4wap7jkywn3gllwkqnp203myg6a67qnhxnpq8dfryqtgasrrh6l9pv05gsl40cha43v0sqg63slf05flu5qqqqqqx8ka9y",
    tags: ["supply-limited", "rgb++"],
  }),
  registerUDT({
    name: 'USDI',
    icon: '/assets/udt/USDI.svg',
    symbol: 'USDI',
    decimalPlaces: 6,
    type: {
      codeHash: "0xbfa35a9c38a676682b65ade8f02be164d48632281477e36f8dc2f41f79e56bfc",
      hashType: "type",
      args: "0xd591ebdc69626647e056e13345fd830c8b876bb06aa07ba610479eb77153ea9f"
    },
    manager: "ckb1qrgqep8saj8agswr30pls73hra28ry8jlnlc3ejzh3dl2ju7xxpjxqgqq8we8qft3s9u47pfv5c2uq4xexurymlgfc6hvrcf",
    tags: ["rgb++", "layer-2-asset"], // , "supply-unlimited"
  }),
  registerUDT({
    name: 'Seal',
    icon: '/assets/udt/seal.png',
    symbol: 'Seal',
    decimalPlaces: 8,
    type: {
      codeHash: "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      hashType: "data1",
      args: "0x2ae639d6233f9b15545573b8e78f38ff7aa6c7bf8ef6460bf1f12d0a76c09c4e"
    },
    manager: "ckb1qz7xc452rgxs5z0ks3xun46dmdp58sepg0ljtae8ck0d7nah945nvqgpqqqqpg840kldpmna3xlagw8ehvggfl4ngzkd50anc936nm475wrstxf5v39jp9",
    tags: ["rgb++", "layer-1-asset", "supply-limited"]
  }),
  registerUDT({
    name: 'BEAF',
    icon: '/assets/udt/beaf.jpeg',
    symbol: 'BEAF',
    decimalPlaces: 0,
    type: {
      codeHash: "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      hashType: "data1",
      args: "0xc639759e988445217e4c08b2e7b416082d9de0cb061194e2f7f35a89bb6fbf4f"
    },
    manager: "ckb1qzpfq3n62yh9hxnts9jxnv8d4wap7jkywn3gllwkqnp203myg6a67q3w55dn90d36gqd9fxn4vfddsmmrzy7k04qpp9sfy5560ejtzl5l5qqqqqq8422du",
    tags: ["supply-limited", "rgb++"]
  }),
  registerUDT({
    name: 'BEAF',
    icon: '/assets/udt/beaf.jpeg',
    symbol: 'BEAF',
    decimalPlaces: 0,
    type: {
      codeHash: "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      hashType: "data1",
      args: "0xc639759e988445217e4c08b2e7b416082d9de0cb061194e2f7f35a89bb6fbf4f"
    },
    manager: "ckb1qzpfq3n62yh9hxnts9jxnv8d4wap7jkywn3gllwkqnp203myg6a67q3w55dn90d36gqd9fxn4vfddsmmrzy7k04qpp9sfy5560ejtzl5l5qqqqqq8422du",
    tags: ["supply-limited", "rgb++"]
  }),
  registerUDT({
    name: 'BTC', // full name: ccBTC
    icon: '/assets/udt/btc.png',
    symbol: 'BTC',
    decimalPlaces: 8,
    type: {
      codeHash: "0x092c2c4a26ea475a8e860c29cf00502103add677705e2ccd8d6fe5af3caa5ae3",
      hashType: "type",
      args: "0x68e64ba4b0daeeec45c1f983d6d574fca370442cafb805bc4265ef74870a4ac8"
    },
    manager: "ckb1qzdcr9un5ezx8tkh03s46m9jymh22jruelq8svzr5krj2nx69dhjvqgx6gsml975rhjhy23mjnlg227kgskgycpsqqnr3s4r",
    tags: ["rgb++", "layer-2-asset", "supply-unlimited"]
  }),
  registerUDT({
    name: 'JOKER',
    icon: '/assets/udt/joker.png',
    symbol: 'JOKER',
    decimalPlaces: 8,
    type: {
      codeHash: "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      hashType: "data1",
      args: "0xcb74eaded089bf39c2165149cad3d526b4321e9a6119c7ae9cf996be3acfeb18"
    },
    manager: "ckb1qzpfq3n62yh9hxnts9jxnv8d4wap7jkywn3gllwkqnp203myg6a67qkm39rufp2nmn4nd9g8fzrukq8a83hnahedmxcye27sytxm563zdqqqqqqqvhhhya",
    tags: ["supply-limited", "rgb++"]
  }),
  registerUDT({
    name: 'RGB++',
    icon: '/assets/udt/rgbpp.png',
    symbol: 'RGB++',
    decimalPlaces: 8,
    type: {
      codeHash: "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      hashType: "data1",
      args: "0x08875c56644d39dd9629d291357d3026debc5d22fa88d924d60ce8f16dd50e70"
    },
    manager: "ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2kwmw8vqcnzg3w5wmce8z9qf5teznlaesh2hxmw",
    tags: ["rgb++", "layer-2-asset", "supply-unlimited"]
  }),
  registerUDT({
    name: 'RUSD',
    icon: '/assets/udt/default.png',
    symbol: 'RUSD',
    decimalPlaces: 8,
    type: {
      codeHash: "0x26a33e0815888a4a0614a0b7d09fa951e0993ff21e55905510104a0b1312032b",
      hashType: "type",
      args: "0x360c9d87b2824c357958c23e8878f686001e88e9527a08ea229e7d9ba7fe39a7"
    },
    manager: "ckb1qpt0kce2zw4a44es35hqxja2u89sf85w3lere37qk62ynash2jtnxqtmqecp56kf2jx65zdgr0983xgmeglmku62zhqrxz78r0klaqrv2cssrj8t",
    tags: ["rgb++", "layer-2-asset", "supply-unlimited"]
  }),
]
export default mainnetUDTList;
