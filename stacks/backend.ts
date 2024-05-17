import { StackContext, Api, EventBus, Bucket } from "sst/constructs";


export function BackendStack({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });


  const bucket = new Bucket(stack, "bucket");
 
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, bucket], // ensures that all API functions have access to the bus and bucket upon initialization
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
      $default: "packages/functions/src/server.default",
      "POST /image-url": "packages/functions/src/generate-image-url.handler"
    },
  });




  stack.addOutputs({
    ApiEndpoint: api.url,
    BucketName: bucket.bucketName, // declared as an output to be used by the frontend stack, not too sure if we need it since we are setting the BUCKET env variable in the frontend stack but I added it just in case
  });


  process.env.API_URL = api.url; // Set the API URL to be used by the frontend stack
  // localhost:3001
  process.env.BUCKET = bucket.bucketName; // Set the bucket name to be used by the frontend stack, Don't need to directly create a BUCKET env variable,
}


