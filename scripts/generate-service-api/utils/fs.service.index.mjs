import fs from 'node:fs';
import path from 'node:path';
/**
 * 生成 root/service/index.ts
 */
export default function generateServiceIndexFile(serviceFolderPath) {
    const filePath = path.resolve(serviceFolderPath, `index.ts`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, CONTENT_TEMPLATE);
    }
}
const CONTENT_TEMPLATE = `/**
* 此文件可以按照工程情况调整，脚本只会在没有生成该文件的情况下生成
*/
import apiMap, { APIPaths, APIMap } from './apiMap';
/**
 * export default 导出的值将决定外部调用的调用方法
 * * 直接导出 apiMap, 则外部调用形式为 server.serviceName[apiPath](params, config)
 * * 导出callAPI, 则外部调用形式为 server.serviceName(path, params, option)
 * * 对于具有复杂的ReturnType的请求函数，ReturnType<APIMap[Path]> 不一定能满足，需要自行调整
 */
/** */
export default function callAPI<Path extends APIPaths>(path: Path, params?: Parameters<APIMap[Path]>[0], option?: Parameters<APIMap[Path]>[1]): ReturnType<APIMap[Path]> {
  // @ts-ignore
  return apiMap[path](params, option);
}`;
