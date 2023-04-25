import * as firebaseAdmin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: applicationDefault(),
  });
}

export { firebaseAdmin };