import * as admin from "firebase-admin";

// productionはCI/CDでしばらくは行わないのdえ、必要になったら復活させる。
// if (process.env.NODE_ENV === `production`) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   })
// } else {
//   const serviceAccount = require(`../../serviceAccountKey.json`)
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   })
// }
const serviceAccount = require("../../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore();
export const FieldValue = require("firebase-admin").firestore.FieldValue;
