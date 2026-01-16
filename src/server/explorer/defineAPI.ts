/**
* 此文件可以按照工程情况调整，脚本只会在没有生成该文件的情况下生成
*/
import defineAPIHOC from "../utils";
import interceptors from "./interceptors";
const defineAPI = defineAPIHOC("/api/v1", interceptors);
export default defineAPI;
