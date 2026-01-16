import extractJSDocContent from "./utils/extractJSDocContent.mjs";
import extractOfficalSwaggerContent from "./utils/extractOfficialSwaggerContent.mjs";
import getConfigFile from "./utils/getConfigFile.mjs";
import generateService from "./utils/generateService.mjs";
import fs from 'node:fs';
(async function main() {
  // if command match `scripts.js new [service-name]`
  const command = process.argv[2];
  if (command) {
    if (command.match(/new/)) {
      const serviceFolderName = process.argv[3];
      if (!serviceFolderName) {
        console.log('请输入服务名称');
        return;
      }
      generateNewConfigFile(serviceFolderName);
      // get ./utils/config.template.mts content and rename as config.serviceName.mts
      return;
    }
    console.log('unknown command', command);
    return;
  }
  // else 
  const config = await getConfigFile();
  if (!config) {
    console.log('读取配置文件失败');
    return;
  }
  const jsonContent = await config.loadJSON();
  if (!jsonContent) {
    console.log('load json 失败');
    return;
  }
  // json => paths、dataTypes
  const { dataTypes, paths } = (() => {
    if (jsonContent.openapi) {
      console.log('检测到为jsdoc-swagger结构');
      return extractJSDocContent(jsonContent);
    }
    if (jsonContent.swagger) {
      console.log('检测到为标准swagger结构');
      return extractOfficalSwaggerContent(jsonContent);
    }
    return { dataTypes: null, paths: null };
  })();
  if (!dataTypes || !paths) {
    console.log('未检测到swagger 数据');
    return;
  }
  // paths, dataTypes => files
  generateService(paths, dataTypes, config);
  config.onFinished?.();
  console.log('done');
})();
function generateNewConfigFile(serviceFolderName) {
  console.log('try to create service config', serviceFolderName);
  // service-name to serviceName
  const serviceVarName = serviceFolderName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  // get ./utils/config.template.mts content
  const configTemplate = fs.readFileSync(new URL('./utils/config.template.mjs', import.meta.url), 'utf-8');
  fs.writeFileSync(new URL(`./config.${serviceFolderName}.mjs`, import.meta.url), configTemplate
    .replace('__SERVICE_FOLDER_NAME__', serviceFolderName)
    .replace('__SERVICE_VAR_NAME__', serviceVarName));
  console.log(`create service config success. please fix/confirm \x1b[43m todo \x1b[0m part`);
}
