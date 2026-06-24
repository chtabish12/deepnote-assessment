"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Block } from "@/types/block";
import { evaluate } from "@/lib/evaluate";
import {
  buildScope,
  collectAffected,
  topologicalOrder,
} from "@/lib/dependencies";

const RECOMPUTE_DELAY = 350;

function createBlock(index: number): Block {
  return {
    id: `block-${index}`,
    name: `a${index}`,
    value: "",
    output: null,
    error: null,
    running: false,
  };
}

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const counterRef = useRef(1);

  const blocksRef = useRef(blocks);
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const patchBlock = useCallback((id: string, patch: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...patch } : block))
    );
  }, []);

  const recompute = useCallback(async (changedId: string) => {
    const snapshot = blocksRef.current;
    const { order, cyclic } = topologicalOrder(snapshot);
    const affected = collectAffected(snapshot, changedId);
    const toRun = order.filter((id) => affected.has(id));

    setBlocks((prev) =>
      prev.map((block) =>
        affected.has(block.id) ? { ...block, running: true } : block
      )
    );

    const outputs = new Map(snapshot.map((block) => [block.name, block.output]));

    for (const id of toRun) {
      const block = snapshot.find((item) => item.id === id);
      if (!block) continue;

      if (cyclic.has(id)) {
        outputs.set(block.name, null);
        patchBlock(id, {
          output: null,
          error: "Circular reference detected",
          running: false,
        });
        continue;
      }

      const result = await evaluate(block.value, buildScope(block, outputs));
      outputs.set(block.name, result.output);
      patchBlock(id, { ...result, running: false });
    }
  }, [patchBlock]);

  const scheduleRecompute = useCallback(
    (changedId: string) => {
      const timers = timersRef.current;
      const existing = timers.get(changedId);
      if (existing) clearTimeout(existing);
      timers.set(
        changedId,
        setTimeout(() => {
          timers.delete(changedId);
          void recompute(changedId);
        }, RECOMPUTE_DELAY)
      );
    },
    [recompute]
  );

  const addBlock = useCallback(() => {
    const index = counterRef.current;
    counterRef.current += 1;
    setBlocks((prev) => [...prev, createBlock(index)]);
  }, []);

  const changeBlock = useCallback(
    (id: string, value: string) => {
      patchBlock(id, { value });
      scheduleRecompute(id);
    },
    [patchBlock, scheduleRecompute]
  );

  const removeBlock = useCallback(
    (id: string) => {
      const dependents = blocksRef.current.filter((block) => block.id !== id);
      setBlocks(dependents);
      dependents.forEach((block) => scheduleRecompute(block.id));
    },
    [scheduleRecompute]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { blocks, addBlock, changeBlock, removeBlock };
}
