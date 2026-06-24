export const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

export function isDomNode(value: unknown): value is Node {
  return typeof Node !== "undefined" && value instanceof Node;
}

export function isHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function isUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

export function splitByUrl(text: string): string[] {
  return text.split(URL_PATTERN);
}
