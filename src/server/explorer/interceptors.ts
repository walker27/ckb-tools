/**
* 此文件可以按照工程情况调整，脚本只会在没有生成该文件的情况下生成
*/
import { Interceptors } from "../utils";
import type { APITypeTuple } from "./path-types";

const __ = undefined;
const interceptors = new Interceptors<APITypeTuple>();

export default interceptors;

// interceptors.add(path, __, __);

