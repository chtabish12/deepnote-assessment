import type { EvalResult } from "@/types/block";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export function looksLikeCode(code: string): boolean {
  return /[(){}[\];=<>.]|=>|\b(return|function|const|let|var|new|await)\b/.test(
    code
  );
}

export async function evaluate(
  code: string,
  scope: Record<string, unknown>
): Promise<EvalResult> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { output: null, error: null };
  }

  const names = Object.keys(scope);
  try {
    const fn = new AsyncFunction(...names, `return (${trimmed});`);
    const output = await fn(...names.map((name) => scope[name]));
    return { output, error: null };
  } catch (err) {
    if (!looksLikeCode(trimmed)) {
      return { output: trimmed, error: null };
    }
    return {
      output: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
