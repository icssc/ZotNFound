import { StackContext, Api, EventBus, Bucket, Function } from "sst/constructs";

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
    cors: {
      allowHeaders: [
        "*", // This allows all headers for now to debug
      ],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowOrigins: [
        "http://localhost:3000",
        "https://dev.zotnfound.com",
        "https://zotnfound.com",
      ],
      allowCredentials: false,
    },
    authorizers: {
      Authorizer: {
        type: "lambda",
        function: new Function(stack, "Authorizer", {
          handler: "packages/functions/src/auth/authorizer.handler",
          environment: {
            FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
          },
          nodejs: {
            esbuild: {
              external: ["@aws-sdk/*", "farmhash"],
            },
          },
        }),
        // resultsCacheTtl: "30 seconds",
        identitySource: ["$request.header.Authorization"],
      },
    },
    defaults: {
      function: {
        bundle: {
          copyFiles: [
            {
              from: "packages/functions/src/emailTemplate", // Source path
              to: "emailTemplate", // Destination path in the bundle
            },
          ],
        },
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

          // for lambda authorizers
          FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
          RESEND_API_KEY: process.env.RESEND_API_KEY,
        },
      },
      authorizer: "Authorizer",
      authorizationType: "CUSTOM",
    },
    routes: {
      "OPTIONS /{proxy+}": {
        authorizer: "none",
        function: "packages/functions/src/server.handler",
      },
      "GET /items/{proxy+}": {
        authorizer: "none",
        function: "packages/functions/src/server.handler",
      },
      "GET /leaderboard/{proxy+}": {
        authorizer: "none",
        function: "packages/functions/src/server.handler",
      },
      $default: {
        authorizer: "Authorizer",
        function: "packages/functions/src/server.handler",
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  process.env.API_URL = api.url; // Set the API URL to be used by the frontend stack
  // localhost:3001
}
