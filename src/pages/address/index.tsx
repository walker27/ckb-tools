import { PageContainer } from "@ant-design/pro-components";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import * as ts from "typescript";
import { parseAddress } from "./tool";


const template = `
const params: AddressQueryCondition = {
  /** option 1 */
  address: "", // ckbxx or ckt xxx

  /** option 2 */
  // codeHash: "",
  // hashType: "type", // type | data | data1 | data2
  // args: ""
}
export default params;
`


export default function AddressPage() {
  const monaco = useMonaco();
  const [parsedContent, setParsedContent] = useState<any>(null);

  const tryDecode = async (tsCodeStr: string) => {
    try {
      const jsCodeStr = ts.transpile(tsCodeStr, { target: ts.ScriptTarget.ES2015  })
      // console.log("jsCode:", jsCodeStr);
      const code = jsCodeStr;
      const dataUri = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(code);
      const module = await import(dataUri);
      // console.log("res:", module.default)
      const parsed = await parseAddress(module.default)
      setParsedContent(parsed)
    } catch (e) {
      console.log("compile error:", e)
    }
  }

  useEffect(() => {
    // or make sure that it exists by other ways
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
      // do conditional chaining
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      monaco.languages.typescript.typescriptDefaults.addExtraLib(`
      type AddressQueryCondition = {
        address: \`\${"ckt"|"ckb"}\${string}\`;
      } | {
        codeHash: string;
        hashType: "type" | "data" | "data1" | "data2";
        args: string;
      };
      `)
    }
  }, [monaco]);

  return (
    <PageContainer>
      <Editor
        height="300px"
        defaultLanguage="typescript"
        theme="vs-dark"
        onChange={(codeStr) => {
          tryDecode(codeStr);
        }}
        // defaultValue={JSON.stringify({ codeHash: "", args: "", hashType: "" }, null, 2)}
        defaultValue={template}
      />
      <div className="h-1 bg-[#999]"></div>
      <Editor
        height="500px"
        defaultLanguage="json"
        theme="vs-dark"
        value={JSON.stringify(parsedContent, null, 2)}
      />
    </PageContainer>

  )
}