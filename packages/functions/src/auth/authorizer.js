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

  // Always allow OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return generatePolicy("user", "Allow", event.methodArn);
  }

  try {
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
  
    // reduntant check
    if (!authHeader) {
      return generatePolicy("user", "Deny", event.methodArn);
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return generatePolicy("user", "Deny", event.methodArn);
    }

    // Return Allow policy with the user's ID
    return generatePolicy(decodedToken.uid, "Allow", event.methodArn);
  } catch (error) {
    console.error("Authorization error:", error);
    return generatePolicy("user", "Deny", event.methodArn);
  }
};
