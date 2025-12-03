import clientDB from "@/database";
import type { ScriptLike } from "@ckb-ccc/core";
import { useQuery } from "@tanstack/react-query";
import styles from "./index.module.scss";
import classNames from "classnames";
// import Link from "next/link";
// import TextEllipsis from "../TextEllipsis";
import HashText from "../HashText";

type ScriptTagProps = {
  category: "lock" | "type";
  script?: Pick<ScriptLike, "codeHash">
  className?: string;
  short?: boolean;
  withTag?: boolean;
}

export default function ScriptTag(props: ScriptTagProps) {
  const { category, script, className, withTag = true, short } = props;
  const { data: knwonScriptInfo } = useQuery({
    queryKey: ["knownScript", script?.codeHash],
    queryFn: () => clientDB.knownScript.get(script!.codeHash as string),
    enabled: !!script?.codeHash
  })
  if (!knwonScriptInfo || !script) return null;


  return (
    <div
      className={classNames(styles.tag, {
        [styles.lock!]: category === "lock",
        [styles.type!]: category !== "lock",
      }, className)}
    >
      {
        short ? (
          <HashText
            ellipsis={{ head: 4, tail: -6 }}
          >
            {withTag ? knwonScriptInfo.nameWithTag : knwonScriptInfo.name}
          </HashText>
        ) : (
          withTag ? knwonScriptInfo.nameWithTag : knwonScriptInfo.name
        )
      }
    </div>
  )
}