import axios from "axios";
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));
/**
 * 生成文件内容
 * 生成的文件目录示例:
 * root
 *  - service-name-a
 *  | - api.d.ts
 *  | - path-types.ts
 *  | - apiMap.ts
 *  | - interceptors.ts
 *  | - index.ts
 *  | - enums.ts
 *  | - defineAPI.ts
 *  - service-name-xxx
 *  | ...
 *  ...
 *  - index.ts
 *  - utils.ts
 */
const config = {
    /** 是否只生成定义文件，默认为false */
    typesOnly: false,
    /** 缩进尺寸 */
    indentSize: 2,
    /** API 命名空间前缀，用于 declare namespace {typeNameSpace} {} */
    // todo
    typeNameSpace: '__',
    /** 所有服务所在的文件夹 */
    // todo
    rootFolderPath: path.resolve(__dirname, '..', '__'),
    /** 当前服务的文件夹名称 */
    // todo
    serviceFolderName: '__SERVICE_FOLDER_NAME__',
    /** 服务在代码中的变量名称 */
    // todo
    serviceVariableName: '__SERVICE_VAR_NAME__',
    /** 加载swagger json */
    async loadJSON() {
        // todo
        const res = await axios.get('http://url', {});
        return res.data;
    },
    /** 用于过滤接口或者对接口的返回进行一定的修改 */
    beforePathProcess(path, schemas) {
        /** 过滤一些不需要的接口 */
        // if (path.url.indexOf('/xxx') === -1) return null;
        /** 移除多余的前缀 */
        // path.url = path.url.replace('/xxx', '');
        /** 跳过接口返回的通用返回结构取核心data */
        // const reponseType = path.response?.type;
        // if (reponseType && schemas[reponseType]) {
        //   const propertyData = schemas[reponseType]?.properties?.find(item => item.name === 'data');
        //   if (propertyData) {
        //     console.log(`replace response type ${reponseType} to ${propertyData.type}`);
        //     path.response = { ...propertyData, name: '' };
        //   }
        // }
        /** 对一些返回是文件内容的接口的返回做一些修正 */
        // if (!path.response && (path.url.indexOf('/export') !== -1)) {
        //   path.response = {
        //     type: 'file'
        //   };
        // }
        return path;
    },
    /** 自定义每个path的索引字符串 */
    // onPathIndexRender(method: string, url: string) {
    //   return `${method} ${url}`;
    // },
    /** 可以在这里修改schema以符合前端代码的真实需求 */
    /**
     * tips:
     *  对于枚举类型, 可以将schema.enums: string[] | number[] 转换成 Array<{ value: string | number, description?: string, name: string}>
     *  脚本就会在`enums.ts`中生成对应的枚举类型
     */
    // beforeRenderSchema(schema: API.DataType) {
    //   const matchSchema = matchSchemaHOF(schema);
    //   const buildEnum = buildEnumHOF(schema);
    //   buildEnum("ExchangeOrderStatus", () => {
    //     // name 为代码中的变量名, 例如 Enum State { INIT } 中的`INIT`
    //     schema.enums = [
    //       { value: 0, name: 'UNKNOWN', description: "未知" },
    //       { value: 1, name: 'INIT', description: "未开始" },
    //       { value: 2, name: 'PROCESSING', description: "处理中" },
    //       { value: 3, name: 'COMPLETED', description: "已完成" },
    //       { value: 4, name: 'FAILED', description: "失败" },
    //     ];
    //   })
    //   buildEnum("CodeType", () => {
    //     schema.enumVariableName = "EMAIL_CODE_TYPE";
    //     // name 为代码中的变量名, 例如 Enum State { INIT } 中的`INIT`
    //     schema.enums = [
    //       { value: 0, name: 'UNKNOWN' },
    //       { value: 1, name: 'LOGIN' },
    //       { value: 2, name: 'RESET_PASS' },
    //       { value: 3, name: 'REGISTER' },
    //       { value: 4, name: 'CHANGE_EMAIL' },
    //       { value: 5, name: 'ADD_ACCOUNT' },
    //       { value: 6, name: 'UNKNOWN2' },
    //     ];
    //   });
    // },
    /** 脚本完成后触发 */
    // onFinished() {
    // },
};
export default config;
const matchSchemaHOF = (schema) => (targetSchemaName, f) => {
    if (schema.name !== targetSchemaName)
        return;
    f();
};
const buildEnumHOF = (schema) => {
    const matchSchema = matchSchemaHOF(schema);
    return (targetSchemaName, f) => {
        matchSchema(targetSchemaName, () => {
            if (!schema.enums)
                return;
            const originEnums = schema.enums;
            f();
            if (originEnums?.length !== schema.enums.length) {
                console.warn(`${schema.name} enum length changed`);
            }
        });
    };
};
