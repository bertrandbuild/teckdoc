"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Copy({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleCopy}>
      {isCopied ? (
        <CheckIcon className="size-3" />
      ) : (
        <CopyIcon className="size-3" />
      )}
    </Button>
  );
}
