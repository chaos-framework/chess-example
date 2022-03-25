console.log('Registering test tsconfig.json with ts-node');
import { register } from 'ts-node';
register({
  project: './tsconfig.test.json',
});

import { use } from "chai";
import generator from "chai-generator";
export async function mochaGlobalSetup() {
  console.log("Adding default chai plugins.");
  chai.should();
  use(generator);
}
