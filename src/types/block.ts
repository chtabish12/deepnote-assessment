export type Block = {
  id: string;
  name: string;
  value: string;
  output: unknown;
  error: string | null;
  running: boolean;
};

export type EvalResult = {
  output: unknown;
  error: string | null;
};
