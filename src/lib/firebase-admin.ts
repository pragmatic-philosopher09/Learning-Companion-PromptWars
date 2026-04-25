import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

/**
 * Server-side Firebase Admin initialization.
 * Uses GOOGLE_APPLICATION_CREDENTIALS or falls back to project ID.
 */
export function getAdminFirestore(): Firestore {
  if (!adminDb) {
    if (getApps().length === 0) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;

      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Use service account key JSON from env
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        adminApp = initializeApp({ credential: cert(serviceAccount), projectId });
      } else {
        // In Cloud Run, Application Default Credentials are available automatically
        adminApp = initializeApp({ projectId });
      }
    } else {
      adminApp = getApps()[0];
    }
    adminDb = getFirestore(adminApp);
  }
  return adminDb;
}
