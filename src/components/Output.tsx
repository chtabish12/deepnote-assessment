"use client";

import { useEffect, useRef } from "react";
import { isDomNode, isHtml, isUrl, splitByUrl } from "@/lib/output";

function DomOutput({ node }: { node: Node }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.replaceChildren(node);
    return () => container.replaceChildren();
  }, [node]);

  return <div ref={ref} />;
}

export function Output({ value }: { value: unknown }) {
  if (isDomNode(value)) {
    return <DomOutput node={value} />;
  }

  const text = String(value);
  if (isHtml(text)) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }

  return (
    <>
      {splitByUrl(text).map((part, index) =>
        isUrl(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-700"
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
