declare module "js-chess-engine";
declare module Chai {
  export interface Assertion {
    yield(property: any): void;
  }
  export interface PromisedAssertion {
    yield(property: any): void;
  }
}
