import { StackContext, StaticSite } from "sst/constructs";

export function FrontendStack({ app, stack }: StackContext) {
  const apiUrl = process.env.API_URL as string; // Ensure API_URL is treated as a string

  let domainName: string;
  let domainAlias: string | undefined;
  if (app.stage === "prod") {
    domainName = "zotnfound.com";
    domainAlias = "www.zotnfound.com";
  } else if (app.stage === "dev") {
    domainName = "dev.zotnfound.com";
  } else if (app.stage.match(/^staging-(\d+)$/)) {
    // check if stage is like staging-###
    domainName = `${app.stage}.zotnfound.com`;
  }
  // } else {
  //   throw new Error("Invalid stage");
  // }

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "pnpm run build",
    customDomain: {
      domainName: domainName,
      domainAlias: domainAlias,
      hostedZone: "zotnfound.com",
    },
    environment: {
      VITE_REACT_APP_AWS_BACKEND_URL: apiUrl, //https://805cgohzr0.execute-api.us-east-1.amazonaws.com/
      VITE_REACT_APP_API_KEY: process.env.VITE_REACT_APP_API_KEY!,
      VITE_REACT_APP_AUTH_DOMAIN: process.env.VITE_REACT_APP_AUTH_DOMAIN!,
      VITE_REACT_APP_PROJECT_ID: process.env.VITE_REACT_APP_PROJECT_ID!,
      VITE_REACT_APP_STORAGE_BUCKET: process.env.VITE_REACT_APP_STORAGE_BUCKET!,
      VITE_REACT_APP_MESSAGING_SENDER_ID:
        process.env.VITE_REACT_APP_MESSAGING_SENDER_ID!,
      VITE_REACT_APP_APP_ID: process.env.VITE_REACT_APP_APP_ID!,
      VITE_REACT_APP_MEASUREMENT_ID: process.env.VITE_REACT_APP_MEASUREMENT_ID!,
    },
  });
  
  stack.addOutputs({
    WebEndpoint: web.customDomainUrl,
  });
}
