declare module Chai {
  export interface Assertion {
    eventually: PromisedAssertion;
    yield(property: any): void;
  }
  export interface PromisedAssertion {
    yield(property: any): void;
  }
}
