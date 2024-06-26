import {
  StackContext,
  Api,
  EventBus,
  Bucket,
  StaticSite,
} from "sst/constructs";

export function BackendStack({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const bucket = new Bucket(stack, "bucket", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, bucket],
        environment: {
          EMAIL: process.env.EMAIL,
          REFRESH_TOKEN: process.env.REFRESH_TOKEN,
          CLIENT_SECRET: process.env.CLIENT_SECRET,
          CLIENT_ID: process.env.CLIENT_ID,
          REDIRECT_URI: process.env.REDIRECT_URI,

          NODE_ENV: process.env.NODE_ENV,

          AWS_USER: process.env.AWS_USER,
          AWS_PASSWORD: process.env.AWS_PASSWORD,
          AWS_HOST: process.env.AWS_HOST,
          AWS_PORT: process.env.AWS_PORT,
          AWS_DB_NAME: process.env.AWS_DB_NAME,
        },
      },
    },
    routes: {
      $default: "packages/functions/src/server.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  process.env.API_URL = api.url; // Set the API URL to be used by the frontend stack
  // localhost:3001
}
