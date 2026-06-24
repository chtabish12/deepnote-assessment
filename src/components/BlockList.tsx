"use client";

import type { Block } from "@/types/block";
import { BlockCard } from "@/components/BlockCard";

type BlockListProps = {
  blocks: Block[];
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
};

export function BlockList({ blocks, onChange, onRemove }: BlockListProps) {
  if (blocks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-10 text-center text-sm text-zinc-500">
        No blocks yet. Click “Add new block” to create one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => (
        <BlockCard
          key={block.id}
          block={block}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
