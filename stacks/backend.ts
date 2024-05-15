import { StackContext, Api, EventBus } from "sst/constructs";

export function BackendStack({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    routes: { $default: "packages/functions/src/server.default" },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  process.env.API_URL = api.url; // Set the API URL to be used by the frontend stack
}
