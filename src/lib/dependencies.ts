import type { Block } from "@/types/block";

const REFERENCE_PATTERN = /\b[a-z]\d+\b/gi;

export function extractReferences(
  value: string,
  validNames: Set<string>
): string[] {
  const matches = value.match(REFERENCE_PATTERN) ?? [];
  return [...new Set(matches)].filter((name) => validNames.has(name));
}

export function buildDependencyGraph(blocks: Block[]): Map<string, string[]> {
  const names = new Set(blocks.map((block) => block.name));
  const idByName = new Map(blocks.map((block) => [block.name, block.id]));

  const graph = new Map<string, string[]>();
  for (const block of blocks) {
    const deps = extractReferences(block.value, names)
      .filter((name) => name !== block.name)
      .map((name) => idByName.get(name) as string);
    graph.set(block.id, deps);
  }
  return graph;
}

export function topologicalOrder(blocks: Block[]): {
  order: string[];
  cyclic: Set<string>;
} {
  const graph = buildDependencyGraph(blocks);
  const state = new Map<string, "visiting" | "done">();
  const order: string[] = [];
  const cyclic = new Set<string>();

  const visit = (id: string) => {
    const current = state.get(id);
    if (current === "done") return;
    if (current === "visiting") {
      cyclic.add(id);
      return;
    }

    state.set(id, "visiting");
    for (const dep of graph.get(id) ?? []) visit(dep);
    state.set(id, "done");
    order.push(id);
  };

  for (const block of blocks) visit(block.id);
  return { order, cyclic };
}

export function collectAffected(
  blocks: Block[],
  changedId: string
): Set<string> {
  const graph = buildDependencyGraph(blocks);
  const dependents = new Map<string, string[]>();
  for (const [id, deps] of graph) {
    for (const dep of deps) {
      dependents.set(dep, [...(dependents.get(dep) ?? []), id]);
    }
  }

  const affected = new Set<string>([changedId]);
  const queue = [changedId];
  while (queue.length) {
    const id = queue.shift() as string;
    for (const dependent of dependents.get(id) ?? []) {
      if (!affected.has(dependent)) {
        affected.add(dependent);
        queue.push(dependent);
      }
    }
  }
  return affected;
}

export function buildScope(
  block: Block,
  outputs: Map<string, unknown>
): Record<string, unknown> {
  const scope: Record<string, unknown> = {};
  for (const [name, output] of outputs) {
    if (name !== block.name) scope[name] = output;
  }
  return scope;
}
