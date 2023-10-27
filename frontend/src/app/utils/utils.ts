export function getCaretPosition(element: HTMLElement) {
  const selection = window.getSelection()!;
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    preSelectionRange.setEnd(range.endContainer, range.endOffset);
    return preSelectionRange.toString().length;
  }
  return 0;
}

export function splitSentence(sentence: string): string[] {
  // Regular expression to split sentence into words and punctuation
  const regex = /([\p{L}ʻʼ’'`´‘-]+)|\S/gu;
  // Split the sentence using the regex pattern
  const splitArray = sentence.match(regex);
  // Return the array of words and punctuation symbols
  return splitArray || [];
}

function camelCase(str: string) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}

function snakeCase(str: string) {
  return str.replace(/[A-Z]/g, function (str) {
    return `_${str.toLowerCase()}`;
  });
}

function processWalk(obj: unknown, fn: (str: string) => string): any {
  // @ts-ignore
  const walk = (obj: unknown) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj instanceof Date || obj instanceof RegExp) return obj;
    if (Array.isArray(obj)) return obj.map(walk);

    return Object.keys(obj).reduce((res, key) => {
      const camel = fn(key);
      // @ts-ignore
      res[camel] = walk(obj[key]);
      return res;
    }, {});
  };

  return walk(obj);
}

export function camelize<T>(obj: T): T extends String ? string : T extends (infer R)[] ? R[] : T {
  return typeof obj === 'string' ? camelCase(obj) : processWalk(obj, (key) => camelCase(key));
}

export function snakeize<T>(obj: T): T extends String ? string : T extends (infer R)[] ? R[] : T {
  return typeof obj === 'string' ? camelCase(obj) : processWalk(obj, (key) => snakeCase(key));
}
