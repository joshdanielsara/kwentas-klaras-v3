import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'

let firebaseApp: App | null = null
let auth: Auth | null = null

function initializeFirebaseAdmin(): App {
  if (firebaseApp) {
    return firebaseApp
  }

  const existingApps = getApps()
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0]
    return firebaseApp
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  if (projectId && privateKey && clientEmail) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    })
    return firebaseApp
  }

  throw new Error(
    'Firebase Admin SDK initialization failed. Please provide:\n' +
    '  - FIREBASE_PROJECT_ID\n' +
    '  - FIREBASE_PRIVATE_KEY\n' +
    '  - FIREBASE_CLIENT_EMAIL'
  )
}

export function getFirebaseAdmin(): App {
  return initializeFirebaseAdmin()
}

export function getFirebaseAuth(): Auth {
  if (auth) {
    return auth
  }

  const app = getFirebaseAdmin()
  auth = getAuth(app)
  return auth
}
