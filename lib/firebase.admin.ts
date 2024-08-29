import admin, { type ServiceAccount } from "firebase-admin"
import serviceAccount from "@/side-project-service-account.json"
import { getFirestore } from "firebase-admin/firestore"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  })

  const db = getFirestore(getApp())

  db.settings({
    ignoreUndefinedProperties: true,
  })
}

function getApp() {
  return admin.apps[0] as admin.app.App
}

const firebaseApp = getApp()

export const db = getFirestore(firebaseApp, "avp-movies")
