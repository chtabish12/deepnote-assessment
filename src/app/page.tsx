"use client";

import { Button } from "@/components/Button";
import { BlockList } from "@/components/BlockList";
import { useBlocks } from "@/hooks/useBlocks";

export default function Home() {
  const { blocks, addBlock, changeBlock, removeBlock } = useBlocks();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Deepnote Assessment
        </h1>
        <Button onClick={addBlock}>
          <span className="text-base leading-none">+</span>
          Add new block
        </Button>
      </header>

      <BlockList
        blocks={blocks}
        onChange={changeBlock}
        onRemove={removeBlock}
      />
    </main>
  );
}
