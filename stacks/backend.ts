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
        environment: {
          EMAIL: process.env.EMAIL as string,
          REFRESH_TOKEN: process.env.REFRESH_TOKEN as string,
          CLIENT_SECRET: process.env.CLIENT_SECRET as string,
          CLIENT_ID: process.env.CLIENT_ID as string,
          REDIRECT_URI: process.env.REDIRECT_URI as string,
          NODE_ENV: process.env.NODE_ENV as string,
          AWS_USER: process.env.AWS_USER as string,
          AWS_PASSWORD: process.env.AWS_PASSWORD as string,
          AWS_HOST: process.env.AWS_HOST as string,
          AWS_PORT: process.env.AWS_PORT as string,
          AWS_DB_NAME: process.env.AWS_DB_NAME as string,
        },
      },
    },
    routes: { $default: "packages/functions/src/server.default" },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  process.env.API_URL = api.url; // Set the API URL to be used by the frontend stack
  // localhost:3001
}
