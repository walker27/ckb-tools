/**
* 此文件可以按照工程情况调整，脚本只会在没有生成该文件的情况下生成
*/
import type { FetchAPIReturnType, RequestConfig } from '@/utils/request';
import apiMap, { type APIPaths, type APIMap } from './apiMap';
/**
 * export default 导出的值将决定外部调用的调用方法
 * * 直接导出 apiMap, 则外部调用形式为 server.serviceName[apiPath](params, config)
 * * 导出callAPI, 则外部调用形式为 server.serviceName(path, params, option)
 * * 对于具有复杂的ReturnType的请求函数，ReturnType<APIMap[Path]> 不一定能满足，需要自行调整
 */
/** */
export default function callAPI<Path extends APIPaths, K extends RequestConfig>(path: Path, params?: Parameters<APIMap[Path]>[0], option?: K): FetchAPIReturnType<K, ReturnType<APIMap[Path]>> {
  // @ts-expect-error avoid mixin types
  return apiMap[path](params, option);
}