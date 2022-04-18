declare module "js-chess-engine";
declare module "chai-generator";
declare module Chai {
  export interface Assertion {
    yield(property?: any): Assertion;
  }
  export interface PromisedAssertion {
    yield(property?: any): PromisedAssertion;
  }
  export interface PromisedDeep {
    yield(property?: any): PromisedAssertion;
  }
}
