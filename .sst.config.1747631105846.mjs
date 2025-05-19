import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/frontend.ts
import { StaticSite } from "sst/constructs";
function FrontendStack({ app, stack }) {
  const apiUrl = process.env.API_URL;
  let domainName;
  let domainAlias;
  if (app.stage === "prod") {
    domainName = "zotnfound.com";
    domainAlias = "www.zotnfound.com";
  } else if (app.stage === "dev") {
    domainName = "dev.zotnfound.com";
  } else if (app.stage.match(/^staging-(\d+)$/)) {
    domainName = `${app.stage}.zotnfound.com`;
  }
  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "pnpm run build",
    customDomain: {
      domainName,
      domainAlias,
      hostedZone: "zotnfound.com"
    },
    environment: {
      VITE_REACT_APP_AWS_BACKEND_URL: apiUrl,
      //https://805cgohzr0.execute-api.us-east-1.amazonaws.com/
      VITE_REACT_APP_API_KEY: process.env.VITE_REACT_APP_API_KEY,
      VITE_REACT_APP_AUTH_DOMAIN: process.env.VITE_REACT_APP_AUTH_DOMAIN,
      VITE_REACT_APP_PROJECT_ID: process.env.VITE_REACT_APP_PROJECT_ID,
      VITE_REACT_APP_STORAGE_BUCKET: process.env.VITE_REACT_APP_STORAGE_BUCKET,
      VITE_REACT_APP_MESSAGING_SENDER_ID: process.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
      VITE_REACT_APP_APP_ID: process.env.VITE_REACT_APP_APP_ID,
      VITE_REACT_APP_MEASUREMENT_ID: process.env.VITE_REACT_APP_MEASUREMENT_ID,
      VITE_REACT_APP_MAPBOX_DARK_URL: process.env.VITE_REACT_APP_MAPBOX_DARK_URL,
      VITE_REACT_APP_MAPBOX_LIGHT_URL: process.env.VITE_REACT_APP_MAPBOX_LIGHT_URL,
      VITE_REACT_APP_MAPBOX_ACCESS_TOKEN: process.env.VITE_REACT_APP_MAPBOX_ACCESS_TOKEN
    }
  });
  stack.addOutputs({
    WebEndpoint: web.customDomainUrl
  });
}
__name(FrontendStack, "FrontendStack");

// stacks/backend.ts
import { Api, EventBus, Bucket, Function } from "sst/constructs";
function BackendStack({ stack }) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10
    }
  });
  const bucket = new Bucket(stack, "bucket", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
      }
    ]
  });
  const api = new Api(stack, "api", {
    cors: {
      allowHeaders: [
        "*"
        // This allows all headers for now to debug
      ],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowOrigins: [
        "http://localhost:3000",
        "https://dev.zotnfound.com",
        "https://zotnfound.com"
      ],
      allowCredentials: false
    },
    authorizers: {
      Authorizer: {
        type: "lambda",
        function: new Function(stack, "Authorizer", {
          handler: "packages/functions/src/auth/authorizer.handler",
          environment: {
            FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT
          },
          nodejs: {
            esbuild: {
              external: ["@aws-sdk/*", "farmhash"]
            }
          }
        }),
        // resultsCacheTtl: "30 seconds",
        identitySource: ["$request.header.Authorization"]
      }
    },
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
          // for lambda authorizers
          FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
          RESEND_API_KEY: process.env.RESEND_API_KEY
        }
      },
      authorizer: "Authorizer",
      authorizationType: "CUSTOM"
    },
    routes: {
      "OPTIONS /{proxy+}": {
        authorizer: "none",
        function: "packages/functions/src/server.handler"
      },
      "GET /items/{proxy+}": {
        authorizer: "none",
        function: "packages/functions/src/server.handler"
      },
      "GET /leaderboard/{proxy+}": {
        authorizer: "none",
        function: "packages/functions/src/server.handler"
      },
      $default: {
        authorizer: "Authorizer",
        function: "packages/functions/src/server.handler"
      }
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  process.env.API_URL = api.url;
}
__name(BackendStack, "BackendStack");

// sst.config.ts
import dotenv from "dotenv-flow";
dotenv.config({
  silent: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
});
var sst_config_default = {
  config(_input) {
    return {
      name: "zotnfound",
      region: "us-east-1"
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    app.stack(BackendStack, { stackName: `${app.name}-${app.stage}-backend` }).stack(FrontendStack, { stackName: `${app.name}-${app.stage}-frontend` });
  }
};
export {
  sst_config_default as default
};
