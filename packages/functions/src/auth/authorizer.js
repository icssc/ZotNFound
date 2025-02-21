import admin from "../config/firebase-config.js";

const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      // Optional context to pass through
      stringKey: "value",
    },
  };
};

export const handler = async (event) => {
  console.log("Full Event:", JSON.stringify(event, null, 2));
  console.log("HTTP Method:", event.requestContext?.httpMethod);
  console.log("Resource:", event.methodArn);
  console.log("Headers:", JSON.stringify(event.headers, null, 2));

  // Always allow OPTIONS
  if (event.httpMethod === "OPTIONS") {
    console.log("Allowing OPTIONS request");
    return generatePolicy("user", "Allow", event.methodArn);
  }

  try {
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      console.log("No auth header found - denying request");
      return generatePolicy("user", "Deny", event.methodArn);
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    console.log("Token found, attempting verification");

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token verified:", decodedToken.uid);

    if (!decodedToken) {
      console.log("Token verification failed");
      return generatePolicy("user", "Deny", event.methodArn);
    }

    // Return Allow policy with the user's ID
    return generatePolicy(decodedToken.uid, "Allow", event.methodArn);
  } catch (error) {
    console.error("Authorization error:", error);
    return generatePolicy("user", "Deny", event.methodArn);
  }
};
