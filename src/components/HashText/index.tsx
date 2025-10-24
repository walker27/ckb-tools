import { cn } from "@/lib/utils";
import { Typography, type TypographyProps } from "antd";
import { useState, type ComponentProps, type ReactNode } from "react";


const { Text } = Typography

type EllipsisOption =
  | "address"
  | "transaction"
  | { head: number, tail: number }

const builtinEllipsisOptions: Record<string, { head?: number, tail: number }> = {
  address: { head: 8, tail: -8 },
  transaction: { head: 8, tail: -9 },
  // todo global highlight
}


function getEllipsisObject(ellipsis: EllipsisOption) {
  if (typeof ellipsis === "string") {
    return builtinEllipsisOptions[ellipsis]
  }
  return ellipsis
}

export type HashTextProps = Omit<ComponentProps<TypographyProps['Text']>, "ellipsis" | "content" | "children"> & {
  ellipsis?: EllipsisOption
  children?: string
}
export default function HashText(props: HashTextProps) {
  const { copyable: propsCopyable, children, ellipsis, ...textProps } = props;
  const [copyable, setCopyable] = useState(false);
  const hashText = children;
  const content: { origin: string, dom: ReactNode } = { origin: hashText || "", dom: hashText };
  if (ellipsis && !!hashText) {
    const elliObj = getEllipsisObject(ellipsis);
    const text = children;
    const head = elliObj.head ?? 0;
    const tail = elliObj.tail;
    const ellipsisLen = head + (tail < 0 ? -tail : text.slice(tail).length);
    if(ellipsisLen < text.length) {
      content.dom = (
        <>
          {text.slice(0, head)}...{text.slice(tail)}
        </>
      );
    }
  }

  return (
    <Text
      {...textProps}
      className={cn("font-hash", propsCopyable ? "inline-block pr-5" : "", textProps.className)}
      onMouseOver={() => setCopyable(true)}
      onMouseLeave={() => setCopyable(false)}
      copyable={propsCopyable && copyable}
      content={content.origin}
      children={content.dom}
    />
  )
}