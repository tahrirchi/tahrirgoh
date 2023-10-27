import {Annotation} from "./IAnnotation";

export interface ISentence {
  id: string;
  value: string;
  source: string;
  annotations?: Annotation[];
  reviewed?: boolean;
}
