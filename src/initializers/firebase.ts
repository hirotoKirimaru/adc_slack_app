import * as admin from "firebase-admin";

console.log("ProcessEnv");
console.log(process.env.SLACK_BOT_TOKEN);
console.log(process.env.SLACK_SIGNING_SECRET);

if (process.env.NODE_ENV === `production`) {
  console.log("あいうえお");
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
} else {
  console.log("かきくけこ");
  const serviceAccount = require(`../../serviceAccountKey.json`)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const firestore = admin.firestore();
export const FieldValue = require("firebase-admin").firestore.FieldValue;
