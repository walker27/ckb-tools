import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export default async function getConfigFile() {
    // 1. 扫描同目录下 config.xxx. 的文件，读取其名称，作为prompt的选项
    console.log('正在搜索同目录下的config.xxx.(js|mjs) 的js文件');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const files = await fs.promises.readdir(path.resolve(__dirname, '..'));
    const configFiles = files.reduce((options, fileName) => {
        // if fileOrFolder is file
        if (fileName.startsWith('config.')) {
            const configKey = fileName.split('.').slice(1, -1).join('.');
            if (configKey !== 'template') {
                options.push({
                    name: fileName.split('.').slice(1, -1).join('.'),
                    value: fileName,
                });
            }
        }
        return options;
    }, []);
    // console.log('configFiles:', configFiles);
    // if configFiles.length < 1 report error and stop
    if (configFiles.length < 1) {
        throw new Error('未找到配置文件');
    }
    const pickedConfigFileName = configFiles.length === 1
        ? configFiles[0].value
        : await import("@inquirer/prompts").then(({ select }) => select({
            message: '选择配置文件',
            choices: configFiles,
        }));
    console.log('正在尝试读取配置文件:', pickedConfigFileName);
    // import file as js
    const configFileContent = await import(`../${pickedConfigFileName}`);
    return configFileContent?.default;
}
