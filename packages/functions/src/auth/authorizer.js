import admin from "../config/firebase-config.js";

export const handler = async (event) => {
  console.log("Authorizer Event:", {
    headers: event.headers,
    authHeader: event.headers?.Authorization || event.headers?.authorization,
  });

  try {
    // Get the JWT token from the Authorization header
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader) {
      return generatePolicy("user", "Deny", event.methodArn);
    }

    // Extract the token (remove 'Bearer ' prefix if present)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return generatePolicy("user", "Deny", event.methodArn);
    }

    // If verification successful, generate an Allow policy
    return generatePolicy(decodedToken.uid, "Allow", event.methodArn);
  } catch (error) {
    console.error("Authorization error:", error);
    return generatePolicy("user", "Deny", event.methodArn);
  }
};

// Helper function to generate the IAM policy
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
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
  };

  return authResponse;
};
