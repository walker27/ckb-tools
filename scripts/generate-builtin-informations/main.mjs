import { generateScripts } from "./generateScripts.mjs"
import { generateUDTInfos } from "./generateUDT.mjs"



(async function main() {
  generateScripts();
  generateUDTInfos();
})()