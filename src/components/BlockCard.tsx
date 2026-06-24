"use client";

import type { Block } from "@/types/block";
import { Button } from "@/components/Button";
import { Output } from "@/components/Output";

type BlockCardProps = {
  block: Block;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
};

export function BlockCard({ block, onChange, onRemove }: BlockCardProps) {
  const showOutput = block.value.trim() !== "" && !block.running;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-600">
          {block.name}
        </span>
        <Button
          variant="ghost"
          onClick={() => onRemove(block.id)}
          aria-label="Remove block"
        >
          ✕
        </Button>
      </div>

      <textarea
        value={block.value}
        onChange={(event) => onChange(block.id, event.target.value)}
        rows={3}
        placeholder="e.g. 1 + 2, or reuse a1 * 10"
        className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {block.running && (
        <p className="mt-3 text-sm text-zinc-400">Running…</p>
      )}

      {showOutput && block.error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 font-mono text-sm text-red-700">
          {block.error}
        </p>
      )}

      {showOutput && !block.error && block.output !== null && (
        <div className="mt-3 rounded-md bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-800">
          <Output value={block.output} />
        </div>
      )}
    </div>
  );
}
