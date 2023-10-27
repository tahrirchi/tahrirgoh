
export enum TransformationType {
  EDIT,
  MOVE,
  ADD,
  DELETE,
  MERGE,
  SPLIT
}

export interface Transformation {
  action: TransformationType
}

export interface EditTransformation extends Transformation {
  action: TransformationType.EDIT,
  pos: number;
  oldToken: string,
  newToken: string
}

export interface SplitTransformation extends Transformation {
  action: TransformationType.SPLIT,
  pos: number
}

export interface MoveTransformation extends Transformation {
  action: TransformationType.MOVE,
  fromPos: number,
  toPos: number
}

export type AllTransformations = EditTransformation | MoveTransformation | SplitTransformation
