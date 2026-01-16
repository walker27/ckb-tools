import fs from 'node:fs';
import path from 'node:path';
/**
 * 生成服务外层文件夹index.ts
 * @param rootFolderPath 服务根目录 e.g. src/server
 */
export default function generateRootIndexFile(rootFolderPath, serviceVarName, serviceFolderName) {
    const filePath = path.join(rootFolderPath, 'index.ts');
    const rootVarName = 'server';
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, initFileTemplate(rootVarName));
    }
    const serverIndexContent = fs.readFileSync(filePath, 'utf-8');
    const serverIndexLines = serverIndexContent.split('\n');
    const importLine = `import ${serviceVarName} from './${serviceFolderName}'`;
    let needAddImport = true;
    const part = serverIndexLines.map((line) => {
        if (line === importLine) {
            needAddImport = false;
            return line;
        }
        if (line === `const ${rootVarName} = {`) {
            return line + `\n  ${serviceVarName},`;
        }
        return line;
    }).join('\n');
    if (needAddImport) {
        const oContent = `${importLine}\n${part}`;
        fs.writeFileSync(filePath, oContent);
    }
}
const initFileTemplate = (varName) => `

const ${varName} = {
}

export default ${varName};
`;
