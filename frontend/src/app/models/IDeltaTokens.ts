import {Token} from "./IToken";

export type DeltaTokens = {
  [key: number]: {
    oldVal: Token;
    newVal: Token[];
  }
}
