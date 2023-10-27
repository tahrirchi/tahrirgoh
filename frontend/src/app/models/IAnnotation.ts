export interface Annotation {
  fromIndex: number,
  toIndex: number,
  newValue?: string | null;
  oldValue?: string | null;
  errorType: string;
}
