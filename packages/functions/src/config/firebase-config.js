import admin from "firebase-admin";

console.log(
  "Service Account:",
  process.env.FIREBASE_SERVICE_ACCOUNT?.substring(0, 50) + "..."
);

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log("Parsed Service Account project_id:", serviceAccount.project_id);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export default admin;
