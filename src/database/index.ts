
import * as udtApis from "./udts";
import * as knownScriptApis from "./known-scripts";


const clientDB = {
  knownScript: knownScriptApis,
  udt: udtApis,
}


export default clientDB;