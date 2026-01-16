import lodash from 'lodash';
import filterInvalidTypeNameChar from "./filterInvalidTypeNameChar.mjs";
export default function extractJSDocContent(content) {
    return {
        dataTypes: generateCommonSchemas(content.components?.schemas),
        paths: scanPaths(content.paths),
    };
}
function generateCommonSchemas(schemas) {
    if (!schemas)
        return null;
    const obj = {};
    Object.entries(schemas)
        .forEach(([schemaName, schmeContent]) => {
        // console.log(`========== schema:${schemaName} start ==========`);
        // console.log(schemaName, schmeContent);
        if (schmeContent.$ref) {
            console.log('unknown schemaType:', schmeContent);
            return;
        }
        // console.log(' ===== origin data =====');
        // console.log(schmeContent);
        const iDataType = schemaToDataType(schemaName, schmeContent);
        obj[iDataType?.name] = iDataType;
        // console.log(' ===== restruct struct =====');
        // console.log(obj[schemaName]);
        // console.log(`========== schema:${schemaName} end ==========`);
    });
    return obj;
}
function schemaToDataType(typeName, schemaType) {
    if (!schemaType)
        return null;
    if (schemaType?.$ref) {
        return { name: filterInvalidTypeNameChar(typeName), type: filterInvalidTypeNameChar(schemaType.$ref.split('/').pop()), required: true };
    }
    const schema = schemaType;
    const { type, description, properties, nullable, format, items, enum: valueEnum, ...restProps } = schema;
    // console.log('===== origin data =====');
    // console.log(content);
    if (format?.indexOf('int') === -1) {
        restProps.format = format;
    }
    const obj = {
        name: filterInvalidTypeNameChar(typeName),
        type: schema.type,
        required: !nullable,
        infos: Object.keys(restProps).length ? [JSON.stringify(restProps)] : undefined,
        enums: valueEnum,
        description,
    };
    // if (!['string', 'integer', 'boolean', 'array', 'object', 'number'].includes(obj.type)) {
    //   console.log('detect abnormal type:', obj.type, obj);
    // }
    if (type === 'array') {
        obj.arrayElementType = schemaToDataType('elementTypeName', items);
    }
    if (format === 'binary') {
        obj.type = 'file';
    }
    if (properties) {
        obj.properties = Object.entries(properties)
            .map(([propName, propContent]) => schemaToDataType(propName, propContent));
    }
    // console.log('===== restruct struct =====');
    // console.log(obj);
    return obj;
}
const httpMethods = ['get', 'put', 'post', 'delete'];
function scanPaths(paths) {
    if (!paths)
        return [];
    const endpoints = [];
    Object.entries(paths)
        .forEach(([path, pathContent]) => {
        httpMethods.forEach((method) => {
            const config = pathContent[method];
            if (!config)
                return;
            // console.log(`========== ${method} ${path} start ==========`);
            // console.log(config);
            // config.description
            const endpoint = {
                url: path,
                method: method.toUpperCase(),
                description: config.description || config.summary,
                parameters: [],
            };
            if (config.parameters) {
                config.parameters.forEach((param) => {
                    if (param.$ref) {
                        console.log('unkown param type:', param);
                        return;
                    }
                    const { name, schema, required, in: location } = param;
                    const dataType = schemaToDataType(name, schema);
                    // if(location === 'query' && schema?.$ref) {
                    //   // url上为引用类型的参数，实际情况 这个对象即整个query对象
                    //   dataType.name = '';
                    // }
                    if (name === "req" && schema?.$ref) {
                        dataType.name = '';
                        // console.log('trigger warning feature', schema);
                    }
                    dataType.in = location;
                    dataType.required = required;
                    endpoint.parameters.push(dataType);
                });
            }
            // config.requestBody
            if (config.requestBody) {
                const [schemaName, { schema }] = Object.entries(config.requestBody.content)[0];
                const parameter = schemaToDataType('', schema);
                const pos = schemaName.indexOf("form-data") !== -1 ? 'formData' : 'body';
                if (parameter) {
                    if (!parameter.name && parameter.properties) {
                        parameter.properties.forEach((prop) => {
                            prop.in = pos;
                        });
                        endpoint.parameters = endpoint.parameters.concat(parameter.properties);
                    }
                    else {
                        parameter.in = pos;
                        endpoint.parameters.push(parameter);
                    }
                }
            }
            // config.responses
            if (config.responses) {
                const responseContent = (lodash.get(config, 'responses.200.content') ?? {});
                const schema = Object.values(responseContent)?.[0]?.schema;
                endpoint.response = schemaToDataType('', schema);
            }
            // console.log('===== processed path =====');
            // console.log(endpoint);
            endpoints.push(endpoint);
            // console.log(`========== ${method} ${path} end ==========`);
        });
    });
    return endpoints;
}
