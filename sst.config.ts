import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/frontend";
import { BackendStack } from "./stacks/backend";
import dotenv from "dotenv-flow";

import { App } from "sst/constructs";

dotenv.config();

export default {
  config(_input) {
    return {
      name: "zotnfound",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app
    .stack(BackendStack, { stackName: `${app.name}-${app.stage}-backend` })
    .stack(FrontendStack, { stackName: `${app.name}-${app.stage}-frontend` });  },
} satisfies SSTConfig;
